import React from 'react';
import { classnames } from '../../utils/classnames';
import styles from './Button.module.css';

/**
 * @param {'primary'|'secondary'|'icon'} [variant]
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; children?: React.ReactNode }}
 */
export function Button({ variant = 'primary', className, children, ...props }) {
  return (
    <button
      type="button"
      className={classnames(styles.btn, styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
