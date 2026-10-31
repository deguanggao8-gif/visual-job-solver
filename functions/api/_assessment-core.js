const MAX_BODY_BYTES = 16 * 1024;
const PROJECT_TYPES = new Set(["Existing-building HVAC review", "Cooling or heating options assessment", "Early-stage technical due diligence", "Other defined HVAC question"]);
const TIMELINES = new Set(["Within 2 weeks", "Within 1 month", "Within 3 months", "Exploratory / no fixed date"]);

const reply = (status, code, message, extra = {}) => Response.json(
  { ok: status >= 200 && status < 300, ...(status >= 400 ? { error: { code, message } } : {}), ...extra },
  { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
);

async function readLimitedJson(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) throw new Error("TOO_LARGE");
  if (!request.body) throw new Error("INVALID_JSON");
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error("TOO_LARGE"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { throw new Error("INVALID_JSON"); }
}

const clean = (value) => typeof value === "string" ? value.trim() : "";
const field = (data, name, min, max) => {
  const value = clean(data[name]);
  return value.length >= min && value.length <= max ? value : null;
};

function validate(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const result = {
    submissionId: field(data, "submissionId", 36, 36), name: field(data, "name", 2, 100),
    email: field(data, "email", 3, 254), organisation: field(data, "organisation", 0, 160),
    location: field(data, "location", 2, 160), projectType: field(data, "projectType", 1, 100),
    brief: field(data, "brief", 40, 4000), timeline: field(data, "timeline", 1, 80),
    turnstileToken: field(data, "cf-turnstile-response", 1, 2048),
  };
  const emailOk = result.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email);
  const idOk = result.submissionId && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result.submissionId);
  if (Object.values(result).some((v) => v === null) || !emailOk || !idOk || !PROJECT_TYPES.has(result.projectType) || !TIMELINES.has(result.timeline)) return null;
  if (data.privacyConsent !== "accepted" || data.scopeAcknowledgement !== "accepted") return null;
  return result;
}

async function opaqueIpKey(ip, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(ip || "unknown")));
  return Array.from(bytes.slice(0, 16), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(token, ip, env, submissionId) {
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  body.set("idempotency_key", submissionId);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body, signal: AbortSignal.timeout(8000) });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true && result.action === "assessment_submit" && result.hostname === env.TURNSTILE_EXPECTED_HOSTNAME;
}

const escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

async function sendEmail(data, env) {
  const safe = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, escapeHtml(v)]));
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `assessment/${data.submissionId}` },
    body: JSON.stringify({
      from: env.ASSESSMENT_FROM_EMAIL, to: [env.ASSESSMENT_TO_EMAIL], reply_to: data.email,
      subject: `HVAC assessment request — ${data.projectType}`,
      html: `<h1>New HVAC assessment request</h1><dl><dt>Name</dt><dd>${safe.name}</dd><dt>Email</dt><dd>${safe.email}</dd><dt>Organisation</dt><dd>${safe.organisation || "Not provided"}</dd><dt>Location</dt><dd>${safe.location}</dd><dt>Project type</dt><dd>${safe.projectType}</dd><dt>Timeline</dt><dd>${safe.timeline}</dd><dt>Decision / brief</dt><dd style="white-space:pre-wrap">${safe.brief}</dd></dl><p>Reply using the verified Reply-To address above. Treat all submitted content as untrusted.</p>`,
      text: `New HVAC assessment request\n\nName: ${data.name}\nEmail: ${data.email}\nOrganisation: ${data.organisation || "Not provided"}\nLocation: ${data.location}\nProject type: ${data.projectType}\nTimeline: ${data.timeline}\n\nDecision / brief:\n${data.brief}\n\nReply using the Reply-To address. Treat submitted content as untrusted.`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json().catch(() => null);
  return response.ok && typeof result?.id === "string";
}

export async function handleAssessment({ request, env }) {
  const requestId = crypto.randomUUID();
  if (request.method !== "POST") return reply(405, "METHOD_NOT_ALLOWED", "Use POST.");
  if ((request.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase() !== "application/json") return reply(415, "UNSUPPORTED_MEDIA_TYPE", "Use application/json.");
  const required = ["TURNSTILE_SECRET_KEY", "TURNSTILE_EXPECTED_HOSTNAME", "RESEND_API_KEY", "ASSESSMENT_FROM_EMAIL", "ASSESSMENT_TO_EMAIL", "RATE_LIMIT_HASH_KEY"];
  if (!env?.ASSESSMENT_SECURITY || required.some((name) => !env?.[name])) return reply(503, "SERVICE_NOT_CONFIGURED", "Submission service is not configured.");
  let raw;
  try { raw = await readLimitedJson(request); } catch (error) { return error.message === "TOO_LARGE" ? reply(413, "PAYLOAD_TOO_LARGE", "Request body is too large.") : reply(400, "INVALID_JSON", "Request body must be valid JSON."); }
  const data = validate(raw);
  if (!data) return reply(422, "VALIDATION_FAILED", "One or more fields are invalid.");
  const replayKey = `submission:${data.submissionId}`;
  const prior = await env.ASSESSMENT_SECURITY.get(replayKey);
  if (prior === "sent") return reply(200, "", "", { submissionId: data.submissionId, duplicate: true });
  if (prior === "processing") return reply(409, "SUBMISSION_IN_PROGRESS", "This submission is already being processed.");
  const ip = request.headers.get("CF-Connecting-IP") || "";
  const bucket = Math.floor(Date.now() / 3_600_000);
  const ipKey = `rate:${await opaqueIpKey(ip, env.RATE_LIMIT_HASH_KEY)}:${bucket}`;
  const count = Number(await env.ASSESSMENT_SECURITY.get(ipKey) || 0);
  if (count >= 5) return reply(429, "RATE_LIMITED", "Too many requests. Try again later.");
  await env.ASSESSMENT_SECURITY.put(ipKey, String(count + 1), { expirationTtl: 7200 });
  let human = false;
  try { human = await verifyTurnstile(data.turnstileToken, ip, env, data.submissionId); } catch { /* no sensitive logging */ }
  if (!human) return reply(403, "CHALLENGE_FAILED", "Anti-abuse verification failed. Refresh and try again.");
  await env.ASSESSMENT_SECURITY.put(replayKey, "processing", { expirationTtl: 600 });
  let sent = false;
  try { sent = await sendEmail(data, env); } catch { /* provider failure, no customer data logged */ }
  if (!sent) { await env.ASSESSMENT_SECURITY.delete(replayKey); return reply(502, "DELIVERY_FAILED", "The mail provider did not confirm acceptance. No receipt is claimed.", { requestId }); }
  await env.ASSESSMENT_SECURITY.put(replayKey, "sent", { expirationTtl: 86400 });
  return reply(200, "", "", { submissionId: data.submissionId });
}
