import React, { useState, useMemo } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Row, Col, Typography, Input, Select, Button, Card, Space, Empty } from 'antd';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import './PartnerProductOrderPage.css';

const { Title, Text } = Typography;

// Mock Data - B2B SCM Realistic Categories
const MOCK_CATEGORIES = [
    '전체',
    '신제품',
    '비데',
    '양변기',
    '세면기',
    '소변기',
    '수전금구',
    '액세서리',
    '욕실장'
];

const MOCK_BRANDS = ['프리미엄', '한양자재', '대일테크', '삼성홈', 'LG하우시스'];
const MOCK_STATUSES = ['판매중', '단종', '일시품절'];
const MOCK_PRICES = ['전체', '10만원 이하', '10~50만원', '50~100만원', '100만원 이상'];

const MOCK_PRODUCTS = Array.from({ length: 45 }).map((_, i) => {
    const dealerPrice = (i + 1) * 15000;
    return {
        id: `prod_${i}`,
        name: `프리미엄 ${MOCK_CATEGORIES[1 + (i % (MOCK_CATEGORIES.length - 1))]} 상품 ${i + 1}`,
        modelCode: `MODEL-${1000 + i}`,
        category: MOCK_CATEGORIES[1 + (i % (MOCK_CATEGORIES.length - 1))],
        brand: MOCK_BRANDS[i % MOCK_BRANDS.length],
        status: i % 10 === 0 ? '일시품절' : i % 15 === 0 ? '단종' : '판매중',
        factoryPrice: Math.floor(dealerPrice * 1.2),
        dealerPrice: dealerPrice,
        consumerPrice: Math.floor(dealerPrice * 1.5),
        unit: 'BOX',
        image: `https://placehold.co/300x200?text=Product+${i + 1}`,
        tag: ['하부', '탱크', '부속', '후렌지'][i % 4]
    };
});

export function PartnerProductOrderPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [cart, setCart] = useState({}); // { prodId: qty }
    const pageSize = 12;

    // Advanced Filter States
    const [filters, setFilters] = useState({
        category: '전체',
        brand: '전체',
        priceRange: '전체',
        status: '전체'
    });
    const [sortBy, setSortBy] = useState('newest');

    // Filter & Search Logic
    const filteredProducts = useMemo(() => {
        let result = MOCK_PRODUCTS.filter((p) => {
            const matchCat = filters.category === '전체' || p.category === filters.category;
            const matchBrand = filters.brand === '전체' || p.brand === filters.brand;
            const matchStatus = filters.status === '전체' || p.status === filters.status;
            const matchSearch = p.name.includes(searchTerm) || p.modelCode.includes(searchTerm.toUpperCase());

            let matchPrice = true;
            if (filters.priceRange === '10만원 이하') matchPrice = p.dealerPrice <= 100000;
            else if (filters.priceRange === '10~50만원') matchPrice = p.dealerPrice > 100000 && p.dealerPrice <= 500000;
            else if (filters.priceRange === '50~100만원') matchPrice = p.dealerPrice > 500000 && p.dealerPrice <= 1000000;
            else if (filters.priceRange === '100만원 이상') matchPrice = p.dealerPrice > 1000000;

            return matchCat && matchBrand && matchStatus && matchSearch && matchPrice;
        });

        // Sorting
        if (sortBy === 'price_asc') result.sort((a, b) => a.dealerPrice - b.dealerPrice);
        else if (sortBy === 'price_desc') result.sort((a, b) => b.dealerPrice - a.dealerPrice);

        return result;
    }, [filters, searchTerm, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const currentProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

    const handleQtyChange = (id, delta) => {
        setCart((prev) => {
            const currentQty = prev[id] || 0;
            const nextQty = Math.max(0, currentQty + delta);
            if (nextQty === 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: nextQty };
        });
    };

    const totalCartItems = Object.values(cart).reduce((sum, q) => sum + q, 0);

    return (
        <PageShell path="/partner/order/product" title="" className="!pt-0">
            <div className="flex flex-col bg-gray-50 text-gray-900 pb-12 font-sans relative">

                {/* ==================== [1] SEARCH BAR SECTION ==================== */}
                <div className="px-8 pt-4 pb-2">
                    <Card
                        variant="borderless"
                        className="section-card"
                        styles={{ body: { padding: '20px', marginTop: '10px' } }}
                        style={{ marginBottom: 16 }}
                    >
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Title level={4} style={{ margin: 0 }}>
                                    상품 조회 / 발주 등록
                                </Title>
                            </Col>

                            <Col>
                                <Input.Search
                                    placeholder="상품명 또는 모델명으로 검색"
                                    allowClear
                                    enterButton="검색"
                                    size="middle"
                                    style={{ width: 380 }}
                                    value={searchTerm}
                                    onSearch={() => setPage(1)}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* ==================== [2] FILTER CONTROLS SECTION ==================== */}
                    <Card
                        variant="borderless"
                        className="section-card"
                        styles={{ body: { padding: 16 } }}
                        style={{ marginBottom: 16, background: '#fafafa' }}
                    >
                        <Row justify="space-between" align="middle" wrap>
                            <Col>
                                <Space size={12} wrap>
                                    <Select
                                        placeholder="카테고리"
                                        style={{ width: 160 }}
                                        allowClear
                                        value={filters.category === '전체' ? undefined : filters.category}
                                        onChange={(value) => {
                                            setFilters(prev => ({ ...prev, category: value || '전체' }));
                                            setPage(1);
                                        }}
                                    >
                                        {MOCK_CATEGORIES.filter(c => c !== '전체').map(cat => (
                                            <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                                        ))}
                                    </Select>

                                    <Select
                                        placeholder="브랜드"
                                        style={{ width: 160 }}
                                        allowClear
                                        value={filters.brand === '전체' ? undefined : filters.brand}
                                        onChange={(value) => {
                                            setFilters(prev => ({ ...prev, brand: value || '전체' }));
                                            setPage(1);
                                        }}
                                    >
                                        {MOCK_BRANDS.map(b => (
                                            <Select.Option key={b} value={b}>{b}</Select.Option>
                                        ))}
                                    </Select>

                                    <Select
                                        placeholder="가격대"
                                        style={{ width: 160 }}
                                        allowClear
                                        value={filters.priceRange === '전체' ? undefined : filters.priceRange}
                                        onChange={(value) => {
                                            setFilters(prev => ({ ...prev, priceRange: value || '전체' }));
                                            setPage(1);
                                        }}
                                    >
                                        {MOCK_PRICES.filter(p => p !== '전체').map(p => (
                                            <Select.Option key={p} value={p}>{p}</Select.Option>
                                        ))}
                                    </Select>

                                    <Select
                                        placeholder="상태"
                                        style={{ width: 160 }}
                                        allowClear
                                        value={filters.status === '전체' ? undefined : filters.status}
                                        onChange={(value) => {
                                            setFilters(prev => ({ ...prev, status: value || '전체' }));
                                            setPage(1);
                                        }}
                                    >
                                        {MOCK_STATUSES.map(s => (
                                            <Select.Option key={s} value={s}>{s}</Select.Option>
                                        ))}
                                    </Select>
                                </Space>
                            </Col>

                            <Col>
                                {(searchTerm || Object.values(filters).some(v => v !== '전체')) && (
                                    <Button
                                        type="link"
                                        onClick={() => {
                                            setFilters({ category: '전체', brand: '전체', priceRange: '전체', status: '전체' });
                                            setSearchTerm('');
                                            setPage(1);
                                        }}
                                    >
                                        필터 초기화
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Card>

                    {/* ==================== [3] RESULT SUMMARY SECTION ==================== */}
                    <Row
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: 20 }}
                    >
                        <Col>
                            <Text style={{ fontSize: 14 }}>
                                검색 결과
                            </Text>
                            <Text strong style={{ fontSize: 15, marginLeft: 6 }}>
                                총 {filteredProducts.length}건
                            </Text>
                        </Col>

                        <Col>
                            <Select
                                style={{ width: 140 }}
                                value={sortBy}
                                onChange={setSortBy}
                            >
                                <Select.Option value="newest">최신순</Select.Option>
                                <Select.Option value="price_asc">가격 낮은순</Select.Option>
                                <Select.Option value="price_desc">가격 높은순</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </div>

                <div className="max-w-[1600px] mx-auto w-full p-8 pt-6">

                    {/* Product Grid */}
                    {currentProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {currentProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    quantity={cart[p.id] || 0}
                                    onAdd={handleQtyChange}
                                />
                            ))}
                        </div>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            styles={{ image: { height: 60 } }}
                            description={
                                <Space orientation="vertical" size={4}>
                                    <Text>검색 결과가 없습니다</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        다른 조건으로 검색해보세요
                                    </Text>
                                </Space>
                            }
                        >
                            {(searchTerm || Object.values(filters).some(v => v !== '전체')) && (
                                <Button onClick={() => {
                                    setFilters({ category: '전체', brand: '전체', priceRange: '전체', status: '전체' });
                                    setSearchTerm('');
                                    setPage(1);
                                }}>
                                    필터 초기화
                                </Button>
                            )}
                        </Empty>
                    )}
                </div>      {/* Pagination */}
                {totalPages > 0 && (
                    <div className="flex justify-center items-center gap-2 py-12 mt-4" style={{ paddingTop: '20px' }}>
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-9 h-9 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1A4B84] hover:text-[#1A4B84] transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="px-3 h-9 bg-white rounded flex items-center justify-center border border-gray-200 min-w-[3rem]">
                            <span className="text-base font-bold text-gray-900">
                                <span className="text-[#1A4B84]">{page}</span>
                                <span className="text-gray-300 mx-1">/</span>
                                {totalPages}
                            </span>
                        </div>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-9 h-9 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#1A4B84] hover:text-[#1A4B84] transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Floating Cart Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    className="w-16 h-16 bg-[#1A4B84] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(26,75,132,0.4)] hover:scale-105 hover:shadow-[0_8px_30px_rgba(26,75,132,0.5)] transition-all duration-300 border-2 border-white active:scale-95 group relative"
                >
                    <ShoppingCart size={28} />
                    {totalCartItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                            {totalCartItems}
                        </span>
                    )}
                </button>
            </div>

        </PageShell >
    );
}
