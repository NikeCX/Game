import { useState } from 'react';
import { usePuzzle } from '../../hooks/usePuzzle';
import { useGameStore } from '../../store/useGameStore';
import { RULES } from '../../data/rules';
import Header from '../layout/Header';
import MatrixGrid from '../matrix/MatrixGrid';
import AnswerOptions from '../matrix/AnswerOptions';
import HintPanel from './HintPanel';
import FeedbackBanner from './FeedbackBanner';
import PulseFeedback from '../feedback/PulseFeedback';
import { fireConfetti } from '../feedback/Confetti';

const HINT_HIGHLIGHT_CELLS = [
  [2, 0],
  [2, 1],
  [0, 2],
  [1, 2],
];

export default function PracticeScreen({ ruleId, onNavigate }) {
  const rule = RULES[ruleId];
  const initialDifficulty = useGameStore((s) => s.rules[ruleId].practiceDifficulty);
  const recordPracticeAnswer = useGameStore((s) => s.recordPracticeAnswer);

  const { puzzle, selectedId, revealedCorrectId, hintLevel, setHintLevel, next, answer } = usePuzzle(ruleId, initialDifficulty);
  const [lastCorrect, setLastCorrect] = useState(null);

  function handleSelect(optionId) {
    const isCorrect = answer(optionId);
    if (isCorrect === null) return;
    recordPracticeAnswer(ruleId, { correct: isCorrect, difficulty: puzzle.difficulty, hintsUsed: hintLevel });
    setLastCorrect(isCorrect);
    if (isCorrect) fireConfetti();
  }

  function handleNext() {
    setLastCorrect(null);
    const freshDifficulty = useGameStore.getState().rules[ruleId].practiceDifficulty;
    next(freshDifficulty);
  }

  const highlightCells = hintLevel >= 2 ? HINT_HIGHLIGHT_CELLS : [];

  return (
    <div className="screen practice-screen">
      <Header onHome={() => onNavigate('home')} title={`Practice: ${rule.name}`} />
      <div className="practice-screen__body">
        <div className="practice-screen__meta">
          <span className="difficulty-pip" title="Difficulty">
            {'●'.repeat(puzzle.difficulty)}
            {'○'.repeat(5 - puzzle.difficulty)}
          </span>
        </div>
        <MatrixGrid grid={puzzle.grid} highlightCells={highlightCells} />
        <PulseFeedback state={lastCorrect}>
          <AnswerOptions options={puzzle.options} selectedId={selectedId} revealedCorrectId={revealedCorrectId} onSelect={handleSelect} disabled={!!revealedCorrectId} />
        </PulseFeedback>
        {!revealedCorrectId && <HintPanel hintLevel={hintLevel} onReveal={() => setHintLevel((h) => Math.min(3, h + 1))} rule={rule} puzzle={puzzle} />}
        {revealedCorrectId && <FeedbackBanner isCorrect={lastCorrect} explanation={puzzle.explanation} onNext={handleNext} />}
      </div>
    </div>
  );
}
