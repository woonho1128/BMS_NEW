import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Tabs } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { Button } from '../../../shared/components/Button/Button';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { usePagination } from '../../../shared/hooks/usePagination';
import { formatNumber } from '../../../shared/utils/formatters';
import {
  MONTH_KEYS,
  PLAN_STATUS,
  getPerformancePlanMeta,
  getPerformancePlanRows,
  getPlanHistoryByRowId,
  getPlanStatusLabel,
  getPlanUploadPreviewRows,
} from '../data/performancePlanMock';
import styles from './PerformancePlanPage.module.css';

const DEFAULT_FILTER = {
  year: '2026',
  orgId: '',
  ownerId: '',
  status: '',
  keyword: '',
};

const SUMMARY_DEPARTMENTS = [
  { orgId: 'R1', label: '리테일 1팀' },
  { orgId: 'R2', label: '리테일 2팀' },
  { orgId: 'R3', label: '리테일 3팀' },
  { orgId: 'T1', label: '타일영업팀' },
  { orgId: 'S1', label: '영업지원팀' },
];

function makeColumnLabel(monthKey) {
  const month = Number(monthKey.replace('m', ''));
  return `${month}월`;
}

function sumOf(monthly) {
  return MONTH_KEYS.reduce((sum, key) => sum + Number(monthly?.[key] || 0), 0);
}

export function PerformancePlanPage() {
  const { pathname } = useLocation();
  const meta = useMemo(() => getPerformancePlanMeta(), []);
  const [activeTab, setActiveTab] = useState('TEAM');
  const [filterValue, setFilterValue] = useState(DEFAULT_FILTER);
  const [editedRows, setEditedRows] = useState({});
  const [historyTargetId, setHistoryTargetId] = useState('');
  const [historySelectedId, setHistorySelectedId] = useState('');

  const baseRows = useMemo(
    () =>
      getPerformancePlanRows({
        planType: activeTab,
        year: filterValue.year,
        orgId: filterValue.orgId,
        ownerId: activeTab === 'PERSONAL' ? filterValue.ownerId : '',
        status: filterValue.status,
        keyword: filterValue.keyword,
      }),
    [activeTab, filterValue]
  );

  const rows = useMemo(
    () =>
      baseRows.map((row) => {
        const patch = editedRows[row.id];
        if (!patch) return row;
        return {
          ...row,
          ...patch,
          monthly: { ...row.monthly, ...(patch.monthly || {}) },
          annualTotal: sumOf({ ...row.monthly, ...(patch.monthly || {}) }),
        };
      }),
    [baseRows, editedRows]
  );

  const summaryCards = useMemo(() => {
    const map = new Map();
    rows.forEach((row) => {
      map.set(row.orgId, (map.get(row.orgId) || 0) + Number(row.annualTotal || 0));
    });
    return SUMMARY_DEPARTMENTS.map((department) => ({
      ...department,
      amount: map.get(department.orgId) || 0,
    }));
  }, [rows]);

  const pagination = usePagination(rows, { initialPageSize: 10 });
  const {
    pagedData,
    totalCount,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    resetPage,
  } = pagination;

  useEffect(() => {
    resetPage();
  }, [activeTab, filterValue, resetPage]);

  const historyRows = useMemo(() => getPlanHistoryByRowId(historyTargetId), [historyTargetId]);
  const activeHistory = useMemo(
    () => historyRows.find((row) => row.id === historySelectedId) || historyRows[0] || null,
    [historyRows, historySelectedId]
  );

  useEffect(() => {
    if (!historyRows.length) {
      setHistorySelectedId('');
      return;
    }
    if (!historyRows.some((row) => row.id === historySelectedId)) {
      setHistorySelectedId(historyRows[0].id);
    }
  }, [historyRows, historySelectedId]);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(DEFAULT_FILTER);
  }, []);

  const updateMonthlyValue = useCallback((rowId, monthKey, nextValue) => {
    const numeric = Number(String(nextValue).replace(/,/g, ''));
    setEditedRows((prev) => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        monthly: {
          ...(prev[rowId]?.monthly || {}),
          [monthKey]: Number.isNaN(numeric) ? 0 : Math.max(0, numeric),
        },
      },
    }));
  }, []);

  const updateTextValue = useCallback((rowId, field, nextValue) => {
    setEditedRows((prev) => ({
      ...prev,
      [rowId]: {
        ...(prev[rowId] || {}),
        [field]: nextValue,
      },
    }));
  }, []);

  const handleToggleConfirm = useCallback((row) => {
    const nextStatus = row.status === PLAN_STATUS.CONFIRMED ? PLAN_STATUS.DRAFT : PLAN_STATUS.CONFIRMED;
    updateTextValue(row.id, 'status', nextStatus);
  }, [updateTextValue]);

  const handleSave = useCallback(() => {
    window.alert('목업 저장이 완료되었습니다. (실제 API 연동 전)');
  }, []);

  const handleCopyPrevious = useCallback(() => {
    rows.forEach((row) => {
      MONTH_KEYS.forEach((monthKey) => {
        const baseValue = Number(row.monthly?.[monthKey] || 0);
        updateMonthlyValue(row.id, monthKey, Math.round(baseValue * 1.03));
      });
    });
    window.alert('전년 계획 기반으로 3% 증액 반영했습니다. (목업)');
  }, [rows, updateMonthlyValue]);

  const handleOpenHistory = useCallback((rowId) => {
    setHistoryTargetId(rowId);
  }, []);

  const filterFields = useMemo(
    () => [
      { id: 'year', label: '연도', type: 'select', options: meta.yearOptions, width: 110, row: 0 },
      { id: 'orgId', label: '조직', type: 'select', options: meta.orgOptions, width: 170, row: 0 },
      ...(activeTab === 'PERSONAL'
        ? [{ id: 'ownerId', label: '담당자', type: 'select', options: meta.ownerOptions, width: 190, row: 0 }]
        : []),
      { id: 'status', label: '상태', type: 'select', options: meta.statusOptions, width: 110, row: 0 },
      { id: 'keyword', label: '검색어', type: 'text', placeholder: '조직/담당자/비고', width: 220, row: 0 },
    ],
    [activeTab, meta]
  );

  const columns = useMemo(() => {
    const monthColumns = MONTH_KEYS.map((monthKey) => ({
      title: makeColumnLabel(monthKey),
      dataIndex: monthKey,
      width: 92,
      align: 'right',
      render: (_, row) => (
        <input
          type="number"
          className={styles.monthInput}
          value={Number(row.monthly?.[monthKey] || 0)}
          onChange={(event) => updateMonthlyValue(row.id, monthKey, event.target.value)}
          disabled={row.status === PLAN_STATUS.CONFIRMED}
        />
      ),
    }));

    return [
      { title: '조직', dataIndex: 'orgName', width: 130, fixed: 'left' },
      { title: '담당자', dataIndex: 'ownerName', width: 130, fixed: 'left' },
      ...monthColumns,
      {
        title: '합계',
        dataIndex: 'annualTotal',
        width: 120,
        align: 'right',
        render: (value) => <strong>{formatNumber(value)}</strong>,
      },
      {
        title: '상태',
        dataIndex: 'status',
        width: 100,
        render: (value, row) => (
          <button type="button" className={styles.statusButton} onClick={() => handleToggleConfirm(row)}>
            {getPlanStatusLabel(value)}
          </button>
        ),
      },
      {
        title: '비고',
        dataIndex: 'note',
        width: 180,
        render: (value, row) => (
          <input
            type="text"
            className={styles.noteInput}
            value={value || ''}
            placeholder="비고 입력"
            onChange={(event) => updateTextValue(row.id, 'note', event.target.value)}
            disabled={row.status === PLAN_STATUS.CONFIRMED}
          />
        ),
      },
      { title: '수정일', dataIndex: 'updatedAt', width: 150 },
      { title: '수정자', dataIndex: 'updatedBy', width: 90 },
      {
        title: '이력',
        dataIndex: 'history',
        width: 88,
        render: (_, row) => (
          <button type="button" className={styles.historyButton} onClick={() => handleOpenHistory(row.id)}>
            상세
          </button>
        ),
      },
    ];
  }, [handleOpenHistory, handleToggleConfirm, updateMonthlyValue, updateTextValue]);

  const uploadPreviewRows = useMemo(() => getPlanUploadPreviewRows(), []);

  return (
    <PageShell
      path={pathname}
      title="성과 계획 관리"
      description="팀별/개인별 계획값 입력, 확정, 엑셀 업로드를 관리합니다."
      className={styles.shellWide}
      actions={(
        <div className={styles.actionRow}>
          <Button variant="secondary" onClick={handleCopyPrevious}>전년 복사</Button>
          <Button variant="secondary">엑셀 양식 다운로드</Button>
          <Button variant="primary" onClick={handleSave}>저장</Button>
        </div>
      )}
    >
      <div className={styles.page}>
        <ListFilter
          className={styles.filterBar}
          fields={filterFields}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <section className={styles.summaryRow}>
          {summaryCards.map((card) => (
            <article key={card.orgId} className={styles.summaryCard}>
              <span>{card.label}</span>
              <strong>{formatNumber(card.amount)}</strong>
            </article>
          ))}
        </section>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.tabRoot}
          items={[
            { key: 'TEAM', label: '팀 계획' },
            { key: 'PERSONAL', label: '개인 계획' },
            { key: 'UPLOAD', label: '일괄 업로드(엑셀)' },
          ]}
        />

        {activeTab !== 'UPLOAD' ? (
          <section className={styles.tableCard}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={pagedData}
              pagination={false}
              size="small"
              bordered
              scroll={{ x: 2520, y: 520 }}
              className={styles.planTable}
            />
            <div className={styles.tableFooter}>
              <div className={styles.helperText}>
                확정 상태에서는 일반 수정이 잠기며, 상태 버튼으로 확정/확정해제를 전환할 수 있습니다.
              </div>
              <Pagination
                totalCount={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                pageSizeOptions={[10, 20, 50]}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </section>
        ) : (
          <section className={styles.uploadSection}>
            <article className={styles.uploadCard}>
              <h3>엑셀 일괄 업로드</h3>
              <p>템플릿 다운로드 후 입력한 파일을 업로드하면 팀/개인 계획을 일괄 반영할 수 있습니다.</p>
              <div className={styles.uploadActions}>
                <Button variant="secondary">템플릿 다운로드</Button>
                <Button variant="secondary">파일 선택</Button>
                <Button variant="primary">업로드 실행</Button>
              </div>
            </article>
            <article className={styles.uploadPreview}>
              <h4>업로드 미리보기</h4>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th>No.</th>
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
                  {uploadPreviewRows.map((row) => (
                    <tr key={row.no}>
                      <td>{row.no}</td>
                      <td>{row.orgName}</td>
                      <td>{row.ownerName}</td>
                      <td>{row.year}</td>
                      <td>{formatNumber(row.jan)}</td>
                      <td>{formatNumber(row.feb)}</td>
                      <td>{formatNumber(row.mar)}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>
        )}
      </div>

      <Modal
        open={Boolean(historyTargetId)}
        onClose={() => {
          setHistoryTargetId('');
          setHistorySelectedId('');
        }}
        title="변경 이력"
        size="lg"
      >
        <div className={styles.historyWrap}>
          <aside className={styles.historyList}>
            {historyRows.length === 0 ? (
              <div className={styles.historyEmpty}>이력이 없습니다.</div>
            ) : (
              historyRows.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.historyItem} ${activeHistory?.id === item.id ? styles.historyItemActive : ''}`}
                  onClick={() => setHistorySelectedId(item.id)}
                >
                  <strong>{item.changedAt}</strong>
                  <span>{item.changedBy}</span>
                </button>
              ))
            )}
          </aside>
          <section className={styles.historyDetail}>
            {activeHistory ? (
              <>
                <div className={styles.historyDetailHead}>
                  <strong>{activeHistory.summary}</strong>
                  <span>{activeHistory.changedBy}</span>
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
                    {activeHistory.changes.map((change, index) => (
                      <tr key={`${activeHistory.id}-${index}`}>
                        <td>{change.field}</td>
                        <td>{change.before}</td>
                        <td>{change.after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className={styles.historyEmpty}>선택된 이력이 없습니다.</div>
            )}
          </section>
        </div>
      </Modal>
    </PageShell>
  );
}

export default PerformancePlanPage;
