import React, { useState, useCallback, useMemo } from 'react';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { Button } from '../../../shared/components/Button/Button';
import styles from './BillsDepositsPage.module.css';

const formatNum = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

const CollectionStatus = ({ isTabMode = false }) => {
  const [filterValue, setFilterValue] = useState({
    dateFrom: '',
    dateTo: '',
    bpNm: '',
    salesOrg: '',
    collectionType: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({ dateFrom: '', dateTo: '', bpNm: '', salesOrg: '', collectionType: '' });
    setCurrentPage(1);
  }, []);

  const filterFields = useMemo(
    () => [
      {
        id: 'colDate',
        label: '수금일자',
        type: 'dateRange',
        fromKey: 'dateFrom',
        toKey: 'dateTo',
        row: 0,
      },
      {
        id: 'bpNm',
        label: '거래처',
        type: 'text',
        placeholder: '거래처 코드 또는 명칭',
        wide: true,
        row: 0,
      },
      {
        id: 'salesOrg',
        label: '영업조직',
        type: 'select',
        width: 140,
        row: 0,
        options: [
          { label: '전체', value: '' },
          { label: '인테리어부문', value: 'sales' },
          { label: '바스플랜부문', value: 'bath' },
        ],
      },
      {
        id: 'collectionType',
        label: '수금구분',
        type: 'select',
        width: 130,
        row: 0,
        options: [
          { label: '전체', value: '' },
          { label: '통장입금', value: 'bank' },
          { label: '어음', value: 'note' },
        ],
      },
    ],
    []
  );

  const dataSource = useMemo(() => [
    {
      key: '1', bpCd: '050006', bpNm: '효자타일 대리점', repreNm: '김경호', type: '통장입금', colDate: '2026-01-29',
      manager: '이해규', salesNo: 'BN202512310535', salesDate: '2025-12-31', clearNo: 'UX202601290010',
      swAmt: 13521959, tileAmt: 0, totalAmt: 13521959, bank: '우리은행 주식회사',
    },
    {
      key: '2', bpCd: '050006', bpNm: '효자타일 대리점', repreNm: '김경호', type: '통장입금', colDate: '2026-02-26',
      manager: '김지원', salesNo: 'BN202601310563', salesDate: '2026-01-31', clearNo: 'UX202602260020',
      swAmt: 0, tileAmt: 704000, totalAmt: 704000, bank: '우리은행 주식회사',
    },
    {
      key: '3', bpCd: '050016', bpNm: '로얄세라믹하우징(주)', repreNm: '김진태', type: '통장입금', colDate: '2026-01-27',
      manager: '이해규', salesNo: 'BN202511300211', salesDate: '2025-11-30', clearNo: 'UX202601270011',
      swAmt: 200000000, tileAmt: 0, totalAmt: 200000000, bank: '우리은행 주식회사',
    },
    {
      key: '4', bpCd: '050020', bpNm: '한일기계산업', repreNm: '권용호', type: '통장입금', colDate: '2026-01-30',
      manager: '조동윤', salesNo: 'BN202512310576', salesDate: '2025-12-31', clearNo: 'UX202601300051',
      swAmt: 10000000, tileAmt: 0, totalAmt: 10000000, bank: '우리은행 주식회사',
    },
  ], []);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return dataSource.slice(start, start + itemsPerPage);
  }, [dataSource, currentPage]);

  const totalPages = Math.ceil(dataSource.length / itemsPerPage);

  const { totalSw, totalTile, totalSum } = useMemo(() => {
    return dataSource.reduce(
      (acc, curr) => ({
        totalSw: acc.totalSw + curr.swAmt,
        totalTile: acc.totalTile + curr.tileAmt,
        totalSum: acc.totalSum + curr.totalAmt,
      }),
      { totalSw: 0, totalTile: 0, totalSum: 0 }
    );
  }, [dataSource]);

  return (
    <div style={{ padding: isTabMode ? '0' : '24px', backgroundColor: isTabMode ? 'transparent' : '#f0f2f5', minHeight: isTabMode ? 'auto' : '100vh' }}>
      <div className={styles.headerRow}>
        {!isTabMode ? (
          <h2 className={styles.pageTitle}>어음/수금관리</h2>
        ) : (
          <h3 className={styles.sectionTitle}>어음 및 수금 현황</h3>
        )}
        <div>
          <Button variant="secondary" size={isTabMode ? "small" : "md"}>엑셀 다운로드</Button>
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
        </div>
        
        <div className={styles.tableContainer}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>거래처코드</th>
                  <th className={styles.th}>거래처명</th>
                  <th className={styles.th}>대표자명</th>
                  <th className={styles.th}>수금구분</th>
                  <th className={styles.th}>수금일자</th>
                  <th className={styles.th}>영업담당</th>
                  <th className={styles.th}>매출번호</th>
                  <th className={styles.th}>매출일자</th>
                  <th className={styles.th}>반제번호</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>SW수금액</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>타일수금액</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>수금합계</th>
                  <th className={styles.th}>입금은행</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={13} style={{ textAlign: 'center', padding: '48px', color: '#8ea0b8' }}>데이터가 없습니다.</td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.key} className={styles.tr}>
                      <td className={styles.tdCenter}>{row.bpCd}</td>
                      <td className={styles.td}>{row.bpNm}</td>
                      <td className={styles.tdCenter}>{row.repreNm}</td>
                      <td className={styles.tdCenter}>
                        <span className={styles.tagBlue}>{row.type}</span>
                      </td>
                      <td className={styles.tdCenter}>{row.colDate}</td>
                      <td className={styles.tdCenter}>{row.manager}</td>
                      <td className={styles.tdCenter}>{row.salesNo}</td>
                      <td className={styles.tdCenter}>{row.salesDate}</td>
                      <td className={styles.tdCenter}>{row.clearNo}</td>
                      <td className={styles.tdNum}>{formatNum(row.swAmt)}</td>
                      <td className={styles.tdNum}>{formatNum(row.tileAmt)}</td>
                      <td className={styles.tdNum} style={{ color: '#cf1322', fontWeight: 'bold' }}>{formatNum(row.totalAmt)}</td>
                      <td className={styles.td}>{row.bank}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                {dataSource.length > 0 && (
                  <tr className={styles.tfootTr}>
                    <td colSpan={9} className={styles.tdCenter}>총 합계</td>
                    <td className={styles.tdNum}>{formatNum(totalSw)}</td>
                    <td className={styles.tdNum}>{formatNum(totalTile)}</td>
                    <td className={styles.tdNum} style={{ color: '#cf1322' }}>{formatNum(totalSum)}</td>
                    <td className={styles.td}></td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>이전</button>
              <span>{currentPage} / {totalPages}</span>
              <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>다음</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { CollectionStatus as BillsDepositsPage };
export default CollectionStatus;
