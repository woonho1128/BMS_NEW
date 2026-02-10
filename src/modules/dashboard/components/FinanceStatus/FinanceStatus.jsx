import React, { useEffect, useState } from 'react';
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

export function FinanceStatus() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchFinanceStatus().then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading || !data) {
    return (
      <Card title="채권/정산 현황">
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card title="채권/정산 현황" hoverable clickable onClick={() => navigate(ROUTES.FINANCE_RECEIVABLE)}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <span className={styles.label}>미수금 합계</span>
          <span className={styles.amount}>{formatAmount(data.receivablesTotal)}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>30일 이상 연체</span>
          <span className={data.overdueOver30Days > 0 ? styles.amountAlert : styles.amount}>
            {data.overdueOver30Days}건
          </span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>이번 달 입금 예정</span>
          <span className={styles.amount}>{formatAmount(data.expectedThisMonth)}</span>
        </li>
      </ul>
    </Card>
  );
}
