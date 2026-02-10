import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import { Modal } from '../../../shared/components/Modal/Modal';
import { Drawer } from '../../../shared/components/Drawer/Drawer';
import { classnames } from '../../../shared/utils/classnames';
import { X } from 'lucide-react';
import { getProfitDetail, getRowDetail } from '../../sales/data/profitAnalysisMock';
import { getSalesInfoById } from '../../sales/data/salesInfoMock';
import { getReportById, REPORT_TYPE } from '../../sales/data/reportMock';
import profitStyles from '../../sales/pages/SalesProfitAnalysisNewPage.module.css';
import salesInfoDetailStyles from '../../sales/pages/SalesInfoDetailPage.module.css';
import styles from './SalesApprovalPage.module.css';

const STEP2_TABLE_COLS = 16;

const TAB_PENDING = 'pending';
const TAB_COMPLETED = 'completed';

const STATUS_DONE = 'done';
const STATUS_REJECT = 'reject';

const WIDE_CATEGORIES = ['profit', 'salesInfo', 'delivery']; // 80%+ 너비

const CATEGORIES = [
  { key: 'profit', label: '손익', path: ROUTES.PROFIT_NEW },
  { key: 'salesInfo', label: '영업정보', path: ROUTES.SALES_INFO_NEW },
  { key: 'weekly', label: '주간보고', path: ROUTES.SALES_REPORT_WEEKLY_NEW },
  { key: 'trip', label: '출장', path: ROUTES.SALES_REPORT_TRIP_NEW },
  { key: 'delivery', label: '납품', path: ROUTES.DELIVERY_PLAN },
  { key: 'ship', label: '출고', path: ROUTES.DELIVERY_REQUEST },
];

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

function formatNum(n) {
  if (n == null || n === '') return '—';
  return Number(n).toLocaleString();
}

/** 카테고리별 상세 데이터 (delivery 등 refId 없는 경우용) */
const DETAIL_DATA = {
  '8': {
    deliveryItems: [
      { 품목명: '제품 A', 규격: 'BOX 100ea', 수량: 50, 단가: 12000 },
      { 품목명: '제품 B', 규격: 'BOX 50ea', 수량: 30, 단가: 25000 },
      { 품목명: '부자재 X', 규격: 'SET', 수량: 100, 단가: 3500 },
    ],
  },
};

const INITIAL_PENDING = [
  { id: '1', category: 'profit', refId: '1', title: '2025년 1분기 손익 검토', drafter: '홍길동', date: '2025-01-20', body: '2025년 1분기 손익 산정 결과를 검토 요청드립니다.' },
  { id: '2', category: 'trip', refId: '2', title: '1월 출장보고서', drafter: '김영업', date: '2025-01-19', body: '1월 5일~7일 A지역 출장 보고서입니다.' },
  { id: '3', category: 'weekly', refId: '1', title: '1월 3주 주간보고', drafter: '이팀장', date: '2025-01-18', body: '1월 3주차 영업 활동 요약입니다.' },
  { id: '4', category: 'ship', title: '출고 요청 #2025-002', drafter: '박물류', date: '2025-01-17', body: 'B사 출고 요청 건입니다.' },
  { id: '8', category: 'delivery', title: 'B사 납품 품목 내역', drafter: '박물류', date: '2025-01-17', body: 'B사 납품 계획에 따른 품목별 수량·단가 확인 요청드립니다.' },
  { id: '9', category: 'salesInfo', refId: '1', title: 'A건설 영업정보 등록', drafter: '김영업', date: '2025-01-16', body: 'A건설 SPEC 등록 건 결재 요청드립니다.' },
];

const INITIAL_COMPLETED = [
  { id: '5', category: 'salesInfo', refId: '1', title: 'A사 영업정보 등록', drafter: '홍길동', date: '2025-01-16', body: 'A사 계약 정보 등록 요청.', approvalComment: '내용 확인 후 승인합니다.', finalStatus: STATUS_DONE },
  { id: '6', category: 'profit', refId: '2', title: '2024년 4분기 손익', drafter: '김영업', date: '2025-01-15', body: '4분기 손익 정산 검토 요청.', approvalComment: '수치 검토 완료. 승인합니다.', finalStatus: STATUS_DONE },
  { id: '7', category: 'ship', title: '출고 요청 #2025-001', drafter: '박물류', date: '2025-01-14', body: '출고 요청 건.', approvalComment: '재고 확인 후 재상신 부탁드립니다.', finalStatus: STATUS_REJECT },
];

function getTabLabel(key) {
  return key === TAB_PENDING ? '결재 대기' : '결재 완료';
}

function getFinalStatusLabel(key) {
  return key === STATUS_DONE ? '승인' : '반려';
}

export function SalesApprovalPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_PENDING);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [pendingList, setPendingList] = useState(INITIAL_PENDING);
  const [completedList, setCompletedList] = useState(INITIAL_COMPLETED);
  const [profitExpandedIds, setProfitExpandedIds] = useState(() => new Set());

  const rows = activeTab === TAB_PENDING ? pendingList : completedList;
  const filteredRows = useMemo(() => {
    if (categoryFilter === 'all') return rows;
    return rows.filter((r) => r.category === categoryFilter);
  }, [rows, categoryFilter]);

  const isCompletedTab = activeTab === TAB_COMPLETED;
  const selectedIsPending = drawerItem && pendingList.some((p) => p.id === drawerItem.id);

  const drawerWidth = useMemo(() => {
    if (!drawerItem) return '42%';
    return WIDE_CATEGORIES.includes(drawerItem.category) ? '82%' : '42%';
  }, [drawerItem]);

  const detailData = drawerItem ? DETAIL_DATA[drawerItem.id] : null;
  const refId = drawerItem?.refId ?? drawerItem?.id;

  const handleOpenDetail = (row) => {
    setDrawerItem(row);
    setApprovalComment('');
    setProfitExpandedIds(new Set());
  };

  const handleCloseDrawer = () => {
    setDrawerItem(null);
    setApprovalComment('');
  };

  const handleApprove = () => {
    if (!drawerItem) return;
    const comment = approvalComment.trim() || '(의견 없음)';
    setPendingList((prev) => prev.filter((p) => p.id !== drawerItem.id));
    setCompletedList((prev) => [{ ...drawerItem, approvalComment: comment, finalStatus: STATUS_DONE }, ...prev]);
    handleCloseDrawer();
  };

  const handleReject = () => {
    if (!drawerItem) return;
    const comment = approvalComment.trim() || '(의견 없음)';
    setPendingList((prev) => prev.filter((p) => p.id !== drawerItem.id));
    setCompletedList((prev) => [{ ...drawerItem, approvalComment: comment, finalStatus: STATUS_REJECT }, ...prev]);
    handleCloseDrawer();
  };

  const handleNewRequestSelect = (cat) => {
    setNewRequestOpen(false);
    navigate(cat.path);
  };

  useEffect(() => {
    if (drawerItem) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [drawerItem]);

  const toggleProfitDetail = useCallback((e, rowId) => {
    e.stopPropagation();
    setProfitExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }, []);

  const renderDetailContent = () => {
    if (!drawerItem) return null;
    const cat = drawerItem.category;
    const data = detailData;

    // ——— 손익: profit/new STEP 3 형태 (getProfitDetail + STEP1 요약 + STEP2 테이블) ———
    if (cat === 'profit' && refId) {
      const profit = getProfitDetail(refId);
      if (!profit) {
        return (
          <div className={styles.detailSection}>
            <p className={styles.detailBodyText}>손익 데이터를 찾을 수 없습니다.</p>
          </div>
        );
      }
      const items = profit.items || [];
      const summary = {
        totalSales: profit.totalSales ?? 0,
        grossRate: profit.grossProfitRate ?? 0,
        operatingRate: profit.operatingProfitRate ?? 0,
      };
      const rowsWithDetail = items.filter((row) => getRowDetail(row, true));
      return (
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>[STEP 1] 손익분석 기본 정보</h3>
          <div className={profitStyles.step1SummaryGrid}>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>스펙구분</div><div className={profitStyles.step1SummaryValue}>{profit.specType || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>건설회사</div><div className={profitStyles.step1SummaryValue}>{profit.builder || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>현장명</div><div className={profitStyles.step1SummaryValue}>{profit.siteName || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>지역</div><div className={profitStyles.step1SummaryValue}>{profit.region || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>수주유형</div><div className={profitStyles.step1SummaryValue}>{profit.orderType || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>사업분류</div><div className={profitStyles.step1SummaryValue}>{profit.businessType || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>영업담당자</div><div className={profitStyles.step1SummaryValue}>{profit.salesManager || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>대리점</div><div className={profitStyles.step1SummaryValue}>{profit.partnerName || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>SPEC 수주일자</div><div className={profitStyles.step1SummaryValue}>{profit.specDate || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>예상납기일</div><div className={profitStyles.step1SummaryValue}>{profit.expectedDeliveryDate || '-'}</div></div>
            <div className={profitStyles.step1SummaryCard}><div className={profitStyles.step1SummaryLabel}>준공예정일</div><div className={profitStyles.step1SummaryValue}>{profit.completionDate || '-'}</div></div>
            <div className={classnames(profitStyles.step1SummaryCard, profitStyles.step1SummaryCardFull)}>
              <div className={profitStyles.step1SummaryLabel}>비고</div>
              <div className={profitStyles.step1SummaryValue}>{profit.remark || '-'}</div>
              {items.length > 0 && (
                <div className={profitStyles.step1SummaryFooter}>
                  <span>대리점 납품금액(원): {summary.totalSales.toLocaleString()}</span>
                  <span>예상 매출총이익률(%): {summary.totalSales > 0 ? `${summary.grossRate.toFixed(1)}%` : '—'}</span>
                </div>
              )}
            </div>
          </div>
          <h3 className={styles.detailSectionTitle}>[STEP 2] 납품 품목 구성</h3>
          <div className={profitStyles.profitTableWrap}>
            <div className={profitStyles.profitTableScroll}>
              <table className={profitStyles.profitTable}>
                <colgroup>
                  <col style={{ width: '6%' }} /><col style={{ width: '8%' }} /><col style={{ width: '8%' }} /><col style={{ width: '6%' }} /><col style={{ width: '6%' }} /><col style={{ width: '7%' }} /><col style={{ width: '7%' }} />
                  <col style={{ width: '3.5%' }} /><col style={{ width: '7%' }} /><col style={{ width: '5%' }} /><col style={{ width: '7%' }} /><col style={{ width: '5.5%' }} /><col style={{ width: '7%' }} /><col style={{ width: '5.5%' }} /><col style={{ width: '7%' }} /><col style={{ width: '6%' }} />
                </colgroup>
                <thead>
                  <tr className={profitStyles.colHeader}>
                    <th className={classnames(profitStyles.colBasic, profitStyles.tLeft)} scope="col">구분</th>
                    <th className={classnames(profitStyles.colBasic, profitStyles.tLeft)} scope="col">SET품번</th>
                    <th className={classnames(profitStyles.colBasic, profitStyles.tLeft)} scope="col">품목별<br />수주유형</th>
                    <th className={classnames(profitStyles.colCost, profitStyles.tRight)} scope="col">공장도가</th>
                    <th className={classnames(profitStyles.colCost, profitStyles.tRight)} scope="col">톤당단가</th>
                    <th className={classnames(profitStyles.colCost, profitStyles.tRight)} scope="col">2026년<br />표준원가</th>
                    <th className={classnames(profitStyles.colCost, profitStyles.tRight)} scope="col">2027년<br />표준원가</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tCenter)} scope="col">수량</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tRight)} scope="col">건설사<br />입찰 단가</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tRight)} scope="col">대리점<br />마진율</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tRight)} scope="col">대리점<br />공급가</th>
                    <th className={classnames(profitStyles.colSale, profitStyles.tRight)} scope="col">할인율(%)</th>
                    <th className={classnames(profitStyles.colProfit, profitStyles.tRight)} scope="col">매출총이익<br />단가</th>
                    <th className={classnames(profitStyles.colProfit, profitStyles.tRight)} scope="col">매출이익(%)</th>
                    <th className={classnames(profitStyles.colProfit, profitStyles.tRight)} scope="col">영업이익<br />단가</th>
                    <th className={classnames(profitStyles.colProfit, profitStyles.tRight)} scope="col">영업이익(%)</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsWithDetail.length === 0 ? (
                    <tr><td colSpan={STEP2_TABLE_COLS} className={profitStyles.emptyRow}>데이터가 없습니다.</td></tr>
                  ) : rowsWithDetail.map((row) => {
                    const d = getRowDetail(row, true);
                    if (!d) return null;
                    const remarkText = d.remark ? String(d.remark).trim() : '';
                    const unitCodes = Array.isArray(row.unitItemCodes) ? row.unitItemCodes : [];
                    const hasDetail = (row.type === 'SET' && unitCodes.length > 0) || remarkText;
                    const isOpen = profitExpandedIds.has(row.id);
                    return (
                      <React.Fragment key={row.id}>
                        <tr className={profitStyles.readOnlyRow}>
                          <td className={classnames(profitStyles.tLeft, profitStyles.colTypeWithToggles)}>
                            {hasDetail && (
                              <div className={profitStyles.rowTogglesWrap} onClick={(e) => e.stopPropagation()}>
                                <button type="button" className={profitStyles.remarkToggleBtn} onClick={(e) => toggleProfitDetail(e, row.id)} aria-expanded={isOpen}>{isOpen ? '▼' : '▶'}</button>
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
                        {hasDetail && isOpen && (
                          <tr className={profitStyles.remarkRow}>
                            <td colSpan={STEP2_TABLE_COLS} className={profitStyles.remarkRowCell}>
                              <div className={profitStyles.detailRowContent}>
                                {unitCodes.length > 0 && <div>자품번 : {unitCodes.join(',')}</div>}
                                <div>비고 : {remarkText || '\u00A0'}</div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className={profitStyles.sumRow}>
                    <td colSpan={7} className={profitStyles.sumCell} />
                    <td className={classnames(profitStyles.tCenter, profitStyles.sumCell)}>{items.reduce((s, r) => s + (Number(r.qty) || 0), 0)}</td>
                    <td colSpan={2} className={profitStyles.sumCell} />
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{items.reduce((s, r) => { const rd = getRowDetail(r, true); return s + (rd ? rd.sales : 0); }, 0).toLocaleString()}</td>
                    <td className={profitStyles.sumCell} />
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{items.reduce((s, r) => { const rd = getRowDetail(r, true); return s + (rd ? rd.grossProfit : 0); }, 0).toLocaleString()}</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{summary.totalSales > 0 ? `${summary.grossRate.toFixed(1)}%` : '—'}</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{items.reduce((s, r) => { const rd = getRowDetail(r, true); return s + (rd ? rd.operatingProfit : 0); }, 0).toLocaleString()}</td>
                    <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{summary.totalSales > 0 ? `${summary.operatingRate.toFixed(1)}%` : '—'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          {drawerItem.body && <p className={styles.detailBodyText}>{drawerItem.body}</p>}
        </div>
      );
    }

    // ——— 출장: getReportById(refId) trip 필드 ———
    if (cat === 'trip' && refId) {
      const report = getReportById(refId);
      if (!report || report.type !== REPORT_TYPE.TRIP) {
        return (
          <div className={styles.detailSection}>
            <p className={styles.detailBodyText}>{drawerItem.body || '출장 보고 데이터를 찾을 수 없습니다.'}</p>
          </div>
        );
      }
      return (
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>출장 기본 정보</h3>
          <div className={styles.detailTableWrap}>
            <table className={styles.detailTable}>
              <tbody>
                <tr><td className={styles.detailTd}>출장기간</td><td className={styles.detailTd}>{report.tripFrom} ~ {report.tripTo}</td></tr>
                <tr><td className={styles.detailTd}>방문지</td><td className={styles.detailTd}>{report.destination || '—'}</td></tr>
                <tr><td className={styles.detailTd}>출장 목적</td><td className={styles.detailTd}>{report.purpose || '—'}</td></tr>
                <tr><td className={styles.detailTd}>동행자</td><td className={styles.detailTd}>{report.companions || '—'}</td></tr>
                <tr><td className={styles.detailTd}>경비 요약</td><td className={styles.detailTd}>{report.costSummary || '—'}</td></tr>
                <tr><td className={styles.detailTd}>후속 조치</td><td className={styles.detailTd}>{report.followUp || '—'}</td></tr>
              </tbody>
            </table>
          </div>
          {report.activities?.length > 0 && (
            <>
              <h3 className={styles.detailSectionTitle}>활동 내역</h3>
              <ul className={styles.detailCardList}>
                {report.activities.map((a, i) => (
                  <li key={i} className={styles.detailCardItem}><strong>{a.activity}</strong> — {a.result}</li>
                ))}
              </ul>
            </>
          )}
          {drawerItem.body && <p className={styles.detailBodyText}>{drawerItem.body}</p>}
        </div>
      );
    }

    // ——— 주간보고: getReportById(refId) weekly 필드 ———
    if (cat === 'weekly' && refId) {
      const report = getReportById(refId);
      if (!report || report.type !== REPORT_TYPE.WEEKLY) {
        return (
          <div className={styles.detailSection}>
            <p className={styles.detailBodyText}>{drawerItem.body || '주간보고 데이터를 찾을 수 없습니다.'}</p>
          </div>
        );
      }
      return (
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>주간보고</h3>
          <div className={styles.detailTableWrap}>
            <table className={styles.detailTable}>
              <tbody>
                <tr><td className={styles.detailTd}>대상 주차</td><td className={styles.detailTd}>{report.periodLabel || '—'}</td></tr>
              </tbody>
            </table>
          </div>
          <h4 className={styles.detailSectionTitle}>이번 주 핵심 업무</h4>
          <ul className={styles.detailCardList}>
            {(report.keyTasks || []).map((t, i) => (
              <li key={i} className={styles.detailCardItem}>{typeof t === 'string' ? t : t.text}</li>
            ))}
          </ul>
          {report.nextPlan && <><h4 className={styles.detailSectionTitle}>차주 계획</h4><p className={styles.detailBodyText}>{report.nextPlan}</p></>}
          {report.issues && <><h4 className={styles.detailSectionTitle}>이슈 / 요청사항</h4><p className={styles.detailBodyText}>{report.issues}</p></>}
          {drawerItem.body && <p className={styles.detailBodyText}>{drawerItem.body}</p>}
        </div>
      );
    }

    // ——— 영업정보: sales/info/1 스타일 (getSalesInfoById + 결재 가능) ———
    if (cat === 'salesInfo' && refId) {
      const item = getSalesInfoById(refId);
      if (!item) {
        return (
          <div className={styles.detailSection}>
            <p className={styles.detailBodyText}>영업정보를 찾을 수 없습니다.</p>
          </div>
        );
      }
      const profitId = item.profitId ?? item.id;
      const profit = item.hasProfitAnalysis && profitId ? getProfitDetail(profitId) : null;
      const grossColor = item.grossProfitRate != null ? (item.grossProfitRate >= 20 ? 'high' : item.grossProfitRate >= 10 ? 'medium' : 'low') : null;
      const operatingColor = item.operatingProfitRate != null ? (item.operatingProfitRate >= 20 ? 'high' : item.operatingProfitRate >= 10 ? 'medium' : 'low') : null;
      const infoItems = profit?.items ?? [];
      const infoSummary = profit ? { totalSales: profit.totalSales ?? 0, grossRate: profit.grossProfitRate ?? 0, operatingRate: profit.operatingProfitRate ?? 0 } : null;
      return (
        <div className={styles.detailSection}>
          <div className={salesInfoDetailStyles.metaRow}>
            <span className={classnames(salesInfoDetailStyles.badge, item.progress === '완료' && salesInfoDetailStyles.badgeComplete, item.progress === '대기' && salesInfoDetailStyles.badgeWait)}>{item.progress}</span>
            <span className={salesInfoDetailStyles.specNo}>{item.specNo}</span>
            <span className={salesInfoDetailStyles.author}>등록자: {item.author}</span>
          </div>
          <div className={salesInfoDetailStyles.grid}>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>건설회사</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.builder}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>SW SPEC NO</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.specNo}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>현장명</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.siteName}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>대리점</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.partner}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>SPEC 등록일</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.specRegisterDate ?? '—'}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>SW 수주일자</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.orderDate ?? '—'}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>예상납기일</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.expectedDeliveryDate ?? '—'}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>완공예정일</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.completionDate ?? '—'}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>유상옵션</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.paidOption ?? '—'}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>손익분석</span><span className={classnames(salesInfoDetailStyles.badgeInline, item.hasProfitAnalysis ? salesInfoDetailStyles.badgeYes : salesInfoDetailStyles.badgeNo)}>{item.hasProfitAnalysis ? 'Y' : 'N'}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>매출총이익률(%)</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.grossProfitRate != null ? <span className={classnames(salesInfoDetailStyles.profitRate, grossColor && salesInfoDetailStyles[`profitRate_${grossColor}`])}>{item.grossProfitRate.toFixed(1)}</span> : '—'}</span></div>
            <div className={salesInfoDetailStyles.readOnlyField}><span className={salesInfoDetailStyles.readOnlyLabel}>영업이익률(%)</span><span className={salesInfoDetailStyles.readOnlyValue}>{item.operatingProfitRate != null ? <span className={classnames(salesInfoDetailStyles.profitRate, operatingColor && salesInfoDetailStyles[`profitRate_${operatingColor}`])}>{item.operatingProfitRate.toFixed(1)}</span> : '—'}</span></div>
          </div>
          {profit && infoItems.length > 0 && (
            <>
              <h3 className={styles.detailSectionTitle}>손익분석 납품 품목</h3>
              <div className={profitStyles.profitTableWrap}>
                <div className={profitStyles.profitTableScroll}>
                  <table className={profitStyles.profitTable}>
                    <thead>
                      <tr className={profitStyles.colHeader}>
                        <th className={profitStyles.tLeft}>구분</th><th className={profitStyles.tLeft}>SET품번</th><th className={profitStyles.tLeft}>수주유형</th>
                        <th className={profitStyles.tRight}>수량</th><th className={profitStyles.tRight}>입찰 단가</th><th className={profitStyles.tRight}>공급가</th><th className={profitStyles.tRight}>매출이익(%)</th><th className={profitStyles.tRight}>영업이익(%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {infoItems.filter((r) => getRowDetail(r, true)).map((row) => {
                        const d = getRowDetail(row, true);
                        if (!d) return null;
                        return (
                          <tr key={row.id} className={profitStyles.readOnlyRow}>
                            <td className={profitStyles.tLeft}>{row.type}</td>
                            <td className={profitStyles.tLeft}>{row.type === 'SET' ? row.itemCode : '-'}</td>
                            <td className={profitStyles.tLeft}>{row.orderType ?? '-'}</td>
                            <td className={profitStyles.tCenter}>{row.qty}</td>
                            <td className={profitStyles.tRight}>{d.bidPrice.toLocaleString()}</td>
                            <td className={profitStyles.tRight}>{d.dealerPrice.toLocaleString()}</td>
                            <td className={classnames(profitStyles.tRight, d.grossRate >= 15 ? profitStyles.rateGood : d.grossRate >= 10 ? profitStyles.rateMid : profitStyles.rateLow)}>{d.grossRate.toFixed(1)}%</td>
                            <td className={classnames(profitStyles.tRight, d.operatingRate >= 15 ? profitStyles.rateGood : d.operatingRate >= 10 ? profitStyles.rateMid : profitStyles.rateLow)}>{d.operatingRate.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className={profitStyles.sumRow}>
                        <td colSpan={3} className={profitStyles.sumCell} />
                        <td className={profitStyles.tCenter}>{infoItems.reduce((s, r) => s + (Number(r.qty) || 0), 0)}</td>
                        <td colSpan={2} className={profitStyles.sumCell} />
                        <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{infoSummary?.totalSales > 0 ? `${infoSummary.grossRate.toFixed(1)}%` : '—'}</td>
                        <td className={classnames(profitStyles.tRight, profitStyles.sumCell)}>{infoSummary?.totalSales > 0 ? `${infoSummary.operatingRate.toFixed(1)}%` : '—'}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
          {drawerItem.body && <p className={styles.detailBodyText}>{drawerItem.body}</p>}
        </div>
      );
    }

    // ——— 납품: 기존 DETAIL_DATA ———
    if (cat === 'delivery' && data?.deliveryItems) {
      const items = data.deliveryItems;
      const totalAmount = items.reduce((sum, r) => sum + (r.수량 * r.단가 || 0), 0);
      return (
        <div className={styles.detailSection}>
          <h3 className={styles.detailSectionTitle}>납품 품목</h3>
          <div className={styles.detailTableWrap}>
            <table className={styles.detailTable}>
              <thead>
                <tr>
                  <th className={styles.detailTh}>품목명</th>
                  <th className={styles.detailTh}>규격</th>
                  <th className={classnames(styles.detailTh, styles.num)}>수량</th>
                  <th className={classnames(styles.detailTh, styles.num)}>단가(원)</th>
                  <th className={classnames(styles.detailTh, styles.num)}>금액(원)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r, i) => (
                  <tr key={i}>
                    <td className={styles.detailTd}>{r.품목명}</td>
                    <td className={styles.detailTd}>{r.규격}</td>
                    <td className={classnames(styles.detailTd, styles.num)}>{formatNum(r.수량)}</td>
                    <td className={classnames(styles.detailTd, styles.num)}>{formatNum(r.단가)}</td>
                    <td className={classnames(styles.detailTd, styles.num)}>{formatNum(r.수량 * r.단가)}</td>
                  </tr>
                ))}
                <tr className={styles.totalRow}>
                  <td className={styles.detailTd} colSpan={4}>합계</td>
                  <td className={classnames(styles.detailTd, styles.num)}>{formatNum(totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {drawerItem.body && <p className={styles.detailBodyText}>{drawerItem.body}</p>}
        </div>
      );
    }

    return (
      <div className={styles.detailSection}>
        <div className={styles.drawerBody}>
          <div className={styles.drawerBodyText}>{drawerItem.body}</div>
        </div>
      </div>
    );
  };

  return (
    <PageShell
      path={ROUTES.APPROVAL_SALES}
      description="승인 대기·완료 건을 확인하고 결재 처리할 수 있습니다."
      actions={
        <button type="button" className={styles.primaryBtn} onClick={() => setNewRequestOpen(true)}>
          + 새 결재 요청
        </button>
      }
    >
      <div className={styles.wrapper}>
        <div className={styles.tabList} role="tablist">
          {[TAB_PENDING, TAB_COMPLETED].map((tabKey) => (
            <button
              key={tabKey}
              type="button"
              role="tab"
              aria-selected={activeTab === tabKey}
              className={classnames(styles.tab, activeTab === tabKey && styles.tabActive)}
              onClick={() => setActiveTab(tabKey)}
            >
              {getTabLabel(tabKey)}
            </button>
          ))}
        </div>

        <div className={styles.categoryTabsRow}>
          <div className={styles.categoryTabs} role="tablist" aria-label="카테고리">
            <button
              type="button"
              role="tab"
              aria-selected={categoryFilter === 'all'}
              className={classnames(styles.categoryTab, categoryFilter === 'all' && styles.categoryTabActive)}
              onClick={() => setCategoryFilter('all')}
            >
              전체
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={categoryFilter === c.key}
                className={classnames(styles.categoryTab, categoryFilter === c.key && styles.categoryTabActive)}
                onClick={() => setCategoryFilter(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>카테고리</th>
                <th className={styles.th}>제목</th>
                <th className={styles.th}>기안자</th>
                <th className={styles.th}>기안일</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.emptyCell}>해당 조건의 결재 건이 없습니다.</td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className={styles.row} onClick={() => handleOpenDetail(row)}>
                    <td className={styles.td}>
                      <span className={classnames(styles.categoryBadge, styles[`category_${row.category}`])}>
                        {CATEGORY_LABELS[row.category] ?? row.category}
                      </span>
                    </td>
                    <td className={styles.td}>{row.title}</td>
                    <td className={styles.td}>{row.drafter}</td>
                    <td className={styles.td}>{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer
        open={Boolean(drawerItem)}
        onClose={handleCloseDrawer}
        width={drawerWidth}
        className={drawerWidth === '82%' ? styles.drawerWide : undefined}
      >
        {drawerItem && (
          <>
            <div className={styles.drawerHeader}>
              <button type="button" className={styles.drawerClose} onClick={handleCloseDrawer} aria-label="닫기">
                <X size={22} strokeWidth={2} />
              </button>
            </div>

            <div className={styles.drawerScroll}>
              <div className={styles.drawerMeta}>
                <span className={classnames(styles.categoryBadge, styles.categoryBadgeLg, styles[`category_${drawerItem.category}`])}>
                  {CATEGORY_LABELS[drawerItem.category] ?? drawerItem.category}
                </span>
                <h2 className={styles.drawerTitle}>{drawerItem.title}</h2>
                <p className={styles.drawerSub}>기안자 {drawerItem.drafter} · {drawerItem.date}</p>
              </div>

              {renderDetailContent()}

              {isCompletedTab && drawerItem.approvalComment != null && (
                <div className={styles.drawerResult}>
                  <h3 className={styles.drawerResultTitle}>결재 결과</h3>
                  <p className={styles.drawerResultStatus}>
                    <span className={classnames(styles.finalBadge, drawerItem.finalStatus === STATUS_DONE && styles.finalApprove, drawerItem.finalStatus === STATUS_REJECT && styles.finalReject)}>
                      {getFinalStatusLabel(drawerItem.finalStatus)}
                    </span>
                  </p>
                  <p className={styles.drawerResultComment}>{drawerItem.approvalComment}</p>
                </div>
              )}
            </div>

            {/* 고정 결재 액션바 (대기 건일 때만) */}
            {selectedIsPending && (
              <div className={styles.drawerStickyFooter}>
                <label htmlFor="approval-comment" className={styles.commentLabel}>결재 의견</label>
                <textarea
                  id="approval-comment"
                  className={styles.commentTextarea}
                  placeholder="승인 또는 반려 의견을 입력하세요."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  rows={3}
                />
                <div className={styles.actionButtons}>
                  <button type="button" className={styles.rejectBtn} onClick={handleReject}>반려</button>
                  <button type="button" className={styles.approveBtn} onClick={handleApprove}>승인</button>
                </div>
              </div>
            )}
          </>
        )}
      </Drawer>

      <Modal open={newRequestOpen} onClose={() => setNewRequestOpen(false)} title="새 결재 요청" size="sm">
        <p className={styles.modalDesc}>결재 유형을 선택하면 해당 양식 페이지로 이동합니다.</p>
        <ul className={styles.categoryList}>
          {CATEGORIES.map((c) => (
            <li key={c.key}>
              <button type="button" className={styles.categoryBtn} onClick={() => handleNewRequestSelect(c)}>{c.label}</button>
            </li>
          ))}
        </ul>
      </Modal>
    </PageShell>
  );
}
