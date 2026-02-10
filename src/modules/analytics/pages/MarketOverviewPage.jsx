import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import styles from './MarketOverviewPage.module.css';

/**
 * 시황 파악 (시장 분석) — 사용자 정의 리포트(/analytics/custom)와 별도 메뉴·화면
 */
export function MarketOverviewPage() {
  return (
    <PageShell path={ROUTES.ANALYTICS_MARKET} description="시황을 파악합니다.">
      <div className={styles.placeholder}>
        <p className={styles.message}>시황 파악</p>
        <p className={styles.hint}>시장 분석용 시황 파악 화면입니다. 추후 지표·데이터 연동 예정.</p>
      </div>
    </PageShell>
  );
}
