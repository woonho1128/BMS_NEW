import React from 'react';
import { Table, Tag, Empty } from 'antd';
import { STATUS_CODES } from '../mockCostData';
import './CostList.css';

export function CostList({ costs, selectedId, onSelect }) {
    if (!costs || costs.length === 0) {
        return (
            <div className="cost-list-empty">
                <Empty description="등록된 표준원가가 없습니다." />
            </div>
        );
    }

    const getStatusInfo = (code) => {
        return STATUS_CODES.find(s => s.code === code) || { label: code, color: 'default' };
    };

    const columns = [
        {
            title: '상태',
            dataIndex: 'status',
            width: 90,
            align: 'center',
            render: (status) => {
                const info = getStatusInfo(status);
                return <Tag color={info.color} style={{ margin: 0 }}>{info.label}</Tag>;
            }
        },
        {
            title: '프로젝트',
            dataIndex: 'project',
            width: 140,
            ellipsis: true,
        },
        {
            title: '품번',
            dataIndex: 'partNo',
            width: 100,
            render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
        },
        {
            title: '품명',
            dataIndex: 'name',
            ellipsis: true,
        },
        {
            title: '공장도가',
            dataIndex: 'factoryPrice',
            width: 90,
            align: 'right',
            render: val => val?.toLocaleString(),
        },
        {
            title: '표준원가',
            dataIndex: 'factoryPrice', // Need calculation logic here if not stored. Mock stores parts.
            // Actually Mock doesn't preserve "standardCost" field directly in array for list?
            // Let's assume on-the-fly calc or just show factoryPrice for now, 
            // OR simply calculate it: (Factory + Factory*Rate + Logistics)
            // But for list permormance, usually it is stored. 
            // Use render to calc on fly for mock.
            width: 90,
            align: 'right',
            render: (_, record) => {
                const other = Math.floor(record.factoryPrice * record.otherRate / 100);
                const total = record.factoryPrice + other + record.logisticsCost;
                return total.toLocaleString();
            }
        },
        {
            title: '수정일',
            dataIndex: 'modifyDate',
            width: 100,
            align: 'center',
            render: date => <span style={{ fontSize: 12, color: '#888' }}>{date}</span>
        },
    ];

    return (
        <div className="cost-list-wrapper">
            <Table
                dataSource={costs}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
                onRow={(record) => ({
                    onClick: () => onSelect(record.id),
                    className: `cost-list-row ${selectedId === record.id ? 'selected' : ''}`
                })}
                scroll={{ y: 'calc(100vh - 250px)' }}
            />
        </div>
    );
}
