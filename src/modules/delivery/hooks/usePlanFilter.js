import { useMemo, useState } from 'react';

const INITIAL_FILTERS = {
  company: '',
  site: '',
  agency: '',
  manager: '',
  item: '',
  deliveryFrom: '',
  deliveryTo: '',
  moveInFrom: '',
  moveInTo: '',
  status: '',
  remarks: '',
  changedOnly: false,
  showBidetsOnly: false,
};

function includesIgnoreCase(value, keyword) {
  if (!keyword) return true;
  const source = String(value || '').toLowerCase();
  const query = String(keyword || '').toLowerCase().trim();
  if (!query) return true;
  return source.includes(query);
}

function compareDateValue(value, from, to) {
  if (!value) return false;
  if (from && value < from) return false;
  if (to && value > to) return false;
  return true;
}

export const usePlanFilter = (rows) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
  };

  const filteredRows = useMemo(() => {
    const f = appliedFilters;

    const result = rows.filter((row) => {
      if (!includesIgnoreCase(row.company, f.company)) return false;
      if (!includesIgnoreCase(row.site, f.site)) return false;
      if (!includesIgnoreCase(row.agency, f.agency)) return false;
      if (!includesIgnoreCase(row.manager, f.manager)) return false;
      if (!includesIgnoreCase(row.item1, f.item) && !includesIgnoreCase(row.item2, f.item)) return false;

      if (f.status && row.status !== f.status) return false;

      if (f.remarks && !includesIgnoreCase(row.memo, f.remarks)) return false;
      if (f.changedOnly && !row.isChanged) return false;

      if (f.showBidetsOnly) {
        const hasBidet = String(row.item1 || '').includes('비데') || String(row.item2 || '').includes('비데');
        if (!hasBidet) return false;
      }

      if (f.deliveryFrom || f.deliveryTo) {
        if (!compareDateValue(row.deliveryDate, f.deliveryFrom, f.deliveryTo)) return false;
      }

      if (f.moveInFrom || f.moveInTo) {
        if (!compareDateValue(row.moveInDate, f.moveInFrom, f.moveInTo)) return false;
      }

      return true;
    });
    return result;
  }, [rows, appliedFilters]);

  return {
    isExpanded,
    setIsExpanded,
    filters,
    filteredRows,
    handleFilterChange,
    handleSearch,
    handleReset,
  };
};
