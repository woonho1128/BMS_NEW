import { useMemo, useState } from 'react';
import { ModificationPeriod } from '../snapshot/ModificationPeriod';
import { PlanFilterBar } from '../filters/PlanFilterBar';
import { PlanTable } from '../table/PlanTable';
import { PartialDeliveryModal } from '../modals/PartialDeliveryModal';
import { ChangeHistoryModal } from '../modals/ChangeHistoryModal';
import { DetailModal } from '../modals/DetailModal';
import { SummaryModal } from '../modals/SummaryModal';
import { DeliveryActionModal } from '../modals/DeliveryActionModal';
import { usePlanFilter } from '../../hooks/usePlanFilter';
import { useModal } from '../../hooks/useModal';
import { calculateSummary } from '../../utils/summaryUtils';

export const DeliveryPlan = ({ rows, setRows }) => {
  const {
    isExpanded: isFilterExpanded,
    setIsExpanded: setIsFilterExpanded,
    filters,
    handleFilterChange,
    handleSearch,
    handleReset,
    filteredRows,
  } = usePlanFilter(rows);

  const [tableView, setTableView] = useState({
    category: '',
    periodType: 'monthly',
    year: '',
    month: '',
    sortBy: 'item1',
    sortOrder: 'asc',
  });

  const yearOptions = useMemo(() => {
    return Array.from(
      new Set(
        rows
          .map((row) => String(row.deliveryDate || '').slice(0, 4))
          .filter((year) => /^\d{4}$/.test(year))
      )
    ).sort((a, b) => Number(b) - Number(a));
  }, [rows]);

  const partialModal = useModal(null);
  const historyModal = useModal({ field: '', oldValue: '', newValue: '' });
  const detailModal = useModal(null);
  const summaryModal = useModal(null);
  const actionModal = useModal(null);

  const summary = calculateSummary(filteredRows);
  const totalQty = summary.qty;
  const totalTon = summary.ton;
  const totalAmt = summary.amount;

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

  const handleActionCancel = (row) => {
    actionModal.close();
    handleCancel(row);
  };

  const handleSavePartial = (rowId, qty, date) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          const remaining = row.qty - qty;
          const newStatus = remaining <= 0 ? '완료' : '부분납품';
          return {
            ...row,
            qty: remaining > 0 ? remaining : 0,
            status: newStatus,
            partialHistory: [...(row.partialHistory || []), { date, qty, note: '추가 납품' }],
          };
        }
        return row;
      })
    );
    partialModal.close();
  };

  const handleComplete = (row) => {
    if (window.confirm('완료 처리하시겠습니까?')) {
      setRows((prevRows) => prevRows.map((r) => (r.id === row.id ? { ...r, status: '완료' } : r)));
    }
  };

  const handleCancel = (row) => {
    if (window.confirm('납품 계획을 취소하시겠습니까?')) {
      setRows((prevRows) => prevRows.map((r) => (r.id === row.id ? { ...r, status: '취소' } : r)));
    }
  };

  const handleCellChange = (row, fieldLabel, oldValue, newValue) => {
    if (oldValue === newValue) return;

    historyModal.open({
      row,
      field: fieldLabel,
      oldValue,
      newValue,
    });
  };

  const handleSaveHistory = (rowId, field, newValue, reason) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === rowId) {
          let key = '';
          if (field === '납품예정') key = 'deliveryDate';
          else if (field === '입주예정') key = 'moveInDate';
          else if (field === '수량') key = 'qty';
          else if (field === '금액') key = 'amount';

          if (!key) return row;

          const oldVal = historyModal.data?.oldValue || '';

          return {
            ...row,
            [key]: newValue,
            isChanged: true,
            changeHistory: [
              ...(row.changeHistory || []),
              { field, oldValue: oldVal, newValue, reason, date: new Date().toISOString() },
            ],
          };
        }
        return row;
      })
    );
    historyModal.close();
  };

  const handleSiteClick = (row) => {
    detailModal.open(row);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ModificationPeriod />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <PlanFilterBar
          isExpanded={isFilterExpanded}
          onToggleExpand={() => setIsFilterExpanded(!isFilterExpanded)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px 16px',
            backgroundColor: '#edf4ff',
            borderRadius: '8px',
            border: '1px solid #bcd4fb',
            fontSize: '13px',
            fontWeight: 600,
            color: '#1f64d8',
          }}
        >
          총 수량: {totalQty.toLocaleString()}&nbsp;|&nbsp;총 TON: {totalTon.toFixed(1)}&nbsp;|&nbsp;총 금액:{' '}
          {totalAmt.toLocaleString()}
        </div>
      </div>

      <PlanTable
        rows={filteredRows}
        tableView={tableView}
        yearOptions={yearOptions}
        onTableViewChange={(key, value) => setTableView((prev) => ({ ...prev, [key]: value }))}
        onCellChange={handleCellChange}
        onAction={handleOpenAction}
        onSiteClick={handleSiteClick}
      />

      {actionModal.isOpen && (
        <DeliveryActionModal
          row={actionModal.data}
          onClose={actionModal.close}
          onPartial={handleActionPartial}
          onComplete={handleActionComplete}
          onCancel={handleActionCancel}
        />
      )}

      {partialModal.isOpen && (
        <PartialDeliveryModal row={partialModal.data} onClose={partialModal.close} onSave={handleSavePartial} />
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

      {detailModal.isOpen && <DetailModal row={detailModal.data} onClose={detailModal.close} />}

      {summaryModal.isOpen && <SummaryModal onClose={summaryModal.close} />}
    </div>
  );
};
