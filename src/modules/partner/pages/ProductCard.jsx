import React from 'react';
import { Button, Tag } from 'antd';
import { Check } from 'lucide-react';
import styles from './ProductCard.module.css';

/**
 * ProductCard Component for B2B Portal
 * Strict DOM structure and typography as per requirements.
 */
export function ProductCard({
    product,
    quantity,
    onAdd
}) {
    const {
        name,
        modelCode,
        brand,
        status,
        dealerPrice,
        image,
        category
    } = product;

    const getStatusTag = (status) => {
        if (status === '판매중') return <Tag color="green" className={styles.statusTag}>판매중</Tag>;
        if (status === '일시품절') return <Tag color="orange" className={styles.statusTag}>일시품절</Tag>;
        return <Tag className={styles.statusTag}>{status}</Tag>;
    };

    return (
        <div className={styles.card}>
            {/* (1) .thumbWrap (이미지 영역) */}
            <div className={styles.thumbWrap}>
                {image ? (
                    <img src={image} alt={name} />
                ) : (
                    <div className={styles.thumbPlaceholder}>No Image</div>
                )}

                {/* .badgeRow (Overlay) */}
                <div className={styles.badgeRow}>
                    <span className={styles.categoryPill}>{category || '기타'}</span>
                    {getStatusTag(status)}
                </div>
            </div>

            {/* (2) .body (본문) */}
            <div className={styles.body}>
                <div className={styles.meta}>
                    {brand && <span className={styles.brand}>{brand}</span>}
                    <h3 className={styles.title}>{name}</h3>
                    <span className={styles.model}>{modelCode}</span>
                </div>

                <div className={styles.divider} />

                {/* .priceGrid (가격 표 영역) */}
                <div className={styles.priceGrid}>
                    <div className={styles.priceRow}>
                        <span className={styles.priceLabel}>대리점 공급가</span>
                        <span className={styles.priceValue}>
                            {dealerPrice.toLocaleString()} 원
                        </span>
                    </div>
                </div>
            </div>

            {/* (3) .footer (하단 액션) */}
            <div className={styles.footer}>
                <Button
                    type={quantity > 0 ? "primary" : "default"}
                    fullWidth
                    className={styles.cartButton}
                    onClick={() => onAdd(product.id, 1)}
                    icon={quantity > 0 ? <Check size={14} /> : null}
                >
                    {quantity > 0 ? `담기 완료 (${quantity})` : '장바구니 담기'}
                </Button>
            </div>
        </div>
    );
}
