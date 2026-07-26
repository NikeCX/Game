export function cloneCell(cell) {
  return cell.map((s) => ({ ...s }));
}

export function cloneGrid(grid) {
  return grid.map((row) => row.map((cell) => cloneCell(cell)));
}

function shapeSignature(s) {
  return `${s.shape}|${s.size}|${s.color}|${s.rotation}|${s.fillStyle}`;
}

/** Order-independent structural signature — two cells with the same shapes
 * in different array order are considered the same answer. */
export function cellSignature(cell) {
  return cell
    .map(shapeSignature)
    .sort()
    .join('::');
}

export function cellsEqual(a, b) {
  return cellSignature(a) === cellSignature(b);
}

export function makeId(prefix, rng) {
  const rand = Math.floor(rng() * 1e9);
  return `${prefix}-${Date.now().toString(36)}-${rand.toString(36)}`;
}
