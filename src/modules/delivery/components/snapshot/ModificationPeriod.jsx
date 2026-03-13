import { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';

export const ModificationPeriod = () => {
    const { user } = useAuth();
    // Assuming HEADQUARTERS role or position allows admin access
    const isAdmin = user?.role === 'HEADQUARTERS' || user?.position?.includes('관리자');

    const [startDate, setStartDate] = useState('2026-03-01');
    const [endDate, setEndDate] = useState('2026-03-31');

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#fafafa',
            padding: '12px 16px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            fontSize: '13px'
        }}>
            <span style={{ fontWeight: 600, color: '#333' }}>수정 가능 기간:</span>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={!isAdmin}
                style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    backgroundColor: isAdmin ? '#fff' : '#f5f5f5',
                    color: isAdmin ? '#333' : '#8c8c8c',
                    cursor: isAdmin ? 'text' : 'not-allowed',
                    fontSize: '13px'
                }}
            />
            <span style={{ color: '#8c8c8c' }}>~</span>
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={!isAdmin}
                style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    backgroundColor: isAdmin ? '#fff' : '#f5f5f5',
                    color: isAdmin ? '#333' : '#8c8c8c',
                    cursor: isAdmin ? 'text' : 'not-allowed',
                    fontSize: '13px'
                }}
            />
            {isAdmin && (
                <button 
                    onClick={() => alert(`수정 가능 기간이 ${startDate} ~ ${endDate}로 저장되었습니다.`)}
                    style={{
                        padding: '4px 12px',
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500
                    }}
                >
                    저장
                </button>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                {!isAdmin ? (
                    <span style={{ fontSize: '13px', color: '#ff4d4f' }}>
                        * 관리자만 수정 가능합니다.
                    </span>
                ) : (
                    <span style={{ fontSize: '13px', color: '#52c41a' }}>
                        * 기간을 설정 후 저장 버튼을 클릭하세요.
                    </span>
                )}
            </div>
        </div>
    );
};
