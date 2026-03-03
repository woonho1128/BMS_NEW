import React, { useState, useMemo } from 'react';
import { Button, Input, DatePicker, Select, Switch, message, notification } from 'antd';
import { SearchOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageShell } from '../../../../shared/components/PageShell/PageShell';
import { ShipmentList } from './components/ShipmentList';
import { ShipmentDetailPanel } from './components/ShipmentDetailPanel';
import { ShipmentRegisterModal } from './components/ShipmentRegisterModal';
import { MOCK_ORDERS } from './mockOrderData';
import './PartnerOrderDeliveryPage.css';

const { RangePicker } = DatePicker;

export function PartnerOrderDeliveryPage() {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [selectedOrderNo, setSelectedOrderNo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // Mock Admin Toggle
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    // Filter States
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const handleSelectRow = (orderNo) => {
        setSelectedOrderNo(orderNo);
    };

    const handleRegisterShipment = (shipmentData) => {
        // Mock Implementation
        const { orderNo, trackingNo, carrier, items, date } = shipmentData;

        setOrders(prev => prev.map(order => {
            if (order.orderNo !== orderNo) return order;

            // 1. Create New Shipment Record
            const newShipment = {
                shipmentNo: `SHP-${Math.floor(Math.random() * 10000)}`,
                date: date,
                trackingNo: trackingNo,
                carrier: carrier,
                status: 'READY',
                items: items.map(i => ({ name: i.name, qty: i.qty })) // Snapshot
            };

            // 2. Update Item Shipped Qty
            const updatedItems = order.items.map(orderItem => {
                const shippedItem = items.find(i => i.id === orderItem.id);
                if (shippedItem) {
                    return { ...orderItem, shippedQty: orderItem.shippedQty + shippedItem.qty };
                }
                return orderItem;
            });

            // 3. Recalculate Order Status
            const totalOrdered = updatedItems.reduce((sum, i) => sum + i.qty, 0);
            const totalShipped = updatedItems.reduce((sum, i) => sum + i.shippedQty, 0);

            let newStatus = 'WAIT';
            if (totalShipped > 0 && totalShipped < totalOrdered) newStatus = 'PARTIAL';
            if (totalShipped === totalOrdered) newStatus = 'SHIPPED';

            return {
                ...order,
                items: updatedItems,
                shipments: [newShipment, ...order.shipments],
                shipmentStatus: newStatus,
                deliveryStatus: 'READY' // Reset to ready on new shipment
            };
        }));

        setIsRegisterModalOpen(false);
        notification.success({
            message: '출고 등록 완료',
            description: `송장번호 ${trackingNo}로 출고가 등록되었습니다.`
        });
    };

    const selectedOrder = orders.find(o => o.orderNo === selectedOrderNo);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch = o.orderNo.includes(searchText) || o.shipments.some(s => s.trackingNo.includes(searchText));
            const matchesStatus = statusFilter === 'ALL' || o.shipmentStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchText, statusFilter]);

    return (
        <PageShell title="출고 / 배송 조회" path="/partner/order/delivery">
            <div className="pod-container">
                {/* Top Filter Bar */}
                <div className="pod-filter-bar">
                    <div className="filter-group">
                        <Select defaultValue="ALL" style={{ width: 140 }} options={[{ value: 'ALL', label: '전체 프로젝트' }]} />
                        <RangePicker style={{ width: 240 }} />
                        <Select
                            defaultValue="ALL"
                            style={{ width: 120 }}
                            onChange={setStatusFilter}
                            options={[
                                { value: 'ALL', label: '전체 상태' },
                                { value: 'WAIT', label: '출고대기' },
                                { value: 'PARTIAL', label: '부분출고' },
                                { value: 'SHIPPED', label: '출고완료' },
                            ]}
                        />
                        <Input
                            placeholder="발주번호 / 송장번호"
                            prefix={<SearchOutlined />}
                            style={{ width: 220 }}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="action-group" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* Mock Admin Toggle */}
                        <div style={{ marginRight: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#666' }}>
                            관리자 모드: <Switch checked={isAdmin} onChange={setIsAdmin} size="small" />
                        </div>

                        <Button icon={<ReloadOutlined />}>초기화</Button>
                        <Button icon={<DownloadOutlined />}>엑셀 다운로드</Button>
                    </div>
                </div>

                {/* Split View */}
                <div className="pod-split">
                    <div className="split-left">
                        <ShipmentList
                            orders={filteredOrders}
                            selectedOrderNo={selectedOrderNo}
                            onSelect={handleSelectRow}
                        />
                    </div>
                    <div className="split-right">
                        {selectedOrder ? (
                            <ShipmentDetailPanel
                                order={selectedOrder}
                                isAdmin={isAdmin}
                                onRegisterClick={() => setIsRegisterModalOpen(true)}
                            />
                        ) : (
                            <div className="empty-placeholder">
                                좌측 목록에서 발주 건을 선택해주세요.
                            </div>
                        )}
                    </div>
                </div>

                <ShipmentRegisterModal
                    open={isRegisterModalOpen}
                    onClose={() => setIsRegisterModalOpen(false)}
                    order={selectedOrder}
                    onConfirm={handleRegisterShipment}
                />
            </div>
        </PageShell>
    );
}
