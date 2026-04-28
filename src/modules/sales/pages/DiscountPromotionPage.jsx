import React, { useState, useMemo, useCallback } from 'react';
import { Tabs } from 'antd';
import { useLocation } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { buildFilterFields, DEFAULT_FILTER_VALUE } from './discountPromotionPage.helpers';
import {
  buildDealerDetailRows,
  buildDiscountTabItems,
  buildMonthHeaders,
  useDiscountClientColumns,
} from './components/DiscountPromotionTabs';
import DiscountDealerDetailModal from './components/DiscountDealerDetailModal';
import DiscountPriceUploadModal from './components/DiscountPriceUploadModal';
import { useDiscountPromotionState } from './useDiscountPromotionState';
import styles from './DiscountPromotionPage.module.css';

export function DiscountPromotionPage() {
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState('1');
  const [filterValue, setFilterValue] = useState(DEFAULT_FILTER_VALUE);
  const state = useDiscountPromotionState(filterValue);

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue(DEFAULT_FILTER_VALUE);
  }, []);

  const filterFields = useMemo(() => buildFilterFields(activeTab), [activeTab]);
  const monthHeaders = useMemo(
    () => buildMonthHeaders(filterValue.discountYear, filterValue.discountMonth),
    [filterValue.discountMonth, filterValue.discountYear]
  );
  const dealerDetailRows = useMemo(
    () => buildDealerDetailRows(state.selectedDealerDetail),
    [state.selectedDealerDetail]
  );
  const clientColumns = useDiscountClientColumns(styles, state.setSelectedDealerRow);

  const tabItems = useMemo(
    () =>
      buildDiscountTabItems({
        styles,
        priceFilter: state.priceFilter,
        handlePriceFilterChange: state.handlePriceFilterChange,
        middleCategoryOptions: state.middleCategoryOptions,
        pagedPriceProducts: state.pagedPriceProducts,
        selectedPriceProduct: state.selectedPriceProduct,
        handlePriceSelectItem: state.handlePriceSelectItem,
        priceTotalCount: state.priceTotalCount,
        handleNewPriceProduct: state.handleNewPriceProduct,
        setPriceUploadModalOpen: state.setPriceUploadModalOpen,
        priceCurrentPage: state.priceCurrentPage,
        setPricePage: state.setPricePage,
        priceTotalPages: state.priceTotalPages,
        priceDraft: state.priceDraft,
        priceDraftStatus: state.priceDraftStatus,
        handleSavePriceDraft: state.handleSavePriceDraft,
        handlePriceDraftField: state.handlePriceDraftField,
        handlePriceDraftSeriesName: state.handlePriceDraftSeriesName,
        handlePriceDraftComponentField: state.handlePriceDraftComponentField,
        selectedPriceSummary: state.selectedPriceSummary,
        handleAddPriceComponent: state.handleAddPriceComponent,
        handlePriceDraftDocResetAll: state.handlePriceDraftDocResetAll,
        handlePriceDraftDocUpload: state.handlePriceDraftDocUpload,
        handlePriceDraftDocReset: state.handlePriceDraftDocReset,
        handlePriceDraftDocRemove: state.handlePriceDraftDocRemove,
        clientColumns,
        pagedClientDiscount: state.pagedClientDiscount,
        clientTotalCount: state.clientTotalCount,
        clientCurrentPage: state.clientCurrentPage,
        clientPageSize: state.clientPageSize,
        setClientPage: state.setClientPage,
        setClientPageSize: state.setClientPageSize,
      }),
    [clientColumns, state, styles]
  );

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <ListFilter
          fields={filterFields}
          value={filterValue}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <div className={styles.tabsWrap}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              state.setSelectedDealerRow(null);
              handleReset();
            }}
            items={tabItems}
            type="card"
            className={styles.tabs}
          />
        </div>
      </div>

      <DiscountDealerDetailModal
        styles={styles}
        selectedDealerRow={state.selectedDealerRow}
        selectedDealerDetail={state.selectedDealerDetail}
        monthHeaders={monthHeaders}
        dealerDetailRows={dealerDetailRows}
        onClose={() => state.setSelectedDealerRow(null)}
      />

      <DiscountPriceUploadModal
        styles={styles}
        open={state.priceUploadModalOpen}
        onClose={() => state.setPriceUploadModalOpen(false)}
        onApplyMockUpload={state.handleApplyMockUpload}
      />
    </PageShell>
  );
}

export default DiscountPromotionPage;
