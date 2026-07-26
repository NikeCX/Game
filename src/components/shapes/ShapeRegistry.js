// Pure geometry for each shape, normalized to a 0-100 viewBox centered at
// (50, 50). ShapePrimitive.jsx turns these descriptors into SVG elements.

const CX = 50;
const CY = 50;
const R = 38;

function polygonPoints(sides, cx, cy, r, rotationDeg = -90) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const angle = (rotationDeg + (360 / sides) * i) * (Math.PI / 180);
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return pts;
}

function starPoints(spikes, cx, cy, outerR, innerR, rotationDeg = -90) {
  const pts = [];
  const step = Math.PI / spikes;
  let angle = rotationDeg * (Math.PI / 180);
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    angle += step;
  }
  return pts;
}

function rotatePoint([x, y], cx, cy, deg) {
  const rad = (deg * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * Math.cos(rad) - dy * Math.sin(rad), cy + dx * Math.sin(rad) + dy * Math.cos(rad)];
}

function toPointsString(pts) {
  return pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
}

function plusPoints(cx, cy, r, rotationDeg = 0) {
  const arm = r * 0.32;
  const len = r;
  const raw = [
    [cx - arm, cy - len],
    [cx + arm, cy - len],
    [cx + arm, cy - arm],
    [cx + len, cy - arm],
    [cx + len, cy + arm],
    [cx + arm, cy + arm],
    [cx + arm, cy + len],
    [cx - arm, cy + len],
    [cx - arm, cy + arm],
    [cx - len, cy + arm],
    [cx - len, cy - arm],
    [cx - arm, cy - arm],
  ];
  return rotationDeg ? raw.map((p) => rotatePoint(p, cx, cy, rotationDeg)) : raw;
}

// Deliberately, DRAMATICALLY scalene (legs in roughly a 3:1 ratio, not just
// technically-unequal) so mirroring is obviously distinct from every
// rotation even at small render sizes -- used by the Symmetry rule. A
// near-isosceles triangle is mathematically asymmetric but can still look
// the same to the eye; a long thin wedge cannot be mistaken either way.
function rightTrianglePoints(cx, cy, r) {
  return [
    [cx - r * 0.5, cy + r * 0.75],
    [cx - r * 0.5, cy - r * 0.95],
    [cx + r * 0.1, cy + r * 0.75],
  ];
}

function flagPoints(cx, cy, r) {
  return [
    [cx - r * 0.15, cy - r],
    [cx - r * 0.15, cy + r],
    [cx - r * 0.5, cy + r * 0.55],
    [cx + r * 0.75, cy - r * 0.25],
  ];
}

function arrowPoints(cx, cy, r) {
  const shaftHalf = r * 0.18;
  const headHalf = r * 0.5;
  return [
    [cx - shaftHalf, cy + r],
    [cx - shaftHalf, cy - r * 0.15],
    [cx - headHalf, cy - r * 0.15],
    [cx, cy - r],
    [cx + headHalf, cy - r * 0.15],
    [cx + shaftHalf, cy - r * 0.15],
    [cx + shaftHalf, cy + r],
  ];
}

function semicirclePath(cx, cy, r) {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z`;
}

export function getShapeGeometry(shape) {
  switch (shape) {
    case 'circle':
      return { type: 'circle', cx: CX, cy: CY, r: R };
    case 'square':
      return { type: 'rect', x: CX - R * 0.85, y: CY - R * 0.85, width: R * 1.7, height: R * 1.7, rx: 6 };
    case 'triangle':
      return { type: 'polygon', points: toPointsString(polygonPoints(3, CX, CY, R)) };
    case 'pentagon':
      return { type: 'polygon', points: toPointsString(polygonPoints(5, CX, CY, R)) };
    case 'hexagon':
      return { type: 'polygon', points: toPointsString(polygonPoints(6, CX, CY, R)) };
    case 'heptagon':
      return { type: 'polygon', points: toPointsString(polygonPoints(7, CX, CY, R)) };
    case 'octagon':
      return { type: 'polygon', points: toPointsString(polygonPoints(8, CX, CY, R, -90 + 22.5)) };
    case 'diamond':
      return { type: 'polygon', points: toPointsString(polygonPoints(4, CX, CY, R)) };
    case 'star':
      return { type: 'polygon', points: toPointsString(starPoints(5, CX, CY, R, R * 0.42)) };
    case 'plus':
      return { type: 'polygon', points: toPointsString(plusPoints(CX, CY, R)) };
    case 'cross':
      return { type: 'polygon', points: toPointsString(plusPoints(CX, CY, R, 45)) };
    case 'arrow':
      return { type: 'polygon', points: toPointsString(arrowPoints(CX, CY, R)) };
    case 'semicircle':
      return { type: 'path', d: semicirclePath(CX, CY, R) };
    case 'flag':
      return { type: 'polygon', points: toPointsString(flagPoints(CX, CY, R)) };
    case 'rightTriangle':
      return { type: 'polygon', points: toPointsString(rightTrianglePoints(CX, CY, R)) };
    default:
      return { type: 'circle', cx: CX, cy: CY, r: R };
  }
}
