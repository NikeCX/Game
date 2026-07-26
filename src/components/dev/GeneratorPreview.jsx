import { useState } from 'react';
import { generatePuzzle } from '../../generators/puzzleFactory';
import { RULE_IDS } from '../../data/rules';
import MatrixGrid from '../matrix/MatrixGrid';
import AnswerOptions from '../matrix/AnswerOptions';

/** Dev-only mass-generation QA view. Visit with ?dev=preview to spot-check
 * that generators always produce exactly one correct, plausible answer. */
export default function GeneratorPreview() {
  const [ruleId, setRuleId] = useState(RULE_IDS[0]);
  const [difficulty, setDifficulty] = useState(1);
  const [count, setCount] = useState(12);
  const [seedTick, setSeedTick] = useState(0);

  const puzzles = Array.from({ length: count }, () => generatePuzzle(ruleId, difficulty));

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Generator Preview (dev only)</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <select value={ruleId} onChange={(e) => setRuleId(e.target.value)}>
          {RULE_IDS.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((d) => (
            <option key={d} value={d}>
              difficulty {d}
            </option>
          ))}
        </select>
        <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: 60 }} />
        <button type="button" onClick={() => setSeedTick((t) => t + 1)}>
          Regenerate
        </button>
      </div>
      <div key={seedTick} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {puzzles.map((p) => {
          const correctId = p.options.find((o) => o.isCorrect).id;
          return (
            <div key={p.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12 }}>
              <p style={{ fontSize: 12, color: '#666' }}>
                {p.ruleType} · d{p.difficulty} · {p.options.length} options
              </p>
              <MatrixGrid grid={p.grid} />
              <AnswerOptions options={p.options} selectedId={null} revealedCorrectId={correctId} onSelect={() => {}} disabled />
              <p style={{ fontSize: 11, color: '#999' }}>{p.explanation.summary}</p>
              <p style={{ fontSize: 10, color: '#bbb' }}>{p.options.map((o) => o.distractorType || 'CORRECT').join(', ')}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
