import { useCallback, useMemo, useState } from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { ListFilter } from '../../../../shared/components/ListFilter/ListFilter';
import { formatNumber } from '../../../../shared/utils/formatters';
import styles from '../SupportReceivablePage.module.css';
import {
  OUTSTANDING_ROWS,
  RECEIVABLE_SOURCE,
  TAB,
  TABLES,
} from '../supportReceivable.helpers';
const formatNum = (num) => formatNumber(num);

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


export function SupportReceivableTabPanel({ activeTab, preset }) {
  if (activeTab === TAB.RECEIVABLE) return <ReceivableStatusTab />;
  if (activeTab === TAB.COLLECTION) return <CollectionStatusTab preset={preset} />;
  if (activeTab === TAB.NOTE) return <NoteStatusTab />;
  if (activeTab === TAB.OUTSTANDING) return <OutstandingStatusTab />;
  return null;
}
