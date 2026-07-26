import { createRng, randomSeed, choice, sample } from './core/rng.js';
import { getDifficultyConfig } from '../data/difficulty.js';
import { finalizeOptions, buildDistractor } from './core/distractorEngine.js';
import { makeId } from './core/gridUtils.js';
import { shapeDomain, colorDomain } from './core/attributes.js';

const OPERATORS = ['union', 'intersection', 'xor'];

const OPERATOR_TEXT = {
  union: 'everything that appears in either cell 1 or cell 2',
  intersection: 'only what appears in BOTH cell 1 and cell 2',
  xor: 'only what appears in exactly ONE of cell 1 or cell 2 (not both)',
};

function applyOperator(a, b, operator) {
  const setB = new Set(b);
  const setA = new Set(a);
  if (operator === 'union') return Array.from(new Set([...a, ...b]));
  if (operator === 'intersection') return a.filter((x) => setB.has(x));
  return [...a.filter((x) => !setB.has(x)), ...b.filter((x) => !setA.has(x))]; // xor
}

function toCell(shapeNames, colorOf) {
  return shapeNames.map((name) => ({
    shape: name,
    size: 'medium',
    color: colorOf.get(name),
    rotation: 0,
    fillStyle: 'solid',
    mirror: 'none',
  }));
}

function buildRow(rng, universe, operator) {
  for (let attempt = 0; attempt < 40; attempt++) {
    const sizeA = choice(rng, [1, 2]);
    const sizeB = choice(rng, [1, 2]);
    const a = sample(rng, universe, sizeA).sort();
    const b = sample(rng, universe, sizeB).sort();
    if (a.join() === b.join()) continue;
    const c = applyOperator(a, b, operator);
    if (c.length >= 1 && c.length <= 3) {
      return { a, b, c };
    }
  }
  // Fallback: guaranteed-valid trivial row.
  const a = [universe[0]];
  const b = [universe[1]];
  return { a, b, c: applyOperator(a, b, operator) };
}

export function generateConstructionPuzzle(difficulty, seed) {
  const rng = createRng(seed ?? randomSeed());
  const cfg = getDifficultyConfig(difficulty);
  const operator = choice(rng, OPERATORS);

  const poolSize = Math.min(6, Math.max(4, cfg.shapeCount));
  const universe = shapeDomain(poolSize).slice(0, poolSize);
  const colors = colorDomain(Math.max(4, cfg.colorCount));
  const colorOf = new Map(universe.map((s, i) => [s, colors[i % colors.length]]));

  const rows = [0, 1, 2].map(() => buildRow(rng, universe, operator));

  const grid = rows.map((row) => [toCell(row.a, colorOf), toCell(row.b, colorOf), toCell(row.c, colorOf)]);
  const correctAnswer = grid[2][2];
  const lastRow = rows[2];

  const otherOperators = OPERATORS.filter((op) => op !== operator);
  const distractors = [
    buildDistractor('wrong-operator', correctAnswer, () =>
      toCell(applyOperator(lastRow.a, lastRow.b, otherOperators[0]).length ? applyOperator(lastRow.a, lastRow.b, otherOperators[0]) : [universe[0]], colorOf)
    ),
    buildDistractor('wrong-operator-2', correctAnswer, () =>
      toCell(applyOperator(lastRow.a, lastRow.b, otherOperators[1]).length ? applyOperator(lastRow.a, lastRow.b, otherOperators[1]) : [universe[1]], colorOf)
    ),
    buildDistractor('other-row-answer', correctAnswer, () => grid[0][2]),
    buildDistractor('other-row-answer-2', correctAnswer, () => grid[1][2]),
  ];

  if (lastRow.c.length > 1) {
    distractors.push(
      buildDistractor('missing-shape', correctAnswer, (cell) => cell.slice(0, cell.length - 1))
    );
  }
  if (lastRow.c.length < 3) {
    const extra = universe.find((s) => !lastRow.c.includes(s));
    if (extra) {
      distractors.push(
        buildDistractor('extra-shape', correctAnswer, (cell) => [...cell, { shape: extra, size: 'medium', color: colorOf.get(extra), rotation: 0, fillStyle: 'solid', mirror: 'none' }])
      );
    }
  }
  distractors.push(
    buildDistractor('wrong-color-member', correctAnswer, (cell) => {
      const idx = 0;
      const wrongColor = colors.find((c) => c !== cell[idx].color) ?? colors[0];
      return cell.map((s, i) => (i === idx ? { ...s, color: wrongColor } : s));
    })
  );

  const options = finalizeOptions(rng, correctAnswer, distractors, cfg.optionCount);

  return {
    id: makeId('construction', rng),
    ruleType: 'construction',
    difficulty,
    grid,
    correctAnswer,
    options,
    explanation: {
      summary: `In each row, cell 3 is built from ${OPERATOR_TEXT[operator]}.`,
      steps: [
        { stepType: 'inventory', text: 'List every shape you see in cell 1, and every shape in cell 2.' },
        { stepType: 'rule-finding', text: `The third cell always shows ${OPERATOR_TEXT[operator]} — find that combining rule in one full row.` },
        { stepType: 'elimination', text: 'Cross out options with a shape missing, an extra shape, or the wrong combining rule applied.' },
      ],
    },
    meta: { varyingAttributes: ['shapeSet', operator], seed: seed ?? 0, generatedAt: Date.now() },
  };
}
