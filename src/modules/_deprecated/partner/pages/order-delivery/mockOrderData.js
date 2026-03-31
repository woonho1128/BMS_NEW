export const MOCK_ORDERS = [
    {
        orderNo: "ORD-2026-001",
        orderDate: "2026-02-12",
        dealer: "강남 대리점",
        project: "2026 상반기 프로젝트",
        totalAmount: 2700000,
        shipmentStatus: "PARTIAL",
        deliveryStatus: "IN_TRANSIT",
        items: [
            { id: 1, name: "양변기 CL-101", qty: 10, shippedQty: 5, price: 150000 },
            { id: 2, name: "세면기 WL-202", qty: 20, shippedQty: 20, price: 60000 }
        ],
        shipments: [
            {
                shipmentNo: "SHP-001",
                date: "2026-02-12",
                trackingNo: "654321987",
                carrier: "CJ대한통운",
                status: "DELIVERED",
                items: [
                    { name: "세면기 WL-202", qty: 20 }
                ]
            },
            {
                shipmentNo: "SHP-002",
                date: "2026-02-13",
                trackingNo: "123456789",
                carrier: "로젠택배",
                status: "IN_TRANSIT",
                items: [
                    { name: "양변기 CL-101", qty: 5 }
                ]
            }
        ]
    },
    {
        orderNo: "ORD-2026-002",
        orderDate: "2026-02-13",
        dealer: "부산 대리점",
        project: "부산 호텔 신축",
        totalAmount: 1500000,
        shipmentStatus: "WAIT",
        deliveryStatus: "READY",
        items: [
            { id: 3, name: "비데 BD-300", qty: 5, shippedQty: 0, price: 300000 }
        ],
        shipments: []
    },
    {
        orderNo: "ORD-2026-003",
        orderDate: "2026-02-10",
        dealer: "대전 대리점",
        project: "대전 아파트 리모델링",
        totalAmount: 5000000,
        shipmentStatus: "SHIPPED",
        deliveryStatus: "DELIVERED",
        items: [
            { id: 4, name: "수전 TF-500", qty: 50, shippedQty: 50, price: 100000 }
        ],
        shipments: [
            {
                shipmentNo: "SHP-003",
                date: "2026-02-11",
                trackingNo: "987654321",
                carrier: "우체국택배",
                status: "DELIVERED",
                items: [
                    { name: "수전 TF-500", qty: 50 }
                ]
            }
        ]
    }
];

export const SHIPMENT_STATUS = [
    { code: "WAIT", label: "출고대기", color: "default" },
    { code: "PARTIAL", label: "부분출고", color: "orange" },
    { code: "SHIPPED", label: "출고완료", color: "green" }
];

export const DELIVERY_STATUS = [
    { code: "READY", label: "배송준비", color: "default" },
    { code: "IN_TRANSIT", label: "배송중", color: "blue" },
    { code: "DELIVERED", label: "배송완료", color: "green" }
];
