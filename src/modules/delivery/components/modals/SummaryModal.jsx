import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './SummaryModal.module.css';
import { SummaryTable } from '../table/SummaryTable';
import { CATEGORY_AMOUNT_DATA, CATEGORY_WEIGHT_DATA, BIDET_DELIVERY_PLAN_DATA } from '../../data/summaryData';

// Get portal root
const modalRoot = document.getElementById('modal-root') || document.body;

export const SummaryModal = ({ isOpen, type, onClose }) => {
    const [activeType, setActiveType] = useState(type || 'amount');

    // Reset active type when modal opens with a new type
    useEffect(() => {
        if (isOpen && type) {
            setActiveType(type);
        }
    }, [isOpen, type]);

    // Handle ESC key and Body Overflow
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEsc);
            return () => {
                window.removeEventListener('keydown', handleEsc);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Select Data
    let data, title;
    if (activeType === 'amount') {
        data = CATEGORY_AMOUNT_DATA;
        title = '금액 요약';
    } else if (activeType === 'weight') {
        data = CATEGORY_WEIGHT_DATA;
        title = '중량 요약';
    } else {
        data = BIDET_DELIVERY_PLAN_DATA;
        title = '비데 납품계획';
    }

    const modalContent = (
        <div className={styles.summaryOverlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.summaryModal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.title}>{title}</div>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                {/* Tabs */}
                <div className={styles.modalTabs}>
                    <button
                        className={`${styles.tabButton} ${activeType === 'amount' ? styles.active : ''}`}
                        onClick={() => setActiveType('amount')}
                    >
                        금액 요약
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeType === 'weight' ? styles.active : ''}`}
                        onClick={() => setActiveType('weight')}
                    >
                        중량 요약
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeType === 'bidet' ? styles.active : ''}`}
                        onClick={() => setActiveType('bidet')}
                    >
                        비데 납품계획
                    </button>
                </div>

                {/* Content */}
                <div className={styles.modalContent}>
                    <SummaryTable
                        columns={data.columns}
                        rows={data.rows}
                        loading={false}
                    />
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.footerButton} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, modalRoot);
};
