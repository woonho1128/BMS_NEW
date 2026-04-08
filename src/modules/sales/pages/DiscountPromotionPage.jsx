import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Modal, Table, Tabs, Tag } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { usePagination } from '../../../shared/hooks/usePagination';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { PRICE_CATEGORY_TREE, PRICE_PRODUCT_DATA, createProductComponents } from '../data/priceCatalogMock';
import { loadPriceCatalogProducts, savePriceCatalogProducts } from '../data/priceCatalogStorage';
import { formatNumber } from '../../../shared/utils/formatters';
import { notify } from '../../../shared/utils/notify';
import styles from './DiscountPromotionPage.module.css';

const formatNum = (num) => formatNumber(num);
function normalizeDocFiles(docFiles) {
  const input = docFiles || {};
  return {
    testReport: Array.isArray(input.testReport) ? input.testReport : input.testReport ? [input.testReport] : [],
    ecoCert: Array.isArray(input.ecoCert) ? input.ecoCert : input.ecoCert ? [input.ecoCert] : [],
    drawingPdf: Array.isArray(input.drawingPdf) ? input.drawingPdf : input.drawingPdf ? [input.drawingPdf] : [],
    drawingDwg: Array.isArray(input.drawingDwg) ? input.drawingDwg : input.drawingDwg ? [input.drawingDwg] : [],
  };
}

function buildDealerMonthlyDetail(row) {
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


const PROMOTION_COLUMNS = [
  { title: '구분', dataIndex: 'type', width: 130 },
  { title: '품목코드', dataIndex: 'itemCode', width: 110, align: 'center' },
  { title: '품목명', dataIndex: 'itemName', width: 210, ellipsis: true },
  { title: '계정', dataIndex: 'account', width: 80, align: 'center' },
  { title: '할인율(%)', dataIndex: 'discountRate', width: 100, align: 'right', render: (v) => <strong style={{ color: '#d9534f' }}>{v}%</strong> },
  { title: '적용기간 (FR ~ TO)', dataIndex: 'period', width: 230, align: 'center' },
  { title: '사용여부', dataIndex: 'isActive', width: 90, align: 'center', render: (v) => <Tag color={v ? 'success' : 'error'}>{v ? 'YES' : 'NO'}</Tag> },
  { title: '비고', dataIndex: 'remarks', ellipsis: true },
];

const PROMOTION_DATA = [
  { key: 1, type: 'A(프로모션)', itemCode: 'CAH301G', itemName: '양변기세척레버', account: '상품', discountRate: 25.93, period: '2025-12-24 ~ 2026-01-16', isActive: true, remarks: '12.22변경 523-2025-006645' },
  { key: 2, type: 'A(프로모션)', itemCode: 'CAH301V', itemName: '비데일체형', account: '상품', discountRate: 22.2, period: '2024-10-17 ~ 2024-11-15', isActive: false, remarks: '523-2024-010505' },
  { key: 3, type: 'A(프로모션)', itemCode: 'CAH304V', itemName: '감온식세척레버', account: '상품', discountRate: 24.99, period: '2024-10-17 ~ 2024-11-15', isActive: false, remarks: '523-2024-010505' },
  { key: 4, type: 'B(특판)', itemCode: 'FT-1001', itemName: '600각 포세린타일', account: '제품', discountRate: 18.5, period: '2026-01-01 ~ 2026-03-31', isActive: true, remarks: '1분기 특판' },
  { key: 5, type: 'B(특판)', itemCode: 'WT-2001', itemName: '300x600 벽타일', account: '제품', discountRate: 17.0, period: '2026-02-01 ~ 2026-02-28', isActive: false, remarks: '재고소진' },
];

const CLIENT_DISCOUNT_DATA = Array.from({ length: 84 }, (_, idx) => {
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
    dealerName: ['한결세라믹스', '동해위생기상사', '유엔에이치하우징', '경영상사', '정우기계상사'][idx % 5],
    managerCode: ['G848', 'D039', 'G999', 'G814', 'G846'][idx % 5],
    managerName: ['권순호', '박세현', '조동욱', '이해구', '유득현'][idx % 5],
    avg3Month,
    prevMonth,
    twoMonthsAgo,
    threeMonthsAgo,
    currentDiscountRate,
    remainingToNextTier: 1500000 + (idx % 9) * 920000,
    nextTierDiscountRate,
  };
});

export function DiscountPromotionPage() {
  const initialPriceProducts = useMemo(() => loadPriceCatalogProducts(), []);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedDealerRow, setSelectedDealerRow] = useState(null);
  const [selectedPriceProductId, setSelectedPriceProductId] = useState(initialPriceProducts[0]?.id || PRICE_PRODUCT_DATA[0]?.id || '');
  const [priceProducts, setPriceProducts] = useState(initialPriceProducts);
  const [priceFilter, setPriceFilter] = useState({
    majorCategory: '',
    middleCategory: '',
    keyword: '',
  });
  const [priceDraft, setPriceDraft] = useState(() => initialPriceProducts[0] || PRICE_PRODUCT_DATA[0] || null);
  const [priceDraftStatus, setPriceDraftStatus] = useState('조회 상태');
  const [priceUploadModalOpen, setPriceUploadModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState({
    version: 'V02',
    itemSearch: '',
    dateFrom: '',
    dateTo: '',
    isActive: '',
    clientSearch: '',
    discountYear: '2026',
    discountMonth: '04',
    discountDealer: '',
    discountManager: '',
  });

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      version: 'V02',
      itemSearch: '',
      dateFrom: '',
      dateTo: '',
      isActive: '',
      clientSearch: '',
      discountYear: '2026',
      discountMonth: '04',
      discountDealer: '',
      discountManager: '',
    });
  }, []);

  const filterFields = useMemo(() => {
    if (activeTab === '1') {
      return [
        {
          id: 'version',
          label: '버전 선택',
          type: 'select',
          width: 160,
          row: 0,
          options: [
            { label: 'V02 (현재)', value: 'V02' },
            { label: 'V01 (과거)', value: 'V01' },
          ],
        },
      ];
    }
    if (activeTab === '2') {
      return [
        { id: 'itemSearch', label: '품목 검색', type: 'text', placeholder: '품목명 또는 코드', wide: true, row: 0 },
        { id: 'dateRange', label: '적용기간', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
        {
          id: 'isActive',
          label: '사용여부',
          type: 'select',
          width: 100,
          row: 0,
          options: [
            { label: '전체', value: '' },
            { label: 'YES', value: 'yes' },
            { label: 'NO', value: 'no' },
          ],
        },
      ];
    }

    return [
      {
        id: 'discountYear',
        label: '조회년월',
        type: 'select',
        width: 100,
        row: 0,
        options: [
          { label: '2026년', value: '2026' },
          { label: '2025년', value: '2025' },
        ],
      },
      {
        id: 'discountMonth',
        label: '',
        type: 'select',
        width: 90,
        row: 0,
        options: Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}월`, value: String(i + 1).padStart(2, '0') })),
      },
      { id: 'discountDealer', label: '거래처', type: 'text', placeholder: '대리점 검색', wide: true, row: 0 },
      { id: 'discountManager', label: '영업그룹', type: 'text', placeholder: '담당자 코드', row: 0 },
    ];
  }, [activeTab]);

  const middleCategoryOptions = useMemo(() => {
    if (!priceFilter.majorCategory) return [];
    const found = PRICE_CATEGORY_TREE.find((row) => row.major === priceFilter.majorCategory);
    return found?.middle || [];
  }, [priceFilter.majorCategory]);

  const filteredPriceProducts = useMemo(() => {
    const keyword = priceFilter.keyword.trim().toLowerCase();
    return priceProducts.filter((row) => {
      if (priceFilter.majorCategory && row.majorCategory !== priceFilter.majorCategory) return false;
      if (priceFilter.middleCategory && row.middleCategory !== priceFilter.middleCategory) return false;
      if (
        keyword &&
        !String(row.modelName || '').toLowerCase().includes(keyword) &&
        !String(row.itemCode || '').toLowerCase().includes(keyword)
      ) {
        return false;
      }
      return true;
    });
  }, [priceFilter.keyword, priceFilter.majorCategory, priceFilter.middleCategory, priceProducts]);

  const pricePagination = usePagination(filteredPriceProducts, { initialPageSize: 20 });
  const {
    currentPage: priceCurrentPage,
    totalCount: priceTotalCount,
    totalPages: priceTotalPages,
    pagedData: pagedPriceProducts,
    setPage: setPricePage,
    resetPage: resetPricePage,
  } = pricePagination;

  const selectedPriceProduct = useMemo(
    () => priceProducts.find((row) => row.id === selectedPriceProductId) || filteredPriceProducts[0] || priceProducts[0] || null,
    [filteredPriceProducts, priceProducts, selectedPriceProductId]
  );

  const selectedPriceSummary = useMemo(() => {
    const rows = priceDraft?.components || [];
    return rows.reduce(
      (acc, row) => ({
        factory: acc.factory + Number(row.factoryPrice || 0),
        consumer: acc.consumer + Number(row.consumerPrice || 0),
      }),
      { factory: 0, consumer: 0 }
    );
  }, [priceDraft]);

  useEffect(() => {
    if (!selectedPriceProduct) return;
    if (priceDraft?.id === selectedPriceProduct.id) return;
    const nextDraft = JSON.parse(JSON.stringify(selectedPriceProduct));
    nextDraft.docFiles = normalizeDocFiles(nextDraft.docFiles);
    setPriceDraft(nextDraft);
  }, [priceDraft?.id, selectedPriceProduct]);

  useEffect(() => {
    savePriceCatalogProducts(priceProducts);
  }, [priceProducts]);

  const handlePriceFilterChange = useCallback((field, value) => {
    setPriceFilter((prev) => {
      if (field === 'majorCategory') {
        return { ...prev, majorCategory: value, middleCategory: '' };
      }
      return { ...prev, [field]: value };
    });
    resetPricePage();
  }, [resetPricePage]);

  const handlePriceSelectItem = useCallback((id) => {
    const found = priceProducts.find((row) => row.id === id);
    if (!found) return;
    const nextDraft = JSON.parse(JSON.stringify(found));
    nextDraft.docFiles = normalizeDocFiles(nextDraft.docFiles);
    setSelectedPriceProductId(id);
    setPriceDraft(nextDraft);
    setPriceDraftStatus(`${found.modelName} 편집 중`);
  }, [priceProducts]);

  const handlePriceDraftField = useCallback((field, value) => {
    setPriceDraft((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePriceDraftSeriesName = useCallback((value) => {
    setPriceDraft((prev) => ({ ...prev, seriesName: value, series: value }));
  }, []);

  const handlePriceDraftDocUpload = useCallback((field, fileList) => {
    const parsed = Array.from(fileList || []).map((file) => file?.name).filter(Boolean);
    if (!parsed.length) return;
    setPriceDraft((prev) => {
      const current = normalizeDocFiles(prev?.docFiles);
      const merged = Array.from(new Set([...(current[field] || []), ...parsed]));
      return {
        ...prev,
        docFiles: {
          ...current,
          [field]: merged,
        },
      };
    });
    notify.success(`${parsed.length}개 파일을 등록했습니다.`);
  }, []);

  const handlePriceDraftDocRemove = useCallback((field, index) => {
    setPriceDraft((prev) => {
      const current = normalizeDocFiles(prev?.docFiles);
      return {
        ...prev,
        docFiles: {
          ...current,
          [field]: current[field].filter((_, i) => i !== index),
        },
      };
    });
  }, []);

  const handlePriceDraftDocReset = useCallback((field) => {
    setPriceDraft((prev) => {
      const current = normalizeDocFiles(prev?.docFiles);
      return {
        ...prev,
        docFiles: {
          ...current,
          [field]: [],
        },
      };
    });
  }, []);

  const handlePriceDraftDocResetAll = useCallback(() => {
    setPriceDraft((prev) => ({
      ...prev,
      docFiles: normalizeDocFiles({}),
    }));
    notify.info('품목 문서를 전체 초기화했습니다.');
  }, []);

  const handlePriceDraftComponentField = useCallback((componentId, field, value) => {
    setPriceDraft((prev) => ({
      ...prev,
      components: (prev?.components || []).map((row) => (
        row.id === componentId
          ? {
            ...row,
            [field]: field === 'factoryPrice' || field === 'consumerPrice' ? Number(String(value).replaceAll(',', '')) || 0 : value,
          }
          : row
      )),
    }));
  }, []);

  const handleAddPriceComponent = useCallback(() => {
    setPriceDraft((prev) => ({
      ...prev,
      components: [
        ...(prev?.components || []),
        {
          id: `new-c-${Date.now()}`,
          partName: '',
          partCode: '',
          factoryPrice: 0,
          consumerPrice: 0,
          packInfo: '',
          remark: '',
        },
      ],
    }));
  }, []);

  const handleNewPriceProduct = useCallback(() => {
    const newId = `P-NEW-${Date.now()}`;
    const newRow = {
      id: newId,
      majorCategory: priceFilter.majorCategory || PRICE_CATEGORY_TREE[0].major,
      middleCategory: priceFilter.middleCategory || PRICE_CATEGORY_TREE[0].middle[0],
      series: '',
      seriesName: '',
      modelName: '신규 품목',
      itemCode: '',
      weightKg: 0,
      ksSpec: '',
      waterSavingGrade: '',
      packUnit: 'EA/PT',
      shippingOrigin: '',
      baseDate: '2025-06-01',
      note: '',
      imageLabel: 'NEW',
      docFiles: {
        testReport: [],
        ecoCert: [],
        drawingPdf: [],
        drawingDwg: [],
      },
      components: [],
    };
    setPriceProducts((prev) => [newRow, ...prev]);
    setSelectedPriceProductId(newId);
    setPriceDraft(newRow);
    setPriceDraftStatus('신규 품목 작성 중');
    resetPricePage();
  }, [priceFilter.majorCategory, priceFilter.middleCategory, resetPricePage]);

  const handleSavePriceDraft = useCallback(() => {
    if (!priceDraft) return;
    setPriceProducts((prev) => {
      const exists = prev.some((row) => row.id === priceDraft.id);
      if (!exists) return [{ ...priceDraft }, ...prev];
      return prev.map((row) => (row.id === priceDraft.id ? { ...priceDraft } : row));
    });
    setSelectedPriceProductId(priceDraft.id);
    setPriceDraftStatus('저장 완료 (카탈로그 반영)');
    notify.success('판매단가 저장 내용을 카탈로그에 반영했습니다.');
  }, [priceDraft]);

  const handleApplyMockUpload = useCallback(() => {
    const uploadRows = [
      {
        id: `P-UP-${Date.now()}-1`,
        majorCategory: '비데/양변기',
        middleCategory: '일체형비데',
        series: '엑셀업로드 시리즈',
        seriesName: '엑셀업로드 시리즈',
        modelName: '엑셀 업로드 모델 A',
        itemCode: 'UPA-001',
        weightKg: 29.7,
        ksSpec: 'KS B 2361',
        waterSavingGrade: '1등급',
        packUnit: 'EA/PT',
        shippingOrigin: '제천',
        baseDate: '2025-06-01',
        note: '엑셀 업로드',
        imageLabel: 'UPLOAD-A',
        docFiles: {
          testReport: ['시험성적서_UPA001.pdf'],
          ecoCert: ['환경표지_UPA001.pdf'],
          drawingPdf: ['도면_UPA001.pdf'],
          drawingDwg: ['도면_UPA001.dwg'],
        },
        components: createProductComponents('UPA001', 960000),
      },
      {
        id: `P-UP-${Date.now()}-2`,
        majorCategory: '세면/수전',
        middleCategory: '세면기',
        series: '엑셀업로드 시리즈',
        seriesName: '엑셀업로드 시리즈',
        modelName: '엑셀 업로드 모델 B',
        itemCode: 'UPB-001',
        weightKg: 16.4,
        ksSpec: 'KS B 2361',
        waterSavingGrade: '2등급',
        packUnit: 'EA/PT',
        shippingOrigin: '창원',
        baseDate: '2025-06-01',
        note: '엑셀 업로드',
        imageLabel: 'UPLOAD-B',
        docFiles: {
          testReport: [],
          ecoCert: [],
          drawingPdf: [],
          drawingDwg: [],
        },
        components: createProductComponents('UPB001', 720000),
      },
    ];
    setPriceProducts((prev) => [...uploadRows, ...prev]);
    setPriceUploadModalOpen(false);
    setPriceDraftStatus('엑셀 목업 2건 반영 완료 (카탈로그 연동)');
    resetPricePage();
  }, [resetPricePage]);

  const filteredClientDiscount = useMemo(() => {
    const month = `${filterValue.discountYear}-${filterValue.discountMonth}`;
    const dealerKeyword = filterValue.discountDealer.trim();
    const managerKeyword = filterValue.discountManager.trim();
    return CLIENT_DISCOUNT_DATA.filter((row) => {
      if (month && row.queryMonth !== month) return false;
      if (dealerKeyword && !row.dealerName.includes(dealerKeyword) && !row.dealerCode.includes(dealerKeyword)) return false;
      if (managerKeyword && !row.managerName.includes(managerKeyword) && !row.managerCode.includes(managerKeyword)) return false;
      return true;
    });
  }, [filterValue.discountDealer, filterValue.discountManager, filterValue.discountMonth, filterValue.discountYear]);

  const clientPagination = usePagination(filteredClientDiscount, { initialPageSize: 10 });
  const {
    currentPage: clientCurrentPage,
    pageSize: clientPageSize,
    totalCount: clientTotalCount,
    pagedData: pagedClientDiscount,
    setPage: setClientPage,
    setPageSize: setClientPageSize,
  } = clientPagination;

  const selectedDealerDetail = useMemo(() => buildDealerMonthlyDetail(selectedDealerRow), [selectedDealerRow]);
  const monthHeaders = useMemo(() => {
    const month = Number(filterValue.discountMonth) || 1;
    const year = Number(filterValue.discountYear) || 2026;
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
  }, [filterValue.discountMonth, filterValue.discountYear]);
  const dealerDetailRows = useMemo(() => {
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
  }, [selectedDealerDetail]);

  const clientColumns = useMemo(
    () => [
      {
        title: '대리점',
        dataIndex: 'dealerName',
        width: 200,
        render: (value, row) => (
          <button type="button" className={styles.dealerLink} onClick={() => setSelectedDealerRow(row)}>
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
    []
  );

  const tabItems = [
    {
      key: '1',
      label: '판매단가 관리',
      children: (
        <div className={styles.priceManageLayout}>
          <aside className={styles.priceItemPanel}>
            <div className={styles.priceItemPanelTitle}>품목 목록</div>
            <div className={styles.priceSearchBox}>
              <select
                value={priceFilter.majorCategory}
                onChange={(e) => handlePriceFilterChange('majorCategory', e.target.value)}
              >
                <option value="">대분류 전체</option>
                {PRICE_CATEGORY_TREE.map((row) => (
                  <option key={row.major} value={row.major}>
                    {row.major}
                  </option>
                ))}
              </select>
              <select
                value={priceFilter.middleCategory}
                onChange={(e) => handlePriceFilterChange('middleCategory', e.target.value)}
              >
                <option value="">중분류 전체</option>
                {middleCategoryOptions.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                value={priceFilter.keyword}
                onChange={(e) => handlePriceFilterChange('keyword', e.target.value)}
                placeholder="품목명/품번 검색"
              />
            </div>
            <div className={styles.priceItemList}>
              {pagedPriceProducts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.priceItemButton} ${selectedPriceProduct?.id === item.id ? styles.priceItemButtonActive : ''}`}
                  onClick={() => handlePriceSelectItem(item.id)}
                >
                  <strong>{item.modelName}</strong>
                  <span>{item.itemCode} · {item.middleCategory}</span>
                </button>
              ))}
            </div>
            <div className={styles.priceItemPanelFooter}>
              <div className={styles.priceItemCount}>조회 {priceTotalCount.toLocaleString()}건</div>
              <div className={styles.priceItemButtons}>
                <Button variant="secondary" onClick={handleNewPriceProduct}>+ 신규 등록</Button>
                <Button variant="secondary" onClick={() => setPriceUploadModalOpen(true)}>엑셀 업로드</Button>
              </div>
              <div className={styles.priceArrowPager}>
                <button
                  type="button"
                  className={styles.priceArrowButton}
                  onClick={() => setPricePage(priceCurrentPage - 1)}
                  disabled={priceCurrentPage <= 1}
                  aria-label="이전 페이지"
                >
                  ◀
                </button>
                <span className={styles.priceArrowPageText}>
                  {priceCurrentPage} / {priceTotalPages}
                </span>
                <button
                  type="button"
                  className={styles.priceArrowButton}
                  onClick={() => setPricePage(priceCurrentPage + 1)}
                  disabled={priceCurrentPage >= priceTotalPages}
                  aria-label="다음 페이지"
                >
                  ▶
                </button>
              </div>
            </div>
          </aside>

          <section className={styles.priceEditorPanel}>
            <div className={styles.priceEditorHeader}>
              <div>
                <h3>{priceDraft?.modelName || '-'}</h3>
                <p>기준일 {priceDraft?.baseDate || '-'} · 단위 원 · {priceDraftStatus}</p>
              </div>
              <div className={styles.priceEditorActions}>
                <Button variant="secondary">엑셀 양식 다운로드</Button>
                <Button variant="primary" onClick={handleSavePriceDraft}>등록/수정 저장</Button>
              </div>
            </div>

            <div className={styles.priceInfoGrid}>
              <label className={styles.priceInfoField}>
                <span>대분류</span>
                <select
                  value={priceDraft?.majorCategory || ''}
                  onChange={(e) => handlePriceDraftField('majorCategory', e.target.value)}
                >
                  {PRICE_CATEGORY_TREE.map((row) => (
                    <option key={row.major} value={row.major}>
                      {row.major}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.priceInfoField}>
                <span>중분류</span>
                <input
                  value={priceDraft?.middleCategory || ''}
                  onChange={(e) => handlePriceDraftField('middleCategory', e.target.value)}
                />
              </label>
              <label className={styles.priceInfoField}>
                <span>시리즈명</span>
                <input
                  value={priceDraft?.seriesName || priceDraft?.series || ''}
                  onChange={(e) => handlePriceDraftSeriesName(e.target.value)}
                />
              </label>
              <label className={styles.priceInfoField}>
                <span>대표 품번</span>
                <input value={priceDraft?.itemCode || ''} onChange={(e) => handlePriceDraftField('itemCode', e.target.value)} />
              </label>
              <label className={styles.priceInfoField}>
                <span>중량(Kg)</span>
                <input value={priceDraft?.weightKg || ''} onChange={(e) => handlePriceDraftField('weightKg', e.target.value)} />
              </label>
              <label className={styles.priceInfoField}>
                <span>KS규격</span>
                <input value={priceDraft?.ksSpec || ''} onChange={(e) => handlePriceDraftField('ksSpec', e.target.value)} />
              </label>
              <label className={styles.priceInfoField}>
                <span>절수등급</span>
                <input value={priceDraft?.waterSavingGrade || ''} onChange={(e) => handlePriceDraftField('waterSavingGrade', e.target.value)} placeholder="예: 1등급" />
              </label>
              <label className={styles.priceInfoField}>
                <span>포장단위</span>
                <input value={priceDraft?.packUnit || ''} onChange={(e) => handlePriceDraftField('packUnit', e.target.value)} />
              </label>
              <label className={styles.priceInfoField}>
                <span>출고지</span>
                <input value={priceDraft?.shippingOrigin || ''} onChange={(e) => handlePriceDraftField('shippingOrigin', e.target.value)} placeholder="예: 제천, 창원" />
              </label>
              <label className={styles.priceInfoField}>
                <span>비고</span>
                <input value={priceDraft?.note || ''} onChange={(e) => handlePriceDraftField('note', e.target.value)} />
              </label>
            </div>

            <div className={styles.priceContentRow}>
              <div className={styles.priceImageBox}>
                <div className={styles.priceImageMock}>{priceDraft?.imageLabel || 'IMAGE'}</div>
                <Button variant="secondary" className={styles.priceImageButton}>이미지 변경</Button>
              </div>

              <div className={styles.priceTableWrap}>
                <table className={styles.priceEditorTable}>
                  <thead>
                    <tr>
                      <th>세부품명</th>
                      <th>품번</th>
                      <th className={styles.rightCell}>공장도가(VAT-)</th>
                      <th className={styles.rightCell}>권장소비자가(VAT+)</th>
                      <th>포장정보</th>
                      <th>비고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(priceDraft?.components || []).map((row) => (
                      <tr key={`${priceDraft?.id}-${row.id}`}>
                        <td>
                          <input
                            className={styles.priceCellInput}
                            value={row.partName}
                            onChange={(e) => handlePriceDraftComponentField(row.id, 'partName', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className={styles.priceCellInput}
                            value={row.partCode}
                            onChange={(e) => handlePriceDraftComponentField(row.id, 'partCode', e.target.value)}
                          />
                        </td>
                        <td className={styles.rightCell}>
                          <input
                            className={`${styles.priceCellInput} ${styles.priceCellInputRight}`}
                            value={formatNum(row.factoryPrice)}
                            onChange={(e) => handlePriceDraftComponentField(row.id, 'factoryPrice', e.target.value)}
                          />
                        </td>
                        <td className={styles.rightCell}>
                          <input
                            className={`${styles.priceCellInput} ${styles.priceCellInputRight}`}
                            value={formatNum(row.consumerPrice)}
                            onChange={(e) => handlePriceDraftComponentField(row.id, 'consumerPrice', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className={styles.priceCellInput}
                            value={row.packInfo}
                            onChange={(e) => handlePriceDraftComponentField(row.id, 'packInfo', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className={styles.priceCellInput}
                            value={row.remark}
                            onChange={(e) => handlePriceDraftComponentField(row.id, 'remark', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={2}>합계</th>
                      <th className={styles.rightCell}>{formatNum(selectedPriceSummary.factory)}</th>
                      <th className={styles.rightCell}>{formatNum(selectedPriceSummary.consumer)}</th>
                      <th colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
                <div className={styles.priceTableFooter}>
                  <Button variant="secondary" onClick={handleAddPriceComponent}>+ 세부 품번 행 추가</Button>
                </div>
              </div>
            </div>

            <div className={styles.priceDocsSection}>
              <div className={styles.priceDocsHeader}>
                <div>
                  <div className={styles.priceDocsTitle}>품목 문서 등록</div>
                  <p className={styles.priceDocsGuide}>문서별 파일 업로드로 등록하며, 다중 선택 업로드를 지원합니다.</p>
                </div>
                <Button variant="secondary" onClick={handlePriceDraftDocResetAll}>문서 전체 초기화</Button>
              </div>
              <div className={styles.priceDocsGrid}>
                <label className={styles.priceDocField}>
                  <span>시험성적서</span>
                  <div className={styles.priceDocInputRow}>
                    <label className={styles.priceUploadLabel}>
                      파일 업로드
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          handlePriceDraftDocUpload('testReport', e.target.files);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <Button variant="secondary" onClick={() => handlePriceDraftDocReset('testReport')}>초기화</Button>
                  </div>
                  <div className={styles.priceDocList}>
                    {(priceDraft?.docFiles?.testReport || []).map((name, idx) => (
                      <button key={`${name}-${idx}`} type="button" className={styles.priceDocChip} onClick={() => handlePriceDraftDocRemove('testReport', idx)}>
                        {name} ✕
                      </button>
                    ))}
                  </div>
                </label>
                <label className={styles.priceDocField}>
                  <span>환경표지인증서</span>
                  <div className={styles.priceDocInputRow}>
                    <label className={styles.priceUploadLabel}>
                      파일 업로드
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          handlePriceDraftDocUpload('ecoCert', e.target.files);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <Button variant="secondary" onClick={() => handlePriceDraftDocReset('ecoCert')}>초기화</Button>
                  </div>
                  <div className={styles.priceDocList}>
                    {(priceDraft?.docFiles?.ecoCert || []).map((name, idx) => (
                      <button key={`${name}-${idx}`} type="button" className={styles.priceDocChip} onClick={() => handlePriceDraftDocRemove('ecoCert', idx)}>
                        {name} ✕
                      </button>
                    ))}
                  </div>
                </label>
                <label className={styles.priceDocField}>
                  <span>제품이미지 도면 PDF</span>
                  <div className={styles.priceDocInputRow}>
                    <label className={styles.priceUploadLabel}>
                      파일 업로드
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={(e) => {
                          handlePriceDraftDocUpload('drawingPdf', e.target.files);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <Button variant="secondary" onClick={() => handlePriceDraftDocReset('drawingPdf')}>초기화</Button>
                  </div>
                  <div className={styles.priceDocList}>
                    {(priceDraft?.docFiles?.drawingPdf || []).map((name, idx) => (
                      <button key={`${name}-${idx}`} type="button" className={styles.priceDocChip} onClick={() => handlePriceDraftDocRemove('drawingPdf', idx)}>
                        {name} ✕
                      </button>
                    ))}
                  </div>
                </label>
                <label className={styles.priceDocField}>
                  <span>DWG</span>
                  <div className={styles.priceDocInputRow}>
                    <label className={styles.priceUploadLabel}>
                      파일 업로드
                      <input
                        type="file"
                        multiple
                        accept=".dwg"
                        onChange={(e) => {
                          handlePriceDraftDocUpload('drawingDwg', e.target.files);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    <Button variant="secondary" onClick={() => handlePriceDraftDocReset('drawingDwg')}>초기화</Button>
                  </div>
                  <div className={styles.priceDocList}>
                    {(priceDraft?.docFiles?.drawingDwg || []).map((name, idx) => (
                      <button key={`${name}-${idx}`} type="button" className={styles.priceDocChip} onClick={() => handlePriceDraftDocRemove('drawingDwg', idx)}>
                        {name} ✕
                      </button>
                    ))}
                  </div>
                </label>
              </div>
            </div>
          </section>
        </div>
      ),
    },
    {
      key: '2',
      label: '프로모션 관리',
      children: (
        <Table
          columns={PROMOTION_COLUMNS}
          dataSource={PROMOTION_DATA}
          bordered
          size="small"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          className={styles.gridTable}
        />
      ),
    },
    {
      key: '3',
      label: '거래처별 할인율',
      children: (
        <div className={styles.tabTableSection}>
          <Table
            columns={clientColumns}
            dataSource={pagedClientDiscount}
            bordered
            size="small"
            pagination={false}
            scroll={{ x: 'max-content' }}
            className={styles.gridTable}
          />

          <Pagination
            className={styles.pagination}
            totalCount={clientTotalCount}
            currentPage={clientCurrentPage}
            pageSize={clientPageSize}
            onPageChange={setClientPage}
            onPageSizeChange={setClientPageSize}
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell path="/sales/support/discount-promotion" className={styles.shellWide}>
      <div className={styles.page}>
        <ListFilter fields={filterFields} value={filterValue} onChange={handleFilterChange} onReset={handleReset} onSearch={() => {}} searchLabel="조회" />

        <div className={styles.tabsWrap}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setSelectedDealerRow(null);
              handleReset();
            }}
            items={tabItems}
            type="card"
            className={styles.tabs}
          />
        </div>
      </div>

      <Modal
        open={Boolean(selectedDealerRow && selectedDealerDetail)}
        onCancel={() => setSelectedDealerRow(null)}
        footer={null}
        width={1080}
        centered
        title={
          selectedDealerRow
            ? `${selectedDealerRow.dealerName} 3개월(${monthHeaders[0]}~${monthHeaders[2]}) 매출 현황`
            : '3개월 매출 현황'
        }
      >
        {selectedDealerDetail && (
          <div className={styles.dealerModalBody}>
            <div className={styles.metricCards}>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>3개월 평균</span>
                <strong className={styles.metricValue}>{formatNum(selectedDealerDetail.avg3Month)}</strong>
                <span className={styles.metricSub}>{monthHeaders[2]} 기준</span>
              </article>
              <article className={styles.metricCard}>
                <span className={styles.metricLabel}>할인율</span>
                <strong className={styles.metricValue}>
                  {selectedDealerDetail.discountRate.toFixed(2)}%
                </strong>
                <span className={styles.metricSub}>증감 {selectedDealerDetail.extraRate.toFixed(2)}%</span>
              </article>
            </div>

            <div className={styles.dealerDetailTableWrap}>
              <table className={styles.dealerDetailTable}>
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>{monthHeaders[0]}</th>
                    <th>{monthHeaders[1]}</th>
                    <th>{monthHeaders[2]}</th>
                    <th>합계</th>
                  </tr>
                </thead>
                <tbody>
                  {dealerDetailRows.map((row) => (
                    <tr key={row.key}>
                      <th>{row.label}</th>
                      <td className={row.key === 'included' ? styles.emphasisCell : ''}>{formatNum(row.m1)}</td>
                      <td className={row.key === 'included' ? styles.emphasisCell : ''}>{formatNum(row.m2)}</td>
                      <td className={row.key === 'included' ? styles.emphasisCell : ''}>{formatNum(row.m3)}</td>
                      <td className={`${styles.sumCell} ${row.key === 'included' ? styles.emphasisCell : ''}`}>{formatNum(row.sum)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={priceUploadModalOpen}
        onCancel={() => setPriceUploadModalOpen(false)}
        footer={null}
        width={720}
        centered
        title="판매단가 엑셀 업로드 (목업)"
      >
        <div className={styles.uploadModalBody}>
          <div className={styles.uploadDropzone}>
            <strong>엑셀 파일을 선택해 주세요.</strong>
            <span>업로드 형식: 판매단가_템플릿.xlsx</span>
            <Button variant="secondary">파일 선택</Button>
          </div>
          <div className={styles.uploadPreview}>
            <p>검증 결과: 신규 2건 / 수정 0건 / 오류 0건</p>
            <table className={styles.uploadPreviewTable}>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>품목명</th>
                  <th>품번</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>일체형비데</td>
                  <td>엑셀 업로드 모델 A</td>
                  <td>UPA-001</td>
                  <td>신규</td>
                </tr>
                <tr>
                  <td>세면기</td>
                  <td>엑셀 업로드 모델 B</td>
                  <td>UPB-001</td>
                  <td>신규</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.uploadActions}>
            <Button variant="secondary" onClick={() => setPriceUploadModalOpen(false)}>취소</Button>
            <Button variant="primary" onClick={handleApplyMockUpload}>목업 반영</Button>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}

export default DiscountPromotionPage;


