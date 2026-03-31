import styles from './Modal.module.css';
import { PLAN_COLUMNS } from '../../data/planColumns';

export const DetailModal = ({ row, onClose }) => {
  const fields = [
    ...PLAN_COLUMNS.filter((c) => c.key !== 'memo'),
    { key: 'memo', label: '비고' },
    { key: 'status', label: '상태' }
  ];

  if (!row) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ width: '600px' }}>
        <h3 className={styles.title}>납품 상세 정보</h3>
        <div className={styles.content} style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {fields.map((field) => {
              let value = row[field.key];
              if (typeof value === 'number') value = value.toLocaleString();

              return (
                <div key={field.key} className={styles.field}>
                  <span className={styles.label}>{field.label}</span>
                  <div className={styles.info} style={{ minHeight: '32px' }}>
                    {value || '-'}
                  </div>
                </div>
              );
            })}
          </div>

          {row.partialHistory && row.partialHistory.length > 0 && (
            <div className={styles.field} style={{ marginTop: '16px' }}>
              <span className={styles.label}>부분 납품 이력</span>
              <div className={styles.info}>
                {row.partialHistory.map((h, i) => (
                  <div key={i}>
                    - {h.date} : {h.qty}개 ({h.note})
                  </div>
                ))}
              </div>
            </div>
          )}

          {row.changeHistory && row.changeHistory.length > 0 && (
            <div className={styles.field} style={{ marginTop: '16px' }}>
              <span className={styles.label}>변경 이력</span>
              <div className={styles.info}>
                {row.changeHistory.map((h, i) => (
                  <div key={i}>
                    - {h.date} [{h.field}] {h.oldValue} → {h.newValue} ({h.reason})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.primaryButton} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
