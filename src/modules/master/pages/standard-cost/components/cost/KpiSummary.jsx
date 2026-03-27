import React from 'react';
import styles from './CostPage.module.css';

const RATIO_KEYS = ['S/W', 'OEM', '상품', '수전금구', '비데', '타일', 'BK', '케어', '기타'];

export function KpiSummary({ rows, ratioFilter, onRatioFilter, otherCostRates, onOtherCostRateChange }) {
  const totalCount = rows.length;
  const avgMargin = totalCount > 0
    ? (rows.reduce((acc, cur) => acc + (Number(cur.marginPercent) || 0), 0) / totalCount).toFixed(1)
    : '0.0';
  const deficitCount = rows.filter((row) => Number(row.marginPercent) <= 0).length;

  const ratios = RATIO_KEYS.map((key) => ({
    key,
    count: rows.filter((row) => row.division === key).length,
  }));

  return (
    <section className={styles.kpiBar}>
      <div className={styles.ratioCard}>
        <div className={styles.ratioCardHeader}>
          <h3 className={styles.cardTitle}>적용 기타원가율 (단위:%)</h3>
          <span className={styles.cardSub}>항목별 기준 비율을 즉시 수정할 수 있습니다.</span>
        </div>
        <div className={styles.ratioGrid}>
          {RATIO_KEYS.map((key) => (
            <div key={key} className={styles.ratioItem}>
              <div className={styles.ratioItemLabel}>{key}</div>
              <input
                className={styles.ratioInput}
                type="number"
                step="0.1"
                value={otherCostRates?.[key] ?? 0}
                onChange={(e) => onOtherCostRateChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.kpiCardsWrap}>
        <div className={styles.kpiCards}>
          <article className={styles.kpiCard}>
            <div className={styles.kpiLabel}>총 건수</div>
            <div className={styles.kpiValue}>{totalCount.toLocaleString()}</div>
          </article>
          <article className={styles.kpiCard}>
            <div className={styles.kpiLabel}>평균 마진율</div>
            <div className={styles.kpiValue}>{avgMargin}%</div>
          </article>
          <article className={styles.kpiCard}>
            <div className={styles.kpiLabel}>적자 건수</div>
            <div className={styles.kpiValue}>{deficitCount.toLocaleString()}</div>
          </article>
        </div>

        <div className={styles.kpiRatios}>
          {ratios.map((ratio) => (
            <button
              key={ratio.key}
              type="button"
              className={`${styles.ratioChip} ${ratioFilter === ratio.key ? styles.ratioChipActive : ''}`}
              onClick={() => onRatioFilter(ratioFilter === ratio.key ? 'ALL' : ratio.key)}
            >
              {ratio.key} ({ratio.count})
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
