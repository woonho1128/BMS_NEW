import React from 'react';
import styles from './CostPage.module.css';

const STATUS_BUTTONS = [
  { key: 'ALL', label: '전체' },
  { key: '요청', label: '요청' },
  { key: 'ERP 반영 완료', label: 'ERP 반영 완료' },
  { key: '공장 입력 완료', label: '공장 입력 완료' },
];

export function FilterBar({ filter, years, projects, onChange, onResetSearch }) {
  return (
    <section className={styles.filterBar}>
      <div className={styles.filterLeft}>
        <span className={styles.fieldLabel}>년도</span>
        <select className={styles.select} value={filter.year} onChange={(e) => onChange('year', e.target.value)}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <span className={styles.fieldLabel}>프로젝트</span>
        <select className={styles.select} value={filter.project} onChange={(e) => onChange('project', e.target.value)}>
          <option value="ALL">전체</option>
          {projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterRight}>
        <input
          className={styles.searchInput}
          placeholder="품번/품명/자품번 검색"
          value={filter.keyword}
          onChange={(e) => onChange('keyword', e.target.value)}
        />

        <div className={styles.statusButtons}>
          {STATUS_BUTTONS.map((status) => (
            <button
              key={status.key}
              type="button"
              className={`${styles.statusBtn} ${filter.status === status.key ? styles.statusBtnActive : ''}`}
              onClick={() => onChange('status', status.key)}
            >
              {status.label}
            </button>
          ))}
        </div>

        <button type="button" className={styles.statusBtn} onClick={onResetSearch}>초기화</button>
      </div>
    </section>
  );
}
