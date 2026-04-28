import React from 'react';
import NumericInput from './NumericInput';
import { formatNumber, metricFields } from './discountPromotionManage.helpers';

export default function DiscountPromotionManageTable({
  styles,
  readOnly,
  rows,
  selectedIds,
  expandedIds,
  selectableRows,
  selectedCount,
  totals,
  toggleRow,
  toggleExpand,
  toggleAll,
  updateField,
}) {
  return (
    <div className={styles.promoManageTableWrap}>
      <table className={styles.promoManageTable}>
        <thead>
          <tr>
            <th rowSpan={2} className={styles.stickyCol}><div className={styles.checkCellInner}><input className={styles.checkInput} type="checkbox" disabled={readOnly} checked={selectableRows.length > 0 && selectedIds.length === selectableRows.length} onChange={() => { if (readOnly) return; toggleAll(); }} aria-label="전체 선택" /></div></th>
            <th rowSpan={2} className={styles.expandColHead}>비고</th>
            <th rowSpan={2} className={styles.colDivisionHead}>구분</th>
            <th rowSpan={2} className={styles.colSetHead}>SET품번</th>
            <th rowSpan={2} className={styles.colComponentHead}>구성품</th>
            <th rowSpan={2} className={styles.colErpHead}>세부(ERP)품번</th>
            <th colSpan={4} className={styles.groupStock}>재고(8/26 기준)<br />재고충당금 (백만원)</th>
            <th colSpan={3} className={styles.groupNormal}>정상판매</th>
            <th colSpan={6} className={styles.groupPromo}>프로모션(안)</th>
            <th colSpan={3} className={styles.groupProfit}>매출총이익<br />(백만원)</th>
          </tr>
          <tr>
            <th className={styles.groupStock}>수량<br />(EA)</th>
            <th className={styles.groupStock}>금액<br />(백만원)</th>
            <th className={styles.groupStock}>충당금</th>
            <th className={styles.groupStock}>예상 할인금액</th>
            <th className={styles.groupNormal}>재고단가<br />(원)</th>
            <th className={styles.groupNormal}>공장도가<br />(원)</th>
            <th className={`${styles.groupNormal} ${styles.colMarginRateHead}`}>매출<br />총이익율(%)</th>
            <th className={styles.groupPromo}>목표수량<br />(EA)</th>
            <th className={styles.groupPromo}>프로모션가<br />(원)</th>
            <th className={styles.groupPromo}>할인율(%)</th>
            <th className={styles.groupPromo}>공장도가 매출액<br />(백만원)</th>
            <th className={styles.groupPromo}>프로모션 매출액<br />(백만원)</th>
            <th className={`${styles.groupPromo} ${styles.colMarginRateHead}`}>매출<br />총이익율(%)</th>
            <th className={styles.groupProfit}>공장도</th>
            <th className={styles.groupProfit}>프로모션</th>
            <th className={styles.groupProfit}>공장도<br />대비 증감</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const checked = selectedIds.includes(row.id);
            const expanded = expandedIds.includes(row.id);
            const isSubtotal = row.rowType === 'subtotal';
            return (
              <React.Fragment key={row.id}>
                <tr className={isSubtotal ? styles.promoSubtotalRow : ''}>
                  <td className={styles.stickyCol}><div className={styles.checkCellInner}><input className={styles.checkInput} type="checkbox" checked={checked} disabled={isSubtotal || readOnly} onChange={() => { if (isSubtotal || readOnly) return; toggleRow(row.id); }} /></div></td>
                  {isSubtotal ? (
                    <><td className={styles.expandColCell} /><td colSpan={4} className={styles.subtotalLabelCell}>소계</td></>
                  ) : (
                    <>
                      <td className={styles.expandColCell}><button type="button" className={styles.expandBtn} onClick={() => toggleExpand(row.id)} aria-label="비고 열기">{expanded ? '▾' : '▸'}</button></td>
                      <td className={styles.colDivisionCell}><div className={styles.promoDivisionCell}><select className={styles.promoCellSelect} value={row.division} disabled={isSubtotal || readOnly} onChange={(e) => updateField(row.id, 'division', e.target.value)}><option value="일반">일반</option><option value="장기재고">장기재고</option><option value="신제품">신제품</option><option value="컨테이너">컨테이너</option><option value="전시지원">전시지원</option><option value="온라인마케팅활성화">온라인마케팅활성화</option><option value="소계">소계</option></select><select className={`${styles.promoCellSelect} ${styles.promoTypeSelect}`} value={row.itemType} disabled={isSubtotal || readOnly} onChange={(e) => updateField(row.id, 'itemType', e.target.value)}><option value="">유형 선택</option><option value="일체형(국산)">일체형(국산)</option><option value="세면기(국산)">세면기(국산)</option><option value="양변기(OEM)">양변기(OEM)</option></select></div></td>
                      <td className={styles.colSetCell}><input className={styles.promoCellInput} value={row.setCode} placeholder="SET품번" disabled={isSubtotal || readOnly} onChange={(e) => updateField(row.id, 'setCode', e.target.value)} /></td>
                      <td className={styles.colComponentCell}><input className={styles.promoCellInput} value={row.componentCode} placeholder="구성품" disabled={isSubtotal || readOnly} onChange={(e) => updateField(row.id, 'componentCode', e.target.value)} /></td>
                      <td className={styles.colErpCell}><input className={styles.promoCellInput} value={row.erpCode} placeholder="세부(ERP)품번" disabled={isSubtotal || readOnly} onChange={(e) => updateField(row.id, 'erpCode', e.target.value)} /></td>
                    </>
                  )}
                  {metricFields.map((field) => (
                    <td key={`${row.id}-${field.key}`} className={`${styles[field.colClass]} ${(field.key === 'margin' || field.key === 'promoMarginRate') ? styles.colMarginRate : ''}`}>
                      <NumericInput className={`${styles.promoCellInput} ${styles.promoCellInputNum}`} value={row[field.key]} disabled={isSubtotal || readOnly} onChange={(value) => updateField(row.id, field.key, value)} />
                    </td>
                  ))}
                </tr>
                {!isSubtotal && expanded && (
                  <tr className={styles.promoRemarkRow}><td colSpan={22}><div className={styles.promoRemarkInner}><strong>비고</strong><input className={styles.promoRemarkInput} value={row.remark} placeholder="비고 입력" disabled={isSubtotal || readOnly} onChange={(e) => updateField(row.id, 'remark', e.target.value)} /></div></td></tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th className={styles.stickyCol} />
            <th className={styles.expandColCell}>{selectedCount ? `${selectedCount}건` : ''}</th>
            <th colSpan={4}>합계</th>
            <th className={styles.colStock}>{formatNumber(totals.stockQty)}</th>
            <th className={styles.colStock}>{formatNumber(totals.stockAmount)}</th>
            <th className={styles.colStock}>-</th><th className={styles.colStock}>-</th><th className={styles.colNormal}>-</th><th className={styles.colNormal}>-</th><th className={styles.colNormal}>-</th><th className={styles.colPromo}>-</th><th className={styles.colPromo}>-</th><th className={styles.colPromo}>-</th>
            <th className={styles.colPromo}>{formatNumber(totals.promoSales)}</th>
            <th className={styles.colPromo}>{formatNumber(totals.promoMargin)}</th>
            <th className={styles.colPromo}>-</th>
            <th className={styles.colProfit}>{formatNumber(totals.salesContribution)}</th>
            <th className={styles.colProfit}>{formatNumber(totals.promoContribution)}</th>
            <th className={styles.colProfit}>{formatNumber(totals.contributionGap)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
