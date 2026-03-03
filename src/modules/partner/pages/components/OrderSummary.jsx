import React from 'react';
import { Button, Typography, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './OrderSummary.css';

/**
 * OrderSummary Component
 * Sticky summary card for total calculation and action.
 * @param {Object} props
 * @param {number} props.totalAmount - Total price of items
 * @param {number} props.totalItems - Number of unique items
 * @param {number} props.totalQuantity - Total quantity of all items
 * @param {string} props.buttonText - Text for the main action button
 * @param {Function} props.onAction - Click handler for the action button
 * @param {boolean} props.readOnly - If true, hides the action button
 */
export function OrderSummary({
    totalAmount,
    totalItems,
    totalQuantity,
    buttonText = "발주 요청하기",
    onAction,
    readOnly = false
}) {
    const vat = Math.floor(totalAmount * 0.1);
    const finalTotal = totalAmount + vat;
    const expectedDate = dayjs().add(3, 'day').format('YYYY-MM-DD'); // Mock: 3 days later

    return (
        <div className="order-summary-card">
            <h3 className="summary-title">발주 요약</h3>

            <div className="summary-row">
                <span className="summary-label">총 상품 수</span>
                <span className="summary-value">{totalItems} 종</span>
            </div>
            <div className="summary-row">
                <span className="summary-label">총 수량</span>
                <span className="summary-value">{totalQuantity} 개</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
                <span className="summary-label">총 상품금액</span>
                <span className="summary-value">{totalAmount.toLocaleString()} 원</span>
            </div>

            <div className="summary-row">
                <span className="summary-label">부가세 (10%)</span>
                <span className="summary-value">{vat.toLocaleString()} 원</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total">
                <span className="summary-label total">총 합계</span>
                <span className="summary-value total">{finalTotal.toLocaleString()} 원</span>
            </div>

            <div className="summary-row small">
                <span className="summary-label small">예상 출고일</span>
                <span className="summary-value small">{expectedDate} (3~5일 소요)</span>
            </div>
            <div className="summary-row small">
                <span className="summary-label small">결제 조건</span>
                <span className="summary-value small">
                    월말 정산
                    <Tooltip title="매월 말일 세금계산서 발행 후 익월 10일 결제">
                        <InfoCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }} />
                    </Tooltip>
                </span>
            </div>

            {!readOnly && (
                <div className="summary-action">
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={onAction}
                        className="order-submit-btn"
                        style={{ height: '48px', fontSize: '16px', fontWeight: 'bold' }}
                    >
                        {buttonText}
                    </Button>
                </div>
            )}
        </div>
    );
}
