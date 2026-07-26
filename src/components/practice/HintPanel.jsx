const MAX_HINT_LEVEL = 3;

export default function HintPanel({ hintLevel, onReveal, rule, puzzle }) {
  return (
    <div className="hint-panel">
      {hintLevel < MAX_HINT_LEVEL && (
        <button type="button" className="btn btn--ghost btn--small" onClick={onReveal}>
          💡 Hint ({hintLevel}/{MAX_HINT_LEVEL})
        </button>
      )}
      {hintLevel >= 1 && <p className="hint-panel__text">{rule.methodHint}</p>}
      {hintLevel >= 2 && <p className="hint-panel__text">Look closely at the highlighted row and column above — the answer must fit both.</p>}
      {hintLevel >= 3 && <p className="hint-panel__text hint-panel__text--reveal">{puzzle.explanation.summary}</p>}
    </div>
  );
}
