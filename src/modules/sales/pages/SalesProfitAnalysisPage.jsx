import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { MOCK_PROFIT_LIST } from '../data/profitAnalysisMock';
import { classnames } from '../../../shared/utils/classnames';
import styles from './SalesProfitAnalysisPage.module.css';

const STATUS_META = {
  draft: { label: '작성중', cls: styles.status_draft },
  inProgress: { label: '결재중', cls: styles.status_inProgress },
  approved: { label: '결재완료', cls: styles.status_approved },
  rejected: { label: '반려', cls: styles.status_rejected },
};

const STATUS_TABS = [
  { key: 'all', label: '전체' },
  { key: 'draft', label: '작성중' },
  { key: 'inProgress', label: '결재중' },
  { key: 'approved', label: '결재완료' },
  { key: 'rejected', label: '반려' },
];

export function SalesProfitAnalysisPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const counts = useMemo(() => {
    return STATUS_TABS.reduce((acc, tab) => {
      acc[tab.key] = tab.key === 'all' ? MOCK_PROFIT_LIST.length : MOCK_PROFIT_LIST.filter((item) => item.status === tab.key).length;
      return acc;
    }, {});
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PROFIT_LIST.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (q && !String(item.title || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <PageShell path={ROUTES.PROFIT} title="손익분석" description="손익분석 작성/결재 상태를 한 번에 확인합니다.">
      <div className={styles.page}>
        <div className={styles.tabsRow}>
          <div className={styles.tabs}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={classnames(styles.tab, status === tab.key && styles.tabActive)}
                onClick={() => {
                  setStatus(tab.key);
                  setPage(1);
                }}
              >
                {tab.label}
                <span className={styles.tabCount}>{counts[tab.key]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.toolbarWrap}>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="제목 검색"
          />
        </div>

        <section className={styles.listSection}>
          <div className={styles.listHeaderRow}>
            <Button variant="primary" onClick={() => navigate(ROUTES.PROFIT_NEW)}>신규 등록</Button>
          </div>
          <ul className={styles.list}>
            {paged.map((row) => {
              const meta = STATUS_META[row.status] || STATUS_META.draft;
              return (
                <li key={row.id}>
                  <button className={styles.rowCard} onClick={() => navigate(`/profit/${row.id}`)}>
                    <span className={classnames(styles.badge, meta.cls)}>{meta.label}</span>
                    <span className={styles.rowTitle}>{row.title}</span>
                    <span className={styles.rowMeta}>{row.author}</span>
                    <span className={styles.rowMeta}>{row.orderYear}년</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {paged.length === 0 && <div className={styles.empty}>조회 결과가 없습니다.</div>}

          <div className={styles.pagination}>
            <button className={styles.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>이전</button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map((n) => (
                <button key={n} className={classnames(styles.pageNum, n === safePage && styles.pageNumActive)} onClick={() => setPage(n)}>
                  {n}
                </button>
              ))}
            </div>
            <button className={styles.pageBtn} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>다음</button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
