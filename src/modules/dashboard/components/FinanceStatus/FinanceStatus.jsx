import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFinanceStatus } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './FinanceStatus.module.css';

function formatAmount(n) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n?.toLocaleString() ?? '0';
}

const scopeMeta = {
  PROJECT_MENU: { title: '프로젝트 정산/채권 현황', path: ROUTES.FINANCE_RECEIVABLE },
  RETAIL_MENU: { title: '리테일 매출/채권 현황', path: ROUTES.FINANCE_RECEIVABLE },
  DEALER_PORTAL: { title: '대리점 정산 현황', path: ROUTES.PARTNER_BALANCE_CONFIRM },
};

export function FinanceStatus({ role = 'TEAM_MEMBER', scope = 'RETAIL_MENU' }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFinanceStatus({ role, scope }).then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [role, scope]);

  const meta = useMemo(() => scopeMeta[scope] || scopeMeta.RETAIL_MENU, [scope]);

  if (loading || !data) {
    return (
      <Card title={meta.title}>
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card title={meta.title} hoverable clickable onClick={() => navigate(meta.path)}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <span className={styles.label}>미수금 합계</span>
          <span className={styles.amount}>{formatAmount(data.receivablesTotal)}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>30일 이상 연체</span>
          <span className={data.overdueOver30Days > 0 ? styles.amountAlert : styles.amount}>{data.overdueOver30Days}건</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>당월 수금 예정</span>
          <span className={styles.amount}>{formatAmount(data.expectedThisMonth)}</span>
        </li>
      </ul>
    </Card>
  );
}
