import Cell from '../shapes/Cell';

/**
 * Renders the 3x3 puzzle grid. Position (2,2) always shows the blank "?"
 * placeholder regardless of what's actually stored there.
 * @param {{ grid: import('../../data/puzzleTypes.js').Cell[][], highlightCells?: [number,number][], hideAnswer?: boolean }} props
 */
export default function MatrixGrid({ grid, highlightCells = [], hideAnswer = true }) {
  return (
    <div className="matrix-grid">
      {grid.map((row, r) =>
        row.map((cellData, c) => {
          const isAnswerSlot = hideAnswer && r === 2 && c === 2;
          const isHighlighted = highlightCells.some(([hr, hc]) => hr === r && hc === c);
          return <Cell key={`${r}-${c}`} cell={cellData} blank={isAnswerSlot} highlighted={isHighlighted} />;
        })
      )}
    </div>
  );
}
