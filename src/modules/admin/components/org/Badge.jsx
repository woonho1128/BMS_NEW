import React from 'react';
import { classnames } from '../../../../shared/utils/classnames';
import styles from './Badge.module.css';

export function Badge({ variant = 'default', children, className }) {
  return (
    <span className={classnames(styles.badge, styles[variant], className)}>{children}</span>
  );
}
