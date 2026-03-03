import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Empty, Modal, message } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { CartItem } from './components/CartItem';
import { OrderSummary } from './components/OrderSummary';
import { DealerInfoCard } from './components/DealerInfoCard';
import { ReceiverInfoCard } from './components/ReceiverInfoCard';
import './PartnerCartPage.css';

// Mock Data
const MOCK_CART_INITIAL = [
    {
        id: 1,
        brand: "대림테크",
        name: "프리미엄 양변기 상품",
        model: "MODEL-1001",
        price: 45000,
        quantity: 2,
        image: "https://placehold.co/80x80?text=Product+1"
    },
    {
        id: 2,
        brand: "삼성홈",
        name: "프리미엄 세면기 상품",
        model: "MODEL-2001",
        price: 60000,
        quantity: 1,
        image: "https://placehold.co/80x80?text=Product+2"
    },
    {
        id: 3,
        brand: "LG하우시스",
        name: "고급 욕실장 (수납형)",
        model: "MODEL-3005",
        price: 120000,
        quantity: 1,
        image: "https://placehold.co/80x80?text=Product+3"
    }
];

const DEALER_INFO = {
    name: "강남 행복한 욕실",
    bizNo: "123-45-67890",
    manager: "홍길동",
    phone: "010-1234-5678",
    email: "dealer@daelim.com",
    address: "서울시 강남구 테헤란로 123"
};

export function PartnerCartPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(MOCK_CART_INITIAL);

    // Request State
    const [requestNote, setRequestNote] = useState('');
    const [receiverInfo, setReceiverInfo] = useState({
        receiverName: '',
        receiverPhone: '',
        address: '',
        addressDetail: '',
        deliveryNote: '',
        isSameAsDealer: false
    });

    // Calculations
    const totalAmount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cartItems]);

    const totalQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    // Handlers
    const handleUpdateQty = (id, newQty) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
        ));
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: '상품 삭제',
            content: '장바구니에서 이 상품을 삭제하시겠습니까?',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk: () => {
                setCartItems(prev => prev.filter(item => item.id !== id));
            }
        });
    };

    const handleOrderRequest = () => {
        if (cartItems.length === 0) return;

        // Validation (Simple check)
        if (!receiverInfo.address) {
            message.error('배송 주소를 입력해주세요.');
            return;
        }

        // Generate Mock Order ID
        const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;

        // Navigate with Full State
        navigate(`/partner/order/detail/${orderId}`, {
            state: {
                items: cartItems,
                dealerInfo: DEALER_INFO,
                receiverInfo: receiverInfo,
                requestNote: requestNote,
                orderId: orderId,
                totalAmount: totalAmount,
                totalQuantity: totalQuantity, // Pass explicit total quantity
                orderDate: new Date().toISOString().split('T')[0]
            }
        });
    };

    return (
        <PageShell title="발주 요청 (장바구니)" path="/partner/order/cart">
            <div className="cart-page-container">

                <div className="cart-layout">
                    {/* Left Column */}
                    <div className="cart-left-col">

                        {/* 1. Dealer Info */}
                        <DealerInfoCard
                            dealerInfo={DEALER_INFO}
                            requestNote={requestNote}
                            onRequestNoteChange={setRequestNote}
                        />

                        {/* 2. Receiver Info */}
                        <ReceiverInfoCard
                            receiverInfo={receiverInfo}
                            onReceiverChange={setReceiverInfo}
                            dealerAddress={DEALER_INFO.address}
                        />

                        {/* 3. Cart Items */}
                        <div className="cart-list-section">
                            <div className="section-header">
                                <span className="section-title">장바구니 상품 ({cartItems.length})</span>
                            </div>

                            {cartItems.length > 0 ? (
                                <div className="cart-items-wrapper">
                                    {cartItems.map(item => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onUpdateQty={handleUpdateQty}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Empty
                                    description="장바구니에 담긴 상품이 없습니다."
                                    style={{ padding: '60px 0' }}
                                >
                                    <Button type="primary" onClick={() => navigate('/partner/order/product')}>
                                        상품 담으러 가기
                                    </Button>
                                </Empty>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Key change here to wrap sticky elements */}
                    {cartItems.length > 0 && (
                        <div className="cart-right-col-sticky">
                            <Button
                                type="dashed"
                                icon={<ArrowLeft size={16} />}
                                onClick={() => navigate(-1)}
                                block
                                style={{ marginBottom: 16, height: 40 }}
                            >
                                상품 더 담으러 가기
                            </Button>

                            <OrderSummary
                                totalAmount={totalAmount}
                                totalItems={cartItems.length}
                                totalQuantity={totalQuantity}
                                onAction={handleOrderRequest}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PageShell>
    );
}
