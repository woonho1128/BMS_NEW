import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import styles from './SupportReceivablePage.module.css';

const formatNum = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

const TAB = {
  RECEIVABLE: 'receivable',
  COLLECTION: 'collection',
  NOTE: 'note',
  OUTSTANDING: 'outstanding'
};

const TABLES = {
  [TAB.COLLECTION]: {
    columns: ['거래처', '거래처명', '대표자명', '수금구분', '어음구분', '수금일자', '반제결의번호', '수금액', '어음번호', '어음발행은행', '발행인', '어음발행일', '어음만기일', '어음상태', '입금은행', '입금계좌번호'],
    rows: [
      ['050006', '한사회대리점', '이경호', '통장입금', '-', '2026-03-27', 'UX202603270005', 90588939, '-', '-', '-', '-', '-', '-', '우리은행', '082-037021-13-001'],
      ['050007', '대원타일위생기사', '김성진', '어음', '자수', '2026-03-11', 'UX202603110022', 40358615, '전자0000278', '신한은행', '코리아아트', '2026-03-11', '2026-04-10', '발생', '우리은행', '082-037021-13-001']
    ]
  },
  [TAB.NOTE]: {
    columns: ['상태', '어음번호', '차수/단수', '어음금액', '발행일', '만기일', '부서코드', '부서명', '거래처코드', '거래처명', '은행', '발행인', '비고'],
    rows: [
      ['결제', '자가30217984', '타수', 42200000, '2025-10-22', '2026-01-09', '7100', '리테일1팀', '101266', '(주)세양도기', '우리은행', '한일도기사', '-'],
      ['결제', '전자00001442', '타수', 4000000, '2025-12-31', '2026-03-01', '7100', '리테일1팀', '051800', '(주)에스티유중', '신한은행', '풍림상인(주)', '-']
    ]
  },
  [TAB.OUTSTANDING]: {
    columns: ['거래처', '거래처명', '영업담당(코드)', '영업담당자', '영업조직', '매출일자', '매출번호', '매출금액', '수금액', '미수금액'],
    rows: [
      ['050016', '디에스대성하우징(주)', 'G814', '이해규', '리테일3팀', '2025-12-31', 'BN202512310536', 213852980, 157965320, 55887660],
      ['050090', '강남타이룸상사', 'G814', '이해규', '리테일3팀', '2026-02-28', 'BN202602280487', 11587224, 0, 11587224]
    ]
  }
};

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
          { label: '바스플랜부문', value: 'bathplan' }
        ]
      },
      { id: 'bpCd', label: '거래처코드', type: 'text', placeholder: '코드 입력', row: 0 },
      { id: 'bpNm', label: '거래처명', type: 'text', placeholder: '거래처명 검색', wide: true, row: 0 }
    ],
    []
  );

  const dataSource = [
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
      totOverdue: 0
    }
  ];

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

      <ListFilter fields={filterFields} value={filterValue} onChange={handleFilterChange} onReset={handleReset} onSearch={() => {}} searchLabel="조회" />

      <div className={styles.tableCard}>
        <div className={styles.tableTop}>
          <span className={styles.tableCount}>조회 결과: {dataSource.length} 건</span>
          <Button variant="primary" className={changedData.length > 0 ? styles.btnDanger : ''} disabled={changedData.length === 0}>
            {changedData.length > 0 ? `${changedData.length}건 변경 저장` : '변경사항 없음'}
          </Button>
        </div>
        <div className={styles.tableContainer}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th colSpan="5" className={styles.thGroup}>
                    거래처정보
                  </th>
                  <th colSpan="3" className={styles.thGroup}>
                    채신한도
                  </th>
                  <th colSpan="3" className={styles.thGroup}>
                    전월 미수매출금액
                  </th>
                  <th colSpan="3" className={styles.thGroup}>
                    당월 출고금액
                  </th>
                  <th colSpan="3" className={styles.thGroup}>
                    당월 연체금액
                  </th>
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
                {dataSource.map((row) => {
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

const CollectionStatusTab = () => {
  const [filterValue, setFilterValue] = useState({
    dateFrom: '',
    dateTo: '',
    customer: '',
    dept: '',
    type: '',
    dueDate: '',
    settleNo: ''
  });

  const fields = useMemo(
    () => [
      { id: 'dateRange', type: 'dateRange', label: '수금일자', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
      { id: 'customer', label: '거래처', type: 'text', row: 0 },
      { id: 'dept', label: '부서', type: 'text', row: 0 },
      { id: 'type', label: '수금구분', type: 'select', row: 1, options: [{ label: '전체', value: '' }, { label: '통장입금', value: 'bank' }, { label: '어음', value: 'note' }] },
      { id: 'dueDate', label: '만기일자', type: 'date', row: 1 },
      { id: 'settleNo', label: '계좌번호', type: 'text', row: 1 }
    ],
    []
  );

  return (
    <div className={styles.tabPanel}>
      <ListFilter fields={fields} value={filterValue} onChange={(id, v) => setFilterValue((prev) => ({ ...prev, [id]: v }))} onReset={() => setFilterValue({ dateFrom: '', dateTo: '', customer: '', dept: '', type: '', dueDate: '', settleNo: '' })} onSearch={() => {}} searchLabel="조회" />
      <SummaryTable columns={TABLES[TAB.COLLECTION].columns} rows={TABLES[TAB.COLLECTION].rows} />
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
    memo: ''
  });

  const fields = useMemo(
    () => [
      { id: 'dueRange', type: 'dateRange', label: '만기일', fromKey: 'dueFrom', toKey: 'dueTo', row: 0 },
      { id: 'issueRange', type: 'dateRange', label: '발행일', fromKey: 'issueFrom', toKey: 'issueTo', row: 0 },
      { id: 'noteType', label: '어음구분', type: 'select', row: 0, options: [{ label: '전체', value: '' }, { label: '받은어음', value: 'received' }] },
      { id: 'noteStatus', label: '어음상태', type: 'select', row: 0, options: [{ label: '전체', value: '' }, { label: '결제', value: 'paid' }, { label: '발생', value: 'issued' }] },
      { id: 'stepType', label: '차수/단수', type: 'select', row: 0, options: [{ label: '전체', value: '' }, { label: '타수', value: 'multi' }, { label: '단수', value: 'single' }] },
      { id: 'customer', label: '거래처', type: 'text', row: 1 },
      { id: 'bank', label: '은행', type: 'text', row: 1 },
      { id: 'noteNo', label: '어음번호(Like)', type: 'text', row: 1 },
      { id: 'issuer', label: '발행인(Like)', type: 'text', row: 1 },
      { id: 'memo', label: '비고(Like)', type: 'text', row: 1 }
    ],
    []
  );

  return (
    <div className={styles.tabPanel}>
      <ListFilter fields={fields} value={filterValue} onChange={(id, v) => setFilterValue((prev) => ({ ...prev, [id]: v }))} onReset={() => setFilterValue({ dueFrom: '', dueTo: '', issueFrom: '', issueTo: '', noteType: '', noteStatus: '', stepType: '', customer: '', bank: '', noteNo: '', issuer: '', memo: '' })} onSearch={() => {}} searchLabel="조회" />
      <SummaryTable columns={TABLES[TAB.NOTE].columns} rows={TABLES[TAB.NOTE].rows} />
    </div>
  );
};

const OutstandingStatusTab = () => {
  const [filterValue, setFilterValue] = useState({ customer: '', salesGroupName: '', salesGroupCode: '' });

  const fields = useMemo(
    () => [
      { id: 'customer', label: '거래처', type: 'text', row: 0 },
      { id: 'salesGroupName', label: '영업그룹(이름)', type: 'text', row: 0 },
      { id: 'salesGroupCode', label: '영업그룹(코드)', type: 'text', row: 0 }
    ],
    []
  );

  return (
    <div className={styles.tabPanel}>
      <ListFilter fields={fields} value={filterValue} onChange={(id, v) => setFilterValue((prev) => ({ ...prev, [id]: v }))} onReset={() => setFilterValue({ customer: '', salesGroupName: '', salesGroupCode: '' })} onSearch={() => {}} searchLabel="조회" />
      <SummaryTable columns={TABLES[TAB.OUTSTANDING].columns} rows={TABLES[TAB.OUTSTANDING].rows} />
    </div>
  );
};

const SupportReceivablePage = () => {
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState(TAB.RECEIVABLE);

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

          <div className={styles.tabContent}>
            {activeTab === TAB.RECEIVABLE && <ReceivableStatusTab />}
            {activeTab === TAB.COLLECTION && <CollectionStatusTab />}
            {activeTab === TAB.NOTE && <NoteStatusTab />}
            {activeTab === TAB.OUTSTANDING && <OutstandingStatusTab />}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export { SupportReceivablePage };
export default SupportReceivablePage;
