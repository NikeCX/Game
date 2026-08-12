import { useMemo, useState } from 'react';
import { generatePuzzle } from '../../generators/puzzleFactory';
import { stringToSeed } from '../../generators/core/rng';
import { RULES, METHOD_STEPS } from '../../data/rules';
import { useGameStore } from '../../store/useGameStore';
import Header from '../layout/Header';
import InventoryPanel from './InventoryPanel';
import RuleFindingPanel from './RuleFindingPanel';
import EliminationPanel from './EliminationPanel';

const PANELS = { inventory: InventoryPanel, 'rule-finding': RuleFindingPanel, elimination: EliminationPanel };

export default function TutorialStepper({ ruleId, onNavigate }) {
  const rule = RULES[ruleId];
  const completeTutorial = useGameStore((s) => s.completeTutorial);
  const [stepIndex, setStepIndex] = useState(0);

  const puzzle = useMemo(() => generatePuzzle(ruleId, 2, stringToSeed(`tutorial-${ruleId}`)), [ruleId]);

  const step = METHOD_STEPS[stepIndex];
  const Panel = PANELS[step.stepType];
  const isLast = stepIndex === METHOD_STEPS.length - 1;

  function handleNext() {
    if (isLast) {
      completeTutorial(ruleId);
      onNavigate('practice', ruleId);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  return (
    <div className="screen tutorial-screen">
      <Header onBackToWorlds={() => onNavigate('home')} subtitle={`Learn: ${rule.name}`} />
      <div className="tutorial-screen__body">
        <p className="tutorial-screen__rule-description">{rule.description}</p>
        <div className="tutorial-steps-nav">
          {METHOD_STEPS.map((s, i) => (
            <div key={s.stepType} className={`tutorial-steps-nav__dot ${i === stepIndex ? 'is-active' : ''} ${i < stepIndex ? 'is-done' : ''}`}>
              {i + 1}. {s.label}
            </div>
          ))}
        </div>
        <Panel puzzle={puzzle} blurb={step.blurb} />
        <div className="tutorial-screen__actions">
          {stepIndex > 0 && (
            <button type="button" className="btn btn--ghost" onClick={() => setStepIndex((i) => i - 1)}>
              Back
            </button>
          )}
          <button type="button" className="btn btn--primary" onClick={handleNext}>
            {isLast ? 'Try one yourself →' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
