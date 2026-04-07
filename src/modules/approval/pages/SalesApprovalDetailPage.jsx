import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../shared/components/Button/Button';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import { getReportById, REPORT_TYPE } from '../../sales/data/reportMock';
import { getSalesInfoById } from '../../sales/data/salesInfoMock';
import { getProfitDetail, getRowDetail } from '../../sales/data/profitAnalysisMock';
import { formatNumber } from '../../../shared/utils/formatters';
import {
  BASE_DISCOUNT_RATE,
  computeShortProjectItem,
  computeShortProjectProfitRow,
} from '../../sales/utils/shortProjectPricing';
import {
  APPROVAL_CATEGORY,
  APPROVAL_CATEGORY_LABEL,
  APPROVAL_STATUS,
  getApprovalById,
  getApprovalList,
  updateApprovalDecision,
} from '../data/salesApprovalMock';
import styles from './SalesApprovalDetailPage.module.css';

const STATUS_LABEL = {
  [APPROVAL_STATUS.PENDING]: '결재 진행',
  [APPROVAL_STATUS.APPROVED]: '결재 완료',
  [APPROVAL_STATUS.REJECTED]: '결재 반려',
};

function formatNum(value) {
  return formatNumber(value);
}

function toMonthWeekLabel(report) {
  const weekLabel = String(report?.weekLabel || '');
  const alreadyKo = weekLabel.match(/(\d{4})년\s*(\d{1,2})월\s*(\d)주차/);
  if (alreadyKo) return `${alreadyKo[1]}년 ${Number(alreadyKo[2])}월 ${Number(alreadyKo[3])}주차`;

  const periodLabel = String(report?.periodLabel || '');
  const match = periodLabel.match(/(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const firstDayOffset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    const week = Math.floor((day + firstDayOffset - 1) / 7) + 1;
    return `${year}년 ${month}월 ${week}주차`;
  }

  const codeMatch = String(report?.period || '').match(/^(\d{4})-W(\d{1,2})$/);
  if (codeMatch) return `${codeMatch[1]}년 ${Number(codeMatch[2])}주차`;
  return report?.period || '-';
}

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

export function SalesApprovalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const item = useMemo(() => getApprovalById(id), [id]);
  const shortProjectGroupItems = useMemo(() => {
    if (!item || item.category !== APPROVAL_CATEGORY.SHORT_PROJECT || !item.submitGroupId) return [];
    return getApprovalList()
      .filter((entry) => entry.category === APPROVAL_CATEGORY.SHORT_PROJECT && entry.submitGroupId === item.submitGroupId)
      .sort((a, b) => String(a.site?.siteName || '').localeCompare(String(b.site?.siteName || '')));
  }, [item]);
  const [opinion, setOpinion] = useState('');

  if (!item) {
    return (
      <PageShell path={ROUTES.APPROVAL_SALES} title="영업 결재 상세">
        <section className={styles.card}>
          <p className={styles.bodyText}>결재 대상을 찾을 수 없습니다.</p>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.APPROVAL_SALES)}>목록으로</Button>
          </div>
        </section>
      </PageShell>
    );
  }

  const handleDecision = (nextStatus) => {
    if (item.status !== APPROVAL_STATUS.PENDING) return;
    updateApprovalDecision(item.id, nextStatus, opinion);
    navigate(ROUTES.APPROVAL_SALES);
  };

  return (
    <PageShell
      path={ROUTES.APPROVAL_SALES}
      title="영업 결재 상세"
      description="상세 내용을 확인하고 결재 의견을 입력한 뒤 승인/반려를 진행하세요."
      actions={<Button variant="secondary" onClick={() => navigate(ROUTES.APPROVAL_SALES)}>목록으로</Button>}
    >
      <div className={styles.page}>
        <section className={styles.card}>
          <div className={styles.metaRow}>
            <span className={styles.badge}>{APPROVAL_CATEGORY_LABEL[item.category] || item.category}</span>
            <span className={styles.status}>{STATUS_LABEL[item.status] || item.status}</span>
          </div>
          <h2 className={styles.title}>{item.title}</h2>
          <p className={styles.metaText}>기안자 {item.drafter} / {item.date}</p>
          <p className={styles.bodyText}>{item.body || '-'}</p>
        </section>

        {item.category === APPROVAL_CATEGORY.SHORT_PROJECT && (
          <ShortProjectDetail item={item} groupItems={shortProjectGroupItems} />
        )}
        {item.category === APPROVAL_CATEGORY.SALES_INFO && <SalesInfoDetail item={item} navigate={navigate} />}
        {(item.category === APPROVAL_CATEGORY.WEEKLY || item.category === APPROVAL_CATEGORY.TRIP) && <ReportDetail item={item} />}

        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>결재 의견</h3>
          <textarea
            className={styles.textarea}
            rows={4}
            placeholder="승인/반려 의견을 입력하세요."
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            disabled={item.status !== APPROVAL_STATUS.PENDING}
          />
          {item.status !== APPROVAL_STATUS.PENDING && (
            <p className={styles.bodyText}>처리 의견: {item.comment || '(의견 없음)'}</p>
          )}
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => navigate(ROUTES.APPROVAL_SALES)}>목록으로</Button>
            <Button variant="secondary" onClick={() => handleDecision(APPROVAL_STATUS.REJECTED)} disabled={item.status !== APPROVAL_STATUS.PENDING}>
              반려
            </Button>
            <Button variant="primary" onClick={() => handleDecision(APPROVAL_STATUS.APPROVED)} disabled={item.status !== APPROVAL_STATUS.PENDING}>
              승인
            </Button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default SalesApprovalDetailPage;

