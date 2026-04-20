import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import styles from './CustomReportPage.module.css';

const YEAR_OPTIONS = [2023, 2024, 2025, 2026];

const REPORT_DATA_BY_YEAR = {
  2023: {
    share: ['62%', '17%', '4%', '4%', '5%', '8%', '100%'],
    rows: [
      { type: 'main', label: '수주액', values: ['55,280', '15,097', '3,332', '3,585', '4,723', '6,797', '88,814'] },
      { type: 'main', label: 'SW', values: ['32,348', '10,663', '1,635', '1,663', '2,611', '2,810', '51,729'] },
      { type: 'sub', label: 'SW 국산', values: ['17,504', '5,664', '1,196', '887', '923', '2,198', '28,372'] },
      { type: 'sub', label: 'SW OEM', values: ['4,235', '3,003', '15', '534', '697', '62', '8,547'] },
      { type: 'sub', label: 'SW 상품', values: ['10,608', '1,996', '423', '241', '991', '550', '14,810'] },
      { type: 'main', label: '수전금구', values: ['20,046', '3,627', '176', '1,403', '1,660', '377', '27,289'] },
      { type: 'main', label: '비데(금액)', values: ['2,886', '807', '1,522', '519', '452', '3,611', '9,797'] },
      { type: 'sub', label: '일체형', values: ['1,547', '380', '1,522', '192', '295', '3,611', '7,547'] },
      { type: 'sub', label: '분리형', values: ['1,339', '427', '0', '327', '157', '0', '2,250'] },

      { type: 'section', label: '톤당단가', values: ['', '', '', '', '', '', ''] },
      { type: 'main', label: '톤수(TON)', values: ['6,734', '2,343', '277', '345', '631', '366', '10,697'] },
      { type: 'sub', label: 'SW 국산', values: ['4,606', '1,190', '270', '172', '222', '343', '6,803'] },
      { type: 'sub', label: 'SW OEM', values: ['2,128', '1,153', '7', '173', '409', '23', '3,894'] },
      { type: 'main', label: '톤당단가(천원)', values: ['3,228', '3,699', '4,379', '4,117', '2,567', '6,166', '3,451'] },
      { type: 'sub', label: 'SW 국산', values: ['3,801', '4,760', '4,428', '5,161', '4,161', '6,405', '4,171'] },
      { type: 'sub', label: 'SW OEM', values: ['1,990', '2,605', '2,349', '3,081', '1,703', '2,649', '2,195'] },
      { type: 'main', label: '비데(수량)', values: ['20,069', '5,364', '9,579', '3,350', '3,100', '10,128', '51,590'] },
      { type: 'sub', label: '일체형', values: ['8,646', '1,912', '9,579', '921', '1,834', '10,128', '33,020'] },
      { type: 'sub', label: '분리형', values: ['11,423', '3,452', '0', '2,429', '1,266', '0', '18,570'] },
    ],
  },
};

function scaleValues(values, ratio) {
  return values.map((value) => {
    if (value === '' || value === '-') return value;
    if (typeof value === 'string' && value.includes('%')) return value;
    if (typeof value === 'string' && value.toLowerCase() === 'na') return value;
    const num = Number(String(value).replaceAll(',', ''));
    if (Number.isNaN(num)) return value;
    return Math.round(num * ratio).toLocaleString('ko-KR');
  });
}

function createYearData(year) {
  if (REPORT_DATA_BY_YEAR[year]) return REPORT_DATA_BY_YEAR[year];
  const base = REPORT_DATA_BY_YEAR[2023];
  const diff = year - 2023;
  const ratio = 1 + diff * 0.04;
  return {
    share: base.share,
    rows: base.rows.map((row) => ({
      ...row,
      values: scaleValues(row.values, row.type === 'section' ? 1 : ratio),
    })),
  };
}

const CHANNEL_HEADERS = ['연간단가', '사전입찰', '유상옵션', '시행영업', '관급영업', '조합영업', '실적(개)'];

export function CustomReportPage() {
  const { pathname } = useLocation();
  const [year, setYear] = useState(2023);
  const reportData = useMemo(() => createYearData(year), [year]);

  return (
    <PageShell
      path={pathname}
      title="연도 별 채널 비중"
      description="연도별 수주액, 톤당단가, 채널별 비중을 조회합니다."
      className={styles.shellWide}
    >
      <div className={styles.page}>
        <div className={styles.filterBar}>
          <label className={styles.filterItem}>
            <span>조회년도</span>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {YEAR_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}년
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.tableTitleRow}>
            <strong>5. 연도별 수주액, 톤당단가, 채널별 비중(비율)</strong>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.labelCol}></th>
                <th colSpan={CHANNEL_HEADERS.length}>{year}년</th>
              </tr>
              <tr>
                <th className={styles.labelCol}>채널별 비중</th>
                {CHANNEL_HEADERS.map((header, idx) => (
                  <th key={header} className={idx === CHANNEL_HEADERS.length - 1 ? styles.emphasis : ''}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={styles.shareRow}>
                <td className={styles.labelCol}>채널별 비중</td>
                {reportData.share.map((value, idx) => (
                  <td key={`share-${idx}`}>{value}</td>
                ))}
              </tr>
              {reportData.rows.map((row, idx) => {
                const rowClass =
                  row.type === 'section' ? styles.sectionRow : row.type === 'sub' ? styles.subRow : styles.mainRow;
                return (
                  <tr key={`${row.label}-${idx}`} className={rowClass}>
                    <td className={styles.labelCol}>
                      <span className={row.type === 'sub' ? styles.subLabel : ''}>{row.label}</span>
                    </td>
                    {row.values.map((value, valueIdx) => (
                      <td key={`${row.label}-${valueIdx}`}>{value}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

export default CustomReportPage;
