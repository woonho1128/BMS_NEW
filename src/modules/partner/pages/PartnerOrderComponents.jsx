import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';

// PartnerProductOrderPage is in a separate file now

export function PartnerOrderListPage() {
    return (
        <PageShell path="/partner/order/list">
            <div className="p-8"><h2 className="text-2xl font-bold">발주 내역 조회</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}

export function PartnerOrderModificationPage() {
    return (
        <PageShell path="/partner/order/modify">
            <div className="p-8"><h2 className="text-2xl font-bold">반려 건 수정 재요청</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}

export function PartnerOrderDeliveryPage() {
    return (
        <PageShell path="/partner/order/delivery">
            <div className="p-8"><h2 className="text-2xl font-bold">출고 / 배송 조회</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}
