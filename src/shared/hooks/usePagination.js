import { useEffect, useMemo, useState } from 'react';

export function usePagination(data = [], options = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const setPage = (page) => {
    const next = Number(page);
    if (Number.isNaN(next)) return;
    setCurrentPage(Math.min(Math.max(next, 1), totalPages));
  };

  const updatePageSize = (size) => {
    const next = Number(size);
    if (!next || Number.isNaN(next) || next < 1) return;
    setPageSize(next);
    setCurrentPage(1);
  };

  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    pagedData,
    setPage,
    setPageSize: updatePageSize,
    resetPage,
  };
}
