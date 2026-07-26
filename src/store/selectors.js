import { RULE_IDS } from '../data/rules';
import { computeMasteryLevel } from '../data/mastery';
import { levelForXp } from '../utils/scoring';

export function selectRuleMastery(state, ruleId) {
  return computeMasteryLevel(state.rules[ruleId]);
}

export function selectFinalChallengeUnlocked(state) {
  return RULE_IDS.every((id) => state.rules[id].tutorialCompleted);
}

export function selectLevel(state) {
  return levelForXp(state.xp.total);
}

export function selectOverallAccuracy(state) {
  let attempted = 0;
  let correct = 0;
  for (const id of RULE_IDS) {
    attempted += state.rules[id].puzzlesAttempted;
    correct += state.rules[id].puzzlesCorrect;
  }
  return attempted === 0 ? 0 : correct / attempted;
}
