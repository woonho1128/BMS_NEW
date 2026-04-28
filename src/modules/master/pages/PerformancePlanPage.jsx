import { useEffect, useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { usePagination } from '../../../shared/hooks/usePagination';
import { notify } from '../../../shared/utils/notify';
import {
  PLAN_STATUS,
  createPerformancePlanRows,
  filterPerformancePlanRows,
  getPerformancePlanMeta,
  getPlanUploadPreviewRows,
} from '../data/performancePlanMock';
import styles from './PerformancePlanPage.module.css';
import {
  applyUploadMock,
  cloneRows,
  createInitialRowsByDivision,
  createInitialVersionsByDivision,
  DIVISION_ITEMS,
  DIVISION_LABEL,
  EMPTY_FILTERS,
  MANAGEMENT_TABS,
  nextVersionName,
  splitRowsByDivision,
} from './performancePlanPage.helpers';
import {
  PerformancePlanHistoryModal,
  PerformancePlanManageSection,
  PerformancePlanUploadSection,
} from './components/PerformancePlanSections';

export function PerformancePlanPage() {
  const initialRows = useMemo(() => cloneRows(createPerformancePlanRows()), []);
  const initialRowsByDivision = useMemo(() => splitRowsByDivision(initialRows), [initialRows]);

  const [activeDivision, setActiveDivision] = useState('RETAIL');
  const [activeTab, setActiveTab] = useState('TEAM');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [versionsByDivision, setVersionsByDivision] = useState(
    () => createInitialVersionsByDivision(initialRowsByDivision)
  );

  const [selectedVersionIdByDivision, setSelectedVersionIdByDivision] = useState({
    RETAIL: 'retail-ver-1',
    PROJECT: 'project-ver-1',
  });

  const [rowsByDivision, setRowsByDivision] = useState(
    () => createInitialRowsByDivision(initialRowsByDivision)
  );

  const [historyState, setHistoryState] = useState({
    RETAIL: { rowId: '', detailId: '' },
    PROJECT: { rowId: '', detailId: '' },
  });

  const currentVersions = versionsByDivision[activeDivision] || [];
  const selectedVersionId = selectedVersionIdByDivision[activeDivision];
  const selectedVersion = currentVersions.find((item) => item.id === selectedVersionId) || currentVersions[0];
  const rows = useMemo(() => rowsByDivision[activeDivision] || [], [rowsByDivision, activeDivision]);
  const activeDivisionLabel = DIVISION_LABEL[activeDivision] || activeDivision;

  useEffect(() => {
    if (!selectedVersion) return;
    setRowsByDivision((prev) => ({
      ...prev,
      [activeDivision]: cloneRows(selectedVersion.rows),
    }));
    setHistoryState((prev) => ({
      ...prev,
      [activeDivision]: { rowId: '', detailId: '' },
    }));
  }, [activeDivision, selectedVersion]);

  const meta = useMemo(() => getPerformancePlanMeta(rows), [rows]);

  const filteredRows = useMemo(() => (
    filterPerformancePlanRows(rows, {
      planType: activeTab,
      year: filters.year,
      orgId: filters.orgId,
      ownerId: activeTab === 'PERSONAL' ? filters.ownerId : '',
      status: filters.status,
      keyword: filters.keyword,
    })
  ), [activeTab, filters.keyword, filters.orgId, filters.ownerId, filters.status, filters.year, rows]);

  const summary = useMemo(() => {
    const confirmedCount = filteredRows.filter((row) => row.status === PLAN_STATUS.CONFIRMED).length;
    const draftCount = filteredRows.length - confirmedCount;
    const total = filteredRows.reduce((sum, row) => sum + Number(row.annualTotal || 0), 0);
    return { count: filteredRows.length, confirmedCount, draftCount, total };
  }, [filteredRows]);

  const {
    currentPage,
    pageSize,
    totalCount,
    pagedData,
    setPage,
    setPageSize,
    resetPage,
  } = usePagination(filteredRows, { initialPageSize: 10 });

  useEffect(() => {
    resetPage();
  }, [activeDivision, activeTab, filters, resetPage]);

  const currentHistory = historyState[activeDivision] || { rowId: '', detailId: '' };
  const selectedHistoryRow = rows.find((row) => row.id === currentHistory.rowId) || null;
  const historyItems = selectedHistoryRow?.history || [];
  const selectedHistoryDetail = historyItems.find((item) => item.id === currentHistory.detailId) || historyItems[0] || null;

  const updateRowsForDivision = (updater) => {
    setRowsByDivision((prev) => {
      const current = prev[activeDivision] || [];
      const updated = updater(current);
      return { ...prev, [activeDivision]: updated };
    });
  };

  const handleFieldChange = (rowId, monthKey, value) => {
    const num = Number(value || 0);
    updateRowsForDivision((current) => current.map((row) => (
      row.id === rowId
        ? {
          ...row,
          monthly: { ...row.monthly, [monthKey]: Number.isNaN(num) ? 0 : num },
          updatedAt: '2026-04-08 09:40',
          updatedBy: '관리자',
        }
        : row
    )));
  };

  const handleNoteChange = (rowId, value) => {
    updateRowsForDivision((current) => current.map((row) => (
      row.id === rowId
        ? { ...row, note: value, updatedAt: '2026-04-08 09:40', updatedBy: '관리자' }
        : row
    )));
  };

  const handleToggleStatus = (rowId) => {
    updateRowsForDivision((current) => current.map((row) => {
      if (row.id !== rowId) return row;
      const nextStatus = row.status === PLAN_STATUS.CONFIRMED ? PLAN_STATUS.DRAFT : PLAN_STATUS.CONFIRMED;
      return {
        ...row,
        status: nextStatus,
        updatedAt: '2026-04-08 09:40',
        updatedBy: '관리자',
      };
    }));
  };

  const handleSaveCurrentVersion = () => {
    setVersionsByDivision((prev) => ({
      ...prev,
      [activeDivision]: (prev[activeDivision] || []).map((version) => (
        version.id === selectedVersionId
          ? {
            ...version,
            rows: cloneRows(rows),
            createdAt: '2026-04-08 09:50',
            createdBy: '관리자',
            reason: '수정 저장',
          }
          : version
      )),
    }));
    notify.success(`${activeDivisionLabel} 버전을 저장했습니다.`);
  };

  const handleApplyUploadAsNewVersion = () => {
    const uploadedRows = applyUploadMock(rows, filters.year, activeDivision);
    const newVersionName = nextVersionName(currentVersions);
    const newVersionId = `${activeDivision.toLowerCase()}-ver-${Date.now()}`;
    const newVersion = {
      id: newVersionId,
      name: newVersionName,
      createdAt: '2026-04-08 10:30',
      createdBy: '관리자',
      reason: `업로드 반영 (${filters.year}년)`,
      rows: cloneRows(uploadedRows),
    };

    setVersionsByDivision((prev) => ({
      ...prev,
      [activeDivision]: [...(prev[activeDivision] || []), newVersion],
    }));

    setSelectedVersionIdByDivision((prev) => ({
      ...prev,
      [activeDivision]: newVersionId,
    }));

    setRowsByDivision((prev) => ({
      ...prev,
      [activeDivision]: cloneRows(uploadedRows),
    }));

    notify.success(`${activeDivisionLabel} ${newVersionName} 버전을 생성했습니다.`);
  };

  const uploadRows = useMemo(
    () => getPlanUploadPreviewRows().filter((row) => row.division === activeDivision),
    [activeDivision]
  );

  return (
    <PageShell
      path="/master/performance-plan"
      title="성과 계획 관리"
      description="리테일/프로젝트 부문별로 업로드와 관리, 이력을 분리 운영합니다."
      className={styles.shellWide}
    >
      <div className={styles.page}>
        <div className={styles.divisionRoot}>
          {DIVISION_ITEMS.map((division) => (
            <button
              key={division.key}
              type="button"
              className={`${styles.divisionButton} ${activeDivision === division.key ? styles.divisionButtonActive : ''}`}
              onClick={() => setActiveDivision(division.key)}
            >
              {division.label}
            </button>
          ))}
        </div>

        <div className={styles.actionRow}>
          <div className={styles.versionBox}>
            <span>버전</span>
            <select
              value={selectedVersionId}
              onChange={(e) => setSelectedVersionIdByDivision((prev) => ({ ...prev, [activeDivision]: e.target.value }))}
            >
              {currentVersions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.name} · {version.createdAt}
                </option>
              ))}
            </select>
            <small>{selectedVersion?.reason || '-'}</small>
          </div>
          <Button variant="secondary" onClick={() => notify.info('전년 복사 기능은 준비 중입니다.')}>전년 복사</Button>
          <Button variant="secondary" onClick={() => notify.info('업로드 양식 다운로드 준비 중입니다.')}>업로드 양식 다운로드</Button>
          <Button onClick={handleSaveCurrentVersion}>저장</Button>
        </div>

        <div className={styles.filterPanel}>
          <label>
            <span>연도</span>
            <select value={filters.year} onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}>
              {meta.yearOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>조직</span>
            <select value={filters.orgId} onChange={(e) => setFilters((prev) => ({ ...prev, orgId: e.target.value }))}>
              {meta.orgOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>상태</span>
            <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
              {meta.statusOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>검색어</span>
            <input
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
              placeholder="조직/담당자/비고"
            />
          </label>
          <label>
            <span>담당자</span>
            <select
              value={filters.ownerId}
              onChange={(e) => setFilters((prev) => ({ ...prev, ownerId: e.target.value }))}
              disabled={activeTab !== 'PERSONAL'}
            >
              {meta.ownerOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <div className={styles.filterActions}>
            <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>초기화</Button>
            <Button onClick={() => notify.info('조회 조건을 적용했습니다. (목업)')}>조회</Button>
          </div>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}><span>조회 건수</span><strong>{summary.count.toLocaleString()}건</strong></div>
          <div className={styles.summaryCard}><span>확정 건수</span><strong>{summary.confirmedCount.toLocaleString()}건</strong></div>
          <div className={styles.summaryCard}><span>작성중 건수</span><strong>{summary.draftCount.toLocaleString()}건</strong></div>
          <div className={styles.summaryCard}><span>계획 합계</span><strong>{summary.total.toLocaleString()}</strong></div>
        </div>
        <PerformancePlanManageSection
          styles={styles}
          MANAGEMENT_TABS={MANAGEMENT_TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pagedData={pagedData}
          handleFieldChange={handleFieldChange}
          handleToggleStatus={handleToggleStatus}
          handleNoteChange={handleNoteChange}
          setHistoryState={setHistoryState}
          activeDivision={activeDivision}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />
        <PerformancePlanUploadSection
          styles={styles}
          activeDivisionLabel={activeDivisionLabel}
          handleApplyUploadAsNewVersion={handleApplyUploadAsNewVersion}
          uploadRows={uploadRows}
          notify={notify}
        />
      </div>
      <PerformancePlanHistoryModal
        styles={styles}
        open={Boolean(currentHistory.rowId)}
        onClose={() => {
          setHistoryState((prev) => ({ ...prev, [activeDivision]: { rowId: '', detailId: '' } }));
        }}
        activeDivisionLabel={activeDivisionLabel}
        historyItems={historyItems}
        selectedHistoryDetail={selectedHistoryDetail}
        setHistoryState={setHistoryState}
        activeDivision={activeDivision}
      />
    </PageShell>
  );
}

export default PerformancePlanPage;





