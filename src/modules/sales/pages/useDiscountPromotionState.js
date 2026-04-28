import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePagination } from '../../../shared/hooks/usePagination';
import { PRICE_CATEGORY_TREE, PRICE_PRODUCT_DATA, createProductComponents } from '../data/priceCatalogMock';
import { loadPriceCatalogProducts, savePriceCatalogProducts } from '../data/priceCatalogStorage';
import { notify } from '../../../shared/utils/notify';
import { CLIENT_DISCOUNT_DATA, buildDealerMonthlyDetail, normalizeDocFiles } from './discountPromotion.constants';

export function useDiscountPromotionState(filterValue) {
  const initialPriceProducts = useMemo(() => loadPriceCatalogProducts(), []);
  const [selectedDealerRow, setSelectedDealerRow] = useState(null);
  const [selectedPriceProductId, setSelectedPriceProductId] = useState(initialPriceProducts[0]?.id || PRICE_PRODUCT_DATA[0]?.id || '');
  const [priceProducts, setPriceProducts] = useState(initialPriceProducts);
  const [priceFilter, setPriceFilter] = useState({ majorCategory: '', middleCategory: '', keyword: '' });
  const [priceDraft, setPriceDraft] = useState(() => initialPriceProducts[0] || PRICE_PRODUCT_DATA[0] || null);
  const [priceDraftStatus, setPriceDraftStatus] = useState('조회 상태');
  const [priceUploadModalOpen, setPriceUploadModalOpen] = useState(false);

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
      if (keyword && !String(row.modelName || '').toLowerCase().includes(keyword) && !String(row.itemCode || '').toLowerCase().includes(keyword)) return false;
      return true;
    });
  }, [priceFilter.keyword, priceFilter.majorCategory, priceFilter.middleCategory, priceProducts]);

  const pricePagination = usePagination(filteredPriceProducts, { initialPageSize: 20 });
  const { currentPage: priceCurrentPage, totalCount: priceTotalCount, totalPages: priceTotalPages, pagedData: pagedPriceProducts, setPage: setPricePage, resetPage: resetPricePage } = pricePagination;

  const selectedPriceProduct = useMemo(
    () => priceProducts.find((row) => row.id === selectedPriceProductId) || filteredPriceProducts[0] || priceProducts[0] || null,
    [filteredPriceProducts, priceProducts, selectedPriceProductId]
  );

  const selectedPriceSummary = useMemo(() => {
    const rows = priceDraft?.components || [];
    return rows.reduce((acc, row) => ({ factory: acc.factory + Number(row.factoryPrice || 0), consumer: acc.consumer + Number(row.consumerPrice || 0) }), { factory: 0, consumer: 0 });
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
    setPriceFilter((prev) => (field === 'majorCategory' ? { ...prev, majorCategory: value, middleCategory: '' } : { ...prev, [field]: value }));
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

  const handlePriceDraftField = useCallback((field, value) => setPriceDraft((prev) => ({ ...prev, [field]: value })), []);
  const handlePriceDraftSeriesName = useCallback((value) => setPriceDraft((prev) => ({ ...prev, seriesName: value, series: value })), []);

  const handlePriceDraftDocUpload = useCallback((field, fileList) => {
    const parsed = Array.from(fileList || []).map((file) => file?.name).filter(Boolean);
    if (!parsed.length) return;
    setPriceDraft((prev) => {
      const current = normalizeDocFiles(prev?.docFiles);
      const merged = Array.from(new Set([...(current[field] || []), ...parsed]));
      return { ...prev, docFiles: { ...current, [field]: merged } };
    });
    notify.success(`${parsed.length}개 파일을 등록했습니다.`);
  }, []);

  const handlePriceDraftDocRemove = useCallback((field, index) => {
    setPriceDraft((prev) => {
      const current = normalizeDocFiles(prev?.docFiles);
      return { ...prev, docFiles: { ...current, [field]: current[field].filter((_, i) => i !== index) } };
    });
  }, []);

  const handlePriceDraftDocReset = useCallback((field) => {
    setPriceDraft((prev) => {
      const current = normalizeDocFiles(prev?.docFiles);
      return { ...prev, docFiles: { ...current, [field]: [] } };
    });
  }, []);

  const handlePriceDraftDocResetAll = useCallback(() => {
    setPriceDraft((prev) => ({ ...prev, docFiles: normalizeDocFiles({}) }));
    notify.info('품목 문서를 전체 초기화했습니다.');
  }, []);

  const handlePriceDraftComponentField = useCallback((componentId, field, value) => {
    setPriceDraft((prev) => ({
      ...prev,
      components: (prev?.components || []).map((row) => (row.id === componentId ? { ...row, [field]: field === 'factoryPrice' || field === 'consumerPrice' ? Number(String(value).replaceAll(',', '')) || 0 : value } : row)),
    }));
  }, []);

  const handleAddPriceComponent = useCallback(() => {
    setPriceDraft((prev) => ({ ...prev, components: [...(prev?.components || []), { id: `new-c-${Date.now()}`, partName: '', partCode: '', factoryPrice: 0, consumerPrice: 0, packInfo: '', remark: '' }] }));
  }, []);

  const handleNewPriceProduct = useCallback(() => {
    const newId = `P-NEW-${Date.now()}`;
    const newRow = {
      id: newId,
      majorCategory: priceFilter.majorCategory || PRICE_CATEGORY_TREE[0].major,
      middleCategory: priceFilter.middleCategory || PRICE_CATEGORY_TREE[0].middle[0],
      series: '', seriesName: '', modelName: '신규 품목', itemCode: '', weightKg: 0, ksSpec: '', waterSavingGrade: '', packUnit: 'EA/PT', shippingOrigin: '', baseDate: '2025-06-01', note: '', imageLabel: 'NEW',
      docFiles: { testReport: [], ecoCert: [], drawingPdf: [], drawingDwg: [] },
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
      { id: `P-UP-${Date.now()}-1`, majorCategory: '비데/양변기', middleCategory: '일체형비데', series: '엑셀업로드 시리즈', seriesName: '엑셀업로드 시리즈', modelName: '엑셀 업로드 모델 A', itemCode: 'UPA-001', weightKg: 29.7, ksSpec: 'KS B 2361', waterSavingGrade: '1등급', packUnit: 'EA/PT', shippingOrigin: '제천', baseDate: '2025-06-01', note: '엑셀 업로드', imageLabel: 'UPLOAD-A', docFiles: { testReport: ['시험성적서_UPA001.pdf'], ecoCert: ['환경표지_UPA001.pdf'], drawingPdf: ['도면_UPA001.pdf'], drawingDwg: ['도면_UPA001.dwg'] }, components: createProductComponents('UPA001', 960000) },
      { id: `P-UP-${Date.now()}-2`, majorCategory: '세면/수전', middleCategory: '세면기', series: '엑셀업로드 시리즈', seriesName: '엑셀업로드 시리즈', modelName: '엑셀 업로드 모델 B', itemCode: 'UPB-001', weightKg: 16.4, ksSpec: 'KS B 2361', waterSavingGrade: '2등급', packUnit: 'EA/PT', shippingOrigin: '창원', baseDate: '2025-06-01', note: '엑셀 업로드', imageLabel: 'UPLOAD-B', docFiles: { testReport: [], ecoCert: [], drawingPdf: [], drawingDwg: [] }, components: createProductComponents('UPB001', 720000) },
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
  const { currentPage: clientCurrentPage, pageSize: clientPageSize, totalCount: clientTotalCount, pagedData: pagedClientDiscount, setPage: setClientPage, setPageSize: setClientPageSize } = clientPagination;

  const selectedDealerDetail = useMemo(() => buildDealerMonthlyDetail(selectedDealerRow), [selectedDealerRow]);

  return {
    selectedDealerRow, setSelectedDealerRow,
    priceFilter, middleCategoryOptions, pagedPriceProducts, selectedPriceProduct, priceTotalCount, priceCurrentPage, setPricePage, priceTotalPages,
    priceDraft, priceDraftStatus, selectedPriceSummary,
    handlePriceFilterChange, handlePriceSelectItem, handlePriceDraftField, handlePriceDraftSeriesName, handlePriceDraftComponentField,
    handleAddPriceComponent, handlePriceDraftDocResetAll, handlePriceDraftDocUpload, handlePriceDraftDocReset, handlePriceDraftDocRemove,
    handleNewPriceProduct, handleSavePriceDraft,
    priceUploadModalOpen, setPriceUploadModalOpen, handleApplyMockUpload,
    filteredClientDiscount, pagedClientDiscount, clientTotalCount, clientCurrentPage, clientPageSize, setClientPage, setClientPageSize,
    selectedDealerDetail,
  };
}
