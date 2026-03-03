import React, { useEffect } from 'react';
import { Card, Input, Checkbox, Form, Typography } from 'antd';
import './DealerInfoCard.css'; // Reuse styles where possible

const { TextArea } = Input;

export function ReceiverInfoCard({ receiverInfo, onReceiverChange, dealerAddress, readOnly = false }) {
    const handleSameAsDealer = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            onReceiverChange({
                ...receiverInfo,
                isSameAsDealer: true,
                address: dealerAddress,
                addressDetail: '' // Optional: Clear detail or keep it? Usually keep blank or let user fill
            });
        } else {
            onReceiverChange({
                ...receiverInfo,
                isSameAsDealer: false,
                address: '',
                addressDetail: ''
            });
        }
    };

    const handleChange = (field, value) => {
        onReceiverChange({
            ...receiverInfo,
            [field]: value
        });
    };

    if (readOnly) {
        return (
            <Card
                title="수령 정보"
                className="dealer-info-card"
                variant="outlined"
                styles={{ header: { borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', fontSize: '15px', fontWeight: 600 } }}
            >
                <div className="dealer-info-grid">
                    <div className="info-item">
                        <span className="info-label">수령인</span>
                        <span className="info-value">{receiverInfo.receiverName}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">연락처</span>
                        <span className="info-value">{receiverInfo.receiverPhone}</span>
                    </div>
                    <div className="info-item full-width">
                        <span className="info-label">배송 주소</span>
                        <span className="info-value">{receiverInfo.address} {receiverInfo.addressDetail}</span>
                    </div>
                    <div className="info-item full-width">
                        <span className="info-label">배송 요청사항</span>
                        <div className="readonly-note" style={{ minHeight: 'auto' }}>
                            {receiverInfo.deliveryNote || <Typography.Text type="secondary">요청사항 없음</Typography.Text>}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            title="수령 정보"
            className="dealer-info-card"
            variant="outlined"
            styles={{ header: { borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', fontSize: '15px', fontWeight: 600 } }}
        >
            <div className="dealer-info-grid">
                <div className="info-item">
                    <span className="info-label">수령인</span>
                    <Input
                        placeholder="이름 입력"
                        value={receiverInfo.receiverName}
                        onChange={(e) => handleChange('receiverName', e.target.value)}
                    />
                </div>
                <div className="info-item">
                    <span className="info-label">연락처</span>
                    <Input
                        placeholder="010-0000-0000"
                        value={receiverInfo.receiverPhone}
                        onChange={(e) => handleChange('receiverPhone', e.target.value)}
                    />
                </div>

                <div className="info-item full-width">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span className="info-label" style={{ marginBottom: 0 }}>배송 주소</span>
                        <Checkbox
                            checked={receiverInfo.isSameAsDealer}
                            onChange={handleSameAsDealer}
                            style={{ fontSize: '13px' }}
                        >
                            대리점 주소와 동일
                        </Checkbox>
                    </div>
                    <Input
                        placeholder="기본 주소"
                        value={receiverInfo.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        readOnly={receiverInfo.isSameAsDealer}
                        style={{ marginBottom: 8, backgroundColor: receiverInfo.isSameAsDealer ? '#f5f5f5' : '#fff' }}
                    />
                    <Input
                        placeholder="상세 주소 입력"
                        value={receiverInfo.addressDetail}
                        onChange={(e) => handleChange('addressDetail', e.target.value)}
                    />
                </div>

                <div className="info-item full-width">
                    <span className="info-label" style={{ marginBottom: 8, display: 'block' }}>배송 요청사항</span>
                    <TextArea
                        rows={2}
                        placeholder="배송 기사님께 전달할 메시지를 입력해주세요."
                        value={receiverInfo.deliveryNote}
                        onChange={(e) => handleChange('deliveryNote', e.target.value)}
                        style={{ resize: 'none' }}
                    />
                </div>
            </div>
        </Card>
    );
}
