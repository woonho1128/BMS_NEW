export const TAB = {
  RECEIVABLE: 'receivable',
  COLLECTION: 'collection',
  NOTE: 'note',
  OUTSTANDING: 'outstanding',
};

export const TABLES = {
  [TAB.COLLECTION]: {
    columns: [
      '거래처',
      '거래처명',
      '대표자명',
      '수금구분',
      '어음구분',
      '수금일자',
      '반제결의번호',
      '수금액',
      '어음번호',
      '어음발행은행',
      '발행인',
      '어음발행일',
      '어음만기일',
      '어음상태',
      '입금은행',
      '입금계좌번호',
    ],
    rows: [
      ['050006', '한사회사 대림타일', '이경호', '통장입금', '-', '2026-03-27', 'UX202603270005', 90588939, '-', '-', '-', '-', '-', '-', '우리은행', '082-037021-13-001'],
      ['050007', '대원타일위생기사사', '김성진', '어음', '자수', '2026-03-11', 'UX202603110022', 40358615, '전자0000278', '신한은행', '코리아아트', '2026-03-11', '2026-04-10', '발생', '우리은행', '082-037021-13-001'],
    ],
  },
  [TAB.NOTE]: {
    columns: ['상태', '어음번호', '차수/단수', '어음금액', '발행일', '만기일', '부서코드', '부서명', '거래처코드', '거래처명', '은행', '발행인', '비고'],
    rows: [
      ['결제', '자가30217984', '타수', 42200000, '2025-10-22', '2026-01-09', '7100', '리테일1팀', '101266', '(주)세양도기', '우리은행', '한일도기사', '-'],
      ['결제', '전자00001442', '타수', 4000000, '2025-12-31', '2026-03-01', '7100', '리테일1팀', '051800', '(주)에스티유중', '신한은행', '풍림상인(주)', '-'],
    ],
  },
};

export const OUTSTANDING_ROWS = [
  { customerCode: '050016', customerName: '디에스대성하우징(주)', managerCode: 'G814', managerName: '이해규', salesOrg: '리테일3팀', salesDate: '2026-04-02', salesNo: 'BN202604020011', salesAmount: 213852980, receiptAmount: 157965320, outstandingAmount: 55887660 },
  { customerCode: '050090', customerName: '강남타일상사', managerCode: 'G814', managerName: '이해규', salesOrg: '리테일3팀', salesDate: '2026-04-08', salesNo: 'BN202604080487', salesAmount: 11587224, receiptAmount: 0, outstandingAmount: 11587224 },
  { customerCode: '050231', customerName: '세양위생기기', managerCode: 'G814', managerName: '이해규', salesOrg: '리테일3팀', salesDate: '2026-04-15', salesNo: 'BN202604150103', salesAmount: 48200500, receiptAmount: 20100000, outstandingAmount: 28100500 },
  { customerCode: '050006', customerName: '한사회사 대리점', managerCode: 'G906', managerName: '강종근', salesOrg: '리테일1팀', salesDate: '2026-04-05', salesNo: 'BN202604050221', salesAmount: 90588939, receiptAmount: 70300120, outstandingAmount: 20288819 },
  { customerCode: '050007', customerName: '대원타일위생기사사', managerCode: 'G906', managerName: '강종근', salesOrg: '리테일1팀', salesDate: '2026-03-27', salesNo: 'BN202603270122', salesAmount: 40358615, receiptAmount: 30000000, outstandingAmount: 10358615 },
  { customerCode: '050078', customerName: '형제도기', managerCode: 'G747', managerName: '미승현-S', salesOrg: '리테일2팀', salesDate: '2026-04-12', salesNo: 'BN202604120077', salesAmount: 38104600, receiptAmount: 30000000, outstandingAmount: 8104600 },
];

export const RECEIVABLE_SOURCE = [
  {
    bpCd: '050006',
    bpNm: '효자대리점',
    repreNm: '김경호',
    gb: '인테리어부문',
    salesNm: '권순희',
    estAmt: 200000000,
    noteAmt: 109941691,
    ext4Cd: 'Y',
    swPrevAmt: 69719309,
    tiPrevAmt: 704000,
    prevAmt: 70423309,
    swBillAmt: 90058309,
    tiBillAmt: 0,
    billAmt: 90058309,
    swOverdue: 0,
    tiOverdue: 0,
    totOverdue: 0,
  },
];
