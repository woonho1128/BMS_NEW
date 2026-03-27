import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { getSalesMaterialById, formatFileSize } from '../data/salesMaterialMock';
import styles from './SalesMaterialDetailPage.module.css';

export function SalesMaterialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const material = getSalesMaterialById(id);

  const handleEdit = useCallback(() => {
    navigate(`/sales/material/${id}/edit`);
  }, [navigate, id]);

  const handleDelete = useCallback(() => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      // 실제로는 API 호출
      console.log('삭제:', id);
      alert('삭제되었습니다.');
      navigate('/sales/material');
    }
  }, [navigate, id]);

  const handleDownload = useCallback((attachment) => {
    // 실제로는 파일 다운로드 처리
    console.log('다운로드:', attachment);
    alert(`다운로드: ${attachment.name}`);
  }, []);

  if (!material) {
    return (
      <PageShell path="/sales/material" title="영업자료 상세">
        <div className={styles.page}>
          <p>영업자료를 찾을 수 없습니다.</p>
          <Button variant="secondary" onClick={() => navigate('/sales/material')}>
            목록으로
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      path="/sales/material"
      title="영업자료 상세"
      actions={
        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleEdit}>
            수정
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
        </div>
      }
    >
      <div className={styles.page}>
        <Card className={styles.documentCard}>
          <CardBody>
            <h1 className={styles.title}>{material.title}</h1>

            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>거래처</span>
                <span className={styles.metaValue}>{material.partner || '—'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>등록자</span>
                <span className={styles.metaValue}>{material.registrant}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>등록일</span>
                <span className={styles.metaValue}>{material.registeredAt}</span>
              </div>
            </div>

            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>내용 요약</h2>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: material.contentHtml }}
              />
            </div>

            {material.attachments && material.attachments.length > 0 && (
              <div className={styles.attachmentSection}>
                <h2 className={styles.sectionTitle}>첨부 파일</h2>
                <ul className={styles.attachmentList}>
                  {material.attachments.map((attachment) => (
                    <li key={attachment.id} className={styles.attachmentItem}>
                      <div className={styles.attachmentInfo}>
                        <span className={styles.attachmentName}>{attachment.name}</span>
                        <span className={styles.attachmentSize}>
                          {formatFileSize(attachment.size)}
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownload(attachment)}
                      >
                        다운로드
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardBody>
        </Card>

        <div className={styles.footerActions}>
          <Button variant="secondary" onClick={() => navigate('/sales/material')}>
            목록으로
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
