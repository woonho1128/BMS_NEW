import React from 'react';
import { Modal } from 'antd';
import { Button } from '../../../../shared/components/Button/Button';

export default function DiscountPriceUploadModal({ styles, open, onClose, onApplyMockUpload }) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} width={720} centered title="판매단가 엑셀 업로드 (목업)">
      <div className={styles.uploadModalBody}>
        <div className={styles.uploadDropzone}>
          <strong>엑셀 파일을 선택해 주세요.</strong>
          <span>업로드 형식: 판매단가_템플릿.xlsx</span>
          <Button variant="secondary">파일 선택</Button>
        </div>
        <div className={styles.uploadPreview}>
          <p>검증 결과: 신규 2건 / 수정 0건 / 오류 0건</p>
          <table className={styles.uploadPreviewTable}>
            <thead>
              <tr>
                <th>구분</th>
                <th>품목명</th>
                <th>품번</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>일체형비데</td>
                <td>엑셀 업로드 모델 A</td>
                <td>UPA-001</td>
                <td>신규</td>
              </tr>
              <tr>
                <td>세면기</td>
                <td>엑셀 업로드 모델 B</td>
                <td>UPB-001</td>
                <td>신규</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.uploadActions}>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={onApplyMockUpload}>
            목업 반영
          </Button>
        </div>
      </div>
    </Modal>
  );
}
