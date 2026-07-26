import { cellSignature, cloneCell, makeId } from './gridUtils.js';
import { shuffle } from './rng.js';

/**
 * Build a labeled distractor candidate: a mutator function receives a fresh
 * clone of the correct cell and must return a *new* cell that breaks exactly
 * one aspect of the rule.
 * @param {string} distractorType
 * @param {import('../../data/puzzleTypes.js').Cell} correctCell
 * @param {(cell: import('../../data/puzzleTypes.js').Cell) => import('../../data/puzzleTypes.js').Cell} mutator
 */
export function buildDistractor(distractorType, correctCell, mutator) {
  const mutated = mutator(cloneCell(correctCell));
  return { distractorType, cell: mutated };
}

/** Pick a value from `domain` that differs from `current`. */
export function pickDistinctWrongValue(rng, domain, current) {
  const candidates = domain.filter((v) => v !== current);
  if (candidates.length === 0) return current;
  return candidates[Math.floor(rng() * candidates.length)];
}

/**
 * Take raw distractor candidates (may contain duplicates of each other or of
 * the correct answer), dedupe, shuffle, cap to `targetCount`, always include
 * the correct answer, and return a shuffled, id-assigned options array.
 */
export function finalizeOptions(rng, correctCell, distractorCandidates, targetCount) {
  const correctSig = cellSignature(correctCell);
  const seen = new Set([correctSig]);
  const uniqueDistractors = [];
  for (const candidate of distractorCandidates) {
    const sig = cellSignature(candidate.cell);
    if (seen.has(sig)) continue;
    seen.add(sig);
    uniqueDistractors.push(candidate);
  }

  const wantedDistractors = Math.max(1, targetCount - 1);
  const chosen = shuffle(rng, uniqueDistractors).slice(0, wantedDistractors);

  const optionSeeds = [
    { cell: correctCell, isCorrect: true, distractorType: null },
    ...chosen.map((d) => ({ cell: d.cell, isCorrect: false, distractorType: d.distractorType })),
  ];

  return shuffle(rng, optionSeeds).map((opt) => ({
    id: makeId('opt', rng),
    cell: opt.cell,
    isCorrect: opt.isCorrect,
    distractorType: opt.distractorType,
  }));
}
