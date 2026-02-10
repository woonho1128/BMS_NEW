import React, { useEffect } from 'react';
import { classnames } from '../../utils/classnames';
import styles from './Drawer.module.css';

/**
 * 우측 슬라이드 오버 Drawer
 * @param {{ open: boolean; onClose: () => void; width?: string; children: React.ReactNode; className?: string }}
 */
export function Drawer({ open, onClose, width = '45%', children, className }) {
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
    <div
      className={classnames(styles.overlay, open && styles.overlayVisible)}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={classnames(styles.panel, open && styles.panelVisible, className)}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
