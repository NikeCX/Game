export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {title && <h2 className="modal-card__title">{title}</h2>}
        <div className="modal-card__body">{children}</div>
      </div>
    </div>
  );
}
