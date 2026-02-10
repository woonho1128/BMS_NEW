import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter';
import { classnames } from '../../../shared/utils/classnames';
import { MOCK_PROFIT_LIST } from '../data/profitAnalysisMock';
import styles from './SalesProfitAnalysisPage.module.css';

const STATUS_MAP = {
  draft: '작성중',
  inProgress: '결재중',
  approved: '결재완료',
  rejected: '반려',
};

/** profit/new 등록 건과 동일한 목록 사용 */
const MOCK_LIST = MOCK_PROFIT_LIST;

const STATUS_KEYS = [null, 'draft', 'inProgress', 'approved', 'rejected'];
const STATUS_LABELS = { null: '전체', draft: '작성중', inProgress: '결재중', approved: '결재완료', rejected: '반려' };

function getCounts(list) {
  const all = list.length;
  const draft = list.filter((i) => i.status === 'draft').length;
  const inProgress = list.filter((i) => i.status === 'inProgress').length;
  const approved = list.filter((i) => i.status === 'approved').length;
  const rejected = list.filter((i) => i.status === 'rejected').length;
  return { all, draft, inProgress, approved, rejected };
}

const YEAR_OPTIONS = [2026, 2025, 2024, 2023];
const AUTHOR_OPTIONS = ['전체', '김영업', '이팀장', '박대리', '정매니저', '최과장'];

const DEBOUNCE_MS = 300;

/** profit 필터 설정 (공통 ListFilter, 조건만 profit용) */
const PROFIT_FILTER_FIELDS = [
  { id: 'title', label: '제목', type: 'text', placeholder: '제목 검색', row: 0 },
  { id: 'orderYear', label: '수주년도', type: 'select', options: [{ value: '', label: '전체' }, ...YEAR_OPTIONS.map((y) => ({ value: String(y), label: `${y}년` }))], row: 0 },
  { id: 'deliveryYear', label: '납품예상년도', type: 'select', options: [{ value: '', label: '전체' }, ...YEAR_OPTIONS.map((y) => ({ value: String(y), label: `${y}년` }))], row: 0 },
  { id: 'author', label: '등록자', type: 'select', options: AUTHOR_OPTIONS.map((m) => ({ value: m === '전체' ? '' : m, label: m })), row: 0 },
  { id: 'mineOnly', label: '본인글보기', type: 'checkbox', row: 0 },
];

const INITIAL_PROFIT_FILTER = {
  title: '',
  orderYear: '',
  deliveryYear: '',
  author: '',
  mineOnly: false,
};

export function SalesProfitAnalysisPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState(null);
  const [filterValue, setFilterValue] = useState(INITIAL_PROFIT_FILTER);
  const [titleFilter, setTitleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const t = setTimeout(() => setTitleFilter((filterValue.title || '').trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [filterValue.title]);

  const filteredList = useMemo(() => {
    let list = [...MOCK_LIST];
    if (statusFilter != null) list = list.filter((item) => item.status === statusFilter);
    if (titleFilter) {
      const q = titleFilter.toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }
    const f = filterValue;
    if (f.orderYear) list = list.filter((item) => item.orderYear === f.orderYear);
    if (f.deliveryYear) list = list.filter((item) => item.deliveryYear === f.deliveryYear);
    if (f.author) list = list.filter((item) => item.author === f.author);
    if (f.mineOnly) list = list.filter((item) => item.author === '김영업');
    return list;
  }, [statusFilter, titleFilter, filterValue]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const tabCounts = useMemo(() => getCounts(MOCK_LIST), []);

  const handleRowClick = useCallback((id, e) => {
    if (e.target.closest('[data-action]')) return;
    navigate(`/profit/${id}`);
  }, [navigate]);

  const handleAction = useCallback((action, id, e) => {
    e.stopPropagation();
    console.log(action, id);
  }, []);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilterValue(INITIAL_PROFIT_FILTER);
    setTitleFilter('');
    setCurrentPage(1);
  }, []);

  const headerActions = (
    <>
      <Button variant="secondary" onClick={() => {}}>
        이전 손익 복사 등록
      </Button>
      <Button variant="primary" onClick={() => navigate('/profit/new')}>
        손익분석 신규 등록
      </Button>
    </>
  );

  return (
    <PageShell
      path="/profit"
      title="손익분석"
      description="손익분석 생명주기를 한눈에 관리"
      actions={headerActions}
    >
      <div className={styles.page}>
        {/* StatusTabs */}
        <div className={styles.tabsRow}>
          <div className={styles.tabs}>
            {STATUS_KEYS.map((key) => (
              <button
                key={key ?? 'all'}
                type="button"
                className={classnames(styles.tab, statusFilter === key && styles.tabActive)}
                onClick={() => {
                  setStatusFilter(key);
                  setCurrentPage(1);
                }}
              >
                <span>{STATUS_LABELS[key]}</span>
                <span className={styles.tabCount}>{tabCounts[key === null ? 'all' : key].toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 필터 (공통 ListFilter, 조건만 profit 설정) */}
        <ListFilter
          className={styles.toolbarWrap}
          fields={PROFIT_FILTER_FIELDS}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* List */}
        <section className={styles.listSection} aria-label="손익분석 목록">
          <div className={styles.listHeaderRow}>
            <span className={styles.listCount}>{filteredList.length}건</span>
          </div>
          <ul className={styles.list}>
            {paginatedList.map((item) => (
              <li key={item.id}>
                <div
                  role="button"
                  tabIndex={0}
                  className={styles.rowCard}
                  onClick={(e) => handleRowClick(item.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRowClick(item.id, e);
                    }
                  }}
                >
                  <span className={classnames(styles.badge, styles[`status_${item.status}`])}>
                    {STATUS_MAP[item.status]}
                  </span>
                  <span className={styles.rowTitle}>{item.title}</span>
                  <span className={styles.rowMeta}>
                    {item.orderYear} / {item.deliveryYear} · {item.author} · {item.createdAt}
                  </span>
                  <div className={styles.rowActions} onClick={(e) => e.stopPropagation()} data-action>
                    {item.status === 'draft' && (
                      <>
                        <Button variant="secondary" className={styles.actionBtn} onClick={(e) => handleAction('edit', item.id, e)}>수정</Button>
                        <Button variant="primary" className={styles.actionBtn} onClick={(e) => handleAction('submit', item.id, e)}>결재상신</Button>
                      </>
                    )}
                    {item.status === 'approved' && (
                      <Button variant="primary" className={styles.actionBtn} onClick={(e) => handleAction('register', item.id, e)}>영업정보 등록</Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {filteredList.length === 0 && (
            <p className={styles.empty}>조건에 맞는 손익분석이 없습니다.</p>
          )}
        </section>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button type="button" className={styles.pageBtn} disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>이전</button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={classnames(styles.pageNum, currentPage === page && styles.pageNumActive)}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button type="button" className={styles.pageBtn} disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>다음</button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
