import React from 'react';
import { Table } from 'antd';
import { Pagination } from '../../../../shared/components/Pagination/Pagination';

export default function DiscountClientRateTab({
  styles,
  clientColumns,
  pagedClientDiscount,
  clientTotalCount,
  clientCurrentPage,
  clientPageSize,
  setClientPage,
  setClientPageSize,
}) {
  return (
    <div className={styles.tabTableSection}>
      <Table
        columns={clientColumns}
        dataSource={pagedClientDiscount}
        bordered
        size="small"
        pagination={false}
        scroll={{ x: 'max-content' }}
        className={styles.gridTable}
      />

      <Pagination
        className={styles.pagination}
        totalCount={clientTotalCount}
        currentPage={clientCurrentPage}
        pageSize={clientPageSize}
        onPageChange={setClientPage}
        onPageSizeChange={setClientPageSize}
      />
    </div>
  );
}
