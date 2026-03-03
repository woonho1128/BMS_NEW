import React, { useState, useEffect } from 'react';
import { Button, Tabs, message, Alert } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { OptionTab } from './tabs/OptionTab';
import { PricingPolicyTab } from './tabs/PricingPolicyTab';
import './ProductDetailPanel.css';

const { TabPane } = Tabs;

export function ProductDetailPanel({ initialData, onSave, onDelete, isCreating }) {
    const [formData, setFormData] = useState(initialData);
    const [isDirty, setIsDirty] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        setFormData(initialData);
        setIsDirty(false);
        setActiveTab('basic');
    }, [initialData]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSave = () => {
        if (!formData.name) {
            message.error('품목명은 필수입니다.');
            return;
        }
        onSave(formData);
        setIsDirty(false);
    };

    return (
        <div className="detail-panel-wrapper">
            {/* Sticky Header */}
            <div className="detail-panel-header">
                <div className="header-title">
                    {isCreating ? '새 품목 등록' : `품목 수정: ${initialData.name}`}
                </div>
                <div className="header-actions">
                    {!isCreating && (
                        <Button danger onClick={() => onDelete(initialData.id)}>
                            삭제
                        </Button>
                    )}
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        disabled={!isDirty}
                    >
                        저장
                    </Button>
                </div>
            </div>

            {/* Unsaved Warning */}
            {isDirty && (
                <Alert
                    message="저장되지 않은 변경사항이 있습니다."
                    type="warning"
                    showIcon
                    banner
                    style={{ margin: 0 }}
                />
            )}

            {/* Tabs Content */}
            <div className="detail-panel-content">
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="기본정보" key="basic">
                        <BasicInfoTab data={formData} onChange={handleChange} />
                    </TabPane>
                    <TabPane tab="옵션관리" key="options">
                        <OptionTab data={formData} onChange={handleChange} />
                    </TabPane>
                    <TabPane tab="가격정책" key="pricing">
                        <PricingPolicyTab data={formData} onChange={handleChange} />
                    </TabPane>
                    <TabPane tab="이미지" key="images">
                        <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
                            이미지 관리 탭 (추후 구현)
                        </div>
                    </TabPane>
                    <TabPane tab="상세정보" key="details">
                        <div style={{ padding: 24, textAlign: 'center', color: '#999' }}>
                            상세 스펙 관리 탭 (추후 구현)
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}
