import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotices } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './NoticeSummary.module.css';

export function NoticeSummary() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchNotices().then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading || !data) {
    return (
      <Card title="공지 요약">
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card title="공지 요약" hoverable clickable onClick={() => navigate(ROUTES.PARTNER_NOTICE)}>
      <ul className={styles.list}>
        {data.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.titleWrap}>
              {item.important && <span className={styles.badge}>중요</span>}
              <span className={styles.titleText}>{item.title}</span>
            </span>
            <span className={styles.date}>{item.date}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
