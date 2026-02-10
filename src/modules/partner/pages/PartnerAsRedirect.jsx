import React, { useEffect, useRef } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';

const AS_SUPPORT_URL = 'https://assupport.daelimbath.com/';

export function PartnerAsRedirect() {
  const openedRef = useRef(false);

  useEffect(() => {
    if (openedRef.current) return; // StrictMode 이중 호출 방지
    openedRef.current = true;
    window.open(AS_SUPPORT_URL, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <PageShell path="/partner/as" description="AS 접수 외부 페이지가 새 탭에서 열립니다.">
      <p>AS 지원센터를 새 탭으로 열었습니다. 팝업이 차단된 경우 아래 링크를 클릭해 주세요:</p>
      <a href={AS_SUPPORT_URL} target="_blank" rel="noopener noreferrer">
        {AS_SUPPORT_URL}
      </a>
    </PageShell>
  );
}
