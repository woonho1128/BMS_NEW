import React, { useEffect, useState } from 'react';
import { notify } from '../../../shared/utils/notify';
import styles from './SiteItemSummaryPage.module.css';

export const SiteItemSummaryPage = () => {
  const [year, setYear] = useState('2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    notify.info(`${year}년 데이터 조회 중입니다. (목업)`);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [year]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>현장별 품목 요약</h2>
        <div className={styles.actionGroup}>
          <button className={styles.actionButton} onClick={() => notify.info('엑셀 다운로드는 준비 중입니다.')}>엑셀다운로드</button>
          <button className={styles.actionButton} onClick={() => notify.info('인쇄 기능은 준비 중입니다.')}>인쇄</button>
        </div>
      </div>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="2026">2026</option>
        <option value="2025">2025</option>
      </select>
      <div className={styles.tableWrap}>{loading ? '로딩 중...' : '요약 데이터(목업)'}</div>
    </div>
  );
};
