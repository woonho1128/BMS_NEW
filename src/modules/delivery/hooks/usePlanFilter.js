import { useState, useMemo } from 'react';

/**
 * Hook for filtering delivery plan rows.
 * @param {Array} rows - Original data rows.
 * @returns {Object} { filters, setFilters, filteredRows }
 */
export const usePlanFilter = (rows) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showBidetsOnly, setShowBidetsOnly] = useState(false);
    const [remarksSearch, setRemarksSearch] = useState('');

    const filteredRows = useMemo(() => {
        let result = rows;

        if (showBidetsOnly) {
            result = result.filter(row =>
                (row.item1 && row.item1.includes('비데')) ||
                (row.item2 && row.item2.includes('비데'))
            );
        }

        if (remarksSearch.trim() !== '') {
            const keyword = remarksSearch.toLowerCase().trim();
            result = result.filter(row => 
                row.memo && row.memo.toLowerCase().includes(keyword)
            );
        }

        return result;
    }, [rows, showBidetsOnly, remarksSearch]);

    return {
        isExpanded,
        setIsExpanded,
        showBidetsOnly,
        setShowBidetsOnly,
        remarksSearch,
        setRemarksSearch,
        filteredRows
    };
};
