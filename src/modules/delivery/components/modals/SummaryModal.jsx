import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './SummaryModal.module.css';
import { SummaryTable } from '../table/SummaryTable';
import {
    ITEM_CODE_DATA,
    ITEM_NAME_DATA,
} from '../../data/summaryData';
import { notify } from '../../../../shared/utils/notify';

// Get portal root
const modalRoot = document.getElementById('modal-root') || document.body;

const getAnchorId = (value) => {
    const safe = encodeURIComponent(String(value || '').trim());
    return safe ? `summary-anchor-${safe}` : '';
};

export const SummaryModal = ({ isOpen, type, onClose }) => {
    const visible = typeof isOpen === 'boolean' ? isOpen : true;
    const [activeType, setActiveType] = useState(type || 'itemCode');
    const [itemCodeKeyword, setItemCodeKeyword] = useState('');

    // Reset active type when modal opens with a new type
    useEffect(() => {
        if (visible && type) {
            setActiveType(type);
        }
    }, [visible, type]);

    useEffect(() => {
        if (!visible) {
            setItemCodeKeyword('');
        }
    }, [visible]);

    // Handle ESC key and Body Overflow
    useEffect(() => {
        if (visible) {
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
    }, [visible, onClose]);

    const modalConfigs = useMemo(() => ({
        itemCode: { data: ITEM_CODE_DATA, title: '[3] 품번 요약', placeholder: '품번 입력 (예: CLR339)' },
        itemName: { data: ITEM_NAME_DATA, title: '[4] 품목 요약', placeholder: '품목 입력 (예: 일체형양변기)' },
    }), []);

    const currentConfig = modalConfigs[activeType] || modalConfigs.itemCode;

    const handleSearchItemCode = () => {
        const keyword = itemCodeKeyword.trim();
        if (!keyword) {
            notify.info(activeType === 'itemName' ? '품목을 입력해주세요.' : '품번을 입력해주세요.');
            return;
        }

        const targetRows = currentConfig.data.rows || [];
        const target = targetRows.find((row) => {
            const key = String(row.groupKey || row.keyLabel || '').toLowerCase();
            return key.includes(keyword.toLowerCase());
        });

        if (!target) {
            notify.warning(`"${keyword}" 품번을 찾지 못했습니다.`);
            return;
        }

        const targetId = getAnchorId(target.groupKey || target.keyLabel);
        if (!targetId) {
            notify.warning('이동할 행 정보를 찾지 못했습니다.');
            return;
        }

        window.requestAnimationFrame(() => {
            const rowElement = document.getElementById(targetId);
            if (!rowElement) {
                notify.warning('테이블에서 해당 품번 위치를 찾지 못했습니다.');
                return;
            }

            rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            rowElement.classList.add(styles.flashRow);
            window.setTimeout(() => rowElement.classList.remove(styles.flashRow), 1100);
        });
    };

    if (!visible) return null;

    const modalContent = (
        <div className={styles.summaryOverlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.summaryModal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.title}>{currentConfig.title}</div>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                {/* Tabs */}
                <div className={styles.modalTabs}>
                    <button
                        className={`${styles.tabButton} ${activeType === 'itemCode' ? styles.active : ''}`}
                        onClick={() => setActiveType('itemCode')}
                    >
                        품번 요약
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeType === 'itemName' ? styles.active : ''}`}
                        onClick={() => setActiveType('itemName')}
                    >
                        품목 요약
                    </button>
                </div>

                <div className={styles.searchBar}>
                    <input
                        className={styles.searchInput}
                        placeholder={currentConfig.placeholder}
                        value={itemCodeKeyword}
                        onChange={(e) => setItemCodeKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchItemCode();
                            }
                        }}
                    />
                    <button type="button" className={styles.searchButton} onClick={handleSearchItemCode}>
                        검색 후 이동
                    </button>
                </div>

                {/* Content */}
                <div className={styles.modalContent}>
                    <SummaryTable
                        columns={currentConfig.data.columns}
                        rows={currentConfig.data.rows}
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
