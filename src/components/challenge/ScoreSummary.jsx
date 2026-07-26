import { RULES } from '../../data/rules';

export default function ScoreSummary({ result, onHome, onRetry }) {
  const { score0to10, correctCount, totalItems, perRuleBreakdown } = result;

  return (
    <div className="score-summary">
      <h2 className="score-summary__title">Challenge Complete!</h2>
      <div className="score-summary__score">{score0to10}/10</div>
      <p className="score-summary__tally">
        {correctCount} of {totalItems} correct
      </p>
      <div className="score-summary__breakdown">
        {Object.entries(perRuleBreakdown).map(([ruleId, stats]) => (
          <div key={ruleId} className="score-summary__row">
            <span>
              {RULES[ruleId].icon} {RULES[ruleId].name}
            </span>
            <span>
              {stats.correct}/{stats.attempted}
            </span>
          </div>
        ))}
        {totalItems === 0 && <p className="score-summary__empty">Time ran out before you answered any items — give it another go!</p>}
      </div>
      <div className="score-summary__actions">
        <button type="button" className="btn btn--ghost" onClick={onHome}>
          Home
        </button>
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}
