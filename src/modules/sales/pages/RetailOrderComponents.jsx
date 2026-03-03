/**
 * RetailOrderComponents — 리테일 발주 관련 임시 페이지 모음
 *
 * 세 개의 임시 페이지를 한 파일에서 export합니다.
 * 각 페이지가 충분히 구현되면 개별 파일로 분리하는 것을 권장합니다.
 *
 * 연결 메뉴/경로:
 *   - RetailOrderReviewPage   → 영업 관리 > 리테일팀 관리 > 발주 검수 리스트   (/sales/retail/review)
 *   - RetailOrderDetailPage   → (라우터 내부 상세 경로)                         (/sales/retail/order/:id)
 *   - RetailOrderApprovalPage → 영업 관리 > 리테일팀 관리 > 발주 결재 (승인/반려/보류) (/sales/retail/approval)
 */
import React from 'react';
import { PlaceholderPage } from '../../../shared/components/PlaceholderPage/PlaceholderPage';
import { ROUTES } from '../../../router/routePaths';

/** 발주 검수 리스트 임시 페이지 */
export function RetailOrderReviewPage() {
    return (
        <PlaceholderPage
            path={ROUTES.SALES_RETAIL_REVIEW_LIST}
            description="리테일 발주 건별 검수 목록 기능이 추가될 예정입니다."
            icon="🔍"
        />
    );
}

/** 발주 상세 임시 페이지 */
export function RetailOrderDetailPage() {
    return (
        <PlaceholderPage
            title="발주 상세"
            description="발주 상세 정보 조회 기능이 추가될 예정입니다."
            icon="📄"
        />
    );
}

/** 발주 결재(승인/반려/보류) 임시 페이지 */
export function RetailOrderApprovalPage() {
    return (
        <PlaceholderPage
            path={ROUTES.SALES_RETAIL_APPROVAL}
            description="발주 승인·반려·보류 처리 기능이 추가될 예정입니다."
            icon="✅"
        />
    );
}
