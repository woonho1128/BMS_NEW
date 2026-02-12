import React from 'react';
import { createPortal } from 'react-dom';
import styles from './SummaryModal.module.css'; // Reusing styles
import { YEARLY_PERFORMANCE_DATA } from '../../data/planDummyData';

// Get portal root
const modalRoot = document.getElementById('modal-root') || document.body;

export const YearlyPerformanceModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const { columns, rows } = YEARLY_PERFORMANCE_DATA;

    // Custom styles for this specific large modal
    const modalStyle = {
        width: '1400px',
        maxWidth: '95vw',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column'
    };

    const contentStyle = {
        flex: 1,
        overflow: 'auto',
        padding: '24px'
    };

    // Inline table styles for simplicity as this is a specific view
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
    };

    const thStyle = {
        backgroundColor: '#fafafa',
        padding: '12px 16px',
        borderBottom: '1px solid #e8e8e8',
        fontWeight: 600,
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1
    };

    const tdStyle = (align = 'left', isTotal = false) => ({
        padding: '12px 16px',
        borderBottom: '1px solid #e8e8e8',
        textAlign: align,
        fontWeight: isTotal ? 'bold' : 'normal',
        backgroundColor: isTotal ? '#f6ffed' : '#fff', // Green tint for total rows
        fontVariantNumeric: 'tabular-nums'
    });

    const formatNumber = (val) => typeof val === 'number' ? val.toLocaleString() : val;

    const modalContent = (
        <div className={styles.summaryOverlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.summaryModal} style={modalStyle} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.title}>연도별 실적 (2026년)</div>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div style={contentStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} style={{ ...thStyle, width: col.width, left: col.fixed === 'left' ? 0 : 'auto', right: col.fixed === 'right' ? 0 : 'auto', zIndex: col.fixed ? 2 : 1 }}>
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.id}>
                                    {columns.map(col => (
                                        <td key={`${row.id}-${col.key}`} style={tdStyle(col.align, row.isTotalRow || col.isTotal)}>
                                            {formatNumber(row[col.key])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.footerButton} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, modalRoot);
};
