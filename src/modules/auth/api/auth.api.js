/**
 * Mock login API (권한/데이터 연동은 후속 단계)
 */

const MOCK_TOKEN = 'mock-token';
const MOCK_DELAY_MS = 500;

/**
 * @param {{ userId: string; password: string }} payload
 * @returns {Promise<{ success: boolean; token?: string; user?: any; message?: string }>}
 */
export function login(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (payload?.userId && payload?.password) {
        const rawId = String(payload.userId).trim();
        const idLower = rawId.toLowerCase();

        // 간단한 Mock 규칙:
        // - 아이디에 agency/partner/dealer/대리점 이 포함되면 대리점(AGENCY)
        // - 그 외는 본사(HEADQUARTERS)
        const isAgency =
          idLower.includes('agency') ||
          idLower.includes('partner') ||
          idLower.includes('dealer') ||
          rawId.includes('대리점');

        const user = isAgency
          ? {
              id: 'A-1',
              name: rawId || '이규대리',
              role: 'AGENCY',
              partnerId: '1',
              partnerName: '이규대리점',
              position: '영업담당',
              permissions: ['VIEW_FINANCE'],
            }
          : {
              id: 'H-1',
              name: rawId || '김관리',
              role: 'HEADQUARTERS',
              department: 'IT팀',
              position: '시스템 관리자',
              permissions: ['APPROVAL', 'VIEW_FINANCE', 'MANAGE_SALES', 'MANAGE_DELIVERY', 'VIEW_REPORT', 'MANAGE_PARTNER_NOTICE'],
            };

        resolve({ success: true, token: MOCK_TOKEN, user });
      } else {
        resolve({ success: false, message: '아이디와 비밀번호를 입력하세요.' });
      }
    }, MOCK_DELAY_MS);
  });
}

/**
 * @returns {Promise<{ success: boolean }>}
 */
export function logout() {
  return Promise.resolve({ success: true });
}
