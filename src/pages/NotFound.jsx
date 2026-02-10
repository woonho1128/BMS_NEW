import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routePaths';
import styles from './NotFound.module.css';

export function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>페이지를 찾을 수 없습니다.</p>
      <Link to={ROUTES.HOME} className={styles.link}>
        홈으로
      </Link>
    </div>
  );
}
