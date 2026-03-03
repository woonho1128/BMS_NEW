import React from 'react';
import { Card, Descriptions, Input, Typography } from 'antd';
import './DealerInfoCard.css';

const { TextArea } = Input;
const { Text } = Typography;

export function DealerInfoCard({ dealerInfo, requestNote, onRequestNoteChange, readOnly = false }) {
    return (
        <Card
            title="발주 기본 정보"
            className="dealer-info-card"
            variant="outlined"
            styles={{ header: { borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa', fontSize: '15px', fontWeight: 600 } }}
        >
            <div className="dealer-info-grid">
                <div className="info-item">
                    <span className="info-label">대리점명</span>
                    <span className="info-value">{dealerInfo.name}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">사업자번호</span>
                    <span className="info-value">{dealerInfo.bizNo}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">담당자명</span>
                    <span className="info-value">{dealerInfo.manager}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">연락처</span>
                    <span className="info-value">{dealerInfo.phone}</span>
                </div>
                <div className="info-item full-width">
                    <span className="info-label">이메일</span>
                    <span className="info-value">{dealerInfo.email}</span>
                </div>
                <div className="info-item full-width">
                    <span className="info-label">발주 요청일</span>
                    <span className="info-value">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="info-item full-width">
                    <span className="info-label" style={{ marginBottom: 8, display: 'block' }}>요청 메모</span>
                    {readOnly ? (
                        <div className="readonly-note">
                            {requestNote || <Text type="secondary">요청 메모가 없습니다.</Text>}
                        </div>
                    ) : (
                        <TextArea
                            rows={3}
                            placeholder="본사에 전달할 요청사항을 입력해주세요."
                            value={requestNote}
                            onChange={(e) => onRequestNoteChange?.(e.target.value)}
                            style={{ resize: 'none' }}
                        />
                    )}
                </div>
            </div>
        </Card>
    );
}
