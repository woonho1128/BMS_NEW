import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import { MOCK_ITEM_MASTER, getProfitDetail } from '../data/profitAnalysisMock';
import styles from './SalesProfitAnalysisNewPage.module.css';

function toNumber(value) {
  const n = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat('ko-KR').format(toNumber(value));
}

function calculateRow(row) {
  const factoryPrice = toNumber(row.factoryPrice);
  const qty = toNumber(row.qty);
  const bidPrice = toNumber(row.bidPrice);
  const marginRate = toNumber(row.marginRateDealer);
  const cost2027 = toNumber(row.cost2027);

  const dealerUnitPrice = Math.round(bidPrice * (1 - marginRate / 100));
  const discountRate = factoryPrice > 0 ? ((factoryPrice - dealerUnitPrice) / factoryPrice) * 100 : 0;
  const grossUnit = dealerUnitPrice - cost2027;
  const grossRate = dealerUnitPrice > 0 ? (grossUnit / dealerUnitPrice) * 100 : 0;
  const opUnit = grossUnit - dealerUnitPrice * 0.05;
  const opRate = dealerUnitPrice > 0 ? (opUnit / dealerUnitPrice) * 100 : 0;

  return {
    ...row,
    dealerUnitPrice,
    discountRate,
    grossUnit,
    grossRate,
    opUnit,
    opRate,
    amountSales: dealerUnitPrice * qty,
    amountGross: grossUnit * qty,
    amountOp: opUnit * qty,
  };
}

function createEmptyItem(index) {
  return {
    id: `new-${Date.now()}-${index}`,
    type: '양변기',
    setCode: '',
    itemCode: '',
    orderType: '유상옵션',
    factoryPrice: 0,
    setUnitPrice: 0,
    cost2026: 0,
    cost2027: 0,
    qty: '',
    bidPrice: '',
    marginRateDealer: '',
    dealerUnitPrice: 0,
    discountRate: 0,
    grossUnit: 0,
    grossRate: 0,
    opUnit: 0,
    opRate: 0,
    remark: '',
    amountSales: 0,
    amountGross: 0,
    amountOp: 0,
  };
}

function createDefaultForm() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    specType: '',
    costIncreaseRate: '3',
    builder: '',
    partnerName: '',
    siteName: '',
    region: '',
    orderType: '',
    businessType: '',
    salesManager: '',
    specDate: today,
    progressStatus: '',
    expectedDeliveryDate: '',
    bidetProgress: '미진행',
    paidOption: '미적용',
    totalHouseholds: '',
    appliedHouseholds: '',
    completionDate: '',
    originSpecNo: '',
    partnerDeliveryAmount: '',
    expectedProfitRate: '',
    commissionEnabled: false,
    commissionFee: '',
    remark: '',
  };
}

export function SalesProfitAnalysisNewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = useMemo(() => Boolean(id), [id]);
  const detail = useMemo(() => (isEditMode ? getProfitDetail(id) : null), [id, isEditMode]);

  const [activeStep, setActiveStep] = useState(1);
  const [foldSpec, setFoldSpec] = useState(false);
  const [rowAddCount, setRowAddCount] = useState(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [form, setForm] = useState(() => {
    if (!detail) return createDefaultForm();
    return {
      specType: detail.specType || '',
      costIncreaseRate: detail.costIncreaseRate || '3',
      builder: detail.builder || '',
      partnerName: detail.partnerName || '',
      siteName: detail.siteName || '',
      region: detail.region || '',
      orderType: detail.orderType || '',
      businessType: detail.businessType || '',
      salesManager: detail.salesManager || '',
      specDate: detail.specDate || '',
      progressStatus: detail.integratedProgress || '',
      expectedDeliveryDate: detail.expectedDeliveryDate || '',
      bidetProgress: detail.integratedProgress || '미진행',
      paidOption: detail.paidOption || '미적용',
      totalHouseholds: detail.totalHouseholds || '',
      appliedHouseholds: detail.appliedHouseholds || '',
      completionDate: detail.completionDate || '',
      originSpecNo: detail.originSpecNo || '',
      partnerDeliveryAmount: '',
      expectedProfitRate: '',
      commissionEnabled: Boolean(detail.commissionEnabled),
      commissionFee: detail.commissionFee || '',
      remark: detail.remark || '',
    };
  });

  const [items, setItems] = useState(() => {
    if (!detail?.items?.length) return [createEmptyItem(0)];
    return detail.items.map((item, index) => {
      const master = MOCK_ITEM_MASTER[item.itemCode] || {};
      return calculateRow({
        id: item.id || `edit-${index}`,
        type: item.type || '양변기',
        setCode: item.itemCode || '',
        itemCode: item.itemCode || '',
        orderType: item.orderType || '유상옵션',
        factoryPrice: master.factoryPrice || 0,
        setUnitPrice: master.factoryPrice || 0,
        cost2026: master.cost2026 || 0,
        cost2027: master.cost2027 || 0,
        qty: item.qty || '',
        bidPrice: item.bidPrice || '',
        marginRateDealer: item.marginRateDealer || '',
        remark: item.remark || '',
      });
    });
  });

  const handleFormChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleItemChange = (index, key, value) => {
    setItems((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, [key]: value };
        if (key === 'itemCode' && MOCK_ITEM_MASTER[value]) {
          const master = MOCK_ITEM_MASTER[value];
          updated.factoryPrice = master.factoryPrice || 0;
          updated.setUnitPrice = master.factoryPrice || 0;
          updated.cost2026 = master.cost2026 || 0;
          updated.cost2027 = master.cost2027 || 0;
        }
        return calculateRow(updated);
      }),
    );
  };

  const addRows = () => {
    const count = Math.max(1, Math.min(10, toNumber(rowAddCount)));
    setItems((prev) => {
      const next = [...prev, ...Array.from({ length: count }, (_, idx) => createEmptyItem(idx))];
      setSelectedRowIndex(next.length - 1);
      return next;
    });
  };

  const removeRow = (index) => setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  const removeSelectedRow = () => {
    if (items.length <= 1) return;
    removeRow(selectedRowIndex);
    setSelectedRowIndex((prev) => Math.max(0, prev - 1));
  };

  const summary = useMemo(
    () =>
      items.reduce(
        (acc, row) => {
          const computed = calculateRow(row);
          acc.factory += toNumber(computed.factoryPrice) * toNumber(computed.qty);
          acc.sales += toNumber(computed.amountSales);
          acc.gross += toNumber(computed.amountGross);
          acc.op += toNumber(computed.amountOp);
          return acc;
        },
        { factory: 0, sales: 0, gross: 0, op: 0 },
      ),
    [items],
  );

  const handleSubmit = () => {
    notify.success(isEditMode ? '수정 저장이 완료되었습니다. (목업)' : '결재상신이 완료되었습니다. (목업)');
    navigate(ROUTES.PROFIT);
  };

  const handleTempSave = () => {
    notify.info('임시저장이 완료되었습니다. (목업)');
    navigate(ROUTES.PROFIT);
  };

  const renderSpecForm = (showActions, readOnly = false) => (
    <Card title="SPEC 입력" className={styles.sectionCard}>
      <CardBody>
        <div className={styles.specHeader}>
          <span className={styles.specTitle}>SPEC 입력</span>
          <button type="button" className={styles.foldBtn} onClick={() => setFoldSpec((prev) => !prev)}>
            {foldSpec ? '펼치기' : '접기'} {foldSpec ? '▼' : '▲'}
          </button>
        </div>

        {!foldSpec && (
          <table className={styles.specTable}>
            <tbody>
              <tr>
                <th>스펙구분 *</th>
                <td>
                  <select className={styles.input} value={form.specType} disabled={readOnly} onChange={(e) => handleFormChange('specType', e.target.value)}>
                    <option value="">선택</option>
                    <option value="신규">신규</option>
                    <option value="변경">변경</option>
                  </select>
                </td>
                <th>원가 예상인상율(%)</th>
                <td>
                  <input className={styles.input} value={form.costIncreaseRate} readOnly={readOnly} onChange={(e) => handleFormChange('costIncreaseRate', e.target.value)} />
                </td>
              </tr>
              <tr>
                <th>건설사 *</th>
                <td><input className={styles.input} value={form.builder} readOnly={readOnly} onChange={(e) => handleFormChange('builder', e.target.value)} /></td>
                <th>대리점 *</th>
                <td><input className={styles.input} value={form.partnerName} readOnly={readOnly} onChange={(e) => handleFormChange('partnerName', e.target.value)} /></td>
              </tr>
              <tr>
                <th>현장명 *</th>
                <td><input className={styles.input} value={form.siteName} readOnly={readOnly} onChange={(e) => handleFormChange('siteName', e.target.value)} /></td>
                <th>지역 *</th>
                <td><input className={styles.input} value={form.region} readOnly={readOnly} onChange={(e) => handleFormChange('region', e.target.value)} /></td>
              </tr>
              <tr>
                <th>수주유형 *</th>
                <td><input className={styles.input} value={form.orderType} readOnly={readOnly} onChange={(e) => handleFormChange('orderType', e.target.value)} /></td>
                <th>사업분류 *</th>
                <td><input className={styles.input} value={form.businessType} readOnly={readOnly} onChange={(e) => handleFormChange('businessType', e.target.value)} /></td>
              </tr>
              <tr>
                <th>영업담당자 *</th>
                <td><input className={styles.input} value={form.salesManager} readOnly={readOnly} onChange={(e) => handleFormChange('salesManager', e.target.value)} /></td>
                <th>SPEC 수주일자</th>
                <td><input type="date" className={styles.input} disabled={readOnly} value={form.specDate} onChange={(e) => handleFormChange('specDate', e.target.value)} /></td>
              </tr>
              <tr>
                <th>진행사항 *</th>
                <td><input className={styles.input} value={form.progressStatus} readOnly={readOnly} onChange={(e) => handleFormChange('progressStatus', e.target.value)} /></td>
                <th>예상납기일 *</th>
                <td><input type="date" className={styles.input} disabled={readOnly} value={form.expectedDeliveryDate} onChange={(e) => handleFormChange('expectedDeliveryDate', e.target.value)} /></td>
              </tr>
              <tr>
                <th>비데 일체형 진행여부</th>
                <td><input className={styles.input} value={form.bidetProgress} readOnly={readOnly} onChange={(e) => handleFormChange('bidetProgress', e.target.value)} /></td>
                <th>유상옵션 적용 여부</th>
                <td><input className={styles.input} value={form.paidOption} readOnly={readOnly} onChange={(e) => handleFormChange('paidOption', e.target.value)} /></td>
              </tr>
              <tr>
                <th>총세대수</th>
                <td><input className={styles.input} value={form.totalHouseholds} readOnly={readOnly} onChange={(e) => handleFormChange('totalHouseholds', e.target.value)} /></td>
                <th>적용세대수</th>
                <td><input className={styles.input} value={form.appliedHouseholds} readOnly={readOnly} onChange={(e) => handleFormChange('appliedHouseholds', e.target.value)} /></td>
              </tr>
              <tr>
                <th>준공예정일</th>
                <td><input type="date" className={styles.input} disabled={readOnly} value={form.completionDate} onChange={(e) => handleFormChange('completionDate', e.target.value)} /></td>
                <th>ORIGIN SPEC NO</th>
                <td><input className={styles.input} value={form.originSpecNo} readOnly={readOnly} onChange={(e) => handleFormChange('originSpecNo', e.target.value)} /></td>
              </tr>
              <tr>
                <th>대리점 납품금액(원)</th>
                <td><input className={styles.input} value={form.partnerDeliveryAmount} readOnly={readOnly} onChange={(e) => handleFormChange('partnerDeliveryAmount', e.target.value)} /></td>
                <th>예상 매출총이익률(%)</th>
                <td><input className={styles.input} value={form.expectedProfitRate} readOnly={readOnly} onChange={(e) => handleFormChange('expectedProfitRate', e.target.value)} /></td>
              </tr>
              <tr>
                <th>PDF 첨부</th>
                <td><input className={styles.input} type="file" disabled={readOnly} /></td>
                <th>지급수수료</th>
                <td>
                  <label className={styles.commissionInline}>
                    <input type="checkbox" disabled={readOnly} checked={form.commissionEnabled} onChange={(e) => handleFormChange('commissionEnabled', e.target.checked)} />
                    수수료 입력
                  </label>
                  {form.commissionEnabled && (
                    <input
                      className={styles.input}
                      style={{ marginTop: 8 }}
                      value={form.commissionFee}
                      readOnly={readOnly}
                      onChange={(e) => handleFormChange('commissionFee', e.target.value)}
                      placeholder="수수료 금액"
                    />
                  )}
                </td>
              </tr>
              <tr>
                <th>비고</th>
                <td colSpan={3}>
                  <textarea className={styles.textarea} rows={3} value={form.remark} readOnly={readOnly} onChange={(e) => handleFormChange('remark', e.target.value)} />
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <p className={styles.specHelp}>※ SPEC 수주일자/예상납기일 변경 시 입력된 데이터가 초기화될 수 있습니다.</p>
        {showActions && (
          <div className={styles.stepActions}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.PROFIT)}>취소</Button>
            <Button variant="secondary" onClick={handleTempSave}>임시저장</Button>
            <Button onClick={() => setActiveStep(2)}>다음: 품번 손익 계산</Button>
          </div>
        )}
      </CardBody>
    </Card>
  );

  const renderProfitTable = (showActions, readOnly = false) => (
    <Card title="품번 손익 계산" className={styles.sectionCard}>
      <CardBody>
        <div className={styles.tableTopBar}>
          <span className={styles.tableHint}>※ 행 추가/삭제는 마지막 행에 적용됩니다.</span>
          <div className={styles.tableRight}>
            <span className={styles.tableHint}>V.A.T 별도 / 단위: 원</span>
            {!readOnly && (
              <>
                <input className={styles.countInput} value={rowAddCount} onChange={(e) => setRowAddCount(e.target.value)} />
                <Button onClick={addRows}>행 추가</Button>
                <Button variant="secondary" onClick={removeSelectedRow}>선택 행 삭제</Button>
              </>
            )}
          </div>
        </div>

          <div className={styles.profitTableScrollX}>
            <table className={styles.step2Table}>
              <colgroup>
                <col className={styles.colType} />
                <col className={styles.colSetCode} />
                <col className={styles.colItemCode} />
                <col className={styles.colOrderType} />
                <col className={styles.colFactory} />
                <col className={styles.colSetUnit} />
                <col className={styles.colCost2026} />
                <col className={styles.colCost2027} />
                <col className={styles.colQty} />
                <col className={styles.colBidPrice} />
                <col className={styles.colDealerMargin} />
                <col className={styles.colDealerSupply} />
                <col className={styles.colDiscount} />
                <col className={styles.colGrossUnit} />
                <col className={styles.colGrossRate} />
                <col className={styles.colOpUnit} />
                <col className={styles.colOpRate} />
              </colgroup>
              <thead>
              <tr>
                <th rowSpan={2}>구분</th>
                <th rowSpan={2}>SET품번</th>
                <th rowSpan={2}>자품번</th>
                <th rowSpan={2}>
                  <span className={styles.headerMultiline}>
                    품목 별
                    <br />
                    수주유형
                  </span>
                </th>
                <th rowSpan={2}>공장도가</th>
                <th rowSpan={2}>톤당 단가</th>
                <th>
                  <span className={styles.headerYear}>2026년</span>
                  <br />
                  <span className={styles.headerSub}>(현재)</span>
                </th>
                <th>
                  <span className={styles.headerYear}>2027년</span>
                  <br />
                  <span className={styles.headerSub}>(예상)</span>
                </th>
                <th rowSpan={2}>수량</th>
                <th colSpan={2}>건설사 입찰가</th>
                <th>대리점 공급가</th>
                <th rowSpan={2}>공장도 대비 할인율</th>
                <th colSpan={2}>매출총이익</th>
                <th colSpan={2}>영업이익</th>
              </tr>
              <tr>
                <th>품목 원가</th>
                <th>품목 원가</th>
                <th>단가</th>
                <th>
                  <span className={styles.headerMultiline}>
                    대리점
                    <br />
                    마진율
                  </span>
                </th>
                <th>단가</th>
                <th>단가</th>
                <th>%</th>
                <th>단가</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => (
                <React.Fragment key={row.id}>
                  <tr className={selectedRowIndex === index ? styles.selectedRow : ''} onClick={() => setSelectedRowIndex(index)}>
                    <td>
                      <select className={styles.cellInput} disabled={readOnly} value={row.type} onChange={(e) => handleItemChange(index, 'type', e.target.value)}>
                        <option value="양변기">양변기</option>
                        <option value="비데">비데</option>
                        <option value="세면기">세면기</option>
                      </select>
                    </td>
                    <td><input className={styles.cellInput} readOnly={readOnly} value={row.setCode} onChange={(e) => handleItemChange(index, 'setCode', e.target.value)} /></td>
                    <td>
                      <select className={styles.cellInput} disabled={readOnly} value={row.itemCode} onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}>
                        <option value="">선택</option>
                        {Object.keys(MOCK_ITEM_MASTER).map((code) => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select className={styles.cellInput} disabled={readOnly} value={row.orderType} onChange={(e) => handleItemChange(index, 'orderType', e.target.value)}>
                        <option value="유상옵션">유상옵션</option>
                        <option value="무상">무상</option>
                      </select>
                    </td>
                    <td className={styles.tRight}>{formatNumber(row.factoryPrice)}</td>
                    <td className={styles.tRight}>{formatNumber(row.setUnitPrice)}</td>
                    <td className={styles.tRight}>{formatNumber(row.cost2026)}</td>
                    <td className={styles.tRight}>{formatNumber(row.cost2027)}</td>
                    <td><input inputMode="numeric" className={`${styles.cellInput} ${styles.cellInputNumeric}`} readOnly={readOnly} value={row.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} /></td>
                    <td><input inputMode="numeric" className={`${styles.cellInput} ${styles.cellInputNumeric}`} readOnly={readOnly} value={row.bidPrice} onChange={(e) => handleItemChange(index, 'bidPrice', e.target.value)} /></td>
                    <td>
                      <div className={styles.percentInputWrap}>
                        <input
                          inputMode="decimal"
                          className={`${styles.cellInput} ${styles.cellInputNumeric}`}
                          readOnly={readOnly}
                          value={row.marginRateDealer}
                          onChange={(e) => handleItemChange(index, 'marginRateDealer', e.target.value)}
                        />
                        <span className={styles.percentSuffix}>%</span>
                      </div>
                    </td>
                    <td className={styles.tRight}>{formatNumber(row.dealerUnitPrice)}</td>
                    <td className={styles.tRight}>{row.discountRate.toFixed(1)}%</td>
                    <td className={styles.tRight}>{formatNumber(row.grossUnit)}</td>
                    <td className={styles.tRight}>{row.grossRate.toFixed(1)}%</td>
                    <td className={styles.tRight}>{formatNumber(row.opUnit)}</td>
                    <td className={styles.tRight}>{row.opRate.toFixed(1)}%</td>
                  </tr>
                  {row.remark?.trim() && (
                    <tr className={styles.remarkAccordionRow}>
                      <td colSpan={17} className={styles.remarkAccordionCell}>
                        <span className={styles.remarkAccordionLabel}>비고</span>
                        <p className={styles.remarkAccordionText}>{row.remark.trim()}</p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              <tr className={styles.totalRow}>
                <td colSpan={8}>합계</td>
                <td className={styles.tRight}>{formatNumber(items.reduce((acc, row) => acc + toNumber(row.qty), 0))}</td>
                <td colSpan={3} className={styles.tRight}>{formatNumber(summary.sales)}</td>
                <td />
                <td colSpan={2} className={styles.tRight}>{formatNumber(summary.gross)}</td>
                <td colSpan={2} className={styles.tRight}>{formatNumber(summary.op)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.summaryBox}>
          <div><span>총 공장도가</span><strong>{formatNumber(summary.factory)} 원</strong></div>
          <div><span>총 대리점공급가</span><strong>{formatNumber(summary.sales)} 원</strong></div>
          <div><span>총 매출총이익</span><strong>{formatNumber(summary.gross)} 원</strong></div>
          <div><span>총 영업이익</span><strong>{formatNumber(summary.op)} 원</strong></div>
        </div>

        <div className={styles.remarkEditor}>
          <label className={styles.remarkLabel}>선택 행 비고</label>
          <textarea
            className={styles.remarkTextarea}
            rows={3}
            readOnly={readOnly}
            value={items[selectedRowIndex]?.remark ?? ''}
            onChange={(e) => handleItemChange(selectedRowIndex, 'remark', e.target.value)}
            placeholder="선택한 행의 비고를 입력하세요."
          />
        </div>

        {showActions && (
          <div className={styles.stepActions}>
            <Button variant="secondary" onClick={() => setActiveStep(1)}>이전</Button>
            <Button variant="secondary" onClick={handleTempSave}>임시저장</Button>
            <Button onClick={handleSubmit}>저장/상신</Button>
          </div>
        )}
      </CardBody>
    </Card>
  );

  return (
    <PageShell path={ROUTES.PROFIT} title={isEditMode ? '수익 분석 수정' : '수익 분석 등록'} className={styles.pageFullWidth}>
      <div className={styles.page}>
        <div className={styles.stepNav}>
          <button type="button" className={`${styles.stepTab} ${activeStep === 1 ? styles.stepTabActive : ''}`} onClick={() => setActiveStep(1)}>
            1. 기본 정보
          </button>
          <button type="button" className={`${styles.stepTab} ${activeStep === 2 ? styles.stepTabActive : ''}`} onClick={() => setActiveStep(2)}>
            2. 품번 손익 계산
          </button>
          <button type="button" className={`${styles.stepTab} ${activeStep === 3 ? styles.stepTabActive : ''}`} onClick={() => setActiveStep(3)}>
            3. 전체 검증
          </button>
        </div>

        {activeStep === 1 && renderSpecForm(true, false)}
        {activeStep === 2 && renderProfitTable(true, false)}
        {activeStep === 3 && (
          <div className={styles.verifyStack}>
            {renderSpecForm(false, true)}
            {renderProfitTable(false, true)}
            <div className={styles.stepActions}>
              <Button variant="secondary" onClick={() => setActiveStep(1)}>1번으로</Button>
              <Button variant="secondary" onClick={() => setActiveStep(2)}>2번으로</Button>
              <Button variant="secondary" onClick={handleTempSave}>임시저장</Button>
              <Button onClick={handleSubmit}>저장/상신</Button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
