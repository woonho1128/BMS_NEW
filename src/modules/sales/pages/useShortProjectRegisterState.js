import { useCallback, useMemo, useState } from 'react';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import { createShortProjectApproval } from '../../approval/data/salesApprovalMock';
import {
  BASE_DISCOUNT_RATE,
  computeShortProjectItem,
  computeShortProjectProfitRow,
} from '../utils/shortProjectPricing';
import { getPartnersList } from '../../master/data/partnersMock';
import {
  APPROVER_OPTIONS,
  createItem,
  enrichSites,
  MOCK_SITES,
  parseDate,
  sanitizeNumber,
  summarizeSelectedSites,
  VIEW_MODE,
} from './shortProjectRegister.helpers';

function buildSiteProfitRows(majorItems = [], rowKeyPrefix = 'preview') {
  return majorItems.map((item, index) => {
    const computed = computeShortProjectItem({
      id: `${rowKeyPrefix}-${index}`,
      itemCode: item.code || '',
      qty: String(item.qty ?? 0),
      unit: item.unit || 'EA',
      standardPrice: '300000',
      discountRate: '7',
      note: '',
    });
    return computeShortProjectProfitRow(computed, false);
  });
}

function sumProfitRows(rows = []) {
  return rows.reduce(
    (acc, row) => ({
      costAmount: acc.costAmount + row.costAmount,
      factoryAmount: acc.factoryAmount + row.factoryAmount,
      baseDiscountAmount: acc.baseDiscountAmount + row.baseDiscountAmount,
      appliedDiscountAmount: acc.appliedDiscountAmount + row.appliedDiscountAmount,
    }),
    { costAmount: 0, factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
  );
}

export function useShortProjectRegisterState(navigate) {
  const [mode, setMode] = useState(VIEW_MODE.LIST);
  const [selectedSiteIds, setSelectedSiteIds] = useState([]);
  const [dealerFilter, setDealerFilter] = useState('');
  const [builderFilter, setBuilderFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [deliveryFromFilter, setDeliveryFromFilter] = useState('');
  const [deliveryToFilter, setDeliveryToFilter] = useState('');
  const [expandedSiteId, setExpandedSiteId] = useState('');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [activeSubmitSiteId, setActiveSubmitSiteId] = useState('');
  const [approvalStep1, setApprovalStep1] = useState(APPROVER_OPTIONS[0].id);
  const [approvalStep2, setApprovalStep2] = useState(APPROVER_OPTIONS[2].id);
  const [approvalStep3, setApprovalStep3] = useState(APPROVER_OPTIONS[4].id);
  const [submitComment, setSubmitComment] = useState('');
  const [commonDiscountRate, setCommonDiscountRate] = useState('7');

  const [siteName, setSiteName] = useState('제주 미지정 현장');
  const [builder, setBuilder] = useState('제주개발');
  const [dealer, setDealer] = useState('동신건재');
  const [deliveryFrom, setDeliveryFrom] = useState('2026-04-01');
  const [deliveryTo, setDeliveryTo] = useState('2026-06-20');
  const [isGovernmentProject, setIsGovernmentProject] = useState(false);
  const [duplicateHint, setDuplicateHint] = useState('');
  const [specialNotes, setSpecialNotes] = useState('동종업체 입찰\n관급 공사\n모델하우스 우선 출고');
  const [attachments, setAttachments] = useState([]);
  const [majorItems, setMajorItems] = useState([
    createItem({ itemCode: 'CC-735', qty: '100', unit: 'SET', standardPrice: '300000', discountRate: '7', note: '세트 제외, 부품 포함' }),
    createItem({ itemCode: 'CL-384', qty: '100', unit: 'EA', standardPrice: '280000', discountRate: '5', note: '비고' }),
  ]);
  const [extraDiscountDisabledByItemId, setExtraDiscountDisabledByItemId] = useState({});
  const partnerOptions = useMemo(() => getPartnersList({ status: 'all' }), []);

  const filteredSites = useMemo(() => {
    const from = parseDate(deliveryFromFilter);
    const to = parseDate(deliveryToFilter);
    return MOCK_SITES.filter((site) => {
      const dealerOk = !dealerFilter.trim() || site.dealer.toLowerCase().includes(dealerFilter.trim().toLowerCase());
      const builderOk = !builderFilter.trim() || site.builder.toLowerCase().includes(builderFilter.trim().toLowerCase());
      const siteOk = !siteFilter.trim() || site.siteName.toLowerCase().includes(siteFilter.trim().toLowerCase());
      const fromOk = !from || site.deliveryFrom >= from;
      const toOk = !to || site.deliveryFrom <= to;
      return dealerOk && builderOk && siteOk && fromOk && toOk;
    });
  }, [dealerFilter, builderFilter, siteFilter, deliveryFromFilter, deliveryToFilter]);

  const listSites = useMemo(() => enrichSites(filteredSites), [filteredSites]);
  const allVisibleSelected = useMemo(() => listSites.length > 0 && listSites.every((site) => selectedSiteIds.includes(site.id)), [listSites, selectedSiteIds]);
  const hasAnyVisibleSelected = useMemo(() => listSites.some((site) => selectedSiteIds.includes(site.id)), [listSites, selectedSiteIds]);
  const previewSite = useMemo(() => listSites.find((site) => site.id === expandedSiteId) || null, [listSites, expandedSiteId]);
  const previewProfitRows = useMemo(() => (!previewSite ? [] : buildSiteProfitRows(previewSite.majorItems || [], `preview-${previewSite.id}`)), [previewSite]);
  const previewProfitTotal = useMemo(() => sumProfitRows(previewProfitRows), [previewProfitRows]);
  const selectedSitesForSubmit = useMemo(() => listSites.filter((site) => selectedSiteIds.includes(site.id)), [listSites, selectedSiteIds]);
  const submitSummary = useMemo(() => summarizeSelectedSites(selectedSitesForSubmit), [selectedSitesForSubmit]);
  const activeSubmitSite = useMemo(() => (!selectedSitesForSubmit.length ? null : selectedSitesForSubmit.find((site) => site.id === activeSubmitSiteId) || selectedSitesForSubmit[0]), [selectedSitesForSubmit, activeSubmitSiteId]);
  const activeSubmitProfitRows = useMemo(() => (!activeSubmitSite ? [] : buildSiteProfitRows(activeSubmitSite.majorItems || [], `submit-preview-${activeSubmitSite.id}`)), [activeSubmitSite]);
  const activeSubmitProfitTotal = useMemo(() => sumProfitRows(activeSubmitProfitRows), [activeSubmitProfitRows]);
  const submitSiteTableData = useMemo(() => selectedSitesForSubmit.map((site) => {
    const rows = buildSiteProfitRows(site.majorItems || [], `submit-cover-${site.id}`);
    const total = sumProfitRows(rows);
    return { site, rows, total };
  }), [selectedSitesForSubmit]);
  const submitCoverTotals = useMemo(() => submitSiteTableData.reduce((acc, entry) => ({
    factoryAmount: acc.factoryAmount + entry.total.factoryAmount,
    baseDiscountAmount: acc.baseDiscountAmount + entry.total.baseDiscountAmount,
    appliedDiscountAmount: acc.appliedDiscountAmount + entry.total.appliedDiscountAmount,
  }), { factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }), [submitSiteTableData]);
  const selectedSitesForCompare = useMemo(() => listSites.filter((site) => selectedSiteIds.includes(site.id)).slice(0, 5), [listSites, selectedSiteIds]);
  const compareData = useMemo(() => selectedSitesForCompare.map((site) => {
    const rows = buildSiteProfitRows(site.majorItems || [], `compare-preview-${site.id}`);
    const total = sumProfitRows(rows);
    return { site, rows, total };
  }), [selectedSitesForCompare]);

  const approvalStepLine = useMemo(() => [{ order: 1, approverId: approvalStep1 }, { order: 2, approverId: approvalStep2 }, { order: 3, approverId: approvalStep3 }], [approvalStep1, approvalStep2, approvalStep3]);
  const hasDuplicateApprover = useMemo(() => {
    const ids = approvalStepLine.map((line) => line.approverId).filter(Boolean);
    return new Set(ids).size !== ids.length;
  }, [approvalStepLine]);
  const isSubmitModalValid = Boolean(approvalStep1 && !hasDuplicateApprover);

  const computedItems = useMemo(() => majorItems.map(computeShortProjectItem), [majorItems]);
  const profitRows = useMemo(() => computedItems.map((item) => computeShortProjectProfitRow(item, Boolean(extraDiscountDisabledByItemId[item.id]))), [computedItems, extraDiscountDisabledByItemId]);
  const hasProfitRows = useMemo(() => profitRows.some((row) => row.itemCode.trim()), [profitRows]);
  const profitTotal = useMemo(() => sumProfitRows(profitRows), [profitRows]);
  const total = useMemo(() => computedItems.reduce((acc, item) => ({ standard: acc.standard + item.standardAmount, discounted: acc.discounted + item.amountAfterDiscount }), { standard: 0, discounted: 0 }), [computedItems]);
  const isFormValid = Boolean(siteName.trim() && dealer.trim() && deliveryFrom && computedItems.length > 0);

  const addItemRow = useCallback(() => setMajorItems((prev) => [...prev, createItem()]), []);
  const removeItemRow = useCallback((id) => {
    setMajorItems((prev) => prev.filter((item) => item.id !== id));
    setExtraDiscountDisabledByItemId((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setMajorItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      if (field === 'amount') {
        const amountRaw = sanitizeNumber(value);
        const amount = Number(amountRaw) || 0;
        const qty = Number(item.qty) || 0;
        const derivedPrice = qty > 0 ? Math.floor(amount / qty) : 0;
        return { ...item, standardPrice: String(derivedPrice) };
      }
      if (field === 'qty' || field === 'standardPrice' || field === 'discountRate') {
        return { ...item, [field]: sanitizeNumber(value) };
      }
      return { ...item, [field]: value };
    }));
  }, []);

  const applyCommonDiscountRate = useCallback(() => {
    const nextRate = sanitizeNumber(commonDiscountRate);
    const numeric = Number(nextRate);
    if (!Number.isFinite(numeric)) return;
    const clamped = Math.min(11, Math.max(1, numeric));
    const normalized = String(clamped);
    setCommonDiscountRate(normalized);
    setMajorItems((prev) => prev.map((item) => ({ ...item, discountRate: normalized })));
  }, [commonDiscountRate]);

  const loadSiteToForm = useCallback((site) => {
    setSiteName(site.siteName);
    setBuilder(site.builder);
    setDealer(site.dealer);
    setDeliveryFrom(site.deliveryFrom);
    setDeliveryTo(site.deliveryTo);
    setIsGovernmentProject(site.isGovernmentProject ?? String(site.notes || '').includes('관급'));
    setSpecialNotes(site.notes.replace(/, /g, '\n'));
    setAttachments([]);
    setDuplicateHint('');
    setMajorItems(site.majorItems.map((item) => createItem({ itemCode: item.code, qty: String(item.qty), unit: item.unit, standardPrice: '300000', discountRate: commonDiscountRate, note: '' })));
    setExtraDiscountDisabledByItemId({});
    setMode(VIEW_MODE.FORM);
  }, [commonDiscountRate]);

  const openForm = useCallback(() => setMode(VIEW_MODE.FORM), []);
  const backToList = useCallback(() => setMode(VIEW_MODE.LIST), []);
  const saveDraft = useCallback(() => notify.info('단납 현장이 임시저장되었습니다. (목업)'), []);

  const toggleSiteSelection = useCallback((siteId, checked) => {
    setSelectedSiteIds((prev) => {
      if (checked) return prev.includes(siteId) ? prev : [...prev, siteId];
      return prev.filter((id) => id !== siteId);
    });
  }, []);

  const toggleAllVisibleSelection = useCallback((checked) => {
    const visibleIds = listSites.map((site) => site.id);
    setSelectedSiteIds((prev) => {
      if (checked) return Array.from(new Set([...prev, ...visibleIds]));
      return prev.filter((id) => !visibleIds.includes(id));
    });
  }, [listSites]);

  const submitForm = useCallback(() => {
    if (!isFormValid) return;
    createShortProjectApproval({
      siteName, builder, dealer, deliveryFrom, deliveryTo,
      specialNote: specialNotes,
      isGovernmentProject,
      items: computedItems.map((item) => ({
        itemCode: item.itemCode,
        qty: Number(item.qty) || 0,
        unit: item.unit,
        standardPrice: Number(item.standardPrice) || 0,
        discountRate: Number(item.discountRate) || 0,
        standardAmount: Number(item.standardAmount) || 0,
        unitPrice: Number(item.unitPriceAfterDiscount) || 0,
        amount: Number(item.amountAfterDiscount) || 0,
        discountAmount: (Number(item.standardAmount) || 0) - (Number(item.amountAfterDiscount) || 0),
        note: item.note || '',
      })),
      attachments: attachments.map((file) => ({ name: file.name, size: file.size })),
      grossRate: '-',
      drafter: '영업담당',
    });
    navigate(`${ROUTES.APPROVAL_SALES}?category=shortProject`);
  }, [isFormValid, siteName, builder, dealer, deliveryFrom, deliveryTo, specialNotes, isGovernmentProject, attachments, computedItems, navigate]);

  const addAttachments = useCallback((event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setAttachments((prev) => {
      const exists = new Set(prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      const next = files.filter((file) => !exists.has(`${file.name}-${file.size}-${file.lastModified}`));
      return [...prev, ...next];
    });
    event.target.value = '';
  }, []);

  const removeAttachment = useCallback((targetFile) => {
    setAttachments((prev) => prev.filter((file) => !(file.name === targetFile.name && file.size === targetFile.size && file.lastModified === targetFile.lastModified)));
  }, []);

  const submitSelectedSites = useCallback(() => {
    if (!selectedSitesForSubmit.length) return;
    if (!isSubmitModalValid) return;

    const approvalLine = approvalStepLine.filter((line) => line.approverId).map((line) => {
      const approver = APPROVER_OPTIONS.find((item) => item.id === line.approverId);
      return { order: line.order, approverId: line.approverId, approverName: approver?.name || '-', approverDept: approver?.dept || '-' };
    });
    const submitGroupId = `submit-group-${Date.now()}`;
    const submitSummaryPayload = {
      selectedCount: submitSummary.count,
      itemCount: submitSummary.itemCount,
      baseDiscountAmount: submitSummary.baseDiscountAmount,
      shortDiscountAmount: submitSummary.shortDiscountAmount,
    };

    selectedSitesForSubmit.forEach((site) => {
      createShortProjectApproval({
        siteName: site.siteName,
        builder: site.builder,
        dealer: site.dealer,
        deliveryFrom: site.deliveryFrom,
        deliveryTo: site.deliveryTo,
        specialNote: site.notes,
        items: (site.majorItems || []).map((item) => ({
          itemCode: item.code,
          qty: Number(item.qty) || 0,
          unit: item.unit || 'EA',
          standardPrice: 300000,
          discountRate: 0,
          standardAmount: (Number(item.qty) || 0) * 300000,
          unitPrice: 300000,
          amount: (Number(item.qty) || 0) * 300000,
          discountAmount: 0,
          note: '',
        })),
        grossRate: '-',
        drafter: site.author || '영업담당',
        submitComment: submitComment.trim(),
        approvalLine,
        submitGroupId,
        submitSummary: submitSummaryPayload,
      });
    });

    setSubmitModalOpen(false);
    setSubmitComment('');
    setSelectedSiteIds([]);
    navigate(`${ROUTES.APPROVAL_SALES}?category=shortProject`);
  }, [approvalStepLine, isSubmitModalValid, navigate, selectedSitesForSubmit, submitComment, submitSummary]);

  const openSubmitModal = useCallback(() => {
    if (!selectedSitesForSubmit.length) return;
    setActiveSubmitSiteId(selectedSitesForSubmit[0].id);
    setSubmitModalOpen(true);
  }, [selectedSitesForSubmit]);

  const openCompareModal = useCallback(() => {
    if (selectedSiteIds.length < 2) {
      notify.warning('비교하기는 현장 2건 이상 선택 시 가능합니다.');
      return;
    }
    if (selectedSiteIds.length > 5) {
      notify.warning('비교하기는 최대 5건까지 가능합니다.');
      return;
    }
    setCompareModalOpen(true);
  }, [selectedSiteIds.length]);

  return {
    mode,
    setMode,
    selectedSiteIds,
    dealerFilter,
    setDealerFilter,
    builderFilter,
    setBuilderFilter,
    siteFilter,
    setSiteFilter,
    deliveryFromFilter,
    setDeliveryFromFilter,
    deliveryToFilter,
    setDeliveryToFilter,
    expandedSiteId,
    setExpandedSiteId,
    submitModalOpen,
    setSubmitModalOpen,
    compareModalOpen,
    setCompareModalOpen,
    activeSubmitSiteId,
    setActiveSubmitSiteId,
    approvalStep1,
    setApprovalStep1,
    approvalStep2,
    setApprovalStep2,
    approvalStep3,
    setApprovalStep3,
    submitComment,
    setSubmitComment,
    commonDiscountRate,
    setCommonDiscountRate,
    siteName,
    setSiteName,
    builder,
    setBuilder,
    dealer,
    setDealer,
    deliveryFrom,
    setDeliveryFrom,
    deliveryTo,
    setDeliveryTo,
    isGovernmentProject,
    setIsGovernmentProject,
    duplicateHint,
    specialNotes,
    setSpecialNotes,
    attachments,
    majorItems,
    extraDiscountDisabledByItemId,
    setExtraDiscountDisabledByItemId,
    partnerOptions,
    listSites,
    allVisibleSelected,
    hasAnyVisibleSelected,
    previewSite,
    previewProfitRows,
    previewProfitTotal,
    selectedSitesForSubmit,
    submitSummary,
    activeSubmitSite,
    activeSubmitProfitRows,
    activeSubmitProfitTotal,
    submitSiteTableData,
    submitCoverTotals,
    compareData,
    hasDuplicateApprover,
    isSubmitModalValid,
    computedItems,
    profitRows,
    hasProfitRows,
    profitTotal,
    total,
    isFormValid,
    addItemRow,
    removeItemRow,
    updateItem,
    applyCommonDiscountRate,
    loadSiteToForm,
    openForm,
    backToList,
    saveDraft,
    toggleSiteSelection,
    toggleAllVisibleSelection,
    submitForm,
    addAttachments,
    removeAttachment,
    submitSelectedSites,
    openSubmitModal,
    openCompareModal,
    sanitizeNumber,
    BASE_DISCOUNT_RATE,
    APPROVER_OPTIONS,
    VIEW_MODE,
  };
}
