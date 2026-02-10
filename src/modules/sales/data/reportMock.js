/**
 * 보고관리 Mock (주간보고/출장보고 통합 목록, API 연동 없음)
 */

export const REPORT_TYPE = { WEEKLY: 'weekly', TRIP: 'trip' };
export const REPORT_STATUS = { DRAFT: 'draft', SUBMITTED: 'submitted', CONFIRMED: 'confirmed' };

const STATUS_LABEL = { draft: '임시저장', submitted: '제출완료', confirmed: '확인완료' };

export function getStatusLabel(status) {
  return STATUS_LABEL[status] ?? status;
}

/** 통합 목록 (주간/출장 혼합) */
export const MOCK_REPORT_LIST = [
  { id: '1', type: REPORT_TYPE.WEEKLY, period: '2025-W04', periodLabel: '2025.01.20 ~ 2025.01.26', summary: 'A건설 SPEC 검토 및 견적 지원, B현장 진행 상황 점검', author: '김영업', dept: '영업1부', team: '영업1팀', status: 'submitted', createdAt: '2025-01-26' },
  { id: '2', type: REPORT_TYPE.TRIP, period: '2025-01-22', periodLabel: '2025.01.22 ~ 2025.01.23', summary: '부산 C건설 출장 - 계약 검토 및 현장 미팅', author: '이팀장', dept: '영업1부', team: '영업1팀', status: 'confirmed', createdAt: '2025-01-23' },
  { id: '3', type: REPORT_TYPE.WEEKLY, period: '2025-W03', periodLabel: '2025.01.13 ~ 2025.01.19', summary: '주간 실적 정리, 다음 주 수주 목표 설정', author: '박대리', dept: '영업2부', team: '영업2팀', status: 'draft', createdAt: '2025-01-19' },
  { id: '4', type: REPORT_TYPE.TRIP, period: '2025-01-15', periodLabel: '2025.01.15 ~ 2025.01.16', summary: '대구 D사 출장 - AS 점검 및 재발주 논의', author: '정매니저', dept: '영업2부', team: '영업2팀', status: 'submitted', createdAt: '2025-01-16' },
  { id: '5', type: REPORT_TYPE.WEEKLY, period: '2025-W02', periodLabel: '2025.01.06 ~ 2025.01.12', summary: '연초 영업 계획 수립, 주요 고객사 연락', author: '김영업', dept: '영업1부', team: '영업1팀', status: 'confirmed', createdAt: '2025-01-12' },
];

/** id로 상세 조회 (주간/출장 공통 필드 + 유형별 확장) */
export function getReportById(id) {
  const row = MOCK_REPORT_LIST.find((r) => r.id === id);
  if (!row) return null;
  if (row.type === REPORT_TYPE.WEEKLY) {
    return {
      ...row,
      weekLabel: row.period,
      keyTasks: ['A건설 SPEC 검토 및 견적 지원', 'B현장 진행 상황 점검', '주간 실적 보고서 작성'],
      nextPlan: '다음 주 수주 목표 달성, C사 미팅 준비',
      issues: '원자재 단가 상승에 따른 단가 조정 요청 건 검토 필요',
      attachments: [],
      comments: [{ id: 'c1', author: '팀장', text: '잘 정리되었습니다. 다음 주 계획 실행에 착수하세요.', createdAt: '2025-01-27' }],
    };
  }
  return {
    ...row,
    tripFrom: '2025-01-22',
    tripTo: '2025-01-23',
    destination: '부산 C건설',
    purpose: '계약 검토 및 현장 미팅',
    companions: '이팀장, 현장담당 1명',
    activities: [{ activity: '계약서 검토', result: '조건 합의 완료' }, { activity: '현장 방문', result: '납기 일정 확인' }],
    followUp: '2주 내 계약서 최종 서명 예정',
    costExpand: true,
    costSummary: '교통비 120,000원, 숙박 80,000원',
    attachments: [],
    comments: [],
  };
}

/** 필터 옵션 Mock */
export const MOCK_DEPTS = ['영업1부', '영업2부'];
export const MOCK_TEAMS = ['영업1팀', '영업2팀'];
export const MOCK_AUTHORS = ['김영업', '이팀장', '박대리', '정매니저'];

/** 내가 작성한 주간보고 목록 (최신순, Mock) */
const MOCK_MY_WEEKLY_REPORTS = [
  {
    id: 'my-1',
    week: '2026-W05',
    weekLabel: '2026년 1월 5주차',
    periodLabel: '1월 27일 ~ 2월 2일',
    createdAt: '2026-01-30',
    keyTasks: [
      { text: 'A건설 SPEC 검토 및 견적 지원' },
      { text: 'B현장 진행 상황 점검' },
      { text: '주간 실적 보고서 작성' },
    ],
    keyTaskDetail: '이번 주에는 A건설 신규 SPEC 검토와 B현장 진행 상황 점검을 진행했습니다. 견적 지원 자료를 제출했으며, B현장은 일정대로 진행 중입니다.',
    issues: '원자재 단가 상승에 따른 단가 조정 요청 건 검토 필요. 다음 주 중 검토 결과 공유 예정.',
    nextWeekTasks: [
      { text: 'C사 미팅 준비 및 제안서 작성' },
      { text: '수주 목표 달성 계획 점검' },
    ],
    nextWeekDetail: '다음 주에는 C사 미팅을 진행하고 제안서를 제출할 예정입니다. 수주 목표 달성을 위해 기존 고객사 추이를 점검하겠습니다.',
    nextWeekIssues: '특별한 이슈 없음.',
    author: '홍길동',
    team: '영업1팀',
  },
  {
    id: 'my-2',
    week: '2026-W04',
    weekLabel: '2026년 1월 4주차',
    periodLabel: '1월 20일 ~ 1월 26일',
    createdAt: '2026-01-26',
    keyTasks: [
      { text: 'D사 견적 검토 및 제안' },
      { text: '주간 실적 집계' },
    ],
    keyTaskDetail: 'D사 신규 견적 요청에 대해 검토 후 제안서를 제출했습니다. 주간 실적은 전주 대비 소폭 상승.',
    issues: '없음.',
    nextWeekTasks: [
      { text: 'A건설 SPEC 검토' },
      { text: 'B현장 진행 점검' },
    ],
    nextWeekDetail: '다음 주 A건설 SPEC 검토와 B현장 점검 예정입니다.',
    nextWeekIssues: '없음.',
    author: '홍길동',
    team: '영업1팀',
  },
  {
    id: 'my-3',
    week: '2026-W03',
    weekLabel: '2026년 1월 3주차',
    periodLabel: '1월 13일 ~ 1월 19일',
    createdAt: '2026-01-19',
    keyTasks: [
      { text: '연초 영업 계획 수립' },
      { text: '주요 고객사 연하장 발송' },
    ],
    keyTaskDetail: '연초 영업 계획을 수립하고 주요 고객사에 연하장을 발송했습니다.',
    issues: '없음.',
    nextWeekTasks: [
      { text: 'D사 견적 검토' },
      { text: '실적 집계' },
    ],
    nextWeekDetail: '다음 주 견적 검토 및 실적 집계 예정.',
    nextWeekIssues: '없음.',
    author: '홍길동',
    team: '영업1팀',
  },
];

/** 내가 작성한 주간보고 목록 (최신순) */
export function getMyWeeklyReportList() {
  return MOCK_MY_WEEKLY_REPORTS.map(({ id, weekLabel, periodLabel, createdAt }) => ({
    id,
    weekLabel,
    periodLabel,
    createdAt,
  }));
}

/** id로 내 주간보고 상세 조회 */
export function getMyWeeklyReportById(id) {
  return MOCK_MY_WEEKLY_REPORTS.find((r) => r.id === id) ?? null;
}

/** 내가 최근 작성한 주간보고 (가장 최신 1건) */
export function getMyLatestWeeklyReport() {
  return MOCK_MY_WEEKLY_REPORTS[0] ?? null;
}
