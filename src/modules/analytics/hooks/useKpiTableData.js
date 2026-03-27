import { useMemo } from 'react';

/**
 * 1월부터 12월까지의 매출 데이터를 랜덤 생성하고, 도소매/납품/전체 데이터를 구성합니다.
 * @param {Array} baseRows 기초 정보 배열 (고정 컬럼들)
 * @param {string} viewType 조회 모드 ('TOTAL' | 'RETAIL' | 'DELIVERY')
 * @returns {Array} 생성된 Table Row 배열
 */
export function useKpiTableData(baseRows, viewType) {
  // 실제 앱에서는 API에서 받아오지만, 여기서는 시안 구성을 위해 Mock 생성
  const mockData = useMemo(() => {
    return baseRows.map((row) => {
      const metrics = {
        retail: {},
        delivery: {},
        total: {},
      };

      let retailSum = 0;
      let deliverySum = 0;
      let totalSum = 0;

      // 1월 ~ 12월 렌더링
      for (let i = 1; i <= 12; i++) {
        const monthKey = String(i).padStart(2, '0');
        const rVal = Math.floor(Math.random() * 50) + 10; // 임의 단위(백만원 등)
        const dVal = row.isDeliveryPossible === false ? 0 : Math.floor(Math.random() * 40);
        
        metrics.retail[`m_${monthKey}`] = rVal;
        metrics.delivery[`m_${monthKey}`] = dVal;
        metrics.total[`m_${monthKey}`] = rVal + dVal;

        retailSum += rVal;
        deliverySum += dVal;
        totalSum += (rVal + dVal);
      }

      metrics.retail.sum = retailSum;
      metrics.delivery.sum = deliverySum;
      metrics.total.sum = totalSum;

      return {
        ...row,
        metrics, // 렌더링 시 metrics[viewType.toLowerCase()] 에서 접근
      };
    });
  }, [baseRows]);

  // 테이블 컬럼 동적 구성을 위한 배열 반환 (1월~12월 + 계)
  const dynamicColumns = useMemo(() => {
    const cols = [];
    for (let i = 1; i <= 12; i++) {
      const monthStr = String(i).padStart(2, '0');
      cols.push({
        title: `${i}월`,
        dataIndex: ['metrics', viewType.toLowerCase(), `m_${monthStr}`],
        width: 80,
        align: 'right',
        render: (val) => val === 0 ? '-' : new Intl.NumberFormat('ko-KR').format(val),
      });
    }
    cols.push({
      title: '계',
      dataIndex: ['metrics', viewType.toLowerCase(), 'sum'],
      width: 100,
      align: 'right',
      className: 'total-col',
      render: (val) => new Intl.NumberFormat('ko-KR').format(val),
    });

    return cols;
  }, [viewType]);

  return { mockData, dynamicColumns };
}
