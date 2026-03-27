export const PLAN_SNAPSHOTS = [
  { id: '2026.01', label: '2026.01', savedAt: '2026-01-09 14:32', author: '김동만' },
  { id: '2026.02', label: '2026.02', savedAt: '2026-02-10 09:15', author: '이순희' },
];

export const PLAN_COLUMNS = [
  { key: 'company', label: '건설사', width: 100, align: 'center' },
  { key: 'site', label: '현장명', width: 220, isLink: true },
  { key: 'agency', label: '대리점', width: 95, align: 'center' },
  { key: 'deliveryDate', label: '납품예정', width: 88, align: 'center' },
  { key: 'item1', label: '품번', width: 90, align: 'center' },
  { key: 'qty', label: '수량', width: 78, align: 'right' },
  { key: 'agencyPrice', label: '대리점가', width: 95, align: 'right' },
  { key: 'totalWeightTon', label: '총중량(TON)', width: 92, align: 'right' },
  { key: 'amount', label: '금액', width: 100, align: 'right' },
  { key: 'spec', label: '특수사양', width: 98 },
  { key: 'manager', label: '담당자', width: 84, align: 'center' },
  { key: 'item2', label: '품목', width: 86, align: 'center' },
  { key: 'specManager', label: 'SPEC담당', width: 92, align: 'center' },
];

const companies = ['DL건설', '현대건설', 'GS건설', '포스코건설', '대우건설'];
const agencies = ['서울대리점', '경기대리점', '부산대리점', '인천대리점', '광주대리점'];
const items = [
  { name: '양변기', code: 'W-100', weight: 45, price: 120000, item2: '위생기기' },
  { name: '비데일체형', code: 'B-200', weight: 30, price: 350000, item2: '비데' },
  { name: '세면대', code: 'L-300', weight: 15, price: 80000, item2: '위생기기' },
  { name: '수전', code: 'F-400', weight: 2, price: 50000, item2: '수전' },
];

const createBaseRow = (id, status = '진행') => {
  const item = items[id % items.length];
  const qty = status === '완료' ? 60 : status === '부분납품' ? 100 : 150;
  const company = companies[id % companies.length];
  const agency = agencies[id % agencies.length];
  const totalWeightKg = item.weight * qty;

  return {
    id,
    company,
    site: `테스트 현장 ${id}`,
    agency,
    deliveryDate: `2026-03-${String((id % 28) + 1).padStart(2, '0')}`,
    moveInDate: `2026-05-${String((id % 28) + 1).padStart(2, '0')}`,
    item1: item.code,
    color: '화이트',
    qty,
    agencyPrice: item.price,
    weight: item.weight,
    totalWeightKg,
    totalWeightTon: totalWeightKg / 1000,
    amount: item.price * qty,
    spec: '일반',
    memo: '최초 등록',
    manager: `영업담당${(id % 5) + 1}`,
    item2: item.item2,
    category: id % 2 === 0 ? '특판' : '리테일',
    specManager: `SPEC담당${(id % 3) + 1}`,
    status,
    source: id % 2 === 0 ? 'spec' : 'plan',
    changeHistory: [],
    partialHistory: [],
  };
};

const generateRows = () => {
  const rows = [];

  for (let i = 1; i <= 10; i++) rows.push(createBaseRow(i, '진행'));

  for (let i = 11; i <= 15; i++) {
    const row = createBaseRow(i, '부분납품');
    row.partialHistory = [
      { date: '2026-02-01', qty: 50, note: '1차 납품' },
      { date: '2026-02-15', qty: 50, note: '2차 납품' },
    ];
    row.memo = '잔여 물량 대기중';
    rows.push(row);
  }

  for (let i = 16; i <= 20; i++) {
    const row = createBaseRow(i, '완료');
    row.changeHistory = [
      { field: '납품예정', oldValue: '2026-02-10', newValue: '2026-02-20', reason: '현장 요청', date: '2026-02-05' },
    ];
    row.partialHistory = [{ date: '2026-02-20', qty: row.qty, note: '전량 납품' }];
    row.memo = '모든 물량 납품 완료';
    rows.push(row);
  }

  return rows;
};

export const MOCKED_COMPARISON_DATA = [
  {
    id: 'diff1',
    company: 'DL건설',
    site: '현장 1',
    agency: '인천대리점',
    item: '양변기',
    color: '화이트',
    prevDeliveryDate: '2026-03-01',
    currDeliveryDate: '2026-03-15',
    prevQty: 60,
    currQty: 60,
    prevAmt: 7200000,
    currAmt: 7200000,
    changeType: 'schedule',
    reason: '현장 공정 지연',
    changer: '김동만',
    changedAt: '2026-02-15 10:30',
    memo: '비고 사항 없음',
    deliveryDate: '2026-03-15',
    moveInDate: '2026-05-01',
    qty: 60,
    amount: 7200000,
    agencyPrice: 120000,
    weight: 45,
    totalWeightKg: 2700,
    totalWeightTon: 2.7,
    manager: '영업담당1',
    spec: '일반',
    specManager: 'SPEC담당1',
    category: '특판',
    status: '진행',
    item1: 'W-100',
    item2: '위생기기',
    partialHistory: [],
    changeHistory: [{ field: '납품예정', oldValue: '2026-03-01', newValue: '2026-03-15', reason: '현장 공정 지연', date: '2026-02-15' }],
  },
  {
    id: 'diff2',
    company: '현대건설',
    site: '현장 2',
    agency: '서울대리점',
    item: '비데일체형',
    color: '아이보리',
    prevDeliveryDate: '2026-03-02',
    currDeliveryDate: '2026-03-02',
    prevQty: 70,
    currQty: 50,
    prevAmt: 24500000,
    currAmt: 17500000,
    changeType: 'quantity',
    reason: '발주 수량 감축',
    changer: '이순희',
    changedAt: '2026-02-12 14:00',
    memo: '변경번호 #1234',
    deliveryDate: '2026-03-02',
    moveInDate: '2026-05-02',
    qty: 50,
    amount: 17500000,
    agencyPrice: 350000,
    weight: 30,
    totalWeightKg: 1500,
    totalWeightTon: 1.5,
    manager: '영업담당2',
    spec: '비데일체',
    specManager: 'SPEC담당2',
    category: '리테일',
    status: '진행',
    item1: 'B-200',
    item2: '비데',
    partialHistory: [],
    changeHistory: [{ field: '수량', oldValue: '70', newValue: '50', reason: '계약 변경', date: '2026-02-12' }],
  },
];

export const INITIAL_PLAN_ROWS = generateRows();

export const COMPLETED_DELIVERY_DATA = [
  {
    id: 'cd1',
    company: 'DL건설',
    site: '서울 현장 A',
    agency: '서울대리점',
    completedMonth: '2026-01',
    deliveryDate: '2026-01-15',
    item: '양변기',
    color: '화이트',
    qty: 100,
    price: 120000,
    weight: 45,
    totalWeightKg: 4500,
    totalWeightTon: 4.5,
    amount: 12000000,
    spec: '일반',
    manager: '김담당',
    category: '특판',
    specManager: 'SPEC1',
    memo: '1차 납품 완료건입니다.',
    moveInDate: '2026-03-01',
    agencyPrice: 120000,
    status: '완료',
    item1: 'W-100',
    item2: '위생기기'
  },
  {
    id: 'cd2',
    company: '현대건설',
    site: '부산 현장 B',
    agency: '부산대리점',
    completedMonth: '2026-01',
    deliveryDate: '2026-01-20',
    item: '비데일체형',
    color: '아이보리',
    qty: 50,
    price: 350000,
    weight: 30,
    totalWeightKg: 1500,
    totalWeightTon: 1.5,
    amount: 17500000,
    spec: '비데일체',
    manager: '박담당',
    category: '리테일',
    specManager: 'SPEC2',
    memo: '',
    moveInDate: '2026-04-01',
    agencyPrice: 350000,
    status: '완료',
    item1: 'B-200',
    item2: '비데'
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `cd_dummy_${i}`,
    company: companies[i % 5],
    site: `테스트 완료 현장 ${i + 1}`,
    agency: agencies[i % 5],
    completedMonth: `2026-${String((i % 3) + 1).padStart(2, '0')}`,
    deliveryDate: `2026-${String((i % 3) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    item: items[i % 4].name,
    color: '화이트',
    qty: (i + 1) * 10,
    price: 150000,
    weight: 20,
    totalWeightKg: (i + 1) * 200,
    totalWeightTon: ((i + 1) * 200) / 1000,
    amount: (i + 1) * 10 * 150000,
    spec: '일반',
    manager: `영업담당${(i % 5) + 1}`,
    category: i % 2 === 0 ? '특판' : '리테일',
    specManager: `SPEC담당${(i % 3) + 1}`,
    memo: `더미 데이터 ${i + 1}`,
    moveInDate: '2026-06-01',
    agencyPrice: 150000,
    status: '완료',
    item1: items[i % 4].code,
    item2: items[i % 4].item2,
  }))
];

export const YEARLY_PERFORMANCE_DATA = {
  columns: [
    { key: 'category', label: '구분', width: 150, align: 'left', fixed: 'left' },
    ...Array.from({ length: 12 }, (_, i) => ({
      key: `m${i + 1}`,
      label: `${i + 1}월`,
      width: 100,
      align: 'right'
    })),
    { key: 'total', label: '합계', width: 120, align: 'right', fixed: 'right', isTotal: true }
  ],
  rows: [
    { id: 'total', category: '합계', isTotalRow: true, m1: 2950, m2: 1600, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 4550 },
    { id: 'sanitary', category: '위생기기', m1: 1200, m2: 800, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 2000 },
    { id: 'oem', category: 'OEM', m1: 500, m2: 300, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 800 },
    { id: 'product', category: '상품', m1: 300, m2: 200, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 500 },
    { id: 'faucet', category: '수전', m1: 200, m2: 100, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 300 },
    { id: 'bidet', category: '비데', m1: 750, m2: 200, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, total: 950 },
  ]
};

export const APPROVED_SPEC_DATA = [
  {
    id: 'spec_101',
    company: 'HDC현대산업개발',
    site: '수원 아이파크 5차',
    agency: '경기대리점',
    deliveryDate: '2026-04-01',
    moveInDate: '2026-06-01',
    manager: '김SPEC',
    category: '특판',
    specManager: 'SPEC1',
    status: 'pending',
    approvalMonth: '2026-02',
    items: [
      { item1: 'W-100', color: '화이트', qty: 200, agencyPrice: 125000, weight: 45, totalWeightKg: 9000, totalWeightTon: 9.0, amount: 25000000, spec: '특수형', memo: '긴급 규격 적용' },
      { item1: 'L-300', color: '화이트', qty: 200, agencyPrice: 85000, weight: 15, totalWeightKg: 3000, totalWeightTon: 3.0, amount: 17000000, spec: '일반', memo: '' }
    ]
  },
  {
    id: 'spec_102',
    company: '롯데건설',
    site: '부산 롯데캐슬 시그니처',
    agency: '부산대리점',
    deliveryDate: '2026-05-15',
    moveInDate: '2026-08-01',
    manager: '박SPEC',
    category: '특판',
    specManager: 'SPEC2',
    status: 'pending',
    approvalMonth: '2026-02',
    items: [
      { item1: 'B-200', color: '아이보리', qty: 50, agencyPrice: 360000, weight: 30, totalWeightKg: 1500, totalWeightTon: 1.5, amount: 18000000, spec: '고급형', memo: 'VIP 동 적용' }
    ]
  },
  {
    id: 'spec_103',
    company: '삼성물산',
    site: '반포 래미안 갤러리',
    agency: '서울대리점',
    deliveryDate: '2026-03-20',
    moveInDate: '2026-06-15',
    manager: '정SPEC',
    category: '특판',
    specManager: 'SPEC3',
    status: 'completed',
    approvalMonth: '2026-01',
    items: [
      { item1: 'F-400', color: '블랙', qty: 500, agencyPrice: 55000, weight: 2, totalWeightKg: 1000, totalWeightTon: 1.0, amount: 27500000, spec: '특수형', memo: '기반시설 연동' }
    ]
  }
];

export const CANCELLED_SPEC_DATA = [
  {
    id: 'cancel_001',
    company: 'DL건설',
    site: '천안 e편한세상 시티',
    agency: '경기대리점',
    deliveryDate: '2026-05-01',
    moveInDate: '2026-07-01',
    manager: '박담당',
    category: '특판',
    specManager: '김SPEC',
    cancelDate: '2026-02-10',
    cancelledBy: '관리자',
    items: [
      { item1: 'W-100', color: '화이트', qty: 150, agencyPrice: 130000, weight: 45, totalWeightKg: 6750, totalWeightTon: 6.75, amount: 19500000, spec: '일반', memo: '시행사 부도로 인한 취소' }
    ]
  },
  {
    id: 'cancel_002',
    company: '신화건설',
    site: '서울 프레스티지 타워',
    agency: '서울대리점',
    deliveryDate: '2026-04-10',
    moveInDate: '2026-06-20',
    manager: '이담당',
    category: '특판',
    specManager: 'SPEC2',
    cancelDate: '2026-01-25',
    cancelledBy: '시행사',
    items: [
      { item1: 'L-300', color: '화이트', qty: 300, agencyPrice: 90000, weight: 15, totalWeightKg: 4500, totalWeightTon: 4.5, amount: 27000000, spec: '고급형', memo: '계약 해지' },
      { item1: 'F-400', color: '무광스틸', qty: 300, agencyPrice: 60000, weight: 2, totalWeightKg: 600, totalWeightTon: 0.6, amount: 18000000, spec: '일반', memo: '' }
    ]
  }
];
