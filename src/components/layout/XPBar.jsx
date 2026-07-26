import { xpProgress } from '../../utils/scoring';

export default function XPBar({ totalXp }) {
  const { level, percent } = xpProgress(totalXp);
  return (
    <div className="xp-bar" title={`Level ${level} — ${totalXp} XP total`}>
      <span className="xp-bar__level">Lv {level}</span>
      <div className="xp-bar__track">
        <div className="xp-bar__fill" style={{ width: `${Math.min(100, percent)}%` }} />
      </div>
    </div>
  );
}
