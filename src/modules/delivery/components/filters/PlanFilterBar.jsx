import styles from './PlanFilterBar.module.css';

export const PlanFilterBar = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  isExpanded,
  onToggleExpand,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.header} onClick={onToggleExpand}>
        <div className={styles.headerTitle}>검색 필터</div>
        <div className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}>▼</div>
      </div>

      {isExpanded && (
        <div className={styles.content} onKeyDown={handleKeyDown}>
          <div className={styles.rowTop}>
            <div className={styles.inputGroup}>
              <span className={styles.label}>건설사</span>
              <input
                type="text"
                className={styles.input}
                placeholder="전체"
                value={filters.company}
                onChange={(e) => onFilterChange('company', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>현장명</span>
              <input
                type="text"
                className={styles.input}
                value={filters.site}
                onChange={(e) => onFilterChange('site', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>대리점</span>
              <input
                type="text"
                className={styles.input}
                value={filters.agency}
                onChange={(e) => onFilterChange('agency', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>담당자</span>
              <input
                type="text"
                className={styles.input}
                value={filters.manager}
                onChange={(e) => onFilterChange('manager', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>품목</span>
              <input
                type="text"
                className={styles.input}
                value={filters.item}
                onChange={(e) => onFilterChange('item', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>상태</span>
              <select
                className={styles.select}
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <option value="">전체</option>
                <option value="진행">진행</option>
                <option value="부분납품">부분납품</option>
                <option value="완료">완료</option>
                <option value="취소">취소</option>
              </select>
            </div>

            <div className={`${styles.inputGroup} ${styles.remarkGroup}`}>
              <span className={styles.label}>비고</span>
              <input
                type="text"
                className={`${styles.input} ${styles.remarkInput}`}
                placeholder="비고 검색"
                value={filters.remarks}
                onChange={(e) => onFilterChange('remarks', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.rowBottom}>
            <div className={styles.inputGroup}>
              <span className={styles.label}>납품예정</span>
              <input
                type="date"
                className={styles.input}
                value={filters.deliveryFrom}
                onChange={(e) => onFilterChange('deliveryFrom', e.target.value)}
              />
              <span className={styles.rangeDash}>~</span>
              <input
                type="date"
                className={styles.input}
                value={filters.deliveryTo}
                onChange={(e) => onFilterChange('deliveryTo', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>입주예정</span>
              <input
                type="date"
                className={styles.input}
                value={filters.moveInFrom}
                onChange={(e) => onFilterChange('moveInFrom', e.target.value)}
              />
              <span className={styles.rangeDash}>~</span>
              <input
                type="date"
                className={styles.input}
                value={filters.moveInTo}
                onChange={(e) => onFilterChange('moveInTo', e.target.value)}
              />
            </div>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.changedOnly}
                onChange={(e) => onFilterChange('changedOnly', e.target.checked)}
              />
              일정변경만
            </label>

            <label className={`${styles.checkboxLabel} ${styles.bidetOnlyLabel}`}>
              <input
                type="checkbox"
                checked={filters.showBidetsOnly}
                onChange={(e) => onFilterChange('showBidetsOnly', e.target.checked)}
              />
              비데만 보기
            </label>

            <div className={styles.actions}>
              <button className={styles.resetButton} onClick={onReset}>
                초기화
              </button>
              <button className={styles.searchButton} onClick={onSearch}>
                검색
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
