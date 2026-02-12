import React from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';

export function PartnerOrderPage() {
  return (
    <PageShell path="/partner/order">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">발주 (임시 페이지)</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">이곳은 파트너 발주 기능을 위한 임시 페이지입니다.</p>
          <p className="text-gray-500 mt-2 text-sm">기능 구현 준비 중...</p>
        </div>
      </div>
    </PageShell>
  );
}
