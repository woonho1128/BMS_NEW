/**
 * CSV 다운로드 공통 유틸
 * - 엑셀에서 한글 깨짐을 줄이기 위해 BOM(UTF-8) 포함
 */

function escapeCsv(value) {
  const s = value == null ? '' : String(value);
  // 쉼표/따옴표/개행 포함 시 CSV 이스케이프
  if (/[,"\n\r]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

/**
 * @typedef {{ key: string; label: string }} CsvColumn
 */

/**
 * @param {string} filename
 * @param {(string|CsvColumn)[]} columns
 * @param {Record<string, any>[]} rows
 */
export function downloadCsv(filename, columns, rows) {
  const cols = columns.map((c) => (typeof c === 'string' ? { key: c, label: c } : c));
  const headerLine = cols.map((c) => escapeCsv(c.label)).join(',');
  const lines = rows.map((r) => cols.map((c) => escapeCsv(r?.[c.key])).join(','));
  const csv = [headerLine, ...lines].join('\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

