import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchKpi } from '../../api/dashboard.api';
import { ROUTES } from '../../../../router/routePaths';
import { Card, CardBody } from '../../../../shared/components/Card';
import styles from './DashboardKPI.module.css';

function formatAmount(n) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n?.toLocaleString() ?? '0';
}

function percent(actual, plan) {
  if (!plan) return 0;
  return Math.round((actual / plan) * 100);
}

const scopeToRoute = {
  PROJECT_MENU: ROUTES.SHORT_PROJECT,
  RETAIL_MENU: ROUTES.ANALYTICS_RETAIL,
  DEALER_PORTAL: ROUTES.PARTNER_DELIVERY,
};

export function DashboardKPI({ role = 'TEAM_MEMBER', scope = 'RETAIL_MENU' }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchKpi({ role, scope }).then((res) => {
      if (!cancelled) setData(res);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [role, scope]);

  const cards = useMemo(() => {
    if (!data) return [];

    if (scope === 'RETAIL_MENU' && data.retailDigest) {
      const digest = data.retailDigest;
      if (role === 'TEAM_MEMBER') {
        const myRate = percent(digest.mySalesTrend.actual, digest.mySalesTrend.plan);
        const partnerRate = percent(digest.myPartnersTrend.actual, digest.myPartnersTrend.plan);
        return [
          {
            label: '내 매출 계획 대비 실적 추이',
            value: `${myRate}%`,
            sub: `실적 ${formatAmount(digest.mySalesTrend.actual)} / 계획 ${formatAmount(digest.mySalesTrend.plan)}`,
            trend: `월별 ${digest.mySalesTrend.monthly.join('→')}%`,
            path: ROUTES.ANALYTICS_PERSONAL_SALES,
          },
          {
            label: '담당 대리점 매출 계획 대비 실적 추이',
            value: `${partnerRate}%`,
            sub: `실적 ${formatAmount(digest.myPartnersTrend.actual)} / 계획 ${formatAmount(digest.myPartnersTrend.plan)}`,
            trend: `${digest.myPartnersTrend.partnerCount}개 대리점 · ${digest.myPartnersTrend.monthly.join('→')}%`,
            path: ROUTES.ANALYTICS_PARTNER,
          },
        ];
      }

      if (role === 'TEAM_LEADER') {
        const teamRate = percent(digest.teamSalesTrend.actual, digest.teamSalesTrend.plan);
        const memberRate = percent(digest.memberSalesTrend.actual, digest.memberSalesTrend.plan);
        const partnerRate = percent(digest.partnerSalesTrend.actual, digest.partnerSalesTrend.plan);
        return [
          {
            label: '팀 매출 계획 대비 추이',
            value: `${teamRate}%`,
            sub: `실적 ${formatAmount(digest.teamSalesTrend.actual)} / 계획 ${formatAmount(digest.teamSalesTrend.plan)}`,
            trend: `월별 ${digest.teamSalesTrend.monthly.join('→')}%`,
            path: ROUTES.ANALYTICS_RETAIL,
          },
          {
            label: '팀원별 계획 매출 추이',
            value: `${memberRate}%`,
            sub: `${digest.memberSalesTrend.memberCount}명 · 실적 ${formatAmount(digest.memberSalesTrend.actual)} / 계획 ${formatAmount(digest.memberSalesTrend.plan)}`,
            trend: `월별 ${digest.memberSalesTrend.monthly.join('→')}%`,
            path: ROUTES.ANALYTICS_PERSONAL_SALES,
          },
          {
            label: '대리점 계획 매출 추이',
            value: `${partnerRate}%`,
            sub: `${digest.partnerSalesTrend.partnerCount}개 · 실적 ${formatAmount(digest.partnerSalesTrend.actual)} / 계획 ${formatAmount(digest.partnerSalesTrend.plan)}`,
            trend: `월별 ${digest.partnerSalesTrend.monthly.join('→')}%`,
            path: ROUTES.ANALYTICS_PARTNER,
          },
        ];
      }

      const teamRate = percent(digest.teamSalesTrend.actual, digest.teamSalesTrend.plan);
      const memberRate = percent(digest.memberSalesTrend.actual, digest.memberSalesTrend.plan);
      const partnerRate = percent(digest.partnerSalesTrend.actual, digest.partnerSalesTrend.plan);
      return [
        {
          label: '부문 팀 매출 계획 대비 추이',
          value: `${teamRate}%`,
          sub: `${digest.teamSalesTrend.teamCount}개 팀 · 실적 ${formatAmount(digest.teamSalesTrend.actual)} / 계획 ${formatAmount(digest.teamSalesTrend.plan)}`,
          trend: `월별 ${digest.teamSalesTrend.monthly.join('→')}%`,
          path: ROUTES.ANALYTICS_RETAIL,
        },
        {
          label: '부문 팀원 계획 매출 추이',
          value: `${memberRate}%`,
          sub: `${digest.memberSalesTrend.memberCount}명 · 실적 ${formatAmount(digest.memberSalesTrend.actual)} / 계획 ${formatAmount(digest.memberSalesTrend.plan)}`,
          trend: `월별 ${digest.memberSalesTrend.monthly.join('→')}%`,
          path: ROUTES.ANALYTICS_PERSONAL_SALES,
        },
        {
          label: '부문 대리점 계획 매출 추이',
          value: `${partnerRate}%`,
          sub: `${digest.partnerSalesTrend.partnerCount}개 · 실적 ${formatAmount(digest.partnerSalesTrend.actual)} / 계획 ${formatAmount(digest.partnerSalesTrend.plan)}`,
          trend: `월별 ${digest.partnerSalesTrend.monthly.join('→')}%`,
          path: ROUTES.ANALYTICS_PARTNER,
        },
      ];
    }

    const base = [
      { label: '진행 영업', value: `${data.salesInProgress}건`, path: scopeToRoute[scope] || ROUTES.SALES_INFO },
      { label: '출고 대기', value: `${data.deliveryPending}건`, path: ROUTES.DELIVERY_REQUEST },
      { label: '미수금', value: formatAmount(data.receivablesTotal), path: ROUTES.FINANCE_RECEIVABLE },
    ];

    if (role === 'TEAM_LEADER' || role === 'EXECUTIVE') {
      base.push({ label: '결재 대기', value: `${data.approvalPending}건`, path: ROUTES.APPROVAL_SALES });
    }

    return base;
  }, [data, role, scope]);

  if (loading || !data) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {cards.map((c) => (
        <Card key={c.label} className={styles.kpiCard} hoverable clickable onClick={() => navigate(c.path)}>
          <CardBody className={styles.kpiBody}>
            <span className={styles.label}>{c.label}</span>
            <span className={styles.value}>{c.value}</span>
            {c.sub ? <span className={styles.label}>{c.sub}</span> : null}
            {c.trend ? <span className={styles.trend}>{c.trend}</span> : null}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
