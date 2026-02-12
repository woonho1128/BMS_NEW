/**
 * Utility functions for summary calculations.
 */

/**
 * Calculates total Quantity, Tonnage, and Amount from a list of rows.
 * @param {Array} rows - List of delivery items.
 * @returns {Object} { qty, ton, amount }
 */
export const calculateSummary = (rows) => {
    if (!rows || rows.length === 0) {
        return { qty: 0, ton: 0, amount: 0 };
    }

    return rows.reduce((acc, row) => ({
        qty: acc.qty + (Number(row.qty) || 0),
        ton: acc.ton + (Number(row.totalWeightTon) || 0),
        amount: acc.amount + (Number(row.amount) || 0)
    }), { qty: 0, ton: 0, amount: 0 });
};

/**
 * Formats a number with commas.
 * @param {number} num 
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    if (num === 0 || num === null || num === undefined) return '0';
    return num.toLocaleString();
};
