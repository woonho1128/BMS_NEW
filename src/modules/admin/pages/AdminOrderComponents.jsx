import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';

export function AdminTotalOrderPage() {
    return (
        <PageShell path="/admin/order/total">
            <div className="p-8"><h2 className="text-2xl font-bold">전체 발주 조회</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}

export function AdminStatusChangePage() {
    return (
        <PageShell path="/admin/order/status-force">
            <div className="p-8"><h2 className="text-2xl font-bold">상태 강제 변경</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}

export function AdminErpPage() {
    return (
        <PageShell path="/admin/order/erp">
            <div className="p-8"><h2 className="text-2xl font-bold">ERP 전송 관리 / 재전송</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}

export function AdminOrderLogPage() {
    return (
        <PageShell path="/admin/order/history-log">
            <div className="p-8"><h2 className="text-2xl font-bold">발주 이력 / 로그</h2><p>기능 구현 예정</p></div>
        </PageShell>
    );
}
