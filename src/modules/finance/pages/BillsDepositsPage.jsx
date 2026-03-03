import React, { useState, useCallback, useMemo } from 'react';
import {
  Table, Typography, Tag, Space, Button, Card
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';

const { Title, Text } = Typography;

// 금액 포맷터
const formatNum = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

const CollectionStatus = ({ isTabMode = false }) => {

  // ── 필터 상태 ──────────────────────────────────────────
  const [filterValue, setFilterValue] = useState({
    dateFrom: '',
    dateTo: '',
    bpNm: '',
    salesOrg: '',
    collectionType: '',
  });

  const handleFilterChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilterValue({ dateFrom: '', dateTo: '', bpNm: '', salesOrg: '', collectionType: '' });
  }, []);

  const filterFields = useMemo(() => [
    {
      id: 'colDate', label: '수금일자', type: 'dateRange',
      fromKey: 'dateFrom', toKey: 'dateTo', row: 0,
    },
    {
      id: 'bpNm', label: '거래처', type: 'text',
      placeholder: '거래처 코드 또는 명칭', wide: true, row: 0,
    },
    {
      id: 'salesOrg', label: '영업조직', type: 'select', width: 140, row: 0,
      options: [
        { label: '전체', value: '' },
        { label: '세일즈부문', value: 'sales' },
        { label: '바스플랜부문', value: 'bath' },
      ],
    },
    {
      id: 'collectionType', label: '수금구분', type: 'select', width: 130, row: 0,
      options: [
        { label: '전체', value: '' },
        { label: '통장입금', value: 'bank' },
        { label: '어음', value: 'note' },
      ],
    },
  ], []);
  // ── 필터 상태 끝 ────────────────────────────────────────

  // 더미 데이터
  const dataSource = [
    { key: '1', bpCd: '050006', bpNm: '합자회사 대림타일', repreNm: '이경호', type: '통장입금', colDate: '2026-01-29', manager: '이해규', salesNo: 'BN202512310535', salesDate: '2025-12-31', clearNo: 'UX202601290010', swAmt: 13521959, tileAmt: 0, totalAmt: 13521959, bank: '우리은행 신사동금융' },
    { key: '2', bpCd: '050006', bpNm: '합자회사 대림타일', repreNm: '이경호', type: '통장입금', colDate: '2026-02-26', manager: '김진원', salesNo: 'BN202601310563', salesDate: '2026-01-31', clearNo: 'UX202602260020', swAmt: 0, tileAmt: 704000, totalAmt: 704000, bank: '우리은행 신사동금융' },
    { key: '3', bpCd: '050016', bpNm: '디에스대성하우징(주)', repreNm: '김진태', type: '통장입금', colDate: '2026-01-27', manager: '이해규', salesNo: 'BN202511300211', salesDate: '2025-11-30', clearNo: 'UX202601270011', swAmt: 200000000, tileAmt: 0, totalAmt: 200000000, bank: '우리은행 신사동금융' },
    { key: '4', bpCd: '050020', bpNm: '정일도기타일상사', repreNm: '권용헌', type: '통장입금', colDate: '2026-01-30', manager: '조동욱', salesNo: 'BN202512310576', salesDate: '2025-12-31', clearNo: 'UX202601300051', swAmt: 10000000, tileAmt: 0, totalAmt: 10000000, bank: '우리은행 신사동금융' },
  ];

  // 테이블 컬럼 정의
  const columns = [
    { title: '거래처코드', dataIndex: 'bpCd', width: 100, fixed: 'left', align: 'center' },
    { title: '거래처명', dataIndex: 'bpNm', width: 180, fixed: 'left', ellipsis: true },
    { title: '대표자명', dataIndex: 'repreNm', width: 90, align: 'center' },
    {
      title: '수금구분', dataIndex: 'type', width: 100, align: 'center',
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    { title: '수금일자', dataIndex: 'colDate', width: 110, align: 'center' },
    { title: '영업담당자', dataIndex: 'manager', width: 100, align: 'center' },
    { title: '매출번호', dataIndex: 'salesNo', width: 160, align: 'center' },
    { title: '매출일자', dataIndex: 'salesDate', width: 110, align: 'center' },
    { title: '반제번호', dataIndex: 'clearNo', width: 160, align: 'center' },
    { title: 'SW수금액', dataIndex: 'swAmt', width: 130, align: 'right', render: formatNum },
    { title: '타일수금액', dataIndex: 'tileAmt', width: 130, align: 'right', render: formatNum },
    {
      title: '수금합계', dataIndex: 'totalAmt', width: 140, align: 'right',
      render: (val) => <span style={{ color: '#cf1322', fontWeight: 'bold' }}>{formatNum(val)}</span>
    },
    { title: '입금은행', dataIndex: 'bank', width: 160, ellipsis: true },
  ];

  return (
    <div style={{ padding: isTabMode ? '0' : '24px', backgroundColor: isTabMode ? 'transparent' : '#f0f2f5', minHeight: isTabMode ? 'auto' : '100vh' }}>

      {/* 헤더 (탭 모드가 아닐 때만 노출) */}
      {!isTabMode && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0 }}>어음 및 수금관리</Title>
          <Space>
            <Button icon={<DownloadOutlined />}>엑셀 다운로드</Button>
          </Space>
        </div>
      )}
      {isTabMode && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={5} style={{ margin: 0 }}>어음 및 수금 현황</Title>
          <Space>
            <Button icon={<DownloadOutlined />} size="small">엑셀 다운로드</Button>
          </Space>
        </div>
      )}

      {/* 검색 필터 (공통 ListFilter) */}
      <ListFilter
        fields={filterFields}
        value={filterValue}
        onChange={handleFilterChange}
        onReset={handleReset}
        onSearch={() => { /* TODO: 조회 API 연동 */ }}
        searchLabel="조회"
      />

      {/* 테이블 */}
      <Card bordered={false} bodyStyle={{ padding: '0' }} style={{ marginTop: '12px' }}>
        <div style={{ padding: '12px 24px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
          <Text type="secondary">조회 결과: {dataSource.length} 건</Text>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          bordered
          size="small"
          scroll={{ x: 1800, y: 500 }}
          pagination={{ pageSize: 50, showSizeChanger: true }}
          summary={(pageData) => {
            let totalSw = 0;
            let totalTile = 0;
            let totalSum = 0;
            pageData.forEach(({ swAmt, tileAmt, totalAmt }) => {
              totalSw += swAmt;
              totalTile += tileAmt;
              totalSum += totalAmt;
            });
            return (
              <Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 'bold' }}>
                <Table.Summary.Cell index={0} colSpan={9} align="center">총 합계</Table.Summary.Cell>
                <Table.Summary.Cell index={9} align="right">{formatNum(totalSw)}</Table.Summary.Cell>
                <Table.Summary.Cell index={10} align="right">{formatNum(totalTile)}</Table.Summary.Cell>
                <Table.Summary.Cell index={11} align="right">
                  <span style={{ color: '#cf1322' }}>{formatNum(totalSum)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
};

export { CollectionStatus as BillsDepositsPage };
export default CollectionStatus;
