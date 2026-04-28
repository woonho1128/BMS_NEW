import { Download, Printer } from 'lucide-react';
import { Button } from '../../../../shared/components/Button/Button';

export function ReceivablesHeaderActions({ styles, onDownload, disableDownload }) {
  return (
    <div className={styles.headerActions}>
      <Button variant="icon" onClick={onDownload} disabled={disableDownload} aria-label="다운로드(엑셀)" title="다운로드(엑셀)">
        <Download size={18} />
      </Button>
      <Button variant="icon" onClick={() => window.print()} aria-label="인쇄" title="인쇄">
        <Printer size={18} />
      </Button>
    </div>
  );
}

export function ReceivablesTabs({ styles, activeTab, setActiveTab }) {
  const tabs = [
    { key: 'receivable', label: '채권' },
    { key: 'bill', label: '어음' },
    { key: 'collateral', label: '담보' },
    { key: 'deposit', label: '입금' },
  ];

  return (
    <div className={styles.tabs} role="tablist" aria-label="채권 정보 탭">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          className={activeTab === tab.key ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default ReceivablesTabs;
