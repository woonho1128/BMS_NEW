import React, { useMemo } from 'react';
import { classnames } from '../../utils/classnames';
import styles from './Pagination.module.css';

function buildPageItems(currentPage, totalPages, maxVisible = 7) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [1];
  const innerVisible = maxVisible - 2;
  let start = Math.max(2, currentPage - Math.floor(innerVisible / 2));
  let end = Math.min(totalPages - 1, start + innerVisible - 1);

  if (end >= totalPages - 1) {
    end = totalPages - 1;
    start = Math.max(2, end - innerVisible + 1);
  }

  if (start > 2) items.push('...');
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < totalPages - 1) items.push('...');
  items.push(totalPages);
  return items;
}

export function Pagination({
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  className,
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pageItems = useMemo(
    () => buildPageItems(currentPage, totalPages),
    [currentPage, totalPages]
  );

  if (totalCount <= 0) return null;

  return (
    <div className={classnames(styles.pagination, className)}>
      {onPageSizeChange && (
        <label className={styles.sizeWrap}>
          보기
          <select
            className={styles.sizeSelect}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}개
              </option>
            ))}
          </select>
        </label>
      )}

      <div className={styles.nav}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          이전
        </button>

        {pageItems.map((item, index) =>
          item === '...' ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={classnames(
                styles.btn,
                styles.btnNum,
                currentPage === item && styles.btnNumActive
              )}
              onClick={() => onPageChange?.(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className={styles.btn}
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
}
