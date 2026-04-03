import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { RichTextEditor } from '../../../shared/components/RichTextEditor';
import { getSalesMaterialById, formatFileSize } from '../data/salesMaterialMock';
import styles from './SalesMaterialFormPage.module.css';

const CONTENT_PLACEHOLDER =
  '영업자료의 내용을 작성해 주세요. (굵게, 목록, 링크, 이미지, 표 기능 사용 가능)';

export function SalesMaterialFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const isEdit = !isNew && id !== 'new';
  const material = isEdit ? getSalesMaterialById(id) : null;

  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (material) {
      setTitle(material.title || '');
      setContentHtml(material.contentHtml || '');
    }
  }, [material]);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        file,
      })),
    ]);

    e.target.value = '';
  }, []);

  const removeAttachment = useCallback((index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      alert('제목을 입력해 주세요.');
      return;
    }

    console.log('저장', {
      title,
      contentHtml,
      attachments,
    });

    alert(isNew ? '영업자료가 등록되었습니다.' : '영업자료가 수정되었습니다.');
    navigate('/sales/material');
  }, [title, contentHtml, attachments, isNew, navigate]);

  const handleCancel = useCallback(() => {
    if (window.confirm('작성 중인 내용은 저장되지 않습니다. 취소하시겠습니까?')) {
      navigate('/sales/material');
    }
  }, [navigate]);

  return (
    <PageShell
      path="/sales/material"
      title={isNew ? '영업자료 등록' : '영업자료 수정'}
      description={isNew ? '새 영업자료를 등록합니다' : '영업자료를 수정합니다'}
    >
      <div className={styles.page}>
        <Card title="기본 정보" className={styles.card}>
          <CardBody>
            <div className={styles.grid}>
              <div className={styles.field}>
                <Input
                  label="제목"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title="내용 요약" className={styles.card}>
          <CardBody className={styles.contentCardBody}>
            <RichTextEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder={CONTENT_PLACEHOLDER}
              minHeight={320}
              maxHeight={600}
            />
          </CardBody>
        </Card>

        <Card title="첨부 파일" className={styles.card}>
          <CardBody>
            <div className={styles.uploadArea}>
              <label className={styles.uploadLabel}>파일 선택</label>
              <input
                type="file"
                className={styles.fileInput}
                multiple
                onChange={handleFileChange}
                aria-label="첨부파일"
              />
            </div>
            {attachments.length > 0 && (
              <ul className={styles.attachmentList}>
                {attachments.map((attachment, index) => (
                  <li key={attachment.id} className={styles.attachmentItem}>
                    <div className={styles.attachmentInfo}>
                      <span className={styles.attachmentName}>{attachment.name}</span>
                      <span className={styles.attachmentSize}>
                        {formatFileSize(attachment.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeAttachment(index)}
                      aria-label="첨부 제거"
                    >
                      제거
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isNew ? '등록' : '저장'}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
