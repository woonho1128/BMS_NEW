export const TAB_KEYS = { WEEKLY: 'weekly', TRIP: 'trip' };
export const TAB_LABELS = { [TAB_KEYS.WEEKLY]: '주간보고', [TAB_KEYS.TRIP]: '출장보고' };
export const STATUS_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'draft', label: '임시저장' },
  { value: 'submitted', label: '제출완료' },
  { value: 'confirmed', label: '확인완료' },
];

export function filterReports(list, filters) {
  const { activeTab, periodFrom, periodTo, dept, team, author, status, search } = filters;
  let filtered = list.filter((row) => row.type === activeTab);

  if (periodFrom) {
    filtered = filtered.filter((row) => {
      const target = String(row.createdAt || row.period || '').slice(0, 10);
      return target >= periodFrom;
    });
  }

  if (periodTo) {
    filtered = filtered.filter((row) => {
      const target = String(row.createdAt || row.period || '').slice(0, 10);
      return target <= periodTo;
    });
  }

  if (dept) filtered = filtered.filter((row) => row.dept === dept);
  if (team) filtered = filtered.filter((row) => row.team === team);
  if (author) filtered = filtered.filter((row) => row.author === author);
  if (status) filtered = filtered.filter((row) => row.status === status);

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (row) =>
        String(row.summary || '').toLowerCase().includes(q) ||
        String(row.author || '').toLowerCase().includes(q)
    );
  }

  return filtered;
}

export function paginate(list, page, itemsPerPage) {
  const start = (page - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
}
