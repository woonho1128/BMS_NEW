import React, { useState, useMemo, useCallback } from 'react';
import { Table, Tabs, Tag } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';

// 숫자 콤마 헬퍼
const formatNum = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

// ─────────────────────────────────────────────────────────────
// 1. 단가표 관리
// ─────────────────────────────────────────────────────────────
const PRICE_TABLE_COLUMNS = [
    { title: '매출구간', dataIndex: 'bracket', width: 160 },
    { title: '최소금액', dataIndex: 'minAmount', width: 150, align: 'right', render: formatNum },
    { title: '최대금액', dataIndex: 'maxAmount', width: 150, align: 'right', render: formatNum },
    { title: '할인율(%)', dataIndex: 'discountRate', width: 110, align: 'right', render: (v) => `${v}%` },
    { title: '비고', dataIndex: 'remarks', ellipsis: true },
];

const PRICE_TABLE_DATA = [
    { key: 1, bracket: '1,000백만원 초과', minAmount: 1000000000, maxAmount: 9999999999, discountRate: 21.42, remarks: '' },
    { key: 2, bracket: '700백만원', minAmount: 700000000, maxAmount: 1000000000, discountRate: 21.00, remarks: '' },
    { key: 3, bracket: '500백만원', minAmount: 500000000, maxAmount: 700000000, discountRate: 20.58, remarks: '' },
    { key: 4, bracket: '300백만원', minAmount: 300000000, maxAmount: 500000000, discountRate: 20.16, remarks: '' },
    { key: 5, bracket: '100백만원', minAmount: 100000000, maxAmount: 300000000, discountRate: 19.74, remarks: '' },
];

// ─────────────────────────────────────────────────────────────
// 2. 프로모션 관리
// ─────────────────────────────────────────────────────────────
const PROMOTION_COLUMNS = [
    { title: '구분', dataIndex: 'type', width: 130 },
    { title: '품목코드', dataIndex: 'itemCode', width: 110, align: 'center' },
    { title: '품목명', dataIndex: 'itemName', width: 210, ellipsis: true },
    { title: '계정', dataIndex: 'account', width: 80, align: 'center' },
    {
        title: '할인율(%)', dataIndex: 'discountRate', width: 100, align: 'right',
        render: (v) => <strong style={{ color: '#d9534f' }}>{v}%</strong>,
    },
    { title: '적용기간 (FR ~ TO)', dataIndex: 'period', width: 230, align: 'center' },
    {
        title: '사용여부', dataIndex: 'isActive', width: 90, align: 'center',
        render: (v) => <Tag color={v ? 'success' : 'error'}>{v ? 'YES' : 'NO'}</Tag>,
    },
    { title: '비고 (문서번호 등)', dataIndex: 'remarks', ellipsis: true },
];

const PROMOTION_DATA = [
    { key: 1, type: 'A (프로모션)', itemCode: 'CAH301G', itemName: '대변기세척밸브', account: '상품', discountRate: 25.93, period: '2025-12-24 ~ 2026-01-16', isActive: true, remarks: '12.22변경/523-2025-006645' },
    { key: 2, type: 'A (프로모션)', itemCode: 'CAH301V', itemName: '대변기세척밸브', account: '상품', discountRate: 22.20, period: '2024-10-17 ~ 2024-11-15', isActive: false, remarks: '523-2024-010505' },
    { key: 3, type: 'A (프로모션)', itemCode: 'CAH304V', itemName: '감지식세척밸브(대소)', account: '상품', discountRate: 24.99, period: '2024-10-17 ~ 2024-11-15', isActive: false, remarks: '523-2024-010505' },
    { key: 4, type: 'B (특가)', itemCode: 'FT-1001', itemName: '600각 라임스톤', account: '제품', discountRate: 18.50, period: '2026-01-01 ~ 2026-03-31', isActive: true, remarks: '1분기 특가' },
    { key: 5, type: 'B (특가)', itemCode: 'WT-2001', itemName: '300×600 네추럴그레이', account: '제품', discountRate: 17.00, period: '2026-02-01 ~ 2026-02-28', isActive: false, remarks: '재고소진' },
];

// ─────────────────────────────────────────────────────────────
// 3. 거래처별 할인율
// ─────────────────────────────────────────────────────────────
const CLIENT_DISCOUNT_COLUMNS = [
    { title: '거래처코드', dataIndex: 'clientCode', width: 110, align: 'center' },
    { title: '거래처명', dataIndex: 'clientName', width: 180 },
    { title: '매출구간', dataIndex: 'bracket', width: 150 },
    { title: '최소금액', dataIndex: 'minAmount', width: 130, align: 'right', render: formatNum },
    { title: '최대금액', dataIndex: 'maxAmount', width: 130, align: 'right', render: formatNum },
    { title: '할인율(%)', dataIndex: 'discountRate', width: 100, align: 'right', render: (v) => `${v}%` },
    { title: '비고', dataIndex: 'remarks', ellipsis: true },
];

const CLIENT_DISCOUNT_DATA = [
    { key: 1, clientCode: '050182', clientName: '대동건재사 남원', bracket: '1,000백만원 초과', minAmount: 1000000000, maxAmount: 9999999999, discountRate: 21.42, remarks: '매출취약 지방소도시 거점대리점' },
    { key: 2, clientCode: '050182', clientName: '대동건재사 남원', bracket: '700백만원', minAmount: 700000000, maxAmount: 1000000000, discountRate: 21.00, remarks: '매출취약 지방소도시 거점대리점' },
    { key: 3, clientCode: '050291', clientName: '(주)한결세라믹스', bracket: '1,000백만원 초과', minAmount: 1000000000, maxAmount: 9999999999, discountRate: 22.00, remarks: '우수 대리점' },
    { key: 4, clientCode: '050291', clientName: '(주)한결세라믹스', bracket: '700백만원', minAmount: 700000000, maxAmount: 1000000000, discountRate: 21.50, remarks: '우수 대리점' },
    { key: 5, clientCode: '050345', clientName: '경남타일상사', bracket: '300백만원', minAmount: 300000000, maxAmount: 500000000, discountRate: 19.50, remarks: '' },
];

// ─────────────────────────────────────────────────────────────
// 4. 단납 현장관리 (임시)
// ─────────────────────────────────────────────────────────────
const SHORT_SITE_COLUMNS = [
    { title: 'No.', dataIndex: 'key', width: 60, align: 'center' },
    { title: '현장명', dataIndex: 'site', width: 160 },
    { title: '거래처', dataIndex: 'customer', width: 150 },
    { title: '납품기한', dataIndex: 'deadline', width: 120, align: 'center' },
    { title: '할인율', dataIndex: 'discount', width: 90, align: 'center' },
    {
        title: '상태', dataIndex: 'status', width: 90, align: 'center',
        render: (v) => {
            const color = v === '진행중' ? 'processing' : v === '완료' ? 'success' : 'default';
            return <Tag color={color}>{v}</Tag>;
        },
    },
];

const SHORT_SITE_DATA = [
    { key: 1, site: '현장 A', customer: '(주)대우건설', deadline: '2026-03-05', discount: '3%', status: '진행중' },
    { key: 2, site: '현장 B', customer: '한화건설', deadline: '2026-03-12', discount: '5%', status: '완료' },
    { key: 3, site: '현장 C', customer: '롯데건설', deadline: '2026-03-20', discount: '2%', status: '진행중' },
    { key: 4, site: '현장 D', customer: '현대엔지니어링', deadline: '2026-04-01', discount: '4%', status: '검토중' },
];

// ─────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────
export function DiscountPromotionPage() {
    const [activeTab, setActiveTab] = useState('1');

    const [filterValue, setFilterValue] = useState({
        // 단가표
        version: 'V02',
        // 프로모션
        itemSearch: '',
        dateFrom: '',
        dateTo: '',
        isActive: '',
        // 거래처별
        clientSearch: '',
        // 단납
        siteName: '',
    });

    const handleFilterChange = useCallback((id, value) => {
        setFilterValue((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handleReset = useCallback(() => {
        setFilterValue({
            version: 'V02', itemSearch: '', dateFrom: '', dateTo: '',
            isActive: '', clientSearch: '', siteName: '',
        });
    }, []);

    // 탭별 동적 필터 필드 (ListFilter 스펙)
    const filterFields = useMemo(() => {
        switch (activeTab) {
            case '1': // 단가표 관리
                return [
                    {
                        id: 'version', label: '버전 선택', type: 'select', width: 160, row: 0,
                        options: [{ label: 'V02 (현재)', value: 'V02' }, { label: 'V01 (과거)', value: 'V01' }],
                    },
                ];
            case '2': // 프로모션 관리
                return [
                    { id: 'itemSearch', label: '품목 검색', type: 'text', placeholder: '품목명 또는 코드', wide: true, row: 0 },
                    { id: 'dateRange', label: '적용기간', type: 'dateRange', fromKey: 'dateFrom', toKey: 'dateTo', row: 0 },
                    {
                        id: 'isActive', label: '사용여부', type: 'select', width: 100, row: 0,
                        options: [{ label: '전체', value: '' }, { label: 'YES', value: 'yes' }, { label: 'NO', value: 'no' }],
                    },
                ];
            case '3': // 거래처별 할인율
                return [
                    { id: 'clientSearch', label: '거래처 검색', type: 'text', placeholder: '거래처명 입력', wide: true, row: 0 },
                ];
            case '4': // 단납 현장관리
                return [
                    { id: 'siteName', label: '현장명', type: 'text', placeholder: '단납 현장명 입력', wide: true, row: 0 },
                ];
            default:
                return [];
        }
    }, [activeTab]);

    const tabItems = [
        {
            key: '1', label: '단가표 관리',
            children: (
                <Table
                    columns={PRICE_TABLE_COLUMNS}
                    dataSource={PRICE_TABLE_DATA}
                    bordered size="small" pagination={false}
                />
            ),
        },
        {
            key: '2', label: '프로모션 관리',
            children: (
                <Table
                    columns={PROMOTION_COLUMNS}
                    dataSource={PROMOTION_DATA}
                    bordered size="small" pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            ),
        },
        {
            key: '3', label: '거래처별 할인율',
            children: (
                <Table
                    columns={CLIENT_DISCOUNT_COLUMNS}
                    dataSource={CLIENT_DISCOUNT_DATA}
                    bordered size="small" pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                />
            ),
        },
        {
            key: '4', label: '단납 현장관리',
            children: (
                <Table
                    columns={SHORT_SITE_COLUMNS}
                    dataSource={SHORT_SITE_DATA}
                    bordered size="small" pagination={false}
                />
            ),
        },
    ];

    return (
        <PageShell path="/sales/support/discount-promotion">
            <ListFilter
                fields={filterFields}
                value={filterValue}
                onChange={handleFilterChange}
                onReset={handleReset}
                onSearch={() => {/* 조회 실행 */ }}
                searchLabel="조회"
            />

            <div style={{ marginTop: '12px' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => { setActiveTab(key); handleReset(); }}
                    items={tabItems}
                    type="card"
                />
            </div>
        </PageShell>
    );
}

export default DiscountPromotionPage;
