import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import styles from './YearlyDeliveryForecastPage.module.css';

const YEARLY_DELIVERY_SUMMARY_STORAGE_KEY = 'analytics:yearly-delivery-forecast:summary';

const BASE_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];
const START_YEAR_OPTIONS = [2025, 2026];

const RAW_ROWS = [
  { type: 'main', group: '', label: '당해발행완료', values: ['74,442', '14,411', '-', '-', '-', '-', ''] },
  { type: 'main', group: '', label: '납품잔량', values: ['-', '46,389', '44,766', '19,157', '1,580', '2,343', ''] },

  { type: 'section', group: '납품예정액', label: '납품예정액', values: ['74,442', '60,800', '44,766', '19,157', '1,580', '2,343', ''] },
  { type: 'main', group: '', label: 'SW', values: ['44,173', '37,796', '26,255', '11,992', '651', '1,447', ''] },
  { type: 'sub', group: '', label: 'SW 국산', values: ['26,776', '24,879', '17,144', '7,689', '527', '1,238', ''] },
  { type: 'sub', group: '', label: 'SW OEM', values: ['7,015', '4,837', '4,408', '2,175', '0', '0', ''] },
  { type: 'sub', group: '', label: 'SW 상품', values: ['10,382', '8,080', '4,703', '2,128', '124', '209', ''] },
  { type: 'main', group: '', label: '수전금구', values: ['20,022', '15,235', '11,879', '4,765', '725', '12', ''] },
  { type: 'main', group: '', label: '비데(금액)', values: ['10,247', '7,769', '6,632', '2,399', '204', '885', ''] },
  { type: 'sub', group: '', label: '일체형', values: ['7,860', '6,198', '4,215', '1,521', '54', '885', ''] },
  { type: 'sub', group: '', label: '분리형', values: ['2,387', '1,571', '2,417', '878', '150', '0', ''] },

  { type: 'section', group: '비데(수량)', label: '비데(수량)', values: ['49,145', '37,354', '33,980', '12,865', '1608', '1,368', ''] },
  { type: 'sub', group: '', label: '일체형', values: ['30,081', '24,503', '14,200', '5,613', '268', '1,368', ''] },
  { type: 'sub', group: '', label: '분리형', values: ['19,064', '12,851', '19,780', '7,252', '1,340', '-', ''] },

  { type: 'section', group: '톤당단가', label: '톤(Ton)', values: ['9,050', '7,383', '5,282', '2,517', '122', '182', ''] },
  { type: 'sub', group: '', label: 'SW 국산', values: ['6,003', '5,325', '3,610', '1,452', '122', '182', ''] },
  { type: 'sub', group: '', label: 'SW OEM', values: ['3,048', '2,058', '1,672', '1,064', '0', '0', ''] },
  { type: 'section', group: '단가(천원)', label: '단가(천원)', values: ['3,734', '4,025', '4,081', '3,920', '4,315', '6,822', ''] },
  { type: 'sub', group: '', label: 'SW 국산', values: ['4,461', '4,672', '4,749', '5,295', '4,315', '6,822', ''] },
  { type: 'sub', group: '', label: 'SW OEM', values: ['2,302', '2,350', '2,637', '2,044', 'na', 'na', ''] },
];

const TABLE_ROWS = RAW_ROWS.map((row) => ({
  ...row,
  byYear: Object.fromEntries(BASE_YEARS.map((year, index) => [year, row.values[index] ?? '-'])),
  note: row.values[BASE_YEARS.length] ?? '',
}));

export function YearlyDeliveryForecastPage() {
  const { pathname } = useLocation();
  const [startYear, setStartYear] = useState(2026);
  const [savedAt, setSavedAt] = useState('');
  const [summary, setSummary] = useState(
    '연도별 납품예정 추이 요약\n- 2026년 이후 납품예정액은 단계적으로 감소 흐름\n- SW/수전금구/비데 항목별 목표 대비 리스크를 별도 관리 권장'
  );
  const displayYears = useMemo(() => Array.from({ length: 5 }, (_, idx) => startYear + idx), [startYear]);
  const savedAtLabel = useMemo(
    () => (savedAt ? new Date(savedAt).toLocaleString('ko-KR', { hour12: false }) : ''),
    [savedAt]
  );

  useEffect(() => {
    const saved = localStorage.getItem(YEARLY_DELIVERY_SUMMARY_STORAGE_KEY);
    if (saved) {
      setSummary(saved);
    }
  }, []);

  const handleSaveSummary = () => {
    localStorage.setItem(YEARLY_DELIVERY_SUMMARY_STORAGE_KEY, summary);
    setSavedAt(new Date().toISOString());
  };

  return (
    <PageShell
      path={pathname}
      title="연도별 납품예정 현황"
      description="연도별 수주실적 기반 납품예정 현황을 조회하고 표 하단에서 요약 메모를 관리합니다."
      className={styles.shellWide}
    >
      <div className={styles.page}>
        <div className={styles.filterBar}>
          <label className={styles.filterItem}>
            <span>시작년도</span>
            <select value={startYear} onChange={(e) => setStartYear(Number(e.target.value))}>
              {START_YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.tableTitleRow}>
            <strong>4. 수주실적 연도별 납품예정 현황</strong>
            <span className={styles.unit}>단위 : 백만원</span>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.groupCol}>구분(납품년도)</th>
                {displayYears.map((year) => (
                  <th key={year}>{year}년</th>
                ))}
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, idx) => {
                const rowClass =
                  row.type === 'section' ? styles.sectionRow : row.type === 'sub' ? styles.subRow : styles.mainRow;
                return (
                  <tr key={`${row.label}-${idx}`} className={rowClass}>
                    <td className={styles.groupCol}>
                      <span className={row.type === 'sub' ? styles.subLabel : ''}>{row.group || row.label}</span>
                    </td>
                    {displayYears.map((year) => (
                      <td key={`${row.label}-${year}`}>{row.byYear[year] ?? '-'}</td>
                    ))}
                    <td>{row.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.notes}>
          <div>※ 2026년 2월 마감기준</div>
          <div>※ 자료 출처 : ERP SPEC현황 기준(2017. 1. 1 ~ 2026. 2. 28까지)</div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryHead}>표 요약</div>
          <textarea
            className={styles.summaryInput}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="표에 대한 요약을 입력하세요."
          />
          <div className={styles.summaryActions}>
            <button type="button" className={styles.saveButton} onClick={handleSaveSummary}>
              저장
            </button>
            {savedAtLabel ? <span className={styles.savedText}>저장됨: {savedAtLabel}</span> : null}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default YearlyDeliveryForecastPage;
