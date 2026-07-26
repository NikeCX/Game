/** Small caption badge used alongside MatrixGrid to tell the player where to look during a hint. */
export default function HighlightOverlay({ label }) {
  if (!label) return null;
  return <div className="highlight-overlay-label">{label}</div>;
}
