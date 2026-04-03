import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { formatNumber } from '../../../shared/utils/formatters';
import styles from './SupportReceivablePage.module.css';
const formatNum = (num) => formatNumber(num);

const TAB = {
  RECEIVABLE: 'receivable',
  COLLECTION: 'collection',
  NOTE: 'note',
  OUTSTANDING: 'outstanding',
};

const TABLES = {
  [TAB.COLLECTION]: {
    columns: [
      '거래처',
      '거래처명',
      '대표자명',
      '수금구분',
      '어음구분',
      '수금일자',
      '반제결의번호',
      '수금액',
      '어음번호',
      '어음발행은행',
      '발행인',
      '어음발행일',
      '어음만기일',
      '어음상태',
      '입금은행',
      '입금계좌번호',
    ],
    rows: [
      ['050006', '한사회사 대림타일', '이경호', '통장입금', '-', '2026-03-27', 'UX202603270005', 90588939, '-', '-', '-', '-', '-', '-', '우리은행', '082-037021-13-001'],
      ['050007', '대원타일위생기사사', '김성진', '어음', '자수', '2026-03-11', 'UX202603110022', 40358615, '전자0000278', '신한은행', '코리아아트', '2026-03-11', '2026-04-10', '발생', '우리은행', '082-037021-13-001'],
    ],
  },
  [TAB.NOTE]: {
    columns: ['상태', '어음번호', '차수/단수', '어음금액', '발행일', '만기일', '부서코드', '부서명', '거래처코드', '거래처명', '은행', '발행인', '비고'],
    rows: [
      ['결제', '자가30217984', '타수', 42200000, '2025-10-22', '2026-01-09', '7100', '리테일1팀', '101266', '(주)세양도기', '우리은행', '한일도기사', '-'],
      ['결제', '전자00001442', '타수', 4000000, '2025-12-31', '2026-03-01', '7100', '리테일1팀', '051800', '(주)에스티유중', '신한은행', '풍림상인(주)', '-'],
    ],
  },
};

const OUTSTANDING_ROWS = [
  {
    customerCode: '050016',
    customerName: '디에스대성하우징(주)',
    managerCode: 'G814',
    managerName: '이해규',
    salesOrg: '리테일3팀',
    salesDate: '2026-04-02',
    salesNo: 'BN202604020011',
    salesAmount: 213852980,
    receiptAmount: 157965320,
    outstandingAmount: 55887660,
  },
  {
    customerCode: '050090',
    customerName: '강남타일상사',
    managerCode: 'G814',
    managerName: '이해규',
    salesOrg: '리테일3팀',
    salesDate: '2026-04-08',
    salesNo: 'BN202604080487',
    salesAmount: 11587224,
    receiptAmount: 0,
    outstandingAmount: 11587224,
  },
  {
    customerCode: '050231',
    customerName: '세양위생기기',
    managerCode: 'G814',
    managerName: '이해규',
    salesOrg: '리테일3팀',
    salesDate: '2026-04-15',
    salesNo: 'BN202604150103',
    salesAmount: 48200500,
    receiptAmount: 20100000,
    outstandingAmount: 28100500,
  },
  {
    customerCode: '050006',
    customerName: '한사회사 대리점',
    managerCode: 'G906',
    managerName: '강종근',
    salesOrg: '리테일1팀',
    salesDate: '2026-04-05',
    salesNo: 'BN202604050221',
    salesAmount: 90588939,
    receiptAmount: 70300120,
    outstandingAmount: 20288819,
  },
  {
    customerCode: '050007',
    customerName: '대원타일위생기사사',
    managerCode: 'G906',
    managerName: '강종근',
    salesOrg: '리테일1팀',
    salesDate: '2026-03-27',
    salesNo: 'BN202603270122',
    salesAmount: 40358615,
    receiptAmount: 30000000,
    outstandingAmount: 10358615,
  },
  {
    customerCode: '050078',
    customerName: '형제도기',
    managerCode: 'G747',
    managerName: '미승현-S',
    salesOrg: '리테일2팀',
    salesDate: '2026-04-12',
    salesNo: 'BN202604120077',
    salesAmount: 38104600,
    receiptAmount: 30000000,
    outstandingAmount: 8104600,
  },
];

const RECEIVABLE_SOURCE = [
  {
    bpCd: '050006',
    bpNm: '효자대리점',
    repreNm: '김경호',
    gb: '인테리어부문',
    salesNm: '권순희',
    estAmt: 200000000,
    noteAmt: 109941691,
    ext4Cd: 'Y',
    swPrevAmt: 69719309,
    tiPrevAmt: 704000,
    prevAmt: 70423309,
    swBillAmt: 90058309,
    tiBillAmt: 0,
    billAmt: 90058309,
    swOverdue: 0,
    tiOverdue: 0,
    totOverdue: 0,
  },
];

const SummaryTable = ({ columns, rows }) => (
  <div className={styles.tableCard}>
    <div className={styles.tableTop}>
      <span className={styles.tableCount}>조회 결과: {rows.length} 건</span>
    </div>
    <div className={styles.tableContainer}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className={styles.th}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={`${idx}-${row[0]}`} className={styles.tr}>
                {row.map((cell, cellIdx) => (
                  <td key={`${idx}-${cellIdx}`} className={typeof cell === 'number' ? styles.tdNum : styles.tdCenter}>
                    {typeof cell === 'number' ? formatNum(cell) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ReceivableStatusTab = () => {
  const [changedData, setChangedData] = useState([]);
  const [filterValue, setFilterValue] = useState({ yearMonth: '', creditType: '', bpCd: '', bpNm: '' });

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({ yearMonth: '', creditType: '', bpCd: '', bpNm: '' });
  }, []);

  const filterFields = useMemo(
    () => [
      { id: 'yearMonth', label: '기준년월', type: 'date', row: 0 },
      {
        id: 'creditType',
        label: '채신구분',
        type: 'select',
        width: 140,
        row: 0,
        options: [
          { label: '전체', value: '' },
          { label: '통합', value: 'integrated' },
          { label: '인테리어부문', value: 'interior' },
          { label: '바스플랜부문', value: 'bathplan' },
        ],
      },
      { id: 'bpCd', label: '거래처코드', type: 'text', placeholder: '코드 입력', row: 0 },
      { id: 'bpNm', label: '거래처명', type: 'text', placeholder: '거래처명 검색', wide: true, row: 0 },
    ],
    [],
  );

  const handleLimitChange = (bpCd, newVal) => {
    setChangedData((prev) => [...prev.filter((item) => item.bpCd !== bpCd), { bpCd, newVal }]);
  };

  return (
    <div className={styles.tabPanel}>
      <div className={styles.titleRow}>
        <h3 className={styles.sectionTitle}>채권 및 채신 현황</h3>
        <div className={styles.statusWrap}>
          <span className={styles.statusBadge}>
            <span className={styles.dot}></span> 마감상태: 테스트 / 마감일시: 2026-02-27 18:00
          </span>
          <Button variant="secondary" className={styles.logicBtn}>
            계산 로직 안내
          </Button>
        </div>
      </div>

      <ListFilter fields={filterFields} value={filterValue} onChange={handleFilterChange} onReset={handleReset} onSearch={() => {}} searchLabel="조회" singleLine />

      <div className={styles.tableCard}>
        <div className={styles.tableTop}>
          <span className={styles.tableCount}>조회 결과: {RECEIVABLE_SOURCE.length} 건</span>
          <Button variant="primary" className={changedData.length > 0 ? styles.btnDanger : ''} disabled={changedData.length === 0}>
            {changedData.length > 0 ? `${changedData.length}건 변경 저장` : '변경사항 없음'}
          </Button>
        </div>
        <div className={styles.tableContainer}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th colSpan="5" className={styles.thGroup}>거래처정보</th>
                  <th colSpan="3" className={styles.thGroup}>채신한도</th>
                  <th colSpan="3" className={styles.thGroup}>전월 미수매출금액</th>
                  <th colSpan="3" className={styles.thGroup}>당월 출고금액</th>
                  <th colSpan="3" className={styles.thGroup}>당월 연체금액</th>
                </tr>
                <tr>
                  <th className={styles.th}>코드</th>
                  <th className={styles.th}>거래처명</th>
                  <th className={styles.th}>대표자</th>
                  <th className={styles.th}>채신구분</th>
                  <th className={styles.th}>영업그룹</th>
                  <th className={styles.th}>거래한도</th>
                  <th className={styles.th}>채신여신한도</th>
                  <th className={styles.th}>한도제한</th>
                  <th className={styles.th}>위생기기</th>
                  <th className={styles.th}>타일</th>
                  <th className={styles.thSum}>합계</th>
                  <th className={styles.th}>위생기기</th>
                  <th className={styles.th}>타일</th>
                  <th className={styles.thSum}>합계</th>
                  <th className={styles.th}>위생기기</th>
                  <th className={styles.th}>타일</th>
                  <th className={styles.thSum}>합계</th>
                </tr>
              </thead>
              <tbody>
                {RECEIVABLE_SOURCE.map((row) => {
                  const changedLimit = changedData.find((c) => c.bpCd === row.bpCd)?.newVal;
                  const currentLimit = changedLimit ?? row.ext4Cd;
                  return (
                    <tr key={row.bpCd} className={styles.tr}>
                      <td className={styles.tdCenter}>{row.bpCd}</td>
                      <td className={styles.tdCenter}>{row.bpNm}</td>
                      <td className={styles.tdCenter}>{row.repreNm}</td>
                      <td className={styles.tdCenter}>{row.gb}</td>
                      <td className={styles.tdCenter}>{row.salesNm}</td>
                      <td className={styles.tdNum}>{formatNum(row.estAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.noteAmt)}</td>
                      <td className={styles.tdCenter}>
                        <button type="button" className={`${styles.toggle} ${currentLimit === 'Y' ? styles.toggleOn : styles.toggleOff}`} onClick={() => handleLimitChange(row.bpCd, currentLimit === 'Y' ? 'N' : 'Y')}>
                          {currentLimit}
                        </button>
                      </td>
                      <td className={styles.tdNum}>{formatNum(row.swPrevAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.tiPrevAmt)}</td>
                      <td className={styles.tdNumSum}>{formatNum(row.prevAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.swBillAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.tiBillAmt)}</td>
                      <td className={styles.tdNumSum}>{formatNum(row.billAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.swOverdue)}</td>
                      <td className={styles.tdNum}>{formatNum(row.tiOverdue)}</td>
                      <td className={styles.tdNumSum}>{formatNum(row.totOverdue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionStatusTab = ({ preset }) => {
  const [filterValue, setFilterValue] = useState({
    dateFrom: preset?.dateFrom || '',
    dateTo: preset?.dateTo || '',
    customer: preset?.customerName || '',
    dept: '',
    type: '',
    dueDate: '',
    settleNo: preset?.accountNo || '',
  });

  const filteredRows = useMemo(() => {
    const customerCode = String(preset?.customerCode || '').trim();
    const customerName = String(filterValue.customer || '').trim();
    const from = String(filterValue.dateFrom || '').trim();
    const to = String(filterValue.dateTo || '').trim();

    return TABLES[TAB.COLLECTION].rows.filter((row) => {
      const rowCode = String(row[0] || '');
      const rowName = String(row[1] || '');
      const rowDate = String(row[5] || '');
      if (customerCode && rowCode !== customerCode) return false;
      if (customerName && !rowName.includes(customerName)) return false;
      if (from && rowDate < from) return false;
      if (to && rowDate > to) return false;
      return true;
    });
  }, [filterValue.customer, filterValue.dateFrom, filterValue.dateTo, preset?.customerCode]);

  const fields = useMemo(
    () => [
      { id: 'dateRange', type: 'dateRange', label: '수금일자', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
      { id: 'customer', label: '거래처', type: 'text', row: 0 },
      { id: 'dept', label: '부서', type: 'text', row: 0 },
      { id: 'type', label: '수금구분', type: 'select', row: 0, options: [{ label: '전체', value: '' }, { label: '통장입금', value: 'bank' }, { label: '어음', value: 'note' }] },
      { id: 'dueDate', label: '만기일자', type: 'date', row: 0 },
      { id: 'settleNo', label: '계좌번호', type: 'text', row: 0 },
    ],
    [],
  );

  return (
    <div className={styles.tabPanel}>
      <ListFilter fields={fields} value={filterValue} onChange={(id, v) => setFilterValue((prev) => ({ ...prev, [id]: v }))} onReset={() => setFilterValue({ dateFrom: '', dateTo: '', customer: '', dept: '', type: '', dueDate: '', settleNo: '' })} onSearch={() => {}} searchLabel="조회" singleLine />
      <SummaryTable columns={TABLES[TAB.COLLECTION].columns} rows={filteredRows} />
    </div>
  );
};

const NoteStatusTab = () => {
  const [filterValue, setFilterValue] = useState({
    dueFrom: '',
    dueTo: '',
    issueFrom: '',
    issueTo: '',
    noteType: '',
    noteStatus: '',
    stepType: '',
    customer: '',
    bank: '',
    noteNo: '',
    issuer: '',
    memo: '',
  });

  const fields = useMemo(
    () => [
      { id: 'dueRange', type: 'dateRange', label: '만기일', fromKey: 'dueFrom', toKey: 'dueTo', row: 0 },
      { id: 'issueRange', type: 'dateRange', label: '발행일', fromKey: 'issueFrom', toKey: 'issueTo', row: 0 },
      { id: 'noteType', label: '어음구분', type: 'select', row: 0, options: [{ label: '전체', value: '' }, { label: '받은어음', value: 'received' }] },
      { id: 'noteStatus', label: '어음상태', type: 'select', row: 0, options: [{ label: '전체', value: '' }, { label: '결제', value: 'paid' }, { label: '발생', value: 'issued' }] },
      { id: 'stepType', label: '차수/단수', type: 'select', row: 0, options: [{ label: '전체', value: '' }, { label: '타수', value: 'multi' }, { label: '단수', value: 'single' }] },
      { id: 'customer', label: '거래처', type: 'text', row: 0 },
      { id: 'bank', label: '은행', type: 'text', row: 0 },
      { id: 'noteNo', label: '어음번호(Like)', type: 'text', row: 0 },
      { id: 'issuer', label: '발행인(Like)', type: 'text', row: 0 },
      { id: 'memo', label: '비고(Like)', type: 'text', row: 0 },
    ],
    [],
  );

  return (
    <div className={styles.tabPanel}>
      <ListFilter fields={fields} value={filterValue} onChange={(id, v) => setFilterValue((prev) => ({ ...prev, [id]: v }))} onReset={() => setFilterValue({ dueFrom: '', dueTo: '', issueFrom: '', issueTo: '', noteType: '', noteStatus: '', stepType: '', customer: '', bank: '', noteNo: '', issuer: '', memo: '' })} onSearch={() => {}} searchLabel="조회" singleLine />
      <SummaryTable columns={TABLES[TAB.NOTE].columns} rows={TABLES[TAB.NOTE].rows} />
    </div>
  );
};

const OutstandingStatusTab = () => {
  const [filterValue, setFilterValue] = useState({
    customer: '',
    salesGroupName: '',
    salesGroupCode: '',
    salesDateFrom: '',
    salesDateTo: '',
    currentMonthOnly: false,
  });
  const [collectionPlanBySalesNo, setCollectionPlanBySalesNo] = useState({});

  const fields = useMemo(
    () => [
      { id: 'customer', label: '거래처', type: 'text', row: 0 },
      { id: 'salesGroupName', label: '영업그룹(이름)', type: 'text', row: 0 },
      { id: 'salesGroupCode', label: '영업그룹(코드)', type: 'text', row: 0 },
      { id: 'salesDateRange', type: 'dateRange', label: '매출일자', fromKey: 'salesDateFrom', toKey: 'salesDateTo', row: 0 },
      { id: 'currentMonthOnly', label: '당월 미수금 확인', type: 'checkbox', row: 0 },
    ],
    [],
  );

  const filteredRows = useMemo(() => {
    const customerKeyword = String(filterValue.customer || '').trim();
    const managerNameKeyword = String(filterValue.salesGroupName || '').trim();
    const managerCodeKeyword = String(filterValue.salesGroupCode || '').trim();
    const from = String(filterValue.salesDateFrom || '').trim();
    const to = String(filterValue.salesDateTo || '').trim();

    let rows = OUTSTANDING_ROWS.filter((row) => {
      if (customerKeyword && !row.customerName.includes(customerKeyword) && !row.customerCode.includes(customerKeyword)) return false;
      if (managerNameKeyword && !row.managerName.includes(managerNameKeyword)) return false;
      if (managerCodeKeyword && !row.managerCode.includes(managerCodeKeyword)) return false;
      if (from && row.salesDate < from) return false;
      if (to && row.salesDate > to) return false;
      return true;
    });

    if (filterValue.currentMonthOnly) {
      const currentMonthPrefix = '2026-04';
      rows = rows.filter((row) => row.salesDate.startsWith(currentMonthPrefix));
    }

    return rows;
  }, [filterValue]);

  return (
    <div className={styles.tabPanel}>
      <ListFilter
        fields={fields}
        value={filterValue}
        onChange={(id, v) => setFilterValue((prev) => ({ ...prev, [id]: v }))}
        onReset={() =>
          setFilterValue({
            customer: '',
            salesGroupName: '',
            salesGroupCode: '',
            salesDateFrom: '',
            salesDateTo: '',
            currentMonthOnly: false,
          })
        }
        onSearch={() => {}}
        searchLabel="조회"
        singleLine
      />
      <div className={styles.tableCard}>
        <div className={styles.tableTop}>
          <span className={styles.tableCount}>조회 결과: {filteredRows.length} 건</span>
        </div>
        <div className={styles.tableContainer}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>거래처</th>
                  <th className={styles.th}>거래처명</th>
                  <th className={styles.th}>영업담당(코드)</th>
                  <th className={styles.th}>영업담당자</th>
                  <th className={styles.th}>영업조직</th>
                  <th className={styles.th}>매출일자</th>
                  <th className={styles.th}>매출번호</th>
                  <th className={styles.th}>매출금액</th>
                  <th className={styles.th}>수금액</th>
                  <th className={styles.th}>미수금액</th>
                  <th className={styles.th}>수금계획</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.salesNo} className={styles.tr}>
                    <td className={styles.tdCenter}>{row.customerCode}</td>
                    <td className={styles.tdCenter}>{row.customerName}</td>
                    <td className={styles.tdCenter}>{row.managerCode}</td>
                    <td className={styles.tdCenter}>{row.managerName}</td>
                    <td className={styles.tdCenter}>{row.salesOrg}</td>
                    <td className={styles.tdCenter}>{row.salesDate}</td>
                    <td className={styles.tdCenter}>{row.salesNo}</td>
                    <td className={styles.tdNum}>{formatNum(row.salesAmount)}</td>
                    <td className={styles.tdNum}>{formatNum(row.receiptAmount)}</td>
                    <td className={styles.tdNumSum}>{formatNum(row.outstandingAmount)}</td>
                    <td>
                      <input
                        type="text"
                        className={styles.planInput}
                        value={collectionPlanBySalesNo[row.salesNo] || ''}
                        onChange={(e) =>
                          setCollectionPlanBySalesNo((prev) => ({
                            ...prev,
                            [row.salesNo]: e.target.value,
                          }))
                        }
                        placeholder="수금 예정일/메모 입력"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SupportReceivablePage = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(TAB.RECEIVABLE);

  const preset = useMemo(
    () => ({
      tab: searchParams.get('tab') || '',
      customerCode: searchParams.get('customerCode') || '',
      customerName: searchParams.get('customerName') || '',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      accountNo: searchParams.get('accountNo') || '',
    }),
    [searchParams],
  );

  useEffect(() => {
    if (preset.tab === TAB.COLLECTION) setActiveTab(TAB.COLLECTION);
  }, [preset.tab]);

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <div className={styles.mainCard}>
          <h2 className={styles.pageTitle}>채신/수금 관리</h2>
          <div className={styles.tabs} role="tablist">
            <button type="button" role="tab" aria-selected={activeTab === TAB.RECEIVABLE} className={activeTab === TAB.RECEIVABLE ? styles.tabActive : styles.tab} onClick={() => setActiveTab(TAB.RECEIVABLE)}>
              채권 및 채신 현황
            </button>
            <button type="button" role="tab" aria-selected={activeTab === TAB.COLLECTION} className={activeTab === TAB.COLLECTION ? styles.tabActive : styles.tab} onClick={() => setActiveTab(TAB.COLLECTION)}>
              수금 현황
            </button>
            <button type="button" role="tab" aria-selected={activeTab === TAB.NOTE} className={activeTab === TAB.NOTE ? styles.tabActive : styles.tab} onClick={() => setActiveTab(TAB.NOTE)}>
              어음 현황
            </button>
            <button type="button" role="tab" aria-selected={activeTab === TAB.OUTSTANDING} className={activeTab === TAB.OUTSTANDING ? styles.tabActive : styles.tab} onClick={() => setActiveTab(TAB.OUTSTANDING)}>
              미수금 현황
            </button>
          </div>

          {activeTab === TAB.RECEIVABLE && <ReceivableStatusTab />}
          {activeTab === TAB.COLLECTION && <CollectionStatusTab preset={preset} />}
          {activeTab === TAB.NOTE && <NoteStatusTab />}
          {activeTab === TAB.OUTSTANDING && <OutstandingStatusTab />}
        </div>
      </div>
    </PageShell>
  );
};

export default SupportReceivablePage;
