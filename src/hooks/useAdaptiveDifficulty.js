import { useState, useCallback } from 'react';
import { createAdaptiveState, applyResult, summarize, pickRandomRule } from '../components/challenge/adaptiveEngine';

export function useAdaptiveDifficulty() {
  const [state, setState] = useState(createAdaptiveState);

  const recordResult = useCallback((result) => {
    setState((prev) => applyResult(prev, result));
  }, []);

  const reset = useCallback(() => setState(createAdaptiveState()), []);

  return {
    difficulty: state.difficulty,
    itemsAnswered: state.history.length,
    recordResult,
    reset,
    summarize: () => summarize(state),
    pickRule: pickRandomRule,
  };
}
