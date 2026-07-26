import { useState } from 'react';
import HomeScreen from './components/home/HomeScreen';
import TutorialStepper from './components/tutorial/TutorialStepper';
import PracticeScreen from './components/practice/PracticeScreen';
import ChallengeScreen from './components/challenge/ChallengeScreen';
import GeneratorPreview from './components/dev/GeneratorPreview';

function isDevPreview() {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('dev') === 'preview';
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [activeRuleId, setActiveRuleId] = useState(null);

  if (isDevPreview()) return <GeneratorPreview />;

  function onNavigate(nextScreen, ruleId) {
    setScreen(nextScreen);
    if (ruleId) setActiveRuleId(ruleId);
    window.scrollTo(0, 0);
  }

  if (screen === 'tutorial' && activeRuleId) return <TutorialStepper ruleId={activeRuleId} onNavigate={onNavigate} />;
  if (screen === 'practice' && activeRuleId) return <PracticeScreen ruleId={activeRuleId} onNavigate={onNavigate} />;
  if (screen === 'challenge') return <ChallengeScreen onNavigate={onNavigate} />;
  return <HomeScreen onNavigate={onNavigate} />;
}
