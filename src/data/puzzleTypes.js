// Shared data-model documentation (JSDoc only — no TypeScript build step).
// Every generator, hook, and screen component should treat these shapes as
// the contract for puzzle data.

/**
 * @typedef {Object} ShapeInstance
 * @property {string} shape - one of ALL_SHAPES (see data/shapes.js)
 * @property {'small'|'medium'|'large'} size
 * @property {string} color - hex color from COLOR_PALETTE
 * @property {0|45|90|135|180|225|270|315} rotation
 * @property {'solid'|'outline'} fillStyle
 * @property {'none'|'horizontal'|'vertical'} mirror
 */

/**
 * A single grid cell is 1-3 layered shape instances. An empty array renders
 * as a blank cell (used only for the hidden answer cell before it's solved).
 * @typedef {ShapeInstance[]} Cell
 */

/**
 * @typedef {Object} PuzzleOption
 * @property {string} id
 * @property {Cell} cell
 * @property {boolean} isCorrect
 * @property {string|null} distractorType
 */

/**
 * @typedef {Object} ExplanationStep
 * @property {'inventory'|'rule-finding'|'elimination'} stepType
 * @property {string} text
 * @property {[number,number][]} [highlightCells]
 * @property {string} [highlightAttribute]
 */

/**
 * @typedef {Object} Puzzle
 * @property {string} id
 * @property {'progression'|'rotation'|'construction'|'frequency'|'symmetry'} ruleType
 * @property {number} difficulty - 1-5
 * @property {Cell[][]} grid - 3x3, grid[2][2] is the answer (not rendered directly)
 * @property {Cell} correctAnswer - === grid[2][2]
 * @property {PuzzleOption[]} options - 4-8 options, shuffled, exactly one isCorrect
 * @property {{ summary: string, steps: ExplanationStep[] }} explanation
 * @property {{ varyingAttributes: string[], seed: number, generatedAt: number }} meta
 */

export const RULE_TYPES = ['progression', 'rotation', 'construction', 'frequency', 'symmetry'];
