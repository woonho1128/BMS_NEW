import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, ConfigProvider, Typography } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';

const { Text } = Typography;

// 숫자 콤마 포맷팅 헬퍼 함수
const formatNumber = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

// 연도 옵션 생성 (최근 5년)
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const y = String(currentYear - i);
  return { value: y, label: `${y}년` };
});

// 월 옵션 생성
const monthOptions = Array.from({ length: 12 }, (_, i) => {
  const m = String(i + 1).padStart(2, '0');
  return { value: m, label: `${i + 1}월` };
});

export function SalesPerformancePage() {
  const { pathname } = useLocation();
  const [filterValue, setFilterValue] = useState({
    startYear: String(currentYear),
    startMonth: '09',
    endYear: String(currentYear),
    endMonth: '11',
    outputType: 'client',
    searchCategory: 'transactionType',
    salesGroup: 'S112',
    itemGroup: '',
  });

  // 1. [동적 제어] 출력물에 따른 '조회구분' 옵션 데이터
  const searchCategoryOptions = useMemo(() => {
    switch (filterValue.outputType) {
      case 'item': return [{ label: '품목별', value: 'item' }];
      case 'org': return [{ label: '영업사원', value: 'manager' }, { label: '영업조직', value: 'org' }];
      case 'client': return [{ label: '수불유형', value: 'transactionType' }, { label: '품목계정', value: 'itemAccount' }];
      default: return [];
    }
  }, [filterValue.outputType]);

  // 2. [동적 제어] outputType + searchCategory 조합별 좌측 고정 구분 컬럼 정의
  const groupColumns = useMemo(() => {
    const key = `${filterValue.outputType}__${filterValue.searchCategory}`;
    switch (key) {
      case 'item__item':
        return [
          { title: '대분류', dataIndex: 'category1', width: 100, fixed: 'left' },
          { title: '중분류', dataIndex: 'category2', width: 100, fixed: 'left' },
          { title: '품목코드', dataIndex: 'itemCode', width: 100, fixed: 'left' },
          { title: '품목', dataIndex: 'itemName', width: 150, fixed: 'left' },
        ];
      case 'org__manager':
        return [
          { title: '영업조직', dataIndex: 'orgName', width: 120, fixed: 'left' },
          { title: '영업사원', dataIndex: 'managerName', width: 100, fixed: 'left' },
        ];
      case 'org__org':
        return [
          { title: '영업조직', dataIndex: 'orgName', width: 150, fixed: 'left' },
        ];
      case 'client__transactionType':
        return [
          { title: '거래처', dataIndex: 'clientName', width: 150, fixed: 'left' },
          { title: '수불유형', dataIndex: 'transactionType', width: 100, fixed: 'left' },
        ];
      case 'client__itemAccount':
        return [
          { title: '거래처', dataIndex: 'clientName', width: 150, fixed: 'left' },
          { title: '품목구분', dataIndex: 'itemAccount', width: 100, fixed: 'left' },
        ];
      default:
        return [
          { title: '거래처', dataIndex: 'clientName', width: 150, fixed: 'left' },
        ];
    }
  }, [filterValue.outputType, filterValue.searchCategory]);

  // 출력물 변경 시 조회구분 값 초기화
  useEffect(() => {
    setFilterValue((prev) => ({ ...prev, searchCategory: searchCategoryOptions[0]?.value ?? '' }));
  }, [filterValue.outputType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({
      startYear: String(currentYear),
      startMonth: '09',
      endYear: String(currentYear),
      endMonth: '11',
      outputType: 'client',
      searchCategory: 'transactionType',
      salesGroup: 'S112',
      itemGroup: '',
    });
  }, []);

  // 필터 필드 정의 (ListFilter 공통 컴포넌트 스펙)
  const filterFields = useMemo(() => [
    // 1행: 조회년월 범위 + 출력물
    { id: 'startYear', label: '조회 시작', type: 'select', options: yearOptions, width: 90, row: 0 },
    { id: 'startMonth', label: '', type: 'select', options: monthOptions, width: 72, row: 0 },
    { id: 'endYear', label: '~ 종료', type: 'select', options: yearOptions, width: 90, row: 0 },
    { id: 'endMonth', label: '', type: 'select', options: monthOptions, width: 72, row: 0 },
    {
      id: 'outputType', label: '출력물', type: 'radio', row: 0,
      options: [
        { value: 'item', label: '품목별' },
        { value: 'org', label: '조직별' },
        { value: 'client', label: '거래처별' },
      ],
    },
    // 2행: 구분 + 영업그룹
    {
      id: 'salesGroup', label: '영업그룹', type: 'select', row: 1, width: 180,
      options: [{ label: 'S112 | 리테일2팀', value: 'S112' }]
    },
    {
      id: 'searchCategory', label: '조회구분', type: 'select', row: 1, width: 130,
      options: searchCategoryOptions
    },
    {
      id: 'itemGroup', label: '품목그룹', type: 'select', row: 1, width: 130,
      options: [{ label: '전체', value: '' }]
    },
  ], [searchCategoryOptions]);

  // 3. [동적 제어] 조회년월에 따른 동적 테이블 컬럼 생성
  const tableColumns = useMemo(() => {
    const columns = [
      {
        title: '구분',
        children: [
          { title: 'No.', dataIndex: 'key', width: 50, align: 'center', fixed: 'left' },
          ...groupColumns,
        ]
      }
    ];

    const sy = parseInt(filterValue.startYear, 10);
    const sm = parseInt(filterValue.startMonth, 10);
    const ey = parseInt(filterValue.endYear, 10);
    const em = parseInt(filterValue.endMonth, 10);

    let y = sy;
    let m = sm;
    while (y < ey || (y === ey && m <= em)) {
      const mm = String(m).padStart(2, '0');
      const dataKeyPrefix = `${y}${mm}`;
      const monthLabel = `${m}월`;

      columns.push({
        title: monthLabel,
        children: [
          { title: '매출', dataIndex: `${dataKeyPrefix}_sales`, width: 110, align: 'right', render: formatNumber },
          { title: '원가', dataIndex: `${dataKeyPrefix}_cost`, width: 110, align: 'right', render: formatNumber },
          {
            title: '이익', dataIndex: `${dataKeyPrefix}_profit`, width: 110, align: 'right',
            render: (val) => <span style={{ color: val < 0 ? 'red' : 'inherit' }}>{formatNumber(val)}</span>
          }
        ]
      });

      m += 1;
      if (m > 12) { m = 1; y += 1; }
    }

    columns.push({
      title: '합계',
      children: [
        { title: '매출', dataIndex: 'total_sales', width: 120, align: 'right', render: formatNumber, className: 'total-col' },
        { title: '원가', dataIndex: 'total_cost', width: 120, align: 'right', render: formatNumber, className: 'total-col' },
        { title: '이익', dataIndex: 'total_profit', width: 120, align: 'right', render: formatNumber, className: 'total-col' }
      ]
    });

    return columns;
  }, [filterValue.startYear, filterValue.startMonth, filterValue.endYear, filterValue.endMonth, groupColumns]);

  // 임시 데이터 (실제로는 API에서 받아옵니다)
  // 모든 출력물 조합의 dataIndex 키를 포함해 어떤 뷰에서도 동일 데이터 활용 가능
  const mockData = [
    { key: 1, clientName: '대원타일위생기', transactionType: '매출', itemAccount: '내장재', orgName: '리테일2팀', managerName: '김민준', category1: '바닥재', category2: '도자기타일', itemCode: 'FT-1001', itemName: '600각 라임스톤', '202509_sales': 29065150, '202509_cost': 22194595, '202509_profit': 6870555, '202510_sales': 11763790, '202510_cost': 9338138, '202510_profit': 2425652, '202511_sales': 30080110, '202511_cost': 17066526, '202511_profit': 13013584, total_sales: 70909050, total_cost: 48599259, total_profit: 22309791 },
    { key: 2, clientName: '(주)한결세라믹스', transactionType: '매출', itemAccount: '위생도기', orgName: '리테일2팀', managerName: '이서연', category1: '벽재', category2: '포세린', itemCode: 'WT-2001', itemName: '300×600 네추럴그레이', '202509_sales': 692441720, '202509_cost': 459516310, '202509_profit': 232925410, '202510_sales': 551193450, '202510_cost': 334412049, '202510_profit': 216781401, '202511_sales': 363041940, '202511_cost': 232157631, '202511_profit': 130884309, total_sales: 1606677110, total_cost: 1026085990, total_profit: 580591120 },
    { key: 3, clientName: '현대타일 창원', transactionType: '반품', itemAccount: '내장재', orgName: '타일영업팀', managerName: '박지호', category1: '바닥재', category2: '천연석', itemCode: 'NS-3001', itemName: '대리석 화이트 300각', '202509_sales': 839310, '202509_cost': 627347, '202509_profit': 211963, '202510_sales': 245310, '202510_cost': 217450, '202510_profit': 27860, '202511_sales': 88950, '202511_cost': 74000, '202511_profit': 14950, total_sales: 1173570, total_cost: 918797, total_profit: 254773 },
    { key: 4, clientName: '대성건재(주)', transactionType: '매출', itemAccount: '내장재', orgName: '리테일2팀', managerName: '최수빈', category1: '바닥재', category2: '도자기타일', itemCode: 'FT-1002', itemName: '800각 헤링본 패턴', '202509_sales': 145320000, '202509_cost': 105820000, '202509_profit': 39500000, '202510_sales': 178450000, '202510_cost': 131200000, '202510_profit': 47250000, '202511_sales': 162300000, '202511_cost': 119800000, '202511_profit': 42500000, total_sales: 486070000, total_cost: 356820000, total_profit: 129250000 },
    { key: 5, clientName: '경남타일상사', transactionType: '매출', itemAccount: '외장재', orgName: '프로젝트팀', managerName: '윤지우', category1: '외장재', category2: '클링커', itemCode: 'EX-4001', itemName: '외장용 클링커 벽돌', '202509_sales': 98760000, '202509_cost': 72450000, '202509_profit': 26310000, '202510_sales': 112340000, '202510_cost': 83600000, '202510_profit': 28740000, '202511_sales': 87650000, '202511_cost': 64300000, '202511_profit': 23350000, total_sales: 298750000, total_cost: 220350000, total_profit: 78400000 },
    { key: 6, clientName: '부산자재마트', transactionType: '매출', itemAccount: '위생도기', orgName: '리테일2팀', managerName: '김민준', category1: '위생도기', category2: '욕실', itemCode: 'BT-5001', itemName: '세면기 원피스형 화이트', '202509_sales': 56230000, '202509_cost': 41800000, '202509_profit': 14430000, '202510_sales': 63450000, '202510_cost': 47200000, '202510_profit': 16250000, '202511_sales': 71200000, '202511_cost': 53100000, '202511_profit': 18100000, total_sales: 190880000, total_cost: 142100000, total_profit: 48780000 },
    { key: 7, clientName: '(주)광명인테리어', transactionType: '반품', itemAccount: '내장재', orgName: '영업지원팀', managerName: '이서연', category1: '바닥재', category2: '도자기타일', itemCode: 'FT-1003', itemName: '600각 슬레이트그레이', '202509_sales': 23100000, '202509_cost': 17800000, '202509_profit': 5300000, '202510_sales': 18700000, '202510_cost': 14200000, '202510_profit': 4500000, '202511_sales': 25600000, '202511_cost': 19400000, '202511_profit': 6200000, total_sales: 67400000, total_cost: 51400000, total_profit: 16000000 },
    { key: 8, clientName: '신세계건재', transactionType: '매출', itemAccount: '내장재', orgName: '리테일2팀', managerName: '박지호', category1: '벽재', category2: '모자이크', itemCode: 'MZ-6001', itemName: '유리모자이크 25×25', '202509_sales': 34500000, '202509_cost': 25300000, '202509_profit': 9200000, '202510_sales': 41200000, '202510_cost': 30600000, '202510_profit': 10600000, '202511_sales': 38900000, '202511_cost': 28700000, '202511_profit': 10200000, total_sales: 114600000, total_cost: 84600000, total_profit: 30000000 },
    { key: 9, clientName: '울산타일센터', transactionType: '매출', itemAccount: '외장재', orgName: '타일영업팀', managerName: '최수빈', category1: '외장재', category2: '테라코타', itemCode: 'TC-7001', itemName: '테라코타 파사드 타일', '202509_sales': 67890000, '202509_cost': 51200000, '202509_profit': 16690000, '202510_sales': 72300000, '202510_cost': 54400000, '202510_profit': 17900000, '202511_sales': 68100000, '202511_cost': 51900000, '202511_profit': 16200000, total_sales: 208290000, total_cost: 157500000, total_profit: 50790000 },
    { key: 10, clientName: '(주)한양타일', transactionType: '매출', itemAccount: '내장재', orgName: '프로젝트팀', managerName: '윤지우', category1: '바닥재', category2: '포세린', itemCode: 'PT-2002', itemName: '1200각 폴리싱 마블', '202509_sales': 321500000, '202509_cost': 241100000, '202509_profit': 80400000, '202510_sales': 289700000, '202510_cost': 218200000, '202510_profit': 71500000, '202511_sales': 345600000, '202511_cost': 260100000, '202511_profit': 85500000, total_sales: 956800000, total_cost: 719400000, total_profit: 237400000 },
    { key: 11, clientName: '대전하나건재', transactionType: '반품', itemAccount: '위생도기', orgName: '영업지원팀', managerName: '김민준', category1: '위생도기', category2: '욕실', itemCode: 'BT-5002', itemName: '욕조 아크릴 1500mm', '202509_sales': 12300000, '202509_cost': 9400000, '202509_profit': 2900000, '202510_sales': 8700000, '202510_cost': 6600000, '202510_profit': 2100000, '202511_sales': 15400000, '202511_cost': 11700000, '202511_profit': 3700000, total_sales: 36400000, total_cost: 27700000, total_profit: 8700000 },
    { key: 12, clientName: '금강인테리어', transactionType: '매출', itemAccount: '내장재', orgName: '리테일2팀', managerName: '이서연', category1: '벽재', category2: '도자기타일', itemCode: 'WT-2003', itemName: '300각 메트로 화이트', '202509_sales': 48700000, '202509_cost': 36500000, '202509_profit': 12200000, '202510_sales': 53200000, '202510_cost': 39800000, '202510_profit': 13400000, '202511_sales': 49800000, '202511_cost': 37200000, '202511_profit': 12600000, total_sales: 151700000, total_cost: 113500000, total_profit: 38200000 },
    { key: 13, clientName: '(주)서울도기', transactionType: '매출', itemAccount: '위생도기', orgName: '타일영업팀', managerName: '박지호', category1: '위생도기', category2: '주방', itemCode: 'KT-8001', itemName: '주방싱크 스테인리스', '202509_sales': 189300000, '202509_cost': 143200000, '202509_profit': 46100000, '202510_sales': 204500000, '202510_cost': 154900000, '202510_profit': 49600000, '202511_sales': 176800000, '202511_cost': 133600000, '202511_profit': 43200000, total_sales: 570600000, total_cost: 431700000, total_profit: 138900000 },
    { key: 14, clientName: '경기타일마트', transactionType: '매출', itemAccount: '내장재', orgName: '프로젝트팀', managerName: '최수빈', category1: '바닥재', category2: '천연석', itemCode: 'NS-3002', itemName: '트래버틴 크로스컷', '202509_sales': 87600000, '202509_cost': 66800000, '202509_profit': 20800000, '202510_sales': 94300000, '202510_cost': 71700000, '202510_profit': 22600000, '202511_sales': 91200000, '202511_cost': 69400000, '202511_profit': 21800000, total_sales: 273100000, total_cost: 207900000, total_profit: 65200000 },
    { key: 15, clientName: '(주)인천도자기', transactionType: '반품', itemAccount: '외장재', orgName: '영업지원팀', managerName: '윤지우', category1: '외장재', category2: '클링커', itemCode: 'EX-4002', itemName: '테라스용 클링커 2cm', '202509_sales': 33400000, '202509_cost': 25600000, '202509_profit': 7800000, '202510_sales': 28700000, '202510_cost': 21900000, '202510_profit': 6800000, '202511_sales': 36500000, '202511_cost': 27900000, '202511_profit': 8600000, total_sales: 98600000, total_cost: 75400000, total_profit: 23200000 },
    { key: 16, clientName: '수원건자재(주)', transactionType: '매출', itemAccount: '내장재', orgName: '리테일2팀', managerName: '김민준', category1: '바닥재', category2: '모자이크', itemCode: 'MZ-6002', itemName: '석재모자이크 45×45', '202509_sales': 61200000, '202509_cost': 46700000, '202509_profit': 14500000, '202510_sales': 68900000, '202510_cost': 52400000, '202510_profit': 16500000, '202511_sales': 65300000, '202511_cost': 49700000, '202511_profit': 15600000, total_sales: 195400000, total_cost: 148800000, total_profit: 46600000 },
    { key: 17, clientName: '남대문타일', transactionType: '매출', itemAccount: '내장재', orgName: '타일영업팀', managerName: '이서연', category1: '벽재', category2: '포세린', itemCode: 'WT-2004', itemName: '600×1200 슬라브', '202509_sales': 112400000, '202509_cost': 85600000, '202509_profit': 26800000, '202510_sales': 127800000, '202510_cost': 97200000, '202510_profit': 30600000, '202511_sales': 119600000, '202511_cost': 90900000, '202511_profit': 28700000, total_sales: 359800000, total_cost: 273700000, total_profit: 86100000 },
    { key: 18, clientName: '(주)대구건재유통', transactionType: '반품', itemAccount: '위생도기', orgName: '프로젝트팀', managerName: '박지호', category1: '위생도기', category2: '욕실', itemCode: 'BT-5003', itemName: '샤워부스 슬라이딩형', '202509_sales': 25600000, '202509_cost': 19700000, '202509_profit': 5900000, '202510_sales': 21300000, '202510_cost': 16200000, '202510_profit': 5100000, '202511_sales': 28900000, '202511_cost': 22000000, '202511_profit': 6900000, total_sales: 75800000, total_cost: 57900000, total_profit: 17900000 },
    { key: 19, clientName: '강원타일도매', transactionType: '매출', itemAccount: '외장재', orgName: '영업지원팀', managerName: '최수빈', category1: '외장재', category2: '테라코타', itemCode: 'TC-7002', itemName: '루프 테라코타 패널', '202509_sales': 44500000, '202509_cost': 34200000, '202509_profit': 10300000, '202510_sales': 51200000, '202510_cost': 39400000, '202510_profit': 11800000, '202511_sales': 47800000, '202511_cost': 36700000, '202511_profit': 11100000, total_sales: 143500000, total_cost: 110300000, total_profit: 33200000 },
    { key: 20, clientName: '(주)제주도자기건재', transactionType: '매출', itemAccount: '내장재', orgName: '리테일2팀', managerName: '윤지우', category1: '바닥재', category2: '천연석', itemCode: 'NS-3003', itemName: '화산석 현무암 슬레이트', '202509_sales': 78900000, '202509_cost': 60100000, '202509_profit': 18800000, '202510_sales': 83400000, '202510_cost': 63600000, '202510_profit': 19800000, '202511_sales': 79700000, '202511_cost': 60700000, '202511_profit': 19000000, total_sales: 242000000, total_cost: 184400000, total_profit: 57600000 },
  ];

  return (
    <PageShell path={pathname}>
      <ListFilter
        fields={filterFields}
        value={filterValue}
        onChange={handleFilterChange}
        onReset={handleReset}
        onSearch={() => {/* 조회 실행 */ }}
        searchLabel="조회"
      />

      {/* 데이터 그리드 (테이블) 영역 */}
      <ConfigProvider theme={{ components: { Table: { headerBg: '#4f81bd', headerColor: '#fff' } } }}>
        <Table
          columns={tableColumns}
          dataSource={mockData}
          bordered
          size="small"
          pagination={false}
          scroll={{ x: 'max-content', y: 500 }}
          rowClassName={(_, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
          style={{ marginTop: '12px' }}
        />
      </ConfigProvider>

      <div style={{ marginTop: '8px' }}>
        <Text type="secondary">품목별 조회 시 속도가 느릴 수 있습니다.</Text>
      </div>
    </PageShell>
  );
}

export default SalesPerformancePage;
