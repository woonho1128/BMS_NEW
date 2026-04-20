import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Tabs } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PRICE_CATEGORY_TREE, PRICE_PRODUCT_DATA, createProductComponents } from '../data/priceCatalogMock';
import { loadPriceCatalogProducts, savePriceCatalogProducts } from '../data/priceCatalogStorage';
import { notify } from '../../../shared/utils/notify';
import {
  CLIENT_DISCOUNT_DATA,
  buildDealerMonthlyDetail,
  formatNum,
  normalizeDocFiles,
} from './discountPromotion.constants';
import DiscountPriceManageTab from './components/DiscountPriceManageTab';
import DiscountPromotionManageTab from './components/DiscountPromotionManageTab';
import DiscountClientRateTab from './components/DiscountClientRateTab';
import DiscountDealerDetailModal from './components/DiscountDealerDetailModal';
import DiscountPriceUploadModal from './components/DiscountPriceUploadModal';
import styles from './DiscountPromotionPage.module.css';

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
      label: '프로모션 관리',
      children: <DiscountPromotionManageTab styles={styles} />,
    },
    {
      key: '3',
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
      <DiscountDealerDetailModal
        styles={styles}
        selectedDealerRow={selectedDealerRow}
        selectedDealerDetail={selectedDealerDetail}
        monthHeaders={monthHeaders}
        dealerDetailRows={dealerDetailRows}
        onClose={() => setSelectedDealerRow(null)}
      />

      <DiscountPriceUploadModal
        styles={styles}
        open={priceUploadModalOpen}
        onClose={() => setPriceUploadModalOpen(false)}
        onApplyMockUpload={handleApplyMockUpload}
      />
    </PageShell>
  );
}

export default DiscountPromotionPage;




