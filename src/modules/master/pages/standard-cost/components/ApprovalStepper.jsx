import React from 'react';
import { Steps, Button, message, Popconfirm } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { STATUS_CODES } from '../mockCostData';

const { Step } = Steps;

export function ApprovalStepper({ status, onStepChange }) {
    // Current step index
    const currentIndex = STATUS_CODES.findIndex(s => s.code === status);

    // Status Logic
    const getStepStatus = (index) => {
        if (index < currentIndex) return 'finish';
        if (index === currentIndex) return 'process';
        return 'wait';
    };

    const handleStepClick = (idx) => {
        const targetCode = STATUS_CODES[idx].code;
        if (idx === currentIndex) return;

        // Simple mock logic: Can jump to any step for demo
        // In real app, strict rules apply.
        onStepChange(targetCode);
    };

    return (
        <div style={{ padding: '0 12px' }}>
            <div className="section-label">승인 단계</div>
            <Steps
                current={currentIndex}
                size="small"
                labelPlacement="vertical"
            >
                {STATUS_CODES.map((s, idx) => (
                    <Step
                        key={s.code}
                        title={s.label}
                        // icon={
                        //     idx === currentIndex 
                        //     ? <SyncOutlined spin /> 
                        //     : idx < currentIndex 
                        //         ? <CheckCircleOutlined /> 
                        //         : <ClockCircleOutlined />
                        // }
                        status={getStepStatus(idx)}
                        description={
                            idx !== currentIndex && (
                                <Popconfirm
                                    title={`'${s.label}' 상태로 변경하시겠습니까?`}
                                    onConfirm={() => handleStepClick(idx)}
                                    okText="변경"
                                    cancelText="취소"
                                >
                                    <Button type="link" size="small" style={{ fontSize: 11, padding: 0 }}>변경</Button>
                                </Popconfirm>
                            )
                        }
                    />
                ))}
            </Steps>
        </div>
    );
}
