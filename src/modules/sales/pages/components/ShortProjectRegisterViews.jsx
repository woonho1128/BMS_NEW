import React from 'react';
import { Card, CardBody } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button/Button';
import { formatDateRange, formatFileSize, formatNumber } from '../../../../shared/utils/formatters';
import { BASE_DISCOUNT_RATE } from '../../utils/shortProjectPricing';

export function ShortProjectRegisterListView({
  styles,
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
  listSites,
  allVisibleSelected,
  hasAnyVisibleSelected,
  toggleAllVisibleSelection,
  selectedSiteIds,
  toggleSiteSelection,
  loadSiteToForm,
  expandedSiteId,
  setExpandedSiteId,
  openCompareModal,
  openSubmitModal,
}) {
  return (
    <>
      <Card title="조회 조건" className={styles.sectionCard}>
        <CardBody>
          <div className={styles.searchRow}>
            <div className={styles.field}>
              <label className={styles.label}>대리점</label>
              <input className={styles.input} value={dealerFilter} onChange={(e) => setDealerFilter(e.target.value)} placeholder="대리점 검색" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>건설사</label>
              <input className={styles.input} value={builderFilter} onChange={(e) => setBuilderFilter(e.target.value)} placeholder="건설사검색" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>현장명</label>
              <input className={styles.input} value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} placeholder="현장명검색" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>납품예정일</label>
              <div className={styles.dateRange}>
                <input className={styles.input} type="date" value={deliveryFromFilter} onChange={(e) => setDeliveryFromFilter(e.target.value)} />
                <span className={styles.rangeDivider}>~</span>
                <input className={styles.input} type="date" value={deliveryToFilter} onChange={(e) => setDeliveryToFilter(e.target.value)} />
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
                  <tr
                    key={site.id}
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
                      <input type="checkbox" checked={selectedSiteIds.includes(site.id)} onChange={(e) => toggleSiteSelection(site.id, e.target.checked)} aria-label={`${site.siteName} 선택`} />
                    </td>
                    <td>{site.dealer}</td>
                    <td>{site.siteName}</td>
                    <td>{site.builder}</td>
                    <td>{formatDateRange(site.deliveryFrom, site.deliveryTo)}</td>
                    <td className={styles.centerCell}>
                      <input type="checkbox" checked={site.isGovernmentProject ?? String(site.notes || '').includes('관급')} readOnly tabIndex={-1} aria-label="관급공사 여부" />
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
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.listFooter}>
            <Button variant="secondary" onClick={openCompareModal} disabled={selectedSiteIds.length < 2 || selectedSiteIds.length > 5}>
              비교하기
            </Button>
            <Button variant="primary" onClick={openSubmitModal} disabled={selectedSiteIds.length === 0}>
              상신하기
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export function ShortProjectRegisterFormView(props) {
  const {
    styles,
    siteName,
    setSiteName,
    duplicateHint,
    builder,
    setBuilder,
    dealer,
    setDealer,
    partnerOptions,
    deliveryFrom,
    setDeliveryFrom,
    deliveryTo,
    setDeliveryTo,
    isGovernmentProject,
    setIsGovernmentProject,
    addItemRow,
    computedItems,
    updateItem,
    removeItemRow,
    total,
    hasProfitRows,
    commonDiscountRate,
    setCommonDiscountRate,
    sanitizeNumber,
    applyCommonDiscountRate,
    profitRows,
    extraDiscountDisabledByItemId,
    setExtraDiscountDisabledByItemId,
    profitTotal,
    specialNotes,
    setSpecialNotes,
    addAttachments,
    attachments,
    removeAttachment,
    backToList,
    saveDraft,
    submitForm,
    isFormValid,
  } = props;

  return (
    <>
      <Card title="기본 정보" className={styles.sectionCard}>
        <CardBody>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>현장명<span className={styles.required}>*</span></label>
              <input className={styles.input} value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              {duplicateHint ? <p className={styles.helper}>{duplicateHint}</p> : null}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>건설사</label>
              <input className={styles.input} value={builder} onChange={(e) => setBuilder(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>대리점 <span className={styles.required}>*</span></label>
              <select className={styles.input} value={dealer} onChange={(e) => setDealer(e.target.value)}>
                <option value="">대리점 카드 목록에서 선택</option>
                {partnerOptions.map((partner) => <option key={partner.id} value={partner.name}>{partner.name}</option>)}
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
              <input type="checkbox" checked={isGovernmentProject} onChange={(e) => setIsGovernmentProject(e.target.checked)} />
              관급공사
            </label>
          </div>
        </CardBody>
      </Card>

      <Card title="단납 품목" className={styles.sectionCard} actions={<Button variant="secondary" onClick={addItemRow}>단납 품목 추가</Button>}>
        <CardBody tight>
          <div className={styles.tableWrap}>
            <table className={styles.itemTable}>
              <colgroup><col style={{ width: '18%' }} /><col style={{ width: '10%' }} /><col style={{ width: '14%' }} /><col style={{ width: '50%' }} /><col style={{ width: '8%' }} /></colgroup>
              <thead><tr><th>품목</th><th>수량</th><th>금액</th><th>특이사항</th><th /></tr></thead>
              <tbody>
                {computedItems.map((item) => (
                  <tr key={item.id}>
                    <td><input className={styles.tableInput} value={item.itemCode} onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)} placeholder="예) CC-735" /></td>
                    <td><input className={styles.tableInput} inputMode="numeric" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} /></td>
                    <td><input className={styles.tableInput} inputMode="numeric" value={String(item.standardAmount || 0)} onChange={(e) => updateItem(item.id, 'amount', e.target.value)} placeholder="금액 입력" /></td>
                    <td><input className={styles.tableInput} value={item.note} onChange={(e) => updateItem(item.id, 'note', e.target.value)} placeholder="비고" /></td>
                    <td><button type="button" className={styles.deleteRowButton} onClick={() => removeItemRow(item.id)} disabled={computedItems.length <= 1}>삭제</button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td colSpan={2}>합계</td><td className={styles.numberCell}>{formatNumber(total.standard)}</td><td /><td /></tr></tfoot>
            </table>
          </div>
        </CardBody>
      </Card>

      {hasProfitRows && (
        <Card title="자동 계산 테이블" className={styles.sectionCard}>
          <CardBody tight>
            <div className={styles.bulkDiscountBar}>
              <span className={styles.bulkDiscountLabel}>실질할인율 일괄 적용(1~11%)</span>
              <input className={styles.bulkDiscountInput} inputMode="decimal" value={commonDiscountRate} onChange={(e) => setCommonDiscountRate(sanitizeNumber(e.target.value))} />
              <Button variant="secondary" onClick={applyCommonDiscountRate}>전체 적용</Button>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.profitTable}>
                <thead>
                  <tr>
                    <th rowSpan={2}>구분</th><th rowSpan={2}>단위</th><th rowSpan={2}>수량</th><th rowSpan={2}>제조원가(기준단가)</th><th colSpan={2}>공장도가(25년 06월)</th><th colSpan={4}>{`기본 할인가(${BASE_DISCOUNT_RATE}%)`}</th><th colSpan={4}>단납 공급가(기본 할인가 기준)</th><th rowSpan={2}>매출총이익 금액</th><th rowSpan={2}>매출 총 이익율</th><th rowSpan={2}>추가 할인 미적용</th>
                  </tr>
                  <tr><th>단가</th><th>금액</th><th>단가</th><th>금액</th><th>차액</th><th>공장도대비</th><th>단가</th><th>금액</th><th>차액</th><th>실질할인율</th></tr>
                </thead>
                <tbody>
                  {profitRows.filter((row) => row.itemCode.trim()).map((row) => (
                    <tr key={row.id}>
                      <td>{row.itemCode}</td><td>{row.unit || '-'}</td><td className={styles.numberCell}>{formatNumber(row.qty)}</td><td className={styles.numberCell}>{formatNumber(row.costUnitPrice)}</td><td className={styles.numberCell}>{formatNumber(row.factoryUnitPrice)}</td><td className={styles.numberCell}>{formatNumber(row.factoryAmount)}</td><td className={styles.numberCell}>{formatNumber(row.baseDiscountUnitPrice)}</td><td className={styles.numberCell}>{formatNumber(row.baseDiscountAmount)}</td><td className={styles.numberCell}>{formatNumber(row.baseDiscountDiff)}</td><td className={styles.numberCell}>{row.baseVsFactoryRate.toFixed(2)}%</td><td className={styles.numberCell}>{formatNumber(row.appliedDiscountUnitPrice)}</td><td className={styles.numberCell}>{formatNumber(row.appliedDiscountAmount)}</td><td className={styles.numberCell}>{formatNumber(row.appliedDiscountDiff)}</td>
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
                            setExtraDiscountDisabledByItemId((prev) => ({ ...prev, [row.id]: checked }));
                            if (checked) updateItem(row.id, 'discountRate', '0');
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
                    <td className={styles.numberCell}>{formatNumber(profitTotal.baseDiscountAmount - profitTotal.factoryAmount)}</td>
                    <td className={styles.numberCell}>{profitTotal.factoryAmount ? (((profitTotal.baseDiscountAmount - profitTotal.factoryAmount) / profitTotal.factoryAmount) * 100).toFixed(2) : '0.00'}%</td>
                    <td />
                    <td className={styles.numberCell}>{formatNumber(profitTotal.appliedDiscountAmount)}</td>
                    <td className={styles.numberCell}>{formatNumber(profitTotal.appliedDiscountAmount - profitTotal.factoryAmount)}</td>
                    <td className={styles.numberCell}>{profitTotal.factoryAmount ? (((profitTotal.appliedDiscountAmount - profitTotal.factoryAmount) / profitTotal.factoryAmount) * 100).toFixed(2) : '0.00'}%</td>
                    <td className={styles.numberCell}>{formatNumber(profitTotal.appliedDiscountAmount - profitTotal.costAmount)}</td>
                    <td className={styles.numberCell}>{profitTotal.appliedDiscountAmount ? (((profitTotal.appliedDiscountAmount - profitTotal.costAmount) / profitTotal.appliedDiscountAmount) * 100).toFixed(2) : '0.00'}%</td>
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
          <textarea className={styles.textarea} rows={6} value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="동종업체 입찰, 관급 공사, 모델하우스 우선 출고 등" />
          <div className={styles.attachmentUploadRow}>
            <input id="short-project-attachments" className={styles.attachmentInput} type="file" multiple onChange={addAttachments} />
            <label htmlFor="short-project-attachments" className={styles.attachmentUploadButton}>파일 선택</label>
            <p className={styles.helper}>견적서, 도면, 협의 자료 등을 첨부할 수 있습니다.</p>
          </div>
          {attachments.length > 0 ? (
            <ul className={styles.attachmentList}>
              {attachments.map((file) => (
                <li key={`${file.name}-${file.size}-${file.lastModified}`} className={styles.attachmentItem}>
                  <span className={styles.attachmentName}>{file.name}</span>
                  <span className={styles.attachmentSize}>{formatFileSize(file.size)}</span>
                  <button type="button" className={styles.attachmentDelete} onClick={() => removeAttachment(file)}>삭제</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.helper}>첨부된 파일이 없습니다.</p>
          )}
        </CardBody>
      </Card>

      <div className={styles.footer}>
        <Button variant="secondary" onClick={backToList}>취소</Button>
        <Button variant="secondary" onClick={saveDraft}>임시저장</Button>
        <Button variant="primary" onClick={submitForm} disabled={!isFormValid}>결재 상신</Button>
      </div>
    </>
  );
}
