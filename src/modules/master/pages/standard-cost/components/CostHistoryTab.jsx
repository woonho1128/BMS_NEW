import React from 'react';
import { Table, Empty } from 'antd';

export function CostHistoryTab({ history }) {
    if (!history || history.length === 0) {
        return (
            <div style={{ padding: 40, textAlign: 'center' }}>
                <Empty description="수정 이력이 없습니다." />
            </div>
        );
    }

    const columns = [
        {
            title: '수정일',
            dataIndex: 'date',
            width: 120,
        },
        {
            title: '수정자',
            dataIndex: 'user',
            width: 100,
        },
        {
            title: '변경항목',
            dataIndex: 'field',
            width: 150,
        },
        {
            title: '이전값',
            dataIndex: 'prev',
            render: val => <span style={{ color: '#999', textDecoration: 'line-through' }}>{val}</span>
        },
        {
            title: '변경값',
            dataIndex: 'next',
            render: val => <span style={{ color: '#1890ff', fontWeight: 600 }}>{val}</span>
        },
    ];

    return (
        <Table
            dataSource={history}
            columns={columns}
            rowKey={(r, i) => i}
            pagination={false}
            size="small"
            bordered
        />
    );
}
