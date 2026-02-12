import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routePaths';
import styles from './NoAccess.module.css';

/**
 * 권한 없음(403) — Guard에서 페이지 접근 시 리다이렉트 대상
 */
export function NoAccess() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>403</h1>
      <p className={styles.message}>이 페이지에 접근할 권한이 없습니다.</p>
      <Link to={ROUTES.HOME} className={styles.link}>
        대시보드로
      </Link>
    </div>
  );
}
