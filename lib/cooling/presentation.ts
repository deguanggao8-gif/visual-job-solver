import type { CoolingOption, CoolingResult } from "./types";

/** Presentation only: uses evaluated outcomes, never changes feasibility. */
export function nextStep(option: CoolingOption): string {
  if (option.technical_fit === "blocked") return "Kläre zunächst, ob sich die angegebene Einschränkung ändern lässt, bevor du diese Option weiterverfolgst.";
  if (option.technical_fit === "review" || option.technical_fit === "poor_fit")
    return "Bitte um eine Prüfung deiner Situation, um den möglichen Installationsweg zu klären. Fotos von Fenster und Außenbereich können helfen.";
  if (option.flags.includes("approval_required") || option.flags.includes("approval_check"))
    return "Kläre vor der Geräteauswahl die erforderliche Zustimmung der Eigentümer oder Verwaltung.";
  if (option.practical_fit === "budget_mismatch")
    return "Hole ein vollständiges Angebot einschließlich Zubehör und Installation ein, bevor du dich entscheidest.";
  if (option.category === "monoblock")
    return "Prüfe vor dem Kauf eine passende Fensterabdichtung und den Abluftweg für das konkrete Gerät.";
  if (option.category === "portable_split")
    return "Gleiche Außenstandort und Leitungsführung mit der Installationsanleitung des konkreten Modells ab.";
  return "Lass Außenstandort und Leitungsführung von einem qualifizierten Fachbetrieb prüfen.";
}

export function personalizedSummary(result: CoolingResult): string[] {
  const candidates = result.options.filter(o => ["suitable", "possible"].includes(o.technical_fit));
  const blocked = result.options.filter(o => o.technical_fit === "blocked");
  const review = result.options.filter(o => ["review", "poor_fit"].includes(o.technical_fit));
  const budget = candidates.filter(o => o.practical_fit === "budget_mismatch");
  const names = (options: CoolingOption[]) => options.map(o => o.title).join(" und ");
  const sentences = [candidates.length
    ? "Aus Sicht der Installation lohnt sich die nähere Prüfung dieser Optionen: " + names(candidates) + "."
    : "Nach deinen Angaben lässt sich derzeit keine übliche Installationsmöglichkeit bestätigen."];
  if (result.constraint_conflict) sentences.push(result.conflict_reasons.map(reason => reason.replace(/\.$/, "")).join("; ") + ".");
  else if (blocked.length) sentences.push("Unter den angegebenen Einschränkungen derzeit nicht umsetzbar: " + names(blocked) + ".");
  else if (review.length) sentences.push("Der Installationsweg ist noch zu klären bei: " + names(review) + ".");
  else sentences.push("Dies sind mögliche Lösungsarten; Zustimmungen und modellspezifische Installationsbedingungen müssen noch geprüft werden.");
  if (budget.length) sentences.push("Dein Budget reicht möglicherweise nicht für die gesamte Lösung bei: " + names(budget) + ".");
  sentences.push(result.constraint_conflict || (!candidates.length && review.length)
    ? "Lass als Nächstes die Fensteröffnung und die mögliche Aufstellung im Außenbereich prüfen."
    : "Nächster Schritt: " + nextStep(candidates.find(o => o.flags.includes("approval_required") || o.flags.includes("approval_check")) ?? candidates[0]));
  return sentences;
}
