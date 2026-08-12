import { useGameStore } from '../../store/useGameStore';
import { selectRuleMastery, selectFinalChallengeUnlocked } from '../../store/selectors';
import { RULE_IDS } from '../../data/rules';
import Header from '../layout/Header';
import WorldNode from './WorldNode';
import FinalChallengeNode from './FinalChallengeNode';

export default function HomeScreen({ onNavigate }) {
  const rules = useGameStore((s) => s.rules);
  const badges = useGameStore((s) => s.badges);
  const bestScore = useGameStore((s) => s.challenge.bestScore);
  const unlocked = useGameStore(selectFinalChallengeUnlocked);

  return (
    <div className="screen home-screen">
      <Header />
      <div className="home-screen__intro">
        <h1>Learn to crack matrix reasoning puzzles</h1>
        <p>Five worlds, five rules. Master each one, then take the timed Final Challenge — just like a real Matrigma test.</p>
      </div>
      <div className="world-grid">
        {RULE_IDS.map((ruleId) => (
          <WorldNode
            key={ruleId}
            ruleId={ruleId}
            progress={rules[ruleId]}
            mastery={selectRuleMastery({ rules }, ruleId)}
            onTutorial={() => onNavigate('tutorial', ruleId)}
            onPractice={() => onNavigate('practice', ruleId)}
          />
        ))}
        <FinalChallengeNode unlocked={unlocked} bestScore={bestScore} onClick={() => onNavigate('challenge')} />
      </div>
      {badges.length > 0 && (
        <div className="home-screen__badges">
          <span className="home-screen__badges-label">{badges.length} badge{badges.length === 1 ? '' : 's'} earned</span>
        </div>
      )}
    </div>
  );
}
