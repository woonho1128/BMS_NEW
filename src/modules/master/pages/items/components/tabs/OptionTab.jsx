import React from 'react';
import { Button, Table, Input, InputNumber, Switch, Tag, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export function OptionTab({ data, onChange }) {
    const handleAddGroup = () => {
        if (data.options.length >= 5) return;
        const newGroup = {
            id: Date.now(),
            name: `새 옵션그룹 ${data.options.length + 1}`,
            values: []
        };
        onChange('options', [...data.options, newGroup]);
    };

    const handleRemoveGroup = (groupId) => {
        onChange('options', data.options.filter(g => g.id !== groupId));
    };

    const handleGroupNameChange = (groupId, newName) => {
        const newOptions = data.options.map(g =>
            g.id === groupId ? { ...g, name: newName } : g
        );
        onChange('options', newOptions);
    };

    const handleAddValue = (groupId) => {
        const newOptions = data.options.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    values: [
                        ...g.values,
                        {
                            id: Date.now(),
                            name: '',
                            extraPrice: 0,
                            sku: '',
                            stock: 0,
                            active: true
                        }
                    ]
                };
            }
            return g;
        });
        onChange('options', newOptions);
    };

    const handleValueChange = (groupId, valueId, field, val) => {
        const newOptions = data.options.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    values: g.values.map(v =>
                        v.id === valueId ? { ...v, [field]: val } : v
                    )
                };
            }
            return g;
        });
        onChange('options', newOptions);
    };

    const handleRemoveValue = (groupId, valueId) => {
        const newOptions = data.options.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    values: g.values.filter(v => v.id !== valueId)
                };
            }
            return g;
        });
        onChange('options', newOptions);
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="section-label">옵션 그룹 관리 (최대 5개)</span>
                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={handleAddGroup}
                    disabled={data.options.length >= 5}
                >
                    옵션 그룹 추가
                </Button>
            </div>

            {data.options.map((group, index) => (
                <div key={group.id} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Input
                            value={group.name}
                            onChange={e => handleGroupNameChange(group.id, e.target.value)}
                            style={{ width: 200, fontWeight: 600 }}
                            placeholder="옵션 그룹명 (예: 색상)"
                        />
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveGroup(group.id)}
                        />
                    </div>

                    <Table
                        dataSource={group.values}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        bordered
                        columns={[
                            {
                                title: '옵션값',
                                dataIndex: 'name',
                                render: (text, record) => (
                                    <Input
                                        value={text}
                                        onChange={e => handleValueChange(group.id, record.id, 'name', e.target.value)}
                                        placeholder="옵션값 (예: 화이트)"
                                    />
                                )
                            },
                            {
                                title: '추가금액',
                                dataIndex: 'extraPrice',
                                width: 120,
                                render: (text, record) => (
                                    <InputNumber
                                        value={text}
                                        onChange={val => handleValueChange(group.id, record.id, 'extraPrice', val)}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        style={{ width: '100%' }}
                                    />
                                )
                            },
                            {
                                title: 'SKU',
                                dataIndex: 'sku',
                                render: (text, record) => (
                                    <Input
                                        value={text}
                                        onChange={e => handleValueChange(group.id, record.id, 'sku', e.target.value)}
                                        placeholder="관리코드"
                                    />
                                )
                            },
                            {
                                title: '재고',
                                dataIndex: 'stock',
                                width: 100,
                                render: (text, record) => (
                                    <InputNumber
                                        value={text}
                                        onChange={val => handleValueChange(group.id, record.id, 'stock', val)}
                                        style={{ width: '100%' }}
                                    />
                                )
                            },
                            {
                                title: '상태',
                                dataIndex: 'active',
                                width: 80,
                                align: 'center',
                                render: (active, record) => (
                                    <Switch
                                        size="small"
                                        checked={active}
                                        onChange={val => handleValueChange(group.id, record.id, 'active', val)}
                                    />
                                )
                            },
                            {
                                title: '',
                                width: 50,
                                align: 'center',
                                render: (_, record) => (
                                    <Button
                                        icon={<DeleteOutlined />}
                                        size="small"
                                        danger
                                        type="text"
                                        onClick={() => handleRemoveValue(group.id, record.id)}
                                    />
                                )
                            }
                        ]}
                        footer={() => (
                            <Button
                                type="dashed"
                                size="small"
                                icon={<PlusOutlined />}
                                block
                                onClick={() => handleAddValue(group.id)}
                            >
                                옵션값 추가
                            </Button>
                        )}
                    />
                </div>
            ))}

            {data.options.length === 0 && (
                <div style={{ textAlign: 'center', color: '#8c8c8c', padding: 40, background: '#fafafa', borderRadius: 8 }}>
                    등록된 옵션 그룹이 없습니다.
                </div>
            )}
        </div>
    );
}
