import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { notify } from '../../../shared/utils/notify';
import { getBusinessCardById, MOCK_MANAGER_OPTIONS } from '../data/businessCardMock';
import styles from './BusinessCardFormPage.module.css';

export function BusinessCardFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const card = isNew ? null : getBusinessCardById(id);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    department: '',
    address: '',
    manager: '',
    memo: '',
    imageFront: null,
    imageBack: null,
  });
  const [imagePreviewFront, setImagePreviewFront] = useState(null);
  const [imagePreviewBack, setImagePreviewBack] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!card) return;
    setFormData({
      name: card.name || '',
      phone: card.phone || '',
      email: card.email || '',
      company: card.company || '',
      department: card.department || '',
      address: card.address || '',
      manager: card.manager || '',
      memo: card.memo || '',
      imageFront: card.imageFront || null,
      imageBack: card.imageBack || null,
    });
    setImagePreviewFront(card.imageFront || null);
    setImagePreviewBack(card.imageBack || null);
  }, [card]);

  const canEdit = isNew || isEditing;

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = useCallback((side, file) => {
    if (!file) {
      if (side === 'front') {
        setImagePreviewFront(null);
        setFormData((prev) => ({ ...prev, imageFront: null }));
      } else {
        setImagePreviewBack(null);
        setFormData((prev) => ({ ...prev, imageBack: null }));
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result;
      if (side === 'front') {
        setImagePreviewFront(preview);
        setFormData((prev) => ({ ...prev, imageFront: preview }));
      } else {
        setImagePreviewBack(preview);
        setFormData((prev) => ({ ...prev, imageBack: preview }));
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(() => {
    notify.success(isNew ? '명함이 등록되었습니다.' : '명함이 수정되었습니다.');
    navigate('/sales/card');
  }, [isNew, navigate]);

  const handleCancel = useCallback(() => {
    if (isNew) {
      navigate('/sales/card');
      return;
    }
    setIsEditing(false);
    if (!card) return;
    setFormData({
      name: card.name || '',
      phone: card.phone || '',
      email: card.email || '',
      company: card.company || '',
      department: card.department || '',
      address: card.address || '',
      manager: card.manager || '',
      memo: card.memo || '',
      imageFront: card.imageFront || null,
      imageBack: card.imageBack || null,
    });
    setImagePreviewFront(card.imageFront || null);
    setImagePreviewBack(card.imageBack || null);
  }, [isNew, navigate, card]);

  return (
    <PageShell
      path="/sales/card"
      title={isNew ? '명함 등록' : '명함 상세'}
      description={isNew ? '새 명함을 등록합니다.' : '명함 정보를 조회합니다.'}
    >
      <div className={styles.page}>
        <Card title="1) 기본 정보" className={styles.card}>
          <CardBody>
            <div className={styles.grid}>
              <Input label="이름" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} disabled={!canEdit} />
              <Input label="연락처" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={!canEdit} />
              <Input
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!canEdit}
                className={styles.fullWidth}
              />
            </div>
          </CardBody>
        </Card>

        <Card title="2) 회사 정보" className={styles.card}>
          <CardBody>
            <div className={styles.grid}>
              <Input label="회사명" value={formData.company} onChange={(e) => handleChange('company', e.target.value)} disabled={!canEdit} />
              <Input label="부서" value={formData.department} onChange={(e) => handleChange('department', e.target.value)} disabled={!canEdit} />
              <Input label="주소" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} disabled={!canEdit} className={styles.fullWidth} />

              <div className={styles.field}>
                <label className={styles.label}>담당자</label>
                <select
                  className={styles.select}
                  value={formData.manager}
                  onChange={(e) => handleChange('manager', e.target.value)}
                  disabled={!canEdit}
                >
                  {MOCK_MANAGER_OPTIONS.map((opt) => (
                    <option key={opt.value || 'all'} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label className={styles.label}>메모</label>
                <textarea
                  className={styles.textarea}
                  value={formData.memo}
                  onChange={(e) => handleChange('memo', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card title="3) 명함 이미지" className={styles.card}>
          <CardBody>
            <div className={styles.imageGrid}>
              <div className={styles.imageSection}>
                <label className={styles.imageLabel}>명함 앞면</label>
                {imagePreviewFront ? (
                  <div className={styles.imagePreview}>
                    <img src={imagePreviewFront} alt="명함 앞면" />
                    {canEdit && (
                      <button type="button" className={styles.imageRemove} onClick={() => handleImageChange('front', null)}>
                        삭제
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.imagePlaceholder}>
                    {canEdit ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          className={styles.fileInput}
                          onChange={(e) => handleImageChange('front', e.target.files?.[0] || null)}
                        />
                        <span className={styles.uploadText}>이미지 업로드</span>
                      </>
                    ) : (
                      <span className={styles.uploadText}>이미지 없음</span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.imageSection}>
                <label className={styles.imageLabel}>명함 뒷면</label>
                {imagePreviewBack ? (
                  <div className={styles.imagePreview}>
                    <img src={imagePreviewBack} alt="명함 뒷면" />
                    {canEdit && (
                      <button type="button" className={styles.imageRemove} onClick={() => handleImageChange('back', null)}>
                        삭제
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles.imagePlaceholder}>
                    {canEdit ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          className={styles.fileInput}
                          onChange={(e) => handleImageChange('back', e.target.files?.[0] || null)}
                        />
                        <span className={styles.uploadText}>이미지 업로드</span>
                      </>
                    ) : (
                      <span className={styles.uploadText}>이미지 없음</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className={styles.actions}>
          {!isNew && !isEditing ? (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              수정
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleCancel}>
                취소
              </Button>
              <Button variant="primary" onClick={handleSave}>
                저장
              </Button>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
