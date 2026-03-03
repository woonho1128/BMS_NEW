import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Result } from 'antd';
import { CheckCircle, Printer } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import './PartnerOrderDetailPage.css';

export function PartnerOrderDetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = useParams();

    // Fallback Mock Data
    const stateData = location.state || {
        items: [],
        dealerInfo: { name: '-', bizNo: '-', manager: '-', phone: '-', email: '-' },
        receiverInfo: { receiverName: '-', receiverPhone: '-', address: '-', addressDetail: '', deliveryNote: '' },
        requestNote: '',
        totalAmount: 0,
        totalQuantity: 0,
        orderDate: new Date().toISOString().split('T')[0]
    };

    const { items, dealerInfo, receiverInfo, requestNote, totalAmount, totalQuantity, orderDate } = stateData;
    const vat = Math.floor(totalAmount * 0.1);
    const finalTotal = totalAmount + vat;

    if (!location.state) {
        return (
            <PageShell>
                <Result
                    status="404"
                    title="주문 정보를 찾을 수 없습니다"
                    subTitle="올바르지 않은 접근입니다."
                    extra={<Button type="primary" onClick={() => navigate('/partner/order/list')}>목록으로</Button>}
                />
            </PageShell>
        );
    }

    return (
        <PageShell title="발주 상세 내역" path="/partner/order/detail">
            <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>

                {/* 1. Inline Success Banner */}
                <div className="order-success-banner">
                    <CheckCircle size={20} color="#1e7e34" />
                    <span>발주 요청이 성공적으로 접수되었습니다.</span>
                </div>

                {/* 2. Meta Info Line */}
                <div className="order-meta-info">
                    <div className="meta-item">
                        <span className="meta-label">발주번호</span>
                        <span className="meta-value">{orderId}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label">요청일자</span>
                        <span className="meta-value">{orderDate}</span>
                    </div>
                    <div className="status-badge">요청완료</div>

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <Button onClick={() => navigate('/partner/order/list')}>목록으로</Button>
                        <Button icon={<Printer size={16} />}>발주서 인쇄</Button>
                    </div>
                </div>

                {/* 3. Unified Order Card */}
                <div className="unified-order-card">

                    {/* Section 1: Info Grid - Modified to Single Column (Receiver Info Only) */}
                    <div className="info-section-grid" style={{ gridTemplateColumns: '1fr' }}>

                        {/* Right: Receiver Info (Now Full Width) */}
                        <div>
                            <div className="info-column-header">수령 정보</div>
                            <div className="receiver-info-grid">
                                <div className="receiver-info-item">
                                    <span className="field-label">수령인</span>
                                    <span className="field-value">{receiverInfo.receiverName}</span>
                                </div>
                                <div className="receiver-info-item">
                                    <span className="field-label">연락처</span>
                                    <span className="field-value">{receiverInfo.receiverPhone}</span>
                                </div>
                                <div className="receiver-info-item">
                                    <span className="field-label">배송 주소</span>
                                    <span className="field-value">
                                        {receiverInfo.address} {receiverInfo.addressDetail}
                                    </span>
                                </div>
                                <div className="receiver-info-item">
                                    <span className="field-label">배송 요청사항</span>
                                    <span className="field-value">{receiverInfo.deliveryNote || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-section-title">주문 품목 리스트</div>

                    {/* Section 2: Item List */}
                    <div className="item-list-section">
                        {items.map(item => (
                            <div key={item.id} className="readonly-item-row">
                                <img src={item.image} alt={item.name} className="item-thumb" />
                                <div className="item-info">
                                    <div className="item-brand">{item.brand}</div>
                                    <div className="item-name">{item.name}</div>
                                    <div className="item-model">{item.model}</div>
                                </div>
                                <div className="item-qty-price">
                                    <span className="item-price-unit">
                                        {item.price.toLocaleString()}원 × {item.quantity}개
                                    </span>
                                    <span className="item-total">
                                        {(item.price * item.quantity).toLocaleString()}원
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Section 3: Summary */}
                    <div className="summary-section-bottom">
                        <div className="summary-box">
                            <div className="summary-line">
                                <span className="label-text">총 상품 수</span>
                                <span className="value-text">{items.length} 종</span>
                            </div>
                            <div className="summary-line">
                                <span className="label-text">총 수량</span>
                                <span className="value-text">{totalQuantity || items.reduce((acc, cur) => acc + cur.quantity, 0)} 개</span>
                            </div>
                            <div className="summary-line">
                                <span className="label-text">총 상품금액</span>
                                <span className="value-text">{totalAmount.toLocaleString()} 원</span>
                            </div>
                            <div className="summary-line">
                                <span className="label-text">부가세 (10%)</span>
                                <span className="value-text">{vat.toLocaleString()} 원</span>
                            </div>
                            <div className="summary-line total">
                                <span className="label-total">총 합계</span>
                                <span className="value-total">{finalTotal.toLocaleString()} 원</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageShell>
    );
}
