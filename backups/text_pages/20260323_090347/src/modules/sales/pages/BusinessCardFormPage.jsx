import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Input } from '../../../shared/components/Input/Input';
import { getBusinessCardById, MOCK_MANAGER_OPTIONS } from '../data/businessCardMock';
import styles from './BusinessCardFormPage.module.css';

export function BusinessCardFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const card = isNew ? null : getBusinessCardById(id);
  const isReadOnly = !isNew && !id; // 상세보기 모드 (수정 버튼 클릭 전)

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
    if (card) {
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
    }
  }, [card]);

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

  const handleFileInputChange = useCallback(
    (side, e) => {
      const file = e.target.files?.[0];
      handleImageChange(side, file);
    },
    [handleImageChange]
  );

  const handleSave = useCallback(() => {
    // 실제로는 API 호출
    console.log('저장:', formData);
    alert(isNew ? '명함이 등록되었습니다.' : '명함이 수정되었습니다.');
    navigate('/sales/card');
  }, [formData, isNew, navigate]);

  const handleCancel = useCallback(() => {
    if (isNew) {
      navigate('/sales/card');
    } else {
      setIsEditing(false);
      // 원래 데이터로 복원
      if (card) {
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
      }
    }
  }, [isNew, navigate, card]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const canEdit = isNew || isEditing;
  const showEditButton = !isNew && !isEditing;

  return (
    <PageShell
      path="/sales/card"
      title={isNew ? '명함 등록' : '명함 상세'}
      description={isNew ? '새 명함을 등록합니다' : '명함 정보를 조회합니다'}
    >
      <div className={styles.page}>
        {/* 1) 기본 정보 */}
        <Card title="1) 기본 정보" className={styles.card}>
          <CardBody>
            <div className={styles.grid}>
              <Input
                label="이름"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={!canEdit}
                placeholder="이름을 입력하세요"
              />
              <Input
                label="휴대폰"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!canEdit}
                placeholder="010-1234-5678"
              />
              <Input
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!canEdit}
                placeholder="email@example.com"
              />
            </div>
          </CardBody>
        </Card>

        {/* 2) 회사 정보 */}
        <Card title="2) 회사 정보" className={styles.card}>
          <CardBody>
            <div className={styles.grid}>
              <Input
                label="회사명"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                disabled={!canEdit}
                placeholder="회사명을 입력하세요"
              />
              <Input
                label="부서"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                disabled={!canEdit}
                placeholder="부서를 입력하세요"
              />
              <Input
                label="주소"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                disabled={!canEdit}
                placeholder="주소를 입력하세요"
                className={styles.fullWidth}
              />
            </div>
          </CardBody>
        </Card>

        {/* 3) 명함 이미지 업로드 */}
        <Card title="3) 명함 이미지" className={styles.card}>
          <CardBody>
            <div className={styles.imageGrid}>
              <div className={styles.imageSection}>
                <label className={styles.imageLabel}>명함 앞면</label>
                {imagePreviewFront ? (
                  <div className={styles.imagePreview}>
                    <img src={imagePreviewFront} alt="명함 앞면" />
                    {canEdit && (
                      <button
                        type="button"
                        className={styles.imageRemove}
                        onClick={() => handleImageChange('front', null)}
                        aria-label="이미지 삭제"
                      >
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
                          onChange={(e) => handleFileInputChange('front', e)}
                          aria-label="명함 앞면 업로드"
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
                      <button
                        type="button"
                        className={styles.imageRemove}
                        onClick={() => handleImageChange('back', null)}
                        aria-label="이미지 삭제"
                      >
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
                          onChange={(e) => handleFileInputChange('back', e)}
                          aria-label="명함 뒷면 업로드"
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

        {/* 4) 연결 정보 */}
        <Card title="4) 연결 정보" className={styles.card}>
          <CardBody>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>담당자</label>
                <select
                  className={styles.select}
                  value={formData.manager}
                  onChange={(e) => handleChange('manager', e.target.value)}
                  disabled={!canEdit}
                >
                  <option value="">담당자 선택</option>
                  {MOCK_MANAGER_OPTIONS.filter((opt) => opt.value).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>메모</label>
                <textarea
                  className={styles.textarea}
                  value={formData.memo}
                  onChange={(e) => handleChange('memo', e.target.value)}
                  disabled={!canEdit}
                  placeholder="메모를 입력하세요"
                  rows={4}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 액션 버튼 */}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleCancel}>
            {isNew ? '취소' : showEditButton ? '목록' : '취소'}
          </Button>
          {showEditButton && (
            <Button variant="primary" onClick={handleEdit}>
              수정
            </Button>
          )}
          {canEdit && (
            <Button variant="primary" onClick={handleSave}>
              {isNew ? '등록' : '저장'}
            </Button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
