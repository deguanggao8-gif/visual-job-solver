export type FormState = "idle" | "submitting" | "success" | "error";
export type ChallengeStatus = "loading" | "ready" | "verified" | "expired" | "error";

export type ChallengeState = {
  status: ChallengeStatus;
  token: string;
};

export type ChallengeEvent =
  | { type: "READY" }
  | { type: "VERIFIED"; token: string }
  | { type: "EXPIRED" }
  | { type: "FAILED" }
  | { type: "RESET" };

export const initialChallengeState: ChallengeState = { status: "loading", token: "" };

export function challengeReducer(_state: ChallengeState, event: ChallengeEvent): ChallengeState {
  switch (event.type) {
    case "READY":
    case "RESET":
      return { status: "ready", token: "" };
    case "VERIFIED":
      return event.token.trim()
        ? { status: "verified", token: event.token }
        : { status: "error", token: "" };
    case "EXPIRED":
      return { status: "expired", token: "" };
    case "FAILED":
      return { status: "error", token: "" };
  }
}

export function canSubmitAssessment(formState: FormState, challenge: ChallengeState) {
  return formState !== "submitting" && challenge.status === "verified" && challenge.token.length > 0;
}

export const assessmentErrorMessage = (code: string) => {
  switch (code) {
    case "VALIDATION_FAILED":
      return "Please review the form fields and complete the anti-abuse check before submitting.";
    case "CHALLENGE_FAILED":
      return "The anti-abuse check could not be verified. Please complete it again.";
    case "RATE_LIMITED":
      return "Too many requests were made from this connection. Please wait and try again later.";
    case "DELIVERY_FAILED":
      return "The mail service did not confirm acceptance. Your request has not been marked as received.";
    case "SERVICE_NOT_CONFIGURED":
      return "The secure submission service is temporarily unavailable. No receipt is claimed.";
    case "NETWORK_ERROR":
    default:
      return "A network error prevented confirmation. Your request may not have been delivered.";
  }
};
