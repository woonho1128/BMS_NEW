import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDeliveryStatus } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './DeliveryStatus.module.css';

const scopeMeta = {
  PROJECT_MENU: { title: '프로젝트 납품 현황', path: ROUTES.DELIVERY_REQUEST },
  RETAIL_MENU: { title: '리테일 출고/납품 현황', path: ROUTES.DELIVERY_REQUEST },
  DEALER_PORTAL: { title: '대리점 납품 현황', path: ROUTES.PARTNER_DELIVERY },
};

export function DeliveryStatus({ role = 'TEAM_MEMBER', scope = 'RETAIL_MENU' }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchDeliveryStatus({ role, scope }).then((res) => {
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
          <span className={styles.label}>출고 요청 대기</span>
          <span className={styles.value}>{data.requestPending}건</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>오늘 납품 예정</span>
          <span className={styles.value}>{data.todayScheduled}건</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>지연 건</span>
          <span className={data.delayed > 0 ? styles.valueAlert : styles.value}>{data.delayed}건</span>
        </li>
      </ul>
    </Card>
  );
}
