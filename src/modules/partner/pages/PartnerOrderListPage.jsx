import React, { useState, useMemo } from 'react';
import {
    Table, Card, Select, Input, DatePicker, Button,
    Tag, Typography, Space, Row, Col, Tooltip,
    Popconfirm, Drawer, Divider, Timeline, Empty, Spin
} from 'antd';
import {
    FileTextOutlined, PlusOutlined, DownloadOutlined,
    ReloadOutlined, SearchOutlined, ShoppingCartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import styles from './PartnerOrderListPage.module.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// --- Mock Data ---
const ORDER_STATUS = {
    REQUESTED: { label: '발주신청', color: 'blue' },
    REVIEWING: { label: '검수중', color: 'orange' },
    REJECTED: { label: '반려', color: 'red' },
    CONFIRMED: { label: '확정', color: 'green' },
    CANCELED: { label: '취소', color: 'default' }
};

const MOCK_ORDERS = Array.from({ length: 45 }).map((_, i) => ({
    orderId: `ORD-20240211-${1000 + i}`,
    orderDate: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
    itemCount: 2 + (i % 5),
    totalAmount: (i + 1) * 235000,
    status: Object.keys(ORDER_STATUS)[i % 5],
    deliveryAddress: '서울특별시 서초구 반포동 123-45 대림프라자 2층',
    requestNote: '오전 중 배송 부탁드립니다.',
    items: [
        { id: 1, name: '프리미엄 비데 상품', model: 'BD-100', qty: 2, price: 50000, amount: 100000 },
        { id: 2, name: '양변기 부속 세트', model: 'ACC-20', qty: 1, price: 25000, amount: 25000 }
    ]
}));

// --- Sub-components ---

export function PartnerOrderListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [statusFilter, setStatusFilter] = useState(undefined);
    const [priceFilter, setPriceFilter] = useState(undefined);
    const [sortBy, setSortBy] = useState('newest');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    // Filter Logic
    const filteredData = useMemo(() => {
        let result = MOCK_ORDERS.filter(order => {
            // 1. Search term
            const matchSearch = order.orderId.includes(searchTerm) || order.status.includes(searchTerm);

            // 2. Date range
            let matchDate = true;
            if (dateRange && dateRange[0] && dateRange[1]) {
                const start = dateRange[0].startOf('day');
                const end = dateRange[1].endOf('day');
                const orderDate = dayjs(order.orderDate);
                matchDate = orderDate.isAfter(start) && orderDate.isBefore(end);
            }

            // 3. Status
            const matchStatus = !statusFilter || order.status === statusFilter;

            // 4. Price range
            let matchPrice = true;
            if (priceFilter === '0-10') matchPrice = order.totalAmount <= 100000;
            else if (priceFilter === '10-50') matchPrice = order.totalAmount > 100000 && order.totalAmount <= 500000;
            else if (priceFilter === '50-100') matchPrice = order.totalAmount > 500000 && order.totalAmount <= 1000000;
            else if (priceFilter === '100+') matchPrice = order.totalAmount > 1000000;

            return matchSearch && matchDate && matchStatus && matchPrice;
        });

        // 5. Sort
        if (sortBy === 'newest') result.sort((a, b) => dayjs(b.orderDate).diff(dayjs(a.orderDate)));
        else if (sortBy === 'oldest') result.sort((a, b) => dayjs(a.orderDate).diff(dayjs(b.orderDate)));
        else if (sortBy === 'price_high') result.sort((a, b) => b.totalAmount - a.totalAmount);
        else if (sortBy === 'price_low') result.sort((a, b) => a.totalAmount - b.totalAmount);

        return result;
    }, [searchTerm, dateRange, statusFilter, priceFilter, sortBy]);

    // Counts
    const counts = useMemo(() => {
        return {
            total: filteredData.length,
            processing: filteredData.filter(d => d.status === 'REQUESTED' || d.status === 'REVIEWING').length,
            rejected: filteredData.filter(d => d.status === 'REJECTED').length,
            confirmed: filteredData.filter(d => d.status === 'CONFIRMED').length,
            canceled: filteredData.filter(d => d.status === 'CANCELED').length,
        };
    }, [filteredData]);

    const handleReset = () => {
        setSearchTerm('');
        setDateRange(null);
        setStatusFilter(undefined);
        setPriceFilter(undefined);
        setPage(1);
    };

    const openDetails = (order) => {
        setSelectedOrder(order);
        setDrawerVisible(true);
    };

    const columns = [
        {
            title: '발주번호',
            dataIndex: 'orderId',
            key: 'orderId',
            render: (text, record) => (
                <span className={styles.orderNumberLink} onClick={() => openDetails(record)}>
                    {text}
                </span>
            ),
        },
        {
            title: '발주일',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 140,
        },
        {
            title: '품목수',
            dataIndex: 'itemCount',
            key: 'itemCount',
            align: 'right',
            sorter: (a, b) => a.itemCount - b.itemCount,
        },
        {
            title: '총금액',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            align: 'right',
            render: (val) => (
                <span className={styles.priceCell}>
                    {val.toLocaleString()} 원
                </span>
            ),
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={ORDER_STATUS[status]?.color}>
                    {ORDER_STATUS[status]?.label}
                </Tag>
            ),
        },
        {
            title: '액션',
            key: 'action',
            align: 'center',
            width: 180,
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" onClick={() => openDetails(record)}>상세</Button>
                    {record.status === 'REJECTED' && (
                        <Button size="small" type="primary" ghost>재신청</Button>
                    )}
                    {(record.status === 'REQUESTED' || record.status === 'REVIEWING') && (
                        <Popconfirm title="발주를 취소하시겠습니까?" onConfirm={() => console.log('Cancel', record.orderId)}>
                            <Button size="small" danger type="link">취소</Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    const headerActions = (
        <Space>
            <Tooltip title="준비중입니다">
                <Button icon={<DownloadOutlined />} disabled>
                    엑셀 다운로드
                </Button>
            </Tooltip>
            <Button type="primary" icon={<PlusOutlined />}>
                새 발주
            </Button>
        </Space>
    );

    return (
        <PageShell
            path="/partner/order/list"
            title="발주 내역 조회"
            actions={headerActions}
            className={styles.shellOverride}
        >
            <div style={{ padding: '0 32px 32px' }}>
                {/* Filter Section */}
                <Card variant="borderless" className={styles.filterCard} style={{ background: '#fafafa' }}>
                    <Row justify="space-between" align="middle" gutter={[16, 16]}>
                        <Col flex="auto">
                            <Space wrap size={16}>
                                <RangePicker
                                    style={{ width: 260 }}
                                    value={dateRange}
                                    onChange={(val) => { setDateRange(val); setPage(1); }}
                                />
                                <Select
                                    placeholder="상태 선택"
                                    style={{ width: 160 }}
                                    allowClear
                                    value={statusFilter}
                                    onChange={(val) => { setStatusFilter(val); setPage(1); }}
                                >
                                    {Object.entries(ORDER_STATUS).map(([key, val]) => (
                                        <Select.Option key={key} value={key}>{val.label}</Select.Option>
                                    ))}
                                </Select>
                                <Input.Search
                                    placeholder="발주번호 / 상태 검색"
                                    style={{ width: 380 }}
                                    allowClear
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onSearch={() => setPage(1)}
                                    enterButton="검색"
                                />
                                <Select
                                    placeholder="금액 구간"
                                    style={{ width: 160 }}
                                    allowClear
                                    value={priceFilter}
                                    onChange={(val) => { setPriceFilter(val); setPage(1); }}
                                >
                                    <Select.Option value="0-10">10만원 이하</Select.Option>
                                    <Select.Option value="10-50">10~50만원</Select.Option>
                                    <Select.Option value="50-100">50~100만원</Select.Option>
                                    <Select.Option value="100+">100만원 이상</Select.Option>
                                </Select>
                            </Space>
                        </Col>
                        <Col>
                            {(searchTerm || dateRange || statusFilter || priceFilter) && (
                                <Button type="link" icon={<ReloadOutlined />} onClick={handleReset}>
                                    필터 초기화
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card>

                {/* Summary Chips Section */}
                <div className={styles.summaryRow}>
                    <div className={styles.statChips}>
                        <Text strong style={{ marginRight: 8, marginTop: 4 }}>검색 결과 총 {counts.total}건</Text>
                        <div className={classnames(styles.chip, styles.chipProgress)}>
                            진행중 <span className={styles.chipValue}>{counts.processing}</span>
                        </div>
                        <div className={classnames(styles.chip, styles.chipRejected)}>
                            반려 <span className={styles.chipValue}>{counts.rejected}</span>
                        </div>
                        <div className={classnames(styles.chip, styles.chipConfirmed)}>
                            확정 <span className={styles.chipValue}>{counts.confirmed}</span>
                        </div>
                        <div className={classnames(styles.chip, styles.chipCanceled)}>
                            취소 <span className={styles.chipValue}>{counts.canceled}</span>
                        </div>
                    </div>
                    <Select
                        value={sortBy}
                        onChange={(val) => setSortBy(val)}
                        style={{ width: 140 }}
                    >
                        <Select.Option value="newest">최신순</Select.Option>
                        <Select.Option value="oldest">오래된순</Select.Option>
                        <Select.Option value="price_high">금액 높은순</Select.Option>
                        <Select.Option value="price_low">금액 낮은순</Select.Option>
                    </Select>
                </div>

                {/* Table Section */}
                <div className={styles.tableCard}>
                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="orderId"
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: filteredData.length,
                            onChange: (p) => setPage(p),
                            showSizeChanger: false,
                            placement: 'bottomCenter',
                            style: { marginTop: 24 }
                        }}
                        loading={loading}
                        scroll={{ x: 1000 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="발주 내역이 없습니다."
                                >
                                    {(searchTerm || dateRange || statusFilter || priceFilter) && (
                                        <Button type="primary" ghost onClick={handleReset}>필터 초기화</Button>
                                    )}
                                </Empty>
                            )
                        }}
                    />
                </div>
            </div>

            {/* Detail Drawer */}
            <Drawer
                title={
                    <Space>
                        <FileTextOutlined style={{ color: '#1890ff' }} />
                        <span>발주 상세 정보</span>
                    </Space>
                }
                styles={{ wrapper: { width: 580 } }}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                destroyOnClose
            >
                {selectedOrder && (
                    <div className={styles.drawerContent}>
                        {/* Header Summary */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <Title level={5} style={{ margin: 0 }}>{selectedOrder.orderId}</Title>
                                <Text type="secondary" style={{ fontSize: 12 }}>발주일: {selectedOrder.orderDate}</Text>
                            </div>
                            <Tag color={ORDER_STATUS[selectedOrder.status]?.color} style={{ margin: 0 }}>
                                {ORDER_STATUS[selectedOrder.status]?.label}
                            </Tag>
                        </div>

                        <Divider style={{ margin: '12px 0' }} />

                        {/* Info Section */}
                        <section>
                            <div className={styles.drawerSectionTitle}>기본 / 배송 정보</div>
                            <div className={styles.infoGrid}>
                                <span className={styles.infoLabel}>납품처</span>
                                <span className={styles.infoValue}>{selectedOrder.deliveryAddress}</span>
                                <span className={styles.infoLabel}>요청사항</span>
                                <span className={styles.infoValue}>{selectedOrder.requestNote}</span>
                            </div>
                        </section>

                        {/* Item Table */}
                        <section>
                            <div className={styles.drawerSectionTitle}>발주 품목 리스트</div>
                            <Table
                                dataSource={selectedOrder.items}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                columns={[
                                    { title: '상품명', dataIndex: 'name', key: 'name' },
                                    { title: '수량', dataIndex: 'qty', key: 'qty', align: 'right' },
                                    { title: '금액', dataIndex: 'amount', key: 'amount', align: 'right', render: (v) => v.toLocaleString() + '원' },
                                ]}
                            />
                        </section>

                        {/* Price Summary */}
                        <section>
                            <div className={styles.amountSummary}>
                                <div className={styles.amountRow}>
                                    <Text>공급가액</Text>
                                    <Text strong>{selectedOrder.totalAmount.toLocaleString()} 원</Text>
                                </div>
                                <div className={styles.amountRow}>
                                    <Text>부가세 (10%)</Text>
                                    <Text>{Math.floor(selectedOrder.totalAmount * 0.1).toLocaleString()} 원</Text>
                                </div>
                                <div className={classnames(styles.amountRow, styles.totalAmountRow)}>
                                    <Text style={{ color: '#003a8c' }}>최종 합계 금액</Text>
                                    <Text>{Math.floor(selectedOrder.totalAmount * 1.1).toLocaleString()} 원</Text>
                                </div>
                            </div>
                        </section>

                        {/* Timeline */}
                        <section>
                            <div className={styles.drawerSectionTitle}>상태 처리 이력</div>
                            <div className={styles.timelineSection}>
                                <Timeline
                                    items={[
                                        { color: 'green', children: '발주 신청 완료 (' + selectedOrder.orderDate + ')' },
                                        { color: selectedOrder.status === 'REVIEWING' || selectedOrder.status === 'CONFIRMED' ? 'green' : 'gray', children: '검수 진행 중' },
                                        selectedOrder.status === 'REJECTED' ? { color: 'red', children: '발주 반려 (서류 미비)' } : null,
                                        selectedOrder.status === 'CONFIRMED' ? { color: 'green', children: '발주 확정 완료' } : null,
                                    ].filter(Boolean)}
                                />
                            </div>
                        </section>

                        {/* Drawer Actions */}
                        <div style={{ marginTop: 'auto', textAlign: 'right', gap: 8, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setDrawerVisible(false)}>닫기</Button>
                            {selectedOrder.status === 'REJECTED' && (
                                <Button type="primary">수정하러 가기</Button>
                            )}
                        </div>
                    </div>
                )}
            </Drawer>
        </PageShell>
    );
}

function classnames(...args) {
    return args.filter(Boolean).join(' ');
}
