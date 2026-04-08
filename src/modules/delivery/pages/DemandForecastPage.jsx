import React, { useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { notify } from '../../../shared/utils/notify';
import styles from './DemandForecastPage.module.css';

const INITIAL_ROWS = Array.from({ length: 12 }, (_, i) => ({
  itemCode: `ITM-${String(i + 1).padStart(3, '0')}`,
  itemName: `품목 ${i + 1}`,
  forecastQty: 80 + i * 5,
  reason: '',
  history: [],
}));

function nowText() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

export function DemandForecastPage() {
  const [query, setQuery] = useState('');
  const [onlyShortage, setOnlyShortage] = useState(false);
  const [resultTab, setResultTab] = useState('all');
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [savedSnapshot, setSavedSnapshot] = useState(INITIAL_ROWS);
  const [historyRow, setHistoryRow] = useState(null);

  const savedByCode = useMemo(
    () => new Map(savedSnapshot.map((row) => [row.itemCode, row])),
    [savedSnapshot]
  );

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (query && !`${row.itemCode} ${row.itemName}`.toLowerCase().includes(query.toLowerCase())) return false;
      const qty = Number(row.forecastQty || 0);
      const isShort = qty < 100;
      if (onlyShortage && !isShort) return false;
      if (resultTab === 'shortage' && !isShort) return false;
      if (resultTab === 'normal' && isShort) return false;
      if (resultTab === 'edited' && row.history.length === 0) return false;
      return true;
    });
  }, [rows, query, onlyShortage, resultTab]);

  const summary = useMemo(() => {
    const totalQty = filtered.reduce((sum, row) => sum + Number(row.forecastQty || 0), 0);
    const shortageCount = filtered.filter((row) => Number(row.forecastQty || 0) < 100).length;
    const editedCount = filtered.filter((row) => row.history.length > 0).length;
    return { totalQty, shortageCount, rowCount: filtered.length, editedCount };
  }, [filtered]);

  const updateRow = (itemCode, key, value) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.itemCode !== itemCode) return row;
        const nextRow = { ...row, [key]: value };
        if (key === 'forecastQty') {
          const baseQty = Number(savedByCode.get(itemCode)?.forecastQty || 0);
          const nextQty = Number(value || 0);
          if (baseQty === nextQty) {
            nextRow.reason = '';
          }
        }
        return nextRow;
      })
    );
  };

  const saveForecast = () => {
    const missing = rows.find((row) => {
      const base = savedByCode.get(row.itemCode);
      const isQtyChanged = Number(base?.forecastQty || 0) !== Number(row.forecastQty || 0);
      return isQtyChanged && !String(row.reason || '').trim();
    });
    if (missing) {
      notify.warning(`사유를 입력해주세요: ${missing.itemCode}`);
      return;
    }

    const stamp = nowText();
    let changedCount = 0;

    const nextRows = rows.map((row) => {
      const prev = savedByCode.get(row.itemCode);
      if (!prev) return row;

      const history = [...row.history];
      const prevQty = Number(prev.forecastQty || 0);
      const nextQty = Number(row.forecastQty || 0);
      const prevReason = String(prev.reason || '');
      const nextReason = String(row.reason || '');

      if (prevQty !== nextQty) {
        history.unshift({
          at: stamp,
          field: '예측수량',
          before: prevQty,
          after: nextQty,
        });
        changedCount += 1;
      }

      if (prevReason !== nextReason) {
        history.unshift({
          at: stamp,
          field: '사유',
          before: prevReason || '-',
          after: nextReason || '-',
        });
        changedCount += 1;
      }

      return { ...row, history };
    });

    setRows(nextRows);
    setSavedSnapshot(nextRows.map((row) => ({ ...row, history: [...row.history] })));
    notify.success(`수요 예측이 저장되었습니다. 변경 ${changedCount}건`);
  };

  return (
    <PageShell path="/delivery/demand-forecast" title="수요 예측" description="월별 예측 수량과 사유를 관리합니다.">
      <div className={styles.page}>
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="품목코드/품목명 검색"
          />
          <label className={styles.checkWrap}>
            <input type="checkbox" checked={onlyShortage} onChange={(e) => setOnlyShortage(e.target.checked)} />
            부족 예상만 보기
          </label>
          <div className={styles.actions}>
            <button className={styles.secondaryBtn} onClick={() => notify.info('엑셀 다운로드는 추후 연동 예정입니다.')}>엑셀 다운로드</button>
            <button className={styles.primaryBtn} onClick={saveForecast}>저장</button>
          </div>
        </div>

        <div className={styles.resultTabs}>
          <button
            type="button"
            className={`${styles.resultTabBtn} ${resultTab === 'all' ? styles.resultTabBtnActive : ''}`}
            onClick={() => setResultTab('all')}
          >
            전체
          </button>
          <button
            type="button"
            className={`${styles.resultTabBtn} ${resultTab === 'shortage' ? styles.resultTabBtnActive : ''}`}
            onClick={() => setResultTab('shortage')}
          >
            부족 예상
          </button>
          <button
            type="button"
            className={`${styles.resultTabBtn} ${resultTab === 'normal' ? styles.resultTabBtnActive : ''}`}
            onClick={() => setResultTab('normal')}
          >
            정상
          </button>
          <button
            type="button"
            className={`${styles.resultTabBtn} ${resultTab === 'edited' ? styles.resultTabBtnActive : ''}`}
            onClick={() => setResultTab('edited')}
          >
            수정됨
          </button>
        </div>

        <div className={styles.summary}>
          <div className={styles.metric}><div className={styles.metricLabel}>조회 건수</div><div className={styles.metricValue}>{summary.rowCount}</div></div>
          <div className={styles.metric}><div className={styles.metricLabel}>예측 합계</div><div className={styles.metricValue}>{summary.totalQty.toLocaleString()}</div></div>
          <div className={styles.metric}><div className={styles.metricLabel}>부족 예상 건수</div><div className={`${styles.metricValue} ${styles.metricValueWarning}`}>{summary.shortageCount}</div></div>
          <div className={styles.metric}><div className={styles.metricLabel}>수정 이력 보유</div><div className={`${styles.metricValue} ${styles.metricValueDanger}`}>{summary.editedCount}</div></div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>품목코드</th>
                <th>품목명</th>
                <th>예측수량</th>
                <th>상태</th>
                <th>사유</th>
                <th>수정 이력</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>조회 결과가 없습니다.</td>
                </tr>
              ) : (
                filtered.map((row) => {
                  const isShort = Number(row.forecastQty || 0) < 100;
                  const isSameAsSaved =
                    Number(savedByCode.get(row.itemCode)?.forecastQty || 0) === Number(row.forecastQty || 0);

                  return (
                    <tr key={row.itemCode}>
                      <td className={styles.left}>{row.itemCode}</td>
                      <td className={styles.left}>{row.itemName}</td>
                      <td className={styles.num}>
                        <input
                          className={styles.factorInput}
                          value={row.forecastQty}
                          onChange={(e) => updateRow(row.itemCode, 'forecastQty', e.target.value)}
                        />
                      </td>
                      <td>
                        <span className={styles.status}>
                          <span className={`${styles.dot} ${isShort ? styles.dotWarning : ''}`} />
                          {isShort ? '부족 예상' : '정상'}
                        </span>
                      </td>
                      <td>
                        <input
                          className={`${styles.reasonInput} ${isSameAsSaved ? styles.reasonInputDisabled : ''}`}
                          value={row.reason}
                          onChange={(e) => updateRow(row.itemCode, 'reason', e.target.value)}
                          placeholder="사유 입력"
                          disabled={isSameAsSaved}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.historyBtn}
                          disabled={row.history.length === 0}
                          onClick={() => setHistoryRow(row)}
                        >
                          보기 ({row.history.length})
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {historyRow && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle}>수정 이력</div>
                <div className={styles.modalSubTitle}>{historyRow.itemCode} · {historyRow.itemName}</div>
              </div>
              <div className={styles.modalHeaderActions}>
                <button className={styles.secondaryBtn} onClick={() => setHistoryRow(null)}>닫기</button>
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.tableWrap}>
                <table className={`${styles.table} ${styles.modalTable}`}>
                  <thead>
                    <tr>
                      <th>변경일시</th>
                      <th>항목</th>
                      <th>변경 전</th>
                      <th>변경 후</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRow.history.map((h, idx) => (
                      <tr key={`${h.at}-${idx}`}>
                        <td>{h.at}</td>
                        <td>{h.field}</td>
                        <td>{String(h.before)}</td>
                        <td>{String(h.after)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
