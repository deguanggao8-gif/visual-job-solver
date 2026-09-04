/**
 * Renders pre-converted Markdown HTML from the frozen content file.
 */
export default function Prose({ html }: { html: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
