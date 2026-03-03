import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Table, InputNumber, Badge, message } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

export function ShipmentRegisterModal({ open, onClose, order, onConfirm }) {
    const [form] = Form.useForm();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (open && order) {
            form.resetFields();
            form.setFieldsValue({
                date: dayjs(),
                carrier: 'CJ대한통운'
            });

            // Prepare items with current status
            const initialItems = order.items.map(item => ({
                id: item.id,
                name: item.name,
                qty: item.qty, // Total ordered
                shippedQty: item.shippedQty, // Already shipped
                remainQty: item.qty - item.shippedQty, // Max shippable now
                inputQty: item.qty - item.shippedQty // Default to remaining
            }));
            setItems(initialItems);
        }
    }, [open, order, form]);

    const handleQtyChange = (id, value) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, inputQty: value } : item
        ));
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            // Validate quantities
            const shippingItems = items.filter(i => i.inputQty > 0);

            if (shippingItems.length === 0) {
                message.error('출고할 품목과 수량을 입력해주세요.');
                return;
            }

            const payload = {
                orderNo: order.orderNo,
                date: values.date.format('YYYY-MM-DD'),
                trackingNo: values.trackingNo,
                carrier: values.carrier,
                items: shippingItems.map(i => ({
                    id: i.id,
                    name: i.name,
                    qty: i.inputQty
                }))
            };

            onConfirm(payload);
        });
    };

    const columns = [
        { title: '품목명', dataIndex: 'name' },
        { title: '발주수량', dataIndex: 'qty', width: 80, align: 'right' },
        { title: '기출고', dataIndex: 'shippedQty', width: 80, align: 'right' },
        { title: '잔여수량', dataIndex: 'remainQty', width: 80, align: 'right', render: v => <span style={{ color: '#faad14' }}>{v}</span> },
        {
            title: '금번 출고',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <InputNumber
                    min={0}
                    max={record.remainQty}
                    value={record.inputQty}
                    onChange={v => handleQtyChange(record.id, v)}
                    disabled={record.remainQty === 0}
                />
            )
        }
    ];

    return (
        <Modal
            title="출고 등록 (관리자)"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            width={700}
            okText="출고 등록"
            cancelText="취소"
        >
            <Form form={form} layout="vertical" initialValues={{ carrier: 'CJ대한통운' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <Form.Item name="date" label="출고일" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="carrier" label="택배사" rules={[{ required: true }]}>
                        <Select>
                            <Option value="CJ대한통운">CJ대한통운</Option>
                            <Option value="로젠택배">로젠택배</Option>
                            <Option value="우체국택배">우체국택배</Option>
                            <Option value="한진택배">한진택배</Option>
                            <Option value="롯데택배">롯데택배</Option>
                            <Option value="직접배송">직접배송</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="trackingNo" label="송장번호" rules={[{ required: true }]}>
                        <Input placeholder="하이픈(-) 없이 입력" />
                    </Form.Item>
                </div>
            </Form>

            <div style={{ marginBottom: 8, fontWeight: 600 }}>출고 품목 및 수량 선택</div>
            <Table
                dataSource={items}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
                bordered
            />
        </Modal>
    );
}
