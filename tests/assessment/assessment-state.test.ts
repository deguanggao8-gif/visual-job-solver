import test from "node:test";
import assert from "node:assert/strict";
import { assessmentErrorMessage, canSubmitAssessment, challengeReducer, initialChallengeState } from "../../components/assessment/assessment-state";

test("submission stays disabled until Turnstile supplies a token", () => {
  const ready = challengeReducer(initialChallengeState, { type: "READY" });
  assert.equal(canSubmitAssessment("idle", ready), false);
  const verified = challengeReducer(ready, { type: "VERIFIED", token: "token-123" });
  assert.equal(canSubmitAssessment("idle", verified), true);
  assert.equal(canSubmitAssessment("submitting", verified), false);
});

test("expired and failed challenges clear the token and can be verified again", () => {
  const verified = challengeReducer(initialChallengeState, { type: "VERIFIED", token: "token-123" });
  const expired = challengeReducer(verified, { type: "EXPIRED" });
  assert.equal(canSubmitAssessment("idle", expired), false);
  const failed = challengeReducer(verified, { type: "FAILED" });
  assert.equal(canSubmitAssessment("idle", failed), false);
  const retried = challengeReducer(failed, { type: "VERIFIED", token: "token-456" });
  assert.equal(canSubmitAssessment("idle", retried), true);
});

test("structured API error codes map to safe, distinct messages", () => {
  const codes = ["VALIDATION_FAILED", "CHALLENGE_FAILED", "RATE_LIMITED", "DELIVERY_FAILED", "SERVICE_NOT_CONFIGURED", "NETWORK_ERROR"];
  const messages = codes.map(assessmentErrorMessage);
  assert.equal(new Set(messages).size, codes.length);
  assert.equal(messages.some((message) => /secret|stack|api key/i.test(message)), false);
});
