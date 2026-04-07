import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSalesStatus } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './SalesStatus.module.css';

const scopeMeta = {
  PROJECT_MENU: { title: '프로젝트 영업 현황', path: ROUTES.SHORT_PROJECT },
  RETAIL_MENU: { title: '리테일 영업/성과 현황', path: ROUTES.ANALYTICS_RETAIL },
  DEALER_PORTAL: { title: '대리점 주문/납품 현황', path: ROUTES.PARTNER_DELIVERY },
};

export function SalesStatus({ role = 'TEAM_MEMBER', scope = 'RETAIL_MENU' }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSalesStatus({ role, scope }).then((res) => {
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
