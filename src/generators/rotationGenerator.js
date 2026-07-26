import { createRng, randomSeed, choice, sample, randomInt } from './core/rng.js';
import { getDifficultyConfig } from '../data/difficulty.js';
import { finalizeOptions, buildDistractor } from './core/distractorEngine.js';
import { makeId } from './core/gridUtils.js';
import { randomColor, sizeAt, normalizeAngle, SIZE_ORDER } from './core/attributes.js';
import { choice as pick } from './core/rng.js';
import { ROTATIONS } from '../data/shapes.js';

// Shapes whose rotational symmetry period doesn't collide with our 45-degree
// step grid, so every rotation step is visually distinguishable.
const ROTATABLE_SHAPES = ['triangle', 'arrow', 'flag', 'star', 'semicircle', 'pentagon', 'heptagon', 'rightTriangle'];

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

function computeCell(meta, effectiveStep, directionOverride, magnitudeOverride) {
  const direction = directionOverride ?? meta.direction;
  const magnitude = magnitudeOverride ?? meta.stepMagnitude;
  const angle = normalizeAngle(meta.rotation0 + direction * magnitude * effectiveStep);

  let sizeIdx = meta.sizeIdx0;
  if (meta.chosenExtras.includes('size')) sizeIdx = clamp(meta.sizeIdx0 + effectiveStep, 0, SIZE_ORDER.length - 1);

  const instance = {
    shape: meta.shape,
    size: sizeAt(sizeIdx),
    color: meta.color,
    rotation: angle,
    fillStyle: 'solid',
    mirror: 'none',
  };
  return [instance];
}

function buildLine(rng, cfg, shape, chosenExtras, direction, stepMagnitude) {
  const meta = {
    rotation0: pick(rng, ROTATIONS),
    sizeIdx0: chosenExtras.includes('size') ? 0 : randomInt(rng, 0, SIZE_ORDER.length - 1),
    color: randomColor(rng, cfg.colorCount),
    shape,
    chosenExtras,
    direction,
    stepMagnitude,
  };
  const cells = [0, 1, 2].map((step) => computeCell(meta, step));
  return { cells, meta };
}

export function generateRotationPuzzle(difficulty, seed) {
  const rng = createRng(seed ?? randomSeed());
  const cfg = getDifficultyConfig(difficulty);
  const orientation = choice(rng, ['row', 'column']);
  const shape = choice(rng, ROTATABLE_SHAPES);
  const direction = choice(rng, [1, -1]);
  const stepMagnitude = choice(rng, cfg.rotationSteps);
  const extraPool = ['size'];
  const chosenExtras = sample(rng, extraPool, Math.max(0, Math.min(cfg.attributeCount - 1, extraPool.length)));

  const lines = [0, 1, 2].map(() => buildLine(rng, cfg, shape, chosenExtras, direction, stepMagnitude));

  const grid = [[], [], []];
  for (let lineIdx = 0; lineIdx < 3; lineIdx++) {
    for (let step = 0; step < 3; step++) {
      if (orientation === 'row') grid[lineIdx][step] = lines[lineIdx].cells[step];
      else grid[step][lineIdx] = lines[lineIdx].cells[step];
    }
  }

  const lastMeta = lines[2].meta;
  const correctAnswer = grid[2][2];

  const otherMagnitude = cfg.rotationSteps.find((m) => m !== stepMagnitude) ?? 45;

  const distractors = [
    buildDistractor('wrong-direction', correctAnswer, () => computeCell(lastMeta, 2, -lastMeta.direction)),
    buildDistractor('wrong-magnitude', correctAnswer, () => computeCell(lastMeta, 2, undefined, otherMagnitude)),
    buildDistractor('no-op', correctAnswer, () => computeCell(lastMeta, 1)),
    buildDistractor('double-step', correctAnswer, () => computeCell(lastMeta, 4)),
    buildDistractor('wrong-attribute', correctAnswer, (cell) => {
      const otherColor = randomColor(rng, Math.max(4, cfg.colorCount));
      return cell.map((s) => ({ ...s, color: otherColor }));
    }),
  ];

  const options = finalizeOptions(rng, correctAnswer, distractors, cfg.optionCount);

  const orientationText = orientation === 'row' ? 'row, left to right' : 'column, top to bottom';
  const dirWord = direction === 1 ? 'clockwise' : 'counter-clockwise';

  return {
    id: makeId('rotation', rng),
    ruleType: 'rotation',
    difficulty,
    grid,
    correctAnswer,
    options,
    explanation: {
      summary: `In each ${orientationText}, the shape rotates ${stepMagnitude}° ${dirWord} at every step.`,
      steps: [
        { stepType: 'inventory', text: 'Pick one feature of the shape (a tip, a notch) so you can track how far it turns.' },
        { stepType: 'rule-finding', text: `The shape turns ${stepMagnitude}° ${dirWord} each step — apply that turn once more.` },
        { stepType: 'elimination', text: 'Cross out options that turn the wrong way, the wrong amount, or don\'t turn at all.' },
      ],
    },
    meta: { varyingAttributes: ['rotation', ...chosenExtras], seed: seed ?? 0, generatedAt: Date.now() },
  };
}
