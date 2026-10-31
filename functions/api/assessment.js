import { handleAssessment } from "./_assessment-core.js";

export const onRequest = (context) => handleAssessment(context);
