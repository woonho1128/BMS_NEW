/**
 * 보고관리 Mock (주간보고/출장보고 통합 목록)
 */

export const REPORT_TYPE = { WEEKLY: 'weekly', TRIP: 'trip' };
export const REPORT_STATUS = { DRAFT: 'draft', SUBMITTED: 'submitted', CONFIRMED: 'confirmed' };

const STATUS_LABEL = {
  [REPORT_STATUS.DRAFT]: '임시저장',
  [REPORT_STATUS.SUBMITTED]: '제출완료',
  [REPORT_STATUS.CONFIRMED]: '확인완료',
};

export function getStatusLabel(status) {
  return STATUS_LABEL[status] ?? status;
}

export const MOCK_REPORT_LIST = [
  {
    id: '1',
    type: REPORT_TYPE.WEEKLY,
    period: '2025-W04',
    weekLabel: '2025년 1월 4주차',
    periodLabel: '2025.01.20 ~ 2025.01.26',
    summary: 'A건설 SPEC 검토 및 견적 지원, B현장 진행 상황 점검',
    author: '김영업',
    dept: '영업1부',
    team: '영업1팀',
    status: REPORT_STATUS.SUBMITTED,
    createdAt: '2025-01-26',
  },
  {
    id: '2',
    type: REPORT_TYPE.TRIP,
    period: '2025-01-22',
    periodLabel: '2025.01.22 ~ 2025.01.23',
    summary: '부산 C건설 출장 - 계약 검토 및 현장 미팅',
    author: '이순희',
    dept: '영업1부',
    team: '영업1팀',
    status: REPORT_STATUS.CONFIRMED,
    createdAt: '2025-01-23',
  },
  {
    id: '3',
    type: REPORT_TYPE.WEEKLY,
    period: '2025-W03',
    weekLabel: '2025년 1월 3주차',
    periodLabel: '2025.01.13 ~ 2025.01.19',
    summary: '주간 실적 정리, 차주 수주 목표 수립',
    author: '박수정',
    dept: '영업2부',
    team: '영업2팀',
    status: REPORT_STATUS.DRAFT,
    createdAt: '2025-01-19',
  },
  {
    id: '4',
    type: REPORT_TYPE.TRIP,
    period: '2025-01-15',
    periodLabel: '2025.01.15 ~ 2025.01.16',
    summary: '대구 D사 출장 - AS 이슈 협의',
    author: '정도현',
    dept: '영업2부',
    team: '영업2팀',
    status: REPORT_STATUS.SUBMITTED,
    createdAt: '2025-01-16',
  },
  {
    id: '5',
    type: REPORT_TYPE.WEEKLY,
    period: '2025-W02',
    weekLabel: '2025년 1월 2주차',
    periodLabel: '2025.01.06 ~ 2025.01.12',
    summary: '연초 영업 계획 수립, 주요 고객사 컨택',
    author: '김영업',
    dept: '영업1부',
    team: '영업1팀',
    status: REPORT_STATUS.CONFIRMED,
    createdAt: '2025-01-12',
  },
];

export function getReportById(id) {
  const row = MOCK_REPORT_LIST.find((r) => r.id === id);
  if (!row) return null;

  if (row.type === REPORT_TYPE.WEEKLY) {
    return {
      ...row,
      keyTasks: ['A건설 SPEC 검토 및 견적 지원', 'B현장 진행 상황 점검', '주간 실적 보고서 작성'],
      keyTaskDetail: 'A건설 SPEC 검토, B현장 진행 점검 및 주간 실적 보고서를 작성했습니다.',
      issues: '원자재 단가 상승에 따른 단가 조정 요청 건 검토 필요',
      nextPlan: '다음 주 수주 목표 달성, C사 미팅 준비',
      nextWeekTasks: ['다음 주 수주 목표 달성', 'C사 미팅 준비'],
      nextWeekDetail: '주요 고객사 미팅 준비와 제안안 보완을 진행할 예정입니다.',
      nextWeekIssues: '단가 조정 요청 건 검토 필요',
      attachments: [],
      comments: [
        {
          id: 'c1',
          author: '팀장',
          text: '잘 정리되었습니다. 다음 주 계획 실행에 착수하세요.',
          createdAt: '2025-01-27',
        },
      ],
    };
  }

  return {
    ...row,
    tripFrom: '2025-01-22',
    tripTo: '2025-01-23',
    destination: '부산 C건설',
    purpose: '계약 검토 및 현장 미팅',
    companions: '현장담당 1명',
    activities: [
      { activity: '계약서 검토', result: '조건 협의 완료' },
      { activity: '현장 방문', result: '납기 일정 확인' },
    ],
    followUp: '2주 내 계약서 최종 서명 예정',
    costExpand: true,
    costSummary: '교통비 120,000원 / 숙박 80,000원',
    attachments: [],
    comments: [],
  };
}

export const MOCK_DEPTS = ['영업1부', '영업2부'];
export const MOCK_TEAMS = ['영업1팀', '영업2팀'];
export const MOCK_AUTHORS = ['김영업', '이순희', '박수정', '정도현'];

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
    keyTaskDetail: 'A건설 신규 SPEC 검토와 B현장 진행 상황 점검을 진행했습니다.',
    issues: '원자재 단가 상승에 따른 단가 조정 요청 검토 필요',
    nextWeekTasks: [{ text: 'C사 미팅 준비 및 제안서 작성' }, { text: '수주 목표 달성 계획 점검' }],
    nextWeekDetail: '다음 주 C사 미팅을 진행하고 제안서를 제출할 예정입니다.',
    nextWeekIssues: '업계 특이 이슈 없음',
    author: '김영업',
    team: '영업1팀',
  },
  {
    id: 'my-2',
    week: '2026-W04',
    weekLabel: '2026년 1월 4주차',
    periodLabel: '1월 20일 ~ 1월 26일',
    createdAt: '2026-01-26',
    keyTasks: [{ text: 'D사 견적 검토 및 제안' }, { text: '주간 실적 집계' }],
    keyTaskDetail: 'D사 견적 요청 건을 검토하고 제안서를 제출했습니다.',
    issues: '없음',
    nextWeekTasks: [{ text: 'A건설 SPEC 검토' }, { text: 'B현장 진행 점검' }],
    nextWeekDetail: '다음 주 A건설 SPEC 검토와 B현장 점검 예정입니다.',
    nextWeekIssues: '없음',
    author: '김영업',
    team: '영업1팀',
  },
];

export function getMyWeeklyReportList() {
  return MOCK_MY_WEEKLY_REPORTS.map(({ id, weekLabel, periodLabel, createdAt }) => ({
    id,
    weekLabel,
    periodLabel,
    createdAt,
  }));
}

export function getMyWeeklyReportById(id) {
  return MOCK_MY_WEEKLY_REPORTS.find((r) => r.id === id) ?? null;
}

export function getMyLatestWeeklyReport() {
  return MOCK_MY_WEEKLY_REPORTS[0] ?? null;
}
