import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './SpecRegistrationModal.module.css';

// Portal Root
const modalRoot = document.getElementById('modal-root') || document.body;

export const SpecRegistrationModal = ({ isOpen, onClose, onSave }) => {
    // Basic Form State
    const [formData, setFormData] = useState({
        company: '',
        site: '',
        agency: '',
        deliveryDate: '',
        moveInDate: '',
        manager: '',
        category: '특판',
        specManager: ''
    });

    // Items State
    const [items, setItems] = useState([
        { id: 1, item: '', color: '', qty: 0, price: 0, weight: 0, spec: '', memo: '' }
    ]);

    // Reset on Open
    useEffect(() => {
        if (isOpen) {
            setFormData({
                company: 'DL건설', // Default for easier testing
                site: '',
                agency: '서울대리점',
                deliveryDate: '',
                moveInDate: '',
                manager: '홍길동',
                category: '특판',
                specManager: '김철수'
            });
            setItems([
                { id: 1, item: '일체형양변기', color: '화이트', qty: 100, price: 120000, weight: 45, spec: '일반', memo: '' }
            ]);
        }
    }, [isOpen]);

    // Handlers
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (id, field, value) => {
        setItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handleAddItem = () => {
        const newId = Math.max(...items.map(i => i.id), 0) + 1;
        setItems(prev => [
            ...prev,
            { id: newId, item: '', color: '', qty: 0, price: 0, weight: 0, spec: '', memo: '' }
        ]);
    };

    const handleRemoveItem = (id) => {
        if (items.length <= 1) {
            alert('최소 1개의 품목이 필요합니다.');
            return;
        }
        setItems(prev => prev.filter(i => i.id !== id));
    };

    // Calculation Helper
    const calculateTotals = (item) => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.price) || 0;
        const weight = Number(item.weight) || 0;

        const amount = qty * price;
        const totalWeightKg = qty * weight;
        const totalWeightTon = totalWeightKg / 1000;

        return { amount, totalWeightKg, totalWeightTon };
    };

    const handleSave = () => {
        // Validation
        if (!formData.company || !formData.site) {
            alert('건설회사와 현장명은 필수입니다.');
            return;
        }

        // Prepare Data for Parent
        // We will pass the formData and the items list
        // The parent will flatten this into multiple rows
        onSave(formData, items);
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <h3 className={styles.title}>신규 현장 등록</h3>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                {/* Content */}
                <div className={styles.modalContent}>
                    {/* Section 1: Basic Info */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>기본 정보</div>
                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label className={styles.label}>건설회사</label>
                                <input
                                    name="company"
                                    className={styles.input}
                                    value={formData.company}
                                    onChange={handleFormChange}
                                    placeholder="예: DL건설"
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>현장명</label>
                                <input
                                    name="site"
                                    className={styles.input}
                                    value={formData.site}
                                    onChange={handleFormChange}
                                    placeholder="예: 서울 현장 A"
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>대리점</label>
                                <input
                                    name="agency"
                                    className={styles.input}
                                    value={formData.agency}
                                    onChange={handleFormChange}
                                    placeholder="예: 서울대리점"
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>구분</label>
                                <select
                                    name="category"
                                    className={styles.select}
                                    value={formData.category}
                                    onChange={handleFormChange}
                                >
                                    <option value="특판">특판</option>
                                    <option value="리테일">리테일</option>
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>납품예정</label>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    className={styles.input}
                                    value={formData.deliveryDate}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>입주예정</label>
                                <input
                                    type="date"
                                    name="moveInDate"
                                    className={styles.input}
                                    value={formData.moveInDate}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>담당자</label>
                                <input
                                    name="manager"
                                    className={styles.input}
                                    value={formData.manager}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>SPEC담당</label>
                                <input
                                    name="specManager"
                                    className={styles.input}
                                    value={formData.specManager}
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Items */}
                    <div className={styles.section}>
                        <div className={styles.sectionTitle}>품목 정보</div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.itemTable}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%' }}>품목</th>
                                        <th style={{ width: '10%' }}>색상</th>
                                        <th style={{ width: '10%' }}>수량</th>
                                        <th style={{ width: '10%' }}>대리점가</th>
                                        <th style={{ width: '8%' }}>중량(KG)</th>
                                        <th style={{ width: '10%' }}>총무게(KG)</th>
                                        <th style={{ width: '10%' }}>총무게(TON)</th>
                                        <th style={{ width: '12%' }}>금액</th>
                                        <th style={{ width: '10%' }}>특수사양</th>
                                        <th style={{ width: '5%' }}>삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => {
                                        const { amount, totalWeightKg, totalWeightTon } = calculateTotals(item);
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <input
                                                        className={styles.tableInput}
                                                        value={item.item}
                                                        onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                                                        placeholder="품목명"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.tableInput}
                                                        value={item.color}
                                                        onChange={(e) => handleItemChange(item.id, 'color', e.target.value)}
                                                        placeholder="색상"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className={styles.tableInput}
                                                        value={item.qty}
                                                        onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className={styles.tableInput}
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className={styles.tableInput}
                                                        value={item.weight}
                                                        onChange={(e) => handleItemChange(item.id, 'weight', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.tableInput}
                                                        readOnly
                                                        value={totalWeightKg.toLocaleString()}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.tableInput}
                                                        readOnly
                                                        value={totalWeightTon.toFixed(3)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.tableInput}
                                                        readOnly
                                                        value={amount.toLocaleString()}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.tableInput}
                                                        value={item.spec}
                                                        onChange={(e) => handleItemChange(item.id, 'spec', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className={styles.removeButton}
                                                        onClick={() => handleRemoveItem(item.id)}
                                                    >
                                                        ×
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <button className={styles.addButton} onClick={handleAddItem}>
                            + 품목 추가
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>취소</button>
                    <button className={styles.saveButton} onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, modalRoot);
};
