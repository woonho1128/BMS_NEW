import React, { useMemo, useState, useCallback } from 'react';
import { Table, ConfigProvider } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { Button } from '../../../shared/components/Button/Button';
import styles from './SpecStatusPage.module.css';

function formatNum(n) {
  if (n == null || n === '') return '-';
  return Number(n).toLocaleString();
}

const DETAIL_COLUMNS = [
  { title: '부서', dataIndex: 'dept', width: 100, align: 'center', fixed: 'left' },
  { title: '영업담당', dataIndex: 'manager', width: 90, align: 'center', fixed: 'left' },
  { title: '건설회사', dataIndex: 'builder', width: 150, ellipsis: true, fixed: 'left' },
  { title: '수주유형', dataIndex: 'orderType', width: 100, align: 'center' },
  { title: '품목별 수주유형', dataIndex: 'itemOrderType', width: 130, align: 'center' },
  { title: '사업분류', dataIndex: 'bizClass', width: 90, align: 'center' },
  { title: '지역', dataIndex: 'region', width: 90, align: 'center' },
  { title: '현장명', dataIndex: 'siteName', width: 280, ellipsis: true },
  { title: '대리점', dataIndex: 'agency', width: 160, ellipsis: true },
  { title: '적용세대수', dataIndex: 'households', width: 110, align: 'right', render: formatNum },
  { title: '납기예정', dataIndex: 'dueDate', width: 110, align: 'center' },
  { title: '수주일자', dataIndex: 'orderDate', width: 110, align: 'center' },
  { title: 'SET번호', dataIndex: 'setPartNo', width: 120 },
  { title: '품목그룹', dataIndex: 'itemGroup', width: 100 },
  { title: '품목', dataIndex: 'item', width: 150 },
  { title: '수량', dataIndex: 'qty', width: 90, align: 'right', render: formatNum },
  { title: '건설사납품단가', dataIndex: 'builderPrice', width: 130, align: 'right', render: formatNum },
  { title: '대리점납품단가', dataIndex: 'agencyPrice', width: 130, align: 'right', render: formatNum },
  { title: '차이금액', dataIndex: 'diffAmount', width: 110, align: 'right', render: formatNum },
  { title: '금액', dataIndex: 'totalAmount', width: 130, align: 'right', render: formatNum },
  { title: '중량(KG)', dataIndex: 'weightKg', width: 100, align: 'right', render: formatNum },
  { title: '총무게(KG)', dataIndex: 'totalWeightKg', width: 120, align: 'right', render: formatNum },
  { title: '총무게(TON)', dataIndex: 'totalWeightTon', width: 120, align: 'right', render: formatNum },
  { title: '톤당 단가', dataIndex: 'pricePerTon', width: 110, align: 'right', render: formatNum },
  { title: '비고', dataIndex: 'remarks', width: 220, ellipsis: true },
  { title: '수정일', dataIndex: 'modifyDate', width: 100, align: 'center' },
  { title: '스펙구분', dataIndex: 'specType', width: 100, align: 'center' },
  { title: '납품구분', dataIndex: 'deliveryType', width: 100, align: 'center' },
  { title: '진행사항', dataIndex: 'progress', width: 100, align: 'center' },
  { title: '스펙번호', dataIndex: 'specNo', width: 140, align: 'center' },
  { title: '할인(%)', dataIndex: 'discount', width: 90, align: 'right' },
  { title: '세대원가/매입단가', dataIndex: 'stdCost', width: 140, align: 'right', render: formatNum },
  { title: '총원가', dataIndex: 'totalCost', width: 110, align: 'right', render: formatNum },
  { title: '총세대수', dataIndex: 'totalHouseholds', width: 110, align: 'right', render: formatNum },
];

const DETAIL_ROWS = [
  {
    key: '1', dept: '프로젝트1팀', manager: '김영업', builder: '한국주택공사', orderType: '관급영업', itemOrderType: '관급영업',
    bizClass: '공공', region: '서울', siteName: '서울 RH-12BL 5공구 현장', agency: '대리점A', households: 1706,
    dueDate: '2028-04', orderDate: '2026-02-01', setPartNo: 'CL-463D', itemGroup: '시트S/W', item: 'JLA463DZWHW', qty: 3420,
    builderPrice: 86998, agencyPrice: 86998, diffAmount: 0, totalAmount: 297532280, weightKg: 15, totalWeightKg: 50274,
    totalWeightTon: 50, pricePerTon: 5918000, remarks: '일반사양', modifyDate: '2026-02-26', specType: '인쇄지', deliveryType: '건설사납품',
    progress: '스펙완료', specNo: 'SC202602260008', discount: '-6.1%', stdCost: 82000, totalCost: 280440000, totalHouseholds: 1706,
  },
  {
    key: '2', dept: '프로젝트1팀', manager: '박기진', builder: '중앙건설', orderType: '민간영업', itemOrderType: '민간영업',
    bizClass: '분양', region: '부산', siteName: '부산 에코시티 공동 4블록 현장', agency: '대리점B', households: 728,
    dueDate: '2027-09', orderDate: '2026-02-27', setPartNo: 'CC-267', itemGroup: '시트S/W', item: 'JCS267ZZWHW', qty: 582,
    builderPrice: 213388, agencyPrice: 192049, diffAmount: 21339, totalAmount: 111772564, weightKg: 35, totalWeightKg: 20137,
    totalWeightTon: 20, pricePerTon: 5551000, remarks: '긴급출고', modifyDate: '2026-02-26', specType: '인쇄지', deliveryType: '대리점납품',
    progress: '진행중', specNo: 'SC202602260007', discount: '10.7%', stdCost: 89000, totalCost: 51798000, totalHouseholds: 728,
  },
];

const SUMMARY_COLUMNS = [
  { title: '스펙구분', dataIndex: 'specType', width: 100, align: 'center' },
  { title: '스펙번호', dataIndex: 'specNo', width: 140, align: 'center' },
  { title: '수주일자', dataIndex: 'orderDate', width: 100, align: 'center' },
  { title: '영업그룹', dataIndex: 'dept', width: 110, align: 'center' },
  { title: '현장명', dataIndex: 'siteName', width: 260, ellipsis: true },
  { title: '대리점명', dataIndex: 'agency', width: 160, ellipsis: true },
  { title: '건설사명', dataIndex: 'builder', width: 160, ellipsis: true },
  { title: 'SPEC 납품예정일', dataIndex: 'dueDate', width: 120, align: 'center' },
  { title: 'ERP-금액', dataIndex: 'erpAmount', width: 140, align: 'right', render: formatNum },
  { title: 'DECO-금액', dataIndex: 'decoAmount', width: 140, align: 'right', render: formatNum },
  { title: '차이금액', dataIndex: 'diffAmount', width: 130, align: 'right', render: formatNum },
];

export function SpecStatusDiscountPage() {
  const [activeTab, setActiveTab] = useState('detail');
  const [filterValue, setFilterValue] = useState({
    deliveryType: '', orderDateFrom: '', orderDateTo: '', builder: '', siteName: '', manager: '',
    orderType: '', specType: '', agency: '', status: '', item: '', itemGroup: '', setPartNo: '',
    itemOrderType: '', search: '', specNo: '',
  });

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      deliveryType: '', orderDateFrom: '', orderDateTo: '', builder: '', siteName: '', manager: '',
      orderType: '', specType: '', agency: '', status: '', item: '', itemGroup: '', setPartNo: '',
      itemOrderType: '', search: '', specNo: '',
    });
  }, []);

  const filterFields = useMemo(() => {
    if (activeTab === 'summary') {
      return [
        { id: 'specNo', label: 'SPEC No', type: 'text', placeholder: '스펙번호 검색', wide: true, row: 0 },
        { id: 'orderDate', label: '수주일자', type: 'dateRange', fromKey: 'orderDateFrom', toKey: 'orderDateTo', row: 0 },
        { id: 'siteName', label: '현장명', type: 'text', placeholder: '현장명 검색', wide: true, row: 0 },
        { id: 'manager', label: '영업그룹', type: 'text', placeholder: '영업그룹 검색', wide: true, row: 0 },
      ];
    }
    return [
      {
        id: 'deliveryType', label: '납품구분', type: 'select', width: 120, row: 0,
        options: [{ label: '전체', value: '' }, { label: '건설사납품', value: '건설사납품' }, { label: '대리점납품', value: '대리점납품' }],
      },
      { id: 'orderDate', label: '수주일자', type: 'dateRange', fromKey: 'orderDateFrom', toKey: 'orderDateTo', row: 0 },
      {
        id: 'status', label: '진행사항', type: 'select', width: 110, row: 0,
        options: [{ label: '전체', value: '' }, { label: '스펙완료', value: '스펙완료' }, { label: '작성중', value: '작성중' }, { label: '결재완료', value: '결재완료' }, { label: '반려', value: '반려' }, { label: '진행중', value: '진행중' }],
      },
      {
        id: 'specType', label: '스펙구분', type: 'select', width: 110, row: 0,
        options: [{ label: '전체', value: '' }, { label: '인쇄지', value: '인쇄지' }, { label: '타지', value: '타지' }],
      },
      { id: 'builder', label: '건설회사', type: 'text', placeholder: '건설회사 검색', wide: true, row: 1 },
      { id: 'siteName', label: '현장명', type: 'text', placeholder: '현장명 검색', wide: true, row: 1 },
      { id: 'manager', label: '영업담당', type: 'text', placeholder: '담당자 검색', wide: true, row: 1 },
      { id: 'agency', label: '대리점', type: 'text', placeholder: '대리점 검색', wide: true, row: 1 },
      {
        id: 'orderType', label: '수주유형', type: 'select', width: 120, row: 2,
        options: [{ label: '전체', value: '' }, { label: '관급영업', value: '관급영업' }, { label: '민간영업', value: '민간영업' }],
      },
      {
        id: 'itemOrderType', label: '품목별수주유형', type: 'select', width: 140, row: 2,
        options: [{ label: '전체', value: '' }, { label: '관급영업', value: '관급영업' }, { label: '민간영업', value: '민간영업' }],
      },
      {
        id: 'itemGroup', label: '품목그룹', type: 'select', width: 110, row: 2,
        options: [{ label: '전체', value: '' }, { label: '시트S/W', value: '시트S/W' }, { label: '단품', value: '단품' }],
      },
      { id: 'item', label: '품목', type: 'text', placeholder: '품목 검색', wide: true, row: 2 },
      { id: 'setPartNo', label: 'SET번호', type: 'text', placeholder: 'SET번호 검색', wide: true, row: 2 },
    ];
  }, [activeTab]);

  const filteredRows = useMemo(() => {
    return DETAIL_ROWS.filter((row) => {
      if (filterValue.deliveryType && row.deliveryType !== filterValue.deliveryType) return false;
      if (filterValue.status && row.progress !== filterValue.status) return false;
      if (filterValue.specType && row.specType !== filterValue.specType) return false;
      if (filterValue.orderDateFrom && row.orderDate < filterValue.orderDateFrom) return false;
      if (filterValue.orderDateTo && row.orderDate > filterValue.orderDateTo) return false;
      if (filterValue.builder && !row.builder.toLowerCase().includes(filterValue.builder.toLowerCase())) return false;
      if (filterValue.siteName && !row.siteName.toLowerCase().includes(filterValue.siteName.toLowerCase())) return false;
      if (filterValue.manager && !row.manager.toLowerCase().includes(filterValue.manager.toLowerCase())) return false;
      if (filterValue.agency && !row.agency.toLowerCase().includes(filterValue.agency.toLowerCase())) return false;
      if (filterValue.orderType && row.orderType !== filterValue.orderType) return false;
      if (filterValue.itemOrderType && row.itemOrderType !== filterValue.itemOrderType) return false;
      if (filterValue.itemGroup && row.itemGroup !== filterValue.itemGroup) return false;
      if (filterValue.item && !row.item.toLowerCase().includes(filterValue.item.toLowerCase())) return false;
      if (filterValue.setPartNo && !row.setPartNo.toLowerCase().includes(filterValue.setPartNo.toLowerCase())) return false;
      if (filterValue.search) {
        const q = filterValue.search.toLowerCase();
        if (![row.builder, row.siteName, row.agency].some((v) => String(v).toLowerCase().includes(q))) return false;
      }
      if (filterValue.specNo && !row.specNo.toLowerCase().includes(filterValue.specNo.toLowerCase())) return false;
      return true;
    });
  }, [filterValue]);

  const summaryRows = useMemo(() => {
    return filteredRows.map((row) => ({
      key: row.key,
      specType: row.specType,
      specNo: row.specNo,
      orderDate: row.orderDate,
      dept: row.dept,
      siteName: row.siteName,
      agency: row.agency,
      builder: row.builder,
      dueDate: row.dueDate,
      erpAmount: row.totalAmount,
      decoAmount: row.totalCost,
      diffAmount: row.totalAmount - row.totalCost,
    }));
  }, [filteredRows]);

  const summaryCards = useMemo(() => {
    const totalQty = filteredRows.reduce((s, r) => s + (r.qty || 0), 0);
    const totalAmount = filteredRows.reduce((s, r) => s + (r.totalAmount || 0), 0);
    const totalWeightTon = filteredRows.reduce((s, r) => s + (r.totalWeightTon || 0), 0);
    const avgDiscount = filteredRows.length > 0
      ? filteredRows.reduce((s, r) => s + Number(String(r.discount || '0').replace('%', '')), 0) / filteredRows.length
      : 0;
    return { totalQty, totalAmount, totalWeightTon, avgDiscount };
  }, [filteredRows]);

  return (
    <PageShell
      path="/sales/spec-status"
      title="SPEC-현황"
      description="할인율 포함 상세 및 SUMMARY를 확인합니다."
      className={styles.shellWide}
      actions={<Button variant="secondary">엑셀 다운로드</Button>}
    >
      <div className={styles.page}>
        <div className={styles.tabs} role="tablist">
          <button type="button" role="tab" aria-selected={activeTab === 'detail'} className={activeTab === 'detail' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('detail')}>
            SPEC-현황(할인포함)
          </button>
          <button type="button" role="tab" aria-selected={activeTab === 'summary'} className={activeTab === 'summary' ? styles.tabActive : styles.tab} onClick={() => setActiveTab('summary')}>
            SPEC-현황(SUMMARY)
          </button>
        </div>

        <ListFilter
          fields={filterFields}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        {activeTab === 'detail' && (
          <div className={styles.tableStage}>
            <div className={styles.tableContainer}>
              <ConfigProvider theme={{ components: { Table: { headerBg: '#2f7df6', headerColor: '#fff' } } }}>
                <Table
                  columns={DETAIL_COLUMNS}
                  dataSource={filteredRows}
                  bordered
                  size="small"
                  scroll={{ x: 3500, y: 640 }}
                  pagination={{ pageSize: 50, showSizeChanger: true }}
                />
              </ConfigProvider>
            </div>
          </div>
        )}

        {activeTab === 'summary' && (
          <div className={styles.summarySection}>
            <div className={styles.cards}>
              <div className={styles.card}><div className={styles.cardLabel}>수량 합계</div><div className={styles.cardValue}>{formatNum(summaryCards.totalQty)}</div></div>
              <div className={styles.card}><div className={styles.cardLabel}>총 금액 합계</div><div className={styles.cardValue}>{formatNum(summaryCards.totalAmount)}</div></div>
              <div className={styles.card}><div className={styles.cardLabel}>평균 할인율</div><div className={styles.cardValue}>{summaryCards.avgDiscount.toFixed(1)}%</div></div>
              <div className={styles.card}><div className={styles.cardLabel}>전체 물량(TON)</div><div className={styles.cardValue}>{formatNum(summaryCards.totalWeightTon)}</div></div>
            </div>

            <div className={styles.tableContainer}>
              <ConfigProvider theme={{ components: { Table: { headerBg: '#2f7df6', headerColor: '#fff' } } }}>
                <Table
                  columns={SUMMARY_COLUMNS}
                  dataSource={summaryRows}
                  bordered
                  size="small"
                  pagination={{ pageSize: 20, showSizeChanger: true }}
                  scroll={{ x: 'max-content', y: 620 }}
                />
              </ConfigProvider>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

