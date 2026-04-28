import React, { useMemo } from 'react';
import DiscountPriceManageTab from './DiscountPriceManageTab';
import DiscountClientRateTab from './DiscountClientRateTab';
import { formatNum } from '../discountPromotion.constants';

export function useDiscountClientColumns(styles, onSelectDealer) {
  return useMemo(
    () => [
      {
        title: '대리점',
        dataIndex: 'dealerName',
        width: 200,
        render: (value, row) => (
          <button type="button" className={styles.dealerLink} onClick={() => onSelectDealer(row)}>
            {value}
          </button>
        ),
      },
      { title: '담당자', dataIndex: 'managerName', width: 90, align: 'center' },
      { title: '3개월 평균', dataIndex: 'avg3Month', width: 120, align: 'right', render: formatNum },
      { title: '전월', dataIndex: 'prevMonth', width: 120, align: 'right', render: formatNum },
      { title: '2개월전', dataIndex: 'twoMonthsAgo', width: 120, align: 'right', render: formatNum },
      { title: '3개월전', dataIndex: 'threeMonthsAgo', width: 120, align: 'right', render: formatNum },
      { title: '현재 할인율', dataIndex: 'currentDiscountRate', width: 110, align: 'right', render: (v) => `${v.toFixed(2)}%` },
      { title: '다음 매출구간까지 필요 금액', dataIndex: 'remainingToNextTier', width: 180, align: 'right', render: formatNum },
      { title: '다음 구간 할인율', dataIndex: 'nextTierDiscountRate', width: 130, align: 'right', render: (v) => `${v.toFixed(2)}%` },
    ],
    [onSelectDealer, styles.dealerLink]
  );
}

export function buildDealerDetailRows(selectedDealerDetail) {
  if (!selectedDealerDetail) return [];
  return [
    {
      key: 'total',
      label: '총 매출',
      m1: selectedDealerDetail.monthlyTotalSales[0],
      m2: selectedDealerDetail.monthlyTotalSales[1],
      m3: selectedDealerDetail.monthlyTotalSales[2],
      sum: selectedDealerDetail.totalSalesSum,
    },
    {
      key: 'excluded',
      label: '매출구간 제외',
      m1: selectedDealerDetail.excludedSales[0],
      m2: selectedDealerDetail.excludedSales[1],
      m3: selectedDealerDetail.excludedSales[2],
      sum: selectedDealerDetail.excludedSum,
    },
    {
      key: 'included',
      label: '매출구간 포함',
      m1: selectedDealerDetail.includedSales[0],
      m2: selectedDealerDetail.includedSales[1],
      m3: selectedDealerDetail.includedSales[2],
      sum: selectedDealerDetail.includedSum,
    },
  ];
}

export function buildMonthHeaders(discountYear, discountMonth) {
  const month = Number(discountMonth) || 1;
  const year = Number(discountYear) || 2026;
  const m1 = ((month + 9) % 12) + 1;
  const m2 = ((month + 10) % 12) + 1;
  const m3 = ((month + 11) % 12) + 1;
  const y1 = month <= 2 ? year - 1 : year;
  const y2 = month <= 1 ? year - 1 : year;
  const y3 = year;
  return [
    `${String(y1).slice(2)}.${String(m1).padStart(2, '0')}월`,
    `${String(y2).slice(2)}.${String(m2).padStart(2, '0')}월`,
    `${String(y3).slice(2)}.${String(m3).padStart(2, '0')}월`,
  ];
}

export function buildDiscountTabItems(props) {
  const {
    styles,
    priceFilter,
    handlePriceFilterChange,
    middleCategoryOptions,
    pagedPriceProducts,
    selectedPriceProduct,
    handlePriceSelectItem,
    priceTotalCount,
    handleNewPriceProduct,
    setPriceUploadModalOpen,
    priceCurrentPage,
    setPricePage,
    priceTotalPages,
    priceDraft,
    priceDraftStatus,
    handleSavePriceDraft,
    handlePriceDraftField,
    handlePriceDraftSeriesName,
    handlePriceDraftComponentField,
    selectedPriceSummary,
    handleAddPriceComponent,
    handlePriceDraftDocResetAll,
    handlePriceDraftDocUpload,
    handlePriceDraftDocReset,
    handlePriceDraftDocRemove,
    clientColumns,
    pagedClientDiscount,
    clientTotalCount,
    clientCurrentPage,
    clientPageSize,
    setClientPage,
    setClientPageSize,
  } = props;

  return [
    {
      key: '1',
      label: '판매단가 관리',
      children: (
        <DiscountPriceManageTab
          styles={styles}
          priceFilter={priceFilter}
          handlePriceFilterChange={handlePriceFilterChange}
          middleCategoryOptions={middleCategoryOptions}
          pagedPriceProducts={pagedPriceProducts}
          selectedPriceProduct={selectedPriceProduct}
          handlePriceSelectItem={handlePriceSelectItem}
          priceTotalCount={priceTotalCount}
          handleNewPriceProduct={handleNewPriceProduct}
          setPriceUploadModalOpen={setPriceUploadModalOpen}
          priceCurrentPage={priceCurrentPage}
          setPricePage={setPricePage}
          priceTotalPages={priceTotalPages}
          priceDraft={priceDraft}
          priceDraftStatus={priceDraftStatus}
          handleSavePriceDraft={handleSavePriceDraft}
          handlePriceDraftField={handlePriceDraftField}
          handlePriceDraftSeriesName={handlePriceDraftSeriesName}
          handlePriceDraftComponentField={handlePriceDraftComponentField}
          selectedPriceSummary={selectedPriceSummary}
          handleAddPriceComponent={handleAddPriceComponent}
          handlePriceDraftDocResetAll={handlePriceDraftDocResetAll}
          handlePriceDraftDocUpload={handlePriceDraftDocUpload}
          handlePriceDraftDocReset={handlePriceDraftDocReset}
          handlePriceDraftDocRemove={handlePriceDraftDocRemove}
        />
      ),
    },
    {
      key: '2',
      label: '거래처별 할인율',
      children: (
        <DiscountClientRateTab
          styles={styles}
          clientColumns={clientColumns}
          pagedClientDiscount={pagedClientDiscount}
          clientTotalCount={clientTotalCount}
          clientCurrentPage={clientCurrentPage}
          clientPageSize={clientPageSize}
          setClientPage={setClientPage}
          setClientPageSize={setClientPageSize}
        />
      ),
    },
  ];
}
