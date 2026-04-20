import React from 'react';
import { Modal } from 'antd';
import { formatNum } from '../discountPromotion.constants';

export default function DiscountDealerDetailModal({
  styles,
  selectedDealerRow,
  selectedDealerDetail,
  monthHeaders,
  dealerDetailRows,
  onClose,
}) {
  return (
    <Modal
      open={Boolean(selectedDealerRow && selectedDealerDetail)}
      onCancel={onClose}
      footer={null}
      width={1080}
      centered
      title={
        selectedDealerRow
          ? `${selectedDealerRow.dealerName} 3개월(${monthHeaders[0]}~${monthHeaders[2]}) 매출 현황`
          : '3개월 매출 현황'
      }
    >
      {selectedDealerDetail && (
        <div className={styles.dealerModalBody}>
          <div className={styles.metricCards}>
            <article className={styles.metricCard}>
              <span className={styles.metricLabel}>3개월 평균</span>
              <strong className={styles.metricValue}>{formatNum(selectedDealerDetail.avg3Month)}</strong>
              <span className={styles.metricSub}>{monthHeaders[2]} 기준</span>
            </article>
            <article className={styles.metricCard}>
              <span className={styles.metricLabel}>할인율</span>
              <strong className={styles.metricValue}>{selectedDealerDetail.discountRate.toFixed(2)}%</strong>
              <span className={styles.metricSub}>증감 {selectedDealerDetail.extraRate.toFixed(2)}%</span>
            </article>
          </div>

          <div className={styles.dealerDetailTableWrap}>
            <table className={styles.dealerDetailTable}>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>{monthHeaders[0]}</th>
                  <th>{monthHeaders[1]}</th>
                  <th>{monthHeaders[2]}</th>
                  <th>합계</th>
                </tr>
              </thead>
              <tbody>
                {dealerDetailRows.map((row) => (
                  <tr key={row.key}>
                    <th>{row.label}</th>
                    <td className={row.key === 'included' ? styles.emphasisCell : ''}>{formatNum(row.m1)}</td>
                    <td className={row.key === 'included' ? styles.emphasisCell : ''}>{formatNum(row.m2)}</td>
                    <td className={row.key === 'included' ? styles.emphasisCell : ''}>{formatNum(row.m3)}</td>
                    <td className={`${styles.sumCell} ${row.key === 'included' ? styles.emphasisCell : ''}`}>{formatNum(row.sum)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}
