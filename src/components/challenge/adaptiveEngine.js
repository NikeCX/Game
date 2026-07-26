import { clampDifficulty, MIN_DIFFICULTY } from '../../data/difficulty';
import { RULE_IDS } from '../../data/rules';

export function createAdaptiveState() {
  return { difficulty: MIN_DIFFICULTY, history: [] };
}

export function pickRandomRule(rng) {
  const roll = rng ? rng() : Math.random();
  return RULE_IDS[Math.floor(roll * RULE_IDS.length)];
}

/** +1 difficulty on correct, -1 on incorrect, clamped to the valid range. */
export function applyResult(adaptiveState, { correct, difficulty, ruleId }) {
  return {
    difficulty: clampDifficulty(difficulty + (correct ? 1 : -1)),
    history: [...adaptiveState.history, { correct, difficulty, ruleId }],
  };
}

export function summarize(adaptiveState) {
  let weightedCorrect = 0;
  let weightedTotal = 0;
  const perRuleBreakdown = {};
  for (const entry of adaptiveState.history) {
    weightedTotal += entry.difficulty;
    if (entry.correct) weightedCorrect += entry.difficulty;
    if (!perRuleBreakdown[entry.ruleId]) perRuleBreakdown[entry.ruleId] = { attempted: 0, correct: 0 };
    perRuleBreakdown[entry.ruleId].attempted += 1;
    if (entry.correct) perRuleBreakdown[entry.ruleId].correct += 1;
  }
  const totalItems = adaptiveState.history.length;
  const avgDifficulty = totalItems ? adaptiveState.history.reduce((s, h) => s + h.difficulty, 0) / totalItems : 0;
  return {
    weightedCorrect,
    weightedTotal,
    correctCount: adaptiveState.history.filter((h) => h.correct).length,
    totalItems,
    avgDifficulty,
    perRuleBreakdown,
  };
}
