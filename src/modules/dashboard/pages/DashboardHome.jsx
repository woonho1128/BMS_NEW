import React from 'react';
import { DashboardKPI } from '../components/DashboardKPI/DashboardKPI';
import { SalesStatus } from '../components/SalesStatus/SalesStatus';
import { DeliveryStatus } from '../components/DeliveryStatus/DeliveryStatus';
import { FinanceStatus } from '../components/FinanceStatus/FinanceStatus';
import { NoticeSummary } from '../components/NoticeSummary/NoticeSummary';
import { ApprovalTodo } from '../components/ApprovalTodo/ApprovalTodo';
import { Guard } from '../../../shared/components/Guard';
import { PERMISSIONS } from '../../../shared/constants/permissions';
import styles from './DashboardPage.module.css';

/**
 * 통합 BMS 대시보드 — 로그인 후 업무 시작 화면.
 * 권한은 Guard로 통일, Role 하드코딩 없음.
 */
export function DashboardHome() {
  return (
    <div className={styles.dashboard}>
      <section className={styles.kpiRow} aria-label="KPI 요약">
        <DashboardKPI />
      </section>
      <div className={styles.blocksGrid}>
        <SalesStatus />
        <DeliveryStatus />
        <FinanceStatus />
        <Guard permission={PERMISSIONS.APPROVAL}>
          <ApprovalTodo />
        </Guard>
        <div className={styles.noticeRow}>
          <NoticeSummary />
        </div>
      </div>
    </div>
  );
}
