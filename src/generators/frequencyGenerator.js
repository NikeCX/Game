import { createRng, randomSeed, sample, shuffle, choice } from './core/rng.js';
import { getDifficultyConfig } from '../data/difficulty.js';
import { finalizeOptions, buildDistractor } from './core/distractorEngine.js';
import { makeId } from './core/gridUtils.js';
import { shapeDomain, colorDomain, sizeDomain } from './core/attributes.js';

const DIMENSION_POOL = ['shape', 'size', 'color'];

const DIMENSION_LABEL = { shape: 'shape', size: 'size', color: 'color' };

function buildLatinSquare(rng, domain3) {
  const shuffledDomain = shuffle(rng, domain3);
  const rowPerm = shuffle(rng, [0, 1, 2]);
  const colPerm = shuffle(rng, [0, 1, 2]);
  const square = [[], [], []];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const baseR = rowPerm[r];
      const baseC = colPerm[c];
      square[r][c] = shuffledDomain[(baseR + baseC) % 3];
    }
  }
  return square;
}

export function generateFrequencyPuzzle(difficulty, seed) {
  const rng = createRng(seed ?? randomSeed());
  const cfg = getDifficultyConfig(difficulty);

  const dimCount = Math.max(1, Math.min(cfg.dimensionCount, DIMENSION_POOL.length));
  const chosenDims = sample(rng, DIMENSION_POOL, dimCount);
  const unchosenDims = DIMENSION_POOL.filter((d) => !chosenDims.includes(d));

  const squares = {};
  const domains = {};
  if (chosenDims.includes('shape')) {
    domains.shape = sample(rng, shapeDomain(Math.max(4, cfg.shapeCount)), 3);
    squares.shape = buildLatinSquare(rng, domains.shape);
  }
  if (chosenDims.includes('color')) {
    domains.color = sample(rng, colorDomain(Math.max(4, cfg.colorCount)), 3);
    squares.color = buildLatinSquare(rng, domains.color);
  }
  if (chosenDims.includes('size')) {
    domains.size = sizeDomain(3);
    squares.size = buildLatinSquare(rng, domains.size);
  }

  const fixed = {
    shape: shapeDomain(Math.max(4, cfg.shapeCount))[0],
    color: colorDomain(Math.max(4, cfg.colorCount))[0],
    size: 'medium',
  };
  for (const dim of unchosenDims) {
    if (dim === 'shape') fixed.shape = choice(rng, shapeDomain(Math.max(4, cfg.shapeCount)));
    if (dim === 'color') fixed.color = choice(rng, colorDomain(Math.max(4, cfg.colorCount)));
    if (dim === 'size') fixed.size = choice(rng, sizeDomain(3));
  }

  function valueAt(dim, r, c) {
    return squares[dim] ? squares[dim][r][c] : fixed[dim];
  }

  const grid = [[], [], []];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      grid[r][c] = [
        {
          shape: valueAt('shape', r, c),
          size: valueAt('size', r, c),
          color: valueAt('color', r, c),
          rotation: 0,
          fillStyle: 'solid',
          mirror: 'none',
        },
      ];
    }
  }

  const correctAnswer = grid[2][2];

  const distractors = [];

  for (const dim of chosenDims) {
    const rowDup = squares[dim][2][0]; // already used elsewhere in row 2
    const colDup = squares[dim][0][2]; // already used elsewhere in column 2
    distractors.push(
      buildDistractor(`row-repeat-${dim}`, correctAnswer, (cell) => cell.map((s) => ({ ...s, [dim]: rowDup })))
    );
    distractors.push(
      buildDistractor(`col-repeat-${dim}`, correctAnswer, (cell) => cell.map((s) => ({ ...s, [dim]: colDup })))
    );
    const fullDomain = dim === 'shape' ? shapeDomain(Math.max(6, cfg.shapeCount)) : dim === 'color' ? colorDomain(Math.max(6, cfg.colorCount)) : null;
    if (fullDomain) {
      const outside = fullDomain.find((v) => !domains[dim].includes(v));
      if (outside) {
        distractors.push(
          buildDistractor(`outside-domain-${dim}`, correctAnswer, (cell) => cell.map((s) => ({ ...s, [dim]: outside })))
        );
      }
    }
  }
  for (const dim of unchosenDims) {
    const altValue =
      dim === 'shape'
        ? shapeDomain(Math.max(4, cfg.shapeCount)).find((v) => v !== fixed.shape)
        : dim === 'color'
          ? colorDomain(Math.max(4, cfg.colorCount)).find((v) => v !== fixed.color)
          : sizeDomain(3).find((v) => v !== fixed.size);
    if (altValue) {
      distractors.push(
        buildDistractor(`constant-changed-${dim}`, correctAnswer, (cell) => cell.map((s) => ({ ...s, [dim]: altValue })))
      );
    }
  }

  const options = finalizeOptions(rng, correctAnswer, distractors, cfg.optionCount);

  const dimText = chosenDims.map((d) => DIMENSION_LABEL[d]).join(', ');

  return {
    id: makeId('frequency', rng),
    ruleType: 'frequency',
    difficulty,
    grid,
    correctAnswer,
    options,
    explanation: {
      summary: `Every row and every column contains each ${dimText} value exactly once — like a mini sudoku.`,
      steps: [
        { stepType: 'inventory', text: `List which values of ${dimText} appear in the bottom row and right column so far.` },
        { stepType: 'rule-finding', text: 'The missing cell must hold whichever value from each dimension is NOT yet used in its row or column.' },
        { stepType: 'elimination', text: 'Cross out any option that repeats a value already used in that row or column.' },
      ],
    },
    meta: { varyingAttributes: chosenDims, seed: seed ?? 0, generatedAt: Date.now() },
  };
}
