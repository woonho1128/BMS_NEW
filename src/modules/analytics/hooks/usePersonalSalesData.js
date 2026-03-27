import { useMemo } from 'react';

const generateMonthlyData = (baseTarget) => {
  const months = {};
  let cumTarget = 0;
  let cumActual = 0;

  for (let i = 1; i <= 12; i++) {
    const monthKey = String(i).padStart(2, '0');
    // Random mock target ~ baseTarget / 12
    const target = Math.round((baseTarget / 12) * (0.8 + Math.random() * 0.4));
    // Actual is slightly variable
    const actual = Math.round(target * (0.6 + Math.random() * 0.8));
    
    // Sometimes 0 if in the future
    const isFuture = i > new Date().getMonth() + 1; // simple mock rule
    const finalTarget = target;
    const finalActual = isFuture ? 0 : actual;
    
    months[`m_${monthKey}`] = {
      target: finalTarget,
      actual: finalActual,
    };

    cumTarget += finalTarget;
    cumActual += finalActual;
  }

  months['cum'] = { target: cumTarget, actual: cumActual };
  return months;
};

const aggregateMonths = (monthsList) => {
  const result = { cum: { target: 0, actual: 0 }};
  for (let i = 1; i <= 12; i++) {
    const m = `m_${String(i).padStart(2, '0')}`;
    result[m] = { target: 0, actual: 0 };
  }

  monthsList.forEach(mon => {
    result.cum.target += mon.cum.target;
    result.cum.actual += mon.cum.actual;
    for (let i = 1; i <= 12; i++) {
      const m = `m_${String(i).padStart(2, '0')}`;
      result[m].target += mon[m].target;
      result[m].actual += mon[m].actual;
    }
  });

  return result;
};

const calcTotalRow = (retail, delivery) => {
  const total = { cum: { target: 0, actual: 0 }};
  for (let i = 1; i <= 12; i++) {
    const m = `m_${String(i).padStart(2, '0')}`;
    total[m] = {
      target: retail[m].target + delivery[m].target,
      actual: retail[m].actual + delivery[m].actual,
    };
  }
  total.cum.target = retail.cum.target + delivery.cum.target;
  total.cum.actual = retail.cum.actual + delivery.cum.actual;
  return total;
};

const MOCK_TEAMS = [
  {
    orgName: '리테일부문',
    teamName: '리테일1팀',
    members: [
      { name: '박진오', position: '시니어', targetRetail: 4200, targetDelivery: 2800 },
      { name: '김혜림', position: '매니저', targetRetail: 4400, targetDelivery: 6000 },
      { name: '이승현', position: '매니저', targetRetail: 11600, targetDelivery: 8000 },
      { name: '강승근', position: '매니저', targetRetail: 12600, targetDelivery: 0 },
    ]
  },
  {
    orgName: '리테일부문',
    teamName: '리테일2팀',
    members: [
      { name: '최진우', position: '매니저', targetRetail: 8000, targetDelivery: 4000 },
      { name: '장동건', position: '시니어', targetRetail: 10000, targetDelivery: 8000 },
    ]
  }
];

const formatNum = (val) => val === 0 ? '-' : new Intl.NumberFormat('ko-KR').format(val);
const formatPct = (val) => val === 0 ? '0%' : `${val}%`;

const generateMonthColumns = () => {
  const parentGroups = [];

  parentGroups.push({
    title: '1~12월 누계',
    key: 'cum',
    metricKey: 'cum'
  });

  for (let i = 1; i <= 12; i++) {
      parentGroups.push({
          title: `${i}월`,
          key: `m_${String(i).padStart(2, '0')}`,
          metricKey: `m_${String(i).padStart(2, '0')}`
      });
  }

  return parentGroups.map(group => ({
    title: group.title,
    children: [
      {
        title: '계획',
        dataIndex: ['metrics', group.metricKey, 'target'],
        width: 70,
        align: 'right',
        render: formatNum
      },
      {
        title: '실적',
        dataIndex: ['metrics', group.metricKey, 'actual'],
        width: 70,
        align: 'right',
        render: formatNum
      },
      {
        title: '달성률',
        key: `rate_${group.key}`,
        width: 70,
        align: 'right',
        render: (_, record) => {
           const m = record.metrics[group.metricKey];
           if (!m || m.target === 0) return formatPct(0);
           const rate = Math.round((m.actual / m.target) * 100);
           return {
             children: formatPct(rate),
             props: {
               style: { color: rate >= 100 ? '#1f64d8' : 'inherit' }
             }
           };
        }
      }
    ]
  }));
};

export function usePersonalSalesData() {
  const mockData = useMemo(() => {
    let keyIdx = 1;
    const rows = [];

    MOCK_TEAMS.forEach((team) => {
      const teamSpan = (team.members.length + 1) * 3; // Total + Menbers = N+1 groups of 3 rows

      // Process Members first to sum them
      const membersData = team.members.map(member => {
        const retail = generateMonthlyData(member.targetRetail);
        const delivery = generateMonthlyData(member.targetDelivery);
        const total = calcTotalRow(retail, delivery);
        return { name: member.name, position: member.position, retail, delivery, total };
      });

      // Aggregate Team Total
      const teamRetail = aggregateMonths(membersData.map(m => m.retail));
      const teamDelivery = aggregateMonths(membersData.map(m => m.delivery));
      const teamTotal = calcTotalRow(teamRetail, teamDelivery);

      // 1. Team Total Rows (3 rows)
      rows.push({
        key: keyIdx++,
        orgName: team.orgName,
        teamName: team.teamName,
        managerName: '합계',
        position: '',
        rowType: '도소매출고',
        rowSpanTeam: teamSpan,
        rowSpanManager: 3,
        metrics: teamRetail,
        isTotal: true
      });
      rows.push({
        key: keyIdx++,
        orgName: team.orgName,
        teamName: team.teamName,
        managerName: '합계',
        position: '',
        rowType: '납품출고',
        rowSpanTeam: 0,
        rowSpanManager: 0,
        metrics: teamDelivery,
        isTotal: true
      });
      rows.push({
        key: keyIdx++,
        orgName: team.orgName,
        teamName: team.teamName,
        managerName: '합계',
        position: '',
        rowType: '계',
        rowSpanTeam: 0,
        rowSpanManager: 0,
        metrics: teamTotal,
        isTotal: true,
        isSubTotal: true
      });

      // 2. Member Rows (3 rows each)
      membersData.forEach(member => {
        rows.push({
          key: keyIdx++,
          orgName: team.orgName,
          teamName: team.teamName,
          managerName: member.name,
          position: member.position,
          rowType: '도소매출고',
          rowSpanTeam: 0,
          rowSpanManager: 3,
          metrics: member.retail,
          isTotal: false
        });
        rows.push({
          key: keyIdx++,
          orgName: team.orgName,
          teamName: team.teamName,
          managerName: member.name,
          position: member.position,
          rowType: '납품출고',
          rowSpanTeam: 0,
          rowSpanManager: 0,
          metrics: member.delivery,
          isTotal: false
        });
        rows.push({
          key: keyIdx++,
          orgName: team.orgName,
          teamName: team.teamName,
          managerName: member.name,
          position: member.position,
          rowType: '계',
          rowSpanTeam: 0,
          rowSpanManager: 0,
          metrics: member.total,
          isTotal: false,
          isSubTotal: true
        });
      });
    });

    return rows;
  }, []);

  const dynamicColumns = useMemo(() => generateMonthColumns(), []);

  return { mockData, dynamicColumns };
}
