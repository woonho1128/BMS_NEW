/**
 * 대시보드 Mock API
 * 실제 연동 시 GET /api/dashboard/* 로 교체
 */

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchKpi() {
  await delay(200);
  return {
    salesInProgress: 28,
    deliveryPending: 12,
    receivablesTotal: 125000000,
    approvalPending: 5,
  };
}

export async function fetchSalesStatus() {
  await delay(180);
  return {
    items: [
      { status: '신규', count: 8 },
      { status: '견적', count: 12 },
      { status: '협상', count: 5 },
      { status: '수주', count: 3 },
    ],
  };
}

export async function fetchDeliveryStatus() {
  await delay(180);
  return {
    requestPending: 7,
    todayScheduled: 4,
    delayed: 2,
  };
}

export async function fetchFinanceStatus() {
  await delay(180);
  return {
    receivablesTotal: 125000000,
    overdueOver30Days: 3,
    expectedThisMonth: 85000000,
  };
}

export async function fetchApprovalTodo() {
  await delay(220);
  return {
    items: [
      { id: '1', type: '출고승인', title: 'A사 출고요청', date: '2025-01-29' },
      { id: '2', type: '영업결재', title: 'B사 할인 승인', date: '2025-01-29' },
    ],
  };
}

export async function fetchNotices() {
  await delay(150);
  return {
    items: [
      { id: '1', title: '1월 영업 실적 보고 일정 안내', date: '2025-01-28', important: true },
      { id: '2', title: '출고 시스템 점검 안내 (1/30)', date: '2025-01-27', important: false },
      { id: '3', title: '신규 카탈로그 배포', date: '2025-01-26', important: false },
    ],
  };
}
