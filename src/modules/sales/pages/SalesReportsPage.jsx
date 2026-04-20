import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { Card, CardBody } from '../../../shared/components/Card';
import { classnames } from '../../../shared/utils/classnames';
import {
  MOCK_REPORT_LIST,
  getStatusLabel,
  MOCK_DEPTS,
  MOCK_TEAMS,
  MOCK_AUTHORS,
} from '../data/reportMock';
import styles from './SalesReportsPage.module.css';

const TAB_KEYS = { WEEKLY: 'weekly', TRIP: 'trip' };
const TAB_LABELS = { [TAB_KEYS.WEEKLY]: '주간보고', [TAB_KEYS.TRIP]: '출장보고' };
const STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'draft', label: '임시저장' },
  { value: 'submitted', label: '제출완료' },
  { value: 'confirmed', label: '확인완료' },
];

const TYPE_BADGE_CLASS = {
  [TAB_KEYS.WEEKLY]: styles.badgeWeekly,
  [TAB_KEYS.TRIP]: styles.badgeTrip,
};

const STATUS_BADGE_CLASS = {
  draft: styles.badgeDraft,
  submitted: styles.badgeSubmitted,
  confirmed: styles.badgeConfirmed,
};

export function SalesReportsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_KEYS.WEEKLY);
  const [writeDropdownOpen, setWriteDropdownOpen] = useState(false);
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [dept, setDept] = useState('');
  const [team, setTeam] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredList = useMemo(() => {
    let list = MOCK_REPORT_LIST.filter((row) => row.type === activeTab);

    if (periodFrom) {
      list = list.filter((row) => {
        const target = String(row.createdAt || row.period || '').slice(0, 10);
        return target >= periodFrom;
      });
    }

    if (periodTo) {
      list = list.filter((row) => {
        const target = String(row.createdAt || row.period || '').slice(0, 10);
        return target <= periodTo;
      });
    }

    if (dept) list = list.filter((row) => row.dept === dept);
    if (team) list = list.filter((row) => row.team === team);
    if (author) list = list.filter((row) => row.author === author);
    if (status) list = list.filter((row) => row.status === status);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (row) =>
          String(row.summary || '').toLowerCase().includes(q) ||
          String(row.author || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, periodFrom, periodTo, dept, team, author, status, search]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);

  useEffect(() => {
    const close = (event) => {
      if (!event.target.closest('[data-report-write]')) {
        setWriteDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, periodFrom, periodTo, dept, team, author, status, search]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const handleReset = useCallback(() => {
    setPeriodFrom('');
    setPeriodTo('');
    setDept('');
    setTeam('');
    setAuthor('');
    setStatus('');
    setSearch('');
    setCurrentPage(1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const headerActions = (
    <div className={styles.writeWrap} data-report-write>
      <Button
        variant="primary"
        onClick={() => setWriteDropdownOpen((prev) => !prev)}
        aria-expanded={writeDropdownOpen}
        aria-haspopup="menu"
      >
        + 보고서 작성
      </Button>
      {writeDropdownOpen && (
        <div className={styles.writeDropdown} role="menu">
          <button
            type="button"
            className={styles.writeDropdownItem}
            role="menuitem"
            onClick={() => {
              setWriteDropdownOpen(false);
              navigate('/sales/report/weekly/new');
            }}
          >
            주간보고 작성
          </button>
          <button
            type="button"
            className={styles.writeDropdownItem}
            role="menuitem"
            onClick={() => {
              setWriteDropdownOpen(false);
              navigate('/sales/report/trip/new');
            }}
          >
            출장보고 작성
          </button>
        </div>
      )}
    </div>
  );

  return (
    <PageShell
      path="/sales/report"
      title="보고관리"
      description="주간보고 / 출장보고"
      actions={headerActions}
    >
      <div className={styles.page}>
        <div className={styles.tabsRow}>
          <div className={styles.tabs} role="tablist">
            {[TAB_KEYS.WEEKLY, TAB_KEYS.TRIP].map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                className={classnames(styles.tab, activeTab === key && styles.tabActive)}
                onClick={() => setActiveTab(key)}
              >
                {TAB_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        <Card>
          <CardBody>
            <div className={styles.toolbar}>
              <div className={styles.filters}>
                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>기간</span>
                  <input
                    type="date"
                    className={styles.filterInput}
                    value={periodFrom}
                    onChange={(e) => setPeriodFrom(e.target.value)}
                    aria-label="기간 시작"
                  />
                  <span className={styles.filterLabel}>~</span>
                  <input
                    type="date"
                    className={styles.filterInput}
                    value={periodTo}
                    onChange={(e) => setPeriodTo(e.target.value)}
                    aria-label="기간 종료"
                  />
                </div>

                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>부문</span>
                  <select
                    className={styles.filterSelect}
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    aria-label="부문"
                  >
                    <option value="">전체</option>
                    {MOCK_DEPTS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>팀</span>
                  <select
                    className={styles.filterSelect}
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    aria-label="팀"
                  >
                    <option value="">전체</option>
                    {MOCK_TEAMS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>작성자</span>
                  <select
                    className={styles.filterSelect}
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    aria-label="작성자"
                  >
                    <option value="">전체</option>
                    {MOCK_AUTHORS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>상태</span>
                  <select
                    className={styles.filterSelect}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    aria-label="상태"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value || 'all'} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>검색</span>
                  <input
                    type="text"
                    className={styles.filterInput}
                    placeholder="요약, 작성자"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="검색"
                  />
                </div>

                <div className={styles.filterActions}>
                  <button type="button" className={styles.resetBtn} onClick={handleReset}>
                    초기화
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.tableSection}>
              <div className={styles.tableHeaderRow}>
                <span className={styles.tableCount}>총 {filteredList.length}건</span>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>유형</th>
                      <th className={styles.th}>기간</th>
                      <th className={styles.th}>요약</th>
                      <th className={styles.th}>작성자</th>
                      <th className={styles.th}>부문/팀</th>
                      <th className={styles.th}>상태</th>
                      <th className={styles.th}>작성일</th>
                      <th className={styles.th}>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.length === 0 ? (
                      <tr>
                        <td className={styles.empty} colSpan={8}>
                          조회 결과가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      paginatedList.map((row) => (
                        <tr
                          key={row.id}
                          className={styles.tableRow}
                          onClick={() => navigate(`/sales/report/${row.id}`)}
                        >
                          <td className={styles.td}>
                            <span
                              className={classnames(
                                styles.badge,
                                TYPE_BADGE_CLASS[row.type] || styles.badgeWeekly
                              )}
                            >
                              {TAB_LABELS[row.type] || row.type}
                            </span>
                          </td>
                          <td className={styles.td}>{row.periodLabel || row.period || '-'}</td>
                          <td className={styles.td}>{row.summary || '-'}</td>
                          <td className={styles.td}>{row.author || '-'}</td>
                          <td className={styles.td}>{`${row.dept || '-'} / ${row.team || '-'}`}</td>
                          <td className={styles.td}>
                            <span
                              className={classnames(
                                styles.badge,
                                STATUS_BADGE_CLASS[row.status] || styles.badgeDraft
                              )}
                            >
                              {getStatusLabel(row.status)}
                            </span>
                          </td>
                          <td className={styles.td}>{row.createdAt || '-'}</td>
                          <td className={styles.td}>
                            <Button
                              size="small"
                              variant="secondary"
                              className={styles.detailBtn}
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/sales/report/${row.id}`);
                              }}
                            >
                              상세
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    이전
                  </button>
                  <div className={styles.pageNumbers} aria-label="페이지 번호">
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={classnames(styles.pageBtn, page === currentPage && styles.pageBtnActive)}
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </PageShell>
  );
}

export default SalesReportsPage;
