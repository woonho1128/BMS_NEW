import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import styles from './SalesTrendsPage.module.css';

/**
 * 매출 동향 (시장 분석) — 개인 KPI(/analytics/sales)와 별도 메뉴·화면
 */
export function SalesTrendsPage() {
  return (
    <PageShell path={ROUTES.ANALYTICS_TRENDS} description="매출 동향을 조회합니다.">
      <div className={styles.placeholder}>
        <p className={styles.message}>매출 동향</p>
        <p className={styles.hint}>시장 분석용 매출 동향 화면입니다. 추후 차트·데이터 연동 예정.</p>
      </div>
    </PageShell>
  );
}
