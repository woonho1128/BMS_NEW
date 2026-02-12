import React, { useState } from 'react';
import styles from '../../pages/DeliveryPlanPage.module.css'; // Shared styles
import { WorkSnapshotAccordion } from '../snapshot/WorkSnapshotAccordion';
import { PlanFilterBar } from '../filters/PlanFilterBar';
import { PlanTable } from '../table/PlanTable';
import { PartialDeliveryModal } from '../modals/PartialDeliveryModal';
import { ChangeHistoryModal } from '../modals/ChangeHistoryModal';
import { DetailModal } from '../modals/DetailModal';
import { SummaryModal } from '../modals/SummaryModal'; // Replaces SummarySlidePanel
import { DeliveryActionModal } from '../modals/DeliveryActionModal'; // New Import

// import { INITIAL_PLAN_ROWS, PLAN_SNAPSHOTS } from '../../data/planDummyData'; // INITIAL_PLAN_ROWS removed
import { PLAN_SNAPSHOTS } from '../../data/planDummyData';

import { usePlanFilter } from '../../hooks/usePlanFilter';
import { useModal } from '../../hooks/useModal';
import { calculateSummary } from '../../utils/summaryUtils';

/**
 * Main Delivery Plan component.
 * Manages the delivery schedule, snapshots, and partial/complete status updates.
 * Uses custom hooks for state management (filters, modals).
 */
export const DeliveryPlan = ({ rows, setRows }) => {
    // const [rows, setRows] = useState(INITIAL_PLAN_ROWS); // Lifted up
    const [selectedSnapshot, setSelectedSnapshot] = useState(PLAN_SNAPSHOTS[0].id);

    // Custom Hooks
    const {
        isExpanded: isFilterExpanded,
        setIsExpanded: setIsFilterExpanded,
        showBidetsOnly,
        setShowBidetsOnly,
        filteredRows
    } = usePlanFilter(rows);

    const partialModal = useModal(null);
    const historyModal = useModal({ field: '', oldValue: '', newValue: '' }); // Uses data for extra fields
    const detailModal = useModal(null);
    const summaryModal = useModal(null); // Data can store 'type'
    const actionModal = useModal(null); // New: Unified Action Modal

    // Summary Calculation
    const summary = calculateSummary(filteredRows);
    const totalQty = summary.qty;
    const totalTon = summary.ton;
    const totalAmt = summary.amount;

    // --- Handlers ---

    // 1. Action Modal Triggers
    const handleOpenAction = (row) => {
        actionModal.open(row);
    };

    const handleActionPartial = (row) => {
        actionModal.close();
        setTimeout(() => partialModal.open(row), 0);
    };

    const handleActionComplete = (row) => {
        actionModal.close();
        handleComplete(row);
    };

    // 2. Partial Delivery Logic
    const handleSavePartial = (rowId, qty, date) => {
        setRows(prevRows => prevRows.map(row => {
            if (row.id === rowId) {
                const remaining = row.qty - qty;
                const newStatus = remaining <= 0 ? '완료' : '부분납품';
                return {
                    ...row,
                    qty: remaining > 0 ? remaining : 0,
                    status: newStatus,
                    partialHistory: [
                        ...(row.partialHistory || []),
                        { date, qty, note: '추가 납품' }
                    ]
                };
            }
            return row;
        }));
        partialModal.close();
    };

    // 3. Complete Logic
    const handleComplete = (row) => {
        if (window.confirm('완료 처리하시겠습니까?')) {
            setRows(prevRows => prevRows.map(r =>
                r.id === row.id ? { ...r, status: '완료' } : r
            ));
        }
    };

    // 4. Cell Edit (History Trigger)
    const handleCellChange = (row, fieldLabel, oldValue, newValue) => {
        if (oldValue == newValue) return;

        historyModal.open({
            row,
            field: fieldLabel,
            oldValue,
            newValue
        });
    };

    const handleSaveHistory = (rowId, field, newValue, reason) => {
        setRows(prevRows => prevRows.map(row => {
            if (row.id === rowId) {
                let key = '';
                // Simple mapping for demo based on column label
                if (field === '납품예정') key = 'deliveryDate';
                else if (field === '입주예정') key = 'moveInDate';
                else if (field === '수량') key = 'qty';
                else if (field === '금액') key = 'amount';

                if (!key) return row;

                return {
                    ...row,
                    [key]: newValue,
                    isChanged: true,
                    changeHistory: [
                        ...(row.changeHistory || []),
                        { field, oldValue, newValue, reason, date: new Date().toISOString() }
                    ]
                };
            }
            return row;
        }));
        historyModal.close();
    };

    // 5. Detail Click
    const handleSiteClick = (row) => {
        detailModal.open(row);
    };

    // 6. Summary Modal Trigger
    const handleOpenSummary = (type) => {
        summaryModal.open(type); // Store type in data
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <WorkSnapshotAccordion
                snapshotMonth={selectedSnapshot}
                onMonthChange={setSelectedSnapshot}
                onCreateSnapshot={() => console.log('Create Snapshot')}
                onSave={() => console.log('Save Snapshot')}
                onOpenSummary={handleOpenSummary}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <PlanFilterBar
                    isExpanded={isFilterExpanded}
                    onToggleExpand={() => setIsFilterExpanded(!isFilterExpanded)}
                    showBidetsOnly={showBidetsOnly}
                    onBidetFilterChange={setShowBidetsOnly}
                />

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '8px 16px',
                    backgroundColor: '#e6f7ff',
                    borderRadius: '4px',
                    border: '1px solid #91d5ff',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0050b3'
                }}>
                    총 수량: {totalQty.toLocaleString()} &nbsp;|&nbsp;
                    총 TON: {totalTon.toFixed(1)} &nbsp;|&nbsp;
                    총 금액: {totalAmt.toLocaleString()}
                </div>
            </div>

            <PlanTable
                rows={filteredRows}
                onCellChange={handleCellChange}
                onAction={handleOpenAction} /* Changed from specific handlers to unified action */
                onSiteClick={handleSiteClick}
            />

            {/* Modals */}
            {actionModal.isOpen && (
                <DeliveryActionModal
                    row={actionModal.data}
                    onClose={actionModal.close}
                    onPartial={handleActionPartial}
                    onComplete={handleActionComplete}
                />
            )}

            {partialModal.isOpen && (
                <PartialDeliveryModal
                    row={partialModal.data}
                    onClose={partialModal.close}
                    onSave={handleSavePartial}
                />
            )}

            {historyModal.isOpen && (
                <ChangeHistoryModal
                    row={historyModal.data?.row}
                    field={historyModal.data?.field}
                    oldValue={historyModal.data?.oldValue}
                    newValue={historyModal.data?.newValue}
                    onClose={historyModal.close}
                    onSave={handleSaveHistory}
                />
            )}

            {detailModal.isOpen && (
                <DetailModal
                    row={detailModal.data}
                    onClose={detailModal.close}
                />
            )}

            {/* Summary Modal */}
            <SummaryModal
                isOpen={summaryModal.isOpen}
                type={summaryModal.data || 'amount'}
                onClose={summaryModal.close}
            />
        </div>
    );
};
