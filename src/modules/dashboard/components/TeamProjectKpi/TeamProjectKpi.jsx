import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTeamProjectKpi } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './TeamProjectKpi.module.css';

function percent(actual, plan) {
  if (!plan) return 0;
  return Math.round((actual / plan) * 100);
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

export function TeamProjectKpi() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchTeamProjectKpi({ scope: 'PROJECT_MENU' }).then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !data) {
    return (
      <Card title="프로젝트 KPI 요약">
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  const personalRate = percent(data.personal.actual, data.personal.plan);
  const teamRate = percent(data.team.actual, data.team.plan);

  return (
    <Card title="프로젝트 KPI 요약">
      <div className={styles.grid}>
        <button type="button" className={styles.metricCard} onClick={() => navigate(ROUTES.ANALYTICS_PERSONAL_SALES)}>
          <p className={styles.metricTitle}>개인별 매출 현황 요약</p>
          <p className={styles.metricValue}>{personalRate}%</p>
          <p className={styles.metricMeta}>실적 {formatMoney(data.personal.actual)} / 계획 {formatMoney(data.personal.plan)}</p>
        </button>

        <button type="button" className={styles.metricCard} onClick={() => navigate(ROUTES.ANALYTICS_RETAIL)}>
          <p className={styles.metricTitle}>팀별 매출 현황 요약</p>
          <p className={styles.metricValue}>{teamRate}%</p>
          <p className={styles.metricMeta}>실적 {formatMoney(data.team.actual)} / 계획 {formatMoney(data.team.plan)}</p>
        </button>

        <button type="button" className={styles.metricCard} onClick={() => navigate(ROUTES.SHORT_PROJECT_REGISTER)}>
          <p className={styles.metricTitle}>단납 현장 등록 상신 요약</p>
          <p className={styles.metricValue}>{data.shortProject.submitted}건</p>
          <p className={styles.metricMeta}>승인 {data.shortProject.approved}건 / 대기 {data.shortProject.pending}건</p>
        </button>

        <button type="button" className={styles.metricCard} onClick={() => navigate(ROUTES.SHORT_PROJECT_REGISTER)}>
          <p className={styles.metricTitle}>단납 할인 금액 요약</p>
          <p className={styles.metricValue}>{formatMoney(data.shortProject.discountAmount)}</p>
          <p className={styles.metricMeta}>프로젝트 단납 상신 누계</p>
        </button>
      </div>
    </Card>
  );
}
