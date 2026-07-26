export default function AnimatedExample({ stepKey, children }) {
  return (
    <div className="animated-example" key={stepKey}>
      {children}
    </div>
  );
}
