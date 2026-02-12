import { useState, useMemo } from 'react';

/**
 * Hook for filtering delivery plan rows.
 * @param {Array} rows - Original data rows.
 * @returns {Object} { filters, setFilters, filteredRows }
 */
export const usePlanFilter = (rows) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showBidetsOnly, setShowBidetsOnly] = useState(false);

    const filteredRows = useMemo(() => {
        if (!showBidetsOnly) return rows;
        return rows.filter(row =>
            (row.item1 && row.item1.includes('비데')) ||
            (row.item2 && row.item2.includes('비데'))
        );
    }, [rows, showBidetsOnly]);

    return {
        isExpanded,
        setIsExpanded,
        showBidetsOnly,
        setShowBidetsOnly,
        filteredRows
    };
};
