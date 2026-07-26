export default function StreakBadge({ current }) {
  return (
    <div className={`streak-badge ${current > 0 ? 'streak-badge--hot' : ''}`} title="Current answer streak">
      <span className="streak-badge__icon">🔥</span>
      <span className="streak-badge__count">{current}</span>
    </div>
  );
}
