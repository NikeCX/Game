import { useGameStore } from '../../store/useGameStore';
import XPBar from './XPBar';
import StreakBadge from './StreakBadge';

export default function Header({ onHome, subtitle }) {
  const totalXp = useGameStore((s) => s.xp.total);
  const streakCurrent = useGameStore((s) => s.streak.current);

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <button type="button" className="app-header__logo" onClick={onHome} aria-label="Go to home">
          <span className="app-header__icon">🧠</span>
          <span className="app-header__title">Matrix Academy</span>
        </button>
        {subtitle && <span className="app-header__subtitle">{subtitle}</span>}
      </div>
      <div className="app-header__stats">
        <StreakBadge current={streakCurrent} />
        <XPBar totalXp={totalXp} />
      </div>
    </header>
  );
}
