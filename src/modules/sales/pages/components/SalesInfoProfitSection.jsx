import React from 'react';
import { Card, CardBody } from '../../../../shared/components/Card';
import { classnames } from '../../../../shared/utils/classnames';
import { getRowDetail } from '../../data/profitAnalysisMock';

const STEP2_TABLE_COLS = 16;

export function SalesInfoProfitSection({
  styles,
  profitStyles,
  profit,
  summary,
  items,
  expandedDetailIds,
  toggleDetail,
}) {
  if (!profit) return null;

  return (
    <>
      <Card title="손익분석 기본 정보 (결과 요약)" className={styles.sectionCard}>
        <CardBody>
          <div className={profitStyles.step1SummaryGrid}>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>스펙구분</div><div className={profitStyles.step1SummaryValue}>{profit.specType || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>건설회사</div><div className={profitStyles.step1SummaryValue}>{profit.builder || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>현장명</div><div className={profitStyles.step1SummaryValue}>{profit.siteName || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>지역</div><div className={profitStyles.step1SummaryValue}>{profit.region || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>수주유형</div><div className={profitStyles.step1SummaryValue}>{profit.orderType || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>사업분류</div><div className={profitStyles.step1SummaryValue}>{profit.businessType || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>영업담당자</div><div className={profitStyles.step1SummaryValue}>{profit.salesManager || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>대리점</div><div className={profitStyles.step1SummaryValue}>{profit.partnerName || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>비대일체형 진행여부</div><div className={profitStyles.step1SummaryValue}>{profit.integratedProgress || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>유상옵션 적용 여부</div><div className={profitStyles.step1SummaryValue}>{profit.paidOption || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>총세대수</div><div className={profitStyles.step1SummaryValue}>{profit.totalHouseholds || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>적용세대수</div><div className={profitStyles.step1SummaryValue}>{profit.appliedHouseholds || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>원가 예상 상승률</div><div className={profitStyles.step1SummaryValue}>{profit.costIncreaseRate ? `${profit.costIncreaseRate}%` : '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>SPEC 수주일자</div><div className={profitStyles.step1SummaryValue}>{profit.specDate || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>예상납기일</div><div className={profitStyles.step1SummaryValue}>{profit.expectedDeliveryDate || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>준공예정일</div><div className={profitStyles.step1SummaryValue}>{profit.completionDate || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>ORIGIN SPEC NO</div><div className={profitStyles.step1SummaryValue}>{profit.originSpecNo || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>지급수수료 적용</div><div className={profitStyles.step1SummaryValue}>{profit.commissionEnabled ? `${profit.commissionFee || 0}원` : '미적용'}</div></div>
            <div className={classnames(profitStyles.step1SummaryCard, profitStyles.step1SummaryCardFull)}>
              <div className={profitStyles.step1SummaryLabel}>비고</div>
              <div className={profitStyles.step1SummaryValue}>{profit.remark || '-'}</div>
              {summary && items.length > 0 && (
                <div className={profitStyles.step1SummaryFooter}>
                  <span>대리점 납품금액(원): {summary.totalSales.toLocaleString()}</span>
                  <span>예상 매출총이익률(%): {summary.totalSales > 0 ? `${summary.grossRate.toFixed(1)}%` : '—'}</span>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card title="납품 품목 구성" className={styles.sectionCard}>
        <CardBody>
          <div className={profitStyles.profitTableWrap}>
            <div className={profitStyles.profitTableScroll}>
              <table className={profitStyles.profitTable}>
                <colgroup>
                  <col style={{ width: '6%' }} /><col style={{ width: '8%' }} /><col style={{ width: '8%' }} /><col style={{ width: '6%' }} /><col style={{ width: '6%' }} /><col style={{ width: '7%' }} /><col style={{ width: '7%' }} /><col style={{ width: '3.5%' }} /><col style={{ width: '7%' }} /><col style={{ width: '5%' }} /><col style={{ width: '7%' }} /><col style={{ width: '5.5%' }} /><col style={{ width: '7%' }} /><col style={{ width: '5.5%' }} /><col style={{ width: '7%' }} /><col style={{ width: '6%' }} />
                </colgroup>
                <thead>
                  <tr className={profitStyles.colHeader}>
                    <th className={classnames(profitStyles.colBasic, profitStyles.tLeft)} scope="col">구분</th>
                    <th className={classnames(profitStyles.colBasic, profitStyles.tLeft)} scope="col">SET품번</th>
                    <th className={classnames(profitStyles.colBasic, profitStyles.tLeft)} scope="col">품목별<br />수주유형</th>
                    <th className={classnames(profitStyles.colCost, profitStyles.tRight)} scope="col">공장도가</th>
                    <th className={classnames(profitStyles.colCost, profitStyles.tRight)} scope="col">톤당단가</th>
                    <th className={classnames(profitStyles.colCost, profitStyles.tRight)} scope="col">2026년(현재)<br />표준원가</th>
                    <th className={classnames(profitStyles.colCost, profitStyles.tRight)} scope="col">2027년(예상)<br />표준원가</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tCenter)} scope="col">수량</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tRight)} scope="col">건설사<br />입찰 단가</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tRight)} scope="col">대리점<br />마진율</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tRight)} scope="col">대리점<br />공급가</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tRight)} scope="col">공장도대비<br />할인율(%)</th>
                    <th className={classnames(profitStyles.colProfit, profitStyles.tRight)} scope="col">매출총이익<br />단가</th>
                    <th className={classnames(profitStyles.colProfit, profitStyles.tRight)} scope="col">매출이익(%)</th>
                    <th className={classnames(profitStyles.colProfit, profitStyles.tRight)} scope="col">영업이익<br />단가</th>
                    <th className={classnames(profitStyles.colProfit, profitStyles.tRight)} scope="col">영업이익(%)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr><td colSpan={STEP2_TABLE_COLS} className={profitStyles.emptyRow}>데이터가 없습니다.</td></tr>
                  ) : (
                    (() => {
                      const rowsWithDetail = items.filter((row) => getRowDetail(row, true));
                      if (rowsWithDetail.length === 0) return <tr><td colSpan={STEP2_TABLE_COLS} className={profitStyles.emptyRow}>품목을 선택해 주세요.</td></tr>;
                      return rowsWithDetail.map((row) => {
                        const d = getRowDetail(row, true);
                        if (!d) return null;
                        const remarkText = d.remark ? String(d.remark).trim() : '';
                        const unitCodes = Array.isArray(row.unitItemCodes) ? row.unitItemCodes : [];
                        const hasUnitCodes = row.type === 'SET' && unitCodes.length > 0;
                        const hasDetail = hasUnitCodes || remarkText;
                        const isDetailOpen = expandedDetailIds.has(row.id);
                        const unitCodesStr = unitCodes.join(',');
                        return (
                          <React.Fragment key={row.id}>
                            <tr className={profitStyles.readOnlyRow}>
                              <td className={classnames(profitStyles.tLeft, profitStyles.colTypeWithToggles)}>
                                {hasDetail && (
                                  <div className={profitStyles.rowTogglesWrap} onClick={(e) => e.stopPropagation()}>
                                    <button type="button" className={profitStyles.remarkToggleBtn} onClick={(e) => toggleDetail(e, row.id)} title={isDetailOpen ? '자품번·비고 숨기기' : '자품번·비고 보기'} aria-expanded={isDetailOpen}>
                                      {isDetailOpen ? '▼' : '▶'}
                                    </button>
                                  </div>
                                )}
                                <span className={classnames(profitStyles.colTypeLabel, hasDetail && profitStyles.colTypeLabelWithToggle)}>{row.type}</span>
                              </td>
                              <td className={profitStyles.tLeft}>{row.type === 'SET' ? row.itemCode : '-'}</td>
                              <td className={profitStyles.tLeft}>{row.orderType ?? '-'}</td>
                              <td className={profitStyles.tRight}>{d.factoryPrice.toLocaleString()}</td>
                              <td className={profitStyles.tRight}>{d.costPerTon ? d.costPerTon.toLocaleString() : '-'}</td>
                              <td className={profitStyles.tRight}>{d.cost2026.toLocaleString()}</td>
                              <td className={profitStyles.tRight}>{d.cost2027.toLocaleString()}</td>
                              <td className={profitStyles.tCenter}>{row.qty}</td>
                              <td className={profitStyles.tRight}>{d.bidPrice.toLocaleString()}</td>
                              <td className={profitStyles.tRight}>{d.marginRateDealer}%</td>
                              <td className={profitStyles.tRight}>{d.dealerPrice.toLocaleString()}</td>
                              <td className={profitStyles.tRight}>{d.discountRate.toFixed(1)}%</td>
                              <td className={profitStyles.tRight}>{d.grossProfitPerUnit.toLocaleString()}</td>
                              <td className={classnames(profitStyles.tRight, d.grossRate >= 15 ? profitStyles.rateGood : d.grossRate >= 10 ? profitStyles.rateMid : profitStyles.rateLow)}>{d.grossRate.toFixed(1)}%</td>
                              <td className={profitStyles.tRight}>{d.operatingProfitPerUnit.toLocaleString()}</td>
                              <td className={classnames(profitStyles.tRight, d.operatingRate >= 15 ? profitStyles.rateGood : d.operatingRate >= 10 ? profitStyles.rateMid : profitStyles.rateLow)}>{d.operatingRate.toFixed(1)}%</td>
                            </tr>
                            {hasDetail && isDetailOpen && (
                              <tr className={profitStyles.remarkRow}>
                                <td colSpan={STEP2_TABLE_COLS} className={profitStyles.remarkRowCell}>
                                  <div className={profitStyles.detailRowContent}>
                                    {hasUnitCodes && <div>자품번 : {unitCodesStr}</div>}
                                    <div>비고 : {remarkText || '\u00A0'}</div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      });
                    })()
                  )}
                </tbody>
                <tfoot>
                  <tr className={profitStyles.sumRow}>
                    <td className={classnames(profitStyles.tLeft, profitStyles.sumCell)} />
                    <td className={classnames(profitStyles.tLeft, profitStyles.sumCell)} />
                    <td className={classnames(profitStyles.tLeft, profitStyles.sumCell)} />
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>—</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>—</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>—</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>—</td>
                    <td className={classnames(profitStyles.tCenter, profitStyles.sumCell)}>{items.reduce((s, r) => s + (Number(r.qty) || 0), 0)}</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>—</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)} />
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.sales : 0); }, 0).toLocaleString()}</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)} />
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.grossProfit : 0); }, 0).toLocaleString()}</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{summary?.totalSales > 0 ? `${summary.grossRate.toFixed(1)}%` : '—'}</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{items.reduce((s, r) => { const d = getRowDetail(r, true); return s + (d ? d.operatingProfit : 0); }, 0).toLocaleString()}</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{summary?.totalSales > 0 ? `${summary.operatingRate.toFixed(1)}%` : '—'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default SalesInfoProfitSection;
