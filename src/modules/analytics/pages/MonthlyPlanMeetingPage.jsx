import React, { useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Tag } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { Button } from '../../../shared/components/Button/Button';
import { formatNumber } from '../../../shared/utils/formatters';
import { createMonthOptions, createYearOptions, getCurrentYear } from '../../../shared/utils/dateOptions';
import { notify } from '../../../shared/utils/notify';
import {
  METRIC_LABELS,
  ZERO_METRICS,
  createInitialRows,
  createRandomActual,
  toDateString,
} from '../data/monthlyPlanMeetingMock';
import styles from './MonthlyPlanMeetingPage.module.css';

const YEAR_OPTIONS = createYearOptions();
const MONTH_OPTIONS = createMonthOptions();

export function MonthlyPlanMeetingPage() {
  const { pathname } = useLocation();
  const currentYear = String(getCurrentYear());
  const currentMonth = String(new Date().getMonth() + 1);

  const [filters, setFilters] = useState({ year: currentYear, month: currentMonth });
  const [rows, setRows] = useState(createInitialRows);
  const [rounds, setRounds] = useState([]);

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ year: currentYear, month: currentMonth });
  }, [currentYear, currentMonth]);

  const handleLoadActual = useCallback(() => {
    setRows((prev) =>
      prev.map((row, index) => (
        row.isTotal
          ? row
          : {
            ...row,
            actual: createRandomActual(row.plan, index + Number(filters.month) * 5 + Number(filters.year) * 3),
          }
      ))
    );
    notify.success('마감 실적을 불러왔습니다.');
  }, [filters.month, filters.year]);

  const handleAddRound = useCallback(() => {
    if (rounds.length >= 4) {
      notify.warning('차수는 최대 4차까지 생성할 수 있습니다.');
      return;
    }

    const next = rounds.length + 1;
    const key = `round${next}`;
    const defaultDay = [11, 16, 23, 27][next - 1];
    const newRound = {
      key,
      label: `${next}차`,
      date: toDateString(filters.year, filters.month, defaultDay),
    };

    setRounds((prev) => [...prev, newRound]);
    setRows((prev) =>
      prev.map((row) => {
        if (row.isTotal) return row;
        const previous = rounds.length > 0 ? row.rounds[rounds[rounds.length - 1].key] : null;
        return {
          ...row,
          rounds: {
            ...row.rounds,
            [key]: previous ? { ...previous } : { ...row.actual },
          },
        };
      })
    );
  }, [filters.month, filters.year, rounds]);

  const displayRows = useMemo(() => {
    const list = [];
    let groupRows = [];

    const sumMetrics = (source, picker) => source.reduce(
      (acc, row) => {
        const metric = picker(row);
        return {
          retail: acc.retail + Number(metric?.retail || 0),
          delivery: acc.delivery + Number(metric?.delivery || 0),
          total: acc.total + Number(metric?.total || 0),
        };
      },
      { retail: 0, delivery: 0, total: 0 }
    );

    rows.forEach((row) => {
      if (!row.isTotal) {
        groupRows.push(row);
        list.push(row);
        return;
      }

      // "계" 행은 화면 렌더 시점마다 동적으로 다시 계산해 입력 변경을 즉시 반영한다.
      const summedRounds = rounds.reduce((acc, round) => {
        acc[round.key] = sumMetrics(groupRows, (item) => item.rounds?.[round.key] || ZERO_METRICS);
        return acc;
      }, {});

      list.push({
        ...row,
        plan: sumMetrics(groupRows, (item) => item.plan),
        actual: sumMetrics(groupRows, (item) => item.actual),
        rounds: { ...row.rounds, ...summedRounds },
      });

      groupRows = [];
    });

    return list;
  }, [rows, rounds]);

  const handleRoundDateChange = useCallback((roundKey, date) => {
    setRounds((prev) => prev.map((round) => (round.key === roundKey ? { ...round, date } : round)));
  }, []);

  const handleRoundValueChange = useCallback((rowId, roundKey, metricKey, value) => {
    const numeric = Number(String(value).replace(/,/g, ''));
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const nextRound = {
          ...(row.rounds[roundKey] || ZERO_METRICS),
          [metricKey]: Number.isNaN(numeric) ? 0 : Math.max(0, numeric),
        };
        if (metricKey !== 'total') {
          nextRound.total = Number(nextRound.retail || 0) + Number(nextRound.delivery || 0);
        }
        return { ...row, rounds: { ...row.rounds, [roundKey]: nextRound } };
      })
    );
  }, []);

  const filterFields = useMemo(
    () => [
      { id: 'year', label: '연도', type: 'select', options: YEAR_OPTIONS, width: 108, row: 0 },
      { id: 'month', label: '월', type: 'select', options: MONTH_OPTIONS, width: 88, row: 0 },
    ],
    []
  );

  const sectionTitle = `${String(filters.year).slice(2)}년 ${Number(filters.month)}월 매출 계획`;
  const actualTitle = `실적_${Number(filters.month)}월 마감기준`;

  return (
    <PageShell
      path={pathname}
      title="월별 계획 회의 관리"
      description="월별 계획/실적/차수 의지치를 회의 기준으로 관리합니다."
      className={styles.shellWide}
      actions={
        <div className={styles.actionRow}>
          <Button variant="secondary" onClick={handleLoadActual}>
            마감 실적 불러오기
          </Button>
          <Button variant="secondary" onClick={handleAddRound}>
            차수 생성
          </Button>
          <Button variant="primary">저장</Button>
        </div>
      }
    >
      <div className={styles.page}>
        <ListFilter
          className={styles.filterBar}
          fields={filterFields}
          value={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <section className={styles.infoBar}>
          <Tag color="blue">{sectionTitle}</Tag>
          <span>목업 10명 기준, 차수 생성 전/후 동일한 컴팩트 테이블 스타일</span>
        </section>

        {rounds.length > 0 && (
          <section className={styles.roundDateRow}>
            {rounds.map((round) => (
              <label key={round.key} className={styles.roundDateItem}>
                <span>{round.label} 회의일</span>
                <input
                  type="date"
                  className={styles.roundDateInput}
                  value={round.date}
                  onChange={(event) => handleRoundDateChange(round.key, event.target.value)}
                />
              </label>
            ))}
          </section>
        )}

        <section className={styles.tableCard}>
          <div className={styles.tableWrap}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th rowSpan={2}>성명</th>
                  <th rowSpan={2}>구분</th>
                  <th colSpan={3}>{sectionTitle}</th>
                  <th colSpan={3}>{actualTitle}</th>
                  {rounds.map((round) => (
                    <th key={`${round.key}-head`} colSpan={3}>{`${round.label} : ${round.date}`}</th>
                  ))}
                  <th colSpan={3}>달성률</th>
                </tr>
                <tr>
                  {Array.from({ length: 2 + rounds.length }).map((_, groupIndex) =>
                    METRIC_LABELS.map((metric) => <th key={`${groupIndex}-${metric}`}>{metric}</th>)
                  )}
                  {METRIC_LABELS.map((metric) => (
                    <th key={`rate-${metric}`}>{metric}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row) => {
                  // 달성률은 마지막 차수(없으면 실적 기준) 대비 계획값으로 계산한다.
                  const latestRound = rounds.length > 0 ? row.rounds[rounds[rounds.length - 1].key] || ZERO_METRICS : row.actual;
                  const rateRetail = row.plan.retail > 0 ? `${Math.round((latestRound.retail / row.plan.retail) * 100)}%` : '0%';
                  const rateDelivery = row.plan.delivery > 0 ? `${Math.round((latestRound.delivery / row.plan.delivery) * 100)}%` : '0%';
                  const rateTotal = row.plan.total > 0 ? `${Math.round((latestRound.total / row.plan.total) * 100)}%` : '0%';

                  return (
                    <tr key={row.id} className={row.isTotal ? styles.totalRow : ''}>
                      <td className={styles.leftCell}>{row.name}</td>
                      <td className={styles.leftCell}>{row.type}</td>

                      <td>{formatNumber(row.plan.retail)}</td>
                      <td>{formatNumber(row.plan.delivery)}</td>
                      <td>{formatNumber(row.plan.total)}</td>

                      <td>{formatNumber(row.actual.retail)}</td>
                      <td>{formatNumber(row.actual.delivery)}</td>
                      <td>{formatNumber(row.actual.total)}</td>

                      {rounds.map((round) => {
                        const values = row.rounds[round.key] || ZERO_METRICS;
                        return (
                          <React.Fragment key={`${row.id}-${round.key}`}>
                            <td>
                              <input
                                type="number"
                                className={styles.cellInput}
                                value={values.retail}
                                onChange={(event) => handleRoundValueChange(row.id, round.key, 'retail', event.target.value)}
                                disabled={row.isTotal}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className={styles.cellInput}
                                value={values.delivery}
                                onChange={(event) => handleRoundValueChange(row.id, round.key, 'delivery', event.target.value)}
                                disabled={row.isTotal}
                              />
                            </td>
                            <td>{formatNumber(values.total)}</td>
                          </React.Fragment>
                        );
                      })}

                      <td>{rateRetail}</td>
                      <td>{rateDelivery}</td>
                      <td>{rateTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
