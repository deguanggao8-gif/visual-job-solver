# Phase B inquiry system — operator runbook

Status: implementation-ready, but **not production-ready until every control-plane and end-to-end check below is complete**. The existence of `contact@visualjobsolver.com` does not prove that the mailbox can receive mail.

## Architecture and response contract

The static Next.js export remains in `out/`. Cloudflare Pages maps `functions/api/assessment.js` to `POST /api/assessment`; `public/_routes.json` limits Function invocation to that route. The Function accepts JSON up to 16 KiB, validates every field, validates Turnstile server-side, applies an hourly hashed-IP limit in KV, uses a client UUID for replay/idempotency protection, and calls Resend with the same idempotency key. It returns `{ "ok": true }` only after Resend returns an accepted email ID. Provider failure returns `DELIVERY_FAILED`; no delivery is claimed.

KV limits are abuse friction, not a perfectly atomic global counter. Turnstile, one-time tokens, the replay record, and Resend idempotency are independent layers. Do not log request bodies, email addresses, names, raw IP addresses, tokens, or provider credentials.

## Required names

Public build variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ASSESSMENT_ENDPOINT`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

All `NEXT_PUBLIC_*` values are embedded into the static client bundle by
`next build`; they are build-time settings, not runtime Function variables.
Changing them in Cloudflare requires a new build/deployment to affect the
rendered form. `NEXT_PUBLIC_ASSESSMENT_ENDPOINT` should remain the same-origin
path `/api/assessment` for the Pages Functions deployment.

Encrypted Cloudflare secrets:

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `RATE_LIMIT_HASH_KEY`

Non-secret Function variables:

- `TURNSTILE_EXPECTED_HOSTNAME`
- `ASSESSMENT_FROM_EMAIL`
- `ASSESSMENT_TO_EMAIL`

KV namespace binding:

- `ASSESSMENT_SECURITY`

Set `ASSESSMENT_TO_EMAIL` to `contact@visualjobsolver.com`. Never place secret values in the repository or in `NEXT_PUBLIC_*` variables. Use distinct preview and production secrets/widgets/KV namespaces.

## Resend and DNS

1. In Resend, add the intended sending domain or a dedicated sending subdomain. A subdomain isolates transactional reputation.
2. Copy the exact DNS records Resend shows. In Cloudflare DNS, add the DKIM and SPF/return-path records exactly as displayed. Do not invent record names or merge SPF records without checking the existing DNS policy.
3. For any mail-related CNAME shown by Resend, follow Resend's current proxying instruction; mail authentication records generally must resolve exactly as supplied.
4. Wait for DNS propagation, then click Verify in Resend. Do not configure `ASSESSMENT_FROM_EMAIL` until the dashboard shows sending capability verified.
5. Create a narrowly scoped sending API key and store it only as `RESEND_API_KEY` in Cloudflare encrypted secrets.
6. Independently confirm that `contact@visualjobsolver.com` is an operational mailbox or forwarding target by sending a normal external test and replying from it. Resend sender-domain verification does not verify recipient mailbox operation.

## Turnstile

1. Create separate Turnstile widgets for preview/testing and production.
2. Restrict the production widget to the exact production hostname. Put its public site key in the production build variable and its secret key in the encrypted Function secret.
3. Set `TURNSTILE_EXPECTED_HOSTNAME` to that exact hostname. The Function also requires action `assessment_submit`.
4. For local automated tests, use mocks or Cloudflare's published test keys only. Never represent a test-key result as a production end-to-end pass.

## Cloudflare Pages

1. Keep build output directory `out` and ensure the root `functions/` directory is included in the deployment source.
2. Create a KV namespace and bind it to the Function as `ASSESSMENT_SECURITY`. Use a different namespace for preview.
3. Add all variables and encrypted secrets in **Settings → Variables and Secrets** for the correct environment before deploying.
4. Keep preview branch control set to **None**, or explicitly exclude `phase-b-inquiry-system`, before any push. No branch has been pushed by this work.
5. Configure Functions to fail closed if the plan/runtime offers that choice. Confirm `/api/assessment` is the only included Function route.

## Real end-to-end acceptance

1. Complete the DNS, mailbox, Turnstile, variables, secrets and KV steps above in a controlled environment.
2. Submit a unique, clearly labelled test inquiry through the rendered form. Confirm the UI reports success only after the API returns `ok: true`.
3. In Resend, confirm the request was accepted and inspect its delivery event. In `contact@visualjobsolver.com`, confirm the message arrived with all expected fields and no HTML injection.
4. Reply from the mailbox and confirm the reply is addressed to the submitter via `Reply-To`; do not click or trust submitted content automatically.
5. Submit the same request ID twice and confirm one provider email. Submit invalid JSON, an oversized body, invalid fields, a reused/expired Turnstile token, and more than five attempts in an hour; confirm the structured 4xx responses.
6. Temporarily use an invalid mail credential in the controlled environment and confirm the form shows failure and never claims receipt. Restore the secret afterward.
7. Verify desktop and mobile layouts, keyboard operation, visible focus, challenge reset after failure, privacy copy, and successful resubmission with a fresh token.

Production readiness requires evidence for all seven steps. An API `200` means Resend accepted the send request; inbox arrival must still be verified separately.
