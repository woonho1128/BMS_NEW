import React, { useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { BillsDepositsPage } from './BillsDepositsPage';
import styles from './SupportReceivablePage.module.css';

const formatNum = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

const ToggleSwitch = ({ checked, onChange }) => (
  <button 
    type="button" 
    className={`${styles.toggle} ${checked ? styles.toggleOn : styles.toggleOff}`} 
    onClick={() => onChange(!checked)}
  >
    {checked ? 'Y' : 'N'}
  </button>
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
          { label: '인테리어부문', value: 'sales' },
          { label: '바스플랜부문', value: 'bath' },
        ],
      },
      { id: 'bpCd', label: '거래처 코드', type: 'text', placeholder: '코드 입력', row: 0 },
      { id: 'bpNm', label: '거래처명', type: 'text', placeholder: '거래처명 검색', wide: true, row: 0 },
    ],
    []
  );

  const handleLimitChange = (bpCd, newVal) => {
    setChangedData((prev) => [...prev.filter((item) => item.bpCd !== bpCd), { bpCd, newVal }]);
  };

  const dataSource = [
    {
      key: '1', bpCd: '050006', bpNm: '효자타일 대리점', repreNm: '김경호', gb: '인테리어부문', salesNm: '권순호',
      estAmt: 200000000, noteAmt: 109941691, ext4Cd: 'Y', swPrevAmt: 69719309, tiPrevAmt: 704000, prevAmt: 70423309,
      swBillAmt: 90058309, tiBillAmt: 0, billAmt: 90058309, swOverdue: 0, tiOverdue: 0, totOverdue: 0,
    },
    {
      key: '2', bpCd: '050024', bpNm: '이화대리점', repreNm: '김보라', gb: '인테리어부문', salesNm: '유득진',
      estAmt: 190000000, noteAmt: -17138380, ext4Cd: 'N', swPrevAmt: 115245714, tiPrevAmt: 32861620, prevAmt: 148107334,
      swBillAmt: 90673561, tiBillAmt: 19298400, billAmt: 109971961, swOverdue: 30000000, tiOverdue: 8107334, totOverdue: 38107334,
    },
  ];

  return (
    <div className={styles.tabPanel}>
      <div className={styles.titleRow}>
        <h3 className={styles.sectionTitle}>채권 및 채신 현황</h3>
        <div className={styles.statusWrap}>
          <span className={styles.statusBadge}>
            <span className={styles.dot}></span> 마감상태: 테스트 / 마감일시: 2026-02-27 18:00
          </span>
          <div className={styles.tooltipWrap}>
            <Button variant="secondary" className={styles.logicBtn}>계산 로직 안내</Button>
            <div className={styles.tooltip}>
              <p><b>계산로직:</b> 당월 미수매출금 = 전월미수 + 당월매출 - 당월수금</p>
              <p><b>채신한도:</b> 거래한도 - 당월 미수매출금 - 미결제어음</p>
            </div>
          </div>
        </div>
      </div>

      <ListFilter
        fields={filterFields}
        value={filterValue}
        onChange={handleFilterChange}
        onReset={handleReset}
        onSearch={() => {}}
        searchLabel="조회"
      />

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
                  <th className={styles.th} style={{ textAlign: 'right' }}>거래한도</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>채신여신한도</th>
                  <th className={styles.th}>한도제한</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>위생기기</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>타일</th>
                  <th className={styles.thSum} style={{ textAlign: 'right' }}>합계</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>위생기기</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>타일</th>
                  <th className={styles.thSum} style={{ textAlign: 'right' }}>합계</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>위생기기</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>타일</th>
                  <th className={styles.thSum} style={{ textAlign: 'right' }}>합계</th>
                </tr>
              </thead>
              <tbody>
                {dataSource.map((row) => {
                  const changedLimit = changedData.find(c => c.bpCd === row.bpCd)?.newVal;
                  const currentLimit = changedLimit !== undefined ? changedLimit : row.ext4Cd;
                  return (
                    <tr key={row.bpCd} className={styles.tr}>
                      <td className={styles.tdCenter}>{row.bpCd}</td>
                      <td className={styles.td}>{row.bpNm}</td>
                      <td className={styles.tdCenter}>{row.repreNm}</td>
                      <td className={styles.tdCenter}>{row.gb}</td>
                      <td className={styles.tdCenter}>{row.salesNm}</td>
                      <td className={styles.tdNum}>{formatNum(row.estAmt)}</td>
                      <td className={styles.tdNum}>
                         <strong style={{ color: row.noteAmt < 0 ? '#cf1322' : '#096dd9' }}>{formatNum(row.noteAmt)}</strong>
                      </td>
                      <td className={styles.tdCenter}>
                        <ToggleSwitch checked={currentLimit === 'Y'} onChange={(val) => handleLimitChange(row.bpCd, val ? 'Y' : 'N')} />
                      </td>
                      <td className={styles.tdNum}>{formatNum(row.swPrevAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.tiPrevAmt)}</td>
                      <td className={styles.tdNumSum}>{formatNum(row.prevAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.swBillAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.tiBillAmt)}</td>
                      <td className={styles.tdNumSum}>{formatNum(row.billAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.swOverdue)}</td>
                      <td className={styles.tdNum}>{formatNum(row.tiOverdue)}</td>
                      <td className={styles.tdNumSum}>
                        <span style={{ color: row.totOverdue > 0 ? '#cf1322' : 'inherit' }}>{formatNum(row.totOverdue)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className={styles.tfootTr}>
                  <td colSpan="5" className={styles.tdCenter} style={{ fontWeight: 600 }}>총 합계</td>
                  <td className={styles.tdNum} style={{ fontWeight: 600 }}>3,372,993,161,116</td>
                  <td className={styles.tdNum} style={{ fontWeight: 600 }}>3,331,621,425,825</td>
                  <td className={styles.tdCenter}></td>
                  <td colSpan="9" className={styles.tdNum} style={{ fontWeight: 600 }}>26,106,000,247</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionStatusTab = () => {
  return (
    <div className={styles.collectionWrap}>
      <BillsDepositsPage isTabMode={true} />
    </div>
  );
};

const SupportReceivablePage = () => {
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState('receivable');

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <div className={styles.mainCard}>
          <h2 className={styles.pageTitle}>채신/수금 관리</h2>
          <div className={styles.tabs} role="tablist">
            <button 
              type="button" 
              role="tab" 
              aria-selected={activeTab === 'receivable'} 
              className={activeTab === 'receivable' ? styles.tabActive : styles.tab} 
              onClick={() => setActiveTab('receivable')}
            >
              채권 및 채신 현황
            </button>
            <button 
              type="button" 
              role="tab" 
              aria-selected={activeTab === 'collection'} 
              className={activeTab === 'collection' ? styles.tabActive : styles.tab} 
              onClick={() => setActiveTab('collection')}
            >
              어음 및 수금 현황
            </button>
          </div>
          
          <div className={styles.tabContent}>
            {activeTab === 'receivable' && <ReceivableStatusTab />}
            {activeTab === 'collection' && <CollectionStatusTab />}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export { SupportReceivablePage };
export default SupportReceivablePage;
