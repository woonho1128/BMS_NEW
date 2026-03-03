export const MOCK_COSTS = [
    {
        id: 1,
        project: "2026 상반기 프로젝트",
        type: "OEM",
        partNo: "CL333",
        name: "모던 세면기",
        factoryPrice: 68000,
        weight: 17.5,
        logisticsCost: 5000,
        otherRate: 24.6,
        marginRate: 37.8,
        status: "REQUEST",
        revisionType: "REGULAR",
        modifyDate: "2026-02-12",
        history: [
            { date: "2026-02-12", user: "김담당", field: "신규등록", prev: "-", next: "등록" }
        ]
    },
    {
        id: 2,
        project: "2025 하반기 프로젝트",
        type: "S/W",
        partNo: "SW-101",
        name: "스마트 비데",
        factoryPrice: 150000,
        weight: 5.2,
        logisticsCost: 2000,
        otherRate: 15.0,
        marginRate: 30.0,
        status: "ERP_REFLECTED",
        revisionType: "REGULAR",
        modifyDate: "2025-11-20",
        history: [
            { date: "2025-11-20", user: "이팀장", field: "ERP전송", prev: "기획확정", next: "ERP반영" }
        ]
    },
    {
        id: 3,
        project: "2026 상반기 프로젝트",
        type: "OEM",
        partNo: "TF-500",
        name: "터치 수전",
        factoryPrice: 45000,
        weight: 1.5,
        logisticsCost: 1000,
        otherRate: 20.0,
        marginRate: 35.0,
        status: "FACTORY_DONE",
        revisionType: "IRREGULAR",
        modifyDate: "2026-02-13",
        history: [
            { date: "2026-02-13", user: "공장장", field: "공장도가", prev: "42000", next: "45000" }
        ]
    }
];

export const STATUS_CODES = [
    { code: "REQUEST", label: "요청", color: "blue" },
    { code: "FACTORY_DONE", label: "공장입력완료", color: "cyan" },
    { code: "PROJECT_CONFIRMED", label: "프로젝트확인", color: "geekblue" },
    { code: "PLANNING_APPROVED", label: "기획확정", color: "purple" },
    { code: "ERP_REFLECTED", label: "ERP반영완료", color: "green" }
];
