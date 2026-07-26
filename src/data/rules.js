// Metadata for the 5 Matrigma rule categories the game teaches.

export const RULE_IDS = ['progression', 'rotation', 'construction', 'frequency', 'symmetry'];

export const RULES = {
  progression: {
    id: 'progression',
    name: 'Progression',
    tagline: 'Shapes change step by step',
    description:
      'Shapes evolve gradually across a row or column — a count grows, a shape gains sides, or a size increases by the same amount each step.',
    methodHint: 'Compare cell 1 to cell 2, then cell 2 to cell 3. What single change repeats each time?',
    icon: '📈',
    color: '#0072B2',
  },
  rotation: {
    id: 'rotation',
    name: 'Rotation',
    tagline: 'Figures turn at a fixed angle',
    description:
      'A shape rotates by the same angle, in the same direction, at every step across a row or column.',
    methodHint: 'Pick one feature of the shape (like a notch or arrow tip) and track where it points.',
    icon: '🔄',
    color: '#D55E00',
  },
  construction: {
    id: 'construction',
    name: 'Construction',
    tagline: 'The third shape is built from the first two',
    description:
      'Combine the elements of the first two cells in a row — what appears in either, both, or only one, forms the third cell.',
    methodHint: 'List what is in cell 1, list what is in cell 2, then decide the rule for combining them.',
    icon: '🧩',
    color: '#009E73',
  },
  frequency: {
    id: 'frequency',
    name: 'Distribution',
    tagline: 'Each value appears exactly once per row & column',
    description:
      'Every row and every column contains each shape, size, or color exactly once — just like a mini sudoku.',
    methodHint: 'For the missing cell, ask: which value is missing from this row AND this column?',
    icon: '🎲',
    color: '#CC79A7',
  },
  symmetry: {
    id: 'symmetry',
    name: 'Symmetry',
    tagline: 'Shapes mirror across an axis',
    description:
      'A shape is reflected across a horizontal, vertical, or diagonal line — its mirror image, not a rotated copy.',
    methodHint: 'Reflections flip left-right or top-bottom; rotations spin around a center point. Don’t mix them up.',
    icon: '🪞',
    color: '#DDCC00',
  },
};

export const METHOD_STEPS = [
  {
    stepType: 'inventory',
    label: 'Inventory',
    blurb: 'List everything you see: shapes, sizes, colors, counts, rotations. Don’t solve yet — just catalog.',
  },
  {
    stepType: 'rule-finding',
    label: 'Rule-Finding',
    blurb: 'Find one rule that explains a row or column. Use it to predict the rest of the grid.',
  },
  {
    stepType: 'elimination',
    label: 'Elimination',
    blurb: 'Check each answer option against your rule. Cross out any option that breaks it.',
  },
];
