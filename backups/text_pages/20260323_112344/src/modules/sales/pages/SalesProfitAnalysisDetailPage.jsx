import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody, CardFooter } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { classnames } from '../../../shared/utils/classnames';
import styles from './SalesProfitAnalysisDetailPage.module.css';

const STATUS_MAP = {
  draft: '작성중',
  inProgress: '결재중',
  approved: '결재완료',
  rejected: '반려',
};

/** Mock: id별 상세 (실제 연동 시 API) */
function useDetail(id) {
  const mock = {
    id,
    title: `2025년 1월 영업부 손익분석 (${id})`,
    status: id === '1' ? 'inProgress' : id === '2' ? 'approved' : 'draft',
    siteName: 'A사 현장',
    partnerName: '(주)테스트',
    orderYear: '2025',
    deliveryYear: '2025',
    manager: '김영업',
    remark: '',
    createdAt: '2025-01-28',
    items: [
      { itemCode: 'A-001', itemName: '제품 A', qty: 10, unitPrice: 120000, unitCost: 78000 },
      { itemCode: 'A-002', itemName: '제품 B', qty: 5, unitPrice: 85000, unitCost: 52000 },
    ],
  };
  const totalSales = mock.items.reduce((s, r) => s + r.qty * r.unitPrice, 0);
  const totalCost = mock.items.reduce((s, r) => s + r.qty * r.unitCost, 0);
  const totalMargin = totalSales - totalCost;
  const marginRate = totalSales > 0 ? (totalMargin / totalSales) * 100 : 0;
  const isBelowMin = totalSales > 0 && marginRate < 10;
  return { ...mock, totalSales, totalCost, totalMargin, marginRate, isBelowMin };
}

export function SalesProfitAnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = useDetail(id);

  const isDraft = data.status === 'draft';
  const isApproved = data.status === 'approved';
  const readOnly = !isDraft;

  const handleEdit = () => {
    // TODO: 수정 시 동일 폼으로 이동 또는 인라인 편집
    navigate(`/profit/${id}/edit`);
  };

  const handleRegisterSales = () => {
    console.log('영업정보 등록', id);
    navigate(ROUTES.SALES_INFO);
  };

  return (
    <PageShell path="/profit" title={`손익분석 상세 (${id})`}>
      <div className={styles.detail}>
        <div className={styles.header}>
          <span
            className={classnames(
              styles.statusBadge,
              styles[`status_${data.status}`]
            )}
          >
            {STATUS_MAP[data.status]}
          </span>
          <h1 className={styles.title}>{data.title}</h1>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <Card title="현장·거래 조건" className={styles.sectionCard}>
              <CardBody>
                <dl className={styles.dl}>
                  <div className={styles.dlRow}>
                    <dt>현장명</dt>
                    <dd>{data.siteName}</dd>
                  </div>
                  <div className={styles.dlRow}>
                    <dt>거래처</dt>
                    <dd>{data.partnerName}</dd>
                  </div>
                  <div className={styles.dlRow}>
                    <dt>수주년도</dt>
                    <dd>{data.orderYear}년</dd>
                  </div>
                  <div className={styles.dlRow}>
                    <dt>납품예상년도</dt>
                    <dd>{data.deliveryYear}년</dd>
                  </div>
                  <div className={styles.dlRow}>
                    <dt>담당자</dt>
                    <dd>{data.manager}</dd>
                  </div>
                  {data.remark && (
                    <div className={styles.dlRow}>
                      <dt>비고</dt>
                      <dd>{data.remark}</dd>
                    </div>
                  )}
                </dl>
              </CardBody>
            </Card>

            <Card title="납품 품목 구성" className={styles.sectionCard}>
              <CardBody tight>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>품목코드</th>
                        <th className={styles.th}>품목명</th>
                        <th className={styles.thNum}>수량</th>
                        <th className={styles.thNum}>매출</th>
                        <th className={styles.thNum}>원가</th>
                        <th className={styles.thNum}>마진</th>
                        <th className={styles.thNum}>이익률</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((row, i) => {
                        const sales = row.qty * row.unitPrice;
                        const cost = row.qty * row.unitCost;
                        const margin = sales - cost;
                        const rate = sales > 0 ? (margin / sales) * 100 : 0;
                        return (
                          <tr key={i}>
                            <td className={styles.td}>{row.itemCode}</td>
                            <td className={styles.td}>{row.itemName}</td>
                            <td className={styles.tdNum}>{row.qty}</td>
                            <td className={styles.tdNum}>{sales.toLocaleString()}</td>
                            <td className={styles.tdNum}>{cost.toLocaleString()}</td>
                            <td className={styles.tdNum}>{margin.toLocaleString()}</td>
                            <td className={styles.tdNum}>{rate.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            <Card className={styles.sectionCard}>
              <CardFooter className={styles.footer}>
                <Button variant="secondary" onClick={() => navigate(ROUTES.PROFIT)}>
                  목록으로
                </Button>
                {isDraft && (
                  <>
                    <Button variant="secondary" onClick={handleEdit}>
                      수정
                    </Button>
                    <Button variant="primary">결재상신</Button>
                  </>
                )}
                {isApproved && (
                  <Button variant="primary" onClick={handleRegisterSales}>
                    영업정보 등록
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <aside className={styles.summaryAside}>
            <Card
              title="손익 요약"
              variant="highlight"
              indicatorColor={data.isBelowMin ? 'danger' : 'neutral'}
              className={classnames(
                styles.summaryCard,
                data.isBelowMin && styles.summaryCardWarning
              )}
            >
              <CardBody>
                <dl className={styles.summaryList}>
                  <div className={styles.summaryRow}>
                    <dt>총 매출</dt>
                    <dd className={styles.summaryValue}>
                      {data.totalSales.toLocaleString()}원
                    </dd>
                  </div>
                  <div className={styles.summaryRow}>
                    <dt>총 원가</dt>
                    <dd className={styles.summaryValue}>
                      {data.totalCost.toLocaleString()}원
                    </dd>
                  </div>
                  <div className={styles.summaryRow}>
                    <dt>마진</dt>
                    <dd className={styles.summaryValue}>
                      {data.totalMargin.toLocaleString()}원
                    </dd>
                  </div>
                  <div className={styles.summaryRow}>
                    <dt>마진률</dt>
                    <dd
                      className={classnames(
                        styles.summaryValue,
                        data.isBelowMin && styles.summaryValueDanger
                      )}
                    >
                      {data.marginRate.toFixed(1)}%
                    </dd>
                  </div>
                </dl>
                {data.isBelowMin && (
                  <p className={styles.warningText} role="alert">
                    마진률이 기준(10%) 미달입니다.
                  </p>
                )}
              </CardBody>
            </Card>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
