export const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "프리미엄 양변기",
        model: "DL-1001",
        brand: "대림테크",
        category: "위생도기",
        status: "ACTIVE",
        basePrice: 100000,
        baseRetailPrice: 150000,
        description: "프리미엄 세라믹 양변기입니다.",
        options: [
            {
                id: 1,
                name: "색상",
                values: [
                    { id: 101, name: "화이트", extraPrice: 0, sku: "DL-1001-WH", stock: 100, active: true },
                    { id: 102, name: "아이보리", extraPrice: 5000, sku: "DL-1001-IV", stock: 50, active: true }
                ]
            }
        ],
        pricingPolicy: {
            gradeDiscounts: [
                { grade: "A", discountRate: 10 },
                { grade: "B", discountRate: 5 },
                { grade: "C", discountRate: 0 }
            ],
            volumeDiscounts: [
                { min: 0, max: 100, discountRate: 0 },
                { min: 100, max: 300, discountRate: 3 },
                { min: 300, max: 500, discountRate: 5 },
                { min: 500, max: null, discountRate: 7 }
            ]
        },
        specs: [
            { name: "재질", value: "세라믹" },
            { name: "원산지", value: "한국" }
        ],
        images: {
            main: null,
            sub: []
        }
    },
    {
        id: 2,
        name: "스탠다드 세면대",
        model: "WB-2002",
        brand: "워터웍스",
        category: "세면기",
        status: "ACTIVE",
        basePrice: 80000,
        baseRetailPrice: 110000,
        description: "심플한 디자인의 세면대입니다.",
        options: [],
        pricingPolicy: {
            gradeDiscounts: [],
            volumeDiscounts: []
        },
        specs: [],
        images: {
            main: null,
            sub: []
        }
    },
    {
        id: 3,
        name: "고급 샤워 수전",
        model: "FCT-3050",
        brand: "대림테크",
        category: "수전",
        status: "INACTIVE",
        basePrice: 120000,
        baseRetailPrice: 180000,
        description: "절수형 고급 샤워 수전.",
        options: [],
        pricingPolicy: {
            gradeDiscounts: [],
            volumeDiscounts: []
        },
        specs: [],
        images: {
            main: null,
            sub: []
        }
    },
    {
        id: 4,
        name: "비데일체형 도기",
        model: "BD-500",
        brand: "스마트바스",
        category: "위생도기",
        status: "ERP_PENDING",
        basePrice: 350000,
        baseRetailPrice: 500000,
        description: "신제품 비데 일체형.",
        options: [],
        pricingPolicy: {
            gradeDiscounts: [],
            volumeDiscounts: []
        },
        specs: [],
        images: {
            main: null,
            sub: []
        }
    }
];
