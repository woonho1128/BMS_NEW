import React, { useEffect } from 'react';
import { classnames } from '../../utils/classnames';
import styles from './Modal.module.css';

/**
 * @param {{ open: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: 'sm'|'md'|'lg'|'xl' }}
 */
export function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      <div
        className={classnames(styles.dialog, styles[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>{title}</h2>
            <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">
              ×
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
