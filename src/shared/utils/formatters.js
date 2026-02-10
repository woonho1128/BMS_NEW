/**
 * 공통 포맷터 유틸
 * - 화면에서 금액/수량 표시를 일관되게 하기 위해 사용
 */

/**
 * @param {any} v
 * @returns {string}
 */
export function formatNumber(v) {
  if (v == null || Number.isNaN(Number(v))) return '—';
  return Number(v).toLocaleString();
}

/**
 * 금액 표시(천단위 콤마). 숫자 아니면 '—'
 * @param {any} v
 * @returns {string}
 */
export function formatMoney(v) {
  return formatNumber(v);
}

