import MatrixGrid from '../matrix/MatrixGrid';
import AnimatedExample from './AnimatedExample';

export default function RuleFindingPanel({ puzzle, blurb }) {
  const ruleStep = puzzle.explanation.steps.find((s) => s.stepType === 'rule-finding');
  const highlightCells = ruleStep?.highlightCells ?? [
    [2, 0],
    [2, 1],
    [2, 2],
  ];

  return (
    <AnimatedExample stepKey="rule-finding">
      <p className="tutorial-panel__blurb">{blurb}</p>
      <MatrixGrid grid={puzzle.grid} highlightCells={highlightCells} />
      <p className="tutorial-panel__rule">{puzzle.explanation.summary}</p>
    </AnimatedExample>
  );
}
