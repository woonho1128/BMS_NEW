import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { getProfitDetail } from '../data/profitAnalysisMock';
import { formatNumber } from './salesInfoRegister.helpers';
import { useSalesInfoRegisterState } from './useSalesInfoRegisterState';
import styles from './SalesInfoRegisterPage.module.css';

export function SalesInfoRegisterPage() {
    const {
    navigate,
    inputMode,
    setInputMode,
    profitSearch,
    setProfitSearch,
    selectedProfitId,
    form,
    setAttachedImage,
    attachedImage,
    setAttachedPdf,
    attachedPdf,
    setAttachedChecklist,
    attachedChecklist,
    filteredProfitList,
    profitRows,
    profitSummary,
    handleProfitSelect,
    updateField,
    save,
  } = useSalesInfoRegisterState();

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
              <div className={`${styles.tableWrap} ${styles.desktopTableWrap}`}>
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
            {selectedProfitId && profitRows.length > 0 && (
              <div className={styles.mobileList}>
                {profitRows.map((item) => (
                  <article key={`mobile-${item.row.id}`} className={styles.mobileCard}>
                    <div className={styles.mobileHead}>
                      <strong>{item.row.itemCode || '-'}</strong>
                      <span>{item.row.type || '-'}</span>
                    </div>
                    <div className={styles.mobileSub}>{item.row.orderType || '-'}</div>
                    <div className={styles.mobileMetaGrid}>
                      <div className={styles.mobileMetaItem}>
                        <span>수량</span>
                        <strong>{formatNumber(item.row.qty)}</strong>
                      </div>
                      <div className={styles.mobileMetaItem}>
                        <span>건설사 납품가</span>
                        <strong>{formatNumber(item.detail.bidPrice)}</strong>
                      </div>
                      <div className={styles.mobileMetaItem}>
                        <span>대리점 마진율</span>
                        <strong>{Number(item.detail.marginRateDealer || 0).toFixed(1)}%</strong>
                      </div>
                      <div className={styles.mobileMetaItem}>
                        <span>대리점 공급가</span>
                        <strong>{formatNumber(item.detail.dealerPrice)}</strong>
                      </div>
                      <div className={styles.mobileMetaItem}>
                        <span>매출총이익</span>
                        <strong>{formatNumber(item.detail.grossProfit)}</strong>
                      </div>
                      <div className={styles.mobileMetaItem}>
                        <span>매출총이익(%)</span>
                        <strong>{Number(item.detail.grossRate || 0).toFixed(1)}%</strong>
                      </div>
                      <div className={styles.mobileMetaItem}>
                        <span>영업이익</span>
                        <strong>{formatNumber(item.detail.operatingProfit)}</strong>
                      </div>
                      <div className={styles.mobileMetaItem}>
                        <span>영업이익(%)</span>
                        <strong>{Number(item.detail.operatingRate || 0).toFixed(1)}%</strong>
                      </div>
                    </div>
                  </article>
                ))}
                <article className={`${styles.mobileCard} ${styles.mobileSummaryCard}`}>
                  <div className={styles.mobileHead}>
                    <strong>합계</strong>
                  </div>
                  <div className={styles.mobileMetaGrid}>
                    <div className={styles.mobileMetaItem}>
                      <span>수량</span>
                      <strong>{formatNumber(profitSummary.qty)}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>대리점 공급가</span>
                      <strong>{formatNumber(profitSummary.sales)}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>매출총이익</span>
                      <strong>{formatNumber(profitSummary.gross)}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>매출총이익(%)</span>
                      <strong>
                        {profitSummary.sales > 0 ? `${((profitSummary.gross / profitSummary.sales) * 100).toFixed(1)}%` : '-'}
                      </strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>영업이익</span>
                      <strong>{formatNumber(profitSummary.op)}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>영업이익(%)</span>
                      <strong>
                        {profitSummary.sales > 0 ? `${((profitSummary.op / profitSummary.sales) * 100).toFixed(1)}%` : '-'}
                      </strong>
                    </div>
                  </div>
                </article>
              </div>
            )}
          </CardBody>
        </Card>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={() => navigate(ROUTES.SALES_INFO)}>취소</Button>
          <Button onClick={save}>저장</Button>
        </div>
      </div>
    </PageShell>
  );
}






