import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter';
import {
  MOCK_REGISTRANT_OPTIONS,
  MOCK_PARTNER_OPTIONS,
  getSalesMaterialsList,
} from '../data/salesMaterialMock';
import styles from './SalesMaterialsPage.module.css';

const MATERIAL_FILTER_FIELDS = [
  { id: 'title', label: '제목', type: 'text', placeholder: '제목 검색', wide: true, row: 0 },
  { id: 'partner', label: '거래처', type: 'select', options: MOCK_PARTNER_OPTIONS, row: 0 },
  { id: 'registrant', label: '등록자', type: 'select', options: MOCK_REGISTRANT_OPTIONS, row: 0 },
  { id: 'dateRange', label: '등록일', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 1 },
];

const INITIAL_FILTER = {
  title: '',
  partner: '',
  registrant: '',
  dateFrom: '',
  dateTo: '',
};

export function SalesMaterialsPage() {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(INITIAL_FILTER);

  const list = useMemo(() => getSalesMaterialsList(filterValue), [filterValue]);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(INITIAL_FILTER);
  }, []);

  const handleRowClick = useCallback(
    (id) => {
      navigate(`/sales/material/${id}`);
    },
    [navigate]
  );

  const handleAdd = useCallback(() => {
    navigate('/sales/material/new');
  }, [navigate]);

  return (
    <PageShell
      path="/sales/material"
      title="영업자료"
      description="영업자료 조회 및 관리"
      actions={
        <Button variant="primary" onClick={handleAdd}>
          + 자료 등록
        </Button>
      }
    >
      <div className={styles.page}>
        <ListFilter
          className={styles.toolbar}
          fields={MATERIAL_FILTER_FIELDS}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <section className={styles.section} aria-label="영업자료 목록">
          <div className={styles.count}>{list.length}건</div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>제목</th>
                  <th className={styles.th}>거래처</th>
                  <th className={styles.th}>등록자</th>
                  <th className={styles.th}>등록일</th>
                  <th className={styles.thAction}>첨부</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      조건에 맞는 영업자료가 없습니다.
                    </td>
                  </tr>
                ) : (
                  list.map((material) => (
                    <tr
                      key={material.id}
                      className={styles.row}
                      onClick={() => handleRowClick(material.id)}
                    >
                      <td className={styles.td}>
                        <span className={styles.titleLink}>{material.title}</span>
                      </td>
                      <td className={styles.td}>{material.partner || '—'}</td>
                      <td className={styles.td}>{material.registrant}</td>
                      <td className={styles.td}>{material.registeredAt}</td>
                      <td className={styles.tdAction}>
                        {material.attachments && material.attachments.length > 0 ? (
                          <button
                            className={styles.downloadBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              // 실제로는 파일 다운로드 처리
                              console.log('다운로드:', material.attachments);
                            }}
                            aria-label="첨부파일 다운로드"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            <span className={styles.attachmentCount}>
                              {material.attachments.length}
                            </span>
                          </button>
                        ) : (
                          <span className={styles.noAttachment}>—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
