export default function Timer({ remaining }) {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining <= 30;

  return (
    <div className={`timer ${isLow ? 'timer--low' : ''}`}>
      ⏱ {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}
