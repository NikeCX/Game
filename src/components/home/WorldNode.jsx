import { RULES } from '../../data/rules';
import { masteryLabel } from '../../data/mastery';

const MASTERY_ICON = { none: '☆', bronze: '🥉', silver: '🥈', gold: '🏆' };

export default function WorldNode({ ruleId, progress, mastery, onTutorial, onPractice }) {
  const rule = RULES[ruleId];
  const label = masteryLabel(mastery);
  const accuracy = progress.puzzlesAttempted ? Math.round((progress.puzzlesCorrect / progress.puzzlesAttempted) * 100) : null;

  return (
    <div className="world-node" style={{ '--world-color': rule.color }}>
      <div className="world-node__top">
        <span className="world-node__icon">{rule.icon}</span>
        <span className="world-node__mastery" title={`Mastery: ${label}`}>
          {MASTERY_ICON[label]}
        </span>
      </div>
      <h3 className="world-node__name">{rule.name}</h3>
      <p className="world-node__tagline">{rule.tagline}</p>
      {accuracy !== null && (
        <p className="world-node__stats">
          {progress.puzzlesCorrect}/{progress.puzzlesAttempted} correct ({accuracy}%)
        </p>
      )}
      <div className="world-node__actions">
        <button type="button" className="btn btn--ghost" onClick={onTutorial}>
          {progress.tutorialCompleted ? '↺ Review' : '▶ Learn'}
        </button>
        <button type="button" className="btn btn--primary" onClick={onPractice}>
          Practice
        </button>
      </div>
    </div>
  );
}
