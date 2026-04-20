import { useEffect, useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { usePagination } from '../../../shared/hooks/usePagination';
import { notify } from '../../../shared/utils/notify';
import {
  PLAN_STATUS,
  MONTH_KEYS,
  createPerformancePlanRows,
  filterPerformancePlanRows,
  getPerformancePlanMeta,
  getPlanUploadPreviewRows,
  getPlanStatusLabel,
} from '../data/performancePlanMock';
import styles from './PerformancePlanPage.module.css';

const DIVISION_ITEMS = [
  { key: 'RETAIL', label: '리테일부문' },
  { key: 'PROJECT', label: '프로젝트부문' },
];
const DIVISION_LABEL = { RETAIL: '리테일부문', PROJECT: '프로젝트부문' };

const MANAGEMENT_TABS = [
  { key: 'TEAM', label: '팀 계획' },
  { key: 'PERSONAL', label: '개인 계획' },
];

const EMPTY_FILTERS = {
  year: '2026',
  orgId: '',
  ownerId: '',
  status: '',
  keyword: '',
};

function cloneRows(rows) {
  return rows.map((row) => ({
    ...row,
    monthly: { ...row.monthly },
    history: Array.isArray(row.history) ? row.history.map((h) => ({ ...h, changes: [...(h.changes || [])] })) : [],
  }));
}

function getDivisionKey(row) {
  return String(row.orgId || '').startsWith('R') ? 'RETAIL' : 'PROJECT';
}

function splitRowsByDivision(rows) {
  const retail = [];
  const project = [];
  rows.forEach((row) => {
    if (getDivisionKey(row) === 'RETAIL') retail.push(row);
    else project.push(row);
  });
  return { RETAIL: retail, PROJECT: project };
}

function nextVersionName(versions = []) {
  const max = versions.reduce((acc, item) => {
    const matched = String(item.name || '').match(/^V(\d+)$/i);
    if (!matched) return acc;
    return Math.max(acc, Number(matched[1]));
  }, 0);
  return `V${String(max + 1).padStart(2, '0')}`;
}

function applyUploadMock(rows = [], year, division) {
  return rows.map((row, index) => {
    if (String(row.year) !== String(year)) return row;
    if (getDivisionKey(row) !== division) return row;
    const factor = 1 + (((index % 5) + 1) * 0.01);
    const monthly = MONTH_KEYS.reduce((acc, key) => {
      acc[key] = Math.round(Number(row.monthly[key] || 0) * factor);
      return acc;
    }, {});
    const history = Array.isArray(row.history) ? [...row.history] : [];
    history.unshift({
      id: `${row.id}-u-${Date.now()}`,
      changedAt: '2026-04-08 10:30',
      changedBy: '관리자',
      summary: '업로드 반영',
      changes: [
        { field: '버전', before: '-', after: '업로드 반영 버전' },
        { field: '월별 계획', before: '기존 값', after: '업로드 값 반영' },
      ],
    });
    return {
      ...row,
      monthly,
      status: PLAN_STATUS.DRAFT,
      note: '업로드 반영',
      updatedAt: '2026-04-08 10:30',
      updatedBy: '관리자',
      history,
    };
  });
}

export function PerformancePlanPage() {
  const initialRows = useMemo(() => cloneRows(createPerformancePlanRows()), []);
  const initialRowsByDivision = useMemo(() => splitRowsByDivision(initialRows), [initialRows]);

  const [activeDivision, setActiveDivision] = useState('RETAIL');
  const [activeTab, setActiveTab] = useState('TEAM');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [versionsByDivision, setVersionsByDivision] = useState(() => ({
    RETAIL: [
      {
        id: 'retail-ver-1',
        name: 'V01',
        createdAt: '2026-04-01 09:00',
        createdBy: '관리자',
        reason: '리테일부문 초기 버전',
        rows: cloneRows(initialRowsByDivision.RETAIL),
      },
    ],
    PROJECT: [
      {
        id: 'project-ver-1',
        name: 'V01',
        createdAt: '2026-04-01 09:00',
        createdBy: '관리자',
        reason: '프로젝트부문 초기 버전',
        rows: cloneRows(initialRowsByDivision.PROJECT),
      },
    ],
  }));

  const [selectedVersionIdByDivision, setSelectedVersionIdByDivision] = useState({
    RETAIL: 'retail-ver-1',
    PROJECT: 'project-ver-1',
  });

  const [rowsByDivision, setRowsByDivision] = useState(() => ({
    RETAIL: cloneRows(initialRowsByDivision.RETAIL),
    PROJECT: cloneRows(initialRowsByDivision.PROJECT),
  }));

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

        <section className={styles.manageSection}>
          <div className={styles.sectionTitle}>관리</div>
          <div className={styles.tabRoot}>
            {MANAGEMENT_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrap}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>조직</th>
                    <th>담당자</th>
                    {MONTH_KEYS.map((key, idx) => <th key={key}>{idx + 1}월</th>)}
                    <th>합계</th>
                    <th>상태</th>
                    <th>비고</th>
                    <th>수정일</th>
                    <th>수정자</th>
                    <th>이력</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.orgName}</td>
                      <td>{row.ownerName}</td>
                      {MONTH_KEYS.map((key) => (
                        <td key={`${row.id}-${key}`}>
                          <input
                            className={styles.monthInput}
                            value={row.monthly[key]}
                            disabled={row.status === PLAN_STATUS.CONFIRMED}
                            onChange={(e) => handleFieldChange(row.id, key, e.target.value)}
                          />
                        </td>
                      ))}
                      <td>{row.annualTotal.toLocaleString()}</td>
                      <td>
                        <button type="button" className={styles.statusButton} onClick={() => handleToggleStatus(row.id)}>
                          {getPlanStatusLabel(row.status)}
                        </button>
                      </td>
                      <td>
                        <input
                          className={styles.noteInput}
                          value={row.note || ''}
                          disabled={row.status === PLAN_STATUS.CONFIRMED}
                          onChange={(e) => handleNoteChange(row.id, e.target.value)}
                        />
                      </td>
                      <td>{row.updatedAt}</td>
                      <td>{row.updatedBy}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.historyButton}
                          onClick={() => {
                            setHistoryState((prev) => ({
                              ...prev,
                              [activeDivision]: { rowId: row.id, detailId: row.history?.[0]?.id || '' },
                            }));
                          }}
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.tableFooter}>
              <div className={styles.helperText}>부문별 이력은 완전히 분리되어 관리됩니다.</div>
              <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </div>
        </section>

        <section className={styles.uploadSectionWrap}>
          <div className={styles.sectionTitle}>업로드</div>
          <section className={styles.uploadSection}>
            <article className={styles.uploadCard}>
              <h3>{activeDivisionLabel} 업로드</h3>
              <p>업로드 반영 시 현재 부문의 새 버전을 생성하고 이력을 분리 저장합니다.</p>
              <div className={styles.uploadActions}>
                <Button variant="secondary" onClick={() => notify.info('파일 선택은 목업입니다.')}>파일 선택</Button>
                <Button onClick={handleApplyUploadAsNewVersion}>검증 후 반영(새 버전 생성)</Button>
              </div>
            </article>

            <article className={styles.uploadPreview}>
              <h4>업로드 미리보기</h4>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>조직</th>
                    <th>담당자</th>
                    <th>연도</th>
                    <th>1월</th>
                    <th>2월</th>
                    <th>3월</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadRows.map((row) => (
                    <tr key={`${row.no}-${row.orgName}`}>
                      <td>{row.no}</td>
                      <td>{row.orgName}</td>
                      <td>{row.ownerName}</td>
                      <td>{row.year}</td>
                      <td>{row.jan.toLocaleString()}</td>
                      <td>{row.feb.toLocaleString()}</td>
                      <td>{row.mar.toLocaleString()}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>
        </section>
      </div>

      <Modal
        open={Boolean(currentHistory.rowId)}
        onClose={() => {
          setHistoryState((prev) => ({
            ...prev,
            [activeDivision]: { rowId: '', detailId: '' },
          }));
        }}
        title={`${activeDivisionLabel} 수정 이력 상세`}
        size="xl"
      >
        <section className={styles.historyWrap}>
          <aside className={styles.historyList}>
            {historyItems.length ? historyItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.historyItem} ${selectedHistoryDetail?.id === item.id ? styles.historyItemActive : ''}`}
                onClick={() => {
                  setHistoryState((prev) => ({
                    ...prev,
                    [activeDivision]: { ...prev[activeDivision], detailId: item.id },
                  }));
                }}
              >
                <strong>{item.summary}</strong>
                <span>{item.changedAt}</span>
                <span>{item.changedBy}</span>
              </button>
            )) : <div className={styles.historyEmpty}>수정 이력이 없습니다.</div>}
          </aside>

          <article className={styles.historyDetail}>
            {selectedHistoryDetail ? (
              <>
                <div className={styles.historyDetailHead}>
                  <strong>{selectedHistoryDetail.summary}</strong>
                  <span>{selectedHistoryDetail.changedAt} · {selectedHistoryDetail.changedBy}</span>
                </div>
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>항목</th>
                      <th>변경 전</th>
                      <th>변경 후</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedHistoryDetail.changes || []).map((change, index) => (
                      <tr key={`${selectedHistoryDetail.id}-${index}`}>
                        <td>{change.field}</td>
                        <td>{change.before}</td>
                        <td>{change.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className={styles.historyEmpty}>표시할 이력 데이터가 없습니다.</div>
            )}
          </article>
        </section>
      </Modal>
    </PageShell>
  );
}

export default PerformancePlanPage;
