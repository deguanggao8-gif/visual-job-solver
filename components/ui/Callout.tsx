export type CalloutTone = "info" | "limit" | "scope";

export default function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: CalloutTone;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`callout callout--${tone}`} role="note">
      {title && <span className="callout__title">{title}</span>}
      <div>{children}</div>
    </div>
  );
}
