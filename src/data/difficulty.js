// Single difficulty config read by every generator so difficulty scales
// consistently across all 5 rule types.

export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 5;

export const DIFFICULTY_CONFIG = {
  1: { attributeCount: 1, optionCount: 4, rotationSteps: [45, 90], colorCount: 3, shapeCount: 3, sizeCount: 2, dimensionCount: 1 },
  2: { attributeCount: 1, optionCount: 5, rotationSteps: [45, 90, 135], colorCount: 4, shapeCount: 4, sizeCount: 2, dimensionCount: 1 },
  3: { attributeCount: 2, optionCount: 6, rotationSteps: [45, 90, 135, 180], colorCount: 5, shapeCount: 5, sizeCount: 3, dimensionCount: 2 },
  4: { attributeCount: 2, optionCount: 7, rotationSteps: [45, 90, 135, 180], colorCount: 6, shapeCount: 6, sizeCount: 3, dimensionCount: 2 },
  5: { attributeCount: 3, optionCount: 8, rotationSteps: [45, 90, 135, 180], colorCount: 7, shapeCount: 7, sizeCount: 3, dimensionCount: 3 },
};

export function clampDifficulty(value) {
  return Math.min(MAX_DIFFICULTY, Math.max(MIN_DIFFICULTY, Math.round(value)));
}

export function getDifficultyConfig(difficulty) {
  return DIFFICULTY_CONFIG[clampDifficulty(difficulty)];
}
