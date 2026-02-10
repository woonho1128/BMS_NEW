import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSalesStatus } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './SalesStatus.module.css';

export function SalesStatus() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSalesStatus().then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading || !data) {
    return (
      <Card title="영업현황">
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card title="영업현황" hoverable clickable onClick={() => navigate(ROUTES.SALES_INFO)}>
      <ul className={styles.list}>
        {data.items.map((item) => (
          <li key={item.status} className={styles.item}>
            <span className={styles.dot} aria-hidden />
            <span className={styles.statusLabel}>{item.status}</span>
            <span className={styles.count}>{item.count}건</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
