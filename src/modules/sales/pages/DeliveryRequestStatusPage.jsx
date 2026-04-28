import React from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Table } from 'antd';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { formatNumber } from '../../../shared/utils/formatters';
import {
  STATUS_COLORS,
  useDeliveryRequestStatusData,
} from './useDeliveryRequestStatusData';
import styles from './DeliveryRequestStatusPage.module.css';

function fmt(n) {
  return formatNumber(Number(n || 0));
}

export function DeliveryRequestStatusPage() {
  const { pathname } = useLocation();
  const {
    selectedDeliveryNo,
    setSelectedDeliveryNo,
    filterValue,
    onChange,
    onReset,
    fields,
    filteredRows,
    chartBars,
    detailRows,
  } = useDeliveryRequestStatusData();

  const columns = [
    {
      title: '출고번호',
      dataIndex: 'deliveryNo',
      width: 150,
      fixed: 'left',
      render: (value) => (
        <button type="button" className={styles.deliveryNoButton} onClick={() => setSelectedDeliveryNo(value)}>
          {value}
        </button>
      ),
    },
    { title: '진행상태', dataIndex: 'status', width: 90 },
    { title: '거래처코드', dataIndex: 'customerCode', width: 90 },
    { title: '거래처명', dataIndex: 'customerName', width: 220 },
    { title: '공장명', dataIndex: 'factory', width: 130 },
    { title: '출고예정', dataIndex: 'requestDate', width: 110 },
    { title: '금액', dataIndex: 'amount', width: 110, align: 'right', render: fmt },
    { title: '부가세', dataIndex: 'vat', width: 90, align: 'right', render: fmt },
    { title: '영업그룹', dataIndex: 'salesGroup', width: 90 },
    { title: '운송방법', dataIndex: 'transportMethod', width: 110 },
    { title: '출하형태', dataIndex: 'shippingType', width: 120 },
    { title: '도착지', dataIndex: 'destination', width: 260 },
    { title: '입력', dataIndex: 'inputUser', width: 80 },
    { title: '수정', dataIndex: 'modifiedBy', width: 80 },
    { title: '수정시간', dataIndex: 'modifiedAt', width: 110 },
    { title: '승인', dataIndex: 'approvedBy', width: 80 },
    { title: '승인서명', dataIndex: 'signedBy', width: 90 },
  ];

  const detailColumns = [
    { title: 'No.', dataIndex: 'no', width: 60, align: 'center' },
    { title: '참고명', dataIndex: 'refName', width: 120 },
    { title: '품목코드', dataIndex: 'itemCode', width: 140 },
    { title: '품목명', dataIndex: 'itemName', width: 160 },
    { title: '스펙', dataIndex: 'spec', width: 220 },
    { title: '수량', dataIndex: 'qty', width: 80, align: 'right', render: fmt },
    { title: '단가', dataIndex: 'unitPrice', width: 90, align: 'right', render: fmt },
    { title: '금액', dataIndex: 'amount', width: 110, align: 'right', render: fmt },
    { title: '부가세', dataIndex: 'vat', width: 90, align: 'right', render: fmt },
    { title: '부가세명', dataIndex: 'vatName', width: 120 },
    { title: '비고', dataIndex: 'note', width: 200 },
  ];

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <ListFilter
          className={styles.toolbar}
          fields={fields}
          value={filterValue}
          onChange={onChange}
          onReset={onReset}
          onSearch={() => {}}
          searchLabel="조회"
        />

        <div className={styles.chartCard}>
          <p className={styles.chartGuide}>아래 그래프는 출고예정일/출하상태 조건의 비율을 보여줍니다.</p>
          <div className={styles.chartWrap}>
            <div className={styles.chartBars}>
              {chartBars.map((bar) => (
                <div key={bar.day} className={styles.barCol}>
                  <div className={styles.barStack}>
                    {bar.segments
                      .filter((s) => s.percent > 0)
                      .map((s) => (
                        <div
                          key={s.status}
                          className={styles.barSeg}
                          style={{ height: `${s.percent}%`, background: STATUS_COLORS[s.status] }}
                          title={`${s.status} ${s.percent.toFixed(0)}%`}
                        />
                      ))}
                  </div>
                  <span className={styles.barLabel}>{bar.day.slice(5)}</span>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              {Object.entries(STATUS_COLORS).map(([key, color]) => (
                <div key={key} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: color }} />
                  <span>{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableTop}>
            <span className={styles.tableTitle}>출고 요청 목록</span>
            <span className={styles.tableCount}>총 {filteredRows.length}건</span>
          </div>
          <Table
            columns={columns}
            dataSource={filteredRows}
            size="small"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 2500, y: 390 }}
            className={`${styles.statusTable} ${styles.desktopTable}`}
            rowKey="key"
          />
          <div className={styles.mobileList}>
            {filteredRows.length === 0 ? (
              <div className={styles.mobileEmpty}>조회 결과가 없습니다.</div>
            ) : (
              filteredRows.map((row) => (
                <article
                  key={`mobile-${row.key}`}
                  className={styles.mobileCard}
                  onClick={() => setSelectedDeliveryNo(row.deliveryNo)}
                >
                  <div className={styles.mobileHead}>
                    <button
                      type="button"
                      className={styles.deliveryNoButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeliveryNo(row.deliveryNo);
                      }}
                    >
                      {row.deliveryNo}
                    </button>
                    <span className={styles.mobileStatus} style={{ background: STATUS_COLORS[row.status] || '#7a7a7a' }}>
                      {row.status}
                    </span>
                  </div>
                  <div className={styles.mobileCustomer}>{row.customerName}</div>
                  <div className={styles.mobileMetaGrid}>
                    <div className={styles.mobileMetaItem}>
                      <span>공장</span>
                      <strong>{row.factory}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>출고예정</span>
                      <strong>{row.requestDate}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>금액</span>
                      <strong>{fmt(row.amount)}</strong>
                    </div>
                    <div className={styles.mobileMetaItem}>
                      <span>부가세</span>
                      <strong>{fmt(row.vat)}</strong>
                    </div>
                  </div>
                  <div className={styles.mobileDestination}>{row.destination}</div>
                </article>
              ))
            )}
          </div>
        </div>

        <Modal
          title={selectedDeliveryNo ? `출고번호 상세 - ${selectedDeliveryNo}` : '출고번호 상세'}
          open={Boolean(selectedDeliveryNo)}
          onCancel={() => setSelectedDeliveryNo(null)}
          footer={null}
          width="92vw"
          centered
          style={{ maxWidth: 1500 }}
          className={styles.detailModal}
        >
          <Table
            columns={detailColumns}
            dataSource={detailRows}
            size="small"
            pagination={false}
            scroll={{ x: 1300, y: 360 }}
            className={styles.detailTable}
            locale={{ emptyText: '상세 데이터가 없습니다.' }}
            rowKey="key"
          />
        </Modal>
      </div>
    </PageShell>
  );
}

export default DeliveryRequestStatusPage;
