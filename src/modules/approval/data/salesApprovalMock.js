import { MOCK_SALES_INFO } from '../../sales/data/salesInfoMock';
import { MOCK_REPORT_LIST, REPORT_TYPE } from '../../sales/data/reportMock';

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const APPROVAL_CATEGORY = {
  SHORT_PROJECT: 'shortProject',
  SALES_INFO: 'salesInfo',
  WEEKLY: 'weekly',
  TRIP: 'trip',
};

export const APPROVAL_CATEGORY_LABEL = {
  [APPROVAL_CATEGORY.SHORT_PROJECT]: '단납 현장',
  [APPROVAL_CATEGORY.SALES_INFO]: '영업정보',
  [APPROVAL_CATEGORY.WEEKLY]: '주간보고',
  [APPROVAL_CATEGORY.TRIP]: '출장보고',
};

const decisionStateById = new Map();

let shortProjectApprovals = [
  {
    id: 'apv-short-1001',
    category: APPROVAL_CATEGORY.SHORT_PROJECT,
    title: '제주 무시기 현장 단납 상신',
    drafter: '김영업',
    date: '2026-03-30',
    status: APPROVAL_STATUS.PENDING,
    body: '단납 현장 등록 건 결재 상신입니다.',
    comment: '',
    sourcePath: '/sales/short-project/register',
    site: {
      dealer: '동신건재',
      siteName: '제주 무시기 현장',
      builder: '제주개발',
      deliveryFrom: '2026-04-01',
      deliveryTo: '2026-06-20',
      grossRate: '26.5%',
      specialNote: '관급 공사, 동종사 입찰',
      items: [
        {
          itemCode: 'CC-735',
          qty: 100,
          unit: 'SET',
          standardPrice: 300000,
          discountRate: 7,
          standardAmount: 30000000,
          unitPrice: 279000,
          amount: 27900000,
          discountAmount: 2100000,
          note: '시트 제외, 부속 포함',
        },
        {
          itemCode: 'CL-384',
          qty: 100,
          unit: 'EA',
          standardPrice: 280000,
          discountRate: 5,
          standardAmount: 28000000,
          unitPrice: 266000,
          amount: 26600000,
          discountAmount: 1400000,
          note: '비고',
        },
      ],
    },
  },
];

function normalizeStatus(id, baseStatus) {
  return decisionStateById.get(id)?.status || baseStatus;
}

function normalizeComment(id) {
  return decisionStateById.get(id)?.comment || '';
}

function toApprovalStatusFromReport(status) {
  if (status === 'submitted') return APPROVAL_STATUS.PENDING;
  if (status === 'confirmed') return APPROVAL_STATUS.APPROVED;
  return APPROVAL_STATUS.PENDING;
}

function buildSalesInfoApprovals() {
  const ordered = [...MOCK_SALES_INFO]
    .sort((a, b) => {
      if (a.id === '4') return -1;
      if (b.id === '4') return 1;
      return Number(a.id) - Number(b.id);
    })
    .slice(0, 8);

  return ordered.map((info) => {
    const id = `apv-sales-info-${info.id}`;
    return {
      id,
      refId: info.id,
      category: APPROVAL_CATEGORY.SALES_INFO,
      title: `${info.builder} 영업정보 등록`,
      drafter: info.author || '영업담당',
      date: info.orderDate || info.specRegisterDate || '2026-03-29',
      status: normalizeStatus(id, APPROVAL_STATUS.PENDING),
      body: `${info.siteName} 영업정보 결재 요청입니다.`,
      comment: normalizeComment(id),
      sourcePath: `/sales/info/${info.id}`,
      payload: info,
    };
  });
}

function buildReportApprovals() {
  return MOCK_REPORT_LIST.slice(0, 10).map((report) => {
    const id = `apv-report-${report.id}`;
    const isWeekly = report.type === REPORT_TYPE.WEEKLY;
    return {
      id,
      refId: report.id,
      category: isWeekly ? APPROVAL_CATEGORY.WEEKLY : APPROVAL_CATEGORY.TRIP,
      title: isWeekly ? `${report.period} 주간보고` : `${report.periodLabel || report.period} 출장보고`,
      drafter: report.author || '영업담당',
      date: report.createdAt || '2026-03-28',
      status: normalizeStatus(id, toApprovalStatusFromReport(report.status)),
      body: isWeekly ? '주간 실적 및 차주 계획 결재 요청입니다.' : '출장 결과 보고 결재 요청입니다.',
      comment: normalizeComment(id),
      sourcePath: `/sales/report/${report.id}`,
      payload: report,
    };
  });
}

export function getApprovalList() {
  const shortProject = shortProjectApprovals.map((item) => ({
    ...item,
    status: normalizeStatus(item.id, item.status),
    comment: normalizeComment(item.id) || item.comment || '',
  }));

  return [...shortProject, ...buildSalesInfoApprovals(), ...buildReportApprovals()].sort((a, b) =>
    String(b.date).localeCompare(String(a.date))
  );
}

export function getApprovalById(id) {
  return getApprovalList().find((item) => item.id === id) ?? null;
}

export function updateApprovalDecision(id, nextStatus, comment) {
  decisionStateById.set(id, {
    status: nextStatus,
    comment: comment?.trim() || '(의견 없음)',
  });
}

export function createShortProjectApproval(payload) {
  const date = new Date().toISOString().slice(0, 10);
  const newItem = {
    id: `apv-short-${Date.now()}`,
    category: APPROVAL_CATEGORY.SHORT_PROJECT,
    title: `${payload.siteName} 단납 상신`,
    drafter: payload.drafter || '영업담당',
    date,
    status: APPROVAL_STATUS.PENDING,
    body: '단납 현장 등록 건 결재 상신입니다.',
    comment: '',
    sourcePath: '/sales/short-project/register',
    site: {
      dealer: payload.dealer,
      siteName: payload.siteName,
      builder: payload.builder || '-',
      deliveryFrom: payload.deliveryFrom,
      deliveryTo: payload.deliveryTo,
      grossRate: payload.grossRate || '-',
      specialNote: payload.specialNote || '-',
      items: payload.items || [],
    },
  };

  shortProjectApprovals = [newItem, ...shortProjectApprovals];
  return newItem;
}
