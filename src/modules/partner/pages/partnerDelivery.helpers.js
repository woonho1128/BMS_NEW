export function createYearOptions(defaultYear) {
  const list = [];
  for (let i = 0; i < 5; i += 1) {
    const y = String(defaultYear - i);
    list.push({ value: y, label: `${y}년` });
  }
  return list;
}

export const factoryOptions = [
  { value: '', label: '전체' },
  { value: '제천공장', label: '제천공장' },
  { value: '부산공장', label: '부산공장' },
  { value: '대구공장', label: '대구공장' },
];

export const shipTypeOptions = [
  { value: '', label: '전체' },
  { value: '직송', label: '직송' },
  { value: '택배', label: '택배' },
];

export function buildMonthlyFields({ yearOptions, isAgencyRole, partnerQuery, partnerId, selectedPartnerLabel, partnerOptionsFiltered }) {
  const fields = [];
  fields.push({ id: 'year', label: '연도', type: 'select', options: yearOptions, width: 120, row: 0 });
  if (!isAgencyRole) {
    fields.push({ id: 'partnerQuery', label: '대리점검색', type: 'text', placeholder: '대리점 검색', wide: true, row: 0 });
  }
  fields.push({
    id: 'partnerId',
    label: '대리점',
    type: 'select',
    options: isAgencyRole ? [{ value: partnerId, label: selectedPartnerLabel || '내 대리점' }] : partnerOptionsFiltered,
    disabled: isAgencyRole,
    wide: true,
    row: 0,
  });
  return fields;
}

export function buildStatusFields({ isAgencyRole, partnerId, selectedPartnerLabel, partnerOptionsFiltered }) {
  const fields = [];
  fields.push({ id: 'factory', label: '공장명', type: 'select', options: factoryOptions, width: 140, row: 0 });
  fields.push({ id: 'shipType', label: '출고형태', type: 'select', options: shipTypeOptions, width: 120, row: 0 });
  fields.push({
    id: 'shipStatus',
    label: '출고상태',
    type: 'radio',
    options: [
      { value: '전체', label: '전체' },
      { value: '출고대기', label: '출고대기' },
      { value: '출고완료', label: '출고완료' },
    ],
    row: 0,
  });
  fields.push({ id: 'range', label: '출고일자', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 });
  if (!isAgencyRole) {
    fields.push({ id: 'partnerQuery', label: '대리점검색', type: 'text', placeholder: '대리점 검색', wide: true, row: 1 });
  }
  fields.push({
    id: 'partnerId',
    label: '대리점',
    type: 'select',
    options: isAgencyRole ? [{ value: partnerId, label: selectedPartnerLabel || '내 대리점' }] : partnerOptionsFiltered,
    disabled: isAgencyRole,
    wide: true,
    row: 1,
  });
  return fields;
}
