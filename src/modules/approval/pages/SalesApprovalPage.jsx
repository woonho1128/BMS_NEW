import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { classnames } from '../../../shared/utils/classnames';
import { ROUTES } from '../../../router/routePaths';
import {
  APPROVAL_CATEGORY,
  APPROVAL_CATEGORY_LABEL,
  APPROVAL_STATUS,
  getApprovalList,
} from '../data/salesApprovalMock';
import styles from './SalesApprovalPage.module.css';

const TAB_PENDING = 'pending';
const TAB_COMPLETED = 'completed';

const STATUS_LABEL = {
  [APPROVAL_STATUS.PENDING]: '결재 진행',
  [APPROVAL_STATUS.APPROVED]: '결재 완료',
  [APPROVAL_STATUS.REJECTED]: '결재 반려',
};

const CATEGORY_OPTIONS = [
  { key: 'all', label: '전체' },
  { key: APPROVAL_CATEGORY.SHORT_PROJECT, label: APPROVAL_CATEGORY_LABEL[APPROVAL_CATEGORY.SHORT_PROJECT] },
  { key: APPROVAL_CATEGORY.SALES_INFO, label: APPROVAL_CATEGORY_LABEL[APPROVAL_CATEGORY.SALES_INFO] },
  { key: APPROVAL_CATEGORY.WEEKLY, label: APPROVAL_CATEGORY_LABEL[APPROVAL_CATEGORY.WEEKLY] },
  { key: APPROVAL_CATEGORY.TRIP, label: APPROVAL_CATEGORY_LABEL[APPROVAL_CATEGORY.TRIP] },
];

export function SalesApprovalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [activeTab, setActiveTab] = useState(TAB_PENDING);
  const [categoryFilter, setCategoryFilter] = useState(
    CATEGORY_OPTIONS.some((v) => v.key === initialCategory) ? initialCategory : 'all'
  );
  const [dealerKeyword, setDealerKeyword] = useState('');
  const [titleKeyword, setTitleKeyword] = useState('');

  const rows = getApprovalList();
  const filtered = useMemo(() => {
    let list = rows.filter((item) =>
      activeTab === TAB_PENDING ? item.status === APPROVAL_STATUS.PENDING : item.status !== APPROVAL_STATUS.PENDING
    );

    if (categoryFilter !== 'all') {
      list = list.filter((item) => item.category === categoryFilter);
    }

    const dealerQuery = dealerKeyword.trim().toLowerCase();
    if (dealerQuery) {
      list = list.filter((item) => String(item?.site?.dealer || '').toLowerCase().includes(dealerQuery));
    }

    const titleQuery = titleKeyword.trim().toLowerCase();
    if (titleQuery) {
      list = list.filter((item) => String(item.title || '').toLowerCase().includes(titleQuery));
    }

    return list;
  }, [rows, activeTab, categoryFilter, dealerKeyword, titleKeyword]);

  return (
    <PageShell
      path={ROUTES.APPROVAL_SALES}
      title="영업 결재"
      description="리스트에서 건을 선택하면 상세 화면에서 결재 의견 입력 후 승인/반려할 수 있습니다."
    >
      <div className={styles.wrapper}>
        <div className={styles.tabList} role="tablist" aria-label="결재 상태">
          <button
            type="button"
            className={classnames(styles.tab, activeTab === TAB_PENDING && styles.tabActive)}
            aria-selected={activeTab === TAB_PENDING}
            onClick={() => setActiveTab(TAB_PENDING)}
          >
            결재 대기
          </button>
          <button
            type="button"
            className={classnames(styles.tab, activeTab === TAB_COMPLETED && styles.tabActive)}
            aria-selected={activeTab === TAB_COMPLETED}
            onClick={() => setActiveTab(TAB_COMPLETED)}
          >
            결재 완료
          </button>
        </div>

        <Card>
          <CardBody>
            <div className={styles.categoryTabsRow}>
              <div className={styles.categoryTabs} role="tablist" aria-label="카테고리">
                {CATEGORY_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={classnames(styles.categoryTab, categoryFilter === option.key && styles.categoryTabActive)}
                    onClick={() => setCategoryFilter(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterRow}>
              <input
                className={styles.filterSelect}
                value={dealerKeyword}
                onChange={(e) => setDealerKeyword(e.target.value)}
                placeholder="대리점 검색"
              />
              <input
                className={styles.filterSelect}
                value={titleKeyword}
                onChange={(e) => setTitleKeyword(e.target.value)}
                placeholder="현장명 / 제목 검색"
              />
            </div>
          </CardBody>
        </Card>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>카테고리</th>
                <th className={styles.th}>제목</th>
                <th className={styles.th}>기안자</th>
                <th className={styles.th}>기안일</th>
                <th className={styles.th}>진행상태</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyCell}>
                    조회 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={styles.row}
                    onClick={() => navigate(`${ROUTES.APPROVAL_SALES}/${item.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        navigate(`${ROUTES.APPROVAL_SALES}/${item.id}`);
                      }
                    }}
                  >
                    <td className={styles.td}>
                      <span className={classnames(styles.categoryBadge, styles[`category_${item.category}`])}>
                        {APPROVAL_CATEGORY_LABEL[item.category] || item.category}
                      </span>
                    </td>
                    <td className={styles.td}>{item.title}</td>
                    <td className={styles.td}>{item.drafter}</td>
                    <td className={styles.td}>{item.date}</td>
                    <td className={styles.td}>{STATUS_LABEL[item.status] || item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
