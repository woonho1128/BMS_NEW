export const DEFAULT_FILTER_VALUE = {
  version: 'V02',
  itemSearch: '',
  dateFrom: '',
  dateTo: '',
  isActive: '',
  clientSearch: '',
  discountYear: '2026',
  discountMonth: '04',
  discountDealer: '',
  discountManager: '',
};

export function buildFilterFields(activeTab) {
  if (activeTab === '1') {
    return [
      {
        id: 'version',
        label: '버전 선택',
        type: 'select',
        width: 160,
        row: 0,
        options: [
          { label: 'V02 (현재)', value: 'V02' },
          { label: 'V01 (과거)', value: 'V01' },
        ],
      },
    ];
  }

  return [
    {
      id: 'discountYear',
      label: '조회년월',
      type: 'select',
      width: 100,
      row: 0,
      options: [
        { label: '2026년', value: '2026' },
        { label: '2025년', value: '2025' },
      ],
    },
    {
      id: 'discountMonth',
      label: '',
      type: 'select',
      width: 90,
      row: 0,
      options: Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}월`, value: String(i + 1).padStart(2, '0') })),
    },
    { id: 'discountDealer', label: '거래처', type: 'text', placeholder: '대리점 검색', wide: true, row: 0 },
    { id: 'discountManager', label: '영업그룹', type: 'text', placeholder: '담당자 코드', row: 0 },
  ];
}
