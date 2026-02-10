import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../shared/components/Button/Button';
import { classnames } from '../../../shared/utils/classnames';
import styles from './SpecStatusPage.module.css';

const FAVORITES_EVENT = 'favorites-updated';
const FAVORITE_PATH = '/sales/spec-status';
const FAVORITE_LABEL = 'SPEC-현황';

// 34개 컬럼 정의 (순서 고정)
const COLUMNS = [
  '부서',
  '영업담당',
  '건설회사',
  '수주유형',
  '품목별 수주유형',
  '사업분류',
  '지역',
  '현장명',
  '대리점',
  '적용세대수',
  '납기예정',
  '수주일자',
  'SET품번',
  '품목그룹',
  '품목',
  '수량',
  '건설사납품단가',
  '대리점납품단가',
  '차이금액',
  '금액',
  '중량(KG)',
  '총무게(KG)',
  '총무게(TON)',
  '톤당 단가',
  '비고',
  '수정일',
  '스펙구분',
  '납품구분',
  '진행사항',
  '스펙번호',
  '할인',
  '표준원가/매입단가',
  '총원가',
  '총세대수',
];

// Mock 데이터 (34컬럼 모두 포함)
const MOCK_ROWS = [
  {
    id: '1',
    부서: '영업1부',
    영업담당: '김영업',
    건설회사: 'A건설',
    수주유형: '정식수주',
    '품목별 수주유형': '정식수주',
    사업분류: '주택',
    지역: '서울',
    현장명: '강남 아파트 신축',
    대리점: '대리점A',
    적용세대수: 480,
    납기예정: '2025-06-30',
    수주일자: '2025-01-10',
    SET품번: 'SET-01',
    품목그룹: 'SET',
    품목: 'SET 제품 A',
    수량: 120,
    건설사납품단가: 150000,
    대리점납품단가: 135000,
    차이금액: 150000 * 120 - 135000 * 120,
    금액: 135000 * 120,
    '중량(KG)': 12500,
    '총무게(KG)': 12500,
    '총무게(TON)': 12.5,
    '톤당 단가': 10800,
    비고: '',
    수정일: '2025-01-15',
    스펙구분: '신규',
    납품구분: '정규출고',
    진행사항: '진행중',
    스펙번호: 'SW-SPEC-2025-001',
    할인: 18.2,
    '표준원가/매입단가': 82000,
    총원가: 82000 * 120,
    총세대수: 500,
    공장: '공장A',
  },
  {
    id: '2',
    부서: '영업1부',
    영업담당: '이팀장',
    건설회사: 'B건설',
    수주유형: '예약수주',
    '품목별 수주유형': '예약수주',
    사업분류: '오피스',
    지역: '경기',
    현장명: '수원 오피스텔',
    대리점: '대리점B',
    적용세대수: 200,
    납기예정: '2025-05-15',
    수주일자: '2025-01-08',
    SET품번: 'SET-02',
    품목그룹: 'SET',
    품목: 'SET 제품 B',
    수량: 80,
    건설사납품단가: 140000,
    대리점납품단가: 125000,
    차이금액: 140000 * 80 - 125000 * 80,
    금액: 125000 * 80,
    '중량(KG)': 8300,
    '총무게(KG)': 8300,
    '총무게(TON)': 8.3,
    '톤당 단가': 15060,
    비고: '긴급출고',
    수정일: '2025-01-12',
    스펙구분: '신규',
    납품구분: '긴급출고',
    진행사항: '작성중',
    스펙번호: 'SW-SPEC-2025-002',
    할인: 24.5,
    '표준원가/매입단가': 89000,
    총원가: 89000 * 80,
    총세대수: 220,
    공장: '공장B',
  },
  {
    id: '3',
    부서: '영업2부',
    영업담당: '김영업',
    건설회사: 'D건설',
    수주유형: '정식수주',
    '품목별 수주유형': '정식수주',
    사업분류: '주택',
    지역: '부산',
    현장명: '해운대 단지',
    대리점: '대리점D',
    적용세대수: 300,
    납기예정: '2025-05-20',
    수주일자: '2025-01-05',
    SET품번: '단품-X',
    품목그룹: '단품',
    품목: '부품 X',
    수량: 200,
    건설사납품단가: 32000,
    대리점납품단가: 28000,
    차이금액: 32000 * 200 - 28000 * 200,
    금액: 28000 * 200,
    '중량(KG)': 5100,
    '총무게(KG)': 5100,
    '총무게(TON)': 5.1,
    '톤당 단가': 5500,
    비고: '',
    수정일: '2025-01-09',
    스펙구분: '신규',
    납품구분: '정규출고',
    진행사항: '결재완료',
    스펙번호: 'SW-SPEC-2025-003',
    할인: 12.0,
    '표준원가/매입단가': 16000,
    총원가: 16000 * 200,
    총세대수: 320,
    공장: '공장A',
  },
];

const STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: '작성중', label: '작성중' },
  { value: '결재중', label: '결재중' },
  { value: '결재완료', label: '결재완료' },
  { value: '반려', label: '반려' },
  { value: '진행중', label: '진행중' },
];

function formatNum(n) {
  if (n == null || n === '') return '—';
  return Number(n).toLocaleString();
}

export function SpecStatusDiscountPage() {
  const { user } = useAuth();
  const defaultSalesOwner = user?.name || '';
  const userKey = user?.id ? String(user.id) : 'guest';

  const [activeTab, setActiveTab] = useState('detail'); // detail | summary
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [filters, setFilters] = useState({
    dateType: 'order', // order | due
    dateFrom: '',
    dateTo: '',
    status: '',
    salesOwner: defaultSalesOwner,
    search: '',
    factory: '',
    itemType: '', // '' | group | single
  });

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const loadFavorite = useCallback(() => {
    try {
      const raw = localStorage.getItem(`favorites_${userKey}`);
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) {
        setIsFavorite(list.some((f) => f.path === FAVORITE_PATH));
      } else {
        setIsFavorite(false);
      }
    } catch (e) {
      setIsFavorite(false);
    }
  }, [userKey]);

  useEffect(() => {
    loadFavorite();
  }, [loadFavorite]);

  const toggleFavorite = useCallback(() => {
    try {
      const raw = localStorage.getItem(`favorites_${userKey}`);
      const list = raw ? JSON.parse(raw) : [];
      const arr = Array.isArray(list) ? list : [];
      const exists = arr.some((f) => f.path === FAVORITE_PATH);
      const next = exists ? arr.filter((f) => f.path !== FAVORITE_PATH) : [...arr, { path: FAVORITE_PATH, label: FAVORITE_LABEL }];
      localStorage.setItem(`favorites_${userKey}`, JSON.stringify(next));
      setIsFavorite(!exists);
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: { userId: userKey } }));
    } catch (e) {
      // noop
    }
  }, [userKey, setIsFavorite]);

  const filteredRows = useMemo(() => {
    return MOCK_ROWS.filter((row) => {
      if (filters.status && row.진행사항 !== filters.status) return false;
      if (filters.salesOwner && row.영업담당 !== filters.salesOwner) return false;
      const dateKey = filters.dateType === 'due' ? '납기예정' : '수주일자';
      if (filters.dateFrom && row[dateKey] < filters.dateFrom) return false;
      if (filters.dateTo && row[dateKey] > filters.dateTo) return false;
      if (filters.factory && row.공장 !== filters.factory) return false;
      if (filters.itemType === 'group' && row.품목그룹 !== 'SET') return false;
      if (filters.itemType === 'single' && row.품목그룹 === 'SET') return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hit =
          row.건설회사.toLowerCase().includes(q) ||
          row.현장명.toLowerCase().includes(q) ||
          row.대리점.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [filters]);

  const summaryCards = useMemo(() => {
    const totalQty = filteredRows.reduce((s, r) => s + (r.수량 || 0), 0);
    const totalAmount = filteredRows.reduce((s, r) => s + (r.금액 || 0), 0);
    const totalWeightTon = filteredRows.reduce((s, r) => s + (r['총무게(TON)'] || 0), 0);
    const avgDiscount =
      filteredRows.length > 0
        ? filteredRows.reduce((s, r) => s + (r.할인 || 0), 0) / filteredRows.length
        : 0;
    return { totalQty, totalAmount, totalWeightTon, avgDiscount };
  }, [filteredRows]);

  // SUMMARY 테이블용 집계 (현장별)
  const summaryRows = useMemo(() => {
    const grouped = filteredRows.reduce((acc, row) => {
      const key = row.현장명;
      if (!acc[key]) {
        acc[key] = {
          스펙구분: row.스펙구분,
          스펙번호: row.스펙번호,
          수주일자: row.수주일자,
          영업그룹: row.부서,
          현장명: row.현장명,
          대리점명: row.대리점,
          건설사명: row.건설회사,
          SPEC납품예정일: row.납기예정,
          ERP금액: 0,
          DECO금액: 0,
          차이금액: 0,
        };
      }
      acc[key].ERP금액 += row.금액 || 0;
      acc[key].DECO금액 += row.총원가 || 0;
      acc[key].차이금액 = acc[key].ERP금액 - acc[key].DECO금액;
      return acc;
    }, {});

    const rows = Object.values(grouped);

    const totals = rows.reduce(
      (acc, r) => {
        acc.ERP금액 += r.ERP금액;
        acc.DECO금액 += r.DECO금액;
        acc.차이금액 += r.차이금액;
        return acc;
      },
      { ERP금액: 0, DECO금액: 0, 차이금액: 0 },
    );

    // 첫 행을 합계 고정
    return [
      {
        __total: true,
        스펙구분: '합계',
        스펙번호: '-',
        수주일자: '-',
        영업그룹: '-',
        현장명: '-',
        대리점명: '-',
        건설사명: '-',
        SPEC납품예정일: '-',
        ERP금액: totals.ERP금액,
        DECO금액: totals.DECO금액,
        차이금액: totals.차이금액,
      },
      ...rows,
    ];
  }, [filteredRows]);

  return (
    <PageShell
      path="/sales/spec-status"
      title="SPEC-현황"
      description="할인율 포함 상세 및 SUMMARY 탭으로 확인할 수 있습니다."
      actions={
        <Button variant="secondary" onClick={() => {}}>
          엑셀 다운로드
        </Button>
      }
    >
      <div className={styles.page}>
        {/* 탭 */}
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'detail'}
            className={activeTab === 'detail' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('detail')}
          >
            SPEC-현황(할인율포함)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'summary'}
            className={activeTab === 'summary' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('summary')}
          >
            SPEC-현황(SUMMARY)
          </button>
        </div>

        {/* 필터 영역 */}
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <div className={styles.filterItem}>
              <label>날짜구분</label>
              <select value={filters.dateType} onChange={(e) => handleFilterChange('dateType', e.target.value)}>
                <option value="order">수주일자</option>
                <option value="due">납기예정일</option>
              </select>
            </div>
            <div className={styles.filterItem}>
              <label>{filters.dateType === 'due' ? '납기예정일' : '수주일자'}</label>
              <div className={styles.rangeInputs}>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
                <span>~</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>
            <div className={styles.filterItem}>
              <label>진행사항</label>
              <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value || 'all'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterItem}>
              <label>품목구분</label>
              <select value={filters.itemType} onChange={(e) => handleFilterChange('itemType', e.target.value)}>
                <option value="">전체</option>
                <option value="group">그룹</option>
                <option value="single">단품</option>
              </select>
            </div>
            <div className={styles.filterItemWide}>
              <label>통합검색 (건설사/현장/대리점)</label>
              <input
                type="text"
                placeholder="건설사, 현장명, 대리점 검색"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className={styles.filterActions}>
              <Button variant="secondary" onClick={() => setShowAdvanced((p) => !p)}>
                {showAdvanced ? '상세 필터 닫기' : '상세 필터'}
              </Button>
            </div>
          </div>

          {showAdvanced && (
            <div className={styles.advancedFilters}>
              <div className={styles.filterItem}>
                <label>영업담당자</label>
                <input
                  type="text"
                  value={filters.salesOwner}
                  onChange={(e) => handleFilterChange('salesOwner', e.target.value)}
                  placeholder="영업담당자"
                />
              </div>
              <div className={styles.filterItem}>
                <label>공장</label>
                <select value={filters.factory} onChange={(e) => handleFilterChange('factory', e.target.value)}>
                  <option value="">전체</option>
                  <option value="공장A">공장A</option>
                  <option value="공장B">공장B</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {activeTab === 'detail' && (
          <div className={styles.tableWrap}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.stickyLeft} colSpan={3}>기본정보</th>
                    <th colSpan={7}>품목/수주 정보</th>
                    <th colSpan={8}>금액/원가/중량</th>
                    <th colSpan={4}>기타</th>
                  </tr>
                  <tr>
                    <th className={styles.stickyLeft}>현장명</th>
                    <th className={styles.stickyLeft}>스펙번호</th>
                    <th className={styles.stickyLeft}>진행사항</th>
                    <th>부서</th>
                    <th>영업담당</th>
                    <th>건설회사</th>
                    <th>대리점</th>
                    <th>수주유형</th>
                    <th>품목별 수주유형</th>
                    <th>사업분류</th>
                    <th>지역</th>
                    <th>품목</th>
                    <th>SET품번</th>
                    <th>품목그룹</th>
                    <th className={styles.num}>수량</th>
                    <th className={styles.num}>건설사납품단가</th>
                    <th className={styles.num}>대리점납품단가</th>
                    <th className={styles.num}>차이금액</th>
                    <th className={styles.num}>금액</th>
                    <th className={styles.num}>중량(KG)</th>
                    <th className={styles.num}>총무게(KG)</th>
                    <th className={styles.num}>총무게(TON)</th>
                    <th className={styles.num}>톤당 단가</th>
                    <th className={styles.num}>표준원가/매입단가</th>
                    <th className={styles.num}>총원가</th>
                    <th className={styles.num}>총세대수</th>
                    <th>비고</th>
                    <th>스펙구분</th>
                    <th>납품구분</th>
                    <th className={styles.num}>적용세대수</th>
                    <th>납기예정</th>
                    <th>수주일자</th>
                    <th>수정일</th>
                    <th className={styles.num}>할인</th>
                    <th>출하형태</th>
                    <th>운송방법</th>
                    <th>대리점</th>
                    <th>공장</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td className={styles.emptyCell} colSpan={COLUMNS.length}>
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => (
                      <tr key={row.id}>
                        <td className={styles.stickyLeft}>{row.현장명}</td>
                        <td className={styles.stickyLeft}>{row.스펙번호}</td>
                        <td className={styles.stickyLeft}>{row.진행사항}</td>
                        <td>{row.부서}</td>
                        <td>{row.영업담당}</td>
                        <td>{row.건설회사}</td>
                        <td>{row.대리점}</td>
                        <td>{row.수주유형}</td>
                        <td>{row['품목별 수주유형']}</td>
                        <td>{row.사업분류}</td>
                        <td>{row.지역}</td>
                        <td>{row.품목}</td>
                        <td>{row.SET품번}</td>
                        <td>{row.품목그룹}</td>
                        <td className={styles.num}>{formatNum(row.수량)}</td>
                        <td className={styles.num}>{formatNum(row.건설사납품단가)}</td>
                        <td className={styles.num}>{formatNum(row.대리점납품단가)}</td>
                        <td className={styles.num}>{formatNum(row.차이금액)}</td>
                        <td className={styles.num}>{formatNum(row.금액)}</td>
                        <td className={styles.num}>{formatNum(row['중량(KG)'])}</td>
                        <td className={styles.num}>{formatNum(row['총무게(KG)'])}</td>
                        <td className={styles.num}>{formatNum(row['총무게(TON)'])}</td>
                        <td className={styles.num}>{formatNum(row['톤당 단가'])}</td>
                        <td className={styles.num}>{formatNum(row['표준원가/매입단가'])}</td>
                        <td className={styles.num}>{formatNum(row.총원가)}</td>
                        <td className={styles.num}>{formatNum(row.총세대수)}</td>
                        <td>{row.비고 || '—'}</td>
                        <td>{row.스펙구분}</td>
                        <td>{row.납품구분}</td>
                        <td className={styles.num}>{formatNum(row.적용세대수)}</td>
                        <td>{row.납기예정}</td>
                        <td>{row.수주일자}</td>
                        <td>{row.수정일}</td>
                        <td
                          className={styles.num}
                          style={row.할인 >= 20 ? { color: '#dc2626', fontWeight: 600 } : undefined}
                        >
                          {row.할인 != null ? `${row.할인.toFixed(1)}%` : '—'}
                        </td>
                        <td>{row.납품구분}</td>
                        <td>{row.운송방법 || row.운송방법}</td>
                        <td>{row.대리점}</td>
                        <td>{row.공장 || row.factory || '공장A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className={styles.summarySection}>
            <div className={styles.cards}>
              <div className={styles.card}>
                <div className={styles.cardLabel}>수량 합계</div>
                <div className={styles.cardValue}>{formatNum(summaryCards.totalQty)}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>총 금액 합계</div>
                <div className={styles.cardValue}>{formatNum(summaryCards.totalAmount)}</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>평균 할인율</div>
                <div className={styles.cardValue}>{summaryCards.avgDiscount.toFixed(1)}%</div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardLabel}>전체 물량(TON)</div>
                <div className={styles.cardValue}>{formatNum(summaryCards.totalWeightTon)}</div>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>스펙구분</th>
                      <th>스펙번호</th>
                      <th>수주일자</th>
                      <th>영업그룹</th>
                      <th>현장명</th>
                      <th>대리점명</th>
                      <th>건설사명</th>
                      <th>SPEC 납품예정일</th>
                      <th className={classnames(styles.num, styles.emph)}>ERP-금액</th>
                      <th className={classnames(styles.num, styles.emph)}>DECO-금액</th>
                      <th className={classnames(styles.num, styles.emph)}>차이금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryRows.length === 0 ? (
                      <tr>
                        <td className={styles.emptyCell} colSpan={11}>
                          데이터가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      summaryRows.map((row) => (
                        <tr key={(row.__total ? 'total-' : '') + row.스펙번호}>
                          <td>{row.스펙구분}</td>
                          <td>{row.스펙번호}</td>
                          <td>{row.수주일자}</td>
                          <td>{row.영업그룹}</td>
                          <td>{row.현장명}</td>
                          <td>{row.대리점명}</td>
                          <td>{row.건설사명}</td>
                          <td>{row.SPEC납품예정일}</td>
                          <td className={classnames(styles.num, styles.emph)}>{formatNum(row.ERP금액)}</td>
                          <td className={classnames(styles.num, styles.emph)}>{formatNum(row.DECO금액)}</td>
                          <td
                            className={classnames(styles.num, styles.emph)}
                            style={row.차이금액 !== 0 ? { color: '#dc2626', fontWeight: 700 } : undefined}
                          >
                            {formatNum(row.차이금액)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
