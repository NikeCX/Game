export default function FeedbackBanner({ isCorrect, explanation, onNext }) {
  return (
    <div className={`feedback-banner ${isCorrect ? 'feedback-banner--correct' : 'feedback-banner--incorrect'}`}>
      <p className="feedback-banner__headline">{isCorrect ? '✅ Correct!' : '❌ Not quite'}</p>
      <p className="feedback-banner__explanation">{explanation.summary}</p>
      <button type="button" className="btn btn--primary" onClick={onNext}>
        Next puzzle →
      </button>
    </div>
  );
}
