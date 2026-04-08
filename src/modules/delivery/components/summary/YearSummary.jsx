import React, { useEffect, useState } from 'react';
import { notify } from '../../../../shared/utils/notify';
import styles from './YearSummary.module.css';

export const YearSummary = () => {
  const [year, setYear] = useState('2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    notify.info(`${year}년 요약 데이터를 조회 중입니다. (목업)`);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [year]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <select className={styles.yearSelect} value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>
      <div className={styles.body}>{loading ? '로딩 중...' : '연간 요약 데이터(목업)'}</div>
    </div>
  );
};
