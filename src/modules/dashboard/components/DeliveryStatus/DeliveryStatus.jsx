import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDeliveryStatus } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './DeliveryStatus.module.css';

export function DeliveryStatus() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchDeliveryStatus().then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading || !data) {
    return (
      <Card title="출고/납품 현황">
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card title="출고/납품 현황" hoverable clickable onClick={() => navigate(ROUTES.DELIVERY_REQUEST)}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <span className={styles.label}>출고요청 대기</span>
          <span className={styles.value}>{data.requestPending}건</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>오늘 출고 예정</span>
          <span className={styles.value}>{data.todayScheduled}건</span>
        </li>
        <li className={styles.item}>
          <span className={styles.label}>지연 건</span>
          <span className={data.delayed > 0 ? styles.valueAlert : styles.value}>
            {data.delayed}건
          </span>
        </li>
      </ul>
    </Card>
  );
}
