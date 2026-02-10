import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { RichTextEditor } from '../../../shared/components/RichTextEditor';
import { classnames } from '../../../shared/utils/classnames';
import { ROUTES } from '../../../router/routePaths';
import { MOCK_PROFIT_LIST, getProfitDetail, MOCK_ITEM_MASTER } from '../data/profitAnalysisMock';
import styles from './SalesInfoRegisterPage.module.css';

/** 단가(건설사 입찰가) + 대리점 마진율 → 대리점 공급가 */
function calcDealerPrice(bidPrice, marginRateDealer) {
  const bid = Number(bidPrice) || 0;
  const rate = Number(marginRateDealer) || 0;
  if (bid <= 0) return 0;
  return Math.round(bid * (1 - rate / 100));
}

/** 품목별 손익 상세 계산 (테이블용) */
function getRowDetail(row) {
  const master = row.itemCode ? MOCK_ITEM_MASTER[row.itemCode] : null;
  if (!master) return null;
  const qty = Number(row.qty) || 1;
  const marginRateDealer = Number(row.marginRateDealer) || 0;
  const dealerPrice = calcDealerPrice(row.bidPrice, row.marginRateDealer);
  const costUnit = master.cost2027 ?? master.cost2026 ?? 0;
  const sales = qty * dealerPrice;
  const cost = qty * costUnit;
  const grossProfit = sales - cost;
  const grossRate = sales > 0 ? (grossProfit / sales) * 100 : 0;
  const grossProfitPerUnit = qty > 0 ? grossProfit / qty : 0;
  const operatingExpense = sales * 0.05;
  const operatingProfit = grossProfit - operatingExpense;
  const operatingRate = sales > 0 ? (operatingProfit / sales) * 100 : 0;
  const discountRate = master.factoryPrice > 0 ? (1 - dealerPrice / master.factoryPrice) * 100 : 0;
  return {
    factoryPrice: master.factoryPrice,
    costUnit,
    dealerPrice,
    discountRate,
    grossProfitPerUnit,
    grossRate,
    grossProfit,
    operatingRate,
    operatingProfit,
    cost,
    sales,
  };
}

/** 영업정보 등록 시 선택 가능한 손익 = profit 목록과 동일 (결재완료만 선택 가능) */
const PROFIT_LIST_FOR_REGISTER = MOCK_PROFIT_LIST.filter((i) => i.status === 'approved');

const PROGRESS_OPTIONS = ['진행중', '완료', '대기'];
const PAID_OPTION_OPTIONS = ['적용', '미적용'];

/** 입력 방식: 손익 선택 vs 직접 입력 */
const INPUT_MODE = { SELECT: 'select', DIRECT: 'direct' };

/** 직접 입력 시 SW SPEC NO 자동 채번 (실제 연동 시 API에서 발번) */
function generateSpecNo() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Date.now() % 100000)).padStart(5, '0');
  return `SW-SPEC-${year}-${seq}`;
}

export function SalesInfoRegisterPage() {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState(INPUT_MODE.SELECT);
  const [selectedProfitId, setSelectedProfitId] = useState('');
  const [profitSearchQuery, setProfitSearchQuery] = useState('');
  const [isProfitDropdownOpen, setIsProfitDropdownOpen] = useState(false);
  /** 직접 입력 시 기준 정보 (SW SPEC NO는 자동 채번) */
  const [directSpecNo, setDirectSpecNo] = useState('');
  const [directBuilder, setDirectBuilder] = useState('');
  const [directSiteName, setDirectSiteName] = useState('');
  const [directPartnerName, setDirectPartnerName] = useState('');
  const [directOrderType, setDirectOrderType] = useState('정식수주');
  const [directGrossProfitRate, setDirectGrossProfitRate] = useState('');
  const [directOperatingProfitRate, setDirectOperatingProfitRate] = useState('');
  /** 영업정보 입력 (손익/직접 공통) */
  const [progress, setProgress] = useState('');
  const [salesManager, setSalesManager] = useState('');
  const [deliveryManager, setDeliveryManager] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [paidOption, setPaidOption] = useState('');
  const [remark, setRemark] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  /** 선택한 손익 = getProfitDetail 로 손익에 입력된 전체 컬럼 반환 */
  const selectedProfit = useMemo(() => {
    return selectedProfitId ? getProfitDetail(selectedProfitId) : null;
  }, [selectedProfitId]);

  /** 직접 입력 모드로 전환될 때만 SW SPEC NO 자동 채번 */
  const prevInputModeRef = React.useRef(inputMode);
  useEffect(() => {
    if (prevInputModeRef.current !== INPUT_MODE.DIRECT && inputMode === INPUT_MODE.DIRECT) {
      setDirectSpecNo(generateSpecNo());
    }
    prevInputModeRef.current = inputMode;
  }, [inputMode]);

  /** 손익 선택이 바뀔 때만 영업정보 입력란에 손익 값으로 채움 (중복 입력 제거) */
  const lastSyncedProfitIdRef = React.useRef(null);
  useEffect(() => {
    if (inputMode !== INPUT_MODE.SELECT || !selectedProfit) {
      if (inputMode === INPUT_MODE.DIRECT) lastSyncedProfitIdRef.current = null;
      return;
    }
    if (lastSyncedProfitIdRef.current === selectedProfitId) return;
    lastSyncedProfitIdRef.current = selectedProfitId;
    setSalesManager(selectedProfit.salesManager ?? '');
    setExpectedDeliveryDate(selectedProfit.expectedDeliveryDate ?? '');
    setCompletionDate(selectedProfit.completionDate ?? '');
    setPaidOption(selectedProfit.paidOption ?? '');
    setRemark(selectedProfit.remark ?? '');
  }, [inputMode, selectedProfitId, selectedProfit]);

  /** 드롭다운 목록: profit 목록 중 결재완료만, 검색어로 필터 */
  const filteredProfitList = useMemo(() => {
    if (!profitSearchQuery.trim()) return PROFIT_LIST_FOR_REGISTER;
    const query = profitSearchQuery.toLowerCase();
    return PROFIT_LIST_FOR_REGISTER.filter((item) => {
      const detail = getProfitDetail(item.id);
      return (
        item.title.toLowerCase().includes(query) ||
        (detail?.specNo || '').toLowerCase().includes(query) ||
        (detail?.builder || '').toLowerCase().includes(query) ||
        (detail?.siteName || '').toLowerCase().includes(query)
      );
    });
  }, [profitSearchQuery]);

  const handleProfitSelect = useCallback((id) => {
    setSelectedProfitId(id);
    const detail = getProfitDetail(id);
    if (detail) {
      setProfitSearchQuery(`${detail.title} (${detail.specNo})`);
    }
    setIsProfitDropdownOpen(false);
  }, []);

  const handleProfitSearchChange = useCallback((e) => {
    setProfitSearchQuery(e.target.value);
    setIsProfitDropdownOpen(true);
    if (!e.target.value.trim()) {
      setSelectedProfitId('');
    }
  }, []);

  const isFormValid = useMemo(() => {
    const baseOk = progress && salesManager.trim() && deliveryManager.trim() && expectedDeliveryDate && completionDate;
    if (inputMode === INPUT_MODE.SELECT) {
      return Boolean(selectedProfitId) && baseOk;
    }
    return Boolean(directSpecNo && directBuilder.trim() && directSiteName.trim() && directPartnerName.trim()) && baseOk;
  }, [inputMode, selectedProfitId, directSpecNo, directBuilder, directSiteName, directPartnerName, progress, salesManager, deliveryManager, expectedDeliveryDate, completionDate]);

  const handleSave = useCallback(() => {
    if (!isFormValid) return;
    const payload = {
      inputMode,
      progress,
      salesManager,
      deliveryManager,
      expectedDeliveryDate,
      completionDate,
      paidOption,
      remark,
      attachmentFile,
      pdfFile,
    };
    if (inputMode === INPUT_MODE.SELECT) {
      payload.profitAnalysisId = selectedProfitId;
      payload.profitDetail = selectedProfit;
    } else {
      payload.directBase = {
        specNo: directSpecNo,
        builder: directBuilder,
        siteName: directSiteName,
        partnerName: directPartnerName,
        orderType: directOrderType,
        grossProfitRate: directGrossProfitRate ? Number(directGrossProfitRate) : null,
        operatingProfitRate: directOperatingProfitRate ? Number(directOperatingProfitRate) : null,
      };
    }
    console.log('영업정보 저장', payload);
    navigate(ROUTES.SALES_INFO);
  }, [
    isFormValid,
    inputMode,
    selectedProfitId,
    selectedProfit,
    directSpecNo,
    directBuilder,
    directSiteName,
    directPartnerName,
    directOrderType,
    directGrossProfitRate,
    directOperatingProfitRate,
    progress,
    salesManager,
    deliveryManager,
    expectedDeliveryDate,
    completionDate,
    paidOption,
    remark,
    attachmentFile,
    pdfFile,
    navigate,
  ]);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.SALES_INFO);
  }, [navigate]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!target.closest('[data-searchable-select]')) {
        setIsProfitDropdownOpen(false);
      }
    };
    if (isProfitDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfitDropdownOpen]);

  return (
    <PageShell path="/sales/info" title="영업정보 등록">
      <div className={styles.page}>
        {/* 입력 방식: 손익 선택 / 직접 입력 */}
        <div className={styles.inputModeSection}>
          <span className={styles.inputModeLabel}>입력 방식</span>
          <div className={styles.inputModeRadioGroup} role="radiogroup" aria-label="입력 방식">
            <label className={styles.inputModeRadio}>
              <input
                type="radio"
                name="inputMode"
                checked={inputMode === INPUT_MODE.SELECT}
                onChange={() => setInputMode(INPUT_MODE.SELECT)}
              />
              <span>손익분석 선택</span>
            </label>
            <label className={styles.inputModeRadio}>
              <input
                type="radio"
                name="inputMode"
                checked={inputMode === INPUT_MODE.DIRECT}
                onChange={() => setInputMode(INPUT_MODE.DIRECT)}
              />
              <span>직접 입력</span>
            </label>
          </div>
        </div>

        {/* 손익분석 선택 (선택 모드일 때만) */}
        {inputMode === INPUT_MODE.SELECT && (
          <div className={styles.profitSelectSection}>
            <div className={styles.field}>
              <label className={styles.label}>
                손익분석 <span className={styles.required}>*</span>
              </label>
              <div className={styles.searchableSelect} data-searchable-select>
                <input
                  type="text"
                  className={styles.select}
                  placeholder="손익분석 검색 (제목, SPEC NO, 건설회사, 현장명)"
                  value={profitSearchQuery}
                  onChange={handleProfitSearchChange}
                  onFocus={() => setIsProfitDropdownOpen(true)}
                  aria-label="손익분석 검색"
                />
                {isProfitDropdownOpen && filteredProfitList.length > 0 && (
                  <div className={styles.dropdown}>
                    {filteredProfitList.map((item) => {
                      const detail = getProfitDetail(item.id);
                      return (
                        <div
                          key={item.id}
                          className={classnames(
                            styles.dropdownItem,
                            selectedProfitId === item.id && styles.dropdownItemSelected
                          )}
                          onClick={() => handleProfitSelect(item.id)}
                        >
                          <div className={styles.dropdownItemTitle}>{item.title}</div>
                          <div className={styles.dropdownItemMeta}>
                            {detail?.specNo ?? '-'} · {detail?.builder ?? '-'} · {detail?.siteName ?? '-'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {isProfitDropdownOpen && filteredProfitList.length === 0 && profitSearchQuery.trim() && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownEmpty}>검색 결과가 없습니다.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 기준 정보: 선택 시 읽기 전용(중복 제거) / 직접 입력 시 입력란 */}
        {inputMode === INPUT_MODE.SELECT && selectedProfit && (
          <Card title="손익 기준 정보" className={styles.sectionCard}>
            <CardBody>
              <p className={styles.infoNote}>영업담당자, 예상납기일, 준공예정일, 유상옵션, 비고는 아래 영업정보 입력에서 입력·수정합니다.</p>
              <div className={styles.infoCardGrid}>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>SW SPEC NO</span>
                  <span className={styles.infoCardValue}>{selectedProfit.specNo ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>스펙구분</span>
                  <span className={styles.infoCardValue}>{selectedProfit.specType ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>건설회사</span>
                  <span className={styles.infoCardValue}>{selectedProfit.builder ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>현장명</span>
                  <span className={styles.infoCardValue}>{selectedProfit.siteName ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>지역</span>
                  <span className={styles.infoCardValue}>{selectedProfit.region ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>수주유형</span>
                  <span className={styles.infoCardValue}>{selectedProfit.orderType ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>사업분류</span>
                  <span className={styles.infoCardValue}>{selectedProfit.businessType ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>대리점</span>
                  <span className={styles.infoCardValue}>{selectedProfit.partnerName ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>비대일체형 진행여부</span>
                  <span className={styles.infoCardValue}>{selectedProfit.integratedProgress ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>총세대수</span>
                  <span className={styles.infoCardValue}>{selectedProfit.totalHouseholds ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>적용세대수</span>
                  <span className={styles.infoCardValue}>{selectedProfit.appliedHouseholds ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>원가 예상 상승률</span>
                  <span className={styles.infoCardValue}>{selectedProfit.costIncreaseRate ? `${selectedProfit.costIncreaseRate}%` : '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>SPEC 수주일자</span>
                  <span className={styles.infoCardValue}>{selectedProfit.specDate ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>ORIGIN SPEC NO</span>
                  <span className={styles.infoCardValue}>{selectedProfit.originSpecNo ?? '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>PDF 첨부</span>
                  <span className={styles.infoCardValue}>{selectedProfit.pdfFileName ? selectedProfit.pdfFileName : '-'}</span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>지급수수료 적용</span>
                  <span className={styles.infoCardValue}>
                    {selectedProfit.commissionEnabled ? `${selectedProfit.commissionFee || 0}원` : '미적용'}
                  </span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>매출총이익률(%)</span>
                  <span className={styles.infoCardValue}>
                    {typeof selectedProfit.grossProfitRate === 'number' ? selectedProfit.grossProfitRate.toFixed(1) : '-'}
                  </span>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoCardLabel}>영업이익률(%)</span>
                  <span className={styles.infoCardValue}>
                    {typeof selectedProfit.operatingProfitRate === 'number' ? selectedProfit.operatingProfitRate.toFixed(1) : '-'}
                  </span>
                </div>
                {selectedProfit.totalSales != null && selectedProfit.totalSales > 0 && (
                  <div className={classnames(styles.infoCard, styles.infoCardFull)}>
                    <span className={styles.infoCardLabel}>대리점 납품금액 / 예상 매출총이익률</span>
                    <div className={styles.infoCardFooter}>
                      <span>대리점 납품금액(원): {Number(selectedProfit.totalSales).toLocaleString()}</span>
                      <span>예상 매출총이익률(%): {typeof selectedProfit.grossProfitRate === 'number' ? `${selectedProfit.grossProfitRate.toFixed(1)}%` : '—'}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {inputMode === INPUT_MODE.DIRECT && (
          <Card title="기준 정보 (직접 입력)" className={styles.sectionCard}>
            <CardBody>
              <div className={styles.formCardGrid}>
                <div className={styles.formCard}>
                  <label className={styles.formCardLabel}>SW SPEC NO (자동 채번)</label>
                  <div className={styles.directSpecNoValue} aria-readonly>{directSpecNo || '—'}</div>
                </div>
                <div className={styles.formCard}>
                  <label className={styles.formCardLabel}>건설회사 <span className={styles.required}>*</span></label>
                  <input type="text" className={styles.formCardInput} placeholder="건설회사" value={directBuilder} onChange={(e) => setDirectBuilder(e.target.value)} />
                </div>
                <div className={styles.formCard}>
                  <label className={styles.formCardLabel}>현장명 <span className={styles.required}>*</span></label>
                  <input type="text" className={styles.formCardInput} placeholder="현장명" value={directSiteName} onChange={(e) => setDirectSiteName(e.target.value)} />
                </div>
                <div className={styles.formCard}>
                  <label className={styles.formCardLabel}>대리점 <span className={styles.required}>*</span></label>
                  <input type="text" className={styles.formCardInput} placeholder="대리점" value={directPartnerName} onChange={(e) => setDirectPartnerName(e.target.value)} />
                </div>
                <div className={styles.formCard}>
                  <label className={styles.formCardLabel}>수주유형</label>
                  <select className={styles.formCardInput} value={directOrderType} onChange={(e) => setDirectOrderType(e.target.value)}>
                    <option value="정식수주">정식수주</option>
                    <option value="예약수주">예약수주</option>
                    <option value="추정수주">추정수주</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div className={styles.formCard}>
                  <label className={styles.formCardLabel}>매출총이익률(%)</label>
                  <input type="number" step="0.1" className={styles.formCardInput} placeholder="%" value={directGrossProfitRate} onChange={(e) => setDirectGrossProfitRate(e.target.value)} />
                </div>
                <div className={styles.formCard}>
                  <label className={styles.formCardLabel}>영업이익률(%)</label>
                  <input type="number" step="0.1" className={styles.formCardInput} placeholder="%" value={directOperatingProfitRate} onChange={(e) => setDirectOperatingProfitRate(e.target.value)} />
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* 영업정보 추가 입력 영역 - 카드 형태 */}
        <Card title="영업정보 입력" className={styles.sectionCard}>
          <CardBody>
            <div className={styles.formCardGrid}>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>
                  진행사항 <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.formCardInput}
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  aria-label="진행사항"
                >
                  <option value="">선택하세요</option>
                  {PROGRESS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>
                  영업담당자 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formCardInput}
                  placeholder="영업담당자 입력"
                  value={salesManager}
                  onChange={(e) => setSalesManager(e.target.value)}
                  aria-label="영업담당자"
                />
              </div>

              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>
                  납품담당자 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formCardInput}
                  placeholder="납품담당자 입력"
                  value={deliveryManager}
                  onChange={(e) => setDeliveryManager(e.target.value)}
                  aria-label="납품담당자"
                />
              </div>

              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>
                  예상납기일 <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.formCardInput}
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  aria-label="예상납기일"
                />
              </div>

              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>
                  준공예정일 <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.formCardInput}
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  aria-label="준공예정일"
                />
              </div>

              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>유상옵션 적용여부</label>
                <select
                  className={styles.formCardInput}
                  value={paidOption}
                  onChange={(e) => setPaidOption(e.target.value)}
                  aria-label="유상옵션 적용여부"
                >
                  <option value="">선택하세요</option>
                  {PAID_OPTION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className={classnames(styles.formCard, styles.formCardFull)}>
                <label className={styles.formCardLabel}>비고</label>
                <RichTextEditor
                  value={remark}
                  onChange={setRemark}
                  placeholder="비고를 입력하세요"
                />
              </div>

              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>첨부파일</label>
                <input
                  type="file"
                  className={styles.formCardInput}
                  onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                  aria-label="첨부파일"
                />
                {attachmentFile && (
                  <div className={styles.fileName}>{attachmentFile.name}</div>
                )}
              </div>

              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>PDF 첨부</label>
                <input
                  type="file"
                  accept=".pdf"
                  className={styles.formCardInput}
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  aria-label="PDF 첨부"
                />
                {pdfFile && (
                  <div className={styles.fileName}>{pdfFile.name}</div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 납품 품목 구성 테이블 */}
        {selectedProfit && selectedProfit.items && selectedProfit.items.length > 0 && (
          <Card title="납품 품목 구성" className={styles.sectionCard}>
            <CardBody tight>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <colgroup>
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '9%' }} />
                    <col style={{ width: '9%' }} />
                    <col style={{ width: '9%' }} />
                    <col style={{ width: '9%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className={styles.th}>구분</th>
                      <th className={styles.th}>SET품번</th>
                      <th className={styles.th}>품목별<br />수주유형</th>
                      <th className={styles.th}>수량</th>
                      <th className={styles.th}>공장도대비<br />할인율(%)</th>
                      <th className={styles.th}>대리점<br />마진율</th>
                      <th className={styles.th}>매출총이익<br />단가</th>
                      <th className={styles.th}>영업이익(%)</th>
                      <th className={styles.th}>매출금액</th>
                      <th className={styles.th}>원가</th>
                      <th className={styles.th}>매출총이익</th>
                      <th className={styles.th}>영업이익</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProfit.items.map((item) => {
                      const detail = getRowDetail(item);
                      if (!detail) return null;
                      return (
                        <tr key={item.id} className={styles.tableRow}>
                          <td className={styles.td}>{item.type}</td>
                          <td className={styles.td}>{item.itemCode}</td>
                          <td className={styles.td}>{item.orderType}</td>
                          <td className={styles.tdNum}>{item.qty}</td>
                          <td className={styles.tdNum}>{detail.discountRate.toFixed(1)}</td>
                          <td className={styles.tdNum}>{item.marginRateDealer}</td>
                          <td className={styles.tdNum}>{detail.grossProfitPerUnit.toLocaleString()}</td>
                          <td className={styles.tdNum}>{detail.operatingRate.toFixed(1)}</td>
                          <td className={styles.tdNum}>{detail.sales.toLocaleString()}</td>
                          <td className={styles.tdNum}>{detail.cost.toLocaleString()}</td>
                          <td className={styles.tdNum}>{detail.grossProfit.toLocaleString()}</td>
                          <td className={styles.tdNum}>{detail.operatingProfit.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    {(() => {
                      const totals = selectedProfit.items.reduce(
                        (acc, item) => {
                          const detail = getRowDetail(item);
                          if (!detail) return acc;
                          return {
                            sales: acc.sales + detail.sales,
                            cost: acc.cost + detail.cost,
                            grossProfit: acc.grossProfit + detail.grossProfit,
                            operatingProfit: acc.operatingProfit + detail.operatingProfit,
                          };
                        },
                        { sales: 0, cost: 0, grossProfit: 0, operatingProfit: 0 }
                      );
                      return (
                        <tr>
                          <td className={styles.tfootTd} colSpan={8}>
                            합계
                          </td>
                          <td className={styles.tfootTdNum}>{totals.sales.toLocaleString()}</td>
                          <td className={styles.tfootTdNum}>{totals.cost.toLocaleString()}</td>
                          <td className={styles.tfootTdNum}>{totals.grossProfit.toLocaleString()}</td>
                          <td className={styles.tfootTdNum}>{totals.operatingProfit.toLocaleString()}</td>
                        </tr>
                      );
                    })()}
                  </tfoot>
                </table>
              </div>
            </CardBody>
          </Card>
        )}

        {/* 저장 버튼 */}
        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!isFormValid}>
            저장
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
