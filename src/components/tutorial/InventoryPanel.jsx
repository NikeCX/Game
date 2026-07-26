import MatrixGrid from '../matrix/MatrixGrid';
import AnimatedExample from './AnimatedExample';

export default function InventoryPanel({ puzzle, blurb }) {
  return (
    <AnimatedExample stepKey="inventory">
      <p className="tutorial-panel__blurb">{blurb}</p>
      <MatrixGrid grid={puzzle.grid} hideAnswer={false} />
      <p className="tutorial-panel__note">Notice: shapes, sizes, colors, counts, and rotation all vary — but not every attribute matters for this rule.</p>
    </AnimatedExample>
  );
}
