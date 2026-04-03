import React, { useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Pagination } from '../../../shared/components/Pagination/Pagination';
import { usePagination } from '../../../shared/hooks/usePagination';
import { INVENTORY_FILTER_OPTIONS, INVENTORY_ROWS } from '../data/inventoryMock';
import { ROUTES } from '../../../router/routePaths';
import styles from './InventoryPage.module.css';

const getPlantNameByCode = (code) =>
  INVENTORY_FILTER_OPTIONS.plants.find((plant) => plant.code === code)?.name || '';

const INITIAL_FILTER = {
  plantCode: 'PC01',
  plantName: getPlantNameByCode('PC01'),
  warehouseCode: '',
  warehouseName: '',
  itemGroup: '',
  itemDetailGroupCode: '',
  itemDetailGroupName: '',
  itemCode: '',
  itemName: '',
  itemType: 'system',
  goodQtyMode: 'nonZero',
  prioritizeGoodQty: true,
};

function matchText(source, keyword) {
  if (!keyword) return true;
  return String(source || '')
    .toLowerCase()
    .includes(String(keyword).trim().toLowerCase());
}

export function InventoryPage() {
  const [filter, setFilter] = useState(INITIAL_FILTER);
  const [appliedFilter, setAppliedFilter] = useState(INITIAL_FILTER);

  const onChange = (key, value) => {
    if (key === 'plantCode') {
      setFilter((prev) => ({
        ...prev,
        plantCode: value,
        plantName: getPlantNameByCode(value),
      }));
      return;
    }
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const applySearch = () => {
    setAppliedFilter(filter);
    resetPage();
  };

  const resetSearch = () => {
    setFilter(INITIAL_FILTER);
    setAppliedFilter(INITIAL_FILTER);
    resetPage();
  };

  const filteredRows = useMemo(() => {
    const rows = INVENTORY_ROWS.filter((row) => {
      if (appliedFilter.plantCode && row.plantCode !== appliedFilter.plantCode) return false;
      if (appliedFilter.warehouseCode && row.warehouse !== appliedFilter.warehouseCode) return false;
      if (appliedFilter.itemGroup && row.itemGroup !== appliedFilter.itemGroup) return false;
      if (appliedFilter.itemType === 'system' && row.itemType !== 'system') return false;
      if (appliedFilter.itemType === 'recognized' && row.itemType !== 'recognized') return false;
      if (appliedFilter.goodQtyMode === 'nonZero' && (Number(row.goodQty) || 0) <= 0) return false;

      if (!matchText(row.plantName, appliedFilter.plantName)) return false;
      if (!matchText(row.itemDetailGroup, appliedFilter.itemDetailGroupName)) return false;
      if (!matchText(row.itemCode, appliedFilter.itemCode)) return false;
      if (!matchText(row.itemName, appliedFilter.itemName)) return false;
      if (!matchText(row.warehouseName, appliedFilter.warehouseName)) return false;

      return true;
    });

    const sorted = [...rows];
    if (appliedFilter.prioritizeGoodQty) {
      sorted.sort((a, b) => (Number(b.goodQty) || 0) - (Number(a.goodQty) || 0));
    } else {
      sorted.sort((a, b) => String(a.itemCode).localeCompare(String(b.itemCode)));
    }
    return sorted;
  }, [appliedFilter]);

  const {
    currentPage,
    pageSize,
    pagedData: pagedRows,
    setPage,
    setPageSize,
    resetPage,
  } = usePagination(filteredRows, {
    initialPageSize: 10,
  });

  return (
    <PageShell
      path={ROUTES.DELIVERY_INVENTORY}
      title="재고 현황 상세조회"
      description="ERP 재고 상세 조회 화면을 기준으로 구성한 목업입니다."
    >
      <div className={styles.page}>
        <Card title="조회 조건" className={styles.sectionCard}>
          <CardBody>
            <div className={styles.filterRows}>
              <div className={styles.filterRow}>
                <div className={`${styles.field} ${styles.filterTopWide} ${styles.plantField}`}>
                  <span className={styles.label}>공장</span>
                  <select
                    className={`${styles.select} ${styles.inputSm} ${styles.plantCodeSelect}`}
                    value={filter.plantCode}
                    onChange={(e) => onChange('plantCode', e.target.value)}
                  >
                    {INVENTORY_FILTER_OPTIONS.plants.map((plant) => (
                      <option key={plant.code} value={plant.code}>
                        {plant.code}
                      </option>
                    ))}
                  </select>
                  <input className={`${styles.input} ${styles.inputLg}`} value={filter.plantName} readOnly />
                </div>

                <div className={`${styles.field} ${styles.filterCol3} ${styles.warehouseField}`}>
                  <span className={styles.label}>창고</span>
                  <select
                    className={`${styles.select} ${styles.inputSm}`}
                    value={filter.warehouseCode}
                    onChange={(e) => onChange('warehouseCode', e.target.value)}
                  >
                    <option value="">전체</option>
                    {INVENTORY_FILTER_OPTIONS.warehouses.map((warehouse) => (
                      <option key={warehouse.code} value={warehouse.code}>
                        {warehouse.code}
                      </option>
                    ))}
                  </select>
                  <input
                    className={`${styles.input} ${styles.inputLg}`}
                    value={filter.warehouseName}
                    onChange={(e) => onChange('warehouseName', e.target.value)}
                    placeholder="창고명"
                  />
                </div>
              </div>

              <div className={styles.filterRow}>
                <div className={`${styles.field} ${styles.filterCol1}`}>
                  <span className={styles.label}>품목그룹</span>
                  <select
                    className={styles.select}
                    value={filter.itemGroup}
                    onChange={(e) => onChange('itemGroup', e.target.value)}
                  >
                    <option value="">전체</option>
                    {INVENTORY_FILTER_OPTIONS.itemGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.field} ${styles.filterCol2}`}>
                  <span className={styles.label}>품목상세구분</span>
                  <input
                    className={`${styles.input} ${styles.inputSm}`}
                    value={filter.itemDetailGroupCode}
                    onChange={(e) => onChange('itemDetailGroupCode', e.target.value)}
                    placeholder="코드"
                  />
                  <input
                    className={`${styles.input} ${styles.inputLg}`}
                    value={filter.itemDetailGroupName}
                    onChange={(e) => onChange('itemDetailGroupName', e.target.value)}
                    placeholder="품목상세구분"
                  />
                </div>

                <div className={`${styles.field} ${styles.filterCol3} ${styles.itemField}`}>
                  <span className={styles.label}>품목</span>
                  <input
                    className={`${styles.input} ${styles.inputSm}`}
                    value={filter.itemCode}
                    onChange={(e) => onChange('itemCode', e.target.value)}
                    placeholder="코드"
                  />
                  <input
                    className={`${styles.input} ${styles.inputLg}`}
                    value={filter.itemName}
                    onChange={(e) => onChange('itemName', e.target.value)}
                    placeholder="품목명"
                  />
                </div>
              </div>

              <div className={styles.filterRow}>
                <div className={`${styles.field} ${styles.filterCol1}`}>
                  <span className={styles.label}>품목구분</span>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioItem}>
                      <input
                        type="radio"
                        name="itemType"
                        checked={filter.itemType === 'system'}
                        onChange={() => onChange('itemType', 'system')}
                      />
                      전산품목
                    </label>
                    <label className={styles.radioItem}>
                      <input
                        type="radio"
                        name="itemType"
                        checked={filter.itemType === 'recognized'}
                        onChange={() => onChange('itemType', 'recognized')}
                      />
                      인식품목
                    </label>
                  </div>
                </div>

                <div className={`${styles.field} ${styles.filterCol2}`}>
                  <span className={styles.label}>양품수량유무</span>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioItem}>
                      <input
                        type="radio"
                        name="goodQtyMode"
                        checked={filter.goodQtyMode === 'nonZero'}
                        onChange={() => onChange('goodQtyMode', 'nonZero')}
                      />
                      수량있음
                    </label>
                    <label className={styles.radioItem}>
                      <input
                        type="radio"
                        name="goodQtyMode"
                        checked={filter.goodQtyMode === 'all'}
                        onChange={() => onChange('goodQtyMode', 'all')}
                      />
                      전품목
                    </label>
                  </div>
                </div>

                <div className={`${styles.field} ${styles.filterCol3} ${styles.sortField}`}>
                  <span className={styles.label}>정렬</span>
                  <div className={styles.checkGroup}>
                    <label className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={filter.prioritizeGoodQty}
                        onChange={(e) => onChange('prioritizeGoodQty', e.target.checked)}
                      />
                      양품수량 우선 정렬
                    </label>
                  </div>
                </div>

                <div className={styles.filterActionsInline}>
                  <button className={styles.button} onClick={resetSearch}>
                    초기화
                  </button>
                  <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={applySearch}>
                    조회
                  </button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title={`조회 결과 (${filteredRows.length}건)`} className={styles.sectionCard}>
          <CardBody tight>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <colgroup>
                  <col className={styles.colWarehouse} />
                  <col className={styles.colItemGroup} />
                  <col className={styles.colItemDetail} />
                  <col className={styles.colItemCode} />
                  <col className={styles.colItemName} />
                  <col className={styles.colSpec} />
                  <col className={styles.colMainItem} />
                  <col className={styles.colGoodQty} />
                  <col className={styles.colReservedQty} />
                  <col className={styles.colPrice} />
                </colgroup>
                <thead>
                  <tr>
                    <th>창고</th>
                    <th>품목그룹</th>
                    <th>품목상세</th>
                    <th>품목</th>
                    <th>품목명</th>
                    <th>규격</th>
                    <th>대표품번</th>
                    <th>양품수량</th>
                    <th>가출고량</th>
                    <th>판매단가</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.length === 0 ? (
                    <tr>
                      <td className={styles.empty} colSpan={10}>
                        조회 조건에 해당하는 데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    pagedRows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.warehouse}</td>
                        <td>{row.itemGroup}</td>
                        <td>{row.itemDetailGroup}</td>
                        <td>{row.itemCode}</td>
                        <td className={styles.left}>{row.itemName}</td>
                        <td className={styles.left}>{row.spec}</td>
                        <td>{row.mainItemCode}</td>
                        <td className={styles.num}>{row.goodQty.toLocaleString('ko-KR')}</td>
                        <td className={styles.num}>{row.reservedQty.toLocaleString('ko-KR')}</td>
                        <td className={styles.num}>{row.salePrice.toLocaleString('ko-KR')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              className={styles.pagination}
              totalCount={filteredRows.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </CardBody>
        </Card>
      </div>
    </PageShell>
  );
}
