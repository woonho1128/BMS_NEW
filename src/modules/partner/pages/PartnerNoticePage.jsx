import { useMemo, useState } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../router/routePaths';
import { notify, confirmAction } from '../../../shared/utils/notify';
import styles from './PartnerNoticePage.module.css';

const TAB_ALL = 'all';
const TAB_NOTICE = 'notice';
const TAB_PROMO = 'promo';
const TAB_WORK = 'work';

const TODAY = '2026-04-07';

const INITIAL_ITEMS = [
  {
    id: '1',
    type: TAB_NOTICE,
    title: '2026년 2분기 운영 공지',
    date: '2026-04-01',
    body: '2분기 운영 정책과 일정 안내입니다.',
    files: ['운영공지.pdf'],
    exposeFrom: '2026-04-01',
    exposeTo: '2026-05-15',
    showOnLogin: true,
  },
  {
    id: '2',
    type: TAB_PROMO,
    title: '4월 프로모션 안내',
    date: '2026-04-03',
    body: '프로모션 상품과 적용 기간을 확인해주세요.',
    files: ['프로모션.pdf'],
    exposeFrom: '2026-04-08',
    exposeTo: '2026-04-30',
    showOnLogin: false,
  },
  {
    id: '3',
    type: TAB_WORK,
    title: '업무 매뉴얼 v2',
    date: '2026-04-05',
    body: '대리점 업무 처리 절차 안내입니다.',
    files: ['업무매뉴얼.pdf'],
    exposeFrom: '2026-03-01',
    exposeTo: '2026-03-31',
    showOnLogin: false,
  },
  {
    id: '4',
    type: TAB_NOTICE,
    title: '대리점 시스템 이용정책 변경 및 개인정보 처리방침 개정 안내(필독) - 2026년 2분기 반영',
    date: '2026-04-06',
    body: '안녕하세요. 대리점 포털 운영팀입니다.\n\n2026년 2분기부터 로그인 보안 정책과 첨부파일 보관 정책이 아래와 같이 변경됩니다.\n1) 비밀번호 만료 주기 90일 적용\n2) 동일 IP 과다 로그인 탐지 시 추가 인증\n3) 공지/자료실 첨부파일의 보관 기한 분류(필수/일반)\n\n본 공지는 로그인 시 팝업으로 우선 노출되며, 상세 정책은 첨부된 운영 가이드 문서를 참고해 주세요.\n\n감사합니다.',
    files: ['운영가이드_개정본_v3.pdf', '개인정보처리방침_2026Q2.pdf', 'FAQ_보안정책.pdf'],
    exposeFrom: '2026-04-06',
    exposeTo: '2026-06-30',
    showOnLogin: true,
  },
];

function getExposeStatus(item) {
  if (TODAY < item.exposeFrom) return 'scheduled';
  if (TODAY > item.exposeTo) return 'ended';
  return 'active';
}

function formatTypeLabel(type) {
  if (type === TAB_NOTICE) return '공지';
  if (type === TAB_PROMO) return '홍보';
  return '업무';
}

function getStatusLabel(item) {
  const status = getExposeStatus(item);
  if (status === 'active') return '노출중';
  if (status === 'scheduled') return '예약';
  return '만료';
}

export function PartnerNoticePage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [tab, setTab] = useState(TAB_ALL);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loginFilter, setLoginFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    type: TAB_NOTICE,
    title: '',
    body: '',
    exposeFrom: TODAY,
    exposeTo: '2026-12-31',
    showOnLogin: false,
    filesText: '',
  });

  const tabs = [
    { key: TAB_ALL, label: '전체' },
    { key: TAB_NOTICE, label: '공지사항' },
    { key: TAB_PROMO, label: '홍보자료' },
    { key: TAB_WORK, label: '업무자료' },
  ];

  const list = useMemo(() => {
    return items.filter((item) => {
      if (tab !== TAB_ALL && item.type !== tab) return false;
      if (query && !item.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (statusFilter !== 'all' && getExposeStatus(item) !== statusFilter) return false;
      if (loginFilter === 'login' && !item.showOnLogin) return false;
      if (loginFilter === 'normal' && item.showOnLogin) return false;
      return true;
    });
  }, [items, tab, query, statusFilter, loginFilter]);

  const selected = list.find((item) => item.id === selectedId) || items.find((item) => item.id === selectedId) || null;

  const handleToggleExpose = (id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const isActive = getExposeStatus(item) === 'active';
        if (isActive) {
          return { ...item, exposeTo: '2026-04-06' };
        }
        return { ...item, exposeFrom: TODAY, exposeTo: '2026-12-31' };
      })
    );
    notify.success('노출 상태가 변경되었습니다. (목업)');
  };

  const handleDuplicate = (target) => {
    const clone = {
      ...target,
      id: String(Date.now()),
      title: `${target.title} (복제본)`,
      date: TODAY,
      exposeFrom: TODAY,
      exposeTo: '2026-12-31',
    };
    setItems((prev) => [clone, ...prev]);
    notify.success('공지/자료를 복제했습니다. (목업)');
  };

  const openRegister = () => {
    setRegisterForm({
      type: TAB_NOTICE,
      title: '',
      body: '',
      exposeFrom: TODAY,
      exposeTo: '2026-12-31',
      showOnLogin: false,
      filesText: '',
    });
    setIsRegisterOpen(true);
  };

  const handleRegisterSubmit = () => {
    if (!registerForm.title.trim()) {
      notify.warning('제목을 입력해주세요.');
      return;
    }
    if (!registerForm.body.trim()) {
      notify.warning('내용을 입력해주세요.');
      return;
    }
    if (registerForm.exposeFrom > registerForm.exposeTo) {
      notify.warning('노출 종료일은 시작일보다 같거나 이후여야 합니다.');
      return;
    }

    const files = registerForm.filesText
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const newItem = {
      id: String(Date.now()),
      type: registerForm.type,
      title: registerForm.title.trim(),
      date: TODAY,
      body: registerForm.body.trim(),
      files,
      exposeFrom: registerForm.exposeFrom,
      exposeTo: registerForm.exposeTo,
      showOnLogin: registerForm.showOnLogin,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsRegisterOpen(false);
    notify.success('공지/자료가 등록되었습니다. (목업)');
  };

  return (
    <PageShell
      path={ROUTES.PARTNER_NOTICE}
      title="공지/자료실"
      actions={<button className={styles.primaryBtn} onClick={openRegister}>등록하기</button>}
    >
      <div className={styles.wrapper}>
        <div className={styles.tabList}>
          {tabs.map((item) => (
            <button key={item.key} className={`${styles.tab} ${tab === item.key ? styles.tabActive : ''}`} onClick={() => setTab(item.key)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.filterRow}>
            <input className={styles.searchInput} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="제목 검색" />
            <select className={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">상태 전체</option>
              <option value="active">노출중</option>
              <option value="scheduled">예약</option>
              <option value="ended">만료</option>
            </select>
            <select className={styles.select} value={loginFilter} onChange={(e) => setLoginFilter(e.target.value)}>
              <option value="all">노출 방식 전체</option>
              <option value="login">로그인 팝업</option>
              <option value="normal">일반 노출</option>
            </select>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>유형</th>
                <th className={styles.th}>제목</th>
                <th className={styles.th}>노출 상태</th>
                <th className={styles.th}>노출 기간</th>
                <th className={styles.th}>로그인 노출</th>
                <th className={styles.th}>작성일</th>
                <th className={styles.th}>관리</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={7} className={styles.emptyCell}>조회 결과가 없습니다.</td></tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className={styles.row}>
                    <td className={styles.td}>{formatTypeLabel(item.type)}</td>
                    <td className={styles.td}>
                      <button className={styles.titleLink} onClick={() => setSelectedId(item.id)} title={item.title}>{item.title}</button>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.statusBadge} ${
                        getExposeStatus(item) === 'active'
                          ? styles.statusActive
                          : getExposeStatus(item) === 'scheduled'
                            ? styles.statusScheduled
                            : styles.statusEnded
                      }`}
                      >
                        {getStatusLabel(item)}
                      </span>
                    </td>
                    <td className={styles.td}>{item.exposeFrom} ~ {item.exposeTo}</td>
                    <td className={styles.td}>{item.showOnLogin ? 'Y' : 'N'}</td>
                    <td className={styles.td}>{item.date}</td>
                    <td className={styles.td}>
                      <button className={styles.editBtn} onClick={() => notify.info('수정 기능은 추후 연동됩니다.')}>수정</button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => {
                          if (confirmAction(`"${item.title}"을(를) 삭제하시겠습니까?`)) {
                            setItems((prev) => prev.filter((v) => v.id !== item.id));
                            notify.success('삭제되었습니다. (목업)');
                          }
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selected ? (
          <div className={styles.modalOverlay} onClick={() => setSelectedId(null)}>
            <section className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
              <header className={styles.detailHeader}>
                <div>
                  <h3 className={styles.drawerTitle}>{selected.title}</h3>
                  <p className={styles.drawerDateAuthor}>작성일 {selected.date}</p>
                </div>
                <div className={styles.detailActions}>
                  <button className={styles.editBtn} onClick={() => handleToggleExpose(selected.id)}>
                    {getExposeStatus(selected) === 'active' ? '노출중지' : '노출재개'}
                  </button>
                  <button className={styles.editBtn} onClick={() => handleDuplicate(selected)}>복제</button>
                  <button className={styles.editBtn} onClick={() => notify.info('로그인 팝업 미리보기는 API 연동 후 제공합니다.')}>로그인 미리보기</button>
                  <button className={styles.closeBtn} onClick={() => setSelectedId(null)}>닫기</button>
                </div>
              </header>
              <div className={styles.detailBody}>
                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}><span>유형</span><strong>{formatTypeLabel(selected.type)}</strong></div>
                  <div className={styles.metaItem}><span>노출상태</span><strong>{getStatusLabel(selected)}</strong></div>
                  <div className={styles.metaItem}><span>노출기간</span><strong>{selected.exposeFrom} ~ {selected.exposeTo}</strong></div>
                  <div className={styles.metaItem}><span>로그인 노출</span><strong>{selected.showOnLogin ? '사용' : '미사용'}</strong></div>
                </div>
                <div className={styles.drawerBody}>
                  <div className={styles.drawerBodyTextWrap}>
                    <p className={styles.drawerBodyText}>{selected.body}</p>
                  </div>
                </div>
                <div>
                  <h4 className={styles.drawerAttachmentsTitle}>첨부파일</h4>
                  <ul className={styles.attachmentList}>
                    {selected.files.length > 0 ? selected.files.map((file) => (
                      <li key={file}>
                        <a
                          className={styles.attachmentLink}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            notify.info('다운로드는 추후 연동됩니다.');
                          }}
                        >
                          {file}
                        </a>
                      </li>
                    )) : <li className={styles.drawerDateAuthor}>첨부파일 없음</li>}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        ) : null}

        {isRegisterOpen ? (
          <div className={styles.modalOverlay} onClick={() => setIsRegisterOpen(false)}>
            <section className={styles.registerModal} onClick={(e) => e.stopPropagation()}>
              <header className={styles.detailHeader}>
                <div>
                  <h3 className={styles.drawerTitle}>공지/자료 등록</h3>
                  <p className={styles.drawerDateAuthor}>노출 기간과 로그인 노출 옵션을 함께 설정하세요.</p>
                </div>
                <div className={styles.detailActions}>
                  <button className={styles.closeBtn} onClick={() => setIsRegisterOpen(false)}>닫기</button>
                </div>
              </header>
              <div className={styles.formBody}>
                <div className={styles.formGrid}>
                  <label className={styles.formItem}>
                    <span>유형</span>
                    <select className={styles.select} value={registerForm.type} onChange={(e) => setRegisterForm((p) => ({ ...p, type: e.target.value }))}>
                      <option value={TAB_NOTICE}>공지사항</option>
                      <option value={TAB_PROMO}>홍보자료</option>
                      <option value={TAB_WORK}>업무자료</option>
                    </select>
                  </label>
                  <label className={styles.formItem}>
                    <span>로그인 노출</span>
                    <label className={styles.checkInline}>
                      <input
                        type="checkbox"
                        checked={registerForm.showOnLogin}
                        onChange={(e) => setRegisterForm((p) => ({ ...p, showOnLogin: e.target.checked }))}
                      />
                      로그인 시 팝업 노출
                    </label>
                  </label>
                  <label className={`${styles.formItem} ${styles.full}`}>
                    <span>제목</span>
                    <input className={styles.input} value={registerForm.title} onChange={(e) => setRegisterForm((p) => ({ ...p, title: e.target.value }))} placeholder="제목 입력" />
                  </label>
                  <label className={styles.formItem}>
                    <span>노출 시작일</span>
                    <input type="date" className={styles.input} value={registerForm.exposeFrom} onChange={(e) => setRegisterForm((p) => ({ ...p, exposeFrom: e.target.value }))} />
                  </label>
                  <label className={styles.formItem}>
                    <span>노출 종료일</span>
                    <input type="date" className={styles.input} value={registerForm.exposeTo} onChange={(e) => setRegisterForm((p) => ({ ...p, exposeTo: e.target.value }))} />
                  </label>
                  <label className={`${styles.formItem} ${styles.full}`}>
                    <span>첨부파일명(쉼표 구분)</span>
                    <input className={styles.input} value={registerForm.filesText} onChange={(e) => setRegisterForm((p) => ({ ...p, filesText: e.target.value }))} placeholder="예: 공지.pdf, 가이드.pptx" />
                  </label>
                  <label className={`${styles.formItem} ${styles.full}`}>
                    <span>내용</span>
                    <textarea className={styles.textarea} value={registerForm.body} onChange={(e) => setRegisterForm((p) => ({ ...p, body: e.target.value }))} placeholder="공지/자료 상세 내용을 입력하세요." />
                  </label>
                </div>
              </div>
              <footer className={styles.formFooter}>
                <button className={styles.secondaryBtn} onClick={() => setIsRegisterOpen(false)}>취소</button>
                <button className={styles.primaryBtn} onClick={handleRegisterSubmit}>등록</button>
              </footer>
            </section>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
