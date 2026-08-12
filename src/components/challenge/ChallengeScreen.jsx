import { useState, useCallback, useRef } from 'react';
import { generatePuzzle } from '../../generators/puzzleFactory';
import { useTimer } from '../../hooks/useTimer';
import { useAdaptiveDifficulty } from '../../hooks/useAdaptiveDifficulty';
import { useGameStore } from '../../store/useGameStore';
import { challengeScore0to10 } from '../../utils/scoring';
import Header from '../layout/Header';
import MatrixGrid from '../matrix/MatrixGrid';
import AnswerOptions from '../matrix/AnswerOptions';
import PulseFeedback from '../feedback/PulseFeedback';
import { fireConfetti, fireBigConfetti } from '../feedback/Confetti';
import Timer from './Timer';
import ScoreSummary from './ScoreSummary';

const TOTAL_SECONDS = 12 * 60;

export default function ChallengeScreen({ onNavigate }) {
  const recordChallengeResult = useGameStore((s) => s.recordChallengeResult);
  const { difficulty, recordResult, summarize, pickRule, reset } = useAdaptiveDifficulty();

  const [phase, setPhase] = useState('playing');
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(pickRule(), difficulty));
  const [selectedId, setSelectedId] = useState(null);
  const [revealedCorrectId, setRevealedCorrectId] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [itemNumber, setItemNumber] = useState(1);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const summary = summarize();
    const score0to10 = challengeScore0to10(summary.weightedCorrect, summary.weightedTotal);
    const result = { score0to10, ...summary };
    recordChallengeResult(result);
    setFinalResult(result);
    setPhase('summary');
    if (score0to10 >= 7) fireBigConfetti();
  }, [summarize, recordChallengeResult]);

  const timer = useTimer(TOTAL_SECONDS, { onExpire: finish, autoStart: true });

  function handleSelect(optionId) {
    if (revealedCorrectId) return;
    const correctOption = puzzle.options.find((o) => o.isCorrect);
    const isCorrect = optionId === correctOption.id;
    setSelectedId(optionId);
    setRevealedCorrectId(correctOption.id);
    setLastCorrect(isCorrect);
    if (isCorrect) fireConfetti();
    recordResult({ correct: isCorrect, difficulty: puzzle.difficulty, ruleId: puzzle.ruleType });
  }

  function handleNext() {
    setSelectedId(null);
    setRevealedCorrectId(null);
    setLastCorrect(null);
    setItemNumber((n) => n + 1);
    setPuzzle(generatePuzzle(pickRule(), difficulty));
  }

  function handleRetry() {
    reset();
    finishedRef.current = false;
    setPhase('playing');
    setFinalResult(null);
    setSelectedId(null);
    setRevealedCorrectId(null);
    setLastCorrect(null);
    setItemNumber(1);
    timer.reset(TOTAL_SECONDS);
    timer.resume();
    setPuzzle(generatePuzzle(pickRule(), 1));
  }

  if (phase === 'summary' && finalResult) {
    return (
      <div className="screen challenge-screen">
        <Header onBackToWorlds={() => onNavigate('home')} subtitle="Final Challenge" />
        <div className="challenge-screen__body">
          <ScoreSummary result={finalResult} onHome={() => onNavigate('home')} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className="screen challenge-screen">
      <Header onBackToWorlds={() => onNavigate('home')} subtitle="Final Challenge" />
      <div className="challenge-screen__body">
        <div className="challenge-screen__meta">
          <Timer remaining={timer.remaining} />
          <span className="challenge-screen__item-count">Item {itemNumber}</span>
          <span className="difficulty-pip" title="Current adaptive difficulty">
            {'●'.repeat(difficulty)}
            {'○'.repeat(5 - difficulty)}
          </span>
          <button type="button" className="btn btn--ghost btn--small" onClick={finish}>
            End Test
          </button>
        </div>
        <MatrixGrid grid={puzzle.grid} />
        <PulseFeedback state={lastCorrect}>
          <AnswerOptions options={puzzle.options} selectedId={selectedId} revealedCorrectId={revealedCorrectId} onSelect={handleSelect} disabled={!!revealedCorrectId} />
        </PulseFeedback>
        {revealedCorrectId && (
          <div className="challenge-screen__feedback">
            <p>{lastCorrect ? '✅ Correct' : '❌ Not quite'} — {puzzle.explanation.summary}</p>
            <button type="button" className="btn btn--primary" onClick={handleNext}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
