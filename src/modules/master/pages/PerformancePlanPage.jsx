import React, { useEffect, useMemo, useState } from 'react';
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

const TAB_ITEMS = [
  { key: 'TEAM', label: '팀 계획' },
  { key: 'PERSONAL', label: '개인 계획' },
  { key: 'UPLOAD', label: '일괄 업로드(엑셀)' },
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

function nextVersionName(versions = []) {
  const max = versions.reduce((acc, item) => {
    const matched = String(item.name || '').match(/^V(\d+)$/i);
    if (!matched) return acc;
    return Math.max(acc, Number(matched[1]));
  }, 0);
  return `V${String(max + 1).padStart(2, '0')}`;
}

function applyUploadMock(rows = [], year) {
  return rows.map((row, index) => {
    if (String(row.year) !== String(year)) return row;
    const factor = 1 + (((index % 5) + 1) * 0.01);
    const monthly = MONTH_KEYS.reduce((acc, key) => {
      acc[key] = Math.round(Number(row.monthly[key] || 0) * factor);
      return acc;
    }, {});
    const history = Array.isArray(row.history) ? [...row.history] : [];
    history.unshift({
      id: `${row.id}-u-${Date.now()}`,
      changedAt: '2026-04-07 16:20',
      changedBy: '관리자',
      summary: '엑셀 업로드 반영',
      changes: [
        { field: '버전', before: '-', after: '엑셀 반영 버전' },
        { field: '월별 계획', before: '기존 값', after: '업로드 값으로 갱신' },
      ],
    });
    return {
      ...row,
      monthly,
      status: PLAN_STATUS.DRAFT,
      note: '엑셀 업로드 반영',
      updatedAt: '2026-04-07 16:20',
      updatedBy: '관리자',
      history,
    };
  });
}

export function PerformancePlanPage() {
  const initialRows = useMemo(() => cloneRows(createPerformancePlanRows()), []);
  const [activeTab, setActiveTab] = useState('TEAM');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [versions, setVersions] = useState(() => ([
    {
      id: 'ver-1',
      name: 'V01',
      createdAt: '2026-04-01 09:00',
      createdBy: '관리자',
      reason: '초기 기준 버전',
      rows: initialRows,
    },
  ]));
  const [selectedVersionId, setSelectedVersionId] = useState('ver-1');
  const [rows, setRows] = useState(() => cloneRows(initialRows));
  const [historyRowId, setHistoryRowId] = useState('');
  const [historyDetailId, setHistoryDetailId] = useState('');

  const selectedVersion = useMemo(
    () => versions.find((item) => item.id === selectedVersionId) || versions[0],
    [selectedVersionId, versions]
  );

  useEffect(() => {
    if (!selectedVersion) return;
    setRows(cloneRows(selectedVersion.rows));
    setHistoryRowId('');
    setHistoryDetailId('');
  }, [selectedVersion]);

  const meta = useMemo(() => getPerformancePlanMeta(rows), [rows]);

  const filteredRows = useMemo(() => {
    if (activeTab === 'UPLOAD') return [];
    return filterPerformancePlanRows(rows, {
      planType: activeTab,
      year: filters.year,
      orgId: filters.orgId,
      ownerId: activeTab === 'PERSONAL' ? filters.ownerId : '',
      status: filters.status,
      keyword: filters.keyword,
    });
  }, [activeTab, filters.keyword, filters.orgId, filters.ownerId, filters.status, filters.year, rows]);

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
  }, [activeTab, filters, resetPage]);

  const selectedHistoryRow = useMemo(
    () => rows.find((row) => row.id === historyRowId) || null,
    [historyRowId, rows]
  );
  const historyItems = selectedHistoryRow?.history || [];
  const selectedHistoryDetail = historyItems.find((item) => item.id === historyDetailId) || historyItems[0] || null;

  const handleFieldChange = (rowId, monthKey, value) => {
    const num = Number(value || 0);
    setRows((prev) => prev.map((row) => (
      row.id === rowId
        ? {
          ...row,
          monthly: { ...row.monthly, [monthKey]: Number.isNaN(num) ? 0 : num },
          updatedAt: '2026-04-07 15:10',
          updatedBy: '관리자',
        }
        : row
    )));
  };

  const handleNoteChange = (rowId, value) => {
    setRows((prev) => prev.map((row) => (
      row.id === rowId
        ? { ...row, note: value, updatedAt: '2026-04-07 15:10', updatedBy: '관리자' }
        : row
    )));
  };

  const handleToggleStatus = (rowId) => {
    setRows((prev) => prev.map((row) => {
      if (row.id !== rowId) return row;
      const nextStatus = row.status === PLAN_STATUS.CONFIRMED ? PLAN_STATUS.DRAFT : PLAN_STATUS.CONFIRMED;
      return {
        ...row,
        status: nextStatus,
        updatedAt: '2026-04-07 15:10',
        updatedBy: '관리자',
      };
    }));
  };

  const handleSaveCurrentVersion = () => {
    setVersions((prev) => prev.map((version) => (
      version.id === selectedVersionId
        ? {
          ...version,
          rows: cloneRows(rows),
          createdAt: '2026-04-07 16:10',
          createdBy: '관리자',
          reason: '수정 저장',
        }
        : version
    )));
    notify.success(`${selectedVersion?.name || '현재'} 버전에 저장했습니다.`);
  };

  const handleApplyUploadAsNewVersion = () => {
    const uploadedRows = applyUploadMock(rows, filters.year);
    const newVersionName = nextVersionName(versions);
    const newVersion = {
      id: `ver-${Date.now()}`,
      name: newVersionName,
      createdAt: '2026-04-07 16:20',
      createdBy: '관리자',
      reason: `엑셀 업로드 반영 (${filters.year}년)`,
      rows: cloneRows(uploadedRows),
    };
    setVersions((prev) => [...prev, newVersion]);
    setSelectedVersionId(newVersion.id);
    setRows(cloneRows(uploadedRows));
    notify.success(`${newVersionName} 버전이 생성되었습니다.`);
  };

  const uploadRows = useMemo(() => getPlanUploadPreviewRows(), []);

  return (
    <PageShell
      path="/master/performance-plan"
      title="성과 계획 관리"
      description="팀/개인별 계획값 입력, 확정, 엑셀 업로드 버전 관리를 진행합니다."
      className={styles.shellWide}
    >
      <div className={styles.page}>
        <div className={styles.actionRow}>
          <div className={styles.versionBox}>
            <span>버전</span>
            <select value={selectedVersionId} onChange={(e) => setSelectedVersionId(e.target.value)}>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.name} · {version.createdAt}
                </option>
              ))}
            </select>
            <small>{selectedVersion?.reason || '-'}</small>
          </div>
          <Button variant="secondary" onClick={() => notify.info('전년 복사 완료(목업)')}>전년 복사</Button>
          <Button variant="secondary" onClick={() => notify.info('엑셀 양식 다운로드 준비 중입니다.')}>엑셀 양식 다운로드</Button>
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
            <Button onClick={() => notify.info('조회 조건이 적용되었습니다. (목업)')}>조회</Button>
          </div>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}><span>조회 건수</span><strong>{summary.count.toLocaleString()}건</strong></div>
          <div className={styles.summaryCard}><span>확정 건수</span><strong>{summary.confirmedCount.toLocaleString()}건</strong></div>
          <div className={styles.summaryCard}><span>작성중 건수</span><strong>{summary.draftCount.toLocaleString()}건</strong></div>
          <div className={styles.summaryCard}><span>계획 합계</span><strong>{summary.total.toLocaleString()}</strong></div>
        </div>

        <div className={styles.tabRoot}>
          {TAB_ITEMS.map((tab) => (
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

        {activeTab === 'UPLOAD' ? (
          <section className={styles.uploadSection}>
            <article className={styles.uploadCard}>
              <h3>엑셀 업로드</h3>
              <p>업로드 반영 시 현재 버전은 유지되고, 신규 버전이 생성됩니다.</p>
              <div className={styles.uploadActions}>
                <Button variant="secondary" onClick={() => notify.info('파일 선택은 목업입니다.')}>파일 선택</Button>
                <Button onClick={handleApplyUploadAsNewVersion}>검증 후 반영(신규 버전 생성)</Button>
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
                    <tr key={row.no}>
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
        ) : (
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
                            setHistoryRowId(row.id);
                            setHistoryDetailId(row.history?.[0]?.id || '');
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
              <div className={styles.helperText}>확정 상태에서는 월별/비고가 잠기며, 상태 버튼으로 확정/해제를 전환할 수 있습니다.</div>
              <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </div>
        )}
      </div>

      <Modal
        open={Boolean(historyRowId)}
        onClose={() => {
          setHistoryRowId('');
          setHistoryDetailId('');
        }}
        title="수정 이력 상세"
        size="xl"
      >
        <section className={styles.historyWrap}>
          <aside className={styles.historyList}>
            {historyItems.length ? historyItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.historyItem} ${selectedHistoryDetail?.id === item.id ? styles.historyItemActive : ''}`}
                onClick={() => setHistoryDetailId(item.id)}
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
