import { ALL_SHAPES, POLYGON_FAMILY, CHIRAL_SHAPES, COLOR_PALETTE, SIZES } from '../../data/shapes.js';
import { choice, randomInt } from './rng.js';

export function shapeDomain(count) {
  return ALL_SHAPES.slice(0, Math.max(3, count));
}

export function colorDomain(count) {
  return COLOR_PALETTE.slice(0, Math.max(3, count)).map((c) => c.hex);
}

export function sizeDomain(count) {
  return SIZES.slice(0, Math.max(1, count));
}

export function randomShape(rng, count) {
  return choice(rng, shapeDomain(count));
}

export function randomColor(rng, count) {
  return choice(rng, colorDomain(count));
}

export function randomSize(rng, count) {
  return choice(rng, sizeDomain(count));
}

export function randomRotation(rng, steps) {
  return choice(rng, steps);
}

/** Build a fully-specified shape instance, with any field overridable. */
export function makeShapeInstance(rng, cfg, overrides = {}) {
  return {
    shape: overrides.shape ?? randomShape(rng, cfg.shapeCount),
    size: overrides.size ?? randomSize(rng, cfg.sizeCount),
    color: overrides.color ?? randomColor(rng, cfg.colorCount),
    rotation: overrides.rotation ?? 0,
    fillStyle: overrides.fillStyle ?? 'solid',
    mirror: overrides.mirror ?? 'none',
  };
}

export function polygonIndex(shape) {
  return POLYGON_FAMILY.indexOf(shape);
}

export function polygonAt(index) {
  const clamped = Math.min(POLYGON_FAMILY.length - 1, Math.max(0, index));
  return POLYGON_FAMILY[clamped];
}

export function randomChiralShape(rng) {
  return choice(rng, CHIRAL_SHAPES);
}

export const SIZE_ORDER = SIZES; // ['small','medium','large']

export function sizeIndex(size) {
  return SIZE_ORDER.indexOf(size);
}

export function sizeAt(index) {
  const clamped = Math.min(SIZE_ORDER.length - 1, Math.max(0, index));
  return SIZE_ORDER[clamped];
}

export function randomRotationStep(rng, steps, direction) {
  const magnitude = choice(rng, steps);
  return direction * magnitude;
}

export function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}
