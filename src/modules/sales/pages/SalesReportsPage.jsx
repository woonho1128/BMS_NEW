import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { classnames } from '../../../shared/utils/classnames';
import {
  MOCK_REPORT_LIST,
} from '../data/reportMock';
import {
  filterReports,
  paginate,
  TAB_KEYS,
  TAB_LABELS,
} from './salesReports.helpers';
import {
  ReportFilters,
  ReportTableSection,
  ReportWriteAction,
} from './components/SalesReportsSections';
import styles from './SalesReportsPage.module.css';

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

  const filteredList = useMemo(
    () => filterReports(MOCK_REPORT_LIST, { activeTab, periodFrom, periodTo, dept, team, author, status, search }),
    [activeTab, periodFrom, periodTo, dept, team, author, status, search]
  );

  const paginatedList = useMemo(
    () => paginate(filteredList, currentPage, itemsPerPage),
    [filteredList, currentPage]
  );

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

  const headerActions = <ReportWriteAction writeDropdownOpen={writeDropdownOpen} setWriteDropdownOpen={setWriteDropdownOpen} navigate={navigate} />;

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
            <ReportFilters
              periodFrom={periodFrom}
              setPeriodFrom={setPeriodFrom}
              periodTo={periodTo}
              setPeriodTo={setPeriodTo}
              dept={dept}
              setDept={setDept}
              team={team}
              setTeam={setTeam}
              author={author}
              setAuthor={setAuthor}
              status={status}
              setStatus={setStatus}
              search={search}
              setSearch={setSearch}
              onReset={handleReset}
            />
            <ReportTableSection
              paginatedList={paginatedList}
              filteredCount={filteredList.length}
              navigate={navigate}
              totalPages={totalPages}
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              setCurrentPage={setCurrentPage}
            />
          </CardBody>
        </Card>
      </div>
    </PageShell>
  );
}

export default SalesReportsPage;
