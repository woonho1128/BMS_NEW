import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { ROUTES } from '../../../router/routePaths';
import { getProfitDetail } from '../data/profitAnalysisMock';
import { classnames } from '../../../shared/utils/classnames';
import { formatNumber } from '../../../shared/utils/formatters';
import styles from './SalesProfitAnalysisDetailPage.module.css';

const STATUS_LABEL = {
  draft: '작성중',
  inProgress: '결재중',
  approved: '결재완료',
  rejected: '반려',
};

function calcDealerPrice(bidPrice, marginRateDealer) {
  const bid = Number(bidPrice || 0);
  const margin = Number(marginRateDealer || 0);
  if (!bid) return 0;
  return Math.round(bid * (1 - margin / 100));
}

function formatDetailNumber(value) {
  return formatNumber(Number(value || 0));
}

export function SalesProfitAnalysisDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const detail = useMemo(() => getProfitDetail(String(id || '')), [id]);

  if (!detail) {
    return (
      <PageShell path={ROUTES.PROFIT} title="손익 분석 상세">
        <Card>
          <CardBody>
            <p>상세 데이터를 찾을 수 없습니다.</p>
            <Button onClick={() => navigate(ROUTES.PROFIT)}>목록으로</Button>
          </CardBody>
        </Card>
      </PageShell>
    );
  }

  const statusKey = detail.status || 'draft';
  const statusClass = styles[`status_${statusKey}`] || styles.status_draft;

  return (
    <PageShell path={ROUTES.PROFIT} title="손익 분석 상세">
      <div className={styles.detail}>
        <div className={styles.header}>
          <span className={classnames(styles.statusBadge, statusClass)}>
            {STATUS_LABEL[statusKey] || STATUS_LABEL.draft}
          </span>
          <h2 className={styles.title}>{detail.title || `문서 ${detail.id}`}</h2>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <Card title="기본 정보" className={styles.sectionCard}>
              <CardBody>
                <dl className={styles.dl}>
                  <div className={styles.dlRow}><dt>SW SPEC NO</dt><dd>{detail.specNo || '-'}</dd></div>
                  <div className={styles.dlRow}><dt>현장명</dt><dd>{detail.siteName || '-'}</dd></div>
                  <div className={styles.dlRow}><dt>건설사</dt><dd>{detail.builder || '-'}</dd></div>
                  <div className={styles.dlRow}><dt>대리점</dt><dd>{detail.partnerName || '-'}</dd></div>
                  <div className={styles.dlRow}><dt>영업담당</dt><dd>{detail.salesManager || detail.author || '-'}</dd></div>
                </dl>
              </CardBody>
            </Card>

            <Card title="품목 내역" className={styles.sectionCard}>
              <CardBody>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>품목코드</th>
                        <th className={styles.th}>품목명</th>
                        <th className={styles.thNum}>수량</th>
                        <th className={styles.thNum}>입찰단가</th>
                        <th className={styles.thNum}>대리점단가</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(detail.items || []).map((row) => (
                        <tr key={row.id}>
                          <td className={styles.td}>{row.itemCode || '-'}</td>
                          <td className={styles.td}>{row.itemName || '-'}</td>
                          <td className={styles.tdNum}>{formatDetailNumber(row.qty)}</td>
                          <td className={styles.tdNum}>{formatDetailNumber(row.bidPrice)}</td>
                          <td className={styles.tdNum}>{formatDetailNumber(calcDealerPrice(row.bidPrice, row.marginRateDealer))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            <div className={styles.footer}>
              <Button variant="secondary" onClick={() => navigate(`/profit/${id}/edit`)}>수정</Button>
              <Button onClick={() => navigate(ROUTES.PROFIT)}>목록</Button>
            </div>
          </div>

          <aside className={styles.summaryAside}>
            <Card title="요약" className={styles.summaryCard}>
              <CardBody>
                <dl className={styles.summaryList}>
                  <div className={styles.summaryRow}><dt>총 매출</dt><dd className={styles.summaryValue}>{formatDetailNumber(detail.totalSales)}</dd></div>
                  <div className={styles.summaryRow}><dt>매출총이익</dt><dd className={styles.summaryValue}>{formatDetailNumber(detail.grossProfit)}</dd></div>
                  <div className={styles.summaryRow}><dt>영업이익</dt><dd className={styles.summaryValue}>{formatDetailNumber(detail.operatingProfit)}</dd></div>
                </dl>
              </CardBody>
            </Card>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
