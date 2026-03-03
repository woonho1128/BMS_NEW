import React from 'react';
import { Tag, Empty } from 'antd';
import './ProductList.css';

export function ProductList({ products, selectedId, onSelect }) {
    if (!products || products.length === 0) {
        return (
            <div className="product-list-empty">
                <Empty description="등록된 품목이 없습니다." />
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'green';
            case 'INACTIVE': return 'default';
            case 'ERP_PENDING': return 'blue';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ACTIVE': return '판매중';
            case 'INACTIVE': return '판매중지';
            case 'ERP_PENDING': return '연동대기';
            default: return status;
        }
    };

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <div className="col-thumb">이미지</div>
                <div className="col-info">품목 정보</div>
                <div className="col-price">공급가</div>
                <div className="col-status">상태</div>
            </div>
            <div className="product-list-body">
                {products.map(product => (
                    <div
                        key={product.id}
                        className={`product-list-row ${selectedId === product.id ? 'selected' : ''}`}
                        onClick={() => onSelect(product.id)}
                    >
                        <div className="col-thumb">
                            <div className="thumb-placeholder">
                                {product.images?.main ? (
                                    <img src={product.images.main} alt={product.name} />
                                ) : (
                                    <span>No Img</span>
                                )}
                            </div>
                        </div>
                        <div className="col-info">
                            <div className="product-brand">{product.brand}</div>
                            <div className="product-name">{product.name}</div>
                            <div className="product-model">{product.model}</div>
                            {product.options?.length > 0 && (
                                <Tag className="option-count-tag">
                                    옵션 {product.options.length}개
                                </Tag>
                            )}
                        </div>
                        <div className="col-price">
                            {product.basePrice.toLocaleString()}원
                        </div>
                        <div className="col-status">
                            <Tag color={getStatusColor(product.status)} style={{ margin: 0 }}>
                                {getStatusLabel(product.status)}
                            </Tag>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
