import React, { useState, useCallback, useMemo } from 'react';
import {
    Table, Typography, Tooltip, Space, Switch, Badge, Button, Card, Tabs
} from 'antd';
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { BillsDepositsPage } from './BillsDepositsPage';

const { Title, Text } = Typography;

// 숫자 콤마 포맷팅 헬퍼
const formatNum = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

/**
 * 탭 1: 채권 및 여신 현황 컨텐츠
 */
const ReceivableStatusTab = () => {
    const [changedData, setChangedData] = useState([]);

    // ── 필터 상태 ──────────────────────────────────────────
    const [filterValue, setFilterValue] = useState({
        yearMonth: '',
        creditType: '',
        bpCd: '',
        bpNm: '',
    });

    const handleFilterChange = useCallback((id, value) => {
        setFilterValue((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handleReset = useCallback(() => {
        setFilterValue({ yearMonth: '', creditType: '', bpCd: '', bpNm: '' });
    }, []);

    const filterFields = useMemo(() => [
        {
            id: 'yearMonth', label: '기준년월', type: 'date', row: 0,
        },
        {
            id: 'creditType', label: '여신구분', type: 'select', width: 140, row: 0,
            options: [
                { label: '전체', value: '' },
                { label: '통합', value: 'integrated' },
                { label: '세일즈부문', value: 'sales' },
                { label: '바스플랜부문', value: 'bath' },
            ],
        },
        { id: 'bpCd', label: '거래처 코드', type: 'text', placeholder: '코드 입력', row: 0 },
        { id: 'bpNm', label: '거래처명', type: 'text', placeholder: '거래처명 검색', wide: true, row: 0 },
    ], []);
    // ── 필터 상태 끝 ────────────────────────────────────────

    // 한도제한 스위치 변경 핸들러
    const handleLimitChange = (bpCd, newVal) => {
        setChangedData(prev => [...prev.filter(item => item.bpCd !== bpCd), { bpCd, newVal }]);
    };

    // 테이블 컬럼 정의 (2단 헤더 및 좌측 틀고정)
    const columns = [
        {
            title: '거래처정보',
            children: [
                { title: '코드', dataIndex: 'bpCd', width: 80, fixed: 'left', align: 'center' },
                { title: '거래처명', dataIndex: 'bpNm', width: 180, fixed: 'left', ellipsis: true },
                { title: '대표자', dataIndex: 'repreNm', width: 80, fixed: 'left', align: 'center' },
                { title: '여신구분', dataIndex: 'gb', width: 100, align: 'center' },
                { title: '영업그룹', dataIndex: 'salesNm', width: 100, align: 'center' },
            ],
        },
        {
            title: '여신한도',
            children: [
                { title: '거래한도', dataIndex: 'estAmt', width: 130, align: 'right', render: formatNum },
                {
                    title: '여신잔여한도', dataIndex: 'noteAmt', width: 130, align: 'right',
                    render: (val) => <strong style={{ color: val < 0 ? '#cf1322' : '#096dd9' }}>{formatNum(val)}</strong>
                },
                {
                    title: '한도제한', dataIndex: 'ext4Cd', width: 90, align: 'center',
                    render: (val, record) => (
                        <Switch
                            checkedChildren="Y" unCheckedChildren="N"
                            defaultChecked={val === 'Y'}
                            onChange={(checked) => handleLimitChange(record.bpCd, checked ? 'Y' : 'N')}
                            style={{ backgroundColor: val === 'Y' ? '#ff4d4f' : '#d9d9d9' }}
                        />
                    )
                },
            ],
        },
        {
            title: '전월 외상매출금액',
            children: [
                { title: '위생도기', dataIndex: 'swPrevAmt', width: 120, align: 'right', render: formatNum },
                { title: '타일', dataIndex: 'tiPrevAmt', width: 120, align: 'right', render: formatNum },
                { title: '합계', dataIndex: 'prevAmt', width: 120, align: 'right', render: formatNum, className: 'col-sum' },
            ],
        },
        {
            title: '당월 출고금액',
            children: [
                { title: '위생도기', dataIndex: 'swBillAmt', width: 120, align: 'right', render: formatNum },
                { title: '타일', dataIndex: 'tiBillAmt', width: 120, align: 'right', render: formatNum },
                { title: '합계', dataIndex: 'billAmt', width: 120, align: 'right', render: formatNum, className: 'col-sum' },
            ],
        },
        {
            title: '당월 연체금액',
            children: [
                { title: '위생도기', dataIndex: 'swOverdue', width: 120, align: 'right', render: formatNum },
                { title: '타일', dataIndex: 'tiOverdue', width: 120, align: 'right', render: formatNum },
                {
                    title: '합계', dataIndex: 'totOverdue', width: 120, align: 'right',
                    render: (val) => <span style={{ color: val > 0 ? '#cf1322' : 'inherit' }}>{formatNum(val)}</span>,
                    className: 'col-sum'
                },
            ],
        }
    ];

    // 임시 데이터
    const dataSource = [
        { key: '1', bpCd: '050006', bpNm: '합자회사 대림타일', repreNm: '이경호', gb: '세일즈부문', salesNm: '권순호', estAmt: 200000000, noteAmt: 109941691, ext4Cd: 'Y', swPrevAmt: 69719309, tiPrevAmt: 704000, prevAmt: 70423309, swBillAmt: 90058309, tiBillAmt: 0, billAmt: 90058309, swOverdue: 0, tiOverdue: 0, totOverdue: 0 },
        { key: '2', bpCd: '050024', bpNm: '이화타이루', repreNm: '유미옥', gb: '세일즈부문', salesNm: '유승식', estAmt: 190000000, noteAmt: -17138380, ext4Cd: 'N', swPrevAmt: 115245714, tiPrevAmt: 32861620, prevAmt: 148107334, swBillAmt: 90673561, tiBillAmt: 19298400, billAmt: 109971961, swOverdue: 30000000, tiOverdue: 8107334, totOverdue: 38107334 },
    ];

    return (
        <div style={{ padding: '0px' }}>
            {/* 1. 헤더 및 마감 정보 영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={5} style={{ margin: 0 }}>채권 및 여신 현황</Title>
                <Space>
                    <Badge status="processing" text="마감자: 시스템 / 마감일시: 2026-02-27 18:00" style={{ marginRight: '16px', fontWeight: 'bold' }} />
                    <Tooltip title={
                        <div>
                            <p><b>계산로직:</b> 당월 외상매출금 = 전월외상 + 당월판매 - 당월수금</p>
                            <p><b>여신한도:</b> 거래한도 - 당월 외상매출금 - 미결제어음</p>
                        </div>
                    }>
                        <Button icon={<QuestionCircleOutlined />} type="dashed" size="small">계산 로직 안내</Button>
                    </Tooltip>
                </Space>
            </div>

            {/* 2. 검색 필터 영역 */}
            <ListFilter
                fields={filterFields}
                value={filterValue}
                onChange={handleFilterChange}
                onReset={handleReset}
                onSearch={() => { }}
                searchLabel="조회"
            />

            {/* 3. 테이블 영역 */}
            <Card bordered={false} bodyStyle={{ padding: '0' }} style={{ marginTop: '12px' }}>
                <div style={{ padding: '12px 24px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary">조회 결과: {dataSource.length} 건</Text>
                    <Button
                        type="primary"
                        danger={changedData.length > 0}
                        disabled={changedData.length === 0}
                        icon={<SaveOutlined />}
                        size="small"
                    >
                        {changedData.length > 0 ? `${changedData.length}건 변경 저장` : '변경사항 없음'}
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    bordered
                    size="small"
                    scroll={{ x: 2800, y: 500 }}
                    pagination={{ pageSize: 50 }}
                    summary={() => (
                        <Table.Summary.Row style={{ backgroundColor: '#fafafa', fontWeight: 'bold' }}>
                            <Table.Summary.Cell index={0} colSpan={5} align="center">총 합계</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align="right">3,372,993,161,116</Table.Summary.Cell>
                            <Table.Summary.Cell index={6} align="right">3,331,621,425,825</Table.Summary.Cell>
                            <Table.Summary.Cell index={7} />
                            <Table.Summary.Cell index={8} align="right">26,106,000,247</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Card>
            <style>{`.col-sum { background-color: #fafafa !important; font-weight: 500; }`}</style>
        </div>
    );
};

/**
 * 탭 2: 어음 및 수금 현황 컨텐츠 (기존 BillsDepositsPage 래핑)
 */
const CollectionStatusTab = () => {
    // 내부 패딩 제거를 위해 BillsDepositsPage를 수정하거나, 여기서 스타일을 덮어씀
    return (
        <div className="tab-integrated-content">
            <BillsDepositsPage isTabMode={true} />
            <style>{`
                .tab-integrated-content > div { padding: 0 !important; background: transparent !important; min-height: auto !important; }
                .tab-integrated-content h4 { font-size: 16px !important; }
            `}</style>
        </div>
    );
};

/**
 * 메인 컨테이너 컴포넌트
 */
const SupportReceivablePage = () => {
    const items = [
        {
            key: 'receivable',
            label: '채권 및 여신 현황',
            children: <ReceivableStatusTab />,
        },
        {
            key: 'collection',
            label: '어음 및 수금 현황',
            children: <CollectionStatusTab />,
        },
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Card bordered={false}>
                <Title level={4} style={{ marginBottom: '24px' }}>여신,수금 관리</Title>
                <Tabs
                    defaultActiveKey="receivable"
                    items={items}
                    type="card"
                    size="middle"
                />
            </Card>
        </div>
    );
};

export { SupportReceivablePage };
export default SupportReceivablePage;
