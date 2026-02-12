import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';

export function RetailOrderReviewPage() {
    return (
        <PageShell path="/sales/retail/review">
            <div className="p-8"><h2 className="text-2xl font-bold">발주 검수 리스트</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}

export function RetailOrderDetailPage() {
    return (
        <PageShell path="/sales/retail/order/:id">
            <div className="p-8"><h2 className="text-2xl font-bold">발주 상세</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}

export function RetailOrderApprovalPage() {
    return (
        <PageShell path="/sales/retail/approval">
            <div className="p-8"><h2 className="text-2xl font-bold">발주 결재 (승인/반려/보류)</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}
