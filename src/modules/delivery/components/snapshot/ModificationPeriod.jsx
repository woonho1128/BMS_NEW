import { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { notify } from '../../../../shared/utils/notify';

export const ModificationPeriod = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'HEADQUARTERS' || user?.position?.includes('관리자');

  const [startDate, setStartDate] = useState('2026-03-01');
  const [endDate, setEndDate] = useState('2026-03-31');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#f7faff',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #cad6e6',
        fontSize: '13px'
      }}
    >
      <span style={{ fontWeight: 600, color: '#1d2a3b' }}>수정 가능 기간:</span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        disabled={!isAdmin}
        style={{
          padding: '4px 8px',
          borderRadius: '8px',
          border: '1px solid #cad6e6',
          backgroundColor: isAdmin ? '#fff' : '#f4f7fb',
          color: isAdmin ? '#1d2a3b' : '#6a7991',
          cursor: isAdmin ? 'text' : 'not-allowed',
          fontSize: '13px'
        }}
      />
      <span style={{ color: '#6a7991' }}>~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        disabled={!isAdmin}
        style={{
          padding: '4px 8px',
          borderRadius: '8px',
          border: '1px solid #cad6e6',
          backgroundColor: isAdmin ? '#fff' : '#f4f7fb',
          color: isAdmin ? '#1d2a3b' : '#6a7991',
          cursor: isAdmin ? 'text' : 'not-allowed',
          fontSize: '13px'
        }}
      />
      {isAdmin && (
        <button
          onClick={() => notify.success()}
          style={{
            padding: '4px 12px',
            backgroundColor: '#2f7df6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
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
          <span style={{ fontSize: '13px', color: '#ff4d4f' }}>* 관리자만 수정 가능합니다.</span>
        ) : (
          <span style={{ fontSize: '13px', color: '#52c41a' }}>* 기간을 설정 후 저장 버튼을 클릭하세요.</span>
        )}
      </div>
    </div>
  );
};



