import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { Modal } from '../../../shared/components/Modal/Modal';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { classnames } from '../../../shared/utils/classnames';
import {
  MOCK_DIVISION_OPTIONS,
  MOCK_MANAGER_OPTIONS,
  MOCK_REGION_OPTIONS,
  MOCK_STATUS_OPTIONS,
  getPartnerEditHistoryById,
  getPartnersList,
} from '../data/partnersMock';
import styles from './PartnersPage.module.css';

const PARTNER_FILTER_FIELDS = [
  { id: 'division', label: '부문', type: 'select', options: MOCK_DIVISION_OPTIONS, row: 0 },
  { id: 'manager', label: '담당자', type: 'select', options: MOCK_MANAGER_OPTIONS, row: 0 },
  { id: 'name', label: '상호', type: 'text', placeholder: '상호 검색', wide: true, row: 0 },
  { id: 'region', label: '지역', type: 'select', options: MOCK_REGION_OPTIONS, row: 0 },
  { id: 'status', label: '거래상태', type: 'select', options: MOCK_STATUS_OPTIONS, row: 0 },
];

const INITIAL_FILTER = {
  division: '',
  manager: '',
  name: '',
  region: '',
  status: '',
};

const STATUS_LABEL = { active: '거래중', inactive: '거래중단', pending: '검토요청' };
const DIVISION_LABEL = { project: '프로젝트부문', retail: '리테일부문' };

export function PartnersPage() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState('');

  const list = useMemo(() => getPartnersList(filterValue), [filterValue]);
  const selectedHistoryRows = useMemo(
    () => (selectedPartner ? getPartnerEditHistoryById(selectedPartner.id) : []),
    [selectedPartner]
  );
  const selectedHistoryRow = useMemo(
    () => selectedHistoryRows.find((row) => row.id === selectedHistoryId) || selectedHistoryRows[0] || null,
    [selectedHistoryId, selectedHistoryRows]
  );

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(INITIAL_FILTER);
  }, []);

  const handleCardClick = useCallback(
    (id) => {
      navigate(`/master/partners/${id}`);
    },
    [navigate]
  );

  const handleAdd = useCallback(() => {
    navigate('/master/partners/new');
  }, [navigate]);

  const handleOpenHistory = useCallback((event, item) => {
    event.stopPropagation();
    const rows = getPartnerEditHistoryById(item.id);
    setSelectedPartner(item);
    setSelectedHistoryId(rows[0]?.id || '');
    setHistoryModalOpen(true);
  }, []);

  useEffect(() => {
    if (!historyModalOpen) return;
    if (!selectedHistoryRows.length) {
      setSelectedHistoryId('');
      return;
    }
    if (!selectedHistoryRows.some((row) => row.id === selectedHistoryId)) {
      setSelectedHistoryId(selectedHistoryRows[0].id);
    }
  }, [historyModalOpen, selectedHistoryId, selectedHistoryRows]);

  return (
    <PageShell
      path="/master/partners"
      title="대리점 관리"
      description="부문별 목록 조회 및 관리"
      actions={
        <Button variant="primary" onClick={handleAdd}>
          + 등록
        </Button>
      }
    >
      <div className={styles.page}>
        <ListFilter
          className={styles.toolbar}
          fields={PARTNER_FILTER_FIELDS}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <section className={styles.section} aria-label="대리점 목록">
          <div className={styles.count}>{list.length}건</div>
          <div className={styles.cardGrid}>
            {list.length === 0 ? (
              <p className={styles.empty}>조건에 맞는 데이터가 없습니다.</p>
            ) : (
              list.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className={classnames(styles.card, styles.cardClickable)}
                  onClick={() => handleCardClick(item.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCardClick(item.id)}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>{item.name}</span>
                    <button
                      type="button"
                      className={styles.historyButton}
                      onClick={(event) => handleOpenHistory(event, item)}
                    >
                      수정 이력
                    </button>
                    <span
                      className={classnames(
                        styles.badge,
                        item.status === 'active' && styles.badgeActive,
                        item.status === 'inactive' && styles.badgeInactive,
                        item.status === 'pending' && styles.badgePending
                      )}
                    >
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>부문</span>
                      <span className={styles.cardValue}>{DIVISION_LABEL[item.division] || '-'}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>담당자</span>
                      <span className={styles.cardValue}>{item.manager}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>지역</span>
                      <span className={styles.cardValue}>{item.region}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <Modal
        open={historyModalOpen}
        onClose={() => {
          setHistoryModalOpen(false);
          setSelectedHistoryId('');
        }}
        title={`${selectedPartner?.name || '대리점'} 수정 이력`}
        size="lg"
      >
        <div className={styles.historyBody}>
          <div className={styles.historySummary}>총 {selectedHistoryRows.length}건</div>
          {selectedHistoryRows.length === 0 ? (
            <div className={styles.historyEmpty}>등록된 수정 이력이 없습니다.</div>
          ) : (
            <div className={styles.historySplit}>
              <aside className={styles.historyDateList}>
                {selectedHistoryRows.map((history) => (
                  <button
                    key={history.id}
                    type="button"
                    className={classnames(
                      styles.historyDateButton,
                      selectedHistoryRow?.id === history.id && styles.historyDateButtonActive
                    )}
                    onClick={() => setSelectedHistoryId(history.id)}
                  >
                    <strong>{history.changedAt}</strong>
                    <span>{history.changedBy}</span>
                  </button>
                ))}
              </aside>
              <section className={styles.historyDetail}>
                {selectedHistoryRow && (
                  <article key={selectedHistoryRow.id} className={styles.historyItem}>
                    <div className={styles.historyHead}>
                      <strong>{selectedHistoryRow.changedAt}</strong>
                      <span>{selectedHistoryRow.changedBy}</span>
                    </div>
                    <p className={styles.historyReason}>{selectedHistoryRow.reason}</p>
                    <table className={styles.historyTable}>
                      <thead>
                        <tr>
                          <th>항목</th>
                          <th>변경 전</th>
                          <th>변경 후</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedHistoryRow.changes.map((change, index) => (
                          <tr key={`${selectedHistoryRow.id}-${index}`}>
                            <td>{change.field}</td>
                            <td>{change.before}</td>
                            <td className={styles.historyAfter}>{change.after}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </article>
                )}
              </section>
            </div>
          )}
        </div>
      </Modal>
    </PageShell>
  );
}

export default PartnersPage;
