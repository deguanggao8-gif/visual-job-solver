import test from "node:test";
import assert from "node:assert/strict";
import { handleAssessment } from "../../functions/api/_assessment-core.js";

class MemoryKv {
  values = new Map<string, string>();
  get(key: string) { return Promise.resolve(this.values.get(key) ?? null); }
  put(key: string, value: string) { this.values.set(key, value); return Promise.resolve(); }
  delete(key: string) { this.values.delete(key); return Promise.resolve(); }
}

const valid = {
  submissionId: "84f2445c-1fa6-4dca-9d6c-a22fc2b1eaf0", name: "Ada Lovelace", email: "ada@example.com",
  organisation: "Example", location: "Madrid", projectType: "Existing-building HVAC review",
  brief: "We need to compare viable replacement options for an existing office HVAC system.",
  timeline: "Within 1 month", privacyConsent: "accepted", scopeAcknowledgement: "accepted",
  "cf-turnstile-response": "test-token",
};
const env = () => ({ ASSESSMENT_SECURITY: new MemoryKv(), TURNSTILE_SECRET_KEY: "secret", TURNSTILE_EXPECTED_HOSTNAME: "visualjobsolver.com", RESEND_API_KEY: "key", ASSESSMENT_FROM_EMAIL: "Visual Job Solver <inquiries@visualjobsolver.com>", ASSESSMENT_TO_EMAIL: "contact@visualjobsolver.com", RATE_LIMIT_HASH_KEY: "local-test-key" });
const request = (body: unknown = valid, headers = { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.10" }) => new Request("https://visualjobsolver.com/api/assessment", { method: "POST", headers, body: JSON.stringify(body) });

test("rejects non-POST and non-JSON requests", async () => {
  assert.equal((await handleAssessment({ request: new Request("https://example.com", { method: "GET" }), env: env() })).status, 405);
  assert.equal((await handleAssessment({ request: new Request("https://example.com", { method: "POST", body: "x" }), env: env() })).status, 415);
});

test("fails closed when required bindings are absent", async () => {
  assert.equal((await handleAssessment({ request: request(), env: {} })).status, 503);
});

test("validates payload fields and body size", async () => {
  assert.equal((await handleAssessment({ request: request({ ...valid, email: "invalid" }), env: env() })).status, 422);
  const huge = request({ ...valid, brief: "x".repeat(17000) });
  assert.equal((await handleAssessment({ request: huge, env: env() })).status, 413);
});

test("returns success only after Turnstile and Resend confirm acceptance", async () => {
  const original = globalThis.fetch;
  let resendCalls = 0;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("siteverify")) return Response.json({ success: true, action: "assessment_submit", hostname: "visualjobsolver.com" });
    resendCalls += 1;
    return Response.json({ id: "email_123" });
  };
  try {
    const bindings = env();
    const response = await handleAssessment({ request: request(), env: bindings });
    assert.equal(response.status, 200);
    assert.equal(resendCalls, 1);
    const duplicate = await handleAssessment({ request: request(), env: bindings });
    assert.equal(duplicate.status, 200);
    assert.equal(resendCalls, 1);
  } finally { globalThis.fetch = original; }
});

test("does not claim receipt when Turnstile or mail delivery fails", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => String(input).includes("siteverify")
    ? Response.json({ success: true, action: "assessment_submit", hostname: "visualjobsolver.com" })
    : Response.json({ message: "provider failure" }, { status: 500 });
  try {
    const response = await handleAssessment({ request: request(), env: env() });
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error.code, "DELIVERY_FAILED");
  }
  finally { globalThis.fetch = original; }
});

test("returns precise validation and challenge error codes", async () => {
  const invalid = await handleAssessment({ request: request({ ...valid, "cf-turnstile-response": "" }), env: env() });
  assert.equal(invalid.status, 422);
  assert.equal((await invalid.json()).error.code, "VALIDATION_FAILED");
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ success: false });
  try {
    const challenged = await handleAssessment({ request: request(), env: env() });
    assert.equal(challenged.status, 403);
    assert.equal((await challenged.json()).error.code, "CHALLENGE_FAILED");
  } finally { globalThis.fetch = original; }
});

test("diagnostic logs contain only approved fields and no sensitive values", async () => {
  const originalFetch = globalThis.fetch;
  const originalLog = console.log;
  const logs: string[] = [];
  console.log = (...args: unknown[]) => { logs.push(args.map(String).join(" ")); };
  globalThis.fetch = async (input) => String(input).includes("siteverify")
    ? Response.json({ success: true, action: "assessment_submit", hostname: "visualjobsolver.com" })
    : Response.json({ message: "provider failure" }, { status: 500 });
  try {
    await handleAssessment({ request: request(), env: env() });
    assert.equal(logs.length, 1);
    const event = JSON.parse(logs[0]);
    assert.deepEqual(Object.keys(event).sort(), ["durationMs", "errorCode", "requestId", "stage", "status"]);
    const serialized = JSON.stringify(event);
    for (const sensitive of [valid.email, valid.brief, "203.0.113.10", "test-token", "secret", "local-test-key"]) {
      assert.equal(serialized.includes(sensitive), false);
    }
  } finally {
    globalThis.fetch = originalFetch;
    console.log = originalLog;
  }
});

test("rate limits repeated attempts without storing the raw IP", async () => {
  const bindings = env();
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ success: false });
  try {
    for (let index = 0; index < 5; index += 1) {
      const body = { ...valid, submissionId: `84f2445c-1fa6-4dca-9d6c-a22fc2b1ea${index}0` };
      assert.equal((await handleAssessment({ request: request(body), env: bindings })).status, 403);
    }
    const limited = { ...valid, submissionId: "84f2445c-1fa6-4dca-9d6c-a22fc2b1eaa0" };
    assert.equal((await handleAssessment({ request: request(limited), env: bindings })).status, 429);
    assert.equal([...bindings.ASSESSMENT_SECURITY.values.keys()].some((key) => key.includes("203.0.113.10")), false);
  } finally { globalThis.fetch = original; }
});
