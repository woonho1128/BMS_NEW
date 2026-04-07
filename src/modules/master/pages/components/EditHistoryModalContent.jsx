import styles from '../PartnerRegisterPage.module.css';

export function EditHistoryModalContent({ editHistoryRows }) {
  return (
    <div className={styles.historyModalBody}>
      <div className={styles.historySummary}>
        <strong>총 {editHistoryRows.length}건</strong>
        <span>대리점 상세에서 수정 저장한 전체 이력을 최신순으로 보여줍니다.</span>
      </div>

      <div className={styles.historyList}>
        {editHistoryRows.length === 0 ? (
          <div className={styles.historyEmpty}>아직 수정 이력이 없습니다.</div>
        ) : (
          editHistoryRows.map((history) => (
            <article key={history.id} className={styles.historyItem}>
              <div className={styles.historyItemHead}>
                <strong>수정 저장</strong>
                <span>{history.changedAt}</span>
              </div>
              <div className={styles.historyItemMeta}>
                <span>수정자: {history.changedBy}</span>
                <span>사유: {history.reason}</span>
              </div>
              <table className={styles.historyDiffTable}>
                <thead>
                  <tr>
                    <th>항목</th>
                    <th>변경 전</th>
                    <th>변경 후</th>
                  </tr>
                </thead>
                <tbody>
                  {history.changes.map((change, index) => (
                    <tr key={`${history.id}-change-${index}`}>
                      <td>{change.field}</td>
                      <td>{change.before}</td>
                      <td className={styles.historyAfter}>{change.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default EditHistoryModalContent;
