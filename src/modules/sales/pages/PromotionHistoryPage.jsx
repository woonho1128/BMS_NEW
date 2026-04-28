import React, { useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import styles from './PromotionHistoryPage.module.css';
import PromotionHistoryDataTable from './components/PromotionHistoryDataTable';
import {
  applyColumnFilters,
  DEALER_COLUMNS,
  DEALER_DETAIL_COLUMNS,
  DEALER_ROWS,
  ITEM_COLUMNS,
  ITEM_ROWS,
  parseDate,
  ROUND_COLUMNS,
  ROUND_DETAIL_COLUMNS,
  ROUND_ROWS,
} from './promotionHistory.helpers';

const contains = (source, keyword) => String(source ?? '').toLowerCase().includes(String(keyword ?? '').toLowerCase());

export function PromotionHistoryPage() {
  const [activeTab, setActiveTab] = useState('item');
  const [searchForm, setSearchForm] = useState({ startDate: '2025-01-01', endDate: '2026-12-31', itemName: '' });
  const [query, setQuery] = useState(searchForm);

  const [itemFilters, setItemFilters] = useState({});
  const [roundFilters, setRoundFilters] = useState({});
  const [roundDetailFilters, setRoundDetailFilters] = useState({});
  const [dealerFilters, setDealerFilters] = useState({});
  const [dealerDetailFilters, setDealerDetailFilters] = useState({});

  const [selectedRoundId, setSelectedRoundId] = useState(ROUND_ROWS[0]?.id ?? '');
  const [selectedDealerId, setSelectedDealerId] = useState(DEALER_ROWS[0]?.id ?? '');

  const itemRows = useMemo(() => {
    const start = parseDate(query.startDate);
    const end = parseDate(query.endDate);
    return applyColumnFilters(
      ITEM_ROWS.filter((row) => {
        const from = parseDate(row.periodFrom);
        const to = parseDate(row.periodTo);
        const inRange = (!start || !to || to >= start) && (!end || !from || from <= end);
        return inRange && contains(row.itemCode, query.itemName);
      }),
      itemFilters,
    );
  }, [itemFilters, query]);

  const roundRows = useMemo(() => {
    const start = parseDate(query.startDate);
    const end = parseDate(query.endDate);
    return applyColumnFilters(
      ROUND_ROWS.filter((row) => {
        const from = parseDate(row.periodFrom);
        const to = parseDate(row.periodTo);
        const inRange = (!start || !to || to >= start) && (!end || !from || from <= end);
        const hasItem = !query.itemName || row.details.some((detail) => contains(detail.itemCode, query.itemName));
        return inRange && hasItem;
      }),
      roundFilters,
    );
  }, [query, roundFilters]);

  const selectedRound = useMemo(() => {
    return roundRows.find((row) => row.id === selectedRoundId) ?? roundRows[0] ?? null;
  }, [roundRows, selectedRoundId]);

  const roundDetails = useMemo(() => {
    return applyColumnFilters(selectedRound?.details ?? [], roundDetailFilters);
  }, [roundDetailFilters, selectedRound]);

  const dealerRows = useMemo(() => {
    const keyword = query.itemName;
    return applyColumnFilters(
      DEALER_ROWS.filter((row) => !keyword || row.details.some((detail) => contains(detail.itemCode, keyword))),
      dealerFilters,
    );
  }, [dealerFilters, query.itemName]);

  const selectedDealer = useMemo(() => {
    return dealerRows.find((row) => row.id === selectedDealerId) ?? dealerRows[0] ?? null;
  }, [dealerRows, selectedDealerId]);

  const dealerDetails = useMemo(() => {
    return applyColumnFilters(selectedDealer?.details ?? [], dealerDetailFilters);
  }, [dealerDetailFilters, selectedDealer]);

  const handleSearch = () => {
    setQuery(searchForm);
  };

  return (
    <PageShell path={ROUTES.SALES_PROMOTION_HISTORY} className={styles.shellWide}>
      <div className={styles.page}>
        <section className={styles.filterPanel}>
          <div className={styles.filterGrid}>
            <label className={styles.filterField}>
              <span>시작일</span>
              <input
                type="date"
                value={searchForm.startDate}
                onChange={(e) => setSearchForm((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </label>
            <label className={styles.filterField}>
              <span>종료일</span>
              <input
                type="date"
                value={searchForm.endDate}
                onChange={(e) => setSearchForm((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </label>
            <label className={`${styles.filterField} ${styles.filterFieldWide}`}>
              <span>품목명</span>
              <input
                value={searchForm.itemName}
                onChange={(e) => setSearchForm((prev) => ({ ...prev, itemName: e.target.value }))}
                placeholder="품번 또는 품목명 입력"
              />
            </label>
            <button type="button" className={styles.searchButton} onClick={handleSearch}>조회</button>
          </div>
        </section>

        <section className={styles.tabSection}>
          <div className={styles.tabButtons}>
            <button
              type="button"
              onClick={() => setActiveTab('item')}
              className={activeTab === 'item' ? styles.tabButtonActive : styles.tabButton}
            >
              품목 별
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('round')}
              className={activeTab === 'round' ? styles.tabButtonActive : styles.tabButton}
            >
              회차 별
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dealer')}
              className={activeTab === 'dealer' ? styles.tabButtonActive : styles.tabButton}
            >
              대리점 별
            </button>
          </div>

          {activeTab === 'item' && (
            <div className={styles.tabPane}>
              <h3 className={styles.sectionTitle}>품목 기준 프로모션 내역</h3>
              <PromotionHistoryDataTable
                columns={ITEM_COLUMNS}
                rows={itemRows}
                filters={itemFilters}
                onFiltersChange={setItemFilters}
                mobileTitleKey="itemCode"
                mobileFields={[
                  { key: 'periodLabel', label: '프로모션 기간' },
                  { key: 'promoType', label: '프로모션유형' },
                  { key: 'targetQty', label: '목표수량' },
                  { key: 'soldQty', label: '판매수량' },
                  { key: 'achieveRate', label: '달성률' },
                  { key: 'promoPrice', label: '프로모션가' },
                  { key: 'grossProfit', label: '매출총이익' },
                ]}
              />
            </div>
          )}

          {activeTab === 'round' && (
            <div className={styles.tabPane}>
              <h3 className={styles.sectionTitle}>회차별 프로모션 요약</h3>
              <PromotionHistoryDataTable
                columns={ROUND_COLUMNS}
                rows={roundRows}
                filters={roundFilters}
                onFiltersChange={setRoundFilters}
                selectedId={selectedRound?.id}
                onRowClick={setSelectedRoundId}
                mobileTitleKey="roundName"
                mobileFields={[
                  { key: 'status', label: '상태' },
                  { key: 'periodLabel', label: '기간' },
                  { key: 'itemCount', label: '품목수' },
                  { key: 'totalQty', label: '총수량' },
                  { key: 'totalSales', label: '총매출' },
                  { key: 'totalProfit', label: '총이익' },
                  { key: 'profitRate', label: '이익률' },
                ]}
              />

              <div className={styles.detailPanel}>
                <h4 className={styles.detailTitle}>품목 상세 (회차 클릭 시)</h4>
                <PromotionHistoryDataTable
                  columns={ROUND_DETAIL_COLUMNS}
                  rows={roundDetails}
                  filters={roundDetailFilters}
                  onFiltersChange={setRoundDetailFilters}
                  mobileTitleKey="itemCode"
                  mobileFields={[
                    { key: 'targetQty', label: '목표수량' },
                    { key: 'soldQty', label: '판매수량' },
                    { key: 'basePrice', label: '기본판매가' },
                    { key: 'promoPrice', label: '프로모션가' },
                    { key: 'salesAmount', label: '판매금액' },
                    { key: 'grossProfit', label: '매출총이익' },
                    { key: 'profitRate', label: '이익률' },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab === 'dealer' && (
            <div className={styles.tabPane}>
              <h3 className={styles.sectionTitle}>대리점 기준 프로모션 영향 분석</h3>
              <PromotionHistoryDataTable
                columns={DEALER_COLUMNS}
                rows={dealerRows}
                filters={dealerFilters}
                onFiltersChange={setDealerFilters}
                selectedId={selectedDealer?.id}
                onRowClick={setSelectedDealerId}
                mobileTitleKey="dealerName"
                mobileFields={[
                  { key: 'totalSales', label: '전체 매출' },
                  { key: 'promoSales', label: '프로모션 매출' },
                  { key: 'promoShare', label: '프로모션 비중' },
                  { key: 'promoProfit', label: '프로모션 이익' },
                  { key: 'profitRate', label: '이익률' },
                ]}
              />

              <div className={styles.detailPanel}>
                <h4 className={styles.detailTitle}>{selectedDealer?.dealerName ?? '-'} 주요 품목</h4>
                <PromotionHistoryDataTable
                  columns={DEALER_DETAIL_COLUMNS}
                  rows={dealerDetails}
                  filters={dealerDetailFilters}
                  onFiltersChange={setDealerDetailFilters}
                  mobileTitleKey="itemCode"
                  mobileFields={[
                    { key: 'qty', label: '수량' },
                    { key: 'sales', label: '매출' },
                    { key: 'salesShare', label: '판매비중' },
                    { key: 'profitRate', label: '이익률' },
                  ]}
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}

