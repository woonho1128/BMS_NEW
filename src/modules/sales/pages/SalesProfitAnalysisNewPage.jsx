import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody, CardFooter } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { DatePicker } from '../../../shared/components/DatePicker/DatePicker';
import { classnames } from '../../../shared/utils/classnames';
import styles from './SalesProfitAnalysisNewPage.module.css';

const BUSINESS_TYPE_OPTIONS = [{ value: '주택', label: '주택' }, { value: '상가', label: '상가' }, { value: '오피스', label: '오피스' }, { value: '기타', label: '기타' }];
const SALES_MANAGER_OPTIONS = ['김영업', '이팀장', '박대리', '정매니저'];

/** Mock: 품목 마스터 (공장도가, 연도별 원가 2026/2027/2029, 건설사 입찰가율 등) */
const MOCK_ITEM_MASTER = {
  'SET-01': { name: 'SET 제품 A', type: 'SET', factoryPrice: 150000, cost2026: 78000, cost2027: 80000, cost2029: 84500, costIncreaseRate: 2.5, costPerTon: 3200000, bidPriceRate: 1.12 },
  'SET-02': { name: 'SET 제품 B', type: 'SET', factoryPrice: 98000, cost2026: 52000, cost2027: 53400, cost2029: 56400, costIncreaseRate: 2.7, costPerTon: 2100000, bidPriceRate: 1.10 },
  '단품-X': { name: '부품 X', type: '단품', factoryPrice: 28000, cost2026: 15000, cost2027: 15450, cost2029: 16400, costIncreaseRate: 3, costPerTon: 0, bidPriceRate: 1.15 },
  '단품-Y': { name: '부품 Y', type: '단품', factoryPrice: 45000, cost2026: 28000, cost2027: 28840, cost2029: 29700, costIncreaseRate: 3, costPerTon: 0, bidPriceRate: 1.12 },
  '단품-Z': { name: '부품 Z', type: '단품', factoryPrice: 32000, cost2026: 17000, cost2027: 17510, cost2029: 18500, costIncreaseRate: 2.8, costPerTon: 0, bidPriceRate: 1.10 },
};

/** 품목별 수주유형 옵션 */
const ORDER_TYPE_OPTIONS = [
  { value: '정식수주', label: '정식수주' },
  { value: '예약수주', label: '예약수주' },
  { value: '추정수주', label: '추정수주' },
  { value: '기타', label: '기타' },
];

const DEFAULT_ITEM = { id: '', type: 'SET', itemCode: '', itemName: '', orderType: '정식수주', qty: 1, bidPrice: '', marginRateDealer: '', remark: '', unitItemCodes: [] };

/** 마진률 기준 미달 임계값 (%) */
const MARGIN_RATE_MIN = 10;

/** STEP2 하단 결과 테이블 컬럼 수 (구분·SET품번·품목별수주유형·원가·판매·수익성, 비고 컬럼 숨김) */
const STEP2_TABLE_COLS = 16;

/** Mock: id별 편집용 초기 데이터 (실제 연동 시 API) */
function getMockDetail(id) {
  return {
    specType: '신규',
    builder: '(주)테스트건설',
    siteName: 'A사 현장',
    region: '경기',
    orderType: '정식수주',
    businessType: '주택',
    salesManager: '김영업',
    partnerName: '(주)테스트',
    integratedProgress: '미진행',
    paidOption: '미적용',
    totalHouseholds: '500',
    appliedHouseholds: '480',
    costIncreaseRate: '2.5',
    specDate: '2025-01-15',
    expectedDeliveryDate: '2025-06-30',
    completionDate: '2026-12-31',
    originSpecNo: 'ORIG-2025-001',
    remark: '',
    items: [
      { id: '1', type: 'SET', itemCode: 'SET-01', itemName: 'SET 제품 A', orderType: '정식수주', qty: 10, bidPrice: '135000', marginRateDealer: '11', remark: '' },
      { id: '2', type: 'SET', itemCode: 'SET-02', itemName: 'SET 제품 B', orderType: '예약수주', qty: 5, bidPrice: '95000', marginRateDealer: '10.5', remark: '' },
    ],
  };
}

/** 단가(건설사 입찰가) + 대리점 마진율 → 대리점 공급가 */
function calcDealerPrice(bidPrice, marginRateDealer) {
  const bid = Number(bidPrice) || 0;
  const rate = Number(marginRateDealer) || 0;
  if (bid <= 0) return 0;
  return Math.round(bid * (1 - rate / 100));
}

/** 품목별 손익 상세 (자동 계산, 읽기 전용) — 단가+마진율→공급가, 2027 표준원가 */
function getRowDetail(row, use2027 = true) {
  const master = row.itemCode ? MOCK_ITEM_MASTER[row.itemCode] : null;
  if (!master) return null;
  const qty = Number(row.qty) || 1;
  const bidPrice = Number(row.bidPrice) || 0;
  const marginRateDealer = Number(row.marginRateDealer) || 0;
  const dealerPrice = calcDealerPrice(row.bidPrice, row.marginRateDealer);
  const costUnit = use2027 ? (master.cost2027 ?? master.cost2026) : master.cost2026;
  const sales = qty * dealerPrice;
  const cost = qty * costUnit;
  const grossProfit = sales - cost;
  const grossRate = sales > 0 ? (grossProfit / sales) * 100 : 0;
  const grossProfitPerUnit = qty > 0 ? grossProfit / qty : 0;
  const operatingExpense = sales * 0.05;
  const operatingProfit = grossProfit - operatingExpense;
  const operatingRate = sales > 0 ? (operatingProfit / sales) * 100 : 0;
  const operatingProfitPerUnit = qty > 0 ? operatingProfit / qty : 0;
  const discountRate = master.factoryPrice > 0 ? (1 - dealerPrice / master.factoryPrice) * 100 : 0;
  const cost2029 = master.cost2029 ?? master.cost2027;
  return {
    factoryPrice: master.factoryPrice,
    costPerTon: master.costPerTon,
    cost2026: master.cost2026,
    cost2027: master.cost2027 ?? master.cost2026,
    cost2029,
    bidPrice,
    marginRateDealer,
    dealerPrice,
    discountRate,
    grossProfitPerUnit,
    grossRate,
    grossProfit,
    operatingProfitPerUnit,
    operatingRate,
    operatingProfit,
    cost,
    sales,
    remark: row.remark ?? '',
  };
}

/** STEP 1 옵션 (Select용) */
const SPEC_TYPE_OPTIONS = [{ value: '신규', label: '신규' }, { value: '변경', label: '변경' }, { value: '추가', label: '추가' }];
const REGION_OPTIONS = [{ value: '서울', label: '서울' }, { value: '경기', label: '경기' }, { value: '인천', label: '인천' }, { value: '부산', label: '부산' }, { value: '기타', label: '기타' }];
const YES_NO_OPTIONS = [{ value: '진행', label: '진행' }, { value: '미진행', label: '미진행' }];
const APPLY_OPTIONS = [{ value: '적용', label: '적용' }, { value: '미적용', label: '미적용' }];

function useProfitForm(initialData) {
  // STEP 1 – 손익분석 기본 정보
  const [specType, setSpecType] = useState(initialData?.specType ?? '신규');
  const [builder, setBuilder] = useState(initialData?.builder ?? '');
  const [siteName, setSiteName] = useState(initialData?.siteName ?? '');
  const [region, setRegion] = useState(initialData?.region ?? '');
  const [orderType, setOrderType] = useState(initialData?.orderType ?? '정식수주');
  const [businessType, setBusinessType] = useState(initialData?.businessType ?? '주택');
  const [salesManager, setSalesManager] = useState(initialData?.salesManager ?? '');
  const [partnerName, setPartnerName] = useState(initialData?.partnerName ?? '');
  const [integratedProgress, setIntegratedProgress] = useState(initialData?.integratedProgress ?? '미진행');
  const [paidOption, setPaidOption] = useState(initialData?.paidOption ?? '미적용');
  const [totalHouseholds, setTotalHouseholds] = useState(initialData?.totalHouseholds ?? '');
  const [appliedHouseholds, setAppliedHouseholds] = useState(initialData?.appliedHouseholds ?? '');
  const [costIncreaseRate, setCostIncreaseRate] = useState(initialData?.costIncreaseRate ?? '');
  const [specDate, setSpecDate] = useState(initialData?.specDate ?? '');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(initialData?.expectedDeliveryDate ?? '');
  const [completionDate, setCompletionDate] = useState(initialData?.completionDate ?? '');
  const [originSpecNo, setOriginSpecNo] = useState(initialData?.originSpecNo ?? '');
  const [pdfFile, setPdfFile] = useState(initialData?.pdfFile ?? null);
  const [commissionEnabled, setCommissionEnabled] = useState(initialData?.commissionEnabled ?? false);
  const [commissionFee, setCommissionFee] = useState(initialData?.commissionFee ?? '');
  const [remark, setRemark] = useState(initialData?.remark ?? '');
  // STEP 2 – 품목
  const [items, setItems] = useState(
    initialData?.items?.length
      ? initialData.items.map((r, i) => ({ ...DEFAULT_ITEM, ...r, id: r.id || String(i + 1) }))
      : [{ ...DEFAULT_ITEM, id: '1' }]
  );

  const addRow = useCallback(() => {
    setItems((prev) => [...prev, { ...DEFAULT_ITEM, id: String(Date.now()) }]);
  }, []);

  const addRowWithData = useCallback((data) => {
    const master = data.itemCode ? MOCK_ITEM_MASTER[data.itemCode] : null;
    const itemName = master ? master.name : '';
    const unitItemCodes = Array.isArray(data.unitItemCodes) ? data.unitItemCodes : [];
    setItems((prev) => [...prev, { ...DEFAULT_ITEM, ...data, id: String(Date.now()), itemName, unitItemCodes }]);
  }, []);

  const removeRow = useCallback((id) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const setItemOptions = useMemo(() => Object.entries(MOCK_ITEM_MASTER).filter(([, v]) => v.type === 'SET').map(([code, { name }]) => ({ code, name })), []);
  const unitItemOptions = useMemo(() => Object.entries(MOCK_ITEM_MASTER).filter(([, v]) => v.type === '단품').map(([code, { name }]) => ({ code, name })), []);

  const updateRowType = useCallback((rowId, nextType) => {
    setItems((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const next = { ...r, type: nextType };
        if (nextType === 'SET' && !setItemOptions.some((o) => o.code === r.itemCode)) next.itemCode = '';
        if (nextType === '단품' && !unitItemOptions.some((o) => o.code === r.itemCode)) next.itemCode = '';
        if (next.itemCode && MOCK_ITEM_MASTER[next.itemCode]) next.itemName = MOCK_ITEM_MASTER[next.itemCode].name;
        return next;
      })
    );
  }, [setItemOptions, unitItemOptions]);

  const updateRow = useCallback((id, field, value) => {
    setItems((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, [field]: value };
        if (field === 'itemCode') {
          const info = MOCK_ITEM_MASTER[value];
          if (info) {
            next.itemName = info.name;
            next.type = info.type;
          }
        }
        return next;
      })
    );
  }, []);

  const summary = useMemo(() => {
    let totalSales = 0;
    let totalCost = 0;
    items.forEach((row) => {
      const detail = getRowDetail(row, true);
      if (detail) {
        totalSales += detail.sales;
        totalCost += detail.cost;
      }
    });
    const grossProfit = totalSales - totalCost;
    const grossRate = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
    const operatingExpense = totalSales * 0.05;
    const operatingProfit = grossProfit - operatingExpense;
    const operatingRate = totalSales > 0 ? (operatingProfit / totalSales) * 100 : 0;
    const isBelowMin = totalSales > 0 && grossRate < MARGIN_RATE_MIN;
    return { totalSales, totalCost, grossProfit, grossRate, operatingProfit, operatingRate, isBelowMin };
  }, [items]);

  return {
    specType, setSpecType, builder, setBuilder, siteName, setSiteName, region, setRegion,
    orderType, setOrderType, businessType, setBusinessType, salesManager, setSalesManager,
    partnerName, setPartnerName, integratedProgress, setIntegratedProgress, paidOption, setPaidOption,
    totalHouseholds, setTotalHouseholds, appliedHouseholds, setAppliedHouseholds, costIncreaseRate, setCostIncreaseRate,
    specDate, setSpecDate, expectedDeliveryDate, setExpectedDeliveryDate, completionDate, setCompletionDate,
    originSpecNo, setOriginSpecNo, pdfFile, setPdfFile, commissionEnabled, setCommissionEnabled, commissionFee, setCommissionFee,
    remark, setRemark,
    items, addRow, addRowWithData, removeRow, updateRow, updateRowType, summary,
  };
}

const STEP_TITLES = ['손익분석 기본 정보 등록', '납품 품목 구성', '손익 계산 결과 요약'];

export function SalesProfitAnalysisNewPage() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const isEditMode = Boolean(editId);
  const initialData = isEditMode ? getMockDetail(editId) : null;
  const form = useProfitForm(initialData);
  const {
    specType, setSpecType, builder, setBuilder, siteName, setSiteName, region, setRegion,
    orderType, setOrderType, businessType, setBusinessType, salesManager, setSalesManager,
    partnerName, setPartnerName, integratedProgress, setIntegratedProgress, paidOption, setPaidOption,
    totalHouseholds, setTotalHouseholds, appliedHouseholds, setAppliedHouseholds, costIncreaseRate, setCostIncreaseRate,
    specDate, setSpecDate, expectedDeliveryDate, setExpectedDeliveryDate, completionDate, setCompletionDate,
    originSpecNo, setOriginSpecNo, pdfFile, setPdfFile, commissionEnabled, setCommissionEnabled, commissionFee, setCommissionFee,
    remark, setRemark,
    items, addRow, addRowWithData, removeRow, updateRow, updateRowType, summary,
  } = form;

  const [currentStep, setCurrentStep] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState(null);

  /** STEP2: 입력 폼 상태 (Drawer 내 편집용). 자품번 다중 선택: unitItemCodes (SET일 때) */
  const [editForm, setEditForm] = useState({ type: 'SET', itemCode: '', unitItemCodes: [], orderType: '정식수주', qty: 1, bidPrice: '', marginRateDealer: '', remark: '' });
  const [selectedRowId, setSelectedRowId] = useState(null);
  /** STEP2: Drawer 열림 + 모드 (null=닫힘, 'new'=신규, 'edit'=수정) */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null);
  /** STEP2: 비고+자품번 통합 하위 행 펼침 (Set of row.id) */
  const [expandedDetailIds, setExpandedDetailIds] = useState(() => new Set());
  /** STEP3: 비고+자품번 통합 하위 행 펼침 (Set of row.id) - 기본 숨김 */
  const [expandedDetailIdsStep3, setExpandedDetailIdsStep3] = useState(() => new Set());

  const setItemOptions = Object.entries(MOCK_ITEM_MASTER).filter(([, v]) => v.type === 'SET').map(([code, { name }]) => ({ code, name }));
  const unitItemOptions = Object.entries(MOCK_ITEM_MASTER).filter(([, v]) => v.type === '단품').map(([code, { name }]) => ({ code, name }));

  const resetStep2Form = useCallback(() => {
    setEditForm({ type: 'SET', itemCode: '', unitItemCodes: [], orderType: '정식수주', qty: 1, bidPrice: '', marginRateDealer: '', remark: '' });
    setSelectedRowId(null);
  }, []);

  const loadRowIntoForm = useCallback((row) => {
    setEditForm({
      type: row.type ?? 'SET',
      itemCode: row.itemCode ?? '',
      unitItemCodes: Array.isArray(row.unitItemCodes) ? [...row.unitItemCodes] : [],
      orderType: row.orderType ?? '정식수주',
      qty: row.qty ?? 1,
      bidPrice: row.bidPrice ?? '',
      marginRateDealer: row.marginRateDealer ?? '',
      remark: row.remark ?? '',
    });
    setSelectedRowId(row.id);
    setDrawerMode('edit');
    setDrawerOpen(true);
  }, []);

  const openDrawerNew = useCallback(() => {
    resetStep2Form();
    setDrawerMode('new');
    setDrawerOpen(true);
  }, [resetStep2Form]);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setDrawerMode(null);
    setSelectedRowId(null);
  }, []);

  const handleStep2AddRow = useCallback(() => {
    const { type, itemCode, unitItemCodes, orderType, qty, bidPrice, marginRateDealer, remark } = editForm;
    if (!itemCode) return;
    addRowWithData({ type, itemCode, unitItemCodes: type === 'SET' ? (unitItemCodes ?? []) : [], orderType, qty, bidPrice, marginRateDealer, remark });
    resetStep2Form();
    setDrawerOpen(false);
    setDrawerMode(null);
  }, [editForm, addRowWithData, resetStep2Form]);

  const handleStep2SaveEdit = useCallback(() => {
    if (!selectedRowId) return;
    const { type, itemCode, unitItemCodes, orderType, qty, bidPrice, marginRateDealer, remark } = editForm;
    updateRowType(selectedRowId, type);
    updateRow(selectedRowId, 'itemCode', itemCode);
    updateRow(selectedRowId, 'unitItemCodes', type === 'SET' ? (unitItemCodes ?? []) : []);
    updateRow(selectedRowId, 'orderType', orderType);
    updateRow(selectedRowId, 'qty', qty);
    updateRow(selectedRowId, 'bidPrice', bidPrice);
    updateRow(selectedRowId, 'marginRateDealer', marginRateDealer);
    updateRow(selectedRowId, 'remark', remark);
    resetStep2Form();
    setDrawerOpen(false);
    setDrawerMode(null);
  }, [selectedRowId, editForm, updateRow, updateRowType, resetStep2Form]);

  /** 자품번 표시: SET 선택 시 다중 선택, 단품이면 단일 품번 */
  const displayUnitCode = editForm.type === 'SET' ? '-' : (editForm.itemCode || '-');

  /** 자품번 다중 선택 토글 (SET일 때만 사용) — 항상 새 배열로 갱신해 선택 목록이 확실히 반영되도록 */
  const toggleUnitItem = useCallback((code) => {
    setEditForm((f) => {
      const list = Array.isArray(f.unitItemCodes) ? f.unitItemCodes : [];
      const next = list.includes(code) ? list.filter((c) => c !== code) : [...list, code];
      return { ...f, unitItemCodes: next };
    });
  }, []);

  /** STEP2일 때 body 스크롤 차단 (스크롤은 테이블 wrapper만) */
  useEffect(() => {
    if (currentStep === 2) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [currentStep]);

  const handleSubmit = () => {
    console.log(isEditMode ? '수정 저장' : '결재상신', form);
    navigate('/profit');
  };

  const handleTempSave = () => {
    console.log('임시저장', form);
    navigate('/profit');
  };

  const required = (str) => <><span className={styles.required}>*</span> {str}</>;

  return (
    <PageShell
      path="/profit"
      title={isEditMode ? '손익분석 수정' : '손익분석 등록'}
      description="STEP 기반 SPEC 손익분석"
    >
      <div className={classnames(styles.formLayout, styles.formLayoutSingle)}>
        <div className={styles.main}>
          {/* STEP 인디케이터 */}
          <nav className={styles.stepNav} aria-label="진행 단계">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                type="button"
                className={classnames(styles.stepTab, currentStep === step && styles.stepTabActive)}
                onClick={() => setCurrentStep(step)}
              >
                STEP {step} {STEP_TITLES[step - 1]}
              </button>
            ))}
          </nav>

          {/* [STEP 1] 손익분석 기본 정보 등록 */}
          {currentStep === 1 && (
          <>
            <Card title="[STEP 1] 손익분석 기본 정보 등록" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.step1SummaryGrid}>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('스펙구분')}</div>
                    <select className={styles.step1SummaryInput} value={specType} onChange={(e) => setSpecType(e.target.value)}>{SPEC_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('건설회사')}</div>
                    <input type="text" className={styles.step1SummaryInput} placeholder="건설회사 검색" value={builder} onChange={(e) => setBuilder(e.target.value)} />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('현장명')}</div>
                    <input type="text" className={styles.step1SummaryInput} placeholder="현장명" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('지역')}</div>
                    <select className={styles.step1SummaryInput} value={region} onChange={(e) => setRegion(e.target.value)}><option value="">선택</option>{REGION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('수주유형')}</div>
                    <select className={styles.step1SummaryInput} value={orderType} onChange={(e) => setOrderType(e.target.value)}>{ORDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('사업분류')}</div>
                    <select className={styles.step1SummaryInput} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>{BUSINESS_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('영업담당자')}</div>
                    <select className={styles.step1SummaryInput} value={salesManager} onChange={(e) => setSalesManager(e.target.value)}><option value="">선택</option>{SALES_MANAGER_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}</select>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('대리점')}</div>
                    <input type="text" className={styles.step1SummaryInput} placeholder="대리점 검색" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>비대일체형 진행여부</div>
                    <select className={styles.step1SummaryInput} value={integratedProgress} onChange={(e) => setIntegratedProgress(e.target.value)}>{YES_NO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>유상옵션 적용 여부</div>
                    <select className={styles.step1SummaryInput} value={paidOption} onChange={(e) => setPaidOption(e.target.value)}>{APPLY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>총세대수</div>
                    <input type="number" min={0} className={styles.step1SummaryInput} value={totalHouseholds} onChange={(e) => setTotalHouseholds(e.target.value)} placeholder="세대" />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>적용세대수</div>
                    <input type="number" min={0} className={styles.step1SummaryInput} value={appliedHouseholds} onChange={(e) => setAppliedHouseholds(e.target.value)} placeholder="세대" />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>원가 예상 상승률</div>
                    <input type="number" className={styles.step1SummaryInput} placeholder="%" value={costIncreaseRate} onChange={(e) => setCostIncreaseRate(e.target.value)} />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>{required('SPEC 수주일자')}</div>
                    <DatePicker value={specDate} onChange={setSpecDate} className={styles.step1SummaryInput} />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>예상납기일</div>
                    <DatePicker value={expectedDeliveryDate} onChange={setExpectedDeliveryDate} className={styles.step1SummaryInput} />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>준공예정일</div>
                    <DatePicker value={completionDate} onChange={setCompletionDate} className={styles.step1SummaryInput} />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>ORIGIN SPEC NO</div>
                    <input type="text" className={styles.step1SummaryInput} value={originSpecNo} onChange={(e) => setOriginSpecNo(e.target.value)} placeholder="원본 문서 번호" />
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>PDF 첨부</div>
                    <input type="file" accept=".pdf" className={styles.step1SummaryInput} onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
                  </div>
                  <div className={classnames(styles.step1SummaryCard, styles.step1SummaryCardFull)}>
                    <div className={styles.step1SummaryLabel}>지급수수료 적용</div>
                    <div className={styles.commissionControl}>
                      <label className={styles.checkboxRow}>
                        <input type="checkbox" checked={commissionEnabled} onChange={(e) => setCommissionEnabled(e.target.checked)} />
                        <span>적용 시</span>
                      </label>
                      {commissionEnabled && (
                        <span className={styles.commissionInputWrap}>
                          <input type="number" className={styles.inputCommission} value={commissionFee} onChange={(e) => setCommissionFee(e.target.value)} placeholder="금액" min={0} />
                          <span className={styles.unit}>원</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={classnames(styles.step1SummaryCard, styles.step1SummaryCardFull)}>
                    <div className={styles.step1SummaryLabel}>비고</div>
                    <textarea className={styles.step1SummaryTextarea} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="비고 사항을 입력하세요" rows={2} />
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className={styles.stepActions}>
              <Button variant="secondary" onClick={() => navigate('/profit')}>취소</Button>
              <Button variant="primary" onClick={() => setCurrentStep(2)}>다음 단계 (품목 구성)</Button>
            </div>
          </>
          )}

          {/* [STEP 2] 납품 품목 구성 — B(결과 테이블) 메인 + A(입력) Drawer */}
          {currentStep === 2 && (
          <div className={styles.step2Container}>
            <div className={styles.step2TableArea}>
              <div className={styles.step2ActionBar}>
                <Button variant="primary" onClick={openDrawerNew}>+ 품목 추가</Button>
                <span className={styles.step2ActionHint}>행 클릭 시 수정 가능합니다.</span>
              </div>
              <div className={styles.profitTableWrap}>
                <div className={styles.profitTableScroll}>
                  <table className={styles.profitTable}>
                    <colgroup>
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '8%' }} />
                      <col style={{ width: '8%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '6%' }} />
                      <col style={{ width: '7%' }} />
                      <col style={{ width: '7%' }} />
                      <col style={{ width: '3.5%' }} />
                      <col style={{ width: '7%' }} />
                      <col style={{ width: '5%' }} />
                      <col style={{ width: '7%' }} />
                      <col style={{ width: '5.5%' }} />
                      <col style={{ width: '7%' }} />
                      <col style={{ width: '5.5%' }} />
                      <col style={{ width: '7%' }} />
                      <col style={{ width: '6%' }} />
                    </colgroup>
                    <thead>
                      <tr className={styles.colHeader}>
                        <th className={classnames(styles.colBasic, styles.tLeft)} scope="col">구분</th>
                        <th className={classnames(styles.colBasic, styles.tLeft)} scope="col">SET품번</th>
                        <th className={classnames(styles.colBasic, styles.tLeft)} scope="col">품목별<br />수주유형</th>
                        <th className={classnames(styles.colCost, styles.tRight)} scope="col">공장도가</th>
                        <th className={classnames(styles.colCost, styles.tRight)} scope="col">톤당단가</th>
                        <th className={classnames(styles.colCost, styles.tRight)} scope="col">2026년(현재)<br />표준원가</th>
                        <th className={classnames(styles.colCost, styles.tRight)} scope="col">2027년(예상)<br />표준원가</th>
                        <th className={classnames(styles.colSale, styles.tCenter)} scope="col">수량</th>
                        <th className={classnames(styles.colSale, styles.tRight)} scope="col">건설사<br />입찰 단가</th>
                        <th className={classnames(styles.colSale, styles.tRight)} scope="col">대리점<br />마진율</th>
                        <th className={classnames(styles.colSale, styles.tRight)} scope="col">대리점<br />공급가</th>
                        <th className={classnames(styles.colSale, styles.tRight)} scope="col">공장도대비<br />할인율(%)</th>
                        <th className={classnames(styles.colProfit, styles.tRight)} scope="col">매출총이익<br />단가</th>
                        <th className={classnames(styles.colProfit, styles.tRight)} scope="col">매출이익(%)</th>
                        <th className={classnames(styles.colProfit, styles.tRight)} scope="col">영업이익<br />단가</th>
                        <th className={classnames(styles.colProfit, styles.tRight)} scope="col">영업이익(%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={STEP2_TABLE_COLS} className={styles.emptyRow}>데이터가 없습니다.</td>
                        </tr>
                      ) : (() => {
                        const rowsWithDetail = items.filter((row) => getRowDetail(row, true));
                        if (rowsWithDetail.length === 0) {
                          return (
                            <tr key="no-item">
                              <td colSpan={STEP2_TABLE_COLS} className={styles.emptyRow}>품목을 선택해 주세요.</td>
                            </tr>
                          );
                        }
                        const toggleDetail = (e, rowId) => {
                          e.stopPropagation();
                          setExpandedDetailIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(rowId)) next.delete(rowId);
                            else next.add(rowId);
                            return next;
                          });
                        };
                        return rowsWithDetail.map((row) => {
                          const d = getRowDetail(row, true);
                          if (!d) return null;
                          const isSelected = selectedRowId === row.id;
                          const remarkText = d.remark ? String(d.remark).trim() : '';
                          const unitCodes = Array.isArray(row.unitItemCodes) ? row.unitItemCodes : [];
                          const hasUnitCodes = row.type === 'SET' && unitCodes.length > 0;
                          const hasDetail = hasUnitCodes || remarkText;
                          const isDetailOpen = expandedDetailIds.has(row.id);
                          const unitCodesStr = unitCodes.join(',');
                          return (
                            <React.Fragment key={row.id}>
                              {/* 데이터 행: 구분~영업이익% 동일 순서 16컬럼 */}
                              <tr
                                className={classnames(isSelected && styles.isSelected)}
                                onClick={() => loadRowIntoForm(row)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadRowIntoForm(row); } }}
                                aria-pressed={isSelected}
                              >
                                <td className={classnames(styles.tLeft, styles.colTypeWithToggles)}>
                                  {hasDetail && (
                                    <div className={styles.rowTogglesWrap} onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        className={styles.remarkToggleBtn}
                                        onClick={(e) => toggleDetail(e, row.id)}
                                        title={isDetailOpen ? '자품번·비고 접기' : '자품번·비고 펼치기'}
                                        aria-expanded={isDetailOpen}
                                      >
                                        {isDetailOpen ? '▼' : '▶'}
                                      </button>
                                    </div>
                                  )}
                                  <span className={classnames(styles.colTypeLabel, hasDetail && styles.colTypeLabelWithToggle)}>{row.type}</span>
                                </td>
                                <td className={classnames(styles.tLeft)}>{row.type === 'SET' ? row.itemCode : '-'}</td>
                                <td className={classnames(styles.tLeft)}>{row.orderType ?? '-'}</td>
                                <td className={styles.tRight}>{d.factoryPrice.toLocaleString()}</td>
                                <td className={styles.tRight}>{d.costPerTon ? d.costPerTon.toLocaleString() : '-'}</td>
                                <td className={styles.tRight}>{d.cost2026.toLocaleString()}</td>
                                <td className={styles.tRight}>{d.cost2027.toLocaleString()}</td>
                                <td className={styles.tCenter}>{row.qty}</td>
                                <td className={styles.tRight}>{d.bidPrice.toLocaleString()}</td>
                                <td className={styles.tRight}>{d.marginRateDealer}%</td>
                                <td className={styles.tRight}>{d.dealerPrice.toLocaleString()}</td>
                                <td className={styles.tRight}>{d.discountRate.toFixed(1)}%</td>
                                <td className={styles.tRight}>{d.grossProfitPerUnit.toLocaleString()}</td>
                                <td className={classnames(styles.tRight, d.grossRate >= 15 ? styles.rateGood : d.grossRate >= 10 ? styles.rateMid : styles.rateLow)}>{d.grossRate.toFixed(1)}%</td>
                                <td className={styles.tRight}>{d.operatingProfitPerUnit.toLocaleString()}</td>
                                <td className={classnames(styles.tRight, d.operatingRate >= 15 ? styles.rateGood : d.operatingRate >= 10 ? styles.rateMid : styles.rateLow)}>{d.operatingRate.toFixed(1)}%</td>
                              </tr>
                              {isDetailOpen && (
                                <tr className={styles.remarkRow}>
                                  <td colSpan={STEP2_TABLE_COLS} className={styles.remarkRowCell}>
                                    <div className={styles.detailRowContent}>
                                      {hasUnitCodes && <div>자품번 : {unitCodesStr}</div>}
                                      {(hasUnitCodes || remarkText) && <div>비고 : {remarkText || '\u00A0'}</div>}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        });
                      })()}
                    </tbody>
                    <tfoot>
                      <tr className={styles.sumRow}>
                        <td className={classnames(styles.tLeft, styles.sumCell)}></td>
                        <td className={classnames(styles.tLeft, styles.sumCell)}></td>
                        <td className={classnames(styles.tLeft, styles.sumCell)}></td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                        <td className={classnames(styles.tCenter, styles.sumCell)}>{items.reduce((s, r) => s + (Number(r.qty) || 0), 0)}</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}></td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.sales : 0); }, 0).toLocaleString()}</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}></td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.grossProfit : 0); }, 0).toLocaleString()}</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>{summary.totalSales > 0 ? `${summary.grossRate.toFixed(1)}%` : '—'}</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.operatingProfit : 0); }, 0).toLocaleString()}</td>
                        <td className={classnames(styles.tRight, styles.sumCell)}>{summary.totalSales > 0 ? `${summary.operatingRate.toFixed(1)}%` : '—'}</td>
                      </tr>
                    </tfoot>
                    </table>
                </div>
              </div>
            </div>

            <div className={styles.stepActions}>
              <Button variant="secondary" onClick={() => setCurrentStep(1)}>이전 단계</Button>
              <Button variant="primary" onClick={() => setCurrentStep(3)}>다음 단계 (손익 계산)</Button>
            </div>

            {/* A 영역: 품목 입력/수정 Drawer (우측 슬라이드) */}
            {drawerOpen && (
              <>
                <div className={styles.drawerOverlay} onClick={closeDrawer} aria-hidden />
                <div className={styles.drawerPanel} role="dialog" aria-label={drawerMode === 'new' ? '품목 추가' : '품목 수정'}>
                  <div className={styles.drawerHeader}>
                    <h3 className={styles.drawerTitle}>{drawerMode === 'new' ? '품목 추가' : '품목 수정'}</h3>
                    <button type="button" className={styles.drawerClose} onClick={closeDrawer} aria-label="닫기">×</button>
                  </div>
                  <div className={styles.drawerBody}>
                    <div className={styles.step2FormWrap}>
                      <div className={styles.field}>
                        <label className={styles.label}>구분</label>
                        <select className={styles.select} value={editForm.type} onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value, itemCode: '', unitItemCodes: [] }))}>
                          <option value="SET">SET</option>
                          <option value="단품">단품</option>
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>SET품번</label>
                        <select
                          className={styles.select}
                          value={editForm.type === 'SET' ? editForm.itemCode : ''}
                          onChange={(e) => setEditForm((f) => ({ ...f, itemCode: e.target.value }))}
                          disabled={editForm.type !== 'SET'}
                        >
                          <option value="">선택</option>
                          {setItemOptions.map(({ code, name }) => (
                            <option key={code} value={code}>{code} · {name}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>자품번</label>
                        {editForm.type === 'SET' ? (
                          <div className={styles.unitItemMultiSelect}>
                            <div className={styles.unitItemChips}>
                              {(Array.isArray(editForm.unitItemCodes) ? editForm.unitItemCodes : []).map((code) => {
                                const opt = unitItemOptions.find((o) => o.code === code);
                                return (
                                  <span key={code} className={styles.unitItemChip}>
                                    {opt ? `${code} · ${opt.name}` : code}
                                    <button type="button" className={styles.unitItemChipRemove} onClick={(e) => { e.stopPropagation(); toggleUnitItem(code); }} aria-label={`${code} 제거`}>×</button>
                                  </span>
                                );
                              })}
                              {(Array.isArray(editForm.unitItemCodes) ? editForm.unitItemCodes : []).length === 0 && (
                                <span className={styles.unitItemChipEmpty}>선택된 자품번 없음</span>
                              )}
                            </div>
                            <div className={styles.unitItemCheckboxes} role="group" aria-label="자품번 다중 선택">
                              {unitItemOptions.map(({ code, name }) => (
                                <label key={code} className={styles.unitItemCheckLabel}>
                                  <input
                                    type="checkbox"
                                    checked={(Array.isArray(editForm.unitItemCodes) ? editForm.unitItemCodes : []).includes(code)}
                                    onChange={(e) => { e.stopPropagation(); toggleUnitItem(code); }}
                                  />
                                  <span>{code} · {name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <select className={styles.select} value={editForm.itemCode} onChange={(e) => setEditForm((f) => ({ ...f, itemCode: e.target.value }))}>
                            <option value="">선택</option>
                            {unitItemOptions.map(({ code, name }) => (
                              <option key={code} value={code}>{code} · {name}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>품목별 수주유형</label>
                        <select className={styles.select} value={editForm.orderType} onChange={(e) => setEditForm((f) => ({ ...f, orderType: e.target.value }))}>
                          {ORDER_TYPE_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>수량</label>
                        <input type="number" min={1} className={styles.inputNum} value={editForm.qty} onChange={(e) => setEditForm((f) => ({ ...f, qty: e.target.value }))} />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>단가 (건설사 입찰 단가)</label>
                        <input type="number" min={0} className={styles.inputBidPrice} value={editForm.bidPrice} onChange={(e) => setEditForm((f) => ({ ...f, bidPrice: e.target.value }))} placeholder="건설사 입찰가" />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>대리점 마진율 (%)</label>
                        <input type="number" min={0} max={100} step={0.1} className={styles.inputNum} value={editForm.marginRateDealer} onChange={(e) => setEditForm((f) => ({ ...f, marginRateDealer: e.target.value }))} placeholder="%" />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>비고</label>
                        <input type="text" className={styles.input} value={editForm.remark} onChange={(e) => setEditForm((f) => ({ ...f, remark: e.target.value }))} placeholder="비고" />
                      </div>
                    </div>
                  </div>
                  <div className={styles.drawerFooter}>
                    {drawerMode === 'new' ? (
                      <>
                        <Button variant="primary" onClick={handleStep2AddRow}>저장</Button>
                        <Button variant="secondary" onClick={closeDrawer}>취소</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="primary" onClick={handleStep2SaveEdit} disabled={!selectedRowId}>수정 저장</Button>
                        <Button variant="secondary" onClick={closeDrawer}>취소</Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          )}

          {/* [STEP 3] 손익 계산 결과 요약 (읽기 전용) */}
          {currentStep === 3 && (
          <>
            {/* STEP 1 내용 (읽기 전용) */}
            <Card title="[STEP 1] 손익분석 기본 정보" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.step1SummaryGrid}>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>스펙구분</div>
                    <div className={styles.step1SummaryValue}>{specType}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>건설회사</div>
                    <div className={styles.step1SummaryValue}>{builder || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>현장명</div>
                    <div className={styles.step1SummaryValue}>{siteName || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>지역</div>
                    <div className={styles.step1SummaryValue}>{region || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>수주유형</div>
                    <div className={styles.step1SummaryValue}>{orderType || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>사업분류</div>
                    <div className={styles.step1SummaryValue}>{businessType || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>영업담당자</div>
                    <div className={styles.step1SummaryValue}>{salesManager || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>대리점</div>
                    <div className={styles.step1SummaryValue}>{partnerName || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>비대일체형 진행여부</div>
                    <div className={styles.step1SummaryValue}>{integratedProgress || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>유상옵션 적용 여부</div>
                    <div className={styles.step1SummaryValue}>{paidOption || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>총세대수</div>
                    <div className={styles.step1SummaryValue}>{totalHouseholds || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>적용세대수</div>
                    <div className={styles.step1SummaryValue}>{appliedHouseholds || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>원가 예상 상승률</div>
                    <div className={styles.step1SummaryValue}>{costIncreaseRate ? `${costIncreaseRate}%` : '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>SPEC 수주일자</div>
                    <div className={styles.step1SummaryValue}>{specDate || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>예상납기일</div>
                    <div className={styles.step1SummaryValue}>{expectedDeliveryDate || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>준공예정일</div>
                    <div className={styles.step1SummaryValue}>{completionDate || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>ORIGIN SPEC NO</div>
                    <div className={styles.step1SummaryValue}>{originSpecNo || '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>PDF 첨부</div>
                    <div className={styles.step1SummaryValue}>{pdfFile ? pdfFile.name : '-'}</div>
                  </div>
                  <div className={styles.step1SummaryCard}>
                    <div className={styles.step1SummaryLabel}>지급수수료 적용</div>
                    <div className={styles.step1SummaryValue}>{commissionEnabled ? `${commissionFee || 0}원` : '미적용'}</div>
                  </div>
                  <div className={classnames(styles.step1SummaryCard, styles.step1SummaryCardFull)}>
                    <div className={styles.step1SummaryLabel}>비고</div>
                    <div className={styles.step1SummaryValue}>{remark || '-'}</div>
                    {items.length > 0 && (
                      <div className={styles.step1SummaryFooter}>
                        <span>대리점 납품금액(원): {summary.totalSales.toLocaleString()}</span>
                        <span>예상 매출총이익률(%): {summary.totalSales > 0 ? `${summary.grossRate.toFixed(1)}%` : '—'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* STEP 2 테이블 (읽기 전용) */}
            <Card title="[STEP 2] 납품 품목 구성" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.profitTableWrap}>
                  <div className={styles.profitTableScroll}>
                    <table className={styles.profitTable}>
                      <colgroup>
                        <col style={{ width: '6%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '8%' }} />
                        <col style={{ width: '6%' }} />
                        <col style={{ width: '6%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '3.5%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '5.5%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '5.5%' }} />
                        <col style={{ width: '7%' }} />
                        <col style={{ width: '6%' }} />
                      </colgroup>
                      <thead>
                        <tr className={styles.colHeader}>
                          <th className={classnames(styles.colBasic, styles.tLeft)} scope="col">구분</th>
                          <th className={classnames(styles.colBasic, styles.tLeft)} scope="col">SET품번</th>
                          <th className={classnames(styles.colBasic, styles.tLeft)} scope="col">품목별<br />수주유형</th>
                          <th className={classnames(styles.colCost, styles.tRight)} scope="col">공장도가</th>
                          <th className={classnames(styles.colCost, styles.tRight)} scope="col">톤당단가</th>
                          <th className={classnames(styles.colCost, styles.tRight)} scope="col">2026년(현재)<br />표준원가</th>
                          <th className={classnames(styles.colCost, styles.tRight)} scope="col">2027년(예상)<br />표준원가</th>
                          <th className={classnames(styles.colSale, styles.tCenter)} scope="col">수량</th>
                          <th className={classnames(styles.colSale, styles.tRight)} scope="col">건설사<br />입찰 단가</th>
                          <th className={classnames(styles.colSale, styles.tRight)} scope="col">대리점<br />마진율</th>
                          <th className={classnames(styles.colSale, styles.tRight)} scope="col">대리점<br />공급가</th>
                          <th className={classnames(styles.colSale, styles.tRight)} scope="col">공장도대비<br />할인율(%)</th>
                          <th className={classnames(styles.colProfit, styles.tRight)} scope="col">매출총이익<br />단가</th>
                          <th className={classnames(styles.colProfit, styles.tRight)} scope="col">매출이익(%)</th>
                          <th className={classnames(styles.colProfit, styles.tRight)} scope="col">영업이익<br />단가</th>
                          <th className={classnames(styles.colProfit, styles.tRight)} scope="col">영업이익(%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan={STEP2_TABLE_COLS} className={styles.emptyRow}>데이터가 없습니다.</td>
                          </tr>
                        ) : (() => {
                          const rowsWithDetail = items.filter((row) => getRowDetail(row, true));
                          if (rowsWithDetail.length === 0) {
                            return (
                              <tr key="no-item">
                                <td colSpan={STEP2_TABLE_COLS} className={styles.emptyRow}>품목을 선택해 주세요.</td>
                              </tr>
                            );
                          }
                          const toggleDetailStep3 = (e, rowId) => {
                            e.stopPropagation();
                            setExpandedDetailIdsStep3((prev) => {
                              const next = new Set(prev);
                              if (next.has(rowId)) next.delete(rowId);
                              else next.add(rowId);
                              return next;
                            });
                          };
                          return rowsWithDetail.map((row) => {
                            const d = getRowDetail(row, true);
                            if (!d) return null;
                            const remarkText = d.remark ? String(d.remark).trim() : '';
                            const unitCodes = Array.isArray(row.unitItemCodes) ? row.unitItemCodes : [];
                            const hasUnitCodes = row.type === 'SET' && unitCodes.length > 0;
                            const hasDetail = hasUnitCodes || remarkText;
                            const isDetailOpenStep3 = expandedDetailIdsStep3.has(row.id);
                            const unitCodesStr = unitCodes.join(',');
                            return (
                              <React.Fragment key={row.id}>
                                <tr className={styles.readOnlyRow}>
                                  <td className={classnames(styles.tLeft, styles.colTypeWithToggles)}>
                                    {hasDetail && (
                                      <div className={styles.rowTogglesWrap} onClick={(e) => e.stopPropagation()}>
                                        <button
                                          type="button"
                                          className={styles.remarkToggleBtn}
                                          onClick={(e) => toggleDetailStep3(e, row.id)}
                                          title={isDetailOpenStep3 ? '자품번·비고 숨기기' : '자품번·비고 보기'}
                                          aria-expanded={isDetailOpenStep3}
                                        >
                                          {isDetailOpenStep3 ? '▼' : '▶'}
                                        </button>
                                      </div>
                                    )}
                                    <span className={classnames(styles.colTypeLabel, hasDetail && styles.colTypeLabelWithToggle)}>{row.type}</span>
                                  </td>
                                  <td className={classnames(styles.tLeft)}>{row.type === 'SET' ? row.itemCode : '-'}</td>
                                  <td className={classnames(styles.tLeft)}>{row.orderType ?? '-'}</td>
                                  <td className={styles.tRight}>{d.factoryPrice.toLocaleString()}</td>
                                  <td className={styles.tRight}>{d.costPerTon ? d.costPerTon.toLocaleString() : '-'}</td>
                                  <td className={styles.tRight}>{d.cost2026.toLocaleString()}</td>
                                  <td className={styles.tRight}>{d.cost2027.toLocaleString()}</td>
                                  <td className={styles.tCenter}>{row.qty}</td>
                                  <td className={styles.tRight}>{d.bidPrice.toLocaleString()}</td>
                                  <td className={styles.tRight}>{d.marginRateDealer}%</td>
                                  <td className={styles.tRight}>{d.dealerPrice.toLocaleString()}</td>
                                  <td className={styles.tRight}>{d.discountRate.toFixed(1)}%</td>
                                  <td className={styles.tRight}>{d.grossProfitPerUnit.toLocaleString()}</td>
                                  <td className={classnames(styles.tRight, d.grossRate >= 15 ? styles.rateGood : d.grossRate >= 10 ? styles.rateMid : styles.rateLow)}>{d.grossRate.toFixed(1)}%</td>
                                  <td className={styles.tRight}>{d.operatingProfitPerUnit.toLocaleString()}</td>
                                  <td className={classnames(styles.tRight, d.operatingRate >= 15 ? styles.rateGood : d.operatingRate >= 10 ? styles.rateMid : styles.rateLow)}>{d.operatingRate.toFixed(1)}%</td>
                                </tr>
                                {hasDetail && isDetailOpenStep3 && (
                                  <tr className={styles.remarkRow}>
                                    <td colSpan={STEP2_TABLE_COLS} className={styles.remarkRowCell}>
                                      <div className={styles.detailRowContent}>
                                        {hasUnitCodes && <div>자품번 : {unitCodesStr}</div>}
                                        {(hasUnitCodes || remarkText) && <div>비고 : {remarkText || '\u00A0'}</div>}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          });
                        })()}
                      </tbody>
                      <tfoot>
                        <tr className={styles.sumRow}>
                          <td className={classnames(styles.tLeft, styles.sumCell)}></td>
                          <td className={classnames(styles.tLeft, styles.sumCell)}></td>
                          <td className={classnames(styles.tLeft, styles.sumCell)}></td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                          <td className={classnames(styles.tCenter, styles.sumCell)}>{items.reduce((s, r) => s + (Number(r.qty) || 0), 0)}</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>—</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}></td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.sales : 0); }, 0).toLocaleString()}</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}></td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.grossProfit : 0); }, 0).toLocaleString()}</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>{summary.totalSales > 0 ? `${summary.grossRate.toFixed(1)}%` : '—'}</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.operatingProfit : 0); }, 0).toLocaleString()}</td>
                          <td className={classnames(styles.tRight, styles.sumCell)}>{summary.totalSales > 0 ? `${summary.operatingRate.toFixed(1)}%` : '—'}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                <div className={styles.stepActions}>
                  <Button variant="secondary" onClick={() => setCurrentStep(2)}>이전 단계</Button>
                  <Button variant="secondary" onClick={() => navigate('/profit')}>취소</Button>
                  <Button variant="secondary" onClick={handleTempSave}>임시저장</Button>
                  <Button variant="primary" onClick={handleSubmit}>{isEditMode ? '저장' : '결재상신'}</Button>
                </div>
              </CardBody>
            </Card>
          </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
