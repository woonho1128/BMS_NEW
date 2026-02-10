/**
 * 관리자 기능 Mock 데이터
 */

// 사용자 목록 (30명 샘플)
export const MOCK_USERS = [
  { id: '1', loginId: 'admin', name: '관리자', email: 'admin@bms.com', phone: '010-0000-0000', department: 'IT팀', position: '팀장', role: 'admin', status: 'active', lastLoginAt: '2025-01-30 09:00:00', createdAt: '2024-01-01' },
  { id: '2', loginId: 'hong', name: '홍길동', email: 'hong@bms.com', phone: '010-1234-5678', department: '영업팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2025-01-30 08:30:00', createdAt: '2024-02-15' },
  { id: '3', loginId: 'kim', name: '김영희', email: 'kim@bms.com', phone: '010-2345-6789', department: '영업팀', position: '과장', role: 'user', status: 'active', lastLoginAt: '2025-01-29 17:20:00', createdAt: '2024-03-01' },
  { id: '4', loginId: 'park', name: '박철수', email: 'park@bms.com', phone: '010-3456-7890', department: '물류팀', position: '사원', role: 'user', status: 'inactive', lastLoginAt: '2025-01-25 14:00:00', createdAt: '2024-04-10' },
  { id: '5', loginId: 'lee', name: '이민수', email: 'lee@bms.com', phone: '010-4567-8901', department: '영업팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-30 08:00:00', createdAt: '2024-05-01' },
  { id: '6', loginId: 'choi', name: '최지훈', email: 'choi@bms.com', phone: '010-5678-9012', department: 'IT팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2025-01-29 16:00:00', createdAt: '2024-05-15' },
  { id: '7', loginId: 'jung', name: '정수진', email: 'jung@bms.com', phone: '010-6789-0123', department: '재무팀', position: '과장', role: 'user', status: 'active', lastLoginAt: '2025-01-30 09:15:00', createdAt: '2024-06-01' },
  { id: '8', loginId: 'kang', name: '강동원', email: 'kang@bms.com', phone: '010-7890-1234', department: '물류팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2025-01-28 14:30:00', createdAt: '2024-06-20' },
  { id: '9', loginId: 'yoon', name: '윤서아', email: 'yoon@bms.com', phone: '010-8901-2345', department: '인사팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-30 07:45:00', createdAt: '2024-07-01' },
  { id: '10', loginId: 'jang', name: '장민호', email: 'jang@bms.com', phone: '010-9012-3456', department: '영업팀', position: '팀장', role: 'user', status: 'active', lastLoginAt: '2025-01-30 08:50:00', createdAt: '2024-07-15' },
  { id: '11', loginId: 'han', name: '한소희', email: 'han@bms.com', phone: '010-0123-4567', department: 'IT팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-29 18:00:00', createdAt: '2024-08-01' },
  { id: '12', loginId: 'song', name: '송민재', email: 'song@bms.com', phone: '010-1111-2222', department: '재무팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-27 10:00:00', createdAt: '2024-08-20' },
  { id: '13', loginId: 'lim', name: '임하늘', email: 'lim@bms.com', phone: '010-2222-3333', department: '물류팀', position: '과장', role: 'user', status: 'active', lastLoginAt: '2025-01-30 09:30:00', createdAt: '2024-09-01' },
  { id: '14', loginId: 'shin', name: '신동엽', email: 'shin@bms.com', phone: '010-3333-4444', department: '영업팀', position: '사원', role: 'user', status: 'inactive', lastLoginAt: '2025-01-20 12:00:00', createdAt: '2024-09-15' },
  { id: '15', loginId: 'oh', name: '오세훈', email: 'oh@bms.com', phone: '010-4444-5555', department: 'IT팀', position: '과장', role: 'user', status: 'active', lastLoginAt: '2025-01-30 08:20:00', createdAt: '2024-10-01' },
  { id: '16', loginId: 'seo', name: '서유나', email: 'seo@bms.com', phone: '010-5555-6666', department: '인사팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2025-01-29 17:00:00', createdAt: '2024-10-15' },
  { id: '17', loginId: 'kwon', name: '권지민', email: 'kwon@bms.com', phone: '010-6666-7777', department: '재무팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2025-01-30 09:05:00', createdAt: '2024-11-01' },
  { id: '18', loginId: 'ryu', name: '류승호', email: 'ryu@bms.com', phone: '010-7777-8888', department: '물류팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-28 15:00:00', createdAt: '2024-11-15' },
  { id: '19', loginId: 'baek', name: '백현우', email: 'baek@bms.com', phone: '010-8888-9999', department: '영업팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2025-01-30 08:40:00', createdAt: '2024-12-01' },
  { id: '20', loginId: 'hwang', name: '황지연', email: 'hwang@bms.com', phone: '010-9999-0000', department: 'IT팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-29 16:30:00', createdAt: '2024-12-10' },
  { id: '21', loginId: 'ko', name: '고영수', email: 'ko@bms.com', phone: '010-1212-3434', department: '재무팀', position: '팀장', role: 'user', status: 'active', lastLoginAt: '2025-01-30 09:10:00', createdAt: '2024-12-15' },
  { id: '22', loginId: 'nam', name: '남궁민', email: 'nam@bms.com', phone: '010-3434-5656', department: '인사팀', position: '과장', role: 'user', status: 'active', lastLoginAt: '2025-01-27 11:00:00', createdAt: '2025-01-01' },
  { id: '23', loginId: 'moon', name: '문채원', email: 'moon@bms.com', phone: '010-5656-7878', department: '영업팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-30 08:15:00', createdAt: '2025-01-05' },
  { id: '24', loginId: 'yang', name: '양준혁', email: 'yang@bms.com', phone: '010-7878-9090', department: '물류팀', position: '팀장', role: 'user', status: 'active', lastLoginAt: '2025-01-29 14:00:00', createdAt: '2025-01-10' },
  { id: '25', loginId: 'jin', name: '진영희', email: 'jin@bms.com', phone: '010-9090-1212', department: 'IT팀', position: '대리', role: 'user', status: 'inactive', lastLoginAt: '2025-01-18 09:00:00', createdAt: '2025-01-12' },
  { id: '26', loginId: 'do', name: '도준혁', email: 'do@bms.com', phone: '010-1313-4545', department: '재무팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-30 07:50:00', createdAt: '2025-01-15' },
  { id: '27', loginId: 'bae', name: '배성민', email: 'bae@bms.com', phone: '010-4545-6767', department: '영업팀', position: '과장', role: 'user', status: 'active', lastLoginAt: '2025-01-29 17:45:00', createdAt: '2025-01-18' },
  { id: '28', loginId: 'no', name: '노지훈', email: 'no@bms.com', phone: '010-6767-8989', department: '인사팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-30 09:00:00', createdAt: '2025-01-20' },
  { id: '29', loginId: 'cha', name: '차은우', email: 'cha@bms.com', phone: '010-8989-0101', department: '물류팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-28 16:00:00', createdAt: '2025-01-22' },
  { id: '30', loginId: 'sung', name: '성유진', email: 'sung@bms.com', phone: '010-0101-2323', department: 'IT팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2025-01-30 08:25:00', createdAt: '2025-01-25' },
];

// 조직 목록 (30개, 표기: 본사 / IT팀 등 이름만)
export const MOCK_ORGS = [
  { id: '1', code: 'HQ', name: '본사', parentId: null, level: 1, order: 1, isActive: true },
  { id: '2', code: 'SALES', name: '영업팀', parentId: '1', level: 2, order: 1, isActive: true },
  { id: '3', code: 'LOGISTICS', name: '물류팀', parentId: '1', level: 2, order: 2, isActive: true },
  { id: '4', code: 'IT', name: 'IT팀', parentId: '1', level: 2, order: 3, isActive: true },
  { id: '5', code: 'FINANCE', name: '재무팀', parentId: '1', level: 2, order: 4, isActive: true },
  { id: '6', code: 'HR', name: '인사팀', parentId: '1', level: 2, order: 5, isActive: true },
  { id: '7', code: 'SALES1', name: '영업1팀', parentId: '2', level: 3, order: 1, isActive: true },
  { id: '8', code: 'SALES2', name: '영업2팀', parentId: '2', level: 3, order: 2, isActive: true },
  { id: '9', code: 'DEV', name: '개발팀', parentId: '4', level: 3, order: 1, isActive: true },
  { id: '10', code: 'INFRA', name: '인프라팀', parentId: '4', level: 3, order: 2, isActive: true },
  { id: '11', code: 'FIN_PLAN', name: '재무기획팀', parentId: '5', level: 3, order: 1, isActive: true },
  { id: '12', code: 'ACCT', name: '회계팀', parentId: '5', level: 3, order: 2, isActive: true },
  { id: '13', code: 'RECRUIT', name: '채용팀', parentId: '6', level: 3, order: 1, isActive: true },
  { id: '14', code: 'EDU', name: '교육팀', parentId: '6', level: 3, order: 2, isActive: true },
  { id: '15', code: 'SALES_GLOBAL', name: '해외영업팀', parentId: '2', level: 3, order: 3, isActive: true },
  { id: '16', code: 'SALES_PLAN', name: '영업기획팀', parentId: '2', level: 3, order: 4, isActive: true },
  { id: '17', code: 'SALES_SUPPORT', name: '영업지원팀', parentId: '2', level: 3, order: 5, isActive: true },
  { id: '18', code: 'INBOUND', name: '입고팀', parentId: '3', level: 3, order: 1, isActive: true },
  { id: '19', code: 'OUTBOUND', name: '출고팀', parentId: '3', level: 3, order: 2, isActive: true },
  { id: '20', code: 'SECURITY', name: '보안팀', parentId: '4', level: 3, order: 3, isActive: true },
  { id: '21', code: 'QA', name: 'QA팀', parentId: '4', level: 3, order: 4, isActive: true },
  { id: '22', code: 'WELFARE', name: '복리후생팀', parentId: '6', level: 3, order: 3, isActive: true },
  { id: '23', code: 'ADMIN', name: '경영지원팀', parentId: '1', level: 2, order: 6, isActive: true },
  { id: '24', code: 'GENERAL', name: '총무팀', parentId: '23', level: 3, order: 1, isActive: true },
  { id: '25', code: 'LEGAL', name: '법무팀', parentId: '23', level: 3, order: 2, isActive: true },
  { id: '26', code: 'STRATEGY', name: '전략기획팀', parentId: '1', level: 2, order: 7, isActive: true },
  { id: '27', code: 'PLANNING', name: '기획팀', parentId: '26', level: 3, order: 1, isActive: true },
  { id: '28', code: 'BI', name: '경영분석팀', parentId: '26', level: 3, order: 2, isActive: true },
  { id: '29', code: 'MARKETING', name: '마케팅팀', parentId: '1', level: 2, order: 8, isActive: true },
  { id: '30', code: 'DIGITAL_MKT', name: '디지털마케팅팀', parentId: '29', level: 3, order: 1, isActive: true },
];

// 조직별 조직원 (orgId -> members[])
export const MOCK_MEMBERS_BY_ORG = {
  '1': [
    { id: '1', name: '관리자', title: '대표이사', email: 'admin@bms.com', status: 'active' },
  ],
  '2': [
    { id: '2', name: '홍길동', title: '대리', email: 'hong@bms.com', status: 'active' },
    { id: '3', name: '김영희', title: '과장', email: 'kim@bms.com', status: 'active' },
    { id: '6', name: '이민수', title: '사원', email: 'lee@bms.com', status: 'active' },
  ],
  '3': [
    { id: '4', name: '박철수', title: '사원', email: 'park@bms.com', status: 'inactive' },
  ],
  '4': [
    { id: '1', name: '관리자', title: '팀장', email: 'admin@bms.com', status: 'active' },
  ],
  '5': [],
  '6': [],
  '7': [],
  '8': [],
  '9': [],
  '10': [],
  '11': [],
  '12': [],
  '13': [],
  '14': [],
  '15': [],
  '16': [],
  '17': [],
  '18': [],
  '19': [],
  '20': [],
  '21': [],
  '22': [],
  '23': [],
  '24': [],
  '25': [],
  '26': [],
  '27': [],
  '28': [],
  '29': [],
  '30': [],
};

// 조직별 변경 이력 (orgId -> history[])
export const MOCK_ORG_HISTORY_BY_ORG = {
  '1': [
    {
      id: 'h1',
      at: '2025-01-15 10:30:00',
      targetUserName: '홍길동',
      fromOrgName: '본사',
      toOrgName: '영업팀',
      actorName: '관리자',
    },
    {
      id: 'h2',
      at: '2025-01-20 14:20:00',
      targetUserName: '김영희',
      fromOrgName: '물류팀',
      toOrgName: '영업팀',
      actorName: '관리자',
    },
  ],
  '2': [
    {
      id: 'h3',
      at: '2025-01-15 10:30:00',
      targetUserName: '홍길동',
      fromOrgName: '본사',
      toOrgName: '영업팀',
      actorName: '관리자',
    },
    {
      id: 'h4',
      at: '2025-01-20 14:20:00',
      targetUserName: '김영희',
      fromOrgName: '물류팀',
      toOrgName: '영업팀',
      actorName: '관리자',
    },
  ],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
  '8': [],
  '9': [],
  '10': [],
  '11': [],
  '12': [],
  '13': [],
  '14': [],
  '15': [],
  '16': [],
  '17': [],
  '18': [],
  '19': [],
  '20': [],
  '21': [],
  '22': [],
  '23': [],
  '24': [],
  '25': [],
  '26': [],
  '27': [],
  '28': [],
  '29': [],
  '30': [],
};

// 권한 그룹
export const MOCK_PERMISSION_GROUPS = [
  {
    id: '1',
    name: '시스템 관리자',
    description: '모든 권한',
    permissions: ['all'],
    userCount: 1,
  },
  {
    id: '2',
    name: '영업 관리자',
    description: '영업 관련 모든 권한',
    permissions: ['sales:read', 'sales:write', 'sales:approve'],
    userCount: 5,
  },
  {
    id: '3',
    name: '일반 사용자',
    description: '조회 및 기본 기능',
    permissions: ['sales:read', 'delivery:read'],
    userCount: 20,
  },
];

// 시스템 코드
export const MOCK_CODES = [
  {
    id: '1',
    groupCode: 'PROGRESS',
    groupName: '진행상태',
    code: 'PROGRESS_01',
    codeName: '진행중',
    sortOrder: 1,
    useYn: true,
  },
  {
    id: '2',
    groupCode: 'PROGRESS',
    groupName: '진행상태',
    code: 'PROGRESS_02',
    codeName: '완료',
    sortOrder: 2,
    useYn: true,
  },
  {
    id: '3',
    groupCode: 'PROGRESS',
    groupName: '진행상태',
    code: 'PROGRESS_03',
    codeName: '대기',
    sortOrder: 3,
    useYn: true,
  },
  {
    id: '4',
    groupCode: 'STATUS',
    groupName: '거래상태',
    code: 'STATUS_01',
    codeName: '거래중',
    sortOrder: 1,
    useYn: true,
  },
  {
    id: '5',
    groupCode: 'STATUS',
    groupName: '거래상태',
    code: 'STATUS_02',
    codeName: '거래중단',
    sortOrder: 2,
    useYn: true,
  },
];

// 로그 목록
export const MOCK_LOGS = [
  {
    id: '1',
    userId: 'hong',
    userName: '홍길동',
    action: 'LOGIN',
    actionName: '로그인',
    ip: '192.168.0.100',
    userAgent: 'Chrome/120.0',
    createdAt: '2025-01-30 09:00:00',
  },
  {
    id: '2',
    userId: 'hong',
    userName: '홍길동',
    action: 'VIEW',
    actionName: '조회',
    resource: '/sales/info',
    resourceName: '영업정보',
    ip: '192.168.0.100',
    createdAt: '2025-01-30 09:05:00',
  },
  {
    id: '3',
    userId: 'kim',
    userName: '김영희',
    action: 'CREATE',
    actionName: '등록',
    resource: '/sales/material',
    resourceName: '영업자료',
    ip: '192.168.0.101',
    createdAt: '2025-01-30 10:15:00',
  },
  {
    id: '4',
    userId: 'park',
    userName: '박철수',
    action: 'UPDATE',
    actionName: '수정',
    resource: '/master/partners/1',
    resourceName: '대리점 관리',
    ip: '192.168.0.102',
    createdAt: '2025-01-30 11:20:00',
  },
  {
    id: '5',
    userId: 'admin',
    userName: '관리자',
    action: 'DELETE',
    actionName: '삭제',
    resource: '/admin/users/4',
    resourceName: '사용자관리',
    ip: '192.168.0.1',
    createdAt: '2025-01-30 14:30:00',
  },
];

// 사용자 목록 조회
export function getUsersList(filter) {
  let result = [...MOCK_USERS];

  if (filter.name) {
    result = result.filter((user) =>
      user.name.toLowerCase().includes(filter.name.toLowerCase())
    );
  }

  if (filter.loginId) {
    result = result.filter((user) =>
      user.loginId.toLowerCase().includes(filter.loginId.toLowerCase())
    );
  }

  if (filter.department) {
    result = result.filter((user) => user.department === filter.department);
  }

  if (filter.status) {
    result = result.filter((user) => user.status === filter.status);
  }

  return result;
}

// 사용자 ID로 조회
export function getUserById(id) {
  return MOCK_USERS.find((user) => user.id === id) || null;
}

// 조직 목록 조회
export function getOrgsList() {
  return [...MOCK_ORGS];
}

// 조직 ID로 조회
export function getOrgById(id) {
  return MOCK_ORGS.find((org) => org.id === id) || null;
}

// 조직별 조직원 조회
export function getMembersByOrgId(orgId) {
  return MOCK_MEMBERS_BY_ORG[orgId] || [];
}

// 조직별 변경 이력 조회
export function getOrgHistoryByOrgId(orgId) {
  return MOCK_ORG_HISTORY_BY_ORG[orgId] || [];
}

// 조직의 하위 조직 개수 조회
export function getChildOrgCount(orgId, orgs) {
  return orgs.filter((org) => org.parentId === orgId).length;
}

// 권한 그룹 목록 조회
export function getPermissionGroupsList() {
  return [...MOCK_PERMISSION_GROUPS];
}

// 권한 그룹 ID로 조회
export function getPermissionGroupById(id) {
  return MOCK_PERMISSION_GROUPS.find((group) => group.id === id) || null;
}

// 코드 목록 조회
export function getCodesList(filter) {
  let result = [...MOCK_CODES];

  if (filter.groupCode) {
    result = result.filter((code) => code.groupCode === filter.groupCode);
  }

  if (filter.codeName) {
    result = result.filter((code) =>
      code.codeName.toLowerCase().includes(filter.codeName.toLowerCase())
    );
  }

  return result;
}

// 코드 ID로 조회
export function getCodeById(id) {
  return MOCK_CODES.find((code) => code.id === id) || null;
}

// 로그 목록 조회
export function getLogsList(filter) {
  let result = [...MOCK_LOGS];

  if (filter.userName) {
    result = result.filter((log) =>
      log.userName.toLowerCase().includes(filter.userName.toLowerCase())
    );
  }

  if (filter.action) {
    result = result.filter((log) => log.action === filter.action);
  }

  if (filter.dateFrom) {
    result = result.filter((log) => log.createdAt >= filter.dateFrom);
  }

  if (filter.dateTo) {
    result = result.filter((log) => log.createdAt <= filter.dateTo);
  }

  return result;
}
