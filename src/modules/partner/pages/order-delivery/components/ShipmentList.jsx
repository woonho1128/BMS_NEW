import React from 'react';
import { Table, Tag, Progress, Empty } from 'antd';
import { SHIPMENT_STATUS, DELIVERY_STATUS } from '../mockOrderData';
import './ShipmentList.css';

export function ShipmentList({ orders, selectedOrderNo, onSelect }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="shipment-list-empty">
                <Empty description="발주 내역이 없습니다." />
            </div>
        );
    }

    const columns = [
        {
            title: '발주번호',
            dataIndex: 'orderNo',
            width: 130,
            render: text => <span style={{ fontWeight: 600 }}>{text}</span>
        },
        {
            title: '발주일',
            dataIndex: 'orderDate',
            width: 100,
            render: date => <span style={{ fontSize: 12, color: '#666' }}>{date}</span>
        },
        {
            title: '대리점',
            dataIndex: 'dealer',
            ellipsis: true,
        },
        {
            title: '총금액',
            dataIndex: 'totalAmount',
            width: 100,
            align: 'right',
            render: val => val?.toLocaleString(),
        },
        {
            title: '상태',
            width: 140,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                    <StatusTag code={record.shipmentStatus} list={SHIPMENT_STATUS} />
                    {record.shipmentStatus !== 'WAIT' && (
                        <StatusTag code={record.deliveryStatus} list={DELIVERY_STATUS} />
                    )}
                </div>
            )
        },
        {
            title: '출고완료율',
            width: 120,
            render: (_, record) => {
                const totalQty = record.items.reduce((sum, i) => sum + i.qty, 0);
                const shippedQty = record.items.reduce((sum, i) => sum + i.shippedQty, 0);
                const percent = totalQty > 0 ? Math.round((shippedQty / totalQty) * 100) : 0;

                return (
                    <div style={{ paddingRight: 8 }}>
                        <Progress percent={percent} size="small" status={percent === 100 ? 'success' : 'active'} />
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                            {shippedQty} / {totalQty} 품목
                        </div>
                    </div>
                );
            }
        }
    ];

    return (
        <div className="shipment-list-wrapper">
            <Table
                dataSource={orders}
                columns={columns}
                rowKey="orderNo"
                pagination={false}
                size="small"
                onRow={(record) => ({
                    onClick: () => onSelect(record.orderNo),
                    className: `shipment-list-row ${selectedOrderNo === record.orderNo ? 'selected' : ''}`
                })}
                scroll={{ y: 'calc(100vh - 250px)' }}
            />
        </div>
    );
}

// Small helper for status tags
function StatusTag({ code, list }) {
    const info = list.find(s => s.code === code) || { label: code, color: 'default' };
    return <span className={`ant-tag ant-tag-${info.color}`} style={{ margin: 0, fontSize: 11 }}>{info.label}</span>;
}
