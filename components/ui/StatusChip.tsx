import type { SelectorStatus } from "@/lib/types";

const META: Record<
  SelectorStatus,
  { label: string; tone: string }
> = {
  request_information: { label: "More information needed", tone: "info" },
  outside_selector_scope: { label: "Outside this guide’s scope", tone: "scope" },
  insufficient_evidence: {
    label: "Evidence reviewed — no single tool determined",
    tone: "report",
  },
};

export default function StatusChip({ status }: { status: SelectorStatus }) {
  const meta = META[status];
  return <span className={`chip chip--${meta.tone}`}>{meta.label}</span>;
}
