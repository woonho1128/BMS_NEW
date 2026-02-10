import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter';
import { Card, CardBody } from '../../../shared/components/Card';
import { classnames } from '../../../shared/utils/classnames';
import {
  MOCK_MANAGER_OPTIONS,
  MOCK_DEPARTMENT_OPTIONS,
  getBusinessCardsList,
  getInitials,
} from '../data/businessCardMock';
import styles from './BusinessCardPage.module.css';

const CARD_FILTER_FIELDS = [
  { id: 'company', label: '회사명', type: 'text', placeholder: '회사명 검색', wide: true, row: 0 },
  { id: 'name', label: '이름', type: 'text', placeholder: '이름 검색', row: 0 },
  { id: 'department', label: '부서', type: 'select', options: MOCK_DEPARTMENT_OPTIONS, row: 0 },
  { id: 'manager', label: '담당자', type: 'select', options: MOCK_MANAGER_OPTIONS, row: 0 },
  { id: 'dateRange', label: '등록일', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 1 },
  { id: 'myCardsOnly', label: '본인 담당', type: 'checkbox', row: 1 },
];

const INITIAL_FILTER = {
  company: '',
  name: '',
  department: '',
  manager: '',
  dateFrom: '',
  dateTo: '',
  myCardsOnly: false,
};

export function BusinessCardPage() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);

  const list = useMemo(() => getBusinessCardsList(filterValue), [filterValue]);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(INITIAL_FILTER);
  }, []);

  const handleCardClick = useCallback(
    (id) => {
      navigate(`/sales/card/${id}`);
    },
    [navigate]
  );

  const handleAdd = useCallback(() => {
    navigate('/sales/card/new');
  }, [navigate]);

  return (
    <PageShell
      path="/sales/card"
      title="명함관리"
      description="명함 목록 조회 및 관리"
      actions={
        <Button variant="primary" onClick={handleAdd}>
          + 명함 등록
        </Button>
      }
    >
      <div className={styles.page}>
        <ListFilter
          className={styles.toolbar}
          fields={CARD_FILTER_FIELDS}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <section className={styles.section} aria-label="명함 목록">
          <div className={styles.count}>{list.length}건</div>
          <div className={styles.cardGrid}>
            {list.length === 0 ? (
              <p className={styles.empty}>조건에 맞는 명함이 없습니다.</p>
            ) : (
              list.map((card) => (
                <Card
                  key={card.id}
                  className={styles.card}
                  hoverable
                  clickable
                  onClick={() => handleCardClick(card.id)}
                >
                  <CardBody className={styles.cardBody}>
                    <div className={styles.cardHeader}>
                      {card.imageFront ? (
                        <div className={styles.cardImage}>
                          <img src={card.imageFront} alt={`${card.name} 명함`} />
                        </div>
                      ) : (
                        <div className={styles.cardAvatar}>
                          <span>{getInitials(card.name)}</span>
                        </div>
                      )}
                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardCompany}>{card.company}</h3>
                        <p className={styles.cardName}>
                          {card.name} / {card.title}
                        </p>
                      </div>
                    </div>
                    <div className={styles.cardDetails}>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>부서</span>
                        <span className={styles.cardValue}>{card.department}</span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>연락처</span>
                        <span className={styles.cardValue}>
                          {card.phone}
                          {card.email && (
                            <>
                              <br />
                              {card.email}
                            </>
                          )}
                        </span>
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>담당자</span>
                        <span className={styles.cardValue}>{card.manager}</span>
                      </div>
                    </div>
                    <div className={styles.cardFooter}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(card.id);
                        }}
                      >
                        상세보기
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
