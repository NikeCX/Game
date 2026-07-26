import { createRng, randomSeed, choice, sample, randomInt } from './core/rng.js';
import { getDifficultyConfig } from '../data/difficulty.js';
import { finalizeOptions, buildDistractor } from './core/distractorEngine.js';
import { makeId } from './core/gridUtils.js';
import {
  randomShape,
  randomColor,
  polygonIndex,
  polygonAt,
  sizeAt,
  SIZE_ORDER,
} from './core/attributes.js';
import { POLYGON_FAMILY } from '../data/shapes.js';

const ATTRIBUTE_LABELS = {
  count: 'the number of shapes',
  size: 'the size',
  complexity: 'the shape (it gains a side each step)',
};

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

function computeCell(meta, effectiveStep, directionOverride) {
  const direction = directionOverride ?? meta.direction;
  let count = meta.count0;
  let sizeIdx = meta.sizeIdx0;
  let shape = meta.shapeBase;

  if (meta.chosenAttrs.includes('count')) count = clamp(meta.count0 + direction * effectiveStep, 1, 3);
  if (meta.chosenAttrs.includes('size')) sizeIdx = clamp(meta.sizeIdx0 + direction * effectiveStep, 0, SIZE_ORDER.length - 1);
  if (meta.chosenAttrs.includes('complexity')) {
    shape = polygonAt(meta.polyIdx0 + direction * effectiveStep);
  }

  const instance = { shape, size: sizeAt(sizeIdx), color: meta.color, rotation: 0, fillStyle: 'solid', mirror: 'none' };
  return Array.from({ length: count }, () => ({ ...instance }));
}

// Start values are chosen relative to `direction` so all 3 steps (0,1,2)
// stay within the domain without clamping — otherwise a start value near
// the boundary can make the "progression" invisible (e.g. count stuck at 3
// for every step because it was already saturated from step 0).
function buildLine(rng, cfg, chosenAttrs, direction) {
  const usesComplexity = chosenAttrs.includes('complexity');
  const maxPolyStart = POLYGON_FAMILY.length - 1 - 2;
  const polyStart = direction === 1 ? randomInt(rng, 0, maxPolyStart) : randomInt(rng, 2, POLYGON_FAMILY.length - 1);

  const meta = {
    count0: chosenAttrs.includes('count') ? (direction === 1 ? 1 : 3) : randomInt(rng, 1, 3),
    sizeIdx0: chosenAttrs.includes('size') ? (direction === 1 ? 0 : SIZE_ORDER.length - 1) : randomInt(rng, 0, SIZE_ORDER.length - 1),
    shapeBase: usesComplexity ? POLYGON_FAMILY[polyStart] : randomShape(rng, cfg.shapeCount),
    polyIdx0: usesComplexity ? polyStart : polygonIndex(randomShape(rng, cfg.shapeCount)),
    color: randomColor(rng, cfg.colorCount),
    chosenAttrs,
    direction,
  };
  const cells = [0, 1, 2].map((step) => computeCell(meta, step));
  return { cells, meta };
}

export function generateProgressionPuzzle(difficulty, seed) {
  const rng = createRng(seed ?? randomSeed());
  const cfg = getDifficultyConfig(difficulty);
  const orientation = choice(rng, ['row', 'column']);
  const attributePool = ['count', 'size', 'complexity'];
  const chosenAttrs = sample(rng, attributePool, Math.max(1, Math.min(cfg.attributeCount, attributePool.length)));
  const direction = choice(rng, [1, -1]);

  const lines = [0, 1, 2].map(() => buildLine(rng, cfg, chosenAttrs, direction));

  const grid = [[], [], []];
  for (let lineIdx = 0; lineIdx < 3; lineIdx++) {
    for (let step = 0; step < 3; step++) {
      if (orientation === 'row') grid[lineIdx][step] = lines[lineIdx].cells[step];
      else grid[step][lineIdx] = lines[lineIdx].cells[step];
    }
  }

  const lastMeta = lines[2].meta;
  const correctAnswer = grid[2][2];

  const distractors = [
    buildDistractor('reversed-direction', correctAnswer, () => computeCell(lastMeta, 2, -lastMeta.direction)),
    buildDistractor('double-step', correctAnswer, () => computeCell(lastMeta, 4)),
    buildDistractor('no-op', correctAnswer, () => computeCell(lastMeta, 1)),
    buildDistractor('off-by-one', correctAnswer, () => computeCell(lastMeta, 3)),
    buildDistractor('wrong-attribute', correctAnswer, (cell) => {
      const otherColor = randomColor(rng, Math.max(4, cfg.colorCount));
      return cell.map((s) => ({ ...s, color: otherColor === s.color ? randomColor(rng, cfg.colorCount) : otherColor }));
    }),
  ];

  const options = finalizeOptions(rng, correctAnswer, distractors, cfg.optionCount);

  const attrText = chosenAttrs.map((a) => ATTRIBUTE_LABELS[a]).join(' and ');
  const orientationText = orientation === 'row' ? 'row, left to right' : 'column, top to bottom';
  const dirText = direction === 1 ? 'increases' : 'decreases';

  return {
    id: makeId('progression', rng),
    ruleType: 'progression',
    difficulty,
    grid,
    correctAnswer,
    options,
    explanation: {
      summary: `In each ${orientationText}, ${attrText} ${dirText} by the same amount at every step.`,
      steps: [
        { stepType: 'inventory', text: `List what changes across each ${orientation}: shape, size, and count.` },
        { stepType: 'rule-finding', text: `${attrText[0].toUpperCase()}${attrText.slice(1)} ${dirText} by a fixed step each time — apply that step once more to find the answer.` },
        { stepType: 'elimination', text: 'Cross out any option that reverses the step, repeats the previous cell, or jumps by the wrong amount.' },
      ],
    },
    meta: { varyingAttributes: chosenAttrs, seed: seed ?? 0, generatedAt: Date.now() },
  };
}
