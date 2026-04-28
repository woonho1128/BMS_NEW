import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { getSalesInfoById } from '../data/salesInfoMock';
import { getProfitDetail } from '../data/profitAnalysisMock';
import SalesInfoProfitSection from './components/SalesInfoProfitSection';
import { classnames } from '../../../shared/utils/classnames';
import styles from './SalesInfoDetailPage.module.css';
import profitStyles from './SalesProfitAnalysisNewPage.module.css';

function getProfitRateColor(rate) {
  if (rate == null) return null;
  if (rate >= 20) return 'high';
  if (rate >= 10) return 'medium';
  return 'low';
}

export function SalesInfoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = getSalesInfoById(id);
  const profitId = item?.profitId ?? item?.id;
  const profit = item?.hasProfitAnalysis && profitId ? getProfitDetail(profitId) : null;
  const [expandedDetailIds, setExpandedDetailIds] = useState(new Set());

  const handleList = useCallback(() => {
    navigate('/sales/info');
  }, [navigate]);

  const toggleDetail = useCallback((e, rowId) => {
    e.stopPropagation();
    setExpandedDetailIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  }, []);

  if (!item) {
    return (
      <PageShell path="/sales/info" title="영업정보 상세">
        <p className={styles.notFound}>해당 영업정보를 찾을 수 없습니다.</p>
        <Button variant="secondary" onClick={handleList}>
          목록
        </Button>
      </PageShell>
    );
  }

  const grossColor = getProfitRateColor(item.grossProfitRate);
  const operatingColor = getProfitRateColor(item.operatingProfitRate);
  const items = profit?.items ?? [];
  const summary = profit
    ? {
        totalSales: profit.totalSales ?? 0,
        grossRate: profit.grossProfitRate ?? 0,
        operatingRate: profit.operatingProfitRate ?? 0,
      }
    : null;

  return (
    <PageShell path="/sales/info" title="영업정보 상세">
      <div className={styles.page}>
        <Card title="영업정보" className={styles.sectionCard}>
          <CardBody>
            <div className={styles.metaRow}>
              <span
                className={classnames(
                  styles.badge,
                  item.progress === '완료' && styles.badgeComplete,
                  item.progress === '대기' && styles.badgeWait
                )}
              >
                {item.progress}
              </span>
              <span className={styles.specNo}>{item.specNo}</span>
              <span className={styles.author}>등록자: {item.author}</span>
            </div>

            <div className={styles.grid}>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>건설회사</span>
                <span className={styles.readOnlyValue}>{item.builder}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>SW SPEC NO</span>
                <span className={styles.readOnlyValue}>{item.specNo}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>현장명</span>
                <span className={styles.readOnlyValue}>{item.siteName}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>대리점</span>
                <span className={styles.readOnlyValue}>{item.partner}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>SPEC 등록일</span>
                <span className={styles.readOnlyValue}>{item.specRegisterDate ?? '—'}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>SW 수주일자</span>
                <span className={styles.readOnlyValue}>{item.orderDate ?? '—'}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>예상납기일</span>
                <span className={styles.readOnlyValue}>{item.expectedDeliveryDate ?? '—'}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>완공예정일</span>
                <span className={styles.readOnlyValue}>{item.completionDate ?? '—'}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>유상옵션 적용여부</span>
                <span className={styles.readOnlyValue}>{item.paidOption ?? '—'}</span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>손익분석 여부</span>
                <span
                  className={classnames(
                    styles.badgeInline,
                    item.hasProfitAnalysis ? styles.badgeYes : styles.badgeNo
                  )}
                >
                  {item.hasProfitAnalysis ? 'Y' : 'N'}
                </span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>매출총이익률(%)</span>
                <span className={styles.readOnlyValue}>
                  {item.grossProfitRate != null ? (
                    <span
                      className={classnames(
                        styles.profitRate,
                        grossColor && styles[`profitRate_${grossColor}`]
                      )}
                    >
                      {item.grossProfitRate.toFixed(1)}
                    </span>
                  ) : (
                    '—'
                  )}
                </span>
              </div>
              <div className={styles.readOnlyField}>
                <span className={styles.readOnlyLabel}>영업이익률(%)</span>
                <span className={styles.readOnlyValue}>
                  {item.operatingProfitRate != null ? (
                    <span
                      className={classnames(
                        styles.profitRate,
                        operatingColor && styles[`profitRate_${operatingColor}`]
                      )}
                    >
                      {item.operatingProfitRate.toFixed(1)}
                    </span>
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

                <SalesInfoProfitSection
          styles={styles}
          profitStyles={profitStyles}
          profit={profit}
          summary={summary}
          items={items}
          expandedDetailIds={expandedDetailIds}
          toggleDetail={toggleDetail}
        />

        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleList}>
            목록
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

