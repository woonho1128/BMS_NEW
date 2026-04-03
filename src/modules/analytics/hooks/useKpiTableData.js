import { useMemo } from 'react';

function createMonthValue(seed, month, min, range) {
  return ((seed * 37 + month * 19) % range) + min;
}

/**
 * KPI 테이블 목업 데이터/동적 컬럼 생성 훅
 * @param {Array} baseRows 고정 컬럼 데이터
 * @param {'TOTAL'|'RETAIL'|'DELIVERY'} viewType 조회 모드
 */
export function useKpiTableData(baseRows, viewType) {
  const mockData = useMemo(() => {
    return baseRows.map((row, index) => {
      const seed = Number(row.key ?? index + 1);
      const metrics = {
        retail: {},
        delivery: {},
        total: {},
      };

      let retailSum = 0;
      let deliverySum = 0;
      let totalSum = 0;

      for (let month = 1; month <= 12; month += 1) {
        const monthKey = `m_${String(month).padStart(2, '0')}`;
        const retail = createMonthValue(seed, month, 25, 95);
        const delivery = row.isDeliveryPossible === false ? 0 : createMonthValue(seed + 7, month, 10, 75);
        const total = retail + delivery;

        metrics.retail[monthKey] = retail;
        metrics.delivery[monthKey] = delivery;
        metrics.total[monthKey] = total;

        retailSum += retail;
        deliverySum += delivery;
        totalSum += total;
      }

      metrics.retail.sum = retailSum;
      metrics.delivery.sum = deliverySum;
      metrics.total.sum = totalSum;

      return {
        ...row,
        metrics,
      };
    });
  }, [baseRows]);

  const dynamicColumns = useMemo(() => {
    const columns = [];

    for (let month = 1; month <= 12; month += 1) {
      const monthStr = String(month).padStart(2, '0');
      columns.push({
        title: `${month}월`,
        dataIndex: ['metrics', viewType.toLowerCase(), `m_${monthStr}`],
        width: 84,
        align: 'right',
        render: (value) => (value === 0 ? '-' : Number(value || 0).toLocaleString('ko-KR')),
      });
    }

    columns.push({
      title: '합계',
      dataIndex: ['metrics', viewType.toLowerCase(), 'sum'],
      width: 104,
      align: 'right',
      className: 'total-col',
      render: (value) => Number(value || 0).toLocaleString('ko-KR'),
    });

    return columns;
  }, [viewType]);

  return { mockData, dynamicColumns };
}

