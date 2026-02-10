import React, { useState } from 'react';
import { DataTable } from '../../../shared/components/DataTable/DataTable';
import { Button } from '../../../shared/components/Button/Button';
import { Modal } from '../../../shared/components/Modal/Modal';
import styles from './SalesPage.module.css';

const DUMMY_SALES = [
  { id: 'S001', customer: 'A사', product: '제품 Alpha', amount: '₩ 50,000,000', date: '2025-01-28', status: '완료' },
  { id: 'S002', customer: 'B사', product: '제품 Beta', amount: '₩ 30,000,000', date: '2025-01-27', status: '진행중' },
  { id: 'S003', customer: 'C사', product: '제품 Gamma', amount: '₩ 75,000,000', date: '2025-01-26', status: '대기' },
  { id: 'S004', customer: 'D사', product: '제품 Alpha', amount: '₩ 20,000,000', date: '2025-01-25', status: '완료' },
  { id: 'S005', customer: 'E사', product: '제품 Beta', amount: '₩ 45,000,000', date: '2025-01-24', status: '진행중' },
];

const COLUMNS = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

export function SalesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sales</h1>
        <p className={styles.subtitle}>Register, view, and manage sales records</p>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + Add record
          </Button>
          <Button variant="secondary">Export (dummy)</Button>
        </div>
      </div>
      <DataTable
        columns={COLUMNS}
        rows={DUMMY_SALES}
        filterPlaceholder="Search sales..."
        onRowClick={(row) => setSelectedRow(row)}
      />
      {selectedRow && (
        <Modal
          open={!!selectedRow}
          onClose={() => setSelectedRow(null)}
          title="Sales detail (dummy)"
          size="md"
        >
          <pre className={styles.detailJson}>{JSON.stringify(selectedRow, null, 2)}</pre>
        </Modal>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add sales record (dummy)" size="md">
        <p>Form placeholder — Add record</p>
      </Modal>
    </div>
  );
}
