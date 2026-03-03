import React from 'react';
import { Button, Typography } from 'antd';
import { Trash2, Plus, Minus } from 'lucide-react';
import './CartItem.css';

const { Text } = Typography;

/**
 * CartItem Component
 * Row-style card for cart and order detail pages.
 * @param {Object} item - Product item data
 * @param {boolean} readOnly - If true, hides quantity controls and delete button
 * @param {Function} onUpdateQty - Callback for quantity change (id, newQty)
 * @param {Function} onDelete - Callback for item deletion (id)
 */
export function CartItem({ item, readOnly = false, onUpdateQty, onDelete }) {
    const { id, brand, name, model, price, quantity, image } = item;
    const totalAmount = price * quantity;

    return (
        <div className="cart-item-row">
            {/* Thumbnail */}
            <div className="cart-item-thumb">
                {image ? (
                    <img src={image} alt={name} />
                ) : (
                    <div className="cart-item-placeholder" />
                )}
            </div>

            {/* Product Info */}
            <div className="cart-item-info">
                <div className="cart-item-brand">{brand}</div>
                <div className="cart-item-name">{name}</div>
                <div className="cart-item-model">{model}</div>
            </div>

            {/* Unit Price */}
            <div className="cart-item-price-unit">
                {price.toLocaleString()} 원
            </div>

            {/* Quantity Control */}
            <div className="cart-item-qty">
                {readOnly ? (
                    <span className="cart-item-qty-readonly">{quantity} 개</span>
                ) : (
                    <div className="qty-control">
                        <button
                            className="qty-btn"
                            onClick={() => onUpdateQty(id, Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="qty-value">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={() => onUpdateQty(id, quantity + 1)}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Total Amount */}
            <div className="cart-item-amount">
                {totalAmount.toLocaleString()} 원
            </div>

            {/* Delete Button */}
            {!readOnly && (
                <div className="cart-item-action">
                    <button className="delete-btn" onClick={() => onDelete(id)}>
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
