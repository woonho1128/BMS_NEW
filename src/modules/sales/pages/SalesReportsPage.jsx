import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { Card, CardBody } from '../../../shared/components/Card';
import { classnames } from '../../../shared/utils/classnames';
import {
  MOCK_REPORT_LIST,
  REPORT_TYPE,
  getStatusLabel,
  getReportById,
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
    let list = MOCK_REPORT_LIST.filter((r) => r.type === activeTab);
    if (periodFrom) list = list.filter((r) => r.period >= periodFrom || (r.periodLabel && r.periodLabel >= periodFrom));
    if (periodTo) list = list.filter((r) => r.period <= periodTo || (r.periodLabel && r.periodLabel <= periodTo));
    if (dept) list = list.filter((r) => r.dept === dept);
    if (team) list = list.filter((r) => r.team === team);
    if (author) list = list.filter((r) => r.author === author);
    if (status) list = list.filter((r) => r.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => (r.summary && r.summary.toLowerCase().includes(q)) || (r.author && r.author.toLowerCase().includes(q)));
    }
    return list;
  }, [activeTab, periodFrom, periodTo, dept, team, author, status, search]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('[data-report-write]')) setWriteDropdownOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

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

  const handleRowClick = useCallback(
    (id, e) => {
      if (e.target.closest('button')) return;
      navigate(`/sales/report/${id}`);
    },
    [navigate]
  );

  const headerActions = (
    <div className={styles.writeWrap} data-report-write>
      <Button
        variant="primary"
        onClick={() => setWriteDropdownOpen((v) => !v)}
        aria-expanded={writeDropdownOpen}
        aria-haspopup="true"
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
    <PageShell path="/sales/report" title="보고관리" description="주간보고 / 출장보고" actions={headerActions}>
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
                onClick={() => {
                  setActiveTab(key);
                  setCurrentPage(1);
                }}
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
                  <select className={styles.filterSelect} value={dept} onChange={(e) => setDept(e.target.value)} aria-label="부문">
                    <option value="">전체</option>
                    {MOCK_DEPTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>팀</span>
                  <select className={styles.filterSelect} value={team} onChange={(e) => setTeam(e.target.value)} aria-label="팀">
                    <option value="">전체</option>
                    {MOCK_TEAMS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>작성자</span>
                  <select className={styles.filterSelect} value={author} onChange={(e) => setAuthor(e.target.value)} aria-label="작성자">
                    <option value="">전체</option>
                    {MOCK_AUTHORS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>상태</span>
                  <select className={styles.filterSelect} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="상태">
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value || 'all'} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterItem}>
                  <span className={styles.filterLabel}>검색</span>
                  <input
                    type="text"
                    className={styles.filterInput}
                    placeholder="핵심요약, 작성자"
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
          </CardBody>
        </Card>

        <section className={styles.tableSection} aria-label="보고 목록">
          <div className={styles.tableHeaderRow}>
            <span className={styles.tableCount}>{filteredList.length}건</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>보고유형</th>
                  <th className={styles.th}>기간</th>
                  <th className={styles.th}>핵심요약</th>
                  <th className={styles.th}>작성자</th>
                  <th className={styles.th}>상태</th>
                  <th className={styles.th} style={{ width: 80 }}>상세</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.empty}>
                      조건에 맞는 보고가 없습니다.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((row) => (
                    <tr
                      key={row.id}
                      className={styles.tableRow}
                      onClick={(e) => handleRowClick(row.id, e)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRowClick(row.id, e)}
                    >
                      <td className={styles.td}>
                        <span className={classnames(styles.badge, row.type === REPORT_TYPE.WEEKLY ? styles.badgeWeekly : styles.badgeTrip)}>
                          {row.type === REPORT_TYPE.WEEKLY ? '주간보고' : '출장보고'}
                        </span>
                      </td>
                      <td className={styles.td}>{row.periodLabel || row.period}</td>
                      <td className={styles.td} style={{ maxWidth: 320 }}>{row.summary || '—'}</td>
                      <td className={styles.td}>{row.author}</td>
                      <td className={styles.td}>
                        <span className={classnames(styles.badge, styles[`badge${row.status.charAt(0).toUpperCase() + row.status.slice(1)}`])}>
                          {getStatusLabel(row.status)}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <Button variant="secondary" className={styles.detailBtn} onClick={(e) => { e.stopPropagation(); navigate(`/sales/report/${row.id}`); }}>
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
              <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>이전</button>
              <span>{currentPage} / {totalPages}</span>
              <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>다음</button>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
