import styles from './SummaryTable.module.css';

const getRowAnchorId = (value) => {
    const safe = encodeURIComponent(String(value || '').trim());
    return safe ? `summary-anchor-${safe}` : undefined;
};

export const SummaryTable = ({ columns, rows }) => {
    // Calculate sticky offsets
    const getLeftOffset = (index) => {
        let offset = 0;
        for (let i = 0; i < index; i++) {
            if (columns[i].fixed === 'left') {
                offset += columns[i].width || 100;
            }
        }
        return offset;
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <colgroup>
                    {columns.map((col) => (
                        <col key={col.key} style={{ width: col.width || 'auto' }} />
                    ))}
                </colgroup>
                <thead>
                    <tr>
                        {columns.map((col, idx) => {
                            // Determine classes
                            const classNames = [styles.th];
                            if (col.fixed === 'left') classNames.push(styles.thStickyLeft);
                            if (col.isTotal) classNames.push(styles.thTotal);

                            return (
                                <th
                                    key={col.key}
                                    className={classNames.join(' ')}
                                    style={{
                                        textAlign: col.align || 'center',
                                        left: col.fixed === 'left' ? getLeftOffset(idx) : undefined
                                    }}
                                >
                                    {col.label}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => {
                        // Check for row spanning
                        const isGroupStart =
                            rowIndex === 0 ||
                            row.groupKey !== rows[rowIndex - 1].groupKey ||
                            !row.groupKey;

                        const anchorKey = row.groupKey || row.keyLabel;
                        const anchorId = isGroupStart && anchorKey ? getRowAnchorId(anchorKey) : undefined;

                        return (
                            <tr key={row.id} id={anchorId}>
                                {columns.map((col, colIndex) => {
                                    const cellValue = row[col.key];

                                    // Skip rendering if it's a spanned column not at start
                                    if (col.key === 'keyLabel' && row.groupKey && !isGroupStart) {
                                        return null;
                                    }

                                    const rowSpan =
                                        col.key === 'keyLabel' && row.groupKey && isGroupStart ? 2 : 1;

                                    // Determine classes
                                    const cellClasses = [styles.td];
                                    if (col.fixed === 'left') cellClasses.push(styles.tdStickyLeft);
                                    if (col.isTotal) cellClasses.push(styles.tdTotal);
                                    if (row.isHighlighted) cellClasses.push(styles.tdHighlighted);
                                    if (row.isTotalRow) {
                                        // Total row overrides some highlights usually, but we want bold
                                        cellClasses.push(styles.tdTotalRow);
                                    }

                                    // Dynamic style for background color priority
                                    // Logic: Total Row > Specific Highlight > Total Column > Normal
                                    // Sticky columns need specific background handling because they float
                                    const style = {
                                        textAlign: col.align || 'left',
                                        left: col.fixed === 'left' ? getLeftOffset(colIndex) : undefined
                                    };

                                    // For sticky columns, we must visually enforce the background color 
                                    // to prevent transparency issues
                                    if (col.fixed === 'left') {
                                        if (row.isTotalRow) style.backgroundColor = '#f7faff';
                                        else if (row.isHighlighted) style.backgroundColor = '#fffbe6';
                                        else style.backgroundColor = '#fff';
                                    }

                                    return (
                                        <td
                                            key={`${row.id}-${col.key}`}
                                            className={cellClasses.join(' ')}
                                            rowSpan={rowSpan}
                                            style={style}
                                        >
                                            {cellValue === 0 || cellValue === null ? '-' :
                                                (typeof cellValue === 'number' ? cellValue.toLocaleString() : cellValue)}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
