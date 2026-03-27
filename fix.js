const fs = require('fs');
const filepath = 'src/router/index.jsx';

const lines = fs.readFileSync(filepath, 'utf8').split('\n');
const topHalf = lines.slice(0, 241).join('\n');

const bottomHalf = `
          {/* ── 영업 활동 (공통) — 추가 메뉴 ── */}
          <Route path={toRelative(ROUTES.SALES_DELIVERY_REQUEST_STATUS)} element={<DeliveryRequestStatusPage />} />
          <Route path={toRelative(ROUTES.SALES_DELIVERY_REQUEST_DETAIL)} element={<DeliveryRequestDetailPage />} />
          <Route path={toRelative(ROUTES.SALES_DELIVERY_APPROVAL)} element={<SalesDeliveryApprovalPage />} />

          {/* ── 영업 관리 — 리테일팀 (비활성화) ── */}
          <Route path={toRelative(ROUTES.SHORT_PROJECT)} element={<ShortProjectPage />} />
          <Route path={toRelative(ROUTES.SHORT_PROJECT_REGISTER)} element={<PlaceholderPage path={ROUTES.SHORT_PROJECT_REGISTER} description="단납 현장 등록 메뉴 영역입니다." icon="🏗️" />} />
          <Route path={toRelative(ROUTES.SHORT_PROJECT_APPROVAL)} element={<PlaceholderPage path={ROUTES.SHORT_PROJECT_APPROVAL} description="단납 현장 결재 메뉴 영역입니다." icon="✅" />} />
          <Route path={toRelative(ROUTES.SHORT_PROJECT_HISTORY)} element={<PlaceholderPage path={ROUTES.SHORT_PROJECT_HISTORY} description="단납 현장 내역 메뉴 영역입니다." icon="📑" />} />

          {/* ── 영업 관리 — 타일영업팀·영업지원팀 (임시) ── */}
          <Route path={toRelative(ROUTES.TILE_TEAM)} element={<TileTeamPage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT)} element={<SalesSupportPage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT_RECEIVABLE)} element={<SupportReceivablePage />} />
          <Route path={toRelative(ROUTES.SALES_SUPPORT_DISCOUNT_PROMOTION)} element={<DiscountPromotionPage />} />

          {/* ── 영업 결재 (권한 가드 적용) ── */}
          <Route
            path={toRelative(ROUTES.APPROVAL_SALES)}
            element={
              <Guard permission={PERMISSIONS.APPROVAL} fallback={<Navigate to={ROUTES.FORBIDDEN} replace />}>
                <SalesApprovalPage />
              </Guard>
            }
          />
          <Route
            path={toRelative(ROUTES.APPROVAL_DELIVERY)}
            element={
              <Guard permission={PERMISSIONS.APPROVAL} fallback={<Navigate to={ROUTES.FORBIDDEN} replace />}>
                <DeliveryApprovalPage />
              </Guard>
            }
          />

          {/* ── 재고 / 납품 ── */}
          <Route path={toRelative(ROUTES.DELIVERY_REQUEST)} element={<DeliveryRequestPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_HISTORY)} element={<DeliveryHistoryPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_PLAN)} element={<DeliveryPlanPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_INVENTORY)} element={<InventoryPage />} />
          <Route path={toRelative(ROUTES.DELIVERY_DEMAND)} element={<PlaceholderPage path={ROUTES.DELIVERY_DEMAND} description="수요예측 메뉴 영역입니다." icon="📈" />} />

          {/* ── 재무 (채권·수금·여신·매입매출) ── */}
          <Route path={toRelative(ROUTES.FINANCE_PURCHASE_SALES)} element={<PurchaseSalesPage />} />
          <Route path={toRelative(ROUTES.FINANCE_RECEIVABLE)} element={<ReceivablesPage />} />
          <Route path={toRelative(ROUTES.FINANCE_BILL)} element={<BillsDepositsPage />} />
          <Route path={toRelative(ROUTES.FINANCE_CREDIT)} element={<CreditCollateralPage />} />

          {/* ── 대리점 포털 (온라인 주문 비활성화) ── */}
          <Route path={toRelative(ROUTES.PARTNER_NOTICE)} element={<PartnerNoticePage />} />
          <Route path={toRelative(ROUTES.PARTNER_AS)} element={<PartnerAsRedirect />} />
          <Route path={toRelative(ROUTES.PARTNER_CATALOG)} element={<PlaceholderPage path={ROUTES.PARTNER_CATALOG} description="카탈로그 메뉴 영역입니다." icon="📖" />} />
          <Route path={toRelative(ROUTES.PARTNER_DELIVERY)} element={<PartnerDeliveryPage />} />
          <Route path={toRelative(ROUTES.PARTNER_DISPATCH)} element={<PlaceholderPage path={ROUTES.PARTNER_DISPATCH} description="배차 현황 메뉴 영역입니다." icon="🚚" />} />
          {/* 하위 호환: /partner/receivable → 거래 정보 조회 페이지로 리다이렉트 */}
          <Route
            path={toRelative(ROUTES.PARTNER_RECEIVABLE)}
            element={<Navigate to={ROUTES.FINANCE_RECEIVABLE} replace />}
          />
          <Route path={toRelative(ROUTES.PARTNER_BASIC)} element={<PartnerBasicInfoPage />} />
          <Route path={toRelative(ROUTES.PARTNER_BALANCE_CONFIRM)} element={<PlaceholderPage path={ROUTES.PARTNER_BALANCE_CONFIRM} description="채권채무잔액확인서 메뉴 영역입니다." icon="📜" />} />

          {/* ── 인사이트 — 성과 관리(KPI) ── */}
          <Route path={toRelative(ROUTES.ANALYTICS_RETAIL)} element={<SalesPerformancePage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PARTNER)} element={<PartnerPerformancePage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_PERSONAL_SALES)} element={<PlaceholderPage path={ROUTES.ANALYTICS_PERSONAL_SALES} description="개인별 매출 현황 메뉴 영역입니다." icon="📊" />} />
          <Route path={toRelative(ROUTES.ANALYTICS_CATEGORY_SALES)} element={<PlaceholderPage path={ROUTES.ANALYTICS_CATEGORY_SALES} description="카테고리별 판매 현황 메뉴 영역입니다." icon="🏷️" />} />

          {/* ── 인사이트 — 시장 분석 ── */}
          <Route path={toRelative(ROUTES.ANALYTICS_MARKET)} element={<MarketOverviewPage />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DATA_PRICE)} element={<PlaceholderPage path={ROUTES.ANALYTICS_DATA_PRICE} description="단가표 자료수집 메뉴 영역입니다." icon="📋" />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DATA_CATALOG)} element={<PlaceholderPage path={ROUTES.ANALYTICS_DATA_CATALOG} description="카달로그 자료수집 메뉴 영역입니다." icon="📖" />} />
          <Route path={toRelative(ROUTES.ANALYTICS_DATA_PROMO)} element={<PlaceholderPage path={ROUTES.ANALYTICS_DATA_PROMO} description="판매자료(프로모션 등) 수집 메뉴 영역입니다." icon="🎁" />} />
          <Route path={toRelative(ROUTES.ANALYTICS_CUSTOM)} element={<CustomReportPage />} />

          {/* ── 관리자 — 시스템 설정 ── */}
          <Route path={toRelative(ROUTES.ADMIN_USERS)} element={<UsersAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_ORG)} element={<OrgAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_PERMISSION)} element={<PermissionAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_CODE)} element={<CodesAdminPage />} />
          <Route path={toRelative(ROUTES.ADMIN_LOG)} element={<LogsAdminPage />} />

          {/* 404 — 매칭되지 않는 모든 경로 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`;

fs.writeFileSync(filepath, topHalf + '\n' + bottomHalf);
