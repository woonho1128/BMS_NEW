import React, { Fragment, Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import { formatDateRange, formatFileSize, formatNumber } from '../../../shared/utils/formatters';
import { createShortProjectApproval } from '../../approval/data/salesApprovalMock';
import {
  BASE_DISCOUNT_RATE,
  computeShortProjectItem,
  computeShortProjectProfitRow,
} from '../utils/shortProjectPricing';
import { getPartnersList } from '../../master/data/partnersMock';
import styles from './ShortProjectRegisterPage.module.css';

const ShortProjectPricingPreviewModal = lazy(() => import('./components/ShortProjectPricingPreviewModal'));
const ShortProjectSubmitModal = lazy(() => import('./components/ShortProjectSubmitModal'));
const ShortProjectCompareModal = lazy(() => import('./components/ShortProjectCompareModal'));

const VIEW_MODE = {
  LIST: 'list',
  FORM: 'form',
};

const APPROVER_OPTIONS = [
  { id: 'apv-kim-jh', name: '김지훈 부장', dept: '영업1팀' },
  { id: 'apv-lee-sy', name: '이서윤 팀장', dept: '영업기획팀' },
  { id: 'apv-park-dh', name: '박동현 이사', dept: '영업본부' },
  { id: 'apv-choi-mh', name: '최민호 상무', dept: '관리본부' },
  { id: 'apv-jung-hr', name: '정하림 전무', dept: '본사' },
];

const MOCK_SITE_BASE = [
  {
    id: 'site-1',
    dealer: '동신건재',
    siteName: '제주 신선고 기숙사',
    builder: 'XX종건',
    isGovernmentProject: true,
    deliveryFrom: '2026-03-05',
    deliveryTo: '2026-09-30',
    notes: '관급 공사 현장, XX설비 견적요청, 동종업체 입찰',
    majorItems: [
      { code: 'CC-735', qty: 100, unit: 'SET' },
      { code: 'CL-384', qty: 100, unit: 'EA' },
    ],
    createdAt: '2026-03-01',
  },
  {
    id: 'site-2',
    dealer: '동신건재',
    siteName: '제주 미지정 현장',
    builder: '제주개발',
    isGovernmentProject: false,
    deliveryFrom: '2026-04-01',
    deliveryTo: '2026-06-20',
    notes: '모델하우스 우선 출고, 동시견적 검토 가능',
    majorItems: [{ code: 'CC-735', qty: 120, unit: 'SET' }],
    createdAt: '2026-03-18',
  },
];

const MOCK_SITES = Array.from({ length: 20 }, (_, index) => {
  const base = MOCK_SITE_BASE[index % MOCK_SITE_BASE.length];
  const month = String((index % 12) + 1).padStart(2, '0');
  const dayFrom = String((index % 20) + 1).padStart(2, '0');
  const dayTo = String(((index % 20) + 8)).padStart(2, '0');
  return {
    ...base,
    id: `site-${index + 1}`,
    siteName: `${base.siteName} ${index + 1}`,
    deliveryFrom: `2026-${month}-${dayFrom}`,
    deliveryTo: `2026-${month}-${dayTo}`,
    createdAt: `2026-${month}-${String((index % 25) + 1).padStart(2, '0')}`,
  };
});

const EMPTY_ITEM = {
  id: '',
  itemCode: '',
  qty: '1',
  unit: 'EA',
  standardPrice: '0',
  discountRate: '0',
  note: '',
};

function nextItemId() {
  return `item-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function createItem(overrides = {}) {
  return {
    ...EMPTY_ITEM,
    id: nextItemId(),
    ...overrides,
  };
}

function sanitizeNumber(value) {
  return String(value || '').replace(/[^\d.-]/g, '');
}

function parseDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function ShortProjectRegisterPage() {
  const navigate = useNavigate();
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
    createItem({
      itemCode: 'CC-735',
      qty: '100',
      unit: 'SET',
      standardPrice: '300000',
      discountRate: '7',
      note: '세트 제외, 부품 포함',
    }),
    createItem({
      itemCode: 'CL-384',
      qty: '100',
      unit: 'EA',
      standardPrice: '280000',
      discountRate: '5',
      note: '비고',
    }),
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

  const listSites = useMemo(
    () =>
      filteredSites.map((site, index) => ({
        ...site,
        baseDiscountAmount: site.baseDiscountAmount ?? ((index + 1) * 1800000 + 5400000),
        shortDiscountAmount: site.shortDiscountAmount ?? ((index + 1) * 1450000 + 4100000),
        author: site.author ?? ['김영업', '이순희', '박준호'][index % 3],
        status: site.status ?? ['결재 진행', '임시 저장', '결재 완료'][index % 3],
      })),
    [filteredSites]
  );

  const allVisibleSelected = useMemo(
    () => listSites.length > 0 && listSites.every((site) => selectedSiteIds.includes(site.id)),
    [listSites, selectedSiteIds]
  );

  const hasAnyVisibleSelected = useMemo(
    () => listSites.some((site) => selectedSiteIds.includes(site.id)),
    [listSites, selectedSiteIds]
  );
  const previewSite = useMemo(
    () => listSites.find((site) => site.id === expandedSiteId) || null,
    [listSites, expandedSiteId]
  );
  const previewProfitRows = useMemo(() => {
    if (!previewSite) return [];
    return (previewSite.majorItems || []).map((item, index) => {
      const computed = computeShortProjectItem({
        id: `preview-${previewSite.id}-${index}`,
        itemCode: item.code || '',
        qty: String(item.qty ?? 0),
        unit: item.unit || 'EA',
        standardPrice: '300000',
        discountRate: '7',
        note: '',
      });
      return computeShortProjectProfitRow(computed, false);
    });
  }, [previewSite]);
  const previewProfitTotal = useMemo(
    () =>
      previewProfitRows.reduce(
        (acc, row) => ({
          costAmount: acc.costAmount + row.costAmount,
          factoryAmount: acc.factoryAmount + row.factoryAmount,
          baseDiscountAmount: acc.baseDiscountAmount + row.baseDiscountAmount,
          appliedDiscountAmount: acc.appliedDiscountAmount + row.appliedDiscountAmount,
        }),
        { costAmount: 0, factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
      ),
    [previewProfitRows]
  );
  const selectedSitesForSubmit = useMemo(
    () => listSites.filter((site) => selectedSiteIds.includes(site.id)),
    [listSites, selectedSiteIds]
  );
  const submitSummary = useMemo(
    () =>
      selectedSitesForSubmit.reduce(
        (acc, site) => ({
          count: acc.count + 1,
          baseDiscountAmount: acc.baseDiscountAmount + (Number(site.baseDiscountAmount) || 0),
          shortDiscountAmount: acc.shortDiscountAmount + (Number(site.shortDiscountAmount) || 0),
          itemCount: acc.itemCount + (site.majorItems?.length || 0),
        }),
        { count: 0, baseDiscountAmount: 0, shortDiscountAmount: 0, itemCount: 0 }
      ),
    [selectedSitesForSubmit]
  );
  const activeSubmitSite = useMemo(() => {
    if (!selectedSitesForSubmit.length) return null;
    return selectedSitesForSubmit.find((site) => site.id === activeSubmitSiteId) || selectedSitesForSubmit[0];
  }, [selectedSitesForSubmit, activeSubmitSiteId]);
  const activeSubmitProfitRows = useMemo(() => {
    if (!activeSubmitSite) return [];
    return (activeSubmitSite.majorItems || []).map((item, index) => {
      const computed = computeShortProjectItem({
        id: `submit-preview-${activeSubmitSite.id}-${index}`,
        itemCode: item.code || '',
        qty: String(item.qty ?? 0),
        unit: item.unit || 'EA',
        standardPrice: '300000',
        discountRate: '7',
        note: '',
      });
      return computeShortProjectProfitRow(computed, false);
    });
  }, [activeSubmitSite]);
  const activeSubmitProfitTotal = useMemo(
    () =>
      activeSubmitProfitRows.reduce(
        (acc, row) => ({
          costAmount: acc.costAmount + row.costAmount,
          factoryAmount: acc.factoryAmount + row.factoryAmount,
          baseDiscountAmount: acc.baseDiscountAmount + row.baseDiscountAmount,
          appliedDiscountAmount: acc.appliedDiscountAmount + row.appliedDiscountAmount,
        }),
        { costAmount: 0, factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
      ),
    [activeSubmitProfitRows]
  );
  const submitSiteTableData = useMemo(
    () =>
      selectedSitesForSubmit.map((site) => {
        const rows = (site.majorItems || []).map((item, index) => {
          const computed = computeShortProjectItem({
            id: `submit-cover-${site.id}-${index}`,
            itemCode: item.code || '',
            qty: String(item.qty ?? 0),
            unit: item.unit || 'EA',
            standardPrice: '300000',
            discountRate: '7',
            note: '',
          });
          return computeShortProjectProfitRow(computed, false);
        });

        const total = rows.reduce(
          (acc, row) => ({
            costAmount: acc.costAmount + row.costAmount,
            factoryAmount: acc.factoryAmount + row.factoryAmount,
            baseDiscountAmount: acc.baseDiscountAmount + row.baseDiscountAmount,
            appliedDiscountAmount: acc.appliedDiscountAmount + row.appliedDiscountAmount,
          }),
          { costAmount: 0, factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
        );

        return { site, rows, total };
      }),
    [selectedSitesForSubmit]
  );
  const submitCoverTotals = useMemo(
    () =>
      submitSiteTableData.reduce(
        (acc, entry) => ({
          factoryAmount: acc.factoryAmount + entry.total.factoryAmount,
          baseDiscountAmount: acc.baseDiscountAmount + entry.total.baseDiscountAmount,
          appliedDiscountAmount: acc.appliedDiscountAmount + entry.total.appliedDiscountAmount,
        }),
        { factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
      ),
    [submitSiteTableData]
  );
  const selectedSitesForCompare = useMemo(
    () => listSites.filter((site) => selectedSiteIds.includes(site.id)).slice(0, 5),
    [listSites, selectedSiteIds]
  );
  const compareData = useMemo(
    () =>
      selectedSitesForCompare.map((site) => {
        const rows = (site.majorItems || []).map((item, index) => {
          const computed = computeShortProjectItem({
            id: `compare-preview-${site.id}-${index}`,
            itemCode: item.code || '',
            qty: String(item.qty ?? 0),
            unit: item.unit || 'EA',
            standardPrice: '300000',
            discountRate: '7',
            note: '',
          });
          return computeShortProjectProfitRow(computed, false);
        });

        const total = rows.reduce(
          (acc, row) => ({
            costAmount: acc.costAmount + row.costAmount,
            factoryAmount: acc.factoryAmount + row.factoryAmount,
            baseDiscountAmount: acc.baseDiscountAmount + row.baseDiscountAmount,
            appliedDiscountAmount: acc.appliedDiscountAmount + row.appliedDiscountAmount,
          }),
          { costAmount: 0, factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
        );

        return { site, rows, total };
      }),
    [selectedSitesForCompare]
  );
  const approvalStepLine = useMemo(
    () => [
      { order: 1, approverId: approvalStep1 },
      { order: 2, approverId: approvalStep2 },
      { order: 3, approverId: approvalStep3 },
    ],
    [approvalStep1, approvalStep2, approvalStep3]
  );
  const hasDuplicateApprover = useMemo(() => {
    const ids = approvalStepLine.map((line) => line.approverId).filter(Boolean);
    return new Set(ids).size !== ids.length;
  }, [approvalStepLine]);
  const isSubmitModalValid = Boolean(approvalStep1 && !hasDuplicateApprover);

  const computedItems = useMemo(() => majorItems.map(computeShortProjectItem), [majorItems]);
  const profitRows = useMemo(
    () =>
      computedItems.map((item) =>
        computeShortProjectProfitRow(item, Boolean(extraDiscountDisabledByItemId[item.id]))
      ),
    [computedItems, extraDiscountDisabledByItemId]
  );
  const hasProfitRows = useMemo(() => profitRows.some((row) => row.itemCode.trim()), [profitRows]);
  const profitTotal = useMemo(
    () =>
      profitRows.reduce(
        (acc, row) => ({
          costAmount: acc.costAmount + row.costAmount,
          factoryAmount: acc.factoryAmount + row.factoryAmount,
          baseDiscountAmount: acc.baseDiscountAmount + row.baseDiscountAmount,
          appliedDiscountAmount: acc.appliedDiscountAmount + row.appliedDiscountAmount,
        }),
        { costAmount: 0, factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
      ),
    [profitRows]
  );

  const total = useMemo(
    () =>
      computedItems.reduce(
        (acc, item) => ({
          standard: acc.standard + item.standardAmount,
          discounted: acc.discounted + item.amountAfterDiscount,
        }),
        { standard: 0, discounted: 0 }
      ),
    [computedItems]
  );

  const isFormValid = Boolean(siteName.trim() && dealer.trim() && deliveryFrom && computedItems.length > 0);

  const addItemRow = useCallback(() => {
    setMajorItems((prev) => [...prev, createItem()]);
  }, []);

  const removeItemRow = useCallback((id) => {
    setMajorItems((prev) => prev.filter((item) => item.id !== id));
    setExtraDiscountDisabledByItemId((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setMajorItems((prev) =>
      prev.map((item) => {
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
      })
    );
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
    setMajorItems(
      site.majorItems.map((item) =>
        createItem({
          itemCode: item.code,
          qty: String(item.qty),
          unit: item.unit,
          standardPrice: '300000',
          discountRate: commonDiscountRate,
          note: '',
        })
      )
    );
    setExtraDiscountDisabledByItemId({});
    setMode(VIEW_MODE.FORM);
  }, [commonDiscountRate]);

  const openForm = useCallback(() => {
    setMode(VIEW_MODE.FORM);
  }, []);

  const backToList = useCallback(() => {
    setMode(VIEW_MODE.LIST);
  }, []);

  const saveDraft = useCallback(() => {
    notify.info('단납 현장이 임시저장되었습니다. (목업)');
  }, []);

  const toggleSiteSelection = useCallback((siteId, checked) => {
    setSelectedSiteIds((prev) => {
      if (checked) return prev.includes(siteId) ? prev : [...prev, siteId];
      return prev.filter((id) => id !== siteId);
    });
  }, []);

  const toggleAllVisibleSelection = useCallback(
    (checked) => {
      const visibleIds = listSites.map((site) => site.id);
      setSelectedSiteIds((prev) => {
        if (checked) return Array.from(new Set([...prev, ...visibleIds]));
        return prev.filter((id) => !visibleIds.includes(id));
      });
    },
    [listSites]
  );

  const submitForm = useCallback(() => {
    if (!isFormValid) return;
    createShortProjectApproval({
      siteName,
      builder,
      dealer,
      deliveryFrom,
      deliveryTo,
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
    setAttachments((prev) =>
      prev.filter(
        (file) =>
          !(
            file.name === targetFile.name &&
            file.size === targetFile.size &&
            file.lastModified === targetFile.lastModified
          )
      )
    );
  }, []);

  const submitSelectedSites = useCallback(() => {
    if (!selectedSitesForSubmit.length) return;
    if (!isSubmitModalValid) return;

    const approvalLine = approvalStepLine
      .filter((line) => line.approverId)
      .map((line) => {
        const approver = APPROVER_OPTIONS.find((item) => item.id === line.approverId);
        return {
          order: line.order,
          approverId: line.approverId,
          approverName: approver?.name || '-',
          approverDept: approver?.dept || '-',
        };
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

  const listActions = (
    <Button variant="primary" onClick={openForm}>
      등록하기
    </Button>
  );

  const formActions = (
    <Button variant="secondary" onClick={backToList}>
      목록으로
    </Button>
  );

  return (
    <PageShell
      path={ROUTES.SHORT_PROJECT_REGISTER}
      title="단납 현장 등록"
      description={
        mode === VIEW_MODE.LIST
          ? '기존 등록 현장을 조회하고 신규 등록으로 이어서 작업하세요'
          : '기본 정보와 대표품번을 입력하여 결재 상신할 수 있습니다.'
      }
      actions={mode === VIEW_MODE.LIST ? listActions : formActions}
      className={styles.shellWide}
    >
      <div className={styles.page}>
        {mode === VIEW_MODE.LIST ? (
          <>
            <Card title="조회 조건" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.searchRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>대리점</label>
                    <input
                      className={styles.input}
                      value={dealerFilter}
                      onChange={(e) => setDealerFilter(e.target.value)}
                      placeholder="대리점 검색"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>건설사</label>
                    <input
                      className={styles.input}
                      value={builderFilter}
                      onChange={(e) => setBuilderFilter(e.target.value)}
                      placeholder="건설사검색"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>현장명</label>
                    <input
                      className={styles.input}
                      value={siteFilter}
                      onChange={(e) => setSiteFilter(e.target.value)}
                      placeholder="현장명검색"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>납품예정일</label>
                    <div className={styles.dateRange}>
                      <input
                        className={styles.input}
                        type="date"
                        value={deliveryFromFilter}
                        onChange={(e) => setDeliveryFromFilter(e.target.value)}
                      />
                      <span className={styles.rangeDivider}>~</span>
                      <input
                        className={styles.input}
                        type="date"
                        value={deliveryToFilter}
                        onChange={(e) => setDeliveryToFilter(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card title={`조회 결과 (${listSites.length}건)`} className={styles.sectionCard}>
              <CardBody tight>
                <div className={styles.tableWrap}>
                  <table className={styles.listTable}>
                    <thead>
                      <tr>
                        <th className={styles.checkboxCol}>
                          <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = hasAnyVisibleSelected && !allVisibleSelected;
                            }}
                            onChange={(e) => toggleAllVisibleSelection(e.target.checked)}
                            aria-label="전체 선택"
                          />
                        </th>
                        <th>대리점</th>
                        <th>현장명</th>
                        <th>건설사</th>
                        <th>납품예정일</th>
                        <th>관급공사</th>
                        <th>특이사항</th>
                        <th>기본 할인 금액</th>
                        <th>단납 할인 금액</th>
                        <th>대표품번</th>
                        <th>작성자</th>
                        <th>등록일자</th>
                        <th>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listSites.map((site) => (
                        <Fragment key={site.id}>
                          <tr
                            className={styles.clickableRow}
                            onClick={() => loadSiteToForm(site)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                loadSiteToForm(site);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <td className={styles.checkboxCol} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedSiteIds.includes(site.id)}
                                onChange={(e) => toggleSiteSelection(site.id, e.target.checked)}
                                aria-label={`${site.siteName} 선택`}
                              />
                            </td>
                            <td>{site.dealer}</td>
                            <td>{site.siteName}</td>
                            <td>{site.builder}</td>
                            <td>{formatDateRange(site.deliveryFrom, site.deliveryTo)}</td>
                            <td className={styles.centerCell}>
                              <input
                                type="checkbox"
                                checked={site.isGovernmentProject ?? String(site.notes || '').includes('관급')}
                                readOnly
                                tabIndex={-1}
                                aria-label="관급공사 여부"
                              />
                            </td>
                            <td>{site.notes}</td>
                            <td className={styles.numberCell}>{formatNumber(site.baseDiscountAmount)}</td>
                            <td className={styles.numberCell}>{formatNumber(site.shortDiscountAmount)}</td>
                            <td>
                              <button
                                type="button"
                                className={styles.textButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedSiteId((prev) => (prev === site.id ? '' : site.id));
                                }}
                              >
                                {expandedSiteId === site.id ? '닫기' : '보기'}
                              </button>
                            </td>
                            <td>{site.author}</td>
                            <td>{site.createdAt}</td>
                            <td>{site.status}</td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.listFooter}>
                  <Button
                    variant="secondary"
                    onClick={openCompareModal}
                    disabled={selectedSiteIds.length < 2 || selectedSiteIds.length > 5}
                  >
                    비교하기
                  </Button>
                  <Button variant="primary" onClick={openSubmitModal} disabled={selectedSiteIds.length === 0}>
                    상신하기
                  </Button>
                </div>
              </CardBody>
            </Card>

          </>
        ) : (
          <>
            <Card title="기본 정보" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>
                      현장명<span className={styles.required}>*</span>
                    </label>
                    <input className={styles.input} value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                    {duplicateHint ? <p className={styles.helper}>{duplicateHint}</p> : null}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>건설사</label>
                    <input className={styles.input} value={builder} onChange={(e) => setBuilder(e.target.value)} />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>
                      대리점 <span className={styles.required}>*</span>
                    </label>
                    <select
                      className={styles.input}
                      value={dealer}
                      onChange={(e) => setDealer(e.target.value)}
                    >
                      <option value="">대리점 카드 목록에서 선택</option>
                      {partnerOptions.map((partner) => (
                        <option key={partner.id} value={partner.name}>
                          {partner.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>납품예정</label>
                    <div className={styles.dateRange}>
                      <input className={styles.input} type="date" value={deliveryFrom} onChange={(e) => setDeliveryFrom(e.target.value)} />
                      <span className={styles.rangeDivider}>~</span>
                      <input className={styles.input} type="date" value={deliveryTo} onChange={(e) => setDeliveryTo(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className={styles.conditionRow}>
                  <label className={styles.conditionCheck}>
                    <input
                      type="checkbox"
                      checked={isGovernmentProject}
                      onChange={(e) => setIsGovernmentProject(e.target.checked)}
                    />
                    관급공사
                  </label>
                </div>
              </CardBody>
            </Card>

            <Card
              title="단납 품목"
              className={styles.sectionCard}
              actions={
                <Button variant="secondary" onClick={addItemRow}>
                  단납 품목 추가
                </Button>
              }
            >
              <CardBody tight>
                <div className={styles.tableWrap}>
                  <table className={styles.itemTable}>
                    <colgroup>
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '50%' }} />
                      <col style={{ width: '8%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>품목</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th>특이사항</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {computedItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <input
                              className={styles.tableInput}
                              value={item.itemCode}
                              onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                              placeholder="예) CC-735"
                            />
                          </td>
                          <td>
                            <input
                              className={styles.tableInput}
                              inputMode="numeric"
                              value={item.qty}
                              onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className={styles.tableInput}
                              inputMode="numeric"
                              value={String(item.standardAmount || 0)}
                              onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                              placeholder="금액 입력"
                            />
                          </td>
                          <td>
                            <input
                              className={styles.tableInput}
                              value={item.note}
                              onChange={(e) => updateItem(item.id, 'note', e.target.value)}
                              placeholder="비고"
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className={styles.deleteRowButton}
                              onClick={() => removeItemRow(item.id)}
                              disabled={computedItems.length <= 1}
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={2}>합계</td>
                        <td className={styles.numberCell}>{formatNumber(total.standard)}</td>
                        <td />
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardBody>
            </Card>

            {hasProfitRows && (
              <Card title="자동 계산 테이블" className={styles.sectionCard}>
                <CardBody tight>
                  <div className={styles.bulkDiscountBar}>
                    <span className={styles.bulkDiscountLabel}>실질할인율 일괄 적용(1~11%)</span>
                    <input
                      className={styles.bulkDiscountInput}
                      inputMode="decimal"
                      value={commonDiscountRate}
                      onChange={(e) => setCommonDiscountRate(sanitizeNumber(e.target.value))}
                    />
                    <Button variant="secondary" onClick={applyCommonDiscountRate}>
                      전체 적용
                    </Button>
                  </div>
                  <div className={styles.tableWrap}>
                    <table className={styles.profitTable}>
                      <thead>
                        <tr>
                          <th rowSpan={2}>구분</th>
                          <th rowSpan={2}>단위</th>
                          <th rowSpan={2}>수량</th>
                          <th rowSpan={2}>제조원가(기준단가)</th>
                          <th colSpan={2}>공장도가(25년 06월)</th>
                          <th colSpan={4}>{`기본 할인가(${BASE_DISCOUNT_RATE}%)`}</th>
                          <th colSpan={4}>단납 공급가(기본 할인가 기준)</th>
                          <th rowSpan={2}>매출총이익 금액</th>
                          <th rowSpan={2}>매출 총 이익율</th>
                          <th rowSpan={2}>추가 할인 미적용</th>
                        </tr>
                        <tr>
                          <th>단가</th>
                          <th>금액</th>
                          <th>단가</th>
                          <th>금액</th>
                          <th>차액</th>
                          <th>공장도대비</th>
                          <th>단가</th>
                          <th>금액</th>
                          <th>차액</th>
                          <th>실질할인율</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profitRows
                          .filter((row) => row.itemCode.trim())
                          .map((row) => (
                            <tr key={row.id}>
                              <td>{row.itemCode}</td>
                              <td>{row.unit || '-'}</td>
                              <td className={styles.numberCell}>{formatNumber(row.qty)}</td>
                              <td className={styles.numberCell}>{formatNumber(row.costUnitPrice)}</td>
                              <td className={styles.numberCell}>{formatNumber(row.factoryUnitPrice)}</td>
                              <td className={styles.numberCell}>{formatNumber(row.factoryAmount)}</td>
                              <td className={styles.numberCell}>{formatNumber(row.baseDiscountUnitPrice)}</td>
                              <td className={styles.numberCell}>{formatNumber(row.baseDiscountAmount)}</td>
                              <td className={styles.numberCell}>{formatNumber(row.baseDiscountDiff)}</td>
                              <td className={styles.numberCell}>{row.baseVsFactoryRate.toFixed(2)}%</td>
                              <td className={styles.numberCell}>{formatNumber(row.appliedDiscountUnitPrice)}</td>
                              <td className={styles.numberCell}>{formatNumber(row.appliedDiscountAmount)}</td>
                              <td className={styles.numberCell}>{formatNumber(row.appliedDiscountDiff)}</td>
                              <td className={styles.centerCell}>
                                {extraDiscountDisabledByItemId[row.id] ? (
                                  <input className={styles.rateInput} value="0" disabled />
                                ) : (
                                <input
                                  className={styles.rateInput}
                                  inputMode="decimal"
                                  value={String(Math.min(11, Math.max(1, Number(row.discountRate ?? 0) || 1)))}
                                  onChange={(e) => {
                                    const next = sanitizeNumber(e.target.value);
                                    const numeric = Number(next);
                                    if (!Number.isFinite(numeric)) return;
                                    const clamped = String(Math.min(11, Math.max(1, numeric)));
                                    updateItem(row.id, 'discountRate', clamped);
                                  }}
                                />
                                )}
                              </td>
                              <td className={styles.numberCell}>{formatNumber(row.grossProfitAmount)}</td>
                              <td className={styles.numberCell}>{row.grossProfitRate.toFixed(2)}%</td>
                              <td className={styles.centerCell}>
                                <input
                                  type="checkbox"
                                  checked={extraDiscountDisabledByItemId[row.id] ?? false}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setExtraDiscountDisabledByItemId((prev) => ({
                                      ...prev,
                                      [row.id]: checked,
                                    }));
                                    if (checked) {
                                      updateItem(row.id, 'discountRate', '0');
                                    }
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={5}>합계</td>
                          <td className={styles.numberCell}>{formatNumber(profitTotal.factoryAmount)}</td>
                          <td />
                          <td className={styles.numberCell}>{formatNumber(profitTotal.baseDiscountAmount)}</td>
                          <td className={styles.numberCell}>
                            {formatNumber(profitTotal.baseDiscountAmount - profitTotal.factoryAmount)}
                          </td>
                          <td className={styles.numberCell}>
                            {profitTotal.factoryAmount
                              ? (((profitTotal.baseDiscountAmount - profitTotal.factoryAmount) / profitTotal.factoryAmount) * 100).toFixed(2)
                              : '0.00'}
                            %
                          </td>
                          <td />
                          <td className={styles.numberCell}>{formatNumber(profitTotal.appliedDiscountAmount)}</td>
                          <td className={styles.numberCell}>
                            {formatNumber(profitTotal.appliedDiscountAmount - profitTotal.factoryAmount)}
                          </td>
                          <td className={styles.numberCell}>
                            {profitTotal.factoryAmount
                              ? (((profitTotal.appliedDiscountAmount - profitTotal.factoryAmount) / profitTotal.factoryAmount) * 100).toFixed(2)
                              : '0.00'}
                            %
                          </td>
                          <td className={styles.numberCell}>
                            {formatNumber(profitTotal.appliedDiscountAmount - profitTotal.costAmount)}
                          </td>
                          <td className={styles.numberCell}>
                            {profitTotal.appliedDiscountAmount
                              ? (((profitTotal.appliedDiscountAmount - profitTotal.costAmount) / profitTotal.appliedDiscountAmount) * 100).toFixed(2)
                              : '0.00'}
                            %
                          </td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardBody>
              </Card>
            )}

            <Card title="특이사항 / 첨부파일" className={styles.sectionCard}>
              <CardBody>
                <textarea
                  className={styles.textarea}
                  rows={6}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="동종업체 입찰, 관급 공사, 모델하우스 우선 출고 등"
                />
                <div className={styles.attachmentUploadRow}>
                  <input
                    id="short-project-attachments"
                    className={styles.attachmentInput}
                    type="file"
                    multiple
                    onChange={addAttachments}
                  />
                  <label htmlFor="short-project-attachments" className={styles.attachmentUploadButton}>
                    파일 선택
                  </label>
                  <p className={styles.helper}>견적서, 도면, 협의 자료 등을 첨부할 수 있습니다.</p>
                </div>
                {attachments.length > 0 ? (
                  <ul className={styles.attachmentList}>
                    {attachments.map((file) => (
                      <li key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.attachmentItem}>
                        <span className={styles.attachmentName}>{file.name}</span>
                        <span className={styles.attachmentSize}>{formatFileSize(file.size)}</span>
                        <button
                          type="button"
                          className={styles.attachmentDelete}
                          onClick={() => removeAttachment(file)}
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.helper}>첨부된 파일이 없습니다.</p>
                )}
              </CardBody>
            </Card>

            <div className={styles.footer}>
              <Button variant="secondary" onClick={backToList}>
                취소
              </Button>
              <Button variant="secondary" onClick={saveDraft}>
                임시저장
              </Button>
              <Button variant="primary" onClick={submitForm} disabled={!isFormValid}>
                결재 상신
              </Button>
            </div>
          </>
        )}
                <Suspense fallback={null}>
          <ShortProjectPricingPreviewModal
            open={Boolean(previewSite)}
            site={previewSite}
            rows={previewProfitRows}
            total={previewProfitTotal}
            formatNumber={formatNumber}
            baseDiscountRate={BASE_DISCOUNT_RATE}
            onClose={() => setExpandedSiteId('')}
          />
          <ShortProjectSubmitModal
            open={submitModalOpen}
            selectedSitesForSubmit={selectedSitesForSubmit}
            submitSiteTableData={submitSiteTableData}
            submitCoverTotals={submitCoverTotals}
            activeSubmitSite={activeSubmitSite}
            activeSubmitSiteId={activeSubmitSiteId}
            setActiveSubmitSiteId={setActiveSubmitSiteId}
            submitSummary={submitSummary}
            activeSubmitProfitRows={activeSubmitProfitRows}
            activeSubmitProfitTotal={activeSubmitProfitTotal}
            formatNumber={formatNumber}
            formatDateRange={formatDateRange}
            baseDiscountRate={BASE_DISCOUNT_RATE}
            approverOptions={APPROVER_OPTIONS}
            approvalStep1={approvalStep1}
            approvalStep2={approvalStep2}
            approvalStep3={approvalStep3}
            setApprovalStep1={setApprovalStep1}
            setApprovalStep2={setApprovalStep2}
            setApprovalStep3={setApprovalStep3}
            hasDuplicateApprover={hasDuplicateApprover}
            submitComment={submitComment}
            setSubmitComment={setSubmitComment}
            isSubmitModalValid={isSubmitModalValid}
            onClose={() => setSubmitModalOpen(false)}
            onSubmit={submitSelectedSites}
          />
          <ShortProjectCompareModal
            open={compareModalOpen}
            compareData={compareData}
            formatNumber={formatNumber}
            baseDiscountRate={BASE_DISCOUNT_RATE}
            onClose={() => setCompareModalOpen(false)}
          />
        </Suspense>
      </div>
    </PageShell>
  );
}

export default ShortProjectRegisterPage;







