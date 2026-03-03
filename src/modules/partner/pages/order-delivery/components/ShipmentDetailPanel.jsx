import React, { useState } from 'react';
import { Button, Table, Tag, Descriptions, Badge, Timeline, Card, Empty, Divider } from 'antd';
import { CarOutlined, PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { SHIPMENT_STATUS, DELIVERY_STATUS } from '../mockOrderData';
import './ShipmentDetailPanel.css';

export function ShipmentDetailPanel({ order, isAdmin, onRegisterClick }) {
    // Helper to get status info
    const getStatusInfo = (list, code) => list.find(s => s.code === code) || { label: code, color: 'default' };

    const itemColumns = [
        { title: '품목명', dataIndex: 'name' },
        { title: '발주수량', dataIndex: 'qty', align: 'right', render: v => v?.toLocaleString() },
        { title: '출고수량', dataIndex: 'shippedQty', align: 'right', render: (v, r) => <span style={{ color: v > 0 ? '#1890ff' : 'inherit' }}>{v?.toLocaleString()}</span> },
        {
            title: '잔여수량',
            align: 'right',
            render: (_, r) => {
                const remain = r.qty - r.shippedQty;
                return <span style={{ color: remain === 0 ? '#52c41a' : '#ff4d4f' }}>{remain.toLocaleString()}</span>;
            }
        },
        {
            title: '상태',
            align: 'center',
            render: (_, r) => {
                if (r.shippedQty === 0) return <Tag>대기</Tag>;
                if (r.shippedQty < r.qty) return <Tag color="orange">부분출고</Tag>;
                return <Tag color="green">완료</Tag>;
            }
        }
    ];

    const shipmentColumns = [
        { title: '출고일', dataIndex: 'date', width: 100 },
        { title: '출고번호', dataIndex: 'shipmentNo' },
        { title: '송장번호', dataIndex: 'trackingNo', render: v => <a href="#">{v}</a> }, // Mock Link
        { title: '택배사', dataIndex: 'carrier' },
        {
            title: '상태', dataIndex: 'status', render: v => {
                const info = getStatusInfo(DELIVERY_STATUS, v);
                return <Badge status={v === 'DELIVERED' ? 'success' : 'processing'} text={info.label} />;
            }
        },
    ];

    // Tracking Timeline Logic (Mock visual based on selected shipment)
    // For demo, just show timeline for the latest shipment or all? 
    // Requirement says "Click tracking no -> Timeline". 
    // Let's maximize simplification: Show timeline for the *latest* shipment by default or expandRow.
    // Given the split view, let's put timeline in a card below shipment history.

    // For now, take the first shipment to display tracking demo
    const activeShipment = order.shipments && order.shipments.length > 0 ? order.shipments[0] : null;

    return (
        <div className="ship-detail-wrapper">
            {/* Header */}
            <div className="ship-detail-header">
                <div>
                    <div className="detail-title">{order.orderNo}</div>
                    <div className="detail-sub">{order.dealer} | {order.orderDate}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {isAdmin && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={onRegisterClick}>
                            출고 등록
                        </Button>
                    )}
                </div>
            </div>

            <div className="ship-detail-content">
                {/* 1. Item Status */}
                <div className="section-block">
                    <div className="section-title">품목별 출고 현황</div>
                    <Table
                        dataSource={order.items}
                        columns={itemColumns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        bordered
                    />
                </div>

                <Divider />

                {/* 2. Shipment History */}
                <div className="section-block">
                    <div className="section-title">출고 이력 ({order.shipments.length}건)</div>
                    {order.shipments.length > 0 ? (
                        <Table
                            dataSource={order.shipments}
                            columns={shipmentColumns}
                            rowKey="shipmentNo"
                            pagination={false}
                            size="small"
                        />
                    ) : (
                        <Empty description="출고 이력이 없습니다." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                </div>

                {/* 3. Tracking Timeline (Conditional) */}
                {activeShipment && (
                    <div className="section-block" style={{ marginTop: 24, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                        <div className="section-title" style={{ marginBottom: 16 }}>
                            <CarOutlined /> 배송 추적 ({activeShipment.trackingNo} - {activeShipment.carrier})
                        </div>
                        <Timeline mode="left">
                            <Timeline.Item color="green" label={activeShipment.date}>
                                출고 완료 (물류센터 출고)
                            </Timeline.Item>
                            <Timeline.Item color={activeShipment.status !== 'READY' ? 'green' : 'gray'}>
                                터미널 간선 하차
                            </Timeline.Item>
                            <Timeline.Item color={activeShipment.status === 'IN_TRANSIT' ? 'blue' : (activeShipment.status === 'DELIVERED' ? 'green' : 'gray')} dot={<CarOutlined />}>
                                배송 출발 (배송기사 인수)
                            </Timeline.Item>
                            <Timeline.Item color={activeShipment.status === 'DELIVERED' ? 'green' : 'gray'} dot={<CheckCircleOutlined />}>
                                배송 완료
                            </Timeline.Item>
                        </Timeline>
                    </div>
                )}
            </div>
        </div>
    );
}
