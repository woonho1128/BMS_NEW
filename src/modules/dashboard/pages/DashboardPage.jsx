import React from 'react';
import styles from './DashboardPage.module.css';

const KPI_CARDS = [
  { label: '이번 달 매출', value: '₩ 1,250,000,000', change: '+12%' },
  { label: '신규 고객', value: '142', change: '+8%' },
  { label: '진행 중인 거래', value: '28', change: '-2%' },
  { label: '전환율', value: '34%', change: '+5%' },
];

const RECENT_ACTIVITIES = [
  { id: 1, text: '김영업 — A사 미팅 완료', time: '10분 전' },
  { id: 2, text: '이매니저 — B사 견적 승인', time: '1시간 전' },
  { id: 3, text: '박대리 — C사 출고 요청 등록', time: '2시간 전' },
  { id: 4, text: '정팀장 — 월간 보고서 제출', time: '어제' },
];

export function DashboardPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>At-a-glance overview of key metrics</p>

      <section className={styles.kpiGrid}>
        {KPI_CARDS.map((card) => (
          <div key={card.label} className={styles.kpiCard}>
            <div className={styles.kpiLabel}>{card.label}</div>
            <div className={styles.kpiValue}>{card.value}</div>
            <div className={styles.kpiChange}>{card.change}</div>
          </div>
        ))}
      </section>

      <div className={styles.twoCol}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent activities</h2>
          <ul className={styles.activityList}>
            {RECENT_ACTIVITIES.map((a) => (
              <li key={a.id} className={styles.activityItem}>
                <span className={styles.activityText}>{a.text}</span>
                <span className={styles.activityTime}>{a.time}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Charts (placeholder)</h2>
          <div className={styles.chartPlaceholder}>
            <p>Sales trend / Performance chart area (dummy)</p>
          </div>
        </section>
      </div>
    </div>
  );
}
