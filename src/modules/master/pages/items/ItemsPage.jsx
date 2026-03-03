import React, { useState } from 'react';
import { Button, Input, Select, Tag, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { PageShell } from '../../../../shared/components/PageShell/PageShell';
import { ProductList } from './components/ProductList';
import { ProductDetailPanel } from './components/ProductDetailPanel';
import { MOCK_PRODUCTS } from './mockData';
import './ItemsPage.css';

export function ItemsPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [selectedId, setSelectedId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Filter States
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleSelectProduct = (id) => {
    // Warning if unsaved changes? (To be implemented)
    setSelectedId(id);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedId(null);
    setIsCreating(true);
  };

  const handleSave = (productData) => {
    if (productData.id) {
      // Update existing
      setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
      message.success('품목 정보가 수정되었습니다.');
    } else {
      // Create new
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct = { ...productData, id: newId };
      setProducts(prev => [newProduct, ...prev]);
      setSelectedId(newId);
      setIsCreating(false);
      message.success('새 품목이 등록되었습니다.');
    }
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    message.success('품목이 삭제되었습니다.');
  };

  const selectedProduct = isCreating
    ? { id: null, name: '', status: 'ACTIVE', options: [], pricingPolicy: { gradeDiscounts: [], volumeDiscounts: [] }, specs: [], images: { main: null, sub: [] } }
    : products.find(p => p.id === selectedId);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.includes(searchText) || p.model.includes(searchText);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageShell title="품목 마스터 관리" path="/master/items">
      <div className="items-page-container">

        {/* Filter Header */}
        <div className="items-filter-bar">
          <div className="filter-group">
            <Input
              placeholder="품목명 / 모델명 검색"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Select
              defaultValue="ALL"
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'ALL', label: '전체 상태' },
                { value: 'ACTIVE', label: '판매중' },
                { value: 'INACTIVE', label: '판매중지' },
                { value: 'ERP_PENDING', label: 'ERP연동대기' },
              ]}
            />
            <Select defaultValue="ALL" style={{ width: 120 }} options={[{ value: 'ALL', label: '전체 브랜드' }]} disabled />
            <Select defaultValue="ALL" style={{ width: 120 }} options={[{ value: 'ALL', label: '전체 카테고리' }]} disabled />
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNew}>
            품목 등록
          </Button>
        </div>

        {/* Main Content Split View */}
        <div className="items-content-split">
          {/* Left: Product List */}
          <div className="content-left-panel">
            <ProductList
              products={filteredProducts}
              selectedId={selectedId}
              onSelect={handleSelectProduct}
            />
          </div>

          {/* Right: Product Detail Panel */}
          <div className="content-right-panel">
            {selectedId || isCreating ? (
              <ProductDetailPanel
                initialData={selectedProduct}
                onSave={handleSave}
                onDelete={handleDelete}
                isCreating={isCreating}
                key={selectedId || 'new'} // Refresh on select change
              />
            ) : (
              <div className="empty-selection-placeholder">
                <div className="placeholder-text">좌측 목록에서 품목을 선택하거나<br />새 품목을 등록해주세요.</div>
              </div>
            )}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
