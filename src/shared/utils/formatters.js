const DEFAULT_LOCALE = 'ko-KR';

/**
 * Format number with Korean locale by default.
 * Returns '-' for null/invalid values to keep table rendering stable.
 * @param {any} value
 * @param {Intl.NumberFormatOptions} [options]
 * @returns {string}
 */
export function formatNumber(value, options) {
  if (value == null || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return '-';
  return new Intl.NumberFormat(DEFAULT_LOCALE, options).format(num);
}

/**
 * Alias for monetary values.
 * @param {any} value
 * @returns {string}
 */
export function formatMoney(value) {
  return formatNumber(value);
}

/**
 * Format percent value (e.g. 12.34 -> "12.34%")
 * @param {any} value
 * @param {number} [digits=2]
 * @returns {string}
 */
export function formatPercent(value, digits = 2) {
  if (value == null || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return '-';
  return `${num.toFixed(digits)}%`;
}
