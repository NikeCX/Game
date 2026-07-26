import { createRng, randomSeed, choice } from './core/rng.js';
import { getDifficultyConfig } from '../data/difficulty.js';
import { finalizeOptions, buildDistractor, pickDistinctWrongValue } from './core/distractorEngine.js';
import { makeId } from './core/gridUtils.js';
import { randomColor, randomChiralShape, normalizeAngle, sizeAt, colorDomain, SIZE_ORDER } from './core/attributes.js';
import { ROTATIONS } from '../data/shapes.js';

const ANCHOR_SHAPES = ['circle', 'square', 'star', 'hexagon', 'plus', 'diamond', 'cross'];
const AXES = ['horizontal', 'vertical'];

export function generateSymmetryPuzzle(difficulty, seed) {
  const rng = createRng(seed ?? randomSeed());
  const cfg = getDifficultyConfig(difficulty);
  const axis = choice(rng, AXES);
  const sizeVaries = cfg.attributeCount >= 2;

  const grid = [[], [], []];
  let correctAnswer = null;
  let lastPairMeta = null;

  for (let r = 0; r < 3; r++) {
    const chiralShape = randomChiralShape(rng);
    const color = randomColor(rng, cfg.colorCount);
    const rotation0 = choice(rng, ROTATIONS);
    const sizeIdx = sizeVaries ? Math.min(SIZE_ORDER.length - 1, r) : 1;

    const base = { shape: chiralShape, size: sizeAt(sizeIdx), color, rotation: rotation0, fillStyle: 'solid', mirror: 'none' };
    const mirrored = { ...base, mirror: axis };

    const anchorShape = choice(rng, ANCHOR_SHAPES);
    const anchor = {
      shape: anchorShape,
      size: sizeAt(sizeVaries ? Math.min(SIZE_ORDER.length - 1, r) : 1),
      color: randomColor(rng, cfg.colorCount),
      rotation: choice(rng, ROTATIONS),
      fillStyle: 'solid',
      mirror: 'none',
    };

    grid[r][0] = [base];
    grid[r][1] = [anchor];
    grid[r][2] = [mirrored];

    if (r === 2) {
      correctAnswer = [mirrored];
      lastPairMeta = { base, axis, rotation0 };
    }
  }

  const otherAxis = lastPairMeta.axis === 'horizontal' ? 'vertical' : 'horizontal';
  const wrongColor = pickDistinctWrongValue(rng, colorDomain(Math.max(4, cfg.colorCount)), lastPairMeta.base.color);

  const distractors = [
    buildDistractor('wrong-axis', correctAnswer, () => [{ ...lastPairMeta.base, mirror: otherAxis }]),
    buildDistractor('rotated-not-mirrored-180', correctAnswer, () => [
      { ...lastPairMeta.base, mirror: 'none', rotation: normalizeAngle(lastPairMeta.rotation0 + 180) },
    ]),
    buildDistractor('rotated-not-mirrored-90', correctAnswer, () => [
      { ...lastPairMeta.base, mirror: 'none', rotation: normalizeAngle(lastPairMeta.rotation0 + 90) },
    ]),
    buildDistractor('no-op-duplicate', correctAnswer, () => [{ ...lastPairMeta.base, mirror: 'none' }]),
    buildDistractor('wrong-color', correctAnswer, () => [{ ...lastPairMeta.base, mirror: lastPairMeta.axis, color: wrongColor }]),
  ];

  const options = finalizeOptions(rng, correctAnswer, distractors, cfg.optionCount);

  const axisText = axis === 'horizontal' ? 'flipped top-to-bottom (horizontal axis)' : 'flipped left-to-right (vertical axis)';

  return {
    id: makeId('symmetry', rng),
    ruleType: 'symmetry',
    difficulty,
    grid,
    correctAnswer,
    options,
    explanation: {
      summary: `Cell 3 in each row is cell 1, ${axisText} — a true mirror image, not a rotation.`,
      steps: [
        { stepType: 'inventory', text: 'Notice which shapes are chiral (look different when mirrored vs. spun).' },
        { stepType: 'rule-finding', text: `Compare cell 1 and cell 3 in a full row: the shape is ${axisText}.` },
        { stepType: 'elimination', text: 'Cross out options that spin the shape instead of mirroring it, or mirror the wrong way.' },
      ],
    },
    meta: { varyingAttributes: ['mirror', ...(sizeVaries ? ['size'] : [])], seed: seed ?? 0, generatedAt: Date.now() },
  };
}
