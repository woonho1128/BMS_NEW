/**
 * Dashboard mock API by role/scope context
 */

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const byScope = {
  PROJECT_MENU: {
    teamMemberKpi: {
      personal: { actual: 38000000, plan: 42000000 },
      team: { actual: 214000000, plan: 245000000 },
      shortProject: { submitted: 4, approved: 3, pending: 1, discountAmount: 12550000 },
    },
    projectCore: {
      profit: { draft: 9, submitted: 6, approved: 18, rejected: 2 },
      salesInfo: { draft: 14, submitted: 7, approved: 21, rejected: 3 },
      spec: { draft: 4, submitted: 5, approved: 13, rejected: 1 },
    },
    kpi: { salesInProgress: 34, deliveryPending: 9, receivablesTotal: 98000000, approvalPending: 6 },
    sales: [
      { status: '프로젝트 발굴', count: 11 },
      { status: '견적 진행', count: 14 },
      { status: '수주 협의', count: 7 },
      { status: '현장 투입', count: 5 },
    ],
    delivery: { requestPending: 5, todayScheduled: 6, delayed: 1 },
    finance: { receivablesTotal: 98000000, overdueOver30Days: 2, expectedThisMonth: 64000000 },
    approval: [
      { id: 'AP-PJ-01', type: '손익분석', title: '제주 신선고 기숙사 손익 상신 대기', date: '2026-04-07' },
      { id: 'AP-PJ-02', type: '영업정보', title: '4월 프로젝트 영업정보 등록 승인 요청', date: '2026-04-07' },
      { id: 'AP-PJ-03', type: 'SPEC', title: 'SPEC-현황 변경 승인 요청', date: '2026-04-06' },
    ],
    notices: [
      { id: 'N-PJ-01', title: '프로젝트부문 주간 수주 회의 안내', date: '2026-04-07', important: true },
      { id: 'N-PJ-02', title: '현장별 원가 비교 리포트 배포', date: '2026-04-06', important: false },
      { id: 'N-PJ-03', title: '프로젝트부문 실적 입력 마감 공지', date: '2026-04-05', important: false },
    ],
  },
  RETAIL_MENU: {
    kpi: { salesInProgress: 49, deliveryPending: 12, receivablesTotal: 143000000, approvalPending: 4 },
    retailDigestByRole: {
      TEAM_MEMBER: {
        mySalesTrend: {
          plan: 420000000,
          actual: 397000000,
          monthly: [74, 79, 83, 87, 92],
        },
        myPartnersTrend: {
          plan: 980000000,
          actual: 904000000,
          partnerCount: 14,
          monthly: [71, 76, 80, 88, 92],
        },
      },
      TEAM_LEADER: {
        teamSalesTrend: {
          plan: 3200000000,
          actual: 2860000000,
          monthly: [70, 74, 79, 85, 89],
        },
        memberSalesTrend: {
          plan: 1540000000,
          actual: 1390000000,
          memberCount: 11,
          monthly: [72, 75, 81, 86, 90],
        },
        partnerSalesTrend: {
          plan: 2740000000,
          actual: 2470000000,
          partnerCount: 37,
          monthly: [68, 73, 78, 84, 90],
        },
      },
      EXECUTIVE: {
        teamSalesTrend: {
          plan: 8200000000,
          actual: 7630000000,
          teamCount: 5,
          monthly: [69, 73, 80, 87, 93],
        },
        memberSalesTrend: {
          plan: 4670000000,
          actual: 4310000000,
          memberCount: 42,
          monthly: [70, 74, 79, 86, 92],
        },
        partnerSalesTrend: {
          plan: 7010000000,
          actual: 6480000000,
          partnerCount: 128,
          monthly: [67, 71, 77, 84, 92],
        },
      },
    },
    sales: [
      { status: '리테일 매출', count: 26 },
      { status: '카테고리 성과', count: 9 },
      { status: '개인 KPI 관리', count: 12 },
      { status: '판촉 진행', count: 6 },
    ],
    delivery: { requestPending: 8, todayScheduled: 9, delayed: 2 },
    finance: { receivablesTotal: 143000000, overdueOver30Days: 3, expectedThisMonth: 91000000 },
    approval: [
      { id: 'AP-RT-01', type: '단납', title: '단납 현장 등록 상신 3건 결재 대기', date: '2026-04-07' },
      { id: 'AP-RT-02', type: '여신/수금', title: '여신 한도 조정 요청 결재 대기', date: '2026-04-06' },
      { id: 'AP-RT-03', type: 'KPI', title: '성과 계획 대비 실적 조정 승인 요청', date: '2026-04-06' },
    ],
    notices: [
      { id: 'N-RT-01', title: '리테일부문 월간 실적 점검 회의', date: '2026-04-07', important: true },
      { id: 'N-RT-02', title: '성과관리 입력 템플릿 업데이트', date: '2026-04-06', important: false },
      { id: 'N-RT-03', title: '개인 KPI 마감 일정 재안내', date: '2026-04-05', important: false },
    ],
  },
  DEALER_PORTAL: {
    kpi: { salesInProgress: 22, deliveryPending: 7, receivablesTotal: 61000000, approvalPending: 0 },
    sales: [
      { status: '주문 접수', count: 15 },
      { status: '출고 준비', count: 6 },
      { status: '납품 완료', count: 11 },
      { status: '문의 대응', count: 4 },
    ],
    delivery: { requestPending: 4, todayScheduled: 5, delayed: 0 },
    finance: { receivablesTotal: 61000000, overdueOver30Days: 1, expectedThisMonth: 39000000 },
    approval: [],
    notices: [
      { id: 'N-DL-01', title: '대리점 포털 공지: 4월 물류 일정', date: '2026-04-07', important: true },
      { id: 'N-DL-02', title: '카탈로그 최신본 배포 안내', date: '2026-04-06', important: false },
      { id: 'N-DL-03', title: '정산 확인서 제출 일정 공지', date: '2026-04-05', important: false },
    ],
  },
};

const pickScope = (scope) => byScope[scope] || byScope.RETAIL_MENU;
const pickRole = (role) => role || 'TEAM_MEMBER';

export async function fetchProjectCoreStatus(context = {}) {
  await delay(140);
  return pickScope(context.scope).projectCore || byScope.PROJECT_MENU.projectCore;
}

export async function fetchTeamProjectKpi(context = {}) {
  await delay(140);
  return pickScope(context.scope).teamMemberKpi || byScope.PROJECT_MENU.teamMemberKpi;
}

export async function fetchKpi(context = {}) {
  await delay(180);
  const scoped = pickScope(context.scope);
  const role = pickRole(context.role);
  const retailDigest = scoped.retailDigestByRole?.[role] || scoped.retailDigestByRole?.TEAM_MEMBER || null;
  return { ...scoped.kpi, retailDigest };
}

export async function fetchSalesStatus(context = {}) {
  await delay(160);
  return { items: pickScope(context.scope).sales };
}

export async function fetchDeliveryStatus(context = {}) {
  await delay(160);
  return pickScope(context.scope).delivery;
}

export async function fetchFinanceStatus(context = {}) {
  await delay(160);
  return pickScope(context.scope).finance;
}

export async function fetchApprovalTodo(context = {}) {
  await delay(180);
  const scopeData = pickScope(context.scope);
  const role = pickRole(context.role);
  if (context.scope === 'RETAIL_MENU' && role === 'EXECUTIVE') {
    return {
      items: [
        { id: 'AP-EX-01', type: '리테일 1팀', title: '리테일 1팀 / 김지훈 외 7명 결재 대기 4건', date: '2026-04-07' },
        { id: 'AP-EX-02', type: '리테일 2팀', title: '리테일 2팀 / 박동현 외 8명 결재 대기 3건', date: '2026-04-07' },
        { id: 'AP-EX-03', type: '타일영업팀', title: '타일영업팀 / 정하림 외 10명 결재 대기 5건', date: '2026-04-06' },
      ],
    };
  }
  return { items: scopeData.approval };
}

export async function fetchNotices(context = {}) {
  await delay(140);
  return { items: pickScope(context.scope).notices };
}
