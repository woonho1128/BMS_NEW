export function buildSalesCategoryOptions(salesByYearRows) {
  const options = [{ key: 'total', label: '총 매출' }];
  const keys = new Set();
  salesByYearRows.forEach((row) => {
    Object.keys(row.categories || {}).forEach((key) => {
      if (!key || keys.has(key)) return;
      keys.add(key);
      options.push({ key, label: key });
    });
  });
  return options;
}

export function buildVisibleSalesSeries(salesCategoryOptions, salesChartMode, selectedSalesCategory, colors) {
  const categoryMap = salesCategoryOptions.reduce((acc, category, index) => {
    acc[category.key] = {
      ...category,
      color: colors[index % colors.length],
    };
    return acc;
  }, {});
  if (salesChartMode === 'compare') {
    return salesCategoryOptions.map((category) => categoryMap[category.key]);
  }
  return categoryMap[selectedSalesCategory] ? [categoryMap[selectedSalesCategory]] : [categoryMap.total];
}

export function buildSalesChartData(salesByYearRows) {
  return salesByYearRows.map((row) => {
    const categories = row.categories || {};
    return {
      year: Number(row.year),
      total: Number(row.amount || 0),
      ...Object.keys(categories).reduce((acc, key) => {
        acc[key] = Number(categories[key] || 0);
        return acc;
      }, {}),
    };
  });
}

export function buildSalesChartModel(salesChartData, visibleSalesSeries) {
  const chartWidth = 760;
  const chartHeight = 280;
  const padding = { top: 24, right: 24, bottom: 40, left: 74 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const maxValue = salesChartData.reduce((max, row) => {
    return Math.max(max, ...visibleSalesSeries.map((series) => Number(row[series.key] || 0)));
  }, 0);
  const roundedMax = maxValue > 0 ? Math.ceil(maxValue / 100000000) * 100000000 : 100000000;
  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const ratio = index / 4;
    return {
      value: Math.round(roundedMax * (1 - ratio)),
      y: padding.top + plotHeight * ratio,
    };
  });
  const series = visibleSalesSeries.map((item) => {
    const points = salesChartData.map((row, index) => {
      const x =
        salesChartData.length === 1
          ? padding.left + plotWidth / 2
          : padding.left + (plotWidth * index) / (salesChartData.length - 1);
      const value = Number(row[item.key] || 0);
      const y = padding.top + (plotHeight * (roundedMax - value)) / roundedMax;
      return { x, y, value, year: row.year };
    });
    return {
      ...item,
      points,
      polyline: points.map((point) => `${point.x},${point.y}`).join(' '),
    };
  });
  return { chartWidth, chartHeight, yTicks, series };
}

export function buildStaffByYearRows(selectedPartnerDetail) {
  const source = selectedPartnerDetail?.staffByYear || {};
  return Object.entries(source)
    .map(([year, info]) => ({
      year: Number(year),
      name: info?.name || '-',
      status: info?.isActive ? '유지' : '변경',
    }))
    .sort((a, b) => b.year - a.year)
    .slice(0, 4);
}

export function buildOutstandingTabRows(receivableRows, selectedPartnerDetail) {
  return (receivableRows || []).map((row, index) => {
    const sales = Number(row.salesThisMonth || 0);
    const deposit = Number(row.depositThisMonth || 0);
    return [
      selectedPartnerDetail?.basic?.partnerCode || '-',
      selectedPartnerDetail?.name || '-',
      `BN-${String(index + 1).padStart(4, '0')}`,
      sales,
      deposit,
      Math.max(0, sales - deposit),
    ];
  });
}

export function buildFinanceCumulative(financePreview, outstandingTabRows) {
  const receivableTradeLimit = (financePreview.receivableRows || []).reduce((sum, row) => sum + Number(row.tradeLimit || 0), 0);
  const receivableSales = (financePreview.receivableRows || []).reduce((sum, row) => sum + Number(row.salesThisMonth || 0), 0);
  const receivableDeposit = (financePreview.receivableRows || []).reduce((sum, row) => sum + Number(row.depositThisMonth || 0), 0);
  const billAmount = (financePreview.billRows || []).reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const collateralAmount = (financePreview.collateralRows || []).reduce((sum, row) => sum + Number(row.companySetAmount || 0), 0);
  const outstandingAmount = outstandingTabRows.reduce((sum, row) => sum + Number(row[5] || 0), 0);
  return {
    receivableTradeLimit,
    receivableSales,
    receivableDeposit,
    billAmount,
    collateralAmount,
    outstandingAmount,
  };
}
