import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApprovalTodo } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './ApprovalTodo.module.css';

const scopeTitle = {
  PROJECT_MENU: '손익/영업정보 결재 대기',
  RETAIL_MENU: '리테일 결재 대기',
  DEALER_PORTAL: '결재 대기',
};

export function ApprovalTodo({ role = 'TEAM_LEADER', scope = 'RETAIL_MENU' }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchApprovalTodo({ role, scope }).then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [role, scope]);

  const title = useMemo(() => {
    if (scope === 'RETAIL_MENU' && role === 'EXECUTIVE') return '리테일 결재 대기(전팀/전팀원)';
    return scopeTitle[scope] || '결재 대기';
  }, [scope, role]);

  if (loading) {
    return (
      <Card title={title} indicatorColor="primary" variant="highlight">
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  const items = data?.items ?? [];
  if (items.length === 0) return null;

  return (
    <Card
      title={title}
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
