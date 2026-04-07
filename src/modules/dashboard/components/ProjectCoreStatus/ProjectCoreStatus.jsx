import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjectCoreStatus } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './ProjectCoreStatus.module.css';

const rows = [
  { key: 'draft', label: '임시 저장' },
  { key: 'submitted', label: '상신' },
  { key: 'approved', label: '승인' },
  { key: 'rejected', label: '반려' },
];

export function ProjectCoreStatus() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProjectCoreStatus({ scope: 'PROJECT_MENU' }).then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !data) {
    return (
      <Card title="프로젝트 핵심 현황">
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  const profitTotal = rows.reduce((sum, row) => sum + Number(data.profit?.[row.key] || 0), 0);
  const salesInfoTotal = rows.reduce((sum, row) => sum + Number(data.salesInfo?.[row.key] || 0), 0);
  const specTotal = rows.reduce((sum, row) => sum + Number(data.spec?.[row.key] || 0), 0);

  return (
    <Card title="프로젝트 핵심 현황">
      <div className={styles.grid}>
        <button type="button" className={styles.block} onClick={() => navigate(ROUTES.PROFIT)}>
          <p className={styles.blockTitle}>손익분석 조회 요약</p>
          <ul className={styles.list}>
            {rows.map((row) => (
              <li key={row.key} className={styles.item}>
                <span>{row.label}</span>
                <strong>{data.profit?.[row.key] ?? 0}건</strong>
              </li>
            ))}
          </ul>
          <p className={styles.blockTitle}>합계 {profitTotal}건</p>
        </button>

        <button type="button" className={styles.block} onClick={() => navigate(ROUTES.SALES_INFO)}>
          <p className={styles.blockTitle}>영업정보 등록 조회 요약</p>
          <ul className={styles.list}>
            {rows.map((row) => (
              <li key={row.key} className={styles.item}>
                <span>{row.label}</span>
                <strong>{data.salesInfo?.[row.key] ?? 0}건</strong>
              </li>
            ))}
          </ul>
          <p className={styles.blockTitle}>합계 {salesInfoTotal}건</p>
        </button>

        <button type="button" className={styles.block} onClick={() => navigate(ROUTES.SPEC_STATUS)}>
          <p className={styles.blockTitle}>SPEC-현황 조회 요약</p>
          <ul className={styles.list}>
            {rows.map((row) => (
              <li key={row.key} className={styles.item}>
                <span>{row.label}</span>
                <strong>{data.spec?.[row.key] ?? 0}건</strong>
              </li>
            ))}
          </ul>
          <p className={styles.blockTitle}>합계 {specTotal}건</p>
        </button>
      </div>
    </Card>
  );
}
