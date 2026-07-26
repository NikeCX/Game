// Small seedable PRNG (mulberry32) so puzzles can be reproduced (tutorials
// use a fixed seed) while practice/challenge puzzles use Date.now()-based seeds.

/** @returns {() => number} a function returning floats in [0, 1) */
export function createRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

/** Deterministic seed from a string — used for reproducible tutorial examples. */
export function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

export function randomInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function choice(rng, arr) {
  return arr[randomInt(rng, 0, arr.length - 1)];
}

export function shuffle(rng, arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(rng, 0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sample(rng, arr, n) {
  return shuffle(rng, arr).slice(0, Math.min(n, arr.length));
}
