export const SUMMARY_YEARS = ['2024', '2025', '2026', '2027', '2028'];
export const DEFAULT_YEAR = '2026';

export const CATEGORY_AMOUNT_DATA = {
    title: '[1] 카테고리별 요약(금액)',
    unitText: '(단위: 백만원)',
    columns: [
        { key: 'label', label: '금액', fixed: 'left', width: 140, align: 'left' },
        ...Array.from({ length: 12 }, (_, i) => ({
            key: `m${i + 1}`,
            label: `${DEFAULT_YEAR}.${String(i + 1).padStart(2, '0')}`,
            width: 100,
            align: 'right',
        })),
        { key: 'total', label: `${DEFAULT_YEAR}년 합계(백만원)`, width: 140, align: 'right', isTotal: true },
    ],
    rows: [
        {
            id: 'c1',
            label: '위생도기',
            m1: 120, m2: 150, m3: 180, m4: 130, m5: 160, m6: 190,
            m7: 140, m8: 170, m9: 200, m10: 150, m11: 180, m12: 210,
            total: 1980,
        },
        {
            id: 'c2',
            label: 'OEM',
            m1: 80, m2: 90, m3: 100, m4: 85, m5: 95, m6: 105,
            m7: 80, m8: 90, m9: 100, m10: 85, m11: 95, m12: 105,
            total: 1110,
        },
        {
            id: 'c3',
            label: '수전',
            m1: 200, m2: 220, m3: 240, m4: 210, m5: 230, m6: 250,
            m7: 200, m8: 220, m9: 240, m10: 210, m11: 230, m12: 250,
            total: 2700,
        },
        {
            id: 'total',
            label: '합계',
            isTotalRow: true,
            m1: 400, m2: 460, m3: 520, m4: 425, m5: 485, m6: 545,
            m7: 420, m8: 480, m9: 540, m10: 445, m11: 505, m12: 565,
            total: 5790,
        },
    ],
};

export const CATEGORY_WEIGHT_DATA = {
    title: '[2] 카테고리별 요약(중량)',
    unitText: '(단위: TON)',
    columns: [
        { key: 'label', label: '중량', fixed: 'left', width: 140, align: 'left' },
        ...Array.from({ length: 12 }, (_, i) => ({
            key: `m${i + 1}`,
            label: `${DEFAULT_YEAR}.${String(i + 1).padStart(2, '0')}`,
            width: 100,
            align: 'right',
        })),
        { key: 'total', label: `${DEFAULT_YEAR}년 합계(TON)`, width: 140, align: 'right', isTotal: true },
    ],
    rows: [
        {
            id: 'w1',
            label: '위생도기',
            m1: 50, m2: 55, m3: 60, m4: 52, m5: 58, m6: 62,
            m7: 50, m8: 55, m9: 60, m10: 52, m11: 58, m12: 62,
            total: 674,
        },
        {
            id: 'w2',
            label: 'OEM',
            m1: 30, m2: 32, m3: 35, m4: 31, m5: 33, m6: 36,
            m7: 30, m8: 32, m9: 35, m10: 31, m11: 33, m12: 36,
            total: 394,
        },
        {
            id: 'total',
            label: '합계',
            isTotalRow: true,
            m1: 80, m2: 87, m3: 95, m4: 83, m5: 91, m6: 98,
            m7: 80, m8: 87, m9: 95, m10: 83, m11: 91, m12: 98,
            total: 1068,
        },
    ],
};

/*
 * [3] 품번 요약, [4] 품목 요약
 * keyLabel: '품번' or '품목'
 * metricLabel: '수량' or '금액'
 * groupKey: 동일 품목/품번을 묶기 위한 키
 */
export const ITEM_CODE_DATA = {
    title: '[3] 품번 요약(노란음영 원하는 품번 입력)',
    unitText: '(단위: EA, 백만원)',
    columns: [
        { key: 'keyLabel', label: '품번', fixed: 'left', width: 120, align: 'left' },
        { key: 'metricLabel', label: '구분', fixed: 'left', width: 80, align: 'center' },
        ...Array.from({ length: 12 }, (_, i) => ({
            key: `m${i + 1}`,
            label: `${DEFAULT_YEAR}.${String(i + 1).padStart(2, '0')}`,
            width: 80,
            align: 'right',
        })),
        { key: 'total', label: `${DEFAULT_YEAR}년 합계`, width: 120, align: 'right', isTotal: true },
    ],
    rows: [
        // CLR339
        {
            id: 'i1_qty',
            groupKey: 'CLR339',
            keyLabel: 'CLR339',
            metricLabel: '수량',
            m1: 100, m2: 120, m3: 110, m4: 105, m5: 115, m6: 125,
            m7: 100, m8: 120, m9: 110, m10: 105, m11: 115, m12: 125,
            total: 1350,
            isHighlighted: true, // Specific item highlight
            itemName: '일체형양변기',
        },
        {
            id: 'i1_amt',
            groupKey: 'CLR339',
            keyLabel: 'CLR339',
            metricLabel: '금액',
            m1: 50, m2: 60, m3: 55, m4: 52, m5: 57, m6: 62,
            m7: 50, m8: 60, m9: 55, m10: 52, m11: 57, m12: 62,
            total: 672,
            isHighlighted: true,
            itemName: '일체형양변기',
        },
        // CLR999 (Normal)
        {
            id: 'i2_qty',
            groupKey: 'CLR999',
            keyLabel: 'CLR999',
            metricLabel: '수량',
            m1: 50, m2: 50, m3: 50, m4: 50, m5: 50, m6: 50,
            m7: 50, m8: 50, m9: 50, m10: 50, m11: 50, m12: 50,
            total: 600,
            itemName: '비데일체형',
        },
        {
            id: 'i2_amt',
            groupKey: 'CLR999',
            keyLabel: 'CLR999',
            metricLabel: '금액',
            m1: 10, m2: 10, m3: 10, m4: 10, m5: 10, m6: 10,
            m7: 10, m8: 10, m9: 10, m10: 10, m11: 10, m12: 10,
            total: 120,
        },
    ],
};

export const ITEM_NAME_DATA = {
    title: '[4] 품목 요약(노란음영 원하는 품목 입력)',
    unitText: '(단위: EA, 백만원)',
    columns: [
        { key: 'keyLabel', label: '품목', fixed: 'left', width: 140, align: 'left' },
        { key: 'metricLabel', label: '구분', fixed: 'left', width: 80, align: 'center' },
        ...Array.from({ length: 12 }, (_, i) => ({
            key: `m${i + 1}`,
            label: `${DEFAULT_YEAR}.${String(i + 1).padStart(2, '0')}`,
            width: 80,
            align: 'right',
        })),
        { key: 'total', label: `${DEFAULT_YEAR}년 합계`, width: 120, align: 'right', isTotal: true },
    ],
    rows: [
        {
            id: 'n1_qty',
            groupKey: '일체형양변기',
            keyLabel: '일체형양변기',
            metricLabel: '수량',
            m1: 500, m2: 520, m3: 510, m4: 505, m5: 515, m6: 525,
            m7: 500, m8: 520, m9: 510, m10: 505, m11: 515, m12: 525,
            total: 6150,
            isHighlighted: true,
        },
        {
            id: 'n1_amt',
            groupKey: '일체형양변기',
            keyLabel: '일체형양변기',
            metricLabel: '금액',
            m1: 100, m2: 104, m3: 102, m4: 101, m5: 103, m6: 105,
            m7: 100, m8: 104, m9: 102, m10: 101, m11: 103, m12: 105,
            total: 1230,
            isHighlighted: true,
        },
    ],
};

export const BIDET_DELIVERY_PLAN_DATA = {
    title: '[비데 납품계획] 월별 납품 계획 (수량/금액)',
    unitText: '(단위: EA, 백만원)',
    columns: [
        { key: 'keyLabel', label: '구분', fixed: 'left', width: 120, align: 'left' },
        { key: 'metricLabel', label: '', fixed: 'left', width: 60, align: 'center' }, // Empty label for metric
        ...Array.from({ length: 12 }, (_, i) => ({
            key: `m${i + 1}`,
            label: `${DEFAULT_YEAR}.${String(i + 1).padStart(2, '0')}`,
            width: 90,
            align: 'right',
        })),
        { key: 'total', label: '합계', width: 100, align: 'right', isTotal: true },
    ],
    rows: [
        // Separable Bidet (분리형비데)
        {
            id: 'b1_qty',
            groupKey: '분리형비데',
            keyLabel: '분리형비데',
            metricLabel: '수량',
            m1: 0, m2: 304, m3: 730, m4: 1368, m5: 1701, m6: 2545,
            m7: 169, m8: 513, m9: 0, m10: 949, m11: 1630, m12: 726,
            total: 10635,
        },
        {
            id: 'b1_amt',
            groupKey: '분리형비데',
            keyLabel: '분리형비데',
            metricLabel: '금액',
            m1: 0, m2: 40, m3: 93, m4: 173, m5: 199, m6: 291,
            m7: 23, m8: 60, m9: 0, m10: 111, m11: 210, m12: 102,
            total: 1302,
        },
        // Integrated Bidet (일체형비데)
        {
            id: 'b2_qty',
            groupKey: '일체형비데',
            keyLabel: '일체형비데',
            metricLabel: '수량',
            m1: 0, m2: 1970, m3: 1345, m4: 2026, m5: 3235, m6: 7952,
            m7: 1537, m8: 610, m9: 396, m10: 1366, m11: 952, m12: 3394,
            total: 24783,
        },
        {
            id: 'b2_amt',
            groupKey: '일체형비데',
            keyLabel: '일체형비데',
            metricLabel: '금액',
            m1: 0, m2: 339, m3: 448, m4: 614, m5: 653, m6: 2638,
            m7: 276, m8: 57, m9: 71, m10: 252, m11: 142, m12: 726,
            total: 6217,
        },
        // Total (합계)
        {
            id: 'total_qty',
            groupKey: '합계',
            keyLabel: '합계',
            metricLabel: '수량',
            isTotalRow: true, // Special styling
            m1: 0, m2: 2274, m3: 2075, m4: 3394, m5: 4936, m6: 10497,
            m7: 1706, m8: 1123, m9: 396, m10: 2315, m11: 2582, m12: 4120,
            total: 35418,
        },
        {
            id: 'total_amt',
            groupKey: '합계',
            keyLabel: '합계',
            metricLabel: '금액',
            isTotalRow: true,
            m1: 0, m2: 379, m3: 541, m4: 787, m5: 853, m6: 2929,
            m7: 299, m8: 117, m9: 71, m10: 363, m11: 351, m12: 828,
            total: 7519,
        },
    ],
};
