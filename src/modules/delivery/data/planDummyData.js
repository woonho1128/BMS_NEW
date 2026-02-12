export const PLAN_SNAPSHOTS = [
    { id: '2026.01', label: '2026.01', savedAt: '2026-01-09 14:32', author: '홍길동' },
    { id: '2026.02', label: '2026.02', savedAt: '2026-02-10 09:15', author: '이순신' },
];

export const PLAN_COLUMNS = [
    { key: 'company', label: '건설회사', width: 80 },
    { key: 'site', label: '현장명', width: 200, isLink: true }, // Added flag for styling/interaction
    { key: 'agency', label: '대리점', width: 80 },
    { key: 'deliveryDate', label: '납품예정', width: 70, align: 'center' },
    { key: 'moveInDate', label: '입주예정', width: 70, align: 'center' },
    { key: 'item1', label: '품목', width: 90 },
    // { key: 'color', label: '색상', width: 80, align: 'center' }, // Moved to Expanded View
    { key: 'qty', label: '수량', width: 60, align: 'right' },
    { key: 'agencyPrice', label: '대리점가', width: 80, align: 'right' },
    { key: 'totalWeightKg', label: '총무게(KG)', width: 80, align: 'right' }, // Added back
    // { key: 'weight', label: '중량(KG)', width: 80, align: 'right' }, // Moved to Expanded View
    // { key: 'totalWeightTon', label: '총무게(TON)', width: 100, align: 'right' }, // Moved to Expanded View
    { key: 'amount', label: '금액', width: 100, align: 'right' },
    { key: 'spec', label: '특수사양', width: 100 },
    // { key: 'memo', label: '비고', width: 150 }, // REMOVED from Grid
    { key: 'manager', label: '담당자', width: 80, align: 'center' },
    { key: 'item2', label: '품목', width: 100 },
    { key: 'category', label: '구분', width: 80, align: 'center' },
    { key: 'specManager', label: 'SPEC담당', width: 80, align: 'center' },
];

const generateRows = () => {
    const rows = [];

    // Helper data
    const companies = ['DL건설', '현대건설', 'GS건설', '포스코건설', '대우건설'];
    const agencies = ['인천대리점', '서울대리점', '경기대리점', '부산대리점', '광주대리점'];
    const items = [
        { name: '일체형양변기', code: 'W-100', weight: 45, price: 120000 },
        { name: '비데일체형', code: 'B-200', weight: 30, price: 350000 },
        { name: '세면대', code: 'L-300', weight: 15, price: 80000 },
        { name: '수전', code: 'F-400', weight: 2, price: 50000 },
    ];

    // 1. In Progress (10 items)
    for (let i = 1; i <= 10; i++) {
        let rowData = {
            id: i,
            company: companies[i % companies.length],
            site: `현장 ${i}`,
            agency: agencies[i % agencies.length],
            deliveryDate: `2026-03-${String(i).padStart(2, '0')}`,
            moveInDate: `2026-05-${String(i).padStart(2, '0')}`,
            item1: items[i % items.length].name,
            color: i % 2 === 0 ? '화이트' : '아이보리',
            qty: (i * 10) + 50,
            agencyPrice: items[i % items.length].price,
            weight: items[i % items.length].weight,
            spec: i % 3 === 0 ? '절수형' : '일반',
            memo: i % 2 === 0 ? "현장 진입로 협소하여 소형차량 배차 요망." : "",
            manager: `담당자${i}`,
            item2: "도기",
            category: i % 2 === 0 ? "리테일" : "특판",
            specManager: `SPEC${i}`,
            status: "진행",
            changeHistory: [],
            partialHistory: []
        };

        // Custom Overrides for Image Matching
        if (i % 3 === 0) {
            rowData = {
                ...rowData,
                company: '다원앤컴퍼니',
                site: "강원도 정선 하이원리조트 그랜드호텔, 마운틴콘도 리모델링",
                agency: '시내물산업',
                deliveryDate: '2026-12',
                moveInDate: '',
                item1: 'CCB30', // From Image
                qty: 443,
                agencyPrice: 242005,
                weight: 34.2,
                manager: '금지현',
                item2: '일체형양변기',
                category: '위생도기',
                specManager: '변상익',
                spec: '설치비 제외', // Using Spec column for the text seen
                memo: '설치비 제외'
            };
        } else if (i % 3 === 1) {
            // Check if this is the second row of the same group or just another item?
            // User asked for "태영건설..." as well. Let's assign that to this slot.
            // But if we want to match the image which had 2 rows for "강원도...", maybe I should make row i and i+1 same site?
            // For now, let's just stick to the rotation requested before + image values.

            // Actually, let's try to match the image's second row for a specific case:
            if (i === 1) { // Force specific index to be the "Second" row of the image sample?
                // The image shows 2 rows of "강원도...". 
                // Row 1: CCB30, 443
                // Row 2: DL-P4010, 1085
                // I'll make i=3 (divisible by 3) be Row 1.
                // I'll make i=6 be Row 2 (same site, different item on purpose? Or just random rotation).
                // Let's just make the "Taiyoung" one separately.
                rowData = {
                    ...rowData,
                    site: "태영건설(GH:경기주택도시공사)화성 동탄2 A78 자연앤데시앙 현장(공공분양, APT)_기",
                };
            }
        }

        // Match specific 2nd row from image to another ID for demo
        if (i === 3) { // Existing 'divisible by 3' logic covers the first row of image
            // It's covered above.
        }
        if (i === 6) { // Make another one look like the 2nd row of image
            rowData = {
                ...rowData,
                company: '다원앤컴퍼니',
                site: "강원도 정선 하이원리조트 그랜드호텔, 마운틴콘도 리모델링",
                agency: '시내물산업',
                deliveryDate: '2026-12',
                moveInDate: '',
                item1: 'DL-P4010', // From Image Row 2
                qty: 1085,
                agencyPrice: 2281,
                weight: 0,
                manager: '금지현',
                item2: '기타수전',
                category: '수전',
                specManager: '변상익',
                spec: '설치비 제외',
                memo: '설치비 제외'
            };
        }

        // Calculate totals
        rowData.totalWeightKg = rowData.weight * rowData.qty;
        rowData.totalWeightTon = rowData.totalWeightKg / 1000;
        rowData.amount = rowData.agencyPrice * rowData.qty;

        rows.push(rowData);
    }

    // 2. Partial Delivery (5 items)
    for (let i = 11; i <= 15; i++) {
        const item = items[i % items.length];
        const originalQty = 200;
        const currentQty = 100;

        rows.push({
            id: i,
            company: companies[i % companies.length],
            site: `부분납품 현장 ${i}`,
            agency: agencies[i % agencies.length],
            deliveryDate: `2026-02-${String(i).padStart(2, '0')}`,
            moveInDate: `2026-04-${String(i).padStart(2, '0')}`,
            item1: item.name,
            color: '화이트',
            qty: currentQty,
            agencyPrice: item.price,
            weight: item.weight,
            totalWeightKg: item.weight * currentQty,
            totalWeightTon: (item.weight * currentQty) / 1000,
            amount: item.price * currentQty,
            spec: '일반',
            memo: "1차 납품 완료, 2차 납품 대기 중.",
            manager: `담당자${i}`,
            item2: "도기",
            category: "특판",
            specManager: `SPEC${i}`,
            status: "부분납품",
            changeHistory: [],
            partialHistory: [
                { date: '2026-01-15', qty: 50, note: '1차 납품' },
                { date: '2026-02-01', qty: 50, note: '2차 납품' }
            ]
        });
    }

    // 3. Completed (5 items)
    for (let i = 16; i <= 20; i++) {
        const item = items[i % items.length];
        const qty = 50;

        rows.push({
            id: i,
            company: companies[i % companies.length],
            site: `완료 현장 ${i}`,
            agency: agencies[i % agencies.length],
            deliveryDate: `2026-01-${String(i).padStart(2, '0')}`,
            moveInDate: `2026-03-${String(i).padStart(2, '0')}`,
            item1: item.name,
            color: '화이트',
            qty: qty,
            agencyPrice: item.price,
            weight: item.weight,
            totalWeightKg: item.weight * qty,
            totalWeightTon: (item.weight * qty) / 1000,
            amount: item.price * qty,
            spec: '원홀',
            memo: "모든 물량 납품 완료.",
            manager: `담당자${i}`,
            item2: "도기",
            category: "리테일",
            specManager: `SPEC${i}`,
            status: "완료",
            changeHistory: [
                { field: '납품예정', oldValue: '2026-01-10', newValue: '2026-01-20', reason: '현장 요청', date: '2026-01-05' }
            ],
            partialHistory: [
                { date: '2026-01-20', qty: 50, note: '전량 납품' }
            ]
        });
    }

    return rows;
};


export const MOCKED_COMPARISON_DATA = [
    {
        id: 'diff1',
        company: 'DL건설',
        site: '현장 1',
        agency: '인천대리점',
        item: '일체형양변기',
        color: '화이트',
        prevDeliveryDate: '2026-03-01',
        currDeliveryDate: '2026-03-15', // Delayed
        prevQty: 60,
        currQty: 60,
        prevAmt: 7200000,
        currAmt: 7200000,
        changeType: 'schedule',
        reason: '현장 공정 지연으로 인한 납기 연기 요청',
        changer: '홍길동',
        changedAt: '2026-02-15 10:30',
        memo: '비고 사항 없음',
        // Fields for DetailModal
        deliveryDate: '2026-03-15',
        moveInDate: '2026-05-01',
        qty: 60,
        amount: 7200000,
        agencyPrice: 120000,
        weight: 45,
        totalWeightKg: 2700,
        totalWeightTon: 2.7,
        manager: '담당자1',
        spec: '일반',
        specManager: 'SPEC1',
        category: '특판',
        status: '진행',
        item1: '일체형양변기',
        item2: '도기',
        partialHistory: [],
        changeHistory: [
            { field: '납품예정', oldValue: '2026-03-01', newValue: '2026-03-15', reason: '현장 공정 지연', date: '2026-02-15' }
        ]
    },
    {
        id: 'diff2',
        company: '현대건설',
        site: '현장 2',
        agency: '서울대리점',
        item: '비데일체형',
        color: '아이보리',
        prevDeliveryDate: '2026-03-02',
        currDeliveryDate: '2026-03-02',
        prevQty: 70,
        currQty: 50, // Decreased
        prevAmt: 24500000,
        currAmt: 17500000,
        changeType: 'quantity',
        reason: '발주 수량 감소 (설계 변경)',
        changer: '이순신',
        changedAt: '2026-02-12 14:00',
        memo: '설계 변경 번호 #1234 참조',
        // Fields for DetailModal
        deliveryDate: '2026-03-02',
        moveInDate: '2026-05-02',
        qty: 50,
        amount: 17500000,
        agencyPrice: 350000,
        weight: 30,
        totalWeightKg: 1500,
        totalWeightTon: 1.5,
        manager: '담당자2',
        spec: '비데일체',
        specManager: 'SPEC2',
        category: '리테일',
        status: '진행',
        item1: '비데일체형',
        item2: '도기',
        partialHistory: [],
        changeHistory: [
            { field: '수량', oldValue: '70', newValue: '50', reason: '설계 변경', date: '2026-02-12' }
        ]
    },
    {
        id: 'diff3',
        company: 'GS건설',
        site: '현장 3',
        agency: '경기대리점',
        item: '세면대',
        color: '화이트',
        prevDeliveryDate: '2026-03-03',
        currDeliveryDate: '2026-02-28', // Advanced
        prevQty: 80,
        currQty: 100, // Increased
        prevAmt: 6400000,
        currAmt: 8000000,
        changeType: 'mixed', // Both schedule and qty
        reason: '공기 단축 및 추가 물량 확보',
        changer: '김철수',
        changedAt: '2026-02-10 09:15',
        memo: '긴급 발주 건',
        // Fields for DetailModal
        deliveryDate: '2026-02-28',
        moveInDate: '2026-05-03',
        qty: 100,
        amount: 8000000,
        agencyPrice: 80000,
        weight: 15,
        totalWeightKg: 1500,
        totalWeightTon: 1.5,
        manager: '담당자3',
        spec: '일반',
        specManager: 'SPEC3',
        category: '특판',
        status: '진행',
        item1: '세면대',
        item2: '도기',
        partialHistory: [],
        changeHistory: [
            { field: '납품예정', oldValue: '2026-03-03', newValue: '2026-02-28', reason: '공기 단축', date: '2026-02-10' },
            { field: '수량', oldValue: '80', newValue: '100', reason: '추가 물량', date: '2026-02-10' }
        ]
    },
    {
        id: 'diff4',
        company: '포스코건설',
        site: '현장 4',
        agency: '부산대리점',
        item: '수전',
        color: '아이보리',
        prevDeliveryDate: '2026-03-04',
        currDeliveryDate: '2026-03-04',
        prevQty: 90,
        currQty: 90,
        prevAmt: 4500000,
        currAmt: 4500000,
        // Should not appear in changes list realistically, but for completeness or if other fields change
        changeType: 'none',
        reason: '',
        changer: '',
        changedAt: '',
        memo: '',
        // Fields for DetailModal
        deliveryDate: '2026-03-04',
        moveInDate: '2026-05-04',
        qty: 90,
        amount: 4500000,
        agencyPrice: 50000,
        weight: 2,
        totalWeightKg: 180,
        totalWeightTon: 0.18,
        manager: '담당자4',
        spec: '원홀',
        specManager: 'SPEC4',
        category: '리테일',
        status: '완료',
        item1: '수전',
        item2: '수전',
        partialHistory: [],
        changeHistory: []
    },
    {
        id: 'diff5',
        company: '대우건설',
        site: '현장 5',
        agency: '광주대리점',
        item: '일체형양변기',
        color: '화이트',
        prevDeliveryDate: '2026-03-05',
        currDeliveryDate: '2026-03-05',
        prevQty: 100,
        currQty: 120, // Increased
        prevAmt: 12000000,
        currAmt: 14400000,
        changeType: 'quantity',
        reason: '현장 파손분 추가 발주',
        changer: '박영희',
        changedAt: '2026-02-18 16:45',
        memo: '파손 사진 첨부 완료',
        // Fields for DetailModal
        deliveryDate: '2026-03-05',
        moveInDate: '2026-05-05',
        qty: 120,
        amount: 14400000,
        agencyPrice: 120000,
        weight: 45,
        totalWeightKg: 5400,
        totalWeightTon: 5.4,
        manager: '담당자5',
        spec: '일반',
        specManager: 'SPEC5',
        category: '특판',
        status: '부분납품',
        item1: '일체형양변기',
        item2: '도기',
        partialHistory: [
            { date: '2026-02-15', qty: 100, note: '1차 납품' }
        ],
        changeHistory: [
            { field: '수량', oldValue: '100', newValue: '120', reason: '파손분 추가', date: '2026-02-18' }
        ]
    },
];

export const INITIAL_PLAN_ROWS = generateRows();

export const COMPLETED_DELIVERY_DATA = [
    {
        id: 'cd1',
        company: 'DL건설',
        site: '서울 현장 A',
        agency: '서울대리점',
        completedMonth: '2026-01',
        deliveryDate: '2026-01-15',
        item: '일체형양변기',
        color: '화이트',
        qty: 100,
        price: 120000,
        weight: 45,
        totalWeightKg: 4500,
        totalWeightTon: 4.5,
        amount: 12000000,
        spec: '일반',
        manager: '김담당',
        category: '특판',
        specManager: '이SPEC',
        memo: '1월 납품 완료건입니다.',
        // Extra fields for DetailModal
        moveInDate: '2026-03-01',
        agencyPrice: 120000,
        status: '완료',
        item1: '일체형양변기',
        item2: '도기'
    },
    {
        id: 'cd2',
        company: '현대건설',
        site: '부산 현장 B',
        agency: '부산대리점',
        completedMonth: '2026-01',
        deliveryDate: '2026-01-20',
        item: '비데일체형',
        color: '아이보리',
        qty: 50,
        price: 350000,
        weight: 30,
        totalWeightKg: 1500,
        totalWeightTon: 1.5,
        amount: 17500000,
        spec: '비데일체',
        manager: '박담당',
        category: '리테일',
        specManager: '최SPEC',
        memo: '',
        moveInDate: '2026-04-01',
        agencyPrice: 350000,
        status: '완료',
        item1: '비데일체형',
        item2: '도기'
    },
    {
        id: 'cd3',
        company: 'GS건설',
        site: '대전 현장 C',
        agency: '경기대리점',
        completedMonth: '2026-02',
        deliveryDate: '2026-02-10',
        item: '세면대',
        color: '화이트',
        qty: 200,
        price: 80000,
        weight: 15,
        totalWeightKg: 3000,
        totalWeightTon: 3.0,
        amount: 16000000,
        spec: '일반',
        manager: '정담당',
        category: '특판',
        specManager: '강SPEC',
        memo: '긴급 납품 건',
        moveInDate: '2026-05-01',
        agencyPrice: 80000,
        status: '완료',
        item1: '세면대',
        item2: '도기'
    },
];

export const YEARLY_PERFORMANCE_DATA = {
    columns: [
        { key: 'category', label: '구분', width: 150, align: 'left', fixed: 'left' },
        ...Array.from({ length: 12 }, (_, i) => ({
            key: `m${i + 1}`,
            label: `${i + 1}월`,
            width: 100,
            align: 'right'
        })),
        { key: 'total', label: '합계', width: 120, align: 'right', fixed: 'right', isTotal: true }
    ],
    rows: [
        {
            id: 'total',
            category: '합계',
            isTotalRow: true,
            m1: 2950, m2: 1600, m3: 0, m4: 0, m5: 0, m6: 0,
            m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0,
            total: 4550 // Mock values in million KRW
        },
        {
            id: 'sanitary',
            category: '위생도기',
            m1: 1200, m2: 800, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0,
            total: 2000
        },
        {
            id: 'oem',
            category: 'OEM',
            m1: 500, m2: 300, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0,
            total: 800
        },
        {
            id: 'product',
            category: '상품',
            m1: 300, m2: 200, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0,
            total: 500
        },
        {
            id: 'faucet',
            category: '수전',
            m1: 200, m2: 100, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0,
            total: 300
        },
        {
            id: 'bidet',
            category: '비데',
            m1: 750, m2: 200, m3: 0, m4: 0, m5: 0, m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0,
            total: 950
        }
    ]
};

// APPROVED SPEC DATA ({For Integration)
export const APPROVED_SPEC_DATA = [
    {
        id: 'spec_101',
        company: 'HDC현대산업개발',
        site: '수원 아이파크 5차',
        agency: '경기대리점',
        deliveryDate: '2026-04-01',
        moveInDate: '2026-06-01',
        manager: '김SPEC',
        category: '특판',
        specManager: '이SPEC',
        status: 'pending', // 'pending', 'completed'
        approvalMonth: '2026-02',
        items: [
            {
                item1: '일체형양변기',
                color: '화이트',
                qty: 200,
                agencyPrice: 125000,
                weight: 45,
                totalWeightKg: 9000,
                totalWeightTon: 9.0,
                amount: 25000000,
                spec: '절수형',
                memo: '신규 규격 적용'
            },
            {
                item1: '세면대',
                color: '화이트',
                qty: 200,
                agencyPrice: 85000,
                weight: 15,
                totalWeightKg: 3000,
                totalWeightTon: 3.0,
                amount: 17000000,
                spec: '일반',
                memo: ''
            }
        ]
    },
    {
        id: 'spec_102',
        company: '롯데건설',
        site: '부산 롯데캐슬 드메르',
        agency: '부산대리점',
        deliveryDate: '2026-05-15',
        moveInDate: '2026-08-01',
        manager: '박SPEC',
        category: '특판',
        specManager: '최SPEC',
        status: 'pending',
        approvalMonth: '2026-02',
        items: [
            {
                item1: '비데일체형',
                color: '아이보리',
                qty: 50,
                agencyPrice: 360000,
                weight: 30,
                totalWeightKg: 1500,
                totalWeightTon: 1.5,
                amount: 18000000,
                spec: '고급형',
                memo: 'VIP 동 적용'
            }
        ]
    },
    {
        id: 'spec_103',
        company: '삼성물산',
        site: '반포 래미안 원베일리',
        agency: '서울대리점',
        deliveryDate: '2026-03-20',
        moveInDate: '2026-06-15',
        manager: '정SPEC',
        category: '특판',
        specManager: '강SPEC',
        status: 'completed', // Already reflected
        approvalMonth: '2026-01',
        items: [
            {
                item1: '수전',
                color: '크롬',
                qty: 500,
                agencyPrice: 55000,
                weight: 2,
                totalWeightKg: 1000,
                totalWeightTon: 1.0,
                amount: 27500000,
                spec: '절수형',
                memo: '기반영된 데이터 예시'
            }
        ]
    }
];

// CANCELLED SPEC DATA (New)
export const CANCELLED_SPEC_DATA = [
    {
        id: 'cancel_001',
        company: 'DL건설',
        site: '천안 e편한세상 시티',
        agency: '경기대리점',
        deliveryDate: '2026-05-01',
        moveInDate: '2026-07-01',
        manager: '박담당',
        category: '특판',
        specManager: '김SPEC',
        cancelDate: '2026-02-10',
        cancelledBy: '관리자',
        items: [
            {
                item1: '일체형양변기',
                color: '화이트',
                qty: 150,
                agencyPrice: 130000,
                weight: 45,
                totalWeightKg: 6750,
                totalWeightTon: 6.75,
                amount: 19500000,
                spec: '일반',
                memo: '시행사 부도로 인한 취소'
            }
        ]
    },
    {
        id: 'cancel_002',
        company: '한화건설',
        site: '서울 포레나 노원',
        agency: '서울대리점',
        deliveryDate: '2026-04-10',
        moveInDate: '2026-06-20',
        manager: '이담당',
        category: '특판',
        specManager: '최SPEC',
        cancelDate: '2026-01-25',
        cancelledBy: '시스템',
        items: [
            {
                item1: '세면대',
                color: '화이트',
                qty: 300,
                agencyPrice: 90000,
                weight: 15,
                totalWeightKg: 4500,
                totalWeightTon: 4.5,
                amount: 27000000,
                spec: '고급형',
                memo: '계약 해지'
            },
            {
                item1: '수전',
                color: '무광니켈',
                qty: 300,
                agencyPrice: 60000,
                weight: 2,
                totalWeightKg: 600,
                totalWeightTon: 0.6,
                amount: 18000000,
                spec: '일반',
                memo: ''
            }
        ]
    }
];
