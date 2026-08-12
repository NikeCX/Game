// Metadata for the 5 Matrigma rule categories the game teaches.

export const RULE_IDS = ['progression', 'rotation', 'construction', 'frequency', 'symmetry'];

export const RULES = {
  progression: {
    id: 'progression',
    name: 'Progression',
    tagline: 'Shapes change step by step',
    description:
      'Shapes evolve gradually across a row or column — a count grows, a shape gains sides, or a size increases by the same amount each step.',
    prepText:
      'This is the most common pattern in real assessments like the Matrigma. Spotting the step size fast lets you bank easy points early, before the timer pressure builds on harder items.',
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
    prepText:
      'Recruiters use rotation items to test precision under time pressure — the wrong-direction and wrong-angle answer options are designed to catch candidates who are rushing.',
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
    prepText:
      'This rule tends to show up in the harder, later items on a real test. Candidates who master it consistently score higher, since it separates careful reasoners from guessers.',
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
    prepText:
      'Employers use this pattern to measure systematic thinking under time pressure. Training the habit of scanning both the row and column before answering pays off across the whole test.',
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
    prepText:
      'This is the rule candidates get wrong most often under time pressure, because a rotation can look deceptively similar to a mirror image at a glance. Practicing the difference here builds an instinct you can trust on test day.',
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
