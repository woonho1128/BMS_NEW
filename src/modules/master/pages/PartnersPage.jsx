import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter';
import { classnames } from '../../../shared/utils/classnames';
import {
  MOCK_MANAGER_OPTIONS,
  MOCK_REGION_OPTIONS,
  MOCK_STATUS_OPTIONS,
  getPartnersList,
} from '../data/partnersMock';
import styles from './PartnersPage.module.css';

const PARTNER_FILTER_FIELDS = [
  { id: 'manager', label: '담당자', type: 'select', options: MOCK_MANAGER_OPTIONS, row: 0 },
  { id: 'name', label: '상호', type: 'text', placeholder: '상호 검색', wide: true, row: 0 },
  { id: 'region', label: '지역', type: 'select', options: MOCK_REGION_OPTIONS, row: 0 },
  { id: 'status', label: '거래상태', type: 'select', options: MOCK_STATUS_OPTIONS, row: 0 },
];

const INITIAL_FILTER = {
  manager: '',
  name: '',
  region: '',
  status: '',
};

const STATUS_LABEL = { active: '거래중', inactive: '거래중단', pending: '검토중' };

export function PartnersPage() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);

  const list = useMemo(() => getPartnersList(filterValue), [filterValue]);

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

  return (
    <PageShell
      path="/master/partners"
      title="대리점 관리"
      description="대리점 목록 조회 및 관리카드"
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
              <p className={styles.empty}>조건에 맞는 대리점이 없습니다.</p>
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
    </PageShell>
  );
}
