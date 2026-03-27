import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ListFilter } from '../../../shared/components/ListFilter/ListFilter';
import { Drawer } from '../../../shared/components/Drawer/Drawer';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  MOCK_DELIVERY_HISTORY,
  DELIVERY_STATUS,
  getDeliveryHistoryById,
  FACTORY_OPTIONS,
  SHIPPING_TYPE_OPTIONS,
  TRANSPORT_METHOD_OPTIONS,
  SALES_ORG_OPTIONS,
  SALES_GROUP_OPTIONS,
} from '../data/deliveryHistoryMock';
import { classnames } from '../../../shared/utils/classnames';
import { X } from 'lucide-react';
import styles from './DeliveryHistoryPage.module.css';

const STATUS_ALL = 'all';
const STATUS_TABS = [
  { key: STATUS_ALL, label: '전체' },
  { key: DELIVERY_STATUS.PICKING, label: 'Picking' },
  { key: DELIVERY_STATUS.PENDING, label: '출고대기' },
  { key: DELIVERY_STATUS.COMPLETED, label: '출고완료' },
  { key: DELIVERY_STATUS.REJECTED, label: '반려' },
];

function formatCurrency(n) {
  if (n == null || n === '') return '—';
  return Number(n).toLocaleString();
}

function getStatusLabel(status) {
  const tab = STATUS_TABS.find((t) => t.key === status);
  return tab?.label ?? status;
}

function getStatusBadgeClass(status) {
  switch (status) {
    case DELIVERY_STATUS.COMPLETED:
      return styles.statusCompleted;
    case DELIVERY_STATUS.PENDING:
      return styles.statusPending;
    case DELIVERY_STATUS.PICKING:
      return styles.statusPicking;
    case DELIVERY_STATUS.REJECTED:
      return styles.statusRejected;
    default:
      return '';
  }
}

export function DeliveryHistoryPage() {
  const { user } = useAuth();
  const [statusTab, setStatusTab] = useState(STATUS_ALL);
  // 사용자 소속 정보 (실제 연동 시 user.salesOrg, user.salesGroup 사용)
  const userSalesOrg = user?.salesOrg || '영업1부';
  const userSalesGroup = user?.salesGroup || '영업1팀';

  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    factory: '',
    customer: '',
    shippingType: '',
    transportMethod: '',
    salesOrg: userSalesOrg,
    salesGroup: userSalesGroup,
  });
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // 기본 필터: 로그인 사용자와 일치하는 입력자만 표시
  // 실제 연동 시 user.name 또는 user.id와 inputUser를 매칭
  const defaultFiltered = useMemo(() => {
    if (!user) return MOCK_DELIVERY_HISTORY;
    const userName = user.name || '사용자';
    // MOCK_USER의 name이 '사용자'이므로, Mock 데이터의 '김영업'과 매칭되도록 임시 처리
    // 실제 연동 시: return MOCK_DELIVERY_HISTORY.filter((item) => item.inputUser === userName);
    return MOCK_DELIVERY_HISTORY.filter((item) => {
      // Mock 데이터에서 '김영업' 입력자만 기본 표시 (실제 연동 시 user.name과 매칭)
      return item.inputUser === '김영업';
    });
  }, [user]);

  // 필터 적용
  const filteredData = useMemo(() => {
    let result = [...defaultFiltered];

    // 상태 탭 필터
    if (statusTab !== STATUS_ALL) {
      result = result.filter((item) => item.status === statusTab);
    }

    // 날짜 필터
    if (filters.dateFrom) {
      result = result.filter((item) => item.deliveryDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((item) => item.deliveryDate <= filters.dateTo);
    }

    // 공장 필터
    if (filters.factory) {
      result = result.filter((item) => item.factory === filters.factory);
    }

    // 거래처 필터
    if (filters.customer) {
      result = result.filter((item) => item.customer.includes(filters.customer));
    }

    // 출하형태 필터
    if (filters.shippingType) {
      result = result.filter((item) => item.shippingType === filters.shippingType);
    }

    // 운송방법 필터
    if (filters.transportMethod) {
      result = result.filter((item) => item.transportMethod === filters.transportMethod);
    }

    // 영업조직 필터
    if (filters.salesOrg) {
      result = result.filter((item) => item.salesOrg === filters.salesOrg);
    }

    // 영업그룹 필터
    if (filters.salesGroup) {
      result = result.filter((item) => item.salesGroup === filters.salesGroup);
    }

    return result;
  }, [defaultFiltered, statusTab, filters]);

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleFilterReset = useCallback(() => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      factory: '',
      customer: '',
      shippingType: '',
      transportMethod: '',
      salesOrg: userSalesOrg,
      salesGroup: userSalesGroup,
    });
    setStatusTab(STATUS_ALL);
  }, [userSalesOrg, userSalesGroup]);

  const handleSearch = useCallback(() => {
    // 필터 적용은 useMemo에서 자동 처리됨
  }, []);

  const handleDeliveryClick = useCallback((item) => {
    setSelectedDelivery(item);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedDelivery(null);
  }, []);

  const filterFields = [
    {
      id: 'salesOrg',
      label: '영업조직',
      type: 'select',
      options: SALES_ORG_OPTIONS,
      row: 0,
    },
    {
      id: 'salesGroup',
      label: '영업그룹',
      type: 'select',
      options: SALES_GROUP_OPTIONS,
      row: 0,
    },
    {
      id: 'dateRange',
      label: '출고예정일',
      type: 'dateRange',
      fromKey: 'dateFrom',
      toKey: 'dateTo',
      row: 0,
    },
    {
      id: 'customer',
      label: '거래처',
      type: 'text',
      placeholder: '거래처명 입력',
      row: 1,
    },
    {
      id: 'factory',
      label: '공장',
      type: 'select',
      options: FACTORY_OPTIONS,
      row: 1,
    },
    {
      id: 'shippingType',
      label: '출하형태',
      type: 'select',
      options: SHIPPING_TYPE_OPTIONS,
      row: 1,
    },
    {
      id: 'transportMethod',
      label: '운송방법',
      type: 'select',
      options: TRANSPORT_METHOD_OPTIONS,
      row: 1,
    },
  ];

  useEffect(() => {
    if (selectedDelivery) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [selectedDelivery]);

  return (
    <PageShell
      path="/delivery/history"
      description="출고 내역을 조회하고 상세 정보를 확인할 수 있습니다."
    >
      <div className={styles.wrapper}>
        {/* 세그먼트 탭 */}
        <div className={styles.tabList} role="tablist">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={statusTab === tab.key}
              className={classnames(styles.tab, statusTab === tab.key && styles.tabActive)}
              onClick={() => setStatusTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 필터 영역 */}
        <ListFilter
          fields={filterFields}
          value={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
          onSearch={handleSearch}
        />

        {/* 테이블 영역 */}
        <div className={styles.tableContainer}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={classnames(styles.th, styles.thSticky, styles.thDeliveryNo)}>출고번호</th>
                  <th className={classnames(styles.th, styles.thSticky, styles.thDate)}>출고예정일</th>
                  <th className={classnames(styles.th, styles.thSticky, styles.thCustomer)}>거래처명</th>
                  <th className={classnames(styles.th, styles.thSticky, styles.thSite)}>현장명</th>
                  <th className={classnames(styles.th, styles.thSticky, styles.thShippingType)}>출하형태</th>
                  <th className={classnames(styles.th, styles.thSticky, styles.thTransport)}>운송방법</th>
                  <th className={classnames(styles.th, styles.thSticky, styles.thRight, styles.thAmount)}>금액</th>
                  <th className={classnames(styles.th, styles.thSticky, styles.thRight, styles.thVat)}>부가세</th>
                  <th className={classnames(styles.th, styles.thSticky, styles.thInputUser)}>입력자</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.emptyCell}>
                      출고 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className={styles.row}>
                      <td className={styles.td}>
                        <button
                          type="button"
                          className={styles.deliveryNoLink}
                          onClick={() => handleDeliveryClick(item)}
                        >
                          {item.deliveryNo}
                        </button>
                      </td>
                      <td className={styles.td}>{item.deliveryDate}</td>
                      <td className={styles.td}>{item.customer}</td>
                      <td className={styles.td}>{item.siteName}</td>
                      <td className={styles.td}>
                        <span className={classnames(styles.statusBadge, getStatusBadgeClass(item.status))}>
                          {item.shippingType}
                        </span>
                      </td>
                      <td className={styles.td}>{item.transportMethod}</td>
                      <td className={classnames(styles.td, styles.tdRight)}>{formatCurrency(item.amount)}</td>
                      <td className={classnames(styles.td, styles.tdRight)}>{formatCurrency(item.vat)}</td>
                      <td className={styles.td}>{item.inputUser}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 상세 Drawer */}
      <Drawer
        open={Boolean(selectedDelivery)}
        onClose={handleCloseDrawer}
        width="50%"
      >
        {selectedDelivery && (
          <>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>출고 상세</h2>
              <button
                type="button"
                className={styles.drawerClose}
                onClick={handleCloseDrawer}
                aria-label="닫기"
              >
                <X size={22} strokeWidth={2} />
              </button>
            </div>
            <div className={styles.drawerContent}>
              <div className={styles.detailGrid}>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>출고번호</span>
                  <span className={styles.detailValue}>{selectedDelivery.deliveryNo}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>출고예정일</span>
                  <span className={styles.detailValue}>{selectedDelivery.deliveryDate}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>공장명</span>
                  <span className={styles.detailValue}>{selectedDelivery.factory}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>거래처명</span>
                  <span className={styles.detailValue}>{selectedDelivery.customer}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>거래처 코드</span>
                  <span className={styles.detailValue}>{selectedDelivery.customerCode}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>영업조직</span>
                  <span className={styles.detailValue}>{selectedDelivery.salesOrg}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>영업그룹</span>
                  <span className={styles.detailValue}>{selectedDelivery.salesGroup}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>출하형태</span>
                  <span className={styles.detailValue}>
                    <span className={classnames(styles.statusBadge, getStatusBadgeClass(selectedDelivery.status))}>
                      {selectedDelivery.shippingType}
                    </span>
                  </span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>운송방법</span>
                  <span className={styles.detailValue}>{selectedDelivery.transportMethod}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>도착지</span>
                  <span className={styles.detailValue}>{selectedDelivery.destination}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>현장명</span>
                  <span className={styles.detailValue}>{selectedDelivery.siteName}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>입력자</span>
                  <span className={styles.detailValue}>{selectedDelivery.inputUser}</span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>금액</span>
                  <span className={classnames(styles.detailValue, styles.detailValueAmount)}>
                    {formatCurrency(selectedDelivery.amount)}원
                  </span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>부가세</span>
                  <span className={classnames(styles.detailValue, styles.detailValueAmount)}>
                    {formatCurrency(selectedDelivery.vat)}원
                  </span>
                </div>
                <div className={styles.detailField}>
                  <span className={styles.detailLabel}>상태</span>
                  <span className={styles.detailValue}>
                    <span className={classnames(styles.statusBadge, getStatusBadgeClass(selectedDelivery.status))}>
                      {getStatusLabel(selectedDelivery.status)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </Drawer>
    </PageShell>
  );
}
