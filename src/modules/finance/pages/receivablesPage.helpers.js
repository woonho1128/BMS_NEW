export function getDefaultYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function createYearOptions(defaultYear) {
  const y = Number(defaultYear);
  const list = [];
  for (let i = 0; i < 5; i += 1) {
    const yy = String(y - i);
    list.push({ value: yy, label: `${yy}년` });
  }
  return list;
}

export function createMonthOptions() {
  const list = [{ value: '', label: '월 선택' }];
  for (let m = 1; m <= 12; m += 1) {
    const mm = String(m).padStart(2, '0');
    list.push({ value: mm, label: `${m}월` });
  }
  return list;
}

export function buildReceivableFields({
  isAgencyRole,
  filterValue,
  selectedPartnerLabel,
  partnerOptions,
  yearOptions,
  monthOptions,
}) {
  const yearOptionsForFilter = yearOptions.map((o) => ({ value: o.value, label: o.label }));
  const monthOptionsForFilter = monthOptions.filter((o) => o.value !== '').map((o) => ({ value: o.value, label: o.label }));

  const partnerField = {
    id: 'partnerId',
    label: '대리점',
    type: 'select',
    options: isAgencyRole
      ? [{ value: filterValue.partnerId, label: selectedPartnerLabel || '내 대리점' }]
      : partnerOptions,
    disabled: isAgencyRole,
    wide: true,
    row: 0,
  };
  const yearField = { id: 'year', label: '기준년도', type: 'select', options: yearOptionsForFilter, width: 120, row: 0 };
  const monthField = { id: 'month', label: '기준월', type: 'select', options: monthOptionsForFilter, width: 120, row: 0 };
  if (isAgencyRole) return [partnerField, yearField, monthField];
  return [{ id: 'partnerQuery', label: '대리점검색', type: 'text', placeholder: '대리점 검색', wide: true, row: 0 }, partnerField, yearField, monthField];
}

export function buildBillFields({ isAgencyRole, partnerId, selectedPartnerLabel, partnerOptionsAll }) {
  return [
    { id: 'billCriteria', label: '설정기준', type: 'radio', options: [{ value: 'issueDate', label: '발행일' }, { value: 'dueDate', label: '만기일' }], row: 0 },
    { id: 'billRange', label: '설정기간', type: 'dateRange', fromKey: 'billFrom', toKey: 'billTo', row: 0 },
    {
      id: 'partnerId',
      label: '대리점',
      type: 'select',
      options: isAgencyRole ? [{ value: partnerId, label: selectedPartnerLabel || '내 대리점' }] : partnerOptionsAll,
      disabled: isAgencyRole,
      wide: true,
      row: 0,
    },
  ];
}

export function buildDepositFields({ yearOptions, monthOptions, isAgencyRole, partnerId, selectedPartnerLabel, partnerOptionsAll }) {
  const yearOptionsForFilter = yearOptions.map((o) => ({ value: o.value, label: o.label }));
  const monthOptionsForFilter = monthOptions.filter((o) => o.value !== '').map((o) => ({ value: o.value, label: o.label }));
  return [
    { id: 'depositYear', label: '년도', type: 'select', options: yearOptionsForFilter, width: 120, row: 0 },
    { id: 'depositMonth', label: '월', type: 'select', options: monthOptionsForFilter, width: 90, row: 0 },
    {
      id: 'partnerId',
      label: '대리점',
      type: 'select',
      options: isAgencyRole ? [{ value: partnerId, label: selectedPartnerLabel || '내 대리점' }] : partnerOptionsAll,
      disabled: isAgencyRole,
      wide: true,
      row: 0,
    },
  ];
}

export function buildCollateralFields({ yearOptions, isAgencyRole, partnerId, selectedPartnerLabel, collateralPartnerOptions }) {
  const yearOptionsForFilter = yearOptions.map((o) => ({ value: o.value, label: o.label }));
  const statusField = {
    id: 'collateralStatus',
    label: '담보상태',
    type: 'select',
    options: [{ value: '전체', label: '전체' }, { value: '정상', label: '정상' }, { value: '해지', label: '해지' }],
    width: 120,
    row: 0,
  };
  const yearField = { id: 'collateralYear', label: '설정년도', type: 'select', options: yearOptionsForFilter, width: 120, row: 0 };
  const partnerField = {
    id: 'partnerId',
    label: '대리점',
    type: 'select',
    options: isAgencyRole ? [{ value: partnerId, label: selectedPartnerLabel || '내 대리점' }] : collateralPartnerOptions,
    disabled: isAgencyRole,
    wide: true,
    row: 0,
  };
  if (isAgencyRole) return [statusField, yearField, partnerField];
  return [{ id: 'collateralPartnerQuery', label: '대리점검색', type: 'text', placeholder: '대리점 검색', wide: true, row: 0 }, statusField, yearField, partnerField];
}
