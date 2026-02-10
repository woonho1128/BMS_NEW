/**
 * 통합 BMS 권한 상수
 * - Role 하드코딩 금지, Permission 기반 제어
 * - 백엔드 권한 모델과 1:1 매핑
 */

export const PERMISSIONS = {
  APPROVAL: 'APPROVAL',
  VIEW_FINANCE: 'VIEW_FINANCE',
  MANAGE_SALES: 'MANAGE_SALES',
  MANAGE_DELIVERY: 'MANAGE_DELIVERY',
  VIEW_REPORT: 'VIEW_REPORT',
  /** 공지/자료실 관리(수정·삭제) — 관리자 */
  MANAGE_PARTNER_NOTICE: 'MANAGE_PARTNER_NOTICE',
  /** 필요 시 확장 */
};

/**
 * 사용자가 요구 권한을 갖고 있는지 검사
 * @param {{ permissions?: string[] } | null} user - useAuth().user
 * @param {string | string[]} required - 단일 permission 또는 배열(하나라도 있으면 통과)
 * @returns {boolean}
 */
export function hasPermission(user, required) {
  if (!user?.permissions?.length) return false;
  const list = Array.isArray(required) ? required : [required];
  return list.some((p) => user.permissions.includes(p));
}
