import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RULE_IDS } from '../data/rules';
import { computeMasteryLevel } from '../data/mastery';
import { clampDifficulty } from '../data/difficulty';
import { xpForPracticeAnswer } from '../utils/scoring';
import { STORAGE_VERSION, migrate } from '../utils/storage';

function defaultRuleProgress() {
  return {
    tutorialCompleted: false,
    puzzlesAttempted: 0,
    puzzlesCorrect: 0,
    highestDifficultySolved: 0,
    bestStreak: 0,
    practiceDifficulty: 1,
  };
}

function defaultState() {
  return {
    settings: { soundOn: true, reducedMotion: false },
    xp: { total: 0 },
    streak: { current: 0, best: 0 },
    rules: Object.fromEntries(RULE_IDS.map((id) => [id, defaultRuleProgress()])),
    challenge: { attempts: [], bestScore: 0 },
    badges: [],
  };
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...defaultState(),

      recordPracticeAnswer(ruleId, { correct, difficulty, hintsUsed = 0 }) {
        set((state) => {
          const rule = { ...state.rules[ruleId] };
          rule.puzzlesAttempted += 1;
          if (correct) {
            rule.puzzlesCorrect += 1;
            if (difficulty > rule.highestDifficultySolved) rule.highestDifficultySolved = difficulty;
            rule.practiceDifficulty = clampDifficulty(rule.practiceDifficulty + 1);
          } else {
            rule.practiceDifficulty = clampDifficulty(rule.practiceDifficulty - 1);
          }

          const xpGain = xpForPracticeAnswer(correct, difficulty, hintsUsed);
          const newStreakCurrent = correct ? state.streak.current + 1 : 0;
          const newStreakBest = Math.max(state.streak.best, newStreakCurrent);
          if (newStreakCurrent > rule.bestStreak) rule.bestStreak = newStreakCurrent;

          return {
            rules: { ...state.rules, [ruleId]: rule },
            xp: { total: state.xp.total + xpGain },
            streak: { current: newStreakCurrent, best: newStreakBest },
          };
        });
        get().checkBadges();
      },

      completeTutorial(ruleId) {
        set((state) => ({
          rules: { ...state.rules, [ruleId]: { ...state.rules[ruleId], tutorialCompleted: true } },
        }));
        get().checkBadges();
      },

      recordChallengeResult(result) {
        set((state) => {
          const attempts = [{ ...result, date: Date.now() }, ...state.challenge.attempts].slice(0, 10);
          const bestScore = Math.max(state.challenge.bestScore, result.score0to10);
          return { challenge: { attempts, bestScore } };
        });
        get().checkBadges();
      },

      toggleSound() {
        set((state) => ({ settings: { ...state.settings, soundOn: !state.settings.soundOn } }));
      },

      toggleReducedMotion() {
        set((state) => ({ settings: { ...state.settings, reducedMotion: !state.settings.reducedMotion } }));
      },

      checkBadges() {
        set((state) => {
          const badges = new Set(state.badges);
          for (const ruleId of RULE_IDS) {
            const mastery = computeMasteryLevel(state.rules[ruleId]);
            if (mastery >= 1) badges.add(`${ruleId}-bronze`);
            if (mastery >= 2) badges.add(`${ruleId}-silver`);
            if (mastery >= 3) badges.add(`${ruleId}-gold`);
          }
          if (RULE_IDS.every((id) => state.rules[id].tutorialCompleted)) badges.add('all-tutorials');
          if (state.streak.best >= 5) badges.add('streak-5');
          if (state.streak.best >= 10) badges.add('streak-10');
          if (state.challenge.bestScore >= 8) badges.add('challenge-ace');
          return { badges: Array.from(badges) };
        });
      },

      resetProgress() {
        set(defaultState());
      },
    }),
    {
      name: 'matrix-game:v1',
      version: STORAGE_VERSION,
      migrate,
    }
  )
);
