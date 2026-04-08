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
    id: 'apv-short-1012',
    category: APPROVAL_CATEGORY.SHORT_PROJECT,
    title: '부산 신항 물류센터 단납 상신',
    drafter: '김영업',
    date: '2026-04-06',
    status: APPROVAL_STATUS.APPROVED,
    body: '단납 현장 등록 건 결재 상신입니다. (체크 1건 상신)',
    comment: '',
    submitComment: '단건 상신입니다. 긴급 출고 예정으로 우선 검토 부탁드립니다.',
    approvalLine: [
      { order: 1, approverId: 'apv-kim-jh', approverName: '김지훈 부장', approverDept: '영업1팀' },
      { order: 2, approverId: 'apv-park-dh', approverName: '박동현 이사', approverDept: '영업본부' },
    ],
    sourcePath: '/sales/short-project/register',
    site: {
      dealer: '남부건재',
      siteName: '부산 신항 물류센터',
      builder: '부산개발',
      deliveryFrom: '2026-05-02',
      deliveryTo: '2026-05-20',
      grossRate: '24.2%',
      specialNote: '물류동 우선 납품, 주말 출고 협의',
      items: [
        {
          itemCode: 'CC-735',
          qty: 80,
          unit: 'SET',
          standardPrice: 300000,
          discountRate: 7,
          standardAmount: 24000000,
          unitPrice: 279000,
          amount: 22320000,
          discountAmount: 1680000,
          note: 'SET 선출고',
        },
      ],
    },
  },
  {
    id: 'apv-short-1011',
    category: APPROVAL_CATEGORY.SHORT_PROJECT,
    title: '대전 연구소 증축 단납 상신',
    drafter: '이순희',
    date: '2026-04-05',
    status: APPROVAL_STATUS.APPROVED,
    body: '단납 현장 등록 건 결재 상신입니다. (체크 3건 중 1건)',
    comment: '',
    submitComment: '3건 동시 상신 건입니다. 본 건은 연구동 A동 적용분입니다.',
    submitGroupId: 'submit-group-20260405-001',
    submitSummary: { selectedCount: 3, itemCount: 5, baseDiscountAmount: 27000000, shortDiscountAmount: 21000000 },
    approvalLine: [
      { order: 1, approverId: 'apv-kim-jh', approverName: '김지훈 부장', approverDept: '영업1팀' },
      { order: 2, approverId: 'apv-lee-sy', approverName: '이서윤 팀장', approverDept: '영업기획팀' },
      { order: 3, approverId: 'apv-jung-hr', approverName: '정하림 전무', approverDept: '본사' },
    ],
    sourcePath: '/sales/short-project/register',
    site: {
      dealer: '중앙유통',
      siteName: '대전 연구소 증축',
      builder: '한국종건',
      deliveryFrom: '2026-05-11',
      deliveryTo: '2026-06-10',
      grossRate: '22.8%',
      specialNote: '연구동 공조라인 병행 시공',
      items: [
        {
          itemCode: 'CL-384',
          qty: 120,
          unit: 'EA',
          standardPrice: 280000,
          discountRate: 6,
          standardAmount: 33600000,
          unitPrice: 263200,
          amount: 31584000,
          discountAmount: 2016000,
          note: '층별 분할 납품',
        },
      ],
    },
  },
  {
    id: 'apv-short-1010',
    category: APPROVAL_CATEGORY.SHORT_PROJECT,
    title: '대전 복합몰 리뉴얼 단납 상신',
    drafter: '이순희',
    date: '2026-04-05',
    status: APPROVAL_STATUS.PENDING,
    body: '단납 현장 등록 건 결재 상신입니다. (체크 3건 중 2건)',
    comment: '',
    submitComment: '3건 동시 상신 건입니다. 야간 공사 일정으로 단납 대응 필요합니다.',
    submitGroupId: 'submit-group-20260405-001',
    submitSummary: { selectedCount: 3, itemCount: 5, baseDiscountAmount: 27000000, shortDiscountAmount: 21000000 },
    approvalLine: [
      { order: 1, approverId: 'apv-kim-jh', approverName: '김지훈 부장', approverDept: '영업1팀' },
      { order: 2, approverId: 'apv-lee-sy', approverName: '이서윤 팀장', approverDept: '영업기획팀' },
      { order: 3, approverId: 'apv-jung-hr', approverName: '정하림 전무', approverDept: '본사' },
    ],
    sourcePath: '/sales/short-project/register',
    site: {
      dealer: '중앙유통',
      siteName: '대전 복합몰 리뉴얼',
      builder: '한국종건',
      deliveryFrom: '2026-05-15',
      deliveryTo: '2026-06-05',
      grossRate: '23.4%',
      specialNote: '야간 시공, 층별 순차 반입',
      items: [
        {
          itemCode: 'CC-735',
          qty: 60,
          unit: 'SET',
          standardPrice: 300000,
          discountRate: 7,
          standardAmount: 18000000,
          unitPrice: 279000,
          amount: 16740000,
          discountAmount: 1260000,
          note: '매장 오픈 일정 연동',
        },
      ],
    },
  },
  {
    id: 'apv-short-1009',
    category: APPROVAL_CATEGORY.SHORT_PROJECT,
    title: '광주 메디컬센터 단납 상신',
    drafter: '박준호',
    date: '2026-04-04',
    status: APPROVAL_STATUS.PENDING,
    body: '단납 현장 등록 건 결재 상신입니다. (체크 3건 중 1건)',
    comment: '',
    submitComment: '3건 동시 상신 건입니다. 의료장비 반입 전 설치 완료가 필요합니다.',
    submitGroupId: 'submit-group-20260405-001',
    submitSummary: { selectedCount: 3, itemCount: 5, baseDiscountAmount: 27000000, shortDiscountAmount: 21000000 },
    approvalLine: [
      { order: 1, approverId: 'apv-kim-jh', approverName: '김지훈 부장', approverDept: '영업1팀' },
      { order: 2, approverId: 'apv-park-dh', approverName: '박동현 이사', approverDept: '영업본부' },
      { order: 3, approverId: 'apv-choi-mh', approverName: '최민호 상무', approverDept: '관리본부' },
    ],
    sourcePath: '/sales/short-project/register',
    site: {
      dealer: '호남건재',
      siteName: '광주 메디컬센터',
      builder: '남도건설',
      deliveryFrom: '2026-05-20',
      deliveryTo: '2026-06-25',
      grossRate: '25.1%',
      specialNote: '수술실 구역 우선 시공, 방진 관리 필요',
      items: [
        {
          itemCode: 'CL-384',
          qty: 90,
          unit: 'EA',
          standardPrice: 280000,
          discountRate: 6,
          standardAmount: 25200000,
          unitPrice: 263200,
          amount: 23688000,
          discountAmount: 1512000,
          note: '클린존 자재 구분 반입',
        },
      ],
    },
  },
  {
    id: 'apv-short-1001',
    category: APPROVAL_CATEGORY.SHORT_PROJECT,
    title: '제주 무시기 현장 단납 상신',
    drafter: '김영업',
    date: '2026-03-30',
    status: APPROVAL_STATUS.PENDING,
    body: '단납 현장 등록 건 결재 상신입니다.',
    comment: '',
    submitComment: '',
    approvalLine: [],
    sourcePath: '/sales/short-project/register',
    site: {
      dealer: '동신건재',
      siteName: '제주 무시기 현장',
      builder: '제주개발',
      deliveryFrom: '2026-04-01',
      deliveryTo: '2026-06-20',
      grossRate: '26.5%',
      specialNote: '관급 공사, 동종업체 입찰',
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
          note: '세트 제외, 부품 포함',
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
    submitComment: payload.submitComment || '',
    approvalLine: payload.approvalLine || [],
    submitGroupId: payload.submitGroupId || '',
    submitSummary: payload.submitSummary || null,
    sourcePath: '/sales/short-project/register',
    site: {
      dealer: payload.dealer,
      siteName: payload.siteName,
      builder: payload.builder || '-',
      isGovernmentProject: Boolean(payload.isGovernmentProject),
      deliveryFrom: payload.deliveryFrom,
      deliveryTo: payload.deliveryTo,
      grossRate: payload.grossRate || '-',
      specialNote: payload.specialNote || '-',
      attachments: payload.attachments || [],
      items: payload.items || [],
    },
  };

  shortProjectApprovals = [newItem, ...shortProjectApprovals];
  return newItem;
}
