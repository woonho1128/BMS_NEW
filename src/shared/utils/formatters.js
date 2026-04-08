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

/**
 * Format date range with fallback values.
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
export function formatDateRange(from, to) {
  if (!from && !to) return '-';
  if (!to) return from;
  return `${from} ~ ${to}`;
}

/**
 * Format bytes to readable file size text.
 * @param {number|string} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  const value = Number(bytes) || 0;
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  if (value >= 1024) return `${Math.round(value / 1024)} KB`;
  return `${value} B`;
}
