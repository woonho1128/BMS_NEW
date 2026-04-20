import React from 'react';
import { Tag } from 'antd';
import { formatNumber } from '../../../shared/utils/formatters';

export const formatNum = (num) => formatNumber(num);

export function normalizeDocFiles(docFiles) {
  const input = docFiles || {};
  return {
    testReport: Array.isArray(input.testReport) ? input.testReport : input.testReport ? [input.testReport] : [],
    ecoCert: Array.isArray(input.ecoCert) ? input.ecoCert : input.ecoCert ? [input.ecoCert] : [],
    drawingPdf: Array.isArray(input.drawingPdf) ? input.drawingPdf : input.drawingPdf ? [input.drawingPdf] : [],
    drawingDwg: Array.isArray(input.drawingDwg) ? input.drawingDwg : input.drawingDwg ? [input.drawingDwg] : [],
  };
}

export function buildDealerMonthlyDetail(row) {
  if (!row) return null;
  const monthlyTotalSales = [row.threeMonthsAgo, row.twoMonthsAgo, row.prevMonth].map((v) => Number(v) || 0);
  const excludedSales = monthlyTotalSales.map((amount, index) => Math.round(amount * (0.28 + index * 0.02)));
  const includedSales = monthlyTotalSales.map((amount, index) => Math.max(0, amount - excludedSales[index]));
  const totalSalesSum = monthlyTotalSales.reduce((sum, value) => sum + value, 0);
  const excludedSum = excludedSales.reduce((sum, value) => sum + value, 0);
  const includedSum = includedSales.reduce((sum, value) => sum + value, 0);
  const avg3Month = Math.round(includedSum / 3);
  const discountRate = Number(row.currentDiscountRate || 0);
  const extraRate = Number((row.nextTierDiscountRate || 0) - discountRate);

  return {
    monthlyTotalSales,
    excludedSales,
    includedSales,
    totalSalesSum,
    excludedSum,
    includedSum,
    avg3Month,
    discountRate,
    extraRate,
  };
}

export const PROMOTION_COLUMNS = [
  { title: '구분', dataIndex: 'type', width: 130 },
  { title: '품목코드', dataIndex: 'itemCode', width: 110, align: 'center' },
  { title: '품목명', dataIndex: 'itemName', width: 210, ellipsis: true },
  { title: '계정', dataIndex: 'account', width: 80, align: 'center' },
  {
    title: '할인율(%)',
    dataIndex: 'discountRate',
    width: 100,
    align: 'right',
    render: (v) => React.createElement('strong', { style: { color: '#d9534f' } }, `${v}%`),
  },
  { title: '적용기간 (FR ~ TO)', dataIndex: 'period', width: 230, align: 'center' },
  {
    title: '사용여부',
    dataIndex: 'isActive',
    width: 90,
    align: 'center',
    render: (v) => React.createElement(Tag, { color: v ? 'success' : 'error' }, v ? 'YES' : 'NO'),
  },
  { title: '비고', dataIndex: 'remarks', ellipsis: true },
];

export const PROMOTION_DATA = [
  {
    key: 1,
    type: 'A(프로모션)',
    itemCode: 'CAH301G',
    itemName: '양변기세트',
    account: '상품',
    discountRate: 25.93,
    period: '2025-12-24 ~ 2026-01-16',
    isActive: true,
    remarks: '12.22 변경 523-2025-006645',
  },
  {
    key: 2,
    type: 'A(프로모션)',
    itemCode: 'CAH301V',
    itemName: '비데일체형',
    account: '상품',
    discountRate: 22.2,
    period: '2024-10-17 ~ 2024-11-15',
    isActive: false,
    remarks: '523-2024-010505',
  },
  {
    key: 3,
    type: 'A(프로모션)',
    itemCode: 'CAH304V',
    itemName: '감온샤워세트',
    account: '상품',
    discountRate: 24.99,
    period: '2024-10-17 ~ 2024-11-15',
    isActive: false,
    remarks: '523-2024-010505',
  },
  {
    key: 4,
    type: 'B(특판)',
    itemCode: 'FT-1001',
    itemName: '600각 타일',
    account: '자재',
    discountRate: 18.5,
    period: '2026-01-01 ~ 2026-03-31',
    isActive: true,
    remarks: '1분기 특판',
  },
  {
    key: 5,
    type: 'B(특판)',
    itemCode: 'WT-2001',
    itemName: '300x600 벽타일',
    account: '자재',
    discountRate: 17.0,
    period: '2026-02-01 ~ 2026-02-28',
    isActive: false,
    remarks: '재고소진',
  },
];

export const CLIENT_DISCOUNT_DATA = Array.from({ length: 84 }, (_, idx) => {
  const n = idx + 1;
  const prevMonth = 5200000 + n * 315000;
  const twoMonthsAgo = 4700000 + n * 280000;
  const threeMonthsAgo = 4300000 + n * 265000;
  const avg3Month = Math.floor((prevMonth + twoMonthsAgo + threeMonthsAgo) / 3);
  const currentDiscountRate = Number((16 + (n % 8) * 0.43).toFixed(2));
  const nextTierDiscountRate = Number((currentDiscountRate + 0.5).toFixed(2));

  return {
    key: String(n),
    queryMonth: n % 2 === 0 ? '2026-04' : '2026-03',
    dealerCode: `05${String(1000 + n).slice(-4)}`,
    dealerName: ['서울세라믹', '동해위생기상사', '유현아이치하우징', '경영상사', '정우기계상사'][idx % 5],
    managerCode: ['G848', 'D039', 'G999', 'G814', 'G846'][idx % 5],
    managerName: ['권순호', '박세진', '조동우', '이해구', '최민우'][idx % 5],
    avg3Month,
    prevMonth,
    twoMonthsAgo,
    threeMonthsAgo,
    currentDiscountRate,
    remainingToNextTier: 1500000 + (idx % 9) * 920000,
    nextTierDiscountRate,
  };
});
