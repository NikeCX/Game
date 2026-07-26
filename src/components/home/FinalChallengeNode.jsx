export default function FinalChallengeNode({ unlocked, bestScore, onClick }) {
  return (
    <div className={`final-challenge-node ${unlocked ? '' : 'final-challenge-node--locked'}`}>
      <div className="final-challenge-node__top">
        <span className="final-challenge-node__icon">{unlocked ? '🏁' : '🔒'}</span>
      </div>
      <h3 className="final-challenge-node__name">Final Challenge</h3>
      <p className="final-challenge-node__tagline">
        {unlocked ? 'A timed, adaptive test mixing all 5 rules — just like the real thing.' : 'Complete all 5 tutorials to unlock.'}
      </p>
      {bestScore > 0 && <p className="final-challenge-node__stats">Best score: {bestScore}/10</p>}
      <button type="button" className="btn btn--accent" onClick={onClick} disabled={!unlocked}>
        {unlocked ? 'Start Challenge' : 'Locked'}
      </button>
    </div>
  );
}
