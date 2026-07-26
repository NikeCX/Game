// Shape/attribute vocabulary shared by every puzzle generator and renderer.

// Ordered by number of sides — used by the Progression generator for the
// classic "shape gains a side each step" pattern (triangle -> square -> ...).
export const POLYGON_FAMILY = ['triangle', 'square', 'pentagon', 'hexagon', 'heptagon', 'octagon'];

// Chiral shapes have NO symmetry axis at all, so mirroring them always looks
// different from every rotation (unlike e.g. a semicircle, whose 180° rotation
// happens to look identical to a horizontal mirror). This is what makes the
// Symmetry generator's "rotated-not-mirrored" distractor reliably work.
export const CHIRAL_SHAPES = ['rightTriangle', 'flag'];

// Full shape vocabulary used across all generators.
export const ALL_SHAPES = [
  'circle',
  'square',
  'triangle',
  'star',
  'pentagon',
  'hexagon',
  'heptagon',
  'octagon',
  'plus',
  'diamond',
  'cross',
  'arrow',
  'semicircle',
  'flag',
  'rightTriangle',
];

// Okabe-Ito colorblind-safe palette.
export const COLOR_PALETTE = [
  { id: 'orange', hex: '#E69F00' },
  { id: 'skyblue', hex: '#56B4E9' },
  { id: 'green', hex: '#009E73' },
  { id: 'yellow', hex: '#DDCC00' },
  { id: 'blue', hex: '#0072B2' },
  { id: 'vermillion', hex: '#D55E00' },
  { id: 'purple', hex: '#CC79A7' },
];

export const SIZES = ['small', 'medium', 'large'];

export const SIZE_SCALE = {
  small: 0.55,
  medium: 0.75,
  large: 1.0,
};

export const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];

export const FILL_STYLES = ['solid', 'outline'];

// 'none' = no mirroring; used together with `rotation` so reflections stay
// visually distinct from rotations for chiral shapes (the Symmetry rule's
// core teaching point).
export const MIRROR_VALUES = ['none', 'horizontal', 'vertical'];

/** Canonical layout slots for 1-3 shapes stacked in a single cell. */
export const LAYOUT_SLOTS = {
  1: ['center'],
  2: ['left', 'right'],
  3: ['top', 'bottomLeft', 'bottomRight'],
};
