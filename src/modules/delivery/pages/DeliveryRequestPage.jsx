import React, { useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Button } from '../../../shared/components/Button/Button';
import { notify } from '../../../shared/utils/notify';
import styles from './DeliveryRequestPage.module.css';

export function DeliveryRequestPage() {
  const [items, setItems] = useState([{ code: 'ITM-001', qty: 10 }, { code: 'ITM-002', qty: 20 }]);

  return (
    <PageShell path="/delivery/request" title="출고 등록">
      <div className={styles.page}>
        <table className={styles.table}>
          <thead><tr><th>품목코드</th><th>수량</th></tr></thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.code}>
                <td>{item.code}</td>
                <td>
                  <input value={item.qty} onChange={(e) => setItems((prev) => prev.map((r, i) => (i === idx ? { ...r, qty: e.target.value } : r)))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.footerActions}>
          <Button variant="secondary" onClick={() => notify.info('출고등록이 임시저장되었습니다. (목업)')}>임시저장</Button>
          <Button onClick={() => notify.success('출고확정이 완료되었습니다. (목업)')}>출고확정</Button>
        </div>
      </div>
    </PageShell>
  );
}
