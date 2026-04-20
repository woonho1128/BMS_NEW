/**
 * 관리자 기능 Mock 데이터
 */

export const MOCK_USERS = [
  { id: '1', loginId: 'admin', name: '관리자', email: 'admin@bms.com', phone: '010-0000-0000', department: 'IT팀', position: '팀장', role: 'admin', status: 'active', lastLoginAt: '2026-04-07 09:00:00', createdAt: '2025-01-01' },
  { id: '2', loginId: 'hong', name: '홍길동', email: 'hong@bms.com', phone: '010-1234-5678', department: '영업팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2026-04-07 08:30:00', createdAt: '2025-01-15' },
  { id: '3', loginId: 'kim', name: '김영희', email: 'kim@bms.com', phone: '010-2345-6789', department: '영업팀', position: '과장', role: 'user', status: 'active', lastLoginAt: '2026-04-06 17:20:00', createdAt: '2025-02-01' },
  { id: '4', loginId: 'park', name: '박민수', email: 'park@bms.com', phone: '010-3456-7890', department: '물류팀', position: '사원', role: 'user', status: 'inactive', lastLoginAt: '2026-04-03 14:00:00', createdAt: '2025-02-10' },
  { id: '5', loginId: 'lee', name: '이지은', email: 'lee@bms.com', phone: '010-4567-8901', department: '영업팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2026-04-07 08:00:00', createdAt: '2025-03-01' },
  { id: '6', loginId: 'choi', name: '최윤한', email: 'choi@bms.com', phone: '010-5678-9012', department: 'IT팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2026-04-06 16:00:00', createdAt: '2025-03-15' },
  { id: '7', loginId: 'jung', name: '정하림', email: 'jung@bms.com', phone: '010-6789-0123', department: '재무팀', position: '과장', role: 'user', status: 'active', lastLoginAt: '2026-04-07 09:15:00', createdAt: '2025-04-01' },
  { id: '8', loginId: 'kang', name: '강보라', email: 'kang@bms.com', phone: '010-7890-1234', department: '물류팀', position: '대리', role: 'user', status: 'active', lastLoginAt: '2026-04-05 14:30:00', createdAt: '2025-04-20' },
  { id: '9', loginId: 'yoon', name: '윤서진', email: 'yoon@bms.com', phone: '010-8901-2345', department: '인사팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2026-04-07 07:45:00', createdAt: '2025-05-01' },
  { id: '10', loginId: 'jang', name: '장민호', email: 'jang@bms.com', phone: '010-9012-3456', department: '영업팀', position: '팀장', role: 'user', status: 'active', lastLoginAt: '2026-04-07 08:50:00', createdAt: '2025-05-15' },
  { id: '11', loginId: 'han', name: '한유진', email: 'han@bms.com', phone: '010-0123-4567', department: 'IT팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2026-04-06 18:00:00', createdAt: '2025-06-01' },
  { id: '12', loginId: 'song', name: '송지훈', email: 'song@bms.com', phone: '010-1111-2222', department: '재무팀', position: '사원', role: 'user', status: 'active', lastLoginAt: '2026-04-04 10:00:00', createdAt: '2025-06-20' },
];

export const MOCK_ORGS = [
  { id: '1', code: 'HQ', name: '본사', parentId: null, level: 1, order: 1, isActive: true },
  { id: '2', code: 'SALES', name: '영업본부', parentId: '1', level: 2, order: 1, isActive: true },
  { id: '3', code: 'LOGISTICS', name: '물류본부', parentId: '1', level: 2, order: 2, isActive: true },
  { id: '4', code: 'IT', name: 'IT본부', parentId: '1', level: 2, order: 3, isActive: true },
  { id: '5', code: 'FINANCE', name: '재무본부', parentId: '1', level: 2, order: 4, isActive: true },
  { id: '6', code: 'HR', name: '인사본부', parentId: '1', level: 2, order: 5, isActive: true },
  { id: '7', code: 'RETAIL1', name: '리테일 1팀', parentId: '2', level: 3, order: 1, isActive: true },
  { id: '8', code: 'RETAIL2', name: '리테일 2팀', parentId: '2', level: 3, order: 2, isActive: true },
  { id: '9', code: 'PROJ', name: '프로젝트팀', parentId: '2', level: 3, order: 3, isActive: true },
  { id: '10', code: 'OPS', name: '운영지원팀', parentId: '3', level: 3, order: 1, isActive: true },
];

export const MOCK_MEMBERS_BY_ORG = {
  '1': [{ id: '1', name: '관리자', title: '시스템 관리자', email: 'admin@bms.com', status: 'active' }],
  '2': [
    { id: '2', name: '홍길동', title: '영업 대리', email: 'hong@bms.com', status: 'active' },
    { id: '3', name: '김영희', title: '영업 과장', email: 'kim@bms.com', status: 'active' },
    { id: '10', name: '장민호', title: '영업 팀장', email: 'jang@bms.com', status: 'active' },
  ],
  '3': [
    { id: '4', name: '박민수', title: '물류 사원', email: 'park@bms.com', status: 'inactive' },
    { id: '8', name: '강보라', title: '물류 대리', email: 'kang@bms.com', status: 'active' },
  ],
  '4': [
    { id: '6', name: '최윤한', title: 'IT 대리', email: 'choi@bms.com', status: 'active' },
    { id: '11', name: '한유진', title: 'IT 사원', email: 'han@bms.com', status: 'active' },
  ],
  '5': [{ id: '7', name: '정하림', title: '재무 과장', email: 'jung@bms.com', status: 'active' }],
  '6': [{ id: '9', name: '윤서진', title: '인사 사원', email: 'yoon@bms.com', status: 'active' }],
  '7': [],
  '8': [],
  '9': [],
  '10': [{ id: '12', name: '송지훈', title: '운영지원 사원', email: 'song@bms.com', status: 'active' }],
};

export const MOCK_ORG_HISTORY_BY_ORG = {
  '2': [
    {
      id: 'h1',
      at: '2026-03-12 10:30:00',
      targetUserName: '홍길동',
      fromOrgName: '본사',
      toOrgName: '영업본부',
      actorName: '관리자',
    },
    {
      id: 'h2',
      at: '2026-03-21 14:20:00',
      targetUserName: '김영희',
      fromOrgName: '물류본부',
      toOrgName: '영업본부',
      actorName: '관리자',
    },
  ],
};

export const MOCK_PERMISSION_GROUPS = [
  {
    id: '1',
    name: '시스템 관리자',
    description: '모든 기능 접근 가능',
    permissions: ['all'],
    userCount: 1,
  },
  {
    id: '2',
    name: '영업 관리자',
    description: '영업 영역 관리 권한',
    permissions: ['sales:read', 'sales:write', 'sales:approve'],
    userCount: 5,
  },
  {
    id: '3',
    name: '일반 사용자',
    description: '조회 중심 권한',
    permissions: ['sales:read', 'delivery:read'],
    userCount: 20,
  },
];

export const MOCK_CODES = [
  { id: '1', groupCode: 'PROGRESS', groupName: '진행상태', code: 'PROGRESS_01', codeName: '진행중', sortOrder: 1, useYn: true },
  { id: '2', groupCode: 'PROGRESS', groupName: '진행상태', code: 'PROGRESS_02', codeName: '완료', sortOrder: 2, useYn: true },
  { id: '3', groupCode: 'PROGRESS', groupName: '진행상태', code: 'PROGRESS_03', codeName: '대기', sortOrder: 3, useYn: true },
  { id: '4', groupCode: 'STATUS', groupName: '거래상태', code: 'STATUS_01', codeName: '거래중', sortOrder: 1, useYn: true },
  { id: '5', groupCode: 'STATUS', groupName: '거래상태', code: 'STATUS_02', codeName: '거래중단', sortOrder: 2, useYn: true },
  { id: '6', groupCode: 'PARTNER_TRAIT', groupName: '대리점 성격', code: 'PARTNER_TRAIT_DELIVERY', codeName: '납품', sortOrder: 1, useYn: true },
  { id: '7', groupCode: 'PARTNER_TRAIT', groupName: '대리점 성격', code: 'PARTNER_TRAIT_RETAIL', codeName: '도소매', sortOrder: 2, useYn: true },
  { id: '8', groupCode: 'PARTNER_TRAIT', groupName: '대리점 성격', code: 'PARTNER_TRAIT_TILE', codeName: '타일', sortOrder: 3, useYn: true },
];

export const MOCK_LOGS = [
  { id: '1', userId: 'hong', userName: '홍길동', action: 'LOGIN', actionName: '로그인', ip: '192.168.0.100', userAgent: 'Chrome/124', createdAt: '2026-04-07 09:00:00' },
  { id: '2', userId: 'kim', userName: '김영희', action: 'VIEW', actionName: '조회', resource: '/sales/info', resourceName: '영업정보', ip: '192.168.0.101', createdAt: '2026-04-07 09:05:00' },
  { id: '3', userId: 'admin', userName: '관리자', action: 'DELETE', actionName: '삭제', resource: '/admin/users/4', resourceName: '사용자관리', ip: '192.168.0.1', createdAt: '2026-04-07 09:30:00' },
];

export function getUsersList(filter) {
  let result = [...MOCK_USERS];
  if (filter.name) result = result.filter((user) => user.name.toLowerCase().includes(filter.name.toLowerCase()));
  if (filter.loginId) result = result.filter((user) => user.loginId.toLowerCase().includes(filter.loginId.toLowerCase()));
  if (filter.department) result = result.filter((user) => user.department === filter.department);
  if (filter.status) result = result.filter((user) => user.status === filter.status);
  return result;
}

export function getOrgsList() {
  return [...MOCK_ORGS];
}

export function getOrgById(id) {
  return MOCK_ORGS.find((org) => org.id === id) || null;
}

export function getMembersByOrgId(orgId) {
  return MOCK_MEMBERS_BY_ORG[orgId] || [];
}

export function getOrgHistoryByOrgId(orgId) {
  return MOCK_ORG_HISTORY_BY_ORG[orgId] || [];
}

export function getChildOrgCount(orgId, orgs) {
  return orgs.filter((org) => org.parentId === orgId).length;
}

export function getPermissionGroupsList() {
  return [...MOCK_PERMISSION_GROUPS];
}

export function getCodesList(filter) {
  let result = [...MOCK_CODES];
  if (filter.groupCode) result = result.filter((code) => code.groupCode === filter.groupCode);
  if (filter.codeName) result = result.filter((code) => code.codeName.toLowerCase().includes(filter.codeName.toLowerCase()));
  return result;
}

export function getLogsList(filter) {
  let result = [...MOCK_LOGS];
  if (filter.userName) result = result.filter((log) => log.userName.toLowerCase().includes(filter.userName.toLowerCase()));
  if (filter.action) result = result.filter((log) => log.action === filter.action);
  if (filter.dateFrom) result = result.filter((log) => log.createdAt >= filter.dateFrom);
  if (filter.dateTo) result = result.filter((log) => log.createdAt <= filter.dateTo);
  return result;
}
