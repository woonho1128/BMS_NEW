import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter';
import { classnames } from '../../../shared/utils/classnames';
import { MOCK_SALES_INFO } from '../data/salesInfoMock';
import styles from './SalesInfoPage.module.css';

const PROGRESS_OPTIONS = ['전체', '진행중', '완료', '대기'];
const DATE_CRITERIA_OPTIONS = [
  { value: '', label: '선택안함' },
  { value: 'specRegisterDate', label: 'SPEC 등록일' },
  { value: 'orderDate', label: 'SPEC 수주일자' },
  { value: 'expectedDeliveryDate', label: '예상납기일' },
  { value: 'completionDate', label: '완공예정일' },
];
const PAID_OPTION_OPTIONS = ['전체', '적용', '미적용'];

/** sales/info 필터 설정 (공통 ListFilter) */
const SALES_INFO_FILTER_FIELDS = [
  { id: 'builder', label: '건설회사', type: 'text', placeholder: '건설회사 검색', wide: true, row: 0 },
  { id: 'siteName', label: '현장명', type: 'text', placeholder: '현장명 검색', wide: true, row: 0 },
  { id: 'specNo', label: 'SW SPEC NO', type: 'text', placeholder: 'SW SPEC NO 검색', wide: true, row: 0 },
  { id: 'partner', label: '대리점', type: 'text', placeholder: '대리점 검색', wide: true, row: 0 },
  { id: 'progress', label: '진행사항', type: 'select', options: PROGRESS_OPTIONS.map((o) => ({ value: o === '전체' ? '' : o, label: o })), row: 1 },
  { id: 'author', label: '등록자', type: 'text', placeholder: '등록자 검색', row: 1 },
  { id: 'paidOption', label: '유상옵션 적용여부', type: 'select', options: PAID_OPTION_OPTIONS.map((o) => ({ value: o === '전체' ? '' : o, label: o })), row: 1 },
  { id: 'dateCriteria', label: '날짜 기준', type: 'select', options: DATE_CRITERIA_OPTIONS, row: 1 },
  { id: 'dateRange', type: 'dateRange', label: '기간', showWhen: 'dateCriteria', fromKey: 'dateFrom', toKey: 'dateTo', row: 1 },
];

/** 수익률 색상 결정 */
function getProfitRateColor(rate) {
  if (rate == null) return null;
  if (rate >= 20) return 'high';
  if (rate >= 10) return 'medium';
  return 'low';
}

const INITIAL_SALES_INFO_FILTER = {
  builder: '',
  siteName: '',
  specNo: '',
  partner: '',
  progress: '',
  author: '',
  paidOption: '',
  dateCriteria: '',
  dateFrom: '',
  dateTo: '',
};

export function SalesInfoPage() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(INITIAL_SALES_INFO_FILTER);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredList = useMemo(() => {
    let list = [...MOCK_SALES_INFO];
    const f = filterValue;
    if (f.builder?.trim()) {
      const q = f.builder.toLowerCase();
      list = list.filter((item) => item.builder.toLowerCase().includes(q));
    }
    if (f.specNo?.trim()) {
      const q = f.specNo.toLowerCase();
      list = list.filter((item) => item.specNo.toLowerCase().includes(q));
    }
    if (f.siteName?.trim()) {
      const q = f.siteName.toLowerCase();
      list = list.filter((item) => item.siteName.toLowerCase().includes(q));
    }
    if (f.progress && f.progress !== '전체') {
      list = list.filter((item) => item.progress === f.progress);
    }
    if (f.author?.trim()) {
      const q = f.author.toLowerCase();
      list = list.filter((item) => item.author.toLowerCase().includes(q));
    }
    if (f.dateCriteria) {
      list = list.filter((item) => {
        const dateValue = item[f.dateCriteria];
        if (!dateValue) return false;
        if (f.dateFrom && dateValue < f.dateFrom) return false;
        if (f.dateTo && dateValue > f.dateTo) return false;
        return true;
      });
    }
    if (f.partner?.trim()) {
      const q = f.partner.toLowerCase();
      list = list.filter((item) => item.partner.toLowerCase().includes(q));
    }
    if (f.paidOption && f.paidOption !== '전체') {
      list = list.filter((item) => item.paidOption === f.paidOption);
    }
    return list;
  }, [filterValue]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const handleRowClick = useCallback((id) => {
    navigate(`/sales/info/${id}`);
  }, [navigate]);

  const handleRegister = useCallback(() => {
    navigate('/sales/info/new');
  }, [navigate]);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilterValue(INITIAL_SALES_INFO_FILTER);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback(() => setCurrentPage(1), []);

  const headerActions = (
    <Button variant="primary" onClick={handleRegister}>
      + 등록
    </Button>
  );

  return (
    <PageShell
      path="/sales/info"
      title="영업정보"
      description="영업정보 조회 및 관리"
      actions={headerActions}
    >
      <div className={styles.page}>
        {/* 검색 필터 (공통 ListFilter, 조건만 sales/info 설정) */}
        <ListFilter
          className={styles.toolbarWrap}
          fields={SALES_INFO_FILTER_FIELDS}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          onSearch={handleSearch}
          onKeyDownEnter={handleSearch}
        />

        {/* 결과 테이블 */}
        <section className={styles.tableSection} aria-label="영업정보 목록">
          <div className={styles.tableHeaderRow}>
            <span className={styles.tableCount}>{filteredList.length}건</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>건설회사</th>
                  <th className={styles.th}>SW SPEC NO</th>
                  <th className={styles.th}>현장명</th>
                  <th className={styles.th}>진행사항</th>
                  <th className={styles.th}>등록자</th>
                  <th className={styles.th}>SW 수주일자</th>
                  <th className={styles.th}>손익분석 여부</th>
                  <th className={styles.th}>매출총이익률(%)</th>
                  <th className={styles.th}>영업이익률(%)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((item) => {
                  const grossProfitColor = getProfitRateColor(item.grossProfitRate);
                  const operatingProfitColor = getProfitRateColor(item.operatingProfitRate);
                  return (
                    <tr
                      key={item.id}
                      className={classnames(
                        styles.tableRow,
                        !item.hasProfitAnalysis && styles.tableRowNoAnalysis
                      )}
                      onClick={() => handleRowClick(item.id)}
                    >
                      <td className={styles.td}>{item.builder}</td>
                      <td className={styles.td}>{item.specNo}</td>
                      <td className={styles.td}>{item.siteName}</td>
                      <td className={styles.td}>{item.progress}</td>
                      <td className={styles.td}>{item.author}</td>
                      <td className={styles.td}>{item.orderDate}</td>
                      <td className={styles.td}>
                        <span
                          className={classnames(
                            styles.badge,
                            item.hasProfitAnalysis ? styles.badgeYes : styles.badgeNo
                          )}
                        >
                          {item.hasProfitAnalysis ? 'Y' : 'N'}
                        </span>
                      </td>
                      <td className={styles.td}>
                        {item.grossProfitRate != null ? (
                          <span
                            className={classnames(
                              styles.profitRate,
                              grossProfitColor && styles[`profitRate_${grossProfitColor}`]
                            )}
                          >
                            {item.grossProfitRate.toFixed(1)}
                          </span>
                        ) : (
                          <span className={styles.profitRateEmpty}>—</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        {item.operatingProfitRate != null ? (
                          <span
                            className={classnames(
                              styles.profitRate,
                              operatingProfitColor && styles[`profitRate_${operatingProfitColor}`]
                            )}
                          >
                            {item.operatingProfitRate.toFixed(1)}
                          </span>
                        ) : (
                          <span className={styles.profitRateEmpty}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredList.length === 0 && (
            <p className={styles.empty}>조건에 맞는 영업정보가 없습니다.</p>
          )}
        </section>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              이전
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={classnames(
                    styles.pageNum,
                    currentPage === page && styles.pageNumActive
                  )}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
