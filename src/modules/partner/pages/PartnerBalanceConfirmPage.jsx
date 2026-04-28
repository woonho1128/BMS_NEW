import React, { useMemo, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Modal, Table } from 'antd';
import { Download } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  buildMainColumns,
  buildYearReceiptRows,
  CREDIT_GROUP_OPTIONS,
  DETAIL_COLUMNS,
  fmt,
  getReceiptTypeLabel,
  MAIN_ROWS,
  MONTH_OPTIONS,
  MONTHLY_DETAIL,
  RECEIPT_YEAR_COLUMNS,
  YEAR_OPTIONS,
} from './partnerBalanceConfirm.helpers';
import styles from './PartnerBalanceConfirmPage.module.css';

export function PartnerBalanceConfirmPage() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [selectedClient, setSelectedClient] = useState(null);
  const [receiptYearModal, setReceiptYearModal] = useState(null);
  const [filterValue, setFilterValue] = useState({
    year: '2026',
    month: '03',
    creditGroup: 'ALL',
    clientCode: '',
    clientName: '',
    clientLike: '',
  });

  const onChange = useCallback((id, value) => {
    setFilterValue((prev) => ({ ...prev, [id]: value }));
  }, []);

  const onReset = useCallback(() => {
    setFilterValue({ year: '2026', month: '03', creditGroup: 'ALL', clientCode: '', clientName: '', clientLike: '' });
  }, []);

  const fields = useMemo(
    () => [
      { id: 'year', label: '기준년월', type: 'select', options: YEAR_OPTIONS, width: 110, row: 0 },
      { id: 'month', label: '', type: 'select', options: MONTH_OPTIONS, width: 90, row: 0 },
      { id: 'creditGroup', label: '여신구분', type: 'radio', options: CREDIT_GROUP_OPTIONS, row: 1 },
      { id: 'clientCode', label: '거래처코드', type: 'text', row: 0 },
      { id: 'clientName', label: '거래처', type: 'text', wide: true, row: 0 },
      { id: 'clientLike', label: '거래처(like)', type: 'text', wide: true, row: 1 },
    ],
    []
  );

  const isAgencyRole = user?.role === 'AGENCY' || user?.role === 'PARTNER' || user?.role === 'DEALER';
  const userKey = String(user?.name || '').toLowerCase();
  const isSalesManagerAccount =
    !isAgencyRole &&
    (String(user?.position || '').includes('영업') || userKey.includes('sales') || userKey.includes('영업'));

  const rowsByAccount = useMemo(() => {
    if (isAgencyRole) {
      return MAIN_ROWS.filter((row) => row.partnerId === String(user?.partnerId || ''));
    }
    if (isSalesManagerAccount) {
      const key = userKey.trim();
      return MAIN_ROWS.filter(
        (row) =>
          String(row.salesManagerKey || '').toLowerCase().includes(key) ||
          (key.includes('sales') && row.salesManagerKey === 'sales-kim')
      );
    }
    return MAIN_ROWS;
  }, [isAgencyRole, isSalesManagerAccount, user?.partnerId, userKey]);

  const filteredRows = useMemo(
    () =>
      rowsByAccount.filter((r) => {
        if (
          filterValue.creditGroup !== 'ALL' &&
          r.creditGroup !== (filterValue.creditGroup === 'SALES' ? '세일즈부문' : '바스플랜부문')
        )
          return false;
        if (filterValue.clientCode && !r.code.includes(filterValue.clientCode)) return false;
        if (filterValue.clientName && !r.clientName.includes(filterValue.clientName)) return false;
        if (filterValue.clientLike && !r.clientName.includes(filterValue.clientLike)) return false;
        return true;
      }),
    [filterValue, rowsByAccount]
  );

  const openReceiptYearModal = useCallback((row, amount, itemType) => {
    setReceiptYearModal({
      row,
      itemType,
      amount: Number(amount || 0),
    });
  }, []);

  const receiptYearRows = useMemo(() => {
    if (!receiptYearModal) return [];
    return buildYearReceiptRows(
      receiptYearModal.row,
      filterValue.year,
      filterValue.month,
      receiptYearModal.itemType,
      receiptYearModal.amount
    );
  }, [receiptYearModal, filterValue.year, filterValue.month]);

  const receiptYearTotal = useMemo(
    () => receiptYearRows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
    [receiptYearRows]
  );

  const mainColumns = useMemo(
    () => buildMainColumns(styles, setSelectedClient, openReceiptYearModal),
    [openReceiptYearModal]
  );

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <div className={styles.logicCard}>
          <div className={styles.logicTitle}>조회 권한(목업)</div>
          <div className={styles.logicText}>
            {isAgencyRole
              ? '대리점 계정: 본인 대리점 내역만 표시됩니다.'
              : isSalesManagerAccount
                ? '영업 담당자 계정: 내가 담당 중인 거래처만 표시됩니다.'
                : '본사 계정: 전체 거래처 내역이 표시됩니다.'}
          </div>
        </div>

        <ListFilter fields={fields} value={filterValue} onChange={onChange} onReset={onReset} onSearch={() => {}} searchLabel="조회" />

        <div className={styles.logicCard}>
          <div className={styles.logicTitle}>계산로직</div>
          <div className={styles.logicText}>당월 외상매출금 = 전월외상 + 당월출고 - 당월수금 / 여신한도 = 거래한도 - 당월 외상매출금 - 미결제어음(자수+타수)</div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableTop}>
            <span className={styles.tableTitle}>채권채무잔액 확인서</span>
            <Button size="small" icon={<Download size={14} />} className={styles.downloadBtn}>다운로드</Button>
          </div>
          <Table
            columns={mainColumns}
            dataSource={filteredRows}
            size="small"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 2800, y: 460 }}
            rowKey="key"
            className={styles.mainTable}
          />
        </div>

        <Modal
          title={
            receiptYearModal
              ? `${filterValue.year}년 수금금액 - ${receiptYearModal.row.clientName} (${getReceiptTypeLabel(receiptYearModal.itemType)})`
              : `${filterValue.year}년 수금금액`
          }
          open={Boolean(receiptYearModal)}
          onCancel={() => setReceiptYearModal(null)}
          footer={null}
          width={780}
          centered
          className={styles.detailModal}
        >
          {receiptYearModal && (
            <div className={styles.detailTop}>
              <div>거래처코드: {receiptYearModal.row.code}</div>
              <div>기준년월: {filterValue.year}-{filterValue.month}</div>
              <div>선택값: {fmt(receiptYearModal.amount)}</div>
            </div>
          )}
          <Table
            columns={RECEIPT_YEAR_COLUMNS}
            dataSource={receiptYearRows}
            size="small"
            pagination={false}
            rowKey="key"
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} align="center">합계</Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">{fmt(receiptYearTotal)}</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
            className={styles.detailTable}
          />
        </Modal>

        <Modal
          title={selectedClient ? `거래처 상세 - ${selectedClient.clientName}` : '거래처 상세'}
          open={Boolean(selectedClient)}
          onCancel={() => setSelectedClient(null)}
          footer={null}
          width="92vw"
          style={{ maxWidth: 1500 }}
          centered
          className={styles.detailModal}
        >
          {selectedClient && (
            <div className={styles.detailTop}>
              <div>코드: {selectedClient.code}</div>
              <div>대표자: {selectedClient.ceo}</div>
              <div>영업그룹: {selectedClient.salesGroup}</div>
            </div>
          )}
          <Table
            columns={DETAIL_COLUMNS}
            dataSource={MONTHLY_DETAIL}
            size="small"
            pagination={false}
            scroll={{ x: 900, y: 320 }}
            rowKey="key"
            className={styles.detailTable}
          />
        </Modal>
      </div>
    </PageShell>
  );
}

export default PartnerBalanceConfirmPage;
