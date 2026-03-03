import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Table, ConfigProvider } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [filterValue, setFilterValue] = useState({
    deliveryType: '',
    orderDateFrom: '',
    orderDateTo: '',
    builder: '',
    siteName: '',
    manager: '',
    orderType: '',
    specType: '',
    agency: '',
    status: '',
    item: '',
    itemGroup: '',
    setPartNo: '',
    itemOrderType: '',
    search: '',
  });

  // ListFilter 호환 핸들러
  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      deliveryType: '', orderDateFrom: '', orderDateTo: '',
      builder: '', siteName: '', manager: '',
      orderType: '', specType: '', agency: '',
      status: '', item: '', itemGroup: '',
      setPartNo: '', itemOrderType: '', search: '',
    });
  }, []);

  // ListFilter 필드 — 탭에 따라 분기
  const filterFields = useMemo(() => {
    if (activeTab === 'summary') {
      // SUMMARY 탭: 4개만
      return [
        { id: 'specNo', label: 'SPEC No', type: 'text', placeholder: '스펙번호 검색', wide: true, row: 0 },
        { id: 'orderDate', label: '수주일자', type: 'dateRange', fromKey: 'orderDateFrom', toKey: 'orderDateTo', row: 0 },
        { id: 'siteName', label: '현장명', type: 'text', placeholder: '현장명 검색', wide: true, row: 0 },
        { id: 'manager', label: '영업그룹', type: 'text', placeholder: '영업그룹 검색', wide: true, row: 0 },
      ];
    }
    // DETAIL 탭: 전체 필드
    return [
      // 1행
      {
        id: 'deliveryType', label: '납품구분', type: 'select', width: 120, row: 0,
        options: [{ label: '전체', value: '' }, { label: '건설사납품', value: 'builder' }, { label: '대리점납품', value: 'agency' }]
      },
      { id: 'orderDate', label: '수주일자', type: 'dateRange', fromKey: 'orderDateFrom', toKey: 'orderDateTo', row: 0 },
      {
        id: 'status', label: '진행사항', type: 'select', width: 110, row: 0,
        options: [{ label: '전체', value: '' }, { label: '스펙완료', value: '스펙완료' }, { label: '작성중', value: '작성중' }, { label: '결재완료', value: '결재완료' }, { label: '반려', value: '반려' }, { label: '진행중', value: '진행중' }]
      },
      {
        id: 'specType', label: '스펙구분', type: 'select', width: 110, row: 0,
        options: [{ label: '전체', value: '' }, { label: '위생도기', value: '위생도기' }, { label: '타일', value: '타일' }]
      },
      // 2행
      { id: 'builder', label: '건설회사', type: 'text', placeholder: '건설회사 검색', wide: true, row: 1 },
      { id: 'siteName', label: '현장명', type: 'text', placeholder: '현장명 검색', wide: true, row: 1 },
      { id: 'manager', label: '영업담당자', type: 'text', placeholder: '담당자 검색', wide: true, row: 1 },
      { id: 'agency', label: '대리점', type: 'text', placeholder: '대리점 검색', wide: true, row: 1 },
      // 3행
      {
        id: 'orderType', label: '수주유형', type: 'select', width: 120, row: 2,
        options: [{ label: '전체', value: '' }, { label: '관급영업', value: '관급영업' }, { label: '연간단가', value: '연간단가' }]
      },
      {
        id: 'itemOrderType', label: '품목별 수주유형', type: 'select', width: 130, row: 2,
        options: [{ label: '전체', value: '' }, { label: '관급영업', value: '관급영업' }, { label: '연간단가', value: '연간단가' }]
      },
      {
        id: 'itemGroup', label: '품목그룹', type: 'select', width: 110, row: 2,
        options: [{ label: '전체', value: '' }, { label: '제천S/W', value: '제천S/W' }, { label: '단품', value: '단품' }]
      },
      { id: 'item', label: '품목', type: 'text', placeholder: '품목 검색', wide: true, row: 2 },
      { id: 'setPartNo', label: 'SET품번', type: 'text', placeholder: 'SET품번 검색', wide: true, row: 2 },
    ];
  }, [activeTab]);

  // 기존 코드와 호환을 위한 filters 별칭
  const filters = {
    status: filterValue.status,
    salesOwner: filterValue.manager,
    dateFrom: filterValue.orderDateFrom,
    dateTo: filterValue.orderDateTo,
    dateType: 'order',
    search: filterValue.builder || filterValue.siteName || '',
    factory: '',
    itemType: filterValue.itemGroup === '제천S/W' ? 'group' : filterValue.itemGroup === '단품' ? 'single' : '',
  };

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
        <Button variant="secondary" onClick={() => { }}>
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

        {/* 공통 ListFilter */}
        <ListFilter
          fields={filterFields}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={() => { /* 조회 */ }}
          searchLabel="조회"
        />

        {activeTab === 'detail' && (
          <div style={{ marginTop: '12px' }}>
            <div className={styles.tableContainer}>
              <ConfigProvider
                theme={{ components: { Table: { headerBg: '#4f81bd', headerColor: '#fff' } } }}
              >

                <Table
                  columns={[
                    { title: '부서', dataIndex: 'dept', width: 100, align: 'center', fixed: 'left' },
                    { title: '영업담당', dataIndex: 'manager', width: 90, align: 'center', fixed: 'left' },
                    { title: '건설회사', dataIndex: 'builder', width: 150, ellipsis: true, fixed: 'left' },
                    { title: '현장명', dataIndex: 'siteName', width: 350, ellipsis: true, fixed: 'left' },
                    { title: '수주유형', dataIndex: 'orderType', width: 100, align: 'center' },
                    { title: '품목별 수주유형', dataIndex: 'itemOrderType', width: 120, align: 'center' },
                    { title: '사업분류', dataIndex: 'bizClass', width: 80, align: 'center' },
                    { title: '지역', dataIndex: 'region', width: 80, align: 'center' },
                    { title: '대리점', dataIndex: 'agency', width: 180, ellipsis: true },
                    { title: '적용세대수', dataIndex: 'households', width: 100, align: 'right', render: formatNum },
                    { title: '납기예정', dataIndex: 'dueDate', width: 100, align: 'center' },
                    { title: '수주일자', dataIndex: 'orderDate', width: 100, align: 'center' },
                    { title: 'SET품번', dataIndex: 'setPartNo', width: 120 },
                    { title: '품목그룹', dataIndex: 'itemGroup', width: 100 },
                    { title: '품목', dataIndex: 'item', width: 150 },
                    { title: '수량', dataIndex: 'qty', width: 90, align: 'right', render: formatNum },
                    { title: '건설사납품단가', dataIndex: 'builderPrice', width: 130, align: 'right', render: formatNum },
                    { title: '대리점납품단가', dataIndex: 'agencyPrice', width: 130, align: 'right', render: formatNum },
                    { title: '차이금액', dataIndex: 'diffAmount', width: 110, align: 'right', render: formatNum },
                    { title: '금액', dataIndex: 'totalAmount', width: 140, align: 'right', render: formatNum, onCell: () => ({ style: { fontWeight: 500, backgroundColor: '#f0fdff' } }) },
                    { title: '중량(KG)', dataIndex: 'weightKg', width: 90, align: 'right', render: formatNum },
                    { title: '총무게(KG)', dataIndex: 'totalWeightKg', width: 110, align: 'right', render: formatNum },
                    { title: '총무게(TON)', dataIndex: 'totalWeightTon', width: 110, align: 'right', render: formatNum },
                    { title: '톤당 단가', dataIndex: 'pricePerTon', width: 110, align: 'right', render: formatNum },
                    { title: '비고', dataIndex: 'remarks', width: 300, ellipsis: true },
                    { title: '수정일', dataIndex: 'modifyDate', width: 100, align: 'center' },
                    { title: '스펙구분', dataIndex: 'specType', width: 90, align: 'center' },
                    { title: '납품구분', dataIndex: 'deliveryType', width: 100, align: 'center' },
                    { title: '진행사항', dataIndex: 'progress', width: 90, align: 'center' },
                    { title: '스펙번호', dataIndex: 'specNo', width: 150, align: 'center' },
                    {
                      title: '할인(%)', dataIndex: 'discount', width: 80, align: 'right',
                      render: (val) => (
                        <span style={{ color: String(val).includes('-') ? '#cf1322' : '#096dd9', fontWeight: 600 }}>
                          {val}
                        </span>
                      ),
                    },
                    { title: '표준원가/매입단가', dataIndex: 'stdCost', width: 150, align: 'right', render: formatNum },
                    { title: '총원가', dataIndex: 'totalCost', width: 120, align: 'right', render: formatNum },
                    { title: '총 세대수', dataIndex: 'totalHouseholds', width: 100, align: 'right', render: formatNum },
                  ]}
                  dataSource={[
                    {
                      key: '1', dept: '프로젝트1팀', manager: '윤영재', builder: '한국토지주택공사',
                      siteName: 'LH 충남도청 신도시 RH-12BL 5공구 현장 (시공사 : 디엘건설)', orderType: '관급영업', itemOrderType: '관급영업', bizClass: '임대', region: '충남', agency: '대림바스(주) 서울사무소',
                      households: 1706, dueDate: '2028-04', orderDate: '2026-02-01', setPartNo: 'CL-463D', itemGroup: '제천S/W', item: 'JLA463DZWHW', qty: 3420, builderPrice: 86998, agencyPrice: 86998, diffAmount: 0, totalAmount: 297532280, weightKg: 15, totalWeightKg: 50274, totalWeightTon: 50, pricePerTon: 5918000, remarks: '비누대 포함 / 일반사양(별도폽업 X)', modifyDate: '2026-02-26', specType: '위생도기', deliveryType: '건설사납품', progress: '스펙완료', specNo: 'SC202602260008', discount: '-6.1%', stdCost: 0, totalCost: 0, totalHouseholds: 1706,
                    },
                    {
                      key: '2', dept: '프로젝트1팀', manager: '박기진', builder: '중흥건설',
                      siteName: '중흥건설 부산 에코델타시티 공동 4블럭 중흥S클래스(자체사업, APT)', orderType: '연간단가', itemOrderType: '연간단가', bizClass: '분양', region: '부산', agency: '신우세라믹(주)',
                      households: 728, dueDate: '2027-09', orderDate: '2026-02-27', setPartNo: 'CC-267', itemGroup: '제천S/W', item: 'JCS267ZZWHW', qty: 582, builderPrice: 213388, agencyPrice: 192049, diffAmount: 21339, totalAmount: 111772564, weightKg: 35, totalWeightKg: 20137, totalWeightTon: 20, pricePerTon: 5551000, remarks: '앵글밸브 제외/부속포함', modifyDate: '2026-02-26', specType: '위생도기', deliveryType: '대리점납품', progress: '스펙완료', specNo: 'SC202602260007', discount: '10.7%', stdCost: 0, totalCost: 0, totalHouseholds: 728,
                    },
                  ]}
                  bordered
                  size="small"
                  scroll={{ x: 3500, y: 500 }}
                  pagination={{ pageSize: 50, showSizeChanger: true }}
                  summary={() => (
                    <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                      <Table.Summary.Cell index={0} colSpan={9} align="center">합계</Table.Summary.Cell>
                      <Table.Summary.Cell index={9} align="right">183,129</Table.Summary.Cell>
                      <Table.Summary.Cell index={10} colSpan={5} />
                      <Table.Summary.Cell index={15} align="right">146,485</Table.Summary.Cell>
                      <Table.Summary.Cell index={16} />
                      <Table.Summary.Cell index={17} />
                      <Table.Summary.Cell index={18} align="right">1,746,028</Table.Summary.Cell>
                      <Table.Summary.Cell index={19} align="right" style={{ color: '#1890ff' }}>5,465,124,449</Table.Summary.Cell>
                      <Table.Summary.Cell index={20} colSpan={14} />
                    </Table.Summary.Row>
                  )}
                />
              </ConfigProvider>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className={styles.summarySection}>
            {/* KPI 카드 */}
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

            {/* SUMMARY 테이블 — detail 탭과 동일한 스타일 */}
            <div className={styles.tableContainer}>
              <ConfigProvider
                theme={{ components: { Table: { headerBg: '#4f81bd', headerColor: '#fff' } } }}
              >
                <Table
                  columns={[
                    { title: '스펙구분', dataIndex: '스펙구분', width: 90, align: 'center' },
                    { title: '스펙번호', dataIndex: '스펙번호', width: 160, align: 'center' },
                    { title: '수주일자', dataIndex: '수주일자', width: 100, align: 'center' },
                    { title: '영업그룹', dataIndex: '영업그룹', width: 100, align: 'center' },
                    { title: '현장명', dataIndex: '현장명', width: 280, ellipsis: true },
                    { title: '대리점명', dataIndex: '대리점명', width: 180, ellipsis: true },
                    { title: '건설사명', dataIndex: '건설사명', width: 180, ellipsis: true },
                    { title: 'SPEC 납품예정일', dataIndex: 'SPEC납품예정일', width: 120, align: 'center' },
                    {
                      title: 'ERP-금액', dataIndex: 'ERP금액', width: 140, align: 'right',
                      render: formatNum,
                      onCell: () => ({ style: { fontWeight: 600, color: '#1d4ed8' } }),
                    },
                    {
                      title: 'DECO-금액', dataIndex: 'DECO금액', width: 140, align: 'right',
                      render: formatNum,
                      onCell: () => ({ style: { fontWeight: 600, color: '#1d4ed8' } }),
                    },
                    {
                      title: '차이금액', dataIndex: '차이금액', width: 130, align: 'right',
                      render: (val) => (
                        <span style={{ color: val !== 0 ? '#dc2626' : undefined, fontWeight: val !== 0 ? 700 : undefined }}>
                          {formatNum(val)}
                        </span>
                      ),
                    },
                  ]}
                  dataSource={summaryRows.filter((r) => !r.__total).map((r) => ({ ...r, key: r.스펙번호 }))}
                  bordered
                  size="small"
                  pagination={{ pageSize: 20, showSizeChanger: true }}
                  scroll={{ x: 'max-content', y: 500 }}
                  summary={() => {
                    const totalRow = summaryRows.find((r) => r.__total);
                    if (!totalRow) return null;
                    return (
                      <Table.Summary.Row style={{ backgroundColor: '#e8f0fe', fontWeight: 'bold' }}>
                        <Table.Summary.Cell index={0} colSpan={8} align="center">합 계</Table.Summary.Cell>
                        <Table.Summary.Cell index={8} align="right" style={{ color: '#1d4ed8' }}>
                          {formatNum(totalRow.ERP금액)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={9} align="right" style={{ color: '#1d4ed8' }}>
                          {formatNum(totalRow.DECO금액)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell
                          index={10}
                          align="right"
                          style={{ color: totalRow.차이금액 !== 0 ? '#dc2626' : undefined }}
                        >
                          {formatNum(totalRow.차이금액)}
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </ConfigProvider>
            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
}
