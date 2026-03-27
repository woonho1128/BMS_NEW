import styles from './SpecDetailTable.module.css';

export const SpecDetailTable = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.detailWrapper}>
      <table className={styles.childTable}>
        <thead>
          <tr>
            <th className={styles.childTh}>품목</th>
            <th className={styles.childTh}>색상</th>
            <th className={styles.childTh} style={{ textAlign: 'right' }}>수량</th>
            <th className={styles.childTh} style={{ textAlign: 'right' }}>대리점가</th>
            <th className={styles.childTh} style={{ textAlign: 'right' }}>중량(KG)</th>
            <th className={styles.childTh} style={{ textAlign: 'right' }}>총중량(KG)</th>
            <th className={styles.childTh} style={{ textAlign: 'right' }}>총중량(TON)</th>
            <th className={styles.childTh} style={{ textAlign: 'right' }}>금액</th>
            <th className={styles.childTh}>특수사양</th>
            <th className={styles.childTh}>비고</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td className={styles.childTd}>{item.item1}</td>
              <td className={styles.childTd}>{item.color}</td>
              <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.qty).toLocaleString()}</td>
              <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.agencyPrice).toLocaleString()}</td>
              <td className={styles.childTd} style={{ textAlign: 'right' }}>{item.weight}</td>
              <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.totalWeightKg).toLocaleString()}</td>
              <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.totalWeightTon).toFixed(3)}</td>
              <td className={styles.childTd} style={{ textAlign: 'right' }}>{Number(item.amount).toLocaleString()}</td>
              <td className={styles.childTd}>{item.spec}</td>
              <td className={styles.childTd}>{item.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
