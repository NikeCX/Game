import { getShapeGeometry } from './ShapeRegistry';
import { SIZE_SCALE } from '../../data/shapes';

/**
 * Renders one shape instance as an SVG, filling whatever box its parent gives it.
 * @param {import('../../data/puzzleTypes.js').ShapeInstance & { className?: string }} props
 */
export default function ShapePrimitive({ shape, size = 'medium', color = '#333', rotation = 0, fillStyle = 'solid', mirror = 'none', className }) {
  const geometry = getShapeGeometry(shape);
  const scale = SIZE_SCALE[size] ?? 0.75;
  const mirrorX = mirror === 'vertical' ? -1 : 1;
  const mirrorY = mirror === 'horizontal' ? -1 : 1;

  const shapeStyle = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transform: `scale(${scale}) scale(${mirrorX}, ${mirrorY}) rotate(${rotation}deg)`,
  };

  const commonProps = {
    fill: fillStyle === 'outline' ? 'none' : color,
    stroke: fillStyle === 'outline' ? color : 'none',
    strokeWidth: fillStyle === 'outline' ? 7 : 0,
    strokeLinejoin: 'round',
    style: shapeStyle,
  };

  let shapeEl = null;
  if (geometry.type === 'circle') {
    shapeEl = <circle cx={geometry.cx} cy={geometry.cy} r={geometry.r} {...commonProps} />;
  } else if (geometry.type === 'rect') {
    shapeEl = <rect x={geometry.x} y={geometry.y} width={geometry.width} height={geometry.height} rx={geometry.rx} {...commonProps} />;
  } else if (geometry.type === 'polygon') {
    shapeEl = <polygon points={geometry.points} {...commonProps} />;
  } else if (geometry.type === 'path') {
    shapeEl = <path d={geometry.d} {...commonProps} />;
  }

  return (
    <svg viewBox="0 0 100 100" className={className} style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }} aria-hidden="true">
      {shapeEl}
    </svg>
  );
}
