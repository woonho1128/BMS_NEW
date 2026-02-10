import React, { useMemo, useState, useEffect } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import { classnames } from '../../../shared/utils/classnames';
import { Drawer } from '../../../shared/components/Drawer/Drawer';
import { useAuth } from '../../auth/hooks/useAuth';
import { hasPermission } from '../../../shared/constants/permissions';
import { PERMISSIONS } from '../../../shared/constants/permissions';
import { FileDown, X } from 'lucide-react';
import styles from './PartnerNoticePage.module.css';

const TAB_ALL = 'all';
const TAB_NOTICE = 'notice';
const TAB_PROMO = 'promo';
const TAB_WORK = 'work';

const TYPE_NOTICE = 'notice';
const TYPE_PROMO = 'promo';
const TYPE_WORK = 'work';

/** 목업 리스트 데이터 */
const MOCK_ITEMS = [
  { id: '1', type: TYPE_NOTICE, title: '2025년 1분기 대리점 운영 안내', date: '2025-01-15', hasAttachment: true },
  { id: '2', type: TYPE_PROMO, title: '신제품 브로슈어 (PDF)', date: '2025-01-12', hasAttachment: true },
  { id: '3', type: TYPE_WORK, title: '출고 신청 양식 및 매뉴얼', date: '2025-01-10', hasAttachment: true },
  { id: '4', type: TYPE_NOTICE, title: '연말 연휴 물류 휴무 안내', date: '2024-12-20', hasAttachment: false },
  { id: '5', type: TYPE_PROMO, title: '시즌 프로모션 가이드', date: '2024-12-15', hasAttachment: true },
  { id: '6', type: TYPE_WORK, title: '정산 자료 제출 요령', date: '2024-12-01', hasAttachment: true },
  { id: '7', type: TYPE_NOTICE, title: '시스템 점검 안내', date: '2024-11-28', hasAttachment: false },
];

/** 상세용 목업 (본문, 작성자, 첨부파일) */
const MOCK_DETAIL = {
  '1': {
    body: '안녕하세요. 2025년 1분기 대리점 운영 관련하여 아래와 같이 안내드립니다.\n\n1. 영업 목표 및 인센티브 정책이 일부 변경됩니다. 자세한 내용은 첨부 자료를 참고해 주세요.\n2. 분기 말 정산 일정은 4월 첫 주로 예정되어 있습니다.\n3. 문의 사항은 담당자에게 연락 부탁드립니다.\n\n감사합니다.',
    author: '영업지원팀',
    attachments: [{ name: '2025_1분기_운영안내.pdf', url: '#' }, { name: '인센티브_정책.pdf', url: '#' }],
  },
  '2': {
    body: '신제품 브로슈어를 공유합니다. 대리점에서 고객 상담 시 활용해 주세요.',
    author: '마케팅팀',
    attachments: [{ name: '신제품_브로슈어_2025.pdf', url: '#' }],
  },
  '3': {
    body: '출고 신청 시 사용하실 양식과 매뉴얼을 첨부했습니다. 반드시 최신 버전을 사용해 주세요.',
    author: '물류팀',
    attachments: [{ name: '출고신청_양식.xlsx', url: '#' }, { name: '출고_매뉴얼_v2.pdf', url: '#' }],
  },
  '4': {
    body: '12월 30일(월) ~ 1월 2일(목) 연말 연휴 기간 물류 휴무로 인해 출고가 중단됩니다. 주문 시 일정을 참고해 주세요.',
    author: '물류팀',
    attachments: [],
  },
  '5': {
    body: '시즌 프로모션 가이드라인을 첨부합니다.',
    author: '마케팅팀',
    attachments: [{ name: '시즌_프로모션_가이드.pdf', url: '#' }],
  },
  '6': {
    body: '정산 자료 제출 요령 및 제출 기한을 안내드립니다. 미제출 시 정산이 지연될 수 있사오니 기한 내 제출 부탁드립니다.',
    author: '정산팀',
    attachments: [{ name: '정산_제출_요령.pdf', url: '#' }],
  },
  '7': {
    body: '11월 30일(토) 02:00 ~ 06:00 시스템 점검으로 인해 포털 접속이 불가합니다. 이용에 참고 부탁드립니다.',
    author: '시스템관리팀',
    attachments: [],
  },
};

function getTypeLabel(type) {
  switch (type) {
    case TYPE_NOTICE:
      return '공지';
    case TYPE_PROMO:
      return '자료';
    case TYPE_WORK:
      return '자료';
    default:
      return type;
  }
}

function getTypeBadgeLabel(type) {
  switch (type) {
    case TYPE_PROMO:
      return '홍보자료';
    case TYPE_WORK:
      return '업무자료';
    default:
      return null;
  }
}

export function PartnerNoticePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(TAB_ALL);
  const [drawerItem, setDrawerItem] = useState(null);

  const isAdmin = hasPermission(user, PERMISSIONS.MANAGE_PARTNER_NOTICE);

  const filteredItems = useMemo(() => {
    if (activeTab === TAB_ALL) return MOCK_ITEMS;
    return MOCK_ITEMS.filter((item) => item.type === activeTab);
  }, [activeTab]);

  const tabs = [
    { key: TAB_ALL, label: '전체' },
    { key: TAB_NOTICE, label: '공지사항' },
    { key: TAB_PROMO, label: '홍보자료' },
    { key: TAB_WORK, label: '업무자료' },
  ];

  const handleDetail = (row) => {
    setDrawerItem(row);
  };

  const handleCloseDrawer = () => {
    setDrawerItem(null);
  };

  const handleRegister = () => {
    alert('등록하기 화면은 추후 연동됩니다.');
  };

  const handleEdit = (item) => {
    alert(`수정: ${item.title} (추후 연동)`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`"${item.title}"을(를) 삭제하시겠습니까?`)) {
      alert('삭제는 추후 API 연동 후 적용됩니다.');
      handleCloseDrawer();
    }
  };

  const handleDownload = (e, file) => {
    if (file.url === '#') {
      e.preventDefault();
      alert(`다운로드: ${file.name} (목업)`);
    }
  };

  // Drawer 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (drawerItem) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [drawerItem]);

  const detail = drawerItem ? MOCK_DETAIL[drawerItem.id] : null;
  const attachments = detail?.attachments ?? [];

  return (
    <PageShell
      path={ROUTES.PARTNER_NOTICE}
      description="공지사항과 홍보·업무 자료를 확인할 수 있습니다."
      actions={
        <button type="button" className={styles.primaryBtn} onClick={handleRegister}>
          등록하기
        </button>
      }
    >
      <div className={styles.wrapper}>
        <div className={styles.tabList} role="tablist" aria-label="카테고리">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>유형</th>
                <th className={styles.th}>제목</th>
                <th className={styles.th}>작성일</th>
                <th className={styles.th}>첨부파일</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.emptyCell}>
                    해당 카테고리에 게시물이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredItems.map((row) => {
                  const badgeLabel = getTypeBadgeLabel(row.type);
                  return (
                    <tr key={row.id} className={styles.row}>
                      <td className={styles.td}>{getTypeLabel(row.type)}</td>
                      <td className={styles.td}>
                        <button
                          type="button"
                          className={styles.titleLink}
                          onClick={() => handleDetail(row)}
                        >
                          <span className={styles.titleCell}>
                            {row.title}
                            {badgeLabel && (
                              <span
                                className={classnames(
                                  styles.badge,
                                  row.type === TYPE_PROMO && styles.badgePromo,
                                  row.type === TYPE_WORK && styles.badgeWork
                                )}
                              >
                                {badgeLabel}
                              </span>
                            )}
                          </span>
                        </button>
                      </td>
                      <td className={styles.td}>{row.date}</td>
                      <td className={styles.td}>{row.hasAttachment ? '있음' : '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 슬라이드 오버: 상세보기 */}
      <Drawer open={Boolean(drawerItem)} onClose={handleCloseDrawer} width="45%">
        {drawerItem && (
          <>
            {/* 헤더: 닫기(X) + 관리자일 때 수정/삭제 */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerActionsTop}>
                {isAdmin && (
                  <div className={styles.drawerAdminActions}>
                    <button type="button" className={styles.editBtn} onClick={() => handleEdit(drawerItem)}>
                      수정
                    </button>
                    <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(drawerItem)}>
                      삭제
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={handleCloseDrawer}
                  aria-label="닫기"
                >
                  <X size={22} strokeWidth={2} />
                </button>
              </div>
            </div>

            <div className={styles.drawerScroll}>
              {/* 상단: 배지, 제목, 작성일·작성자 */}
              <div className={styles.drawerMeta}>
                <span
                  className={classnames(
                    styles.drawerBadge,
                    drawerItem.type === TYPE_NOTICE && styles.drawerBadgeNotice,
                    drawerItem.type === TYPE_PROMO && styles.badgePromo,
                    drawerItem.type === TYPE_WORK && styles.badgeWork
                  )}
                >
                  {drawerItem.type === TYPE_NOTICE ? '공지' : getTypeBadgeLabel(drawerItem.type) ?? '자료'}
                </span>
                <h2 className={styles.drawerTitle}>{drawerItem.title}</h2>
                <p className={styles.drawerDateAuthor}>
                  {drawerItem.date} · {detail?.author ?? '-'}
                </p>
              </div>

              {/* 본문 (스크롤) */}
              <div className={styles.drawerBody}>
                <div className={styles.drawerBodyText}>
                  {detail?.body?.split('\n').map((line, i) => (
                    <p key={i}>{line || <br />}</p>
                  )) ?? '내용 없음'}
                </div>
              </div>

              {/* 하단: 첨부파일 */}
              <div className={styles.drawerAttachments}>
                <h3 className={styles.drawerAttachmentsTitle}>첨부파일</h3>
                {attachments.length === 0 ? (
                  <p className={styles.drawerAttachmentsEmpty}>첨부된 파일이 없습니다.</p>
                ) : (
                  <ul className={styles.attachmentList}>
                    {attachments.map((file, idx) => (
                      <li key={idx}>
                        <a
                          href={file.url}
                          className={styles.attachmentLink}
                          download={file.name}
                          onClick={(e) => handleDownload(e, file)}
                        >
                          <FileDown size={18} strokeWidth={2} />
                          <span>{file.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 관리자: 하단 고정 액션 (모바일 대비) */}
            {isAdmin && (
              <div className={styles.drawerFooter}>
                <button type="button" className={styles.editBtn} onClick={() => handleEdit(drawerItem)}>
                  수정
                </button>
                <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(drawerItem)}>
                  삭제
                </button>
              </div>
            )}
          </>
        )}
      </Drawer>
    </PageShell>
  );
}
