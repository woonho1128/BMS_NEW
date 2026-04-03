import React, { useEffect, useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { ROUTES } from '../../../router/routePaths';
import { DEMAND_FORECAST_ROWS } from '../data/demandForecastMock';
import { useAuth } from '../../auth/hooks/useAuth';
import { usePagination } from '../../../shared/hooks/usePagination';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { formatNumber } from '../../../shared/utils/formatters';
import styles from './DemandForecastPage.module.css';

const FACTOR_STORAGE_KEY = 'bms-demand-forecast-factors-v1';
const HISTORY_STORAGE_KEY = 'bms-demand-forecast-history-v1';

function formatNum(value) {
  return formatNumber(value);
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildDefaultFactorMap() {
  return DEMAND_FORECAST_ROWS.reduce((acc, row) => {
    acc[row.itemCode] = row.qualitativeFactor;
    return acc;
  }, {});
}

function loadFactorMap() {
  const fallback = buildDefaultFactorMap();
  try {
    const raw = localStorage.getItem(FACTOR_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getStatusInfo(shortageRate) {
  if (shortageRate >= 50) return { key: 'danger', label: '위험' };
  if (shortageRate >= 20) return { key: 'warning', label: '경고' };
  return { key: 'normal', label: '정상' };
}

export function DemandForecastPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [savedFactorMap, setSavedFactorMap] = useState(() => loadFactorMap());
  const [factorMap, setFactorMap] = useState(() => loadFactorMap());
  const [reasonMap, setReasonMap] = useState({});
  const [historyRows, setHistoryRows] = useState(() => loadHistory());
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [selectedHistoryItemCode, setSelectedHistoryItemCode] = useState(null);
  const [allowEscClose, setAllowEscClose] = useState(true);
  const [allowBackdropClose, setAllowBackdropClose] = useState(true);
  const [resultTab, setResultTab] = useState('result');

  const changedCount = useMemo(
    () =>
      Object.keys(factorMap).filter(
        (itemCode) => Number(factorMap[itemCode] || 0) !== Number(savedFactorMap[itemCode] || 0)
      ).length,
    [factorMap, savedFactorMap]
  );

  const computedRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return DEMAND_FORECAST_ROWS.map((row) => {
      const factor = Number(factorMap[row.itemCode] || 0);
      const savedFactor = Number(savedFactorMap[row.itemCode] || 0);
      const isChanged = factor !== savedFactor;
      const safetyStock = Math.round(row.avgMonthlySales * 3 * factor);
      const shortage = Math.max(0, safetyStock - row.currentStock);
      const shortageRate = safetyStock > 0 ? (shortage / safetyStock) * 100 : 0;
      const status = getStatusInfo(shortageRate);
      return { ...row, factor, isChanged, safetyStock, shortage, shortageRate, status };
    }).filter((row) => {
      if (!keyword) return true;
      return row.itemCode.toLowerCase().includes(keyword) || row.itemName.toLowerCase().includes(keyword);
    });
  }, [factorMap, savedFactorMap, search]);

  const filteredRows = useMemo(() => {
    if (statusFilter === 'danger') return computedRows.filter((row) => row.status.key === 'danger');
    if (statusFilter === 'warning') return computedRows.filter((row) => row.status.key === 'warning');
    if (statusFilter === 'attention') return computedRows.filter((row) => row.status.key !== 'normal');
    return computedRows;
  }, [computedRows, statusFilter]);

  const summary = useMemo(() => {
    const dangerCount = computedRows.filter((row) => row.status.key === 'danger').length;
    const warningCount = computedRows.filter((row) => row.status.key === 'warning').length;
    const attentionCount = dangerCount + warningCount;
    const totalShortage = computedRows.reduce((acc, row) => acc + row.shortage, 0);
    return { total: computedRows.length, dangerCount, warningCount, attentionCount, totalShortage };
  }, [computedRows]);

  const pagination = usePagination(filteredRows, { initialPageSize: 10 });
  const { pagedData, currentPage, pageSize, totalCount, setPage, setPageSize } = pagination;

  const latestHistoryByItem = useMemo(() => {
    const map = {};
    historyRows.forEach((row) => {
      if (!map[row.itemCode]) map[row.itemCode] = row;
    });
    return map;
  }, [historyRows]);

  const historyByItem = useMemo(() => {
    const map = {};
    historyRows.forEach((row) => {
      if (!map[row.itemCode]) map[row.itemCode] = [];
      map[row.itemCode].push(row);
    });
    return map;
  }, [historyRows]);

  const selectedHistoryRows = selectedHistoryItemCode ? historyByItem[selectedHistoryItemCode] || [] : [];
  const selectedItem = selectedHistoryItemCode
    ? DEMAND_FORECAST_ROWS.find((row) => row.itemCode === selectedHistoryItemCode)
    : null;

  const handleReset = () => {
    setFactorMap(savedFactorMap);
    setReasonMap({});
  };

  const handleFactorChange = (itemCode, value) => {
    const next = Number(value);
    const saved = Number(savedFactorMap[itemCode] || 0);

    setFactorMap((prev) => ({ ...prev, [itemCode]: next }));

    if (next === saved) {
      setReasonMap((prev) => {
        if (!(itemCode in prev)) return prev;
        const copied = { ...prev };
        delete copied[itemCode];
        return copied;
      });
    }
  };

  const handleSummaryFilter = (filterType) => {
    setStatusFilter(filterType);
    setPage(1);
  };

  const handleSave = () => {
    const changedRows = DEMAND_FORECAST_ROWS.filter((row) => {
      const before = Number(savedFactorMap[row.itemCode] || 0);
      const after = Number(factorMap[row.itemCode] || 0);
      return before !== after;
    });
    if (changedRows.length === 0) return;

    const missingReasonRows = changedRows.filter((row) => !String(reasonMap[row.itemCode] || '').trim());
    if (missingReasonRows.length > 0) {
      window.alert(`사유를 입력해주세요: ${missingReasonRows[0].itemCode}`);
      return;
    }

    const changed = changedRows.map((row) => {
      const before = Number(savedFactorMap[row.itemCode] || 0);
      const after = Number(factorMap[row.itemCode] || 0);
      return {
        id: `${Date.now()}-${row.itemCode}`,
        itemCode: row.itemCode,
        itemName: row.itemName,
        before,
        after,
        reason: String(reasonMap[row.itemCode] || '').trim(),
        changedBy: user?.name || user?.id || '사용자',
        changedAt: new Date().toISOString(),
      };
    });

    const nextSaved = { ...savedFactorMap, ...factorMap };
    const nextHistory = [...changed.reverse(), ...historyRows].slice(0, 500);
    localStorage.setItem(FACTOR_STORAGE_KEY, JSON.stringify(nextSaved));
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));

    setSavedFactorMap(nextSaved);
    setHistoryRows(nextHistory);
    setReasonMap({});
    setLastSavedAt(new Date().toISOString());
  };

  useEffect(() => {
    if (!selectedItem || !allowEscClose) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedHistoryItemCode(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allowEscClose, selectedItem]);

  return (
    <PageShell
      path={ROUTES.DELIVERY_DEMAND}
      title="수요 예측"
      description="출하상세내역조회(ERP 연동 예정) 기반 목업 데이터로 안전재고를 계산합니다."
    >
      <div className={styles.page}>
        <Card title="조회 조건">
          <CardBody>
            <div className={styles.toolbar}>
              <input
                className={styles.search}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="품번/품목명 검색"
              />
              <label className={styles.checkWrap}>
                <input
                  type="checkbox"
                  checked={statusFilter === 'attention'}
                  onChange={(event) => {
                    setStatusFilter(event.target.checked ? 'attention' : 'all');
                    setPage(1);
                  }}
                />
                경고/위험 품목만 보기
              </label>
              <div className={styles.actions}>
                <button type="button" className={styles.secondaryBtn} onClick={handleReset}>
                  저장값 복원
                </button>
                <button type="button" className={styles.primaryBtn} onClick={handleSave}>
                  정성변수 저장
                </button>
              </div>
            </div>
            <div className={styles.saveMeta}>
              <span>변경건수: {changedCount}건</span>
              <span>마지막 저장: {lastSavedAt ? formatDateTime(lastSavedAt) : '저장 이력 없음'}</span>
            </div>
          </CardBody>
        </Card>

        <div className={styles.summary}>
          <button
            type="button"
            className={`${styles.metric} ${styles.metricClickable} ${statusFilter === 'all' ? styles.metricActive : ''}`}
            onClick={() => handleSummaryFilter('all')}
          >
            <div className={styles.metricLabel}>전체 품번</div>
            <div className={styles.metricValue}>{formatNum(summary.total)}</div>
            <div className={styles.metricHint}>전체 보기</div>
          </button>
          <button
            type="button"
            className={`${styles.metric} ${styles.metricClickable} ${statusFilter === 'danger' ? styles.metricActive : ''}`}
            onClick={() => handleSummaryFilter('danger')}
          >
            <div className={styles.metricLabel}>위험 품번</div>
            <div className={`${styles.metricValue} ${styles.metricValueDanger}`}>{formatNum(summary.dangerCount)}</div>
            <div className={styles.metricHint}>숫자 클릭 시 위험만</div>
          </button>
          <button
            type="button"
            className={`${styles.metric} ${styles.metricClickable} ${statusFilter === 'warning' ? styles.metricActive : ''}`}
            onClick={() => handleSummaryFilter('warning')}
          >
            <div className={styles.metricLabel}>경고 품번</div>
            <div className={`${styles.metricValue} ${styles.metricValueWarning}`}>{formatNum(summary.warningCount)}</div>
            <div className={styles.metricHint}>숫자 클릭 시 경고만</div>
          </button>
          <button
            type="button"
            className={`${styles.metric} ${styles.metricClickable} ${statusFilter === 'attention' ? styles.metricActive : ''}`}
            onClick={() => handleSummaryFilter('attention')}
          >
            <div className={styles.metricLabel}>부족 수량 합계</div>
            <div className={styles.metricValue}>{formatNum(summary.totalShortage)}</div>
            <div className={styles.metricHint}>경고/위험 전체 보기</div>
          </button>
        </div>

        <Card title="안전재고 계산 결과">
          <CardBody tight>
            <div className={styles.resultTabs}>
              <button
                type="button"
                className={`${styles.resultTabBtn} ${resultTab === 'result' ? styles.resultTabBtnActive : ''}`}
                onClick={() => setResultTab('result')}
              >
                계산 결과
              </button>
              <button
                type="button"
                className={`${styles.resultTabBtn} ${resultTab === 'guide' ? styles.resultTabBtnActive : ''}`}
                onClick={() => setResultTab('guide')}
              >
                기준 설명
              </button>
            </div>
            {resultTab === 'result' ? (
              <>
                <div className={styles.filterState}>
                  현재 필터:
                  <strong>
                    {statusFilter === 'all'
                      ? ' 전체'
                      : statusFilter === 'danger'
                        ? ' 위험'
                        : statusFilter === 'warning'
                          ? ' 경고'
                          : ' 경고/위험'}
                  </strong>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <colgroup>
                      <col style={{ width: '130px' }} />
                      <col style={{ width: '220px' }} />
                      <col style={{ width: '100px' }} />
                      <col style={{ width: '90px' }} />
                      <col style={{ width: '90px' }} />
                      <col style={{ width: '170px' }} />
                      <col style={{ width: '110px' }} />
                      <col style={{ width: '110px' }} />
                      <col style={{ width: '95px' }} />
                      <col style={{ width: '100px' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>품번</th>
                        <th>품목명</th>
                        <th>현재고</th>
                        <th>도소매 평균 판매량</th>
                        <th>정성변수</th>
                        <th>사유</th>
                        <th>안전재고</th>
                        <th>부족수량</th>
                        <th>상태</th>
                        <th>이력</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedData.map((row) => (
                        <tr key={row.id}>
                          <td>{row.itemCode}</td>
                          <td className={styles.left}>{row.itemName}</td>
                          <td className={styles.num}>{formatNum(row.currentStock)}</td>
                          <td className={styles.num}>{formatNum(row.avgMonthlySales)}</td>
                          <td>
                            <input
                              className={styles.factorInput}
                              type="number"
                              min="0"
                              step="0.1"
                              value={row.factor}
                              onChange={(event) => handleFactorChange(row.itemCode, event.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              className={`${styles.reasonInput} ${!row.isChanged ? styles.reasonInputDisabled : ''}`}
                              value={reasonMap[row.itemCode] || ''}
                              disabled={!row.isChanged}
                              onChange={(event) =>
                                setReasonMap((prev) => ({ ...prev, [row.itemCode]: event.target.value }))
                              }
                              placeholder={row.isChanged ? '수정 사유 입력' : '정성변수 변경 시 입력'}
                            />
                          </td>
                          <td className={styles.num}>{formatNum(row.safetyStock)}</td>
                          <td className={styles.num}>{formatNum(row.shortage)}</td>
                          <td>
                            <span
                              className={`${styles.status} ${
                                row.status.key === 'danger'
                                  ? styles.dangerText
                                  : row.status.key === 'warning'
                                    ? styles.warningText
                                    : ''
                              }`}
                            >
                              <span
                                className={`${styles.dot} ${
                                  row.status.key === 'danger'
                                    ? styles.dotDanger
                                    : row.status.key === 'warning'
                                      ? styles.dotWarning
                                      : styles.dotNormal
                                }`}
                              />
                              {row.status.label}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={styles.historyBtn}
                              disabled={!latestHistoryByItem[row.itemCode]}
                              onClick={() => setSelectedHistoryItemCode(row.itemCode)}
                            >
                              이력보기
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  className={styles.pagination}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  pageSizeOptions={[10, 20, 30]}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </>
            ) : (
              <div className={styles.guideCard}>
                <div className={styles.guideTitle}>안전재고 기준</div>
                <div className={styles.guideLine}>출하상세내역조회 메뉴에서</div>
                <div className={styles.guideFormula}>
                  품번별 3개월 평균 판매량 <span>X 3 X</span> 정성변수(담당자 수기 입력 컬럼)
                  <span>= 안전재고</span>
                </div>
                <div className={styles.guideResult}>
                  현재고 &lt; 안전재고 이면 <strong>부족률 기준으로 상태</strong>를 표시합니다.
                </div>
                <div className={styles.guideStatusGrid}>
                  <div className={styles.guideStatusItem}>
                    <span className={`${styles.dot} ${styles.dotNormal}`} />
                    정상: 부족률 10% 이하 (및 10~20% 구간은 정상 처리)
                  </div>
                  <div className={styles.guideStatusItem}>
                    <span className={`${styles.dot} ${styles.dotWarning}`} />
                    경고: 부족률 20% 이상 50% 미만
                  </div>
                  <div className={styles.guideStatusItem}>
                    <span className={`${styles.dot} ${styles.dotDanger}`} />
                    위험: 부족률 50% 이상
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {selectedItem && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              if (allowBackdropClose) setSelectedHistoryItemCode(null);
            }}
          >
            <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div>
                  <div className={styles.modalTitle}>{selectedItem.itemCode} 변경 이력</div>
                  <div className={styles.modalSubTitle}>{selectedItem.itemName}</div>
                </div>
                <div className={styles.modalHeaderActions}>
                  <label className={styles.modalOption}>
                    <input
                      type="checkbox"
                      checked={allowEscClose}
                      onChange={(event) => setAllowEscClose(event.target.checked)}
                    />
                    ESC 닫기
                  </label>
                  <label className={styles.modalOption}>
                    <input
                      type="checkbox"
                      checked={allowBackdropClose}
                      onChange={(event) => setAllowBackdropClose(event.target.checked)}
                    />
                    바깥 클릭 닫기
                  </label>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setSelectedHistoryItemCode(null)}
                  >
                    닫기
                  </button>
                </div>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.tableWrap}>
                  <table className={`${styles.table} ${styles.modalTable}`}>
                    <colgroup>
                      <col style={{ width: '150px' }} />
                      <col style={{ width: '110px' }} />
                      <col style={{ width: '80px' }} />
                      <col style={{ width: '80px' }} />
                      <col style={{ width: '260px' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>변경일시</th>
                        <th>변경자</th>
                        <th>이전값</th>
                        <th>변경값</th>
                        <th>사유</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHistoryRows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className={styles.empty}>
                            저장된 변경 이력이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        selectedHistoryRows.map((row) => (
                          <tr key={row.id}>
                            <td>{formatDateTime(row.changedAt)}</td>
                            <td>{row.changedBy}</td>
                            <td className={styles.num}>{row.before}</td>
                            <td className={styles.num}>{row.after}</td>
                            <td className={styles.left}>{row.reason || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
