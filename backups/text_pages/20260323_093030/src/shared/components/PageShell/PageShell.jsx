import React from 'react';
import { getPageTitleByPath } from '../../constants/ia';
import { classnames } from '../../utils/classnames';
import styles from './PageShell.module.css';

/**
 * 공통 페이지 프레임 (타이틀/설명)
 * @param {{ title?: string; description?: string; path?: string; variant?: string; actions?: React.ReactNode; titleAddon?: React.ReactNode; children?: React.ReactNode }} props
 * @param variant - 'dashboard' 시 헤더를 더 조용하게 (작은 타이틀)
 * @param actions - 헤더 우측 액션 버튼 (제공 시 한 줄 레이아웃)
 */
export function PageShell({ title, description, path, variant, actions, titleAddon, children, className }) {
  const displayTitle = title ?? (path ? getPageTitleByPath(path) : '');
  const isDashboard = variant === 'dashboard';
  const hasActions = Boolean(actions);
  const hasHeaderContent = Boolean(displayTitle || description || titleAddon || hasActions);

  return (
    <div className={classnames(styles.shell, className)}>
      {hasHeaderContent && (
        <header className={classnames(styles.header, isDashboard && styles.headerDashboard, hasActions && styles.headerWithActions)}>
          <div className={styles.headerText}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{displayTitle}</h1>
              {titleAddon}
            </div>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {hasActions && <div className={styles.headerActions}>{actions}</div>}
        </header>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
