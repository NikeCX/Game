import { generateProgressionPuzzle } from './progressionGenerator.js';
import { generateRotationPuzzle } from './rotationGenerator.js';
import { generateConstructionPuzzle } from './constructionGenerator.js';
import { generateFrequencyPuzzle } from './frequencyGenerator.js';
import { generateSymmetryPuzzle } from './symmetryGenerator.js';
import { RULE_IDS } from '../data/rules.js';

const GENERATORS = {
  progression: generateProgressionPuzzle,
  rotation: generateRotationPuzzle,
  construction: generateConstructionPuzzle,
  frequency: generateFrequencyPuzzle,
  symmetry: generateSymmetryPuzzle,
};

/**
 * Single entry point every screen uses to generate a puzzle.
 * @param {string} ruleId - one of RULE_IDS
 * @param {number} difficulty - 1-5
 * @param {number} [seed] - omit for a random puzzle, pass a fixed value for reproducible tutorial examples
 * @returns {import('../data/puzzleTypes.js').Puzzle}
 */
export function generatePuzzle(ruleId, difficulty, seed) {
  const generator = GENERATORS[ruleId];
  if (!generator) {
    throw new Error(`Unknown rule id: ${ruleId}. Expected one of ${RULE_IDS.join(', ')}`);
  }
  return generator(difficulty, seed);
}

export function generateRandomRulePuzzle(difficulty, seed, rng) {
  const ruleId = rng ? RULE_IDS[Math.floor(rng() * RULE_IDS.length)] : RULE_IDS[Math.floor(Math.random() * RULE_IDS.length)];
  return generatePuzzle(ruleId, difficulty, seed);
}
