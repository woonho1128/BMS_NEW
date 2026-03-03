import React, { useMemo } from 'react';
import { Table, InputNumber, Button, Card, Statistic, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

export function PricingPolicyTab({ data, onChange }) {

    // --- Grade Discount Logic ---
    const handleAddGrade = () => {
        const newPolicy = [...(data.pricingPolicy.gradeDiscounts || [])];
        newPolicy.push({ grade: 'NEW', discountRate: 0 });
        onChange('pricingPolicy', { ...data.pricingPolicy, gradeDiscounts: newPolicy });
    };

    const handleGradeChange = (index, field, value) => {
        const newPolicy = [...data.pricingPolicy.gradeDiscounts];
        newPolicy[index] = { ...newPolicy[index], [field]: value };
        onChange('pricingPolicy', { ...data.pricingPolicy, gradeDiscounts: newPolicy });
    };

    const handleRemoveGrade = (index) => {
        const newPolicy = data.pricingPolicy.gradeDiscounts.filter((_, i) => i !== index);
        onChange('pricingPolicy', { ...data.pricingPolicy, gradeDiscounts: newPolicy });
    };

    // --- Volume Discount Logic ---
    const handleAddVolume = () => {
        const newPolicy = [...(data.pricingPolicy.volumeDiscounts || [])];
        newPolicy.push({ min: 0, max: null, discountRate: 0 });
        onChange('pricingPolicy', { ...data.pricingPolicy, volumeDiscounts: newPolicy });
    };

    const handleVolumeChange = (index, field, value) => {
        const newPolicy = [...data.pricingPolicy.volumeDiscounts];
        newPolicy[index] = { ...newPolicy[index], [field]: value };
        onChange('pricingPolicy', { ...data.pricingPolicy, volumeDiscounts: newPolicy });
    };

    const handleRemoveVolume = (index) => {
        const newPolicy = data.pricingPolicy.volumeDiscounts.filter((_, i) => i !== index);
        onChange('pricingPolicy', { ...data.pricingPolicy, volumeDiscounts: newPolicy });
    };

    // --- Calculator ---
    const calculator = useMemo(() => {
        const base = data.basePrice || 0;
        const aGrade = data.pricingPolicy.gradeDiscounts?.find(g => g.grade === 'A')?.discountRate || 0;
        const bGrade = data.pricingPolicy.gradeDiscounts?.find(g => g.grade === 'B')?.discountRate || 0;

        const calcPrice = (rate) => Math.floor(base * (1 - rate / 100));

        return {
            aPrice: calcPrice(aGrade),
            bPrice: calcPrice(bGrade),
        };
    }, [data.basePrice, data.pricingPolicy.gradeDiscounts]);


    return (
        <div>
            <Row gutter={24}>
                <Col span={14}>
                    <div className="tab-inner-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span className="section-label">대리점 등급별 할인 정책</span>
                            <Button size="small" icon={<PlusOutlined />} onClick={handleAddGrade}>추가</Button>
                        </div>
                        <Table
                            dataSource={data.pricingPolicy.gradeDiscounts || []}
                            rowKey={(r, i) => i}
                            pagination={false}
                            size="small"
                            bordered
                            columns={[
                                {
                                    title: '등급',
                                    dataIndex: 'grade',
                                    render: (text, record, index) => (
                                        <input
                                            className="ant-input ant-input-sm"
                                            value={text}
                                            onChange={e => handleGradeChange(index, 'grade', e.target.value)}
                                        />
                                    )
                                },
                                {
                                    title: '할인율 (%)',
                                    dataIndex: 'discountRate',
                                    render: (val, record, index) => (
                                        <InputNumber
                                            size="small"
                                            min={0} max={100}
                                            value={val}
                                            onChange={v => handleGradeChange(index, 'discountRate', v)}
                                            style={{ width: '100%' }}
                                        />
                                    )
                                },
                                {
                                    title: '',
                                    width: 40,
                                    render: (_, __, index) => (
                                        <Button
                                            type="text" danger size="small" icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveGrade(index)}
                                        />
                                    )
                                }
                            ]}
                        />
                    </div>

                    <div className="tab-inner-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span className="section-label">판매량 구간 할인 정책 (월간)</span>
                            <Button size="small" icon={<PlusOutlined />} onClick={handleAddVolume}>추가</Button>
                        </div>
                        <Table
                            dataSource={data.pricingPolicy.volumeDiscounts || []}
                            rowKey={(r, i) => i}
                            pagination={false}
                            size="small"
                            bordered
                            columns={[
                                {
                                    title: '최소수량',
                                    dataIndex: 'min',
                                    render: (val, record, index) => (
                                        <InputNumber
                                            size="small" value={val} onChange={v => handleVolumeChange(index, 'min', v)}
                                            style={{ width: '100%' }}
                                        />
                                    )
                                },
                                {
                                    title: '최대수량 (무제한: 빈값)',
                                    dataIndex: 'max',
                                    render: (val, record, index) => (
                                        <InputNumber
                                            size="small" value={val} onChange={v => handleVolumeChange(index, 'max', v)}
                                            placeholder="∞"
                                            style={{ width: '100%' }}
                                        />
                                    )
                                },
                                {
                                    title: '할인율 (%)',
                                    dataIndex: 'discountRate',
                                    render: (val, record, index) => (
                                        <InputNumber
                                            size="small" min={0} max={100} value={val} onChange={v => handleVolumeChange(index, 'discountRate', v)}
                                            style={{ width: '100%' }}
                                        />
                                    )
                                },
                                {
                                    title: '',
                                    width: 40,
                                    render: (_, __, index) => (
                                        <Button
                                            type="text" danger size="small" icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveVolume(index)}
                                        />
                                    )
                                }
                            ]}
                        />
                    </div>
                </Col>

                <Col span={10}>
                    <div style={{ position: 'sticky', top: 24 }}>
                        <Card title="가격 미리보기 (시뮬레이션)" size="small" style={{ background: '#f9f9f9', borderColor: '#f0f0f0' }}>
                            <Statistic
                                title="기본 공급가"
                                value={data.basePrice}
                                suffix="원"
                                valueStyle={{ fontSize: 16 }}
                            />
                            <div style={{ margin: '16px 0', borderTop: '1px solid #e8e8e8' }}></div>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic
                                        title="A등급 적용가"
                                        value={calculator.aPrice}
                                        suffix="원"
                                        valueStyle={{ fontSize: 18, color: '#3f8600', fontWeight: 'bold' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="B등급 적용가"
                                        value={calculator.bPrice}
                                        suffix="원"
                                        valueStyle={{ fontSize: 18, color: '#1890ff', fontWeight: 'bold' }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
