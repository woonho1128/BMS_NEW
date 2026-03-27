import React, { useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Input, Modal, Table, Tag } from 'antd';
import { Folder, FolderOpen, Search, Upload, Download, FileText } from 'lucide-react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { useHasPermission } from '../../../shared/hooks/useHasPermission';
import { PERMISSIONS } from '../../../shared/constants/permissions';
import styles from './DataCollectionPage.module.css';

const CATEGORY_LIST = [
  { key: 'price', label: '단가표' },
  { key: 'catalog', label: '카달로그' },
  { key: 'promo', label: '판매자료(프로모션 등)' },
];

const INITIAL_VENDORS = [
  { id: 'v1', name: '대림바스(주)' },
  { id: 'v2', name: '디엔건설 주식회사' },
  { id: 'v3', name: '영일타일도기상사' },
];

const INITIAL_FILES = [
  { id: 'f1', vendorId: 'v1', category: 'price', name: '2026_1Q_단가표.xlsx', version: 'v1.2', size: '1.8MB', uploadedAt: '2026-03-25 09:10', uploader: '관리자', status: '활성' },
  { id: 'f2', vendorId: 'v1', category: 'catalog', name: '2026_SS_카달로그.pdf', version: 'v1.0', size: '12.4MB', uploadedAt: '2026-03-12 13:40', uploader: '관리자', status: '활성' },
  { id: 'f3', vendorId: 'v2', category: 'promo', name: '4월_판매프로모션_안내.pptx', version: 'v0.9', size: '6.2MB', uploadedAt: '2026-03-20 18:03', uploader: '관리자', status: '검토중' },
];

function fileCategoryLabel(categoryKey) {
  return CATEGORY_LIST.find((c) => c.key === categoryKey)?.label ?? categoryKey;
}

export function DataCollectionPage() {
  const { pathname } = useLocation();
  const fileInputRef = useRef(null);
  const canManageVendor = useHasPermission(PERMISSIONS.MANAGE_DATA_COLLECTION_VENDOR);

  const [vendorKeyword, setVendorKeyword] = useState('');
  const [fileKeyword, setFileKeyword] = useState('');
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [selectedVendorId, setSelectedVendorId] = useState(INITIAL_VENDORS[0]?.id ?? '');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_LIST[0].key);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [vendorNameError, setVendorNameError] = useState('');

  const visibleVendors = useMemo(() => {
    if (!vendorKeyword.trim()) return vendors;
    return vendors.filter((v) => v.name.includes(vendorKeyword.trim()));
  }, [vendorKeyword, vendors]);

  const currentVendor = useMemo(
    () => vendors.find((v) => v.id === selectedVendorId),
    [vendors, selectedVendorId]
  );

  const filesInVendor = useMemo(
    () => files.filter((f) => f.vendorId === selectedVendorId),
    [files, selectedVendorId]
  );

  const categorySummary = useMemo(
    () => CATEGORY_LIST.map((c) => ({ ...c, count: filesInVendor.filter((f) => f.category === c.key).length })),
    [filesInVendor]
  );

  const filteredFiles = useMemo(() => {
    let rows = filesInVendor.filter((f) => f.category === selectedCategory);
    if (fileKeyword.trim()) {
      rows = rows.filter((f) => f.name.toLowerCase().includes(fileKeyword.trim().toLowerCase()));
    }
    return rows;
  }, [filesInVendor, selectedCategory, fileKeyword]);

  const triggerUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleUpload = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !selectedVendorId) return;

    const fileSizeMb = Math.max(selectedFile.size / (1024 * 1024), 0.01).toFixed(2);
    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setFiles((prev) => [
      {
        id: `f_${Date.now()}`,
        vendorId: selectedVendorId,
        category: selectedCategory,
        name: selectedFile.name,
        version: 'v1.0',
        size: `${fileSizeMb}MB`,
        uploadedAt: stamp,
        uploader: '관리자',
        status: '활성',
      },
      ...prev,
    ]);

    e.target.value = '';
  };

  const openVendorModal = () => {
    setIsVendorModalOpen(true);
    setNewVendorName('');
    setVendorNameError('');
  };

  const closeVendorModal = () => {
    setIsVendorModalOpen(false);
    setVendorNameError('');
  };

  const handleAddVendor = () => {
    const nextName = newVendorName.trim();
    if (!nextName) {
      setVendorNameError('업체명을 입력해 주세요.');
      return;
    }

    const duplicated = vendors.some((vendor) => vendor.name.toLowerCase() === nextName.toLowerCase());
    if (duplicated) {
      setVendorNameError('이미 등록된 업체명입니다.');
      return;
    }

    const nextVendor = { id: `v_${Date.now()}`, name: nextName };
    setVendors((prev) => [nextVendor, ...prev]);
    setSelectedVendorId(nextVendor.id);
    setIsVendorModalOpen(false);
    setNewVendorName('');
    setVendorNameError('');
  };

  const columns = [
    {
      title: '파일명',
      dataIndex: 'name',
      render: (value) => (
        <span className={styles.fileName}>
          <FileText size={14} /> {value}
        </span>
      ),
    },
    { title: '유형', dataIndex: 'category', width: 160, render: (v) => fileCategoryLabel(v) },
    { title: '버전', dataIndex: 'version', width: 90, align: 'center' },
    { title: '크기', dataIndex: 'size', width: 100, align: 'right' },
    { title: '등록일시', dataIndex: 'uploadedAt', width: 150 },
    { title: '등록자', dataIndex: 'uploader', width: 90, align: 'center' },
    {
      title: '상태',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      render: (v) => <Tag color={v === '활성' ? 'success' : 'processing'}>{v}</Tag>,
    },
    {
      title: '다운로드',
      width: 110,
      align: 'center',
      render: () => (
        <Button size="small" icon={<Download size={12} />}>
          받기
        </Button>
      ),
    },
  ];

  return (
    <PageShell path={pathname} className={styles.shellWide}>
      <div className={styles.page}>
        <div className={styles.workspace}>
          <aside className={styles.leftPane}>
            <div className={styles.paneHeaderRow}>
              <div className={styles.paneHeader}>업체 목록</div>
              {canManageVendor && (
                <Button size="small" type="primary" onClick={openVendorModal}>
                  업체 추가
                </Button>
              )}
            </div>
            <div className={styles.searchBox}>
              <Search size={14} />
              <Input
                value={vendorKeyword}
                onChange={(e) => setVendorKeyword(e.target.value)}
                placeholder="업체 검색"
                bordered={false}
              />
            </div>
            <div className={styles.vendorList}>
              {visibleVendors.map((vendor) => {
                const isActive = vendor.id === selectedVendorId;
                return (
                  <button
                    key={vendor.id}
                    type="button"
                    className={`${styles.vendorItem} ${isActive ? styles.vendorItemActive : ''}`}
                    onClick={() => setSelectedVendorId(vendor.id)}
                  >
                    {isActive ? <FolderOpen size={15} /> : <Folder size={15} />}
                    <span>{vendor.name}</span>
                  </button>
                );
              })}
              {visibleVendors.length === 0 && (
                <div className={styles.emptyState}>검색 조건에 맞는 업체가 없습니다.</div>
              )}
            </div>
          </aside>

          <section className={styles.rightPane}>
            <div className={styles.breadcrumb}>
              자료수집 &gt; {currentVendor?.name ?? '-'} &gt; {fileCategoryLabel(selectedCategory)}
            </div>

            <div className={styles.categoryGrid}>
              {categorySummary.map((category) => {
                const active = selectedCategory === category.key;
                return (
                  <button
                    key={category.key}
                    type="button"
                    className={`${styles.categoryCard} ${active ? styles.categoryCardActive : ''}`}
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    <div className={styles.categoryTitle}>{category.label}</div>
                    <div className={styles.categoryCount}>{category.count}개 파일</div>
                  </button>
                );
              })}
            </div>

            <div className={styles.fileToolbar}>
              <div className={styles.searchBox}>
                <Search size={14} />
                <Input
                  value={fileKeyword}
                  onChange={(e) => setFileKeyword(e.target.value)}
                  placeholder="파일명 검색"
                  bordered={false}
                />
              </div>
              <div className={styles.toolbarActions}>
                <input ref={fileInputRef} type="file" className={styles.hiddenInput} onChange={handleUpload} />
                <Button type="primary" icon={<Upload size={14} />} onClick={triggerUpload}>
                  업로드
                </Button>
              </div>
            </div>

            <div className={styles.tableCard}>
              <Table
                columns={columns}
                dataSource={filteredFiles}
                rowKey="id"
                size="small"
                pagination={{ pageSize: 10 }}
                className={styles.fileTable}
                locale={{ emptyText: '선택한 업체/카테고리에 등록된 파일이 없습니다.' }}
              />
            </div>
          </section>
        </div>
      </div>
      <Modal
        title="업체 추가"
        open={isVendorModalOpen}
        onCancel={closeVendorModal}
        onOk={handleAddVendor}
        centered
        okText="등록"
        cancelText="취소"
      >
        <Input
          value={newVendorName}
          onChange={(e) => {
            setNewVendorName(e.target.value);
            if (vendorNameError) setVendorNameError('');
          }}
          placeholder="업체명을 입력해 주세요"
          maxLength={80}
          status={vendorNameError ? 'error' : ''}
          onPressEnter={handleAddVendor}
        />
        {vendorNameError && <p className={styles.errorText}>{vendorNameError}</p>}
      </Modal>
    </PageShell>
  );
}

export default DataCollectionPage;
