import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApprovalTodo } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './ApprovalTodo.module.css';

export function ApprovalTodo() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchApprovalTodo().then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Card title="To-do (결재)" indicatorColor="primary" variant="highlight">
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <Card
      title="To-do (결재)"
      indicatorColor="primary"
      variant="highlight"
      hoverable
      clickable
      onClick={() => navigate(ROUTES.APPROVAL_SALES)}
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span className={styles.badge}>{item.type}</span>
            <span className={styles.itemTitle}>{item.title}</span>
            <span className={styles.date}>{item.date}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
