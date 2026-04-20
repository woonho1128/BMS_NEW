import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import styles from './ProjectPerformancePage.module.css';

const PROJECT_SUMMARY_STORAGE_KEY = 'analytics:project-performance:summary';

const YEAR_OPTIONS = [2026, 2025, 2024];
const MONTH_OPTIONS = [
  { value: 1, label: '1월' },
  { value: 2, label: '2월' },
  { value: 3, label: '3월' },
  { value: 4, label: '4월' },
  { value: 5, label: '5월' },
  { value: 6, label: '6월' },
  { value: 7, label: '7월' },
  { value: 8, label: '8월' },
  { value: 9, label: '9월' },
  { value: 10, label: '10월' },
  { value: 11, label: '11월' },
  { value: 12, label: '12월' },
];

const PROJECT_ROWS = [
  {
    key: 'order',
    name: '수주액',
    level: 0,
    month: { annualUnitPrice: 1329, preBid: 1447, optionApplied: 2211, executionSales: 97, balanceSales: 1675, mixedSales: 0, actual: 6758, plan: 6586, prevYearMonth: 5738, nextMonthPlan: 7002 },
    cumulative: { annualUnitPrice: 3995, preBid: 2376, optionApplied: 2729, executionSales: 241, balanceSales: 2925, mixedSales: 1225, actual: 13491, plan: 13161, prevYearCumulative: 11720, annualPlan: 76000 },
  },
  {
    key: 'sw',
    name: 'SW',
    level: 0,
    month: { annualUnitPrice: 1033, preBid: 532, optionApplied: 1128, executionSales: 71, balanceSales: 1089, mixedSales: 0, actual: 3853, plan: 4160, prevYearMonth: 3671, nextMonthPlan: 4422 },
    cumulative: { annualUnitPrice: 2712, preBid: 993, optionApplied: 1316, executionSales: 98, balanceSales: 1901, mixedSales: 483, actual: 7503, plan: 8312, prevYearCumulative: 8564, annualPlan: 48000 },
  },
  {
    key: 'sw-local',
    name: 'SW 국산',
    level: 1,
    month: { annualUnitPrice: 821, preBid: 290, optionApplied: 869, executionSales: 21, balanceSales: 983, mixedSales: 0, actual: 2985, plan: 2799, prevYearMonth: 2608, nextMonthPlan: 2976 },
    cumulative: { annualUnitPrice: 1826, preBid: 112, optionApplied: 1017, executionSales: 24, balanceSales: 1470, mixedSales: 383, actual: 4832, plan: 5593, prevYearCumulative: 6362, annualPlan: 32300 },
  },
  {
    key: 'sw-oem',
    name: 'SW OEM',
    level: 1,
    month: { annualUnitPrice: 83, preBid: 137, optionApplied: 0, executionSales: 34, balanceSales: 0, mixedSales: 0, actual: 254, plan: 589, prevYearMonth: 485, nextMonthPlan: 627 },
    cumulative: { annualUnitPrice: 400, preBid: 716, optionApplied: 0, executionSales: 51, balanceSales: 2, mixedSales: 0, actual: 1170, plan: 1178, prevYearCumulative: 882, annualPlan: 6800 },
  },
  {
    key: 'sw-product',
    name: 'SW 상품',
    level: 1,
    month: { annualUnitPrice: 129, preBid: 105, optionApplied: 258, executionSales: 16, balanceSales: 106, mixedSales: 0, actual: 615, plan: 771, prevYearMonth: 578, nextMonthPlan: 820 },
    cumulative: { annualUnitPrice: 486, preBid: 165, optionApplied: 299, executionSales: 22, balanceSales: 429, mixedSales: 100, actual: 1500, plan: 1541, prevYearCumulative: 1320, annualPlan: 8900 },
  },
  {
    key: 'import',
    name: '수전금구',
    level: 0,
    month: { annualUnitPrice: 296, preBid: 693, optionApplied: 296, executionSales: 10, balanceSales: 168, mixedSales: 0, actual: 1463, plan: 1213, prevYearMonth: 869, nextMonthPlan: 1290 },
    cumulative: { annualUnitPrice: 1283, preBid: 1100, optionApplied: 487, executionSales: 128, balanceSales: 396, mixedSales: 6, actual: 3400, plan: 2424, prevYearCumulative: 1531, annualPlan: 14000 },
  },
  {
    key: 'bidet',
    name: '비데',
    level: 0,
    month: { annualUnitPrice: 0, preBid: 222, optionApplied: 787, executionSales: 16, balanceSales: 417, mixedSales: 0, actual: 1442, plan: 1213, prevYearMonth: 1198, nextMonthPlan: 1290 },
    cumulative: { annualUnitPrice: 0, preBid: 283, optionApplied: 926, executionSales: 16, balanceSales: 627, mixedSales: 736, actual: 2588, plan: 2424, prevYearCumulative: 1625, annualPlan: 14000 },
  },
  {
    key: 'bidet-integrated',
    name: '일체형',
    level: 1,
    month: { annualUnitPrice: 0, preBid: 32, optionApplied: 787, executionSales: 16, balanceSales: 0, mixedSales: 0, actual: 834, plan: 1031, prevYearMonth: 1270, nextMonthPlan: 1096 },
    cumulative: { annualUnitPrice: 0, preBid: 92, optionApplied: 926, executionSales: 16, balanceSales: 0, mixedSales: 736, actual: 1771, plan: 2061, prevYearCumulative: 1686, annualPlan: 11900 },
  },
  {
    key: 'bidet-separate',
    name: '분리형',
    level: 1,
    month: { annualUnitPrice: 0, preBid: 191, optionApplied: 0, executionSales: 0, balanceSales: 417, mixedSales: 0, actual: 608, plan: 182, prevYearMonth: -72, nextMonthPlan: 193 },
    cumulative: { annualUnitPrice: 0, preBid: 191, optionApplied: 0, executionSales: 0, balanceSales: 627, mixedSales: 0, actual: 818, plan: 364, prevYearCumulative: -61, annualPlan: 2100 },
  },
];

const formatNumber = (value) => Number(value || 0).toLocaleString('ko-KR');

function calcRate(actual, plan) {
  if (!plan) return 0;
  return Math.round((actual / plan) * 100);
}

function DataTable({ title, year, monthLabel, rows, mode }) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.tableTitleRow}>
        <strong>{title}</strong>
        <span className={styles.unit}>단위 : 백만원</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th rowSpan={2} className={styles.stickyCol}>
              구분
            </th>
            <th colSpan={9} className={styles.groupHead}>
              {mode === 'month' ? `${year}년 ${monthLabel}` : `${year}년 누계`}
            </th>
            <th colSpan={2} className={styles.groupHead}>
              {year}년
            </th>
          </tr>
          <tr>
            <th>연간단가</th>
            <th>사전입찰</th>
            <th>유상옵션</th>
            <th>시행영업</th>
            <th>관급영업</th>
            <th>조합영업</th>
            <th className={styles.emphasis}>실적(계)</th>
            <th>계획</th>
            <th>달성률</th>
            <th>{mode === 'month' ? '전년동월 실적' : '전년동월 누계 실적'}</th>
            <th>{mode === 'month' ? `${monthLabel === '12월' ? '연간' : '익월'} 계획` : '연간 계획'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const src = mode === 'month' ? row.month : row.cumulative;
            const rate = calcRate(src.actual, src.plan);
            return (
              <tr key={`${mode}-${row.key}`} className={row.level === 0 ? styles.mainRow : styles.subRow}>
                <td className={styles.stickyCol}>
                  <span className={row.level === 1 ? styles.subLabel : ''}>{row.name}</span>
                </td>
                <td>{formatNumber(src.annualUnitPrice)}</td>
                <td>{formatNumber(src.preBid)}</td>
                <td>{formatNumber(src.optionApplied)}</td>
                <td>{formatNumber(src.executionSales)}</td>
                <td>{formatNumber(src.balanceSales)}</td>
                <td>{formatNumber(src.mixedSales)}</td>
                <td className={styles.boldCell}>{formatNumber(src.actual)}</td>
                <td>{formatNumber(src.plan)}</td>
                <td>{rate}%</td>
                <td>{formatNumber(src.prevYearMonth ?? src.prevYearCumulative)}</td>
                <td>{formatNumber(src.nextMonthPlan ?? src.annualPlan)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ProjectPerformancePage() {
  const { pathname } = useLocation();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2);
  const [savedAt, setSavedAt] = useState('');
  const [summary, setSummary] = useState(
    `1. ${year}년 ${month}월 수주실적\n1) 총 수주액: 67억(계획대비 103%)\n2) SW 국산: 29억(계획대비 107%)\n3) 수전금구: 14억(계획대비 121%)\n4) 분리형비데: 6억(계획대비 334%)\n\n2. SW 국산은 관급영업 현장 수주와 유상옵션 적용 현장 분양에 따른 성과임\n\n3. 분리형비데는 사전입찰 현장 수주에 따른 성과임`
  );

  useEffect(() => {
    const saved = localStorage.getItem(PROJECT_SUMMARY_STORAGE_KEY);
    if (saved) {
      setSummary(saved);
    }
  }, []);

  const monthLabel = useMemo(() => MONTH_OPTIONS.find((item) => item.value === month)?.label || `${month}월`, [month]);
  const savedAtLabel = useMemo(
    () => (savedAt ? new Date(savedAt).toLocaleString('ko-KR', { hour12: false }) : ''),
    [savedAt]
  );

  const handleSaveSummary = () => {
    localStorage.setItem(PROJECT_SUMMARY_STORAGE_KEY, summary);
    setSavedAt(new Date().toISOString());
  };

  return (
    <PageShell
      path={pathname}
      title="프로젝트 실적 요약"
      description="년도별 월 실적과 누계를 함께 조회하고, 하단/우측 요약 메모를 작성합니다."
      className={styles.shellWide}
    >
      <div className={styles.page}>
        <Card>
          <CardBody>
            <div className={styles.filterBar}>
              <label className={styles.filterItem}>
                <span>년도</span>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {YEAR_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}년
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.filterItem}>
                <span>월</span>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {MONTH_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </CardBody>
        </Card>

        <div className={styles.contentGrid}>
          <div className={styles.tablesCol}>
            <DataTable title={`1. ${year}년 ${monthLabel} 수주액`} year={year} monthLabel={monthLabel} rows={PROJECT_ROWS} mode="month" />
            <DataTable title={`2. ${year}년 누계`} year={year} monthLabel={monthLabel} rows={PROJECT_ROWS} mode="cumulative" />
          </div>

          <Card className={styles.summaryCard}>
            <CardBody>
              <div className={styles.summaryHead}>요약 메모</div>
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
            </CardBody>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default ProjectPerformancePage;
