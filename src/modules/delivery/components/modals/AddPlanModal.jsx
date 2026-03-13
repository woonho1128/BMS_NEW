import { useState } from 'react';
import styles from './Modal.module.css';

export const AddPlanModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        company: '',
        site: '',
        agency: '',
        deliveryDate: '',
        moveInDate: '',
        item1: '',
        qty: '',
        agencyPrice: '',
        weight: '',
        amount: '',
        manager: '',
        memo: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'qty' || name === 'agencyPrice' || name === 'weight') {
                const q = Number(updated.qty) || 0;
                const p = Number(updated.agencyPrice) || 0;
                const w = Number(updated.weight) || 0;
                updated.amount = q * p;
                updated.totalWeightKg = q * w;
                updated.totalWeightTon = (q * w) / 1000;
            }
            return updated;
        });
    };

    const handleSave = () => {
        if (!formData.company || !formData.site) {
            alert('건설회사와 현장명을 입력해주세요.');
            return;
        }
        
        const newRow = {
            id: Date.now(),
            ...formData,
            status: '진행',
            source: 'plan', // Indicates added from "납품계획 추가"
            changeHistory: [],
            partialHistory: []
        };
        onSave(newRow);
    };

    // Dummy search logic
    const handleSearch = () => {
        if (searchTerm.includes('현장')) {
            setFormData({
                ...formData,
                company: 'DL건설',
                site: '현장 검색결과 A',
                agency: '서울대리점'
            });
            alert('현장 정보가 검색되었습니다.');
        } else {
            alert('검색된 현장이 없습니다. 직접 입력해주세요.');
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ width: '600px' }}>
                <div className={styles.header}>
                    <h2 className={styles.title}>납품 계획 추가</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.content}>
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600 }}>현장 검색:</label>
                        <input
                            type="text"
                            placeholder="현장 이름 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '6px', border: '1px solid #d9d9d9', borderRadius: '4px', flex: 1 }}
                        />
                        <button 
                            onClick={handleSearch}
                            style={{ padding: '6px 12px', background: '#f0f0f0', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            검색
                        </button>
                    </div>
                    
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '16px', textAlign: 'right' }}>
                        * 검색되지 않는 경우 직접 입력할 수 있습니다.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>건설회사</label>
                            <input name="company" value={formData.company} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>현장명</label>
                            <input name="site" value={formData.site} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>대리점</label>
                            <input name="agency" value={formData.agency} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>납품예정</label>
                            <input type="month" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>입주예정</label>
                            <input type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>품목</label>
                            <input name="item1" value={formData.item1} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>수량</label>
                            <input type="number" name="qty" value={formData.qty} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>대리점가</label>
                            <input type="number" name="agencyPrice" value={formData.agencyPrice} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>비고</label>
                            <input name="memo" value={formData.memo} onChange={handleChange} style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                    <button className={styles.saveButton} onClick={handleSave}>추가</button>
                </div>
            </div>
        </div>
    );
};
