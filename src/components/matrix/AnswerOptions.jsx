import Cell from '../shapes/Cell';

/**
 * @param {{
 *   options: import('../../data/puzzleTypes.js').PuzzleOption[],
 *   selectedId?: string|null,
 *   revealedCorrectId?: string|null,
 *   onSelect: (id: string) => void,
 *   disabled?: boolean,
 * }} props
 */
export default function AnswerOptions({ options, selectedId = null, revealedCorrectId = null, onSelect, disabled = false }) {
  return (
    <div className="answer-options" role="group" aria-label="Answer options">
      {options.map((opt, i) => {
        let state = 'default';
        if (revealedCorrectId) {
          if (opt.id === revealedCorrectId) state = 'correct';
          else if (opt.id === selectedId) state = 'incorrect';
        } else if (opt.id === selectedId) {
          state = 'selected';
        }
        return (
          <button
            key={opt.id}
            type="button"
            className={`answer-option answer-option--${state}`}
            onClick={() => !disabled && onSelect(opt.id)}
            disabled={disabled}
            aria-label={`Option ${i + 1}`}
            aria-pressed={opt.id === selectedId}
          >
            <Cell cell={opt.cell} />
          </button>
        );
      })}
    </div>
  );
}
