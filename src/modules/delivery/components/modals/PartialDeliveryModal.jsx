import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';

export const PartialDeliveryModal = ({ row, onClose, onSave }) => {
    const [deliveryQty, setDeliveryQty] = useState('');
    const [date, setDate] = useState('');

    const initialQty = row.qty;
    const remainingQty = initialQty - (parseInt(deliveryQty) || 0);

    const handleSave = () => {
        if (!deliveryQty || !date) return;
        onSave(row.id, parseInt(deliveryQty), date);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>부분 납품 처리</h3>
                <div className={styles.content}>
                    <div className={styles.field}>
                        <span className={styles.label}>현재 수량</span>
                        <div className={styles.info}>{initialQty.toLocaleString()}</div>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>이번 납품 수량</span>
                        <input
                            type="number"
                            className={styles.input}
                            value={deliveryQty}
                            onChange={(e) => setDeliveryQty(e.target.value)}
                            placeholder="수량 입력"
                        />
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>잔여 수량 (예상)</span>
                        <div className={styles.info}>{remainingQty.toLocaleString()}</div>
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>납품일</span>
                        <input
                            type="date"
                            className={styles.input}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                    <button
                        className={styles.saveButton}
                        onClick={handleSave}
                        disabled={!deliveryQty || !date || remainingQty < 0}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};
