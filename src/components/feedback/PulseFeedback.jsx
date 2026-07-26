/** Wraps children with a correct/incorrect CSS animation class driven by `state` (true/false/null). */
export default function PulseFeedback({ state, children }) {
  const cls = state === true ? 'pulse-correct' : state === false ? 'shake-incorrect' : '';
  return <div className={cls}>{children}</div>;
}
