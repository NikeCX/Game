import AnswerOptions from '../matrix/AnswerOptions';
import AnimatedExample from './AnimatedExample';

export default function EliminationPanel({ puzzle, blurb }) {
  const correctOption = puzzle.options.find((o) => o.isCorrect);
  const eliminationStep = puzzle.explanation.steps.find((s) => s.stepType === 'elimination');

  return (
    <AnimatedExample stepKey="elimination">
      <p className="tutorial-panel__blurb">{blurb}</p>
      <AnswerOptions options={puzzle.options} selectedId={correctOption.id} revealedCorrectId={correctOption.id} onSelect={() => {}} disabled />
      <p className="tutorial-panel__rule">{eliminationStep?.text}</p>
    </AnimatedExample>
  );
}
