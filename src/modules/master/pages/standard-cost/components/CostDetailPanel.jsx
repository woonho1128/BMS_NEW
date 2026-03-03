import React, { useState, useEffect, useMemo } from 'react';
import { Button, Input, InputNumber, Select, Tabs, Statistic, Row, Col, Alert, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { ApprovalStepper } from './ApprovalStepper';
import { CostHistoryTab } from './CostHistoryTab';
import './CostDetailPanel.css';

const { TabPane } = Tabs;

export function CostDetailPanel({ initialData, onSave, isCreating }) {
    const [formData, setFormData] = useState(initialData);
    const [isDirty, setIsDirty] = useState(false);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        setFormData(initialData);
        setIsDirty(false);
        setActiveTab('info');
    }, [initialData]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    // --- Calculation Logic ---
    const calc = useMemo(() => {
        const factory = formData.factoryPrice || 0;
        const otherRate = formData.otherRate || 0;
        const logistics = formData.logisticsCost || 0;
        const marginRate = formData.marginRate || 0;

        const otherCost = Math.floor(factory * otherRate / 100);
        const stdCost = factory + otherCost + logistics;

        let salesPrice = 0;
        if (marginRate < 100) {
            salesPrice = Math.floor(stdCost / (1 - marginRate / 100));
        }

        const marginAmt = salesPrice - stdCost;

        return { otherCost, stdCost, salesPrice, marginAmt };
    }, [formData.factoryPrice, formData.otherRate, formData.logisticsCost, formData.marginRate]);

    const handleSave = () => {
        if (!formData.name || !formData.partNo) {
            message.error('필수 항목을 입력해주세요.');
            return;
        }
        onSave(formData);
        setIsDirty(false);
    };

    const handleStatusChange = (newStatus) => {
        handleChange('status', newStatus);
        message.info(`상태가 '${newStatus}'(으)로 변경되었습니다. (저장 필요)`);
    };

    return (
        <div className="cost-detail-wrapper">
            {/* Sticky Header */}
            <div className="cost-detail-header">
                <div className="header-title">
                    {isCreating ? '표준원가 신규 등록' : `표준원가 상세: ${initialData.partNo}`}
                </div>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    disabled={!isDirty}
                >
                    저장
                </Button>
            </div>

            {isDirty && <Alert message="저장되지 않은 변경사항이 있습니다." type="warning" banner style={{ margin: 0 }} />}

            {/* Content Scroll Area */}
            <div className="cost-detail-content">

                {/* 1. Approval Stepper */}
                <div className="section-block">
                    <ApprovalStepper status={formData.status} onStepChange={handleStatusChange} />
                </div>

                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="상세 정보" key="info">

                        {/* 2. Basic Info & Cost Input */}
                        <div className="grid-2-col">
                            {/* Left: Inputs */}
                            <div className="input-column">
                                <div className="section-label">기본 정보</div>
                                <div className="form-row">
                                    <label>프로젝트</label>
                                    <Input value={formData.project} onChange={e => handleChange('project', e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <label>구분</label>
                                    <Select
                                        value={formData.type}
                                        onChange={v => handleChange('type', v)}
                                        options={[{ value: 'OEM', label: 'OEM' }, { value: 'S/W', label: 'S/W' }]}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>품번</label>
                                    <Input value={formData.partNo} onChange={e => handleChange('partNo', e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <label>품명</label>
                                    <Input value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <label>수정 유형</label>
                                    <Select
                                        value={formData.revisionType}
                                        onChange={v => handleChange('revisionType', v)}
                                        options={[
                                            { value: 'REGULAR', label: '정기 수정' },
                                            { value: 'IRREGULAR', label: '비정기 수정' },
                                            { value: 'PROJECT_ONLY', label: '프로젝트 전용' }
                                        ]}
                                        style={{ width: '100%' }}
                                    />
                                </div>

                                <div className="divider" />

                                <div className="section-label">원가 입력</div>
                                <div className="form-row">
                                    <label>공장도가</label>
                                    <InputNumber
                                        value={formData.factoryPrice}
                                        onChange={v => handleChange('factoryPrice', v)}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>중량 (kg)</label>
                                    <InputNumber
                                        value={formData.weight}
                                        onChange={v => handleChange('weight', v)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>물류비</label>
                                    <InputNumber
                                        value={formData.logisticsCost}
                                        onChange={v => handleChange('logisticsCost', v)}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>기타원가율 (%)</label>
                                    <InputNumber
                                        value={formData.otherRate}
                                        onChange={v => handleChange('otherRate', v)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>판매마진율 (%)</label>
                                    <InputNumber
                                        value={formData.marginRate}
                                        onChange={v => handleChange('marginRate', v)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            {/* Right: Calculation Result */}
                            <div className="calc-column">
                                <div className="calc-box">
                                    <div className="section-label">원가 계산 결과 (실시간)</div>
                                    <Row gutter={[16, 24]}>
                                        <Col span={12}>
                                            <Statistic title="기타 원가" value={calc.otherCost} suffix="원" />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title="표준 원가" value={calc.stdCost} suffix="원" valueStyle={{ color: '#1890ff', fontWeight: 'bold' }} />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title="마진 금액" value={calc.marginAmt} suffix="원" />
                                        </Col>
                                        <Col span={12}>
                                            <Statistic title="판매가 (VAT 별도)" value={calc.salesPrice} suffix="원" valueStyle={{ color: '#3f8600', fontWeight: 'bold' }} />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>

                    </TabPane>
                    <TabPane tab={`수정 이력 (${formData.history?.length || 0})`} key="history">
                        <CostHistoryTab history={formData.history} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}
