import React from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { classnames } from '../../../../shared/utils/classnames';
import { getStatusLabel, MOCK_AUTHORS, MOCK_DEPTS, MOCK_TEAMS } from '../../data/reportMock';
import { STATUS_OPTIONS, TAB_KEYS, TAB_LABELS } from '../salesReports.helpers';
import styles from '../SalesReportsPage.module.css';

const TYPE_BADGE_CLASS = {
  [TAB_KEYS.WEEKLY]: styles.badgeWeekly,
  [TAB_KEYS.TRIP]: styles.badgeTrip,
};

const STATUS_BADGE_CLASS = {
  draft: styles.badgeDraft,
  submitted: styles.badgeSubmitted,
  confirmed: styles.badgeConfirmed,
};

export function ReportWriteAction({ writeDropdownOpen, setWriteDropdownOpen, navigate }) {
  return (
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
}

export function ReportFilters({
  periodFrom,
  setPeriodFrom,
  periodTo,
  setPeriodTo,
  dept,
  setDept,
  team,
  setTeam,
  author,
  setAuthor,
  status,
  setStatus,
  search,
  setSearch,
  onReset,
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>기간</span>
          <input type="date" className={styles.filterInput} value={periodFrom} onChange={(e) => setPeriodFrom(e.target.value)} aria-label="기간 시작" />
          <span className={styles.filterLabel}>~</span>
          <input type="date" className={styles.filterInput} value={periodTo} onChange={(e) => setPeriodTo(e.target.value)} aria-label="기간 종료" />
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>부문</span>
          <select className={styles.filterSelect} value={dept} onChange={(e) => setDept(e.target.value)} aria-label="부문">
            <option value="">전체</option>
            {MOCK_DEPTS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>팀</span>
          <select className={styles.filterSelect} value={team} onChange={(e) => setTeam(e.target.value)} aria-label="팀">
            <option value="">전체</option>
            {MOCK_TEAMS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>작성자</span>
          <select className={styles.filterSelect} value={author} onChange={(e) => setAuthor(e.target.value)} aria-label="작성자">
            <option value="">전체</option>
            {MOCK_AUTHORS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>상태</span>
          <select className={styles.filterSelect} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="상태">
            {STATUS_OPTIONS.map((option) => <option key={option.value || 'all'} value={option.value}>{option.label}</option>)}
          </select>
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>검색</span>
          <input type="text" className={styles.filterInput} placeholder="요약, 작성자" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="검색" />
        </div>

        <div className={styles.filterActions}>
          <button type="button" className={styles.resetBtn} onClick={onReset}>초기화</button>
        </div>
      </div>
    </div>
  );
}

export function ReportTableSection({ paginatedList, filteredCount, navigate, totalPages, currentPage, pageNumbers, handlePrevPage, handleNextPage, setCurrentPage }) {
  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeaderRow}>
        <span className={styles.tableCount}>총 {filteredCount}건</span>
      </div>
      <div className={`${styles.tableWrap} ${styles.desktopTableWrap}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>유형</th><th className={styles.th}>기간</th><th className={styles.th}>요약</th><th className={styles.th}>작성자</th><th className={styles.th}>부문/팀</th><th className={styles.th}>상태</th><th className={styles.th}>작성일</th><th className={styles.th}>액션</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length === 0 ? (
              <tr><td className={styles.empty} colSpan={8}>조회 결과가 없습니다.</td></tr>
            ) : (
              paginatedList.map((row) => (
                <tr key={row.id} className={styles.tableRow} onClick={() => navigate(`/sales/report/${row.id}`)}>
                  <td className={styles.td}><span className={classnames(styles.badge, TYPE_BADGE_CLASS[row.type] || styles.badgeWeekly)}>{TAB_LABELS[row.type] || row.type}</span></td>
                  <td className={styles.td}>{row.periodLabel || row.period || '-'}</td>
                  <td className={styles.td}>{row.summary || '-'}</td>
                  <td className={styles.td}>{row.author || '-'}</td>
                  <td className={styles.td}>{`${row.dept || '-'} / ${row.team || '-'}`}</td>
                  <td className={styles.td}><span className={classnames(styles.badge, STATUS_BADGE_CLASS[row.status] || styles.badgeDraft)}>{getStatusLabel(row.status)}</span></td>
                  <td className={styles.td}>{row.createdAt || '-'}</td>
                  <td className={styles.td}><Button size="small" variant="secondary" className={styles.detailBtn} onClick={(event) => { event.stopPropagation(); navigate(`/sales/report/${row.id}`); }}>상세</Button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileList}>
        {paginatedList.length === 0 ? (
          <div className={styles.mobileEmpty}>조회 결과가 없습니다.</div>
        ) : (
          paginatedList.map((row) => (
            <article key={`mobile-${row.id}`} className={styles.mobileCard} onClick={() => navigate(`/sales/report/${row.id}`)}>
              <div className={styles.mobileHead}>
                <span className={classnames(styles.badge, TYPE_BADGE_CLASS[row.type] || styles.badgeWeekly)}>{TAB_LABELS[row.type] || row.type}</span>
                <span className={classnames(styles.badge, STATUS_BADGE_CLASS[row.status] || styles.badgeDraft)}>{getStatusLabel(row.status)}</span>
              </div>
              <div className={styles.mobileSummary}>{row.summary || '-'}</div>
              <div className={styles.mobileMetaGrid}>
                <div className={styles.mobileMetaItem}><span>기간</span><strong>{row.periodLabel || row.period || '-'}</strong></div>
                <div className={styles.mobileMetaItem}><span>작성자</span><strong>{row.author || '-'}</strong></div>
                <div className={styles.mobileMetaItem}><span>부문/팀</span><strong>{`${row.dept || '-'} / ${row.team || '-'}`}</strong></div>
                <div className={styles.mobileMetaItem}><span>작성일</span><strong>{row.createdAt || '-'}</strong></div>
              </div>
              <div className={styles.mobileActionRow}><Button size="small" variant="secondary" className={styles.detailBtn} onClick={(event) => { event.stopPropagation(); navigate(`/sales/report/${row.id}`); }}>상세</Button></div>
            </article>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button type="button" className={styles.pageBtn} onClick={handlePrevPage} disabled={currentPage === 1}>이전</button>
          <div className={styles.pageNumbers} aria-label="페이지 번호">
            {pageNumbers.map((page) => (
              <button key={page} type="button" className={classnames(styles.pageBtn, page === currentPage && styles.pageBtnActive)} onClick={() => setCurrentPage(page)} aria-current={page === currentPage ? 'page' : undefined}>{page}</button>
            ))}
          </div>
          <button type="button" className={styles.pageBtn} onClick={handleNextPage} disabled={currentPage === totalPages}>다음</button>
        </div>
      )}
    </div>
  );
}
