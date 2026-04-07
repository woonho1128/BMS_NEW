/**
 * 대리점 기본 정보 Mock
 */
export const PARTNER_BASIC_MOCK = {
  name: '대리점A',
  code: '111203',
  status: '정상',
  basic: {
    bizNo: '123-45-67890',
    ceoName: '홍길동',
    bizType: '도소매업',
    bizItem: '건축자재 유통',
  },
  contact: {
    phone: '02-1234-5678',
    mobile: '010-1234-5678',
    fax: '02-1234-5679',
    email: 'partner@example.com',
  },
  etc: {
    address: '서울특별시 강남구 테헤란로 123, 10층',
    startedAt: '2018-04-01',
  },
  erpInsights: {
    monthlyDiscountRate: 7.2,
    lastMonthSalesAmount: 38500000,
    amountToUpgradeDiscountTier: 6200000,
    collateralRenewalDday: 30,
  },
  purchaseBest10: [
    { itemCode: 'CC-735', itemName: '원피스세면기', category: '위생도기', amount: 11200000 },
    { itemCode: 'CL-384', itemName: '비데일체형', category: '위생도기', amount: 9650000 },
    { itemCode: 'BC-310', itemName: '세면 수전', category: '수전', amount: 8210000 },
    { itemCode: 'FV-220', itemName: '샤워 수전', category: '수전', amount: 7980000 },
    { itemCode: 'TSC-417D', itemName: '타일 600x600', category: '타일', amount: 7560000 },
    { itemCode: 'TSC-338A', itemName: '타일 300x300', category: '타일', amount: 7020000 },
    { itemCode: 'OEM-220', itemName: 'OEM 부자재', category: '부자재', amount: 5320000 },
    { itemCode: 'ACC-901', itemName: '배수 트랩', category: '부자재', amount: 4860000 },
    { itemCode: 'KIT-120', itemName: '설치 키트', category: '부자재', amount: 4410000 },
    { itemCode: 'WX-700', itemName: '벽부형 액세서리', category: '액세서리', amount: 3980000 },
  ],
  salesMix: {
    deliveryAmount: 24800000,
    retailAmount: 13700000,
  },
};
