import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import styles from './SalesSupportPage.module.css';

/**
 * 영업 지원 — 임시 플레이스홀더 (추가 메뉴 확장 시 교체)
 */
export function SalesSupportPage() {
  return (
    <PageShell path={ROUTES.SALES_SUPPORT} description="영업 지원 메뉴입니다. 추후 기능이 추가됩니다.">
      <div className={styles.placeholder}>
        <p className={styles.message}>영업 지원 현황 (임시)</p>
        <p className={styles.hint}>이 메뉴는 추후 구성 예정입니다.</p>
      </div>
    </PageShell>
  );
}
