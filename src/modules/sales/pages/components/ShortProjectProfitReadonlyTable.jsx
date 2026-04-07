import React from 'react';
import styles from '../ShortProjectRegisterPage.module.css';

function pct(numerator, denominator) {
  if (!denominator) return '0.00';
  return ((numerator / denominator) * 100).toFixed(2);
}

export default function ShortProjectProfitReadonlyTable({
  rows,
  total,
  formatNumber,
  baseDiscountRate,
  rowKeyPrefix = 'row',
}) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.profitTable}>
        <thead>
          <tr>
            <th rowSpan={2}>구분</th>
            <th rowSpan={2}>단위</th>
            <th rowSpan={2}>수량</th>
            <th rowSpan={2}>제조원가(기준단가)</th>
            <th colSpan={2}>공장도가(25년 06월)</th>
            <th colSpan={4}>{`기본 할인가(${baseDiscountRate}%)`}</th>
            <th colSpan={4}>단납 공급가(기본 할인가 기준)</th>
            <th rowSpan={2}>매출총이익 금액</th>
            <th rowSpan={2}>매출 총 이익율</th>
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
          {rows.map((row) => (
            <tr key={`${rowKeyPrefix}-${row.id}`}>
              <td>{row.itemCode}</td>
              <td>{row.unit || '-'}</td>
              <td className={styles.numberCell}>{formatNumber(row.qty)}</td>
              <td className={styles.numberCell}>{formatNumber(row.costUnitPrice)}</td>
              <td className={styles.numberCell}>{formatNumber(row.factoryUnitPrice)}</td>
              <td className={styles.numberCell}>{formatNumber(row.factoryAmount)}</td>
              <td className={styles.numberCell}>{formatNumber(row.baseDiscountUnitPrice)}</td>
              <td className={styles.numberCell}>{formatNumber(row.baseDiscountAmount)}</td>
              <td className={styles.numberCell}>{formatNumber(row.baseDiscountDiff)}</td>
              <td className={styles.numberCell}>{row.baseVsFactoryRate.toFixed(2)}%</td>
              <td className={styles.numberCell}>{formatNumber(row.appliedDiscountUnitPrice)}</td>
              <td className={styles.numberCell}>{formatNumber(row.appliedDiscountAmount)}</td>
              <td className={styles.numberCell}>{formatNumber(row.appliedDiscountDiff)}</td>
              <td className={styles.numberCell}>{row.discountRate.toFixed(2)}%</td>
              <td className={styles.numberCell}>{formatNumber(row.grossProfitAmount)}</td>
              <td className={styles.numberCell}>{row.grossProfitRate.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>합계</td>
            <td className={styles.numberCell}>{formatNumber(total.factoryAmount)}</td>
            <td />
            <td className={styles.numberCell}>{formatNumber(total.baseDiscountAmount)}</td>
            <td className={styles.numberCell}>{formatNumber(total.baseDiscountAmount - total.factoryAmount)}</td>
            <td className={styles.numberCell}>
              {pct(total.baseDiscountAmount - total.factoryAmount, total.factoryAmount)}%
            </td>
            <td />
            <td className={styles.numberCell}>{formatNumber(total.appliedDiscountAmount)}</td>
            <td className={styles.numberCell}>{formatNumber(total.appliedDiscountAmount - total.factoryAmount)}</td>
            <td className={styles.numberCell}>
              {pct(total.appliedDiscountAmount - total.factoryAmount, total.factoryAmount)}%
            </td>
            <td className={styles.numberCell}>{formatNumber(total.appliedDiscountAmount - total.costAmount)}</td>
            <td className={styles.numberCell}>
              {pct(total.appliedDiscountAmount - total.costAmount, total.appliedDiscountAmount)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
