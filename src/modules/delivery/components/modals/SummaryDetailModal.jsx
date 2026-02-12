import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './SummaryDetailModal.module.css';
import { SummaryTable } from '../table/SummaryTable';
import { ITEM_CODE_DATA, ITEM_NAME_DATA, SUMMARY_YEARS, DEFAULT_YEAR } from '../../data/summaryData';

// Get portal root
const modalRoot = document.getElementById('modal-root') || document.body;

export const SummaryDetailModal = ({ isOpen, initialMode = 'itemCode', onClose }) => {
    const [activeTab, setActiveTab] = useState(initialMode);
    const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);

    // Autocomplete State
    const [selectedTargets, setSelectedTargets] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Refs for click outside
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Reset state when modal opens or tab changes
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialMode);
            setSelectedYear(DEFAULT_YEAR);
            setKeyword('');
            setDebouncedKeyword('');
            setSelectedTargets([]);
            setIsDropdownOpen(false);
        }
    }, [isOpen, initialMode]);

    // Cleanup when tab changes internally
    useEffect(() => {
        setKeyword('');
        setDebouncedKeyword('');
        setSelectedTargets([]);
        setIsDropdownOpen(false);
    }, [activeTab]);

    // Handle ESC key and Body Overflow
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    if (isDropdownOpen) setIsDropdownOpen(false);
                    else onClose();
                }
            };
            window.addEventListener('keydown', handleEsc);
            return () => {
                window.removeEventListener('keydown', handleEsc);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, onClose, isDropdownOpen]);

    // Click Outside Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Debounce Keyword
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [keyword]);

    // Determine Source Data based on Tab
    const sourceData = activeTab === 'itemCode' ? ITEM_CODE_DATA : ITEM_NAME_DATA;

    // Extract Unique Search Options
    const allOptions = useMemo(() => {
        const map = new Map();
        sourceData.rows.forEach(row => {
            if (row.groupKey && !map.has(row.groupKey)) {
                map.set(row.groupKey, {
                    value: row.groupKey,
                    label: row.keyLabel,
                    // Code data now has itemName. Name data uses groupKey as name.
                    extraSearch: row.itemName || ''
                });
            }
        });
        return Array.from(map.values());
    }, [sourceData]);

    // Filter Options based on Debounced Keyword (Max 10)
    const searchResults = useMemo(() => {
        if (!debouncedKeyword.trim()) return [];

        const lowerTerm = debouncedKeyword.toLowerCase().trim();
        return allOptions
            .filter(opt =>
                !selectedTargets.includes(opt.value) && // Exclude already selected
                (opt.value.toLowerCase().includes(lowerTerm) ||
                    opt.extraSearch.toLowerCase().includes(lowerTerm))
            )
            .slice(0, 10); // Max 10 items
    }, [allOptions, debouncedKeyword, selectedTargets]);

    // Autocomplete Handlers
    const handleInputChange = (e) => {
        setKeyword(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleSelect = (option) => {
        setSelectedTargets(prev => [...prev, option.value]);
        setKeyword(''); // Clear input
        setIsDropdownOpen(false);
        if (inputRef.current) inputRef.current.focus();
    };

    const handleRemoveTag = (value) => {
        setSelectedTargets(prev => prev.filter(v => v !== value));
    };

    // Filter Rows for Table
    const filteredRows = useMemo(() => {
        if (selectedTargets.length === 0) return [];
        return sourceData.rows.filter(row => selectedTargets.includes(row.groupKey));
    }, [sourceData, selectedTargets]);

    // Get display label for tag
    const getLabel = (value) => {
        const opt = allOptions.find(o => o.value === value);
        if (!opt) return value;
        return opt.extraSearch ? `${opt.label} (${opt.extraSearch})` : opt.label;
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.title}>년도 상세 요약 (품번/품목)</div>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                {/* Tabs */}
                <div className={styles.modalTabs}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'itemCode' ? styles.active : ''}`}
                        onClick={() => setActiveTab('itemCode')}
                    >
                        품번 요약
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'itemName' ? styles.active : ''}`}
                        onClick={() => setActiveTab('itemName')}
                    >
                        품목 요약
                    </button>
                </div>

                {/* Filters */}
                <div className={styles.filterBar}>
                    <div className={styles.filterItem}>
                        <span className={styles.label}>연도 선택</span>
                        <select
                            className={styles.select}
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {SUMMARY_YEARS.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterItem} style={{ flex: 1 }}>
                        <span className={styles.label}>
                            {activeTab === 'itemCode' ? '품번 검색 (품명 검색 가능)' : '품목 검색'}
                        </span>

                        <div className={styles.searchContainer}>
                            <input
                                ref={inputRef}
                                type="text"
                                className={styles.searchInput}
                                placeholder={activeTab === 'itemCode' ? "품번 또는 품명 입력..." : "품목명 입력..."}
                                value={keyword}
                                onChange={handleInputChange}
                                onFocus={() => { if (keyword) setIsDropdownOpen(true) }}
                            />

                            {isDropdownOpen && searchResults.length > 0 && (
                                <div className={styles.dropdownList} ref={dropdownRef}>
                                    {searchResults.map(opt => (
                                        <div
                                            key={opt.value}
                                            className={styles.dropdownItem}
                                            onClick={() => handleSelect(opt)}
                                        >
                                            <span>{opt.label}</span>
                                            {opt.extraSearch && <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{opt.extraSearch}</span>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isDropdownOpen && keyword && searchResults.length === 0 && (
                                <div className={styles.dropdownList} style={{ padding: '8px', color: '#8c8c8c', textAlign: 'center' }}>
                                    검색 결과가 없습니다.
                                </div>
                            )}
                        </div>

                        {/* Selected Tags */}
                        <div className={styles.tagContainer}>
                            {selectedTargets.map(target => (
                                <div key={target} className={styles.tag}>
                                    {getLabel(target)}
                                    <span
                                        className={styles.tagClose}
                                        onClick={() => handleRemoveTag(target)}
                                    >
                                        ×
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className={styles.modalContent}>
                    <SummaryTable
                        columns={sourceData.columns.map(col => ({
                            ...col,
                            label: col.label.replace('2026', selectedYear)
                        }))}
                        rows={filteredRows}
                        loading={false}
                    />
                    {filteredRows.length === 0 && (
                        <div style={{
                            padding: '40px',
                            textAlign: 'center',
                            color: '#8c8c8c',
                            backgroundColor: '#fafafa',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            검색하여 항목을 선택해주세요.
                        </div>
                    )}
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
