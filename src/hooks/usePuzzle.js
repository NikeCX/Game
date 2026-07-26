import { useState, useCallback } from 'react';
import { generatePuzzle } from '../generators/puzzleFactory';

/** Generates and tracks the current puzzle + answer state for a practice-style screen. */
export function usePuzzle(ruleId, initialDifficulty, seed) {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle(ruleId, initialDifficulty, seed));
  const [selectedId, setSelectedId] = useState(null);
  const [revealedCorrectId, setRevealedCorrectId] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);

  const next = useCallback(
    (nextDifficulty) => {
      setPuzzle(generatePuzzle(ruleId, nextDifficulty ?? initialDifficulty));
      setSelectedId(null);
      setRevealedCorrectId(null);
      setHintLevel(0);
    },
    [ruleId, initialDifficulty]
  );

  const answer = useCallback(
    (optionId) => {
      if (revealedCorrectId) return null;
      const correctOption = puzzle.options.find((o) => o.isCorrect);
      setSelectedId(optionId);
      setRevealedCorrectId(correctOption.id);
      return optionId === correctOption.id;
    },
    [puzzle, revealedCorrectId]
  );

  return { puzzle, selectedId, revealedCorrectId, hintLevel, setHintLevel, next, answer };
}
