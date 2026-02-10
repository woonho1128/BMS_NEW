import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import styles from './ShortProjectPage.module.css';

/**
 * 단납 프로젝트 현황 (리테일 영업) — 손익분석(/profit)과 별도 메뉴·화면
 */
export function ShortProjectPage() {
  return (
    <PageShell path={ROUTES.SHORT_PROJECT} description="단납 프로젝트 현황을 조회합니다.">
      <div className={styles.placeholder}>
        <p className={styles.message}>단납 프로젝트 현황</p>
        <p className={styles.hint}>리테일 영업용 단납 프로젝트 화면입니다. 추후 목록·상세 기능 연동 예정.</p>
      </div>
    </PageShell>
  );
}
