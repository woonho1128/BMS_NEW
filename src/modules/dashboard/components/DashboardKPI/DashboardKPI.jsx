import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchKpi } from '../../api/dashboard.api';
import { useAuth } from '../../../auth/hooks/useAuth';
import { ROUTES } from '../../../../router/routePaths';
import { hasPermission, PERMISSIONS } from '../../../../shared/constants/permissions';
import { Card, CardBody } from '../../../../shared/components/Card';
import styles from './DashboardKPI.module.css';

function formatAmount(n) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n?.toLocaleString() ?? '0';
}

export function DashboardKPI() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canApprove = hasPermission(user, PERMISSIONS.APPROVAL);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchKpi().then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading || !data) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  const cards = [
    { label: '진행중 영업', value: `${data.salesInProgress}건`, path: ROUTES.SALES_INFO },
    { label: '출고대기', value: `${data.deliveryPending}건`, path: ROUTES.DELIVERY_REQUEST },
    { label: '미수금', value: formatAmount(data.receivablesTotal), path: ROUTES.FINANCE_RECEIVABLE },
  ];

  if (canApprove && data.approvalPending > 0) {
    cards.push({
      label: '결재대기',
      value: `${data.approvalPending}건`,
      path: ROUTES.APPROVAL_SALES,
    });
  }

  return (
    <div className={styles.wrapper}>
      {cards.map((c) => (
        <Card
          key={c.label}
          className={styles.kpiCard}
          hoverable
          clickable
          onClick={() => navigate(c.path)}
        >
          <CardBody className={styles.kpiBody}>
            <span className={styles.label}>{c.label}</span>
            <span className={styles.value}>{c.value}</span>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
