import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="app-modal-overlay" role="dialog" aria-modal="true" aria-label={title || 'modal'}>
      <div className="app-modal-backdrop" onClick={onClose} />
      <div className="app-modal-content" role="document">
        <div className="app-modal-header">
          <h2>{title}</h2>
          <button className="app-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="app-modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

