// 검색 입력값을 화면 전반에서 동일한 기준으로 정규화한다.
export const normalizeQuery = (value) => value.trim().toLowerCase();

export const includesNormalized = (value, normalizedQuery) => value.toLowerCase().includes(normalizedQuery);

// 체크박스 단건 선택/해제의 공통 토글 로직.
export const toggleIdInList = (list, id) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);

// 다중 선택 상태에서 중복 id 유입을 방지한다.
export const addOrRemoveId = (list, id, checked) =>
  checked ? [...new Set([...list, id])] : list.filter((item) => item !== id);

export const isAllRowsSelected = (rows, selectedIds) =>
  rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));
