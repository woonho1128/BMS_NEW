import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { notify } from '../../../shared/utils/notify';
import { MOCK_PROFIT_LIST, getProfitDetail, getRowDetail } from '../data/profitAnalysisMock';
import styles from './SalesInfoRegisterPage.module.css';

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatNumber(value) {
  return new Intl.NumberFormat('ko-KR').format(Number(value) || 0);
}

function createDefaultForm() {
  return {
    specType: '',
    swSpecNo: '',
    builder: '',
    partnerName: '',
    siteName: '',
    region: '',
    orderType: '',
    businessType: '',
    salesManager: '',
    specDate: today(),
    progressStatus: '',
    expectedDeliveryDate: '',
    bidetProgress: '미진행',
    paidOption: '미적용',
    totalHouseholds: '',
    appliedHouseholds: '',
    completionDate: '',
    originSpecNo: '',
    remark: '',
    deliveryManager: '',
  };
}

export function SalesInfoRegisterPage() {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState('profit');
  const [profitSearch, setProfitSearch] = useState('');
  const [selectedProfitId, setSelectedProfitId] = useState('');
  const [form, setForm] = useState(createDefaultForm);
  const [attachedImage, setAttachedImage] = useState('');
  const [attachedPdf, setAttachedPdf] = useState('');
  const [attachedChecklist, setAttachedChecklist] = useState('');

  useEffect(() => {
    if (inputMode === 'direct' && selectedProfitId) {
      setSelectedProfitId('');
    }
  }, [inputMode, selectedProfitId]);

  const selectedProfit = useMemo(
    () => (selectedProfitId ? getProfitDetail(selectedProfitId) : null),
    [selectedProfitId],
  );

  const filteredProfitList = useMemo(() => {
    const q = profitSearch.trim().toLowerCase();
    if (!q) return MOCK_PROFIT_LIST;
    return MOCK_PROFIT_LIST.filter((row) => {
      const detail = getProfitDetail(row.id);
      const haystack = [
        row.title,
        row.author,
        row.orderYear,
        row.deliveryYear,
        detail?.specNo,
        detail?.builder,
        detail?.siteName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [profitSearch]);

  const profitRows = useMemo(() => {
    if (!selectedProfit) return [];
    return (selectedProfit.items || [])
      .map((row) => ({ row, detail: getRowDetail(row, true) }))
      .filter((it) => Boolean(it.detail));
  }, [selectedProfit]);

  const profitSummary = useMemo(() => {
    return profitRows.reduce(
      (acc, item) => {
        const qty = Number(item.row.qty) || 0;
        acc.qty += qty;
        acc.sales += item.detail.sales || 0;
        acc.gross += item.detail.grossProfit || 0;
        acc.op += item.detail.operatingProfit || 0;
        return acc;
      },
      { qty: 0, sales: 0, gross: 0, op: 0 },
    );
  }, [profitRows]);

  const applyProfitDetailToForm = (detail) => {
    setForm((prev) => ({
      ...prev,
      specType: detail.specType || '',
      swSpecNo: detail.specNo || '',
      builder: detail.builder || '',
      partnerName: detail.partnerName || '',
      siteName: detail.siteName || '',
      region: detail.region || '',
      orderType: detail.orderType || '',
      businessType: detail.businessType || '',
      salesManager: detail.salesManager || '',
      specDate: detail.specDate || prev.specDate,
      progressStatus: detail.integratedProgress || '',
      expectedDeliveryDate: detail.expectedDeliveryDate || '',
      bidetProgress: detail.integratedProgress || '',
      paidOption: detail.paidOption || '',
      totalHouseholds: detail.totalHouseholds || '',
      appliedHouseholds: detail.appliedHouseholds || '',
      completionDate: detail.completionDate || '',
      originSpecNo: detail.originSpecNo || '',
      remark: detail.remark || '',
    }));
  };

  const handleProfitSelect = (profitId) => {
    setSelectedProfitId(profitId);
    if (!profitId) return;
    const detail = getProfitDetail(profitId);
    if (detail) {
      applyProfitDetailToForm(detail);
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <PageShell path={ROUTES.SALES_INFO} title="영업정보 등록">
      <div className={styles.page}>
        <Card title="입력 방식" className={styles.sectionCard}>
          <CardBody>
            <div className={styles.inputModeSection}>
              <span className={styles.inputModeLabel}>손익분석 연동</span>
              <div className={styles.inputModeRadioGroup}>
                <label className={styles.inputModeRadio}>
                  <input
                    type="radio"
                    name="inputMode"
                    value="profit"
                    checked={inputMode === 'profit'}
                    onChange={(e) => setInputMode(e.target.value)}
                  />
                  손익분석 선택 후 자동 입력
                </label>
                <label className={styles.inputModeRadio}>
                  <input
                    type="radio"
                    name="inputMode"
                    value="direct"
                    checked={inputMode === 'direct'}
                    onChange={(e) => setInputMode(e.target.value)}
                  />
                  직접 입력
                </label>
              </div>
            </div>
          </CardBody>
        </Card>

        {inputMode === 'profit' && (
          <Card title="손익분석 선택" className={styles.sectionCard}>
            <CardBody>
              <div className={styles.profitSelectSection}>
                <p className={styles.infoNote}>
                  `profit/new` 등록 건을 선택하면 아래 영업정보 필드가 자동으로 채워집니다. 이후 값은 직접 수정할 수 있습니다.
                </p>
                <div className={styles.searchableSelect}>
                  <input
                    className={styles.input}
                    placeholder="손익명, 작성자, SW SPEC NO로 검색"
                    value={profitSearch}
                    onChange={(e) => setProfitSearch(e.target.value)}
                  />
                  <select
                    className={styles.select}
                    style={{ marginTop: 8 }}
                    value={selectedProfitId}
                    onChange={(e) => handleProfitSelect(e.target.value)}
                  >
                    <option value="">선택 안 함 (수동 입력)</option>
                    {filteredProfitList.map((row) => {
                      const detail = getProfitDetail(row.id);
                      return (
                        <option key={row.id} value={row.id}>
                          [{row.id}] {row.title} / {detail?.specNo || '-'} / {row.author}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <Card title="영업정보 입력" className={styles.sectionCard}>
          <CardBody>
            <div className={styles.formCardGrid}>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>스펙구분 *</label>
                <select className={styles.formCardInput} value={form.specType} onChange={(e) => updateField('specType', e.target.value)}>
                  <option value="">선택</option>
                  <option value="신규">신규</option>
                  <option value="변경">변경</option>
                </select>
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>SW SPEC NO</label>
                <input
                  className={styles.formCardInput}
                  value={form.swSpecNo}
                  placeholder="SC202604130001"
                  onChange={(e) => updateField('swSpecNo', e.target.value)}
                />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>건설사 *</label>
                <input className={styles.formCardInput} value={form.builder} onChange={(e) => updateField('builder', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>대리점 *</label>
                <input className={styles.formCardInput} value={form.partnerName} onChange={(e) => updateField('partnerName', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>현장명 *</label>
                <input className={styles.formCardInput} value={form.siteName} onChange={(e) => updateField('siteName', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>지역 *</label>
                <input className={styles.formCardInput} value={form.region} onChange={(e) => updateField('region', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>수주유형 *</label>
                <input className={styles.formCardInput} value={form.orderType} onChange={(e) => updateField('orderType', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>사업분류 *</label>
                <input className={styles.formCardInput} value={form.businessType} onChange={(e) => updateField('businessType', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>영업담당자 *</label>
                <input className={styles.formCardInput} value={form.salesManager} onChange={(e) => updateField('salesManager', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>SPEC 수주일자</label>
                <input type="date" className={styles.formCardInput} value={form.specDate} onChange={(e) => updateField('specDate', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>진행사항 *</label>
                <input className={styles.formCardInput} value={form.progressStatus} onChange={(e) => updateField('progressStatus', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>예상납기일 *</label>
                <input
                  type="date"
                  className={styles.formCardInput}
                  value={form.expectedDeliveryDate}
                  onChange={(e) => updateField('expectedDeliveryDate', e.target.value)}
                />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>비데 일체형 진행여부</label>
                <input className={styles.formCardInput} value={form.bidetProgress} onChange={(e) => updateField('bidetProgress', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>유상옵션 적용 여부</label>
                <input className={styles.formCardInput} value={form.paidOption} onChange={(e) => updateField('paidOption', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>총세대수</label>
                <input className={styles.formCardInput} value={form.totalHouseholds} onChange={(e) => updateField('totalHouseholds', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>적용세대수</label>
                <input className={styles.formCardInput} value={form.appliedHouseholds} onChange={(e) => updateField('appliedHouseholds', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>준공예정일</label>
                <input type="date" className={styles.formCardInput} value={form.completionDate} onChange={(e) => updateField('completionDate', e.target.value)} />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>ORIGIN SPEC NO</label>
                <input className={styles.formCardInput} value={form.originSpecNo} onChange={(e) => updateField('originSpecNo', e.target.value)} />
              </div>
              <div className={`${styles.formCard} ${styles.formCardFull}`}>
                <label className={styles.formCardLabel}>당사 영업 현황</label>
                <textarea
                  className={styles.formCardInput}
                  rows={5}
                  value={form.remark}
                  placeholder="내용 입력"
                  onChange={(e) => updateField('remark', e.target.value)}
                />
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>이미지 첨부</label>
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={(e) => setAttachedImage(e.target.files?.[0]?.name || '')}
                />
                {attachedImage && <span className={styles.fileName}>{attachedImage}</span>}
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>PDF 첨부</label>
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={(e) => setAttachedPdf(e.target.files?.[0]?.name || '')}
                />
                {attachedPdf && <span className={styles.fileName}>{attachedPdf}</span>}
              </div>
              <div className={styles.formCard}>
                <label className={styles.formCardLabel}>납품담당자 *</label>
                <input
                  className={styles.formCardInput}
                  value={form.deliveryManager}
                  onChange={(e) => updateField('deliveryManager', e.target.value)}
                />
              </div>
              <div className={`${styles.formCard} ${styles.formCardFull}`}>
                <label className={styles.formCardLabel}>체크리스트</label>
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={(e) => setAttachedChecklist(e.target.files?.[0]?.name || '')}
                />
                {attachedChecklist && <span className={styles.fileName}>{attachedChecklist}</span>}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title="품번 손익 계산 결과" className={styles.sectionCard}>
          <CardBody>
            {!selectedProfitId ? (
              <p className={styles.infoNote}>손익분석을 선택하면 `profit/new` 기준 품번 손익 계산 결과가 아래에 표시됩니다.</p>
            ) : profitRows.length === 0 ? (
              <p className={styles.infoNote}>선택한 손익분석 건에 표시할 품번 손익 데이터가 없습니다.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>구분</th>
                      <th className={styles.th}>SET품번</th>
                      <th className={styles.th}>수주유형</th>
                      <th className={styles.th}>수량</th>
                      <th className={styles.th}>건설사 납품가</th>
                      <th className={styles.th}>대리점 마진율</th>
                      <th className={styles.th}>대리점 공급가</th>
                      <th className={styles.th}>매출총이익</th>
                      <th className={styles.th}>매출총이익(%)</th>
                      <th className={styles.th}>영업이익</th>
                      <th className={styles.th}>영업이익(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitRows.map((item) => (
                      <tr key={item.row.id} className={styles.tableRow}>
                        <td className={styles.td}>{item.row.type || '-'}</td>
                        <td className={styles.td}>{item.row.itemCode || '-'}</td>
                        <td className={styles.td}>{item.row.orderType || '-'}</td>
                        <td className={styles.tdNum}>{formatNumber(item.row.qty)}</td>
                        <td className={styles.tdNum}>{formatNumber(item.detail.bidPrice)}</td>
                        <td className={styles.tdNum}>{Number(item.detail.marginRateDealer || 0).toFixed(1)}%</td>
                        <td className={styles.tdNum}>{formatNumber(item.detail.dealerPrice)}</td>
                        <td className={styles.tdNum}>{formatNumber(item.detail.grossProfit)}</td>
                        <td className={styles.tdNum}>{Number(item.detail.grossRate || 0).toFixed(1)}%</td>
                        <td className={styles.tdNum}>{formatNumber(item.detail.operatingProfit)}</td>
                        <td className={styles.tdNum}>{Number(item.detail.operatingRate || 0).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className={styles.tfootTd} colSpan={3}>합계</td>
                      <td className={styles.tfootTdNum}>{formatNumber(profitSummary.qty)}</td>
                      <td className={styles.tfootTdNum}>-</td>
                      <td className={styles.tfootTdNum}>-</td>
                      <td className={styles.tfootTdNum}>{formatNumber(profitSummary.sales)}</td>
                      <td className={styles.tfootTdNum}>{formatNumber(profitSummary.gross)}</td>
                      <td className={styles.tfootTdNum}>
                        {profitSummary.sales > 0 ? `${((profitSummary.gross / profitSummary.sales) * 100).toFixed(1)}%` : '-'}
                      </td>
                      <td className={styles.tfootTdNum}>{formatNumber(profitSummary.op)}</td>
                      <td className={styles.tfootTdNum}>
                        {profitSummary.sales > 0 ? `${((profitSummary.op / profitSummary.sales) * 100).toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.SALES_INFO)}>취소</Button>
          <Button
            onClick={() => {
              notify.success('영업정보가 저장되었습니다. (목업)');
              navigate(ROUTES.SALES_INFO);
            }}
          >
            저장
          </Button>
        </div>
      </div>
    </PageShell>
  );
}



