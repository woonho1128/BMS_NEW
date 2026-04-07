import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotices } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card } from '../../../../shared/components/Card';
import styles from './NoticeSummary.module.css';

const scopeTitle = {
  PROJECT_MENU: '프로젝트부문 공지 요약',
  RETAIL_MENU: '리테일부문 공지 요약',
  DEALER_PORTAL: '대리점 포털 공지 요약',
};

export function NoticeSummary({ role = 'TEAM_MEMBER', scope = 'RETAIL_MENU' }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchNotices({ role, scope }).then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [role, scope]);

  const title = useMemo(() => scopeTitle[scope] || '공지 요약', [scope]);
  const targetPath = scope === 'DEALER_PORTAL' ? ROUTES.PARTNER_NOTICE : ROUTES.PARTNER_NOTICE;

  if (loading || !data) {
    return (
      <Card title={title}>
        <p className={styles.placeholder}>로딩 중...</p>
      </Card>
    );
  }

  return (
    <Card title={title} hoverable clickable onClick={() => navigate(targetPath)}>
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
