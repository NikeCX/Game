const XP_PER_LEVEL = 100;

export function xpForPracticeAnswer(correct, difficulty, hintsUsed = 0) {
  if (!correct) return 2;
  const base = difficulty * 10;
  const penalty = hintsUsed * 3;
  return Math.max(4, base - penalty);
}

export function levelForXp(totalXp) {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export function xpProgress(totalXp) {
  const level = levelForXp(totalXp);
  const xpIntoLevel = totalXp - (level - 1) * XP_PER_LEVEL;
  return { level, xpIntoLevel, xpForNextLevel: XP_PER_LEVEL, percent: (xpIntoLevel / XP_PER_LEVEL) * 100 };
}

/** Weighted 0-10 challenge score: rewards both accuracy and reaching higher difficulty. */
export function challengeScore0to10(weightedCorrect, weightedTotal) {
  if (weightedTotal === 0) return 0;
  return Math.round(10 * (weightedCorrect / weightedTotal));
}
