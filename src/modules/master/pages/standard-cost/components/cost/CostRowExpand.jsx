import React from 'react';
import styles from './CostPage.module.css';

const APPROVAL_STEPS = ['요청', '공장 입력 완료', 'ERP 반영 완료'];

export function CostRowExpand({ row, onFieldChange }) {
  const factory = Number(row.factoryPrice) || 0;
  const otherRate = Number(row.otherCost) || 0;
  const otherCostAmount = Math.round((factory * otherRate) / 100);
  const totalCost = Number(row.totalCost) || factory + otherCostAmount;
  const salePrice = Number(row.salePrice) || 0;
  const marginAmount = salePrice - totalCost;

  return (
    <div className={styles.expandPanel}>
      <section className={styles.expandCard}>
        <h4 className={styles.expandTitle}>입력 폼</h4>
        <div className={styles.formGrid}>
          <div className={styles.formItem}>
            <label>공장도가</label>
            <input
              className={styles.editInput}
              value={row.factoryPrice}
              onChange={(e) => onFieldChange(row.id, 'factoryPrice', e.target.value)}
            />
          </div>
          <div className={styles.formItem}>
            <label>기타원가율(%)</label>
            <input
              className={styles.editInput}
              value={row.otherCost}
              onChange={(e) => onFieldChange(row.id, 'otherCost', e.target.value)}
            />
          </div>
          <div className={styles.formItem}>
            <label>판매가</label>
            <input
              className={styles.editInput}
              value={row.salePrice}
              onChange={(e) => onFieldChange(row.id, 'salePrice', e.target.value)}
            />
          </div>
          <div className={styles.formItem}>
            <label>비고</label>
            <input
              className={styles.editInput}
              value={row.note}
              onChange={(e) => onFieldChange(row.id, 'note', e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.expandCard}>
        <h4 className={styles.expandTitle}>계산 결과</h4>
        <div className={styles.formItem}>
          <label>기타원가 금액</label>
          <span className={styles.valueText}>{otherCostAmount.toLocaleString()}</span>
        </div>
        <div className={styles.formItem}>
          <label>총원가</label>
          <span className={styles.valueText}>{totalCost.toLocaleString()}</span>
        </div>
        <div className={styles.formItem}>
          <label>마진 금액</label>
          <span className={styles.valueText}>{marginAmount.toLocaleString()}</span>
        </div>
      </section>

      <section className={styles.expandCard}>
        <h4 className={styles.expandTitle}>승인 단계</h4>
        <div className={styles.stepper}>
          {APPROVAL_STEPS.map((step) => (
            <span
              key={step}
              className={`${styles.step} ${row.status === step ? styles.stepActive : ''}`}
            >
              {step}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
