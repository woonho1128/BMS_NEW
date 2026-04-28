import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../../shared/components/Button/Button';
import { getReportById, REPORT_TYPE } from '../../../sales/data/reportMock';
import { getSalesInfoById } from '../../../sales/data/salesInfoMock';
import { getProfitDetail, getRowDetail } from '../../../sales/data/profitAnalysisMock';
import {
  BASE_DISCOUNT_RATE,
  computeShortProjectItem,
  computeShortProjectProfitRow,
} from '../../../sales/utils/shortProjectPricing';
import { APPROVAL_CATEGORY } from '../../data/salesApprovalMock';
import { formatNum, STATUS_LABEL, toMonthWeekLabel } from '../salesApprovalDetail.helpers';
import styles from '../SalesApprovalDetailPage.module.css';
function ShortProjectDetail({ item, groupItems }) {
  const submitItems = useMemo(
    () => (groupItems?.length ? groupItems : [item]),
    [groupItems, item]
  );
  const firstSiteId = submitItems[0]?.id || item.id;
  const [activeSiteId, setActiveSiteId] = useState(submitItems[0]?.id || item.id);

  useEffect(() => {
    setActiveSiteId(firstSiteId);
  }, [firstSiteId]);

  const activeItem = useMemo(
    () => submitItems.find((entry) => entry.id === activeSiteId) || submitItems[0] || item,
    [submitItems, activeSiteId, item]
  );

  const rows = (activeItem?.site?.items || []).map((row, index) => {
    const computed = computeShortProjectItem({
      id: `approval-short-${activeItem.id}-${index}`,
      itemCode: row.itemCode || '',
      qty: String(row.qty ?? 0),
      unit: row.unit || 'EA',
      standardPrice: String(row.standardPrice ?? 0),
      discountRate: String(row.discountRate ?? 0),
      note: row.note || '',
    });
    const profitRow = computeShortProjectProfitRow(computed, false);
    return { ...profitRow, note: row.note || '-' };
  });

  const profitTotal = rows.reduce(
    (acc, row) => ({
      costAmount: acc.costAmount + row.costAmount,
      factoryAmount: acc.factoryAmount + row.factoryAmount,
      baseDiscountAmount: acc.baseDiscountAmount + row.baseDiscountAmount,
      appliedDiscountAmount: acc.appliedDiscountAmount + row.appliedDiscountAmount,
    }),
    { costAmount: 0, factoryAmount: 0, baseDiscountAmount: 0, appliedDiscountAmount: 0 }
  );

  const approvalLine = Array.isArray(item?.approvalLine) ? item.approvalLine : [];
  const submitSummary = item?.submitSummary || null;

  return (
    <>
      {submitItems.length > 1 && (
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>선택 건 요약</h3>
          <div className={styles.submitSummaryBar}>
            <span>선택 건수: {submitSummary?.selectedCount || submitItems.length}건</span>
            <span>대표품번 수: {submitSummary?.itemCount || submitItems.reduce((sum, v) => sum + (v?.site?.items?.length || 0), 0)}개</span>
            <span>기본 할인 금액: {formatNum(submitSummary?.baseDiscountAmount || 0)}</span>
            <span>단납 할인 금액: {formatNum(submitSummary?.shortDiscountAmount || 0)}</span>
          </div>
          <div className={styles.submitSiteTabs} role="tablist" aria-label="상신 대상 현장 선택">
            {submitItems.map((entry) => {
              const isActive = entry.id === activeItem.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.submitSiteTab} ${isActive ? styles.submitSiteTabActive : ''}`}
                  onClick={() => setActiveSiteId(entry.id)}
                >
                  {entry.site?.siteName || '-'}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>현장 정보</h3>
        <div className={styles.grid}>
          <div><span className={styles.label}>현장명</span><strong>{activeItem?.site?.siteName || '-'}</strong></div>
          <div><span className={styles.label}>건설사</span><strong>{activeItem?.site?.builder || '-'}</strong></div>
          <div><span className={styles.label}>대리점</span><strong>{activeItem?.site?.dealer || '-'}</strong></div>
          <div><span className={styles.label}>납품예정일</span><strong>{activeItem?.site?.deliveryFrom || '-'} ~ {activeItem?.site?.deliveryTo || '-'}</strong></div>
          <div><span className={styles.label}>매출 총 이익율</span><strong>{activeItem?.site?.grossRate || '-'}</strong></div>
        </div>
      </section>

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>자동 계산 테이블</h3>
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
                <th colSpan={4}>할인 적용가</th>
                <th rowSpan={2}>매출총이익 금액</th>
                <th rowSpan={2}>매출 총 이익율</th>
                <th rowSpan={2}>비고</th>
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
              {rows.map((row, index) => (
                <tr key={`${row.itemCode}-${index}`}>
                  <td>{row.itemCode || '-'}</td>
                  <td className={styles.cellCenter}>{row.unit || '-'}</td>
                  <td className={styles.cellRight}>{formatNum(row.qty)}</td>
                  <td className={styles.cellRight}>{formatNum(row.costUnitPrice)}</td>
                  <td className={styles.cellRight}>{formatNum(row.factoryUnitPrice)}</td>
                  <td className={styles.cellRight}>{formatNum(row.factoryAmount)}</td>
                  <td className={styles.cellRight}>{formatNum(row.baseDiscountUnitPrice)}</td>
                  <td className={styles.cellRight}>{formatNum(row.baseDiscountAmount)}</td>
                  <td className={styles.cellRight}>{formatNum(row.baseDiscountDiff)}</td>
                  <td className={styles.cellRight}>{row.baseVsFactoryRate.toFixed(2)}%</td>
                  <td className={styles.cellRight}>{formatNum(row.appliedDiscountUnitPrice)}</td>
                  <td className={styles.cellRight}>{formatNum(row.appliedDiscountAmount)}</td>
                  <td className={styles.cellRight}>{formatNum(row.appliedDiscountDiff)}</td>
                  <td className={styles.cellRight}>{row.discountRate.toFixed(2)}%</td>
                  <td className={styles.cellRight}>{formatNum(row.grossProfitAmount)}</td>
                  <td className={styles.cellRight}>{row.grossProfitRate.toFixed(2)}%</td>
                  <td>{row.note || '-'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>합계</td>
                <td className={styles.cellRight}>{formatNum(profitTotal.factoryAmount)}</td>
                <td />
                <td className={styles.cellRight}>{formatNum(profitTotal.baseDiscountAmount)}</td>
                <td className={styles.cellRight}>{formatNum(profitTotal.baseDiscountAmount - profitTotal.factoryAmount)}</td>
                <td className={styles.cellRight}>
                  {profitTotal.factoryAmount
                    ? (((profitTotal.baseDiscountAmount - profitTotal.factoryAmount) / profitTotal.factoryAmount) * 100).toFixed(2)
                    : '0.00'}
                  %
                </td>
                <td />
                <td className={styles.cellRight}>{formatNum(profitTotal.appliedDiscountAmount)}</td>
                <td className={styles.cellRight}>{formatNum(profitTotal.appliedDiscountAmount - profitTotal.factoryAmount)}</td>
                <td className={styles.cellRight}>
                  {profitTotal.factoryAmount
                    ? (((profitTotal.appliedDiscountAmount - profitTotal.factoryAmount) / profitTotal.factoryAmount) * 100).toFixed(2)
                    : '0.00'}
                  %
                </td>
                <td className={styles.cellRight}>{formatNum(profitTotal.appliedDiscountAmount - profitTotal.costAmount)}</td>
                <td className={styles.cellRight}>
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
      </section>

      {(approvalLine.length > 0 || item?.submitComment) && (
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>상신 정보</h3>
          {approvalLine.length > 0 && (
            <div className={styles.approvalLineRow}>
              {approvalLine.map((line) => (
                <span key={`${line.order}-${line.approverId || line.approverName}`} className={styles.approvalChip}>
                  {line.order}차: {line.approverName || '-'} ({line.approverDept || '-'})
                </span>
              ))}
            </div>
          )}
          <div className={styles.readOnlyCommentBox}>
            <span className={styles.label}>상신 의견</span>
            <p className={styles.bodyText}>{item?.submitComment || '(의견 없음)'}</p>
          </div>
        </section>
      )}

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>특이사항</h3>
        <p className={styles.bodyText}>{activeItem?.site?.specialNote || '-'}</p>
      </section>
    </>
  );
}
function SalesInfoDetail({ item, navigate }) {
  const info = getSalesInfoById(item.refId) || getSalesInfoById('4') || item.payload || {};
  const profitId = info?.profitId ?? info?.id;
  const profit = info?.hasProfitAnalysis && profitId ? getProfitDetail(profitId) : null;
  const rows = (profit?.items || [])
    .map((row) => ({ row, detail: getRowDetail(row, true) }))
    .filter((entry) => entry.detail);

  return (
    <>
      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>영업정보</h3>
        <div className={styles.grid}>
          <div><span className={styles.label}>건설사</span><strong>{info.builder || '-'}</strong></div>
          <div><span className={styles.label}>현장명</span><strong>{info.siteName || '-'}</strong></div>
          <div><span className={styles.label}>대리점</span><strong>{info.partner || '-'}</strong></div>
          <div><span className={styles.label}>SPEC NO</span><strong>{info.specNo || '-'}</strong></div>
          <div><span className={styles.label}>납품예정</span><strong>{info.expectedDeliveryDate || '-'}</strong></div>
          <div><span className={styles.label}>등록자</span><strong>{info.author || '-'}</strong></div>
        </div>
      </section>

      {rows.length > 0 && (
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>납품 품목 구성</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thCenter}>구분</th>
                  <th className={styles.thCenter}>SET번호</th>
                  <th className={styles.thCenter}>수량</th>
                  <th className={styles.thCenter}>공장도가</th>
                  <th className={styles.thCenter}>대리점 공급가</th>
                  <th className={styles.thCenter}>매출 총 이익율</th>
                  <th className={styles.thCenter}>영업 이익율</th>
                  <th className={styles.thCenter}>비고</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ row, detail }) => (
                  <tr key={row.id}>
                    <td>{row.type || '-'}</td>
                    <td>{row.itemCode || '-'}</td>
                    <td className={styles.cellRight}>{formatNum(row.qty)}</td>
                    <td className={styles.cellRight}>{formatNum(detail.factoryPrice)}</td>
                    <td className={styles.cellRight}>{formatNum(detail.dealerPrice)}</td>
                    <td className={styles.cellRight}>{detail.grossRate.toFixed(1)}%</td>
                    <td className={styles.cellRight}>{detail.operatingRate.toFixed(1)}%</td>
                    <td>{row.remark || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => navigate('/sales/info/4')}>
          영업정보 상세 보기
        </Button>
      </div>
    </>
  );
}

function ReportDetail({ item }) {
  const report = getReportById(item.refId) || item.payload || {};
  const isWeekly = item.category === APPROVAL_CATEGORY.WEEKLY || report.type === REPORT_TYPE.WEEKLY;
  const thisWeekTasks = Array.isArray(report.keyTasks)
    ? report.keyTasks.map((v) => (typeof v === 'string' ? v : v?.text || '')).filter(Boolean)
    : [];
  const nextWeekTasks = Array.isArray(report.nextWeekTasks)
    ? report.nextWeekTasks.map((v) => (typeof v === 'string' ? v : v?.text || '')).filter(Boolean)
    : [];

  if (!isWeekly) {
    return (
      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>출장보고</h3>
        <div className={styles.grid}>
          <div><span className={styles.label}>출장기간</span><strong>{report.tripFrom || '-'} ~ {report.tripTo || '-'}</strong></div>
          <div><span className={styles.label}>방문지</span><strong>{report.destination || '-'}</strong></div>
          <div><span className={styles.label}>출장 목적</span><strong>{report.purpose || '-'}</strong></div>
          <div><span className={styles.label}>동행자</span><strong>{report.companions || '-'}</strong></div>
        </div>
        <p className={styles.bodyText}>{report.followUp || report.summary || '-'}</p>
      </section>
    );
  }

  return (
    <section className={styles.card}>
      <h3 className={styles.sectionTitle}>주간보고</h3>
      <section className={styles.weeklyView}>
        <div className={styles.weeklyTopMeta}>
          <span className={styles.badge}>주간보고</span>
          <span className={styles.status}>{STATUS_LABEL[item.status] || '-'}</span>
          <span className={styles.authorText}>{report.author || item.drafter || '-'}</span>
        </div>
        <div className={styles.readOnlyField}>
          <span className={styles.readOnlyLabel}>주차</span>
          <span className={styles.weekValue}>{toMonthWeekLabel(report)}</span>
        </div>
        <div className={styles.weeklySplitSection}>
          <article className={styles.weeklyColumn}>
            <h4 className={styles.weeklyColumnHeader}>이번 주</h4>
            <div className={styles.readOnlyField}>
              <span className={styles.readOnlyLabel}>중점 업무</span>
              <ul className={styles.readOnlyList}>
                {(thisWeekTasks.length ? thisWeekTasks : ['-']).map((task, idx) => <li key={`${task}-${idx}`}>{task}</li>)}
              </ul>
            </div>
            <div className={styles.readOnlyField}>
              <span className={styles.readOnlyLabel}>상세 내용</span>
              <p className={styles.readOnlyValue}>{report.keyTaskDetail || '-'}</p>
            </div>
            <div className={styles.readOnlyField}>
              <span className={styles.readOnlyLabel}>이슈 / 요청사항</span>
              <p className={styles.readOnlyValue}>{report.issues || '-'}</p>
            </div>
          </article>
          <article className={styles.weeklyColumn}>
            <h4 className={styles.weeklyColumnHeader}>다음 주</h4>
            <div className={styles.readOnlyField}>
              <span className={styles.readOnlyLabel}>계획 업무</span>
              <ul className={styles.readOnlyList}>
                {(nextWeekTasks.length ? nextWeekTasks : [report.nextPlan || '-']).map((task, idx) => <li key={`${task}-${idx}`}>{task}</li>)}
              </ul>
            </div>
            <div className={styles.readOnlyField}>
              <span className={styles.readOnlyLabel}>상세 계획</span>
              <p className={styles.readOnlyValue}>{report.nextWeekDetail || report.nextPlan || '-'}</p>
            </div>
            <div className={styles.readOnlyField}>
              <span className={styles.readOnlyLabel}>예상 이슈</span>
              <p className={styles.readOnlyValue}>{report.nextWeekIssues || '-'}</p>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}


export { ShortProjectDetail, SalesInfoDetail, ReportDetail };
