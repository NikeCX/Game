// Bronze/silver/gold mastery thresholds per rule world.

export const MASTERY_LEVELS = ['none', 'bronze', 'silver', 'gold'];

const THRESHOLDS = [
  { level: 3, correct: 40, accuracy: 0.8, minDifficultySolved: 5 }, // gold
  { level: 2, correct: 20, accuracy: 0.65, minDifficultySolved: 3 }, // silver
  { level: 1, correct: 8, accuracy: 0.5, minDifficultySolved: 1 }, // bronze
];

/**
 * @param {{ puzzlesAttempted: number, puzzlesCorrect: number, highestDifficultySolved: number }} ruleProgress
 * @returns {number} 0 (none) - 3 (gold)
 */
export function computeMasteryLevel(ruleProgress) {
  const { puzzlesAttempted = 0, puzzlesCorrect = 0, highestDifficultySolved = 0 } = ruleProgress || {};
  if (puzzlesAttempted === 0) return 0;
  const accuracy = puzzlesCorrect / puzzlesAttempted;
  for (const t of THRESHOLDS) {
    if (puzzlesCorrect >= t.correct && accuracy >= t.accuracy && highestDifficultySolved >= t.minDifficultySolved) {
      return t.level;
    }
  }
  return 0;
}

export function masteryLabel(level) {
  return MASTERY_LEVELS[level] || 'none';
}
