import ShapePrimitive from './ShapePrimitive';
import { LAYOUT_SLOTS } from '../../data/shapes';

const SLOT_STYLES = {
  center: { width: '68%', height: '68%', top: '16%', left: '16%' },
  left: { width: '46%', height: '68%', top: '16%', left: '2%' },
  right: { width: '46%', height: '68%', top: '16%', right: '2%' },
  top: { width: '50%', height: '46%', top: '4%', left: '25%' },
  bottomLeft: { width: '46%', height: '46%', bottom: '6%', left: '4%' },
  bottomRight: { width: '46%', height: '46%', bottom: '6%', right: '4%' },
};

/** @param {{ cell: import('../../data/puzzleTypes.js').Cell, blank?: boolean, highlighted?: boolean, className?: string }} props */
export default function Cell({ cell, blank = false, highlighted = false, className = '' }) {
  const isBlank = blank || !cell || cell.length === 0;

  return (
    <div className={`mx-cell ${highlighted ? 'mx-cell--highlighted' : ''} ${className}`}>
      {isBlank ? (
        <span className="mx-cell__question">?</span>
      ) : (
        (LAYOUT_SLOTS[Math.min(cell.length, 3)] || LAYOUT_SLOTS[1]).map((slotName, i) => (
          <div key={i} className="mx-cell__slot" style={{ position: 'absolute', ...SLOT_STYLES[slotName] }}>
            <ShapePrimitive {...cell[i]} />
          </div>
        ))
      )}
    </div>
  );
}
