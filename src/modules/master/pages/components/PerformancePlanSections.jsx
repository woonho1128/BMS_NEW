import React from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { Modal } from '../../../../shared/components/Modal/Modal';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';
import { MONTH_KEYS, PLAN_STATUS, getPlanStatusLabel } from '../../data/performancePlanMock';

export function PerformancePlanManageSection({
  styles,
  MANAGEMENT_TABS,
  activeTab,
  setActiveTab,
  pagedData,
  handleFieldChange,
  handleToggleStatus,
  handleNoteChange,
  setHistoryState,
  activeDivision,
  totalCount,
  currentPage,
  pageSize,
  setPage,
  setPageSize,
}) {
  return (
    <section className={styles.manageSection}>
      <div className={styles.sectionTitle}>관리</div>
      <div className={styles.tabRoot}>
        {MANAGEMENT_TABS.map((tab) => (
          <button key={tab.key} type="button" className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>조직</th><th>담당자</th>
                {MONTH_KEYS.map((key, idx) => <th key={key}>{idx + 1}월</th>)}
                <th>합계</th><th>상태</th><th>비고</th><th>수정일</th><th>수정자</th><th>이력</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((row) => (
                <tr key={row.id}>
                  <td>{row.orgName}</td>
                  <td>{row.ownerName}</td>
                  {MONTH_KEYS.map((key) => (
                    <td key={`${row.id}-${key}`}>
                      <input className={styles.monthInput} value={row.monthly[key]} disabled={row.status === PLAN_STATUS.CONFIRMED} onChange={(e) => handleFieldChange(row.id, key, e.target.value)} />
                    </td>
                  ))}
                  <td>{row.annualTotal.toLocaleString()}</td>
                  <td><button type="button" className={styles.statusButton} onClick={() => handleToggleStatus(row.id)}>{getPlanStatusLabel(row.status)}</button></td>
                  <td><input className={styles.noteInput} value={row.note || ''} disabled={row.status === PLAN_STATUS.CONFIRMED} onChange={(e) => handleNoteChange(row.id, e.target.value)} /></td>
                  <td>{row.updatedAt}</td>
                  <td>{row.updatedBy}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.historyButton}
                      onClick={() => {
                        setHistoryState((prev) => ({ ...prev, [activeDivision]: { rowId: row.id, detailId: row.history?.[0]?.id || '' } }));
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
          <Pagination totalCount={totalCount} currentPage={currentPage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </section>
  );
}

export function PerformancePlanUploadSection({ styles, activeDivisionLabel, handleApplyUploadAsNewVersion, uploadRows, notify }) {
  return (
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
            <thead><tr><th>No</th><th>조직</th><th>담당자</th><th>연도</th><th>1월</th><th>2월</th><th>3월</th><th>상태</th></tr></thead>
            <tbody>
              {uploadRows.map((row) => (
                <tr key={`${row.no}-${row.orgName}`}>
                  <td>{row.no}</td><td>{row.orgName}</td><td>{row.ownerName}</td><td>{row.year}</td><td>{row.jan.toLocaleString()}</td><td>{row.feb.toLocaleString()}</td><td>{row.mar.toLocaleString()}</td><td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </section>
  );
}

export function PerformancePlanHistoryModal({
  styles,
  open,
  onClose,
  activeDivisionLabel,
  historyItems,
  selectedHistoryDetail,
  setHistoryState,
  activeDivision,
}) {
  return (
    <Modal open={open} onClose={onClose} title={`${activeDivisionLabel} 수정 이력 상세`} size="xl">
      <section className={styles.historyWrap}>
        <aside className={styles.historyList}>
          {historyItems.length ? historyItems.map((item) => (
            <button key={item.id} type="button" className={`${styles.historyItem} ${selectedHistoryDetail?.id === item.id ? styles.historyItemActive : ''}`} onClick={() => setHistoryState((prev) => ({ ...prev, [activeDivision]: { ...prev[activeDivision], detailId: item.id } }))}>
              <strong>{item.summary}</strong><span>{item.changedAt}</span><span>{item.changedBy}</span>
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
                <thead><tr><th>항목</th><th>변경 전</th><th>변경 후</th></tr></thead>
                <tbody>
                  {(selectedHistoryDetail.changes || []).map((change, index) => (
                    <tr key={`${selectedHistoryDetail.id}-${index}`}><td>{change.field}</td><td>{change.before}</td><td>{change.after}</td></tr>
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
  );
}
