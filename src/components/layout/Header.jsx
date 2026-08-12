import { useGameStore } from '../../store/useGameStore';
import LogoMark from './LogoMark';
import XPBar from './XPBar';
import StreakBadge from './StreakBadge';

const MARKETING_SITE_URL = 'https://matrix-academy-test.vercel.app';

export default function Header({ subtitle, onBackToWorlds }) {
  const totalXp = useGameStore((s) => s.xp.total);
  const streakCurrent = useGameStore((s) => s.streak.current);

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <a href={MARKETING_SITE_URL} className="app-header__logo" aria-label="Go to Matrix Academy homepage">
          <LogoMark size={28} className="app-header__icon" />
          <span className="app-header__title">Matrix Academy</span>
        </a>
        {onBackToWorlds && (
          <button type="button" className="app-header__back-link" onClick={onBackToWorlds}>
            ← All Rules
          </button>
        )}
        {subtitle && <span className="app-header__subtitle">{subtitle}</span>}
      </div>
      <div className="app-header__stats">
        <StreakBadge current={streakCurrent} />
        <XPBar totalXp={totalXp} />
      </div>
    </header>
  );
}
