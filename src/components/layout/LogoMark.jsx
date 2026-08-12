const CELLS = [
  { x: 0, y: 0, color: '#3F5D3A' },
  { x: 1, y: 0, color: '#3F5D3A' },
  { x: 2, y: 0, color: '#3F5D3A' },
  { x: 0, y: 1, color: '#3F5D3A' },
  { x: 1, y: 1, color: '#A6532E' },
  { x: 2, y: 1, color: '#DCE4D6' },
  { x: 0, y: 2, color: '#3F5D3A' },
  { x: 1, y: 2, color: '#DCE4D6' },
  { x: 2, y: 2, color: '#3F5D3A' },
];

const CELL_SIZE = 8;
const GAP = 2;
const RADIUS = 1.5;

/** The mosaic-grid brand mark used across Matrix Academy's marketing site and app. */
export default function LogoMark({ size = 28, className }) {
  const step = CELL_SIZE + GAP;
  const viewBoxSize = step * 3 - GAP;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className={className} aria-hidden="true">
      {CELLS.map(({ x, y, color }) => (
        <rect key={`${x}-${y}`} x={x * step} y={y * step} width={CELL_SIZE} height={CELL_SIZE} rx={RADIUS} fill={color} />
      ))}
    </svg>
  );
}
