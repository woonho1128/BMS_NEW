import React, { useState, useCallback, useMemo } from 'react';
import { PageShell } from '../../../shared/components/PageShell/PageShell';
import { Card, CardBody } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button/Button';
import { Select } from '../../../shared/components/Select/Select';
import { Input } from '../../../shared/components/Input/Input';
import { classnames } from '../../../shared/utils/classnames';
import {
  MOCK_SHIPMENT_OPTIONS,
  MOCK_ITEM_OPTIONS,
  MOCK_WAREHOUSE_OPTIONS,
  MOCK_UNIT_OPTIONS,
  MOCK_VAT_INCLUDED_OPTIONS,
  MOCK_VAT_TYPE_OPTIONS,
  getBasicInfoByShipmentId,
  getDefaultItemsByShipmentId,
  getStockByItemCode,
  getItemOptionByCode,
} from '../data/deliveryRequestMock';
import styles from './DeliveryRequestPage.module.css';

function generateItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function DeliveryRequestPage() {
  const [shipmentId, setShipmentId] = useState('');
  const [items, setItems] = useState([]);
  const [transportOpen, setTransportOpen] = useState(false);
  const [transport, setTransport] = useState({
    destination: '',
    transportMethod: '',
    vehicleNo: '',
    handoverTo: '',
    requestNote: '',
  });
  const [saved, setSaved] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const basicInfo = useMemo(
    () => getBasicInfoByShipmentId(shipmentId),
    [shipmentId]
  );
  const isItemSectionEnabled = Boolean(shipmentId);

  const handleShipmentChange = useCallback((value) => {
    setShipmentId(value);
    if (value) {
      const defaultItems = getDefaultItemsByShipmentId(value);
      setItems(defaultItems.map((r) => ({ ...r, id: r.id || generateItemId() })));
    } else {
      setItems([]);
    }
  }, []);

  const updateItem = useCallback((id, field, value) => {
    setItems((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, [field]: value };
        if (field === 'itemCode') {
          const opt = getItemOptionByCode(value);
          if (opt) {
            next.itemName = opt.itemName;
            next.spec = opt.spec;
            next.unitPrice = opt.unitPrice;
            next.stock = getStockByItemCode(value);
            if (next.discountRate === undefined) next.discountRate = 0;
          }
        }
        return next;
      })
    );
  }, []);

  const addItem = useCallback(() => {
    const first = MOCK_ITEM_OPTIONS[0];
    const firstWarehouse = MOCK_WAREHOUSE_OPTIONS[0]?.value ?? 'WH01';
    const firstUnit = MOCK_UNIT_OPTIONS[0]?.value ?? 'EA';
    setItems((prev) => [
      ...prev,
      {
        id: generateItemId(),
        warehouse: firstWarehouse,
        itemCode: first?.itemCode ?? '',
        itemName: first?.itemName ?? '',
        spec: first?.spec ?? '',
        stock: first ? getStockByItemCode(first.itemCode) : 0,
        unit: firstUnit,
        outQty: 1,
        unitPrice: first?.unitPrice ?? 0,
        discountRate: 0,
        vatIncluded: 'Y',
        vatType: 'TAX',
      },
    ]);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleTransportChange = useCallback((field, value) => {
    setTransport((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTempSave = useCallback(() => {
    setSaved(true);
    console.log('출고등록 임시저장', { shipmentId, items, transport });
  }, [shipmentId, items, transport]);

  const handleConfirm = useCallback(() => {
    if (!shipmentId) return;
    setConfirmed(true);
    console.log('출고확정', { shipmentId, items, transport });
  }, [shipmentId, items, transport]);

  return (
    <PageShell
      path="/delivery/request"
      title="출고등록"
      description="출하번호 기준 출고 처리"
    >
      <div className={styles.page}>
        {/* 1. 출하번호 선택 */}
        <section className={styles.section} aria-label="출하번호 선택">
          <Card className={styles.card}>
            <CardBody>
              <div className={styles.shipmentRow}>
                <Select
                  label="출하번호"
                  options={MOCK_SHIPMENT_OPTIONS}
                  value={shipmentId}
                  onChange={handleShipmentChange}
                  className={styles.shipmentSelect}
                  aria-label="출하번호 선택"
                />
              </div>
            </CardBody>
          </Card>
        </section>

        {/* 2. 출고 기본정보 (ReadOnly) */}
        {basicInfo && (
          <section className={styles.section} aria-label="출고 기본정보">
            <Card title="출고 기본정보" className={styles.card}>
              <CardBody>
                <div className={styles.basicGrid}>
                  <div className={styles.basicField}>
                    <span className={styles.basicLabel}>거래처</span>
                    <span className={styles.basicValue}>{basicInfo.customer}</span>
                  </div>
                  <div className={styles.basicField}>
                    <span className={styles.basicLabel}>납품처</span>
                    <span className={styles.basicValue}>{basicInfo.deliveryTo}</span>
                  </div>
                  <div className={styles.basicField}>
                    <span className={styles.basicLabel}>출고예정일</span>
                    <span className={styles.basicValue}>{basicInfo.expectedDate}</span>
                  </div>
                  <div className={styles.basicField}>
                    <span className={styles.basicLabel}>출고유형</span>
                    <span className={styles.basicValue}>{basicInfo.outboundType}</span>
                  </div>
                  <div className={styles.basicField}>
                    <span className={styles.basicLabel}>결제방법</span>
                    <span className={styles.basicValue}>{basicInfo.paymentMethod}</span>
                  </div>
                  <div className={styles.basicField}>
                    <span className={styles.basicLabel}>공급가</span>
                    <span className={styles.basicValue}>{basicInfo.supplyAmount.toLocaleString()}원</span>
                  </div>
                  <div className={styles.basicField}>
                    <span className={styles.basicLabel}>부가세</span>
                    <span className={styles.basicValue}>{basicInfo.vat.toLocaleString()}원</span>
                  </div>
                  <div className={styles.basicField}>
                    <span className={styles.basicLabel}>합계</span>
                    <span className={classnames(styles.basicValue, styles.basicTotal)}>
                      {basicInfo.total.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </section>
        )}

        {/* 3. 수금 및 품목정보 */}
        <section
          className={styles.section}
          aria-label="수금 및 품목정보"
          aria-disabled={!isItemSectionEnabled}
        >
          <Card
            title="수금 및 품목정보"
            className={classnames(styles.card, !isItemSectionEnabled && styles.cardDisabled)}
          >
            <CardBody>
              {!isItemSectionEnabled ? (
                <p className={styles.hint}>출하번호를 선택하면 품목을 등록할 수 있습니다.</p>
              ) : (
                <>
                  <div className={styles.itemActions}>
                    <Button variant="primary" onClick={addItem}>
                      + 품목 추가
                    </Button>
                  </div>
                  <div className={styles.itemTableWrap}>
                    {items.length === 0 ? (
                      <p className={styles.empty}>품목을 추가해 주세요.</p>
                    ) : (
                      <table className={styles.itemTable}>
                        <thead>
                          <tr>
                            <th className={styles.itemTh}>창고</th>
                            <th className={styles.itemTh}>품목</th>
                            <th className={styles.itemTh}>단위</th>
                            <th className={styles.itemTh}>수량</th>
                            <th className={styles.itemTh}>할인율(%)</th>
                            <th className={styles.itemTh}>단가</th>
                            <th className={styles.itemTh}>부가세포함구분</th>
                            <th className={styles.itemTh}>부가세유형</th>
                            <th className={styles.itemThAction}>삭제</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((row) => (
                            <tr key={row.id}>
                              <td className={styles.itemTd}>
                                <select
                                  className={styles.itemTableSelect}
                                  value={row.warehouse ?? ''}
                                  onChange={(e) => updateItem(row.id, 'warehouse', e.target.value)}
                                  aria-label="창고 선택"
                                >
                                  {MOCK_WAREHOUSE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className={styles.itemTd}>
                                <select
                                  className={styles.itemTableSelect}
                                  value={row.itemCode}
                                  onChange={(e) => updateItem(row.id, 'itemCode', e.target.value)}
                                  aria-label="품목 선택"
                                >
                                  <option value="">선택</option>
                                  {MOCK_ITEM_OPTIONS.map((o) => (
                                    <option key={o.itemCode} value={o.itemCode}>
                                      {o.itemCode} {o.itemName}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className={styles.itemTd}>
                                <select
                                  className={styles.itemTableSelect}
                                  value={row.unit ?? 'EA'}
                                  onChange={(e) => updateItem(row.id, 'unit', e.target.value)}
                                  aria-label="단위 선택"
                                >
                                  {MOCK_UNIT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className={styles.itemTd}>
                                <input
                                  type="number"
                                  min={1}
                                  className={styles.itemTableInput}
                                  value={row.outQty}
                                  onChange={(e) => updateItem(row.id, 'outQty', Number(e.target.value) || 0)}
                                  aria-label="수량"
                                />
                              </td>
                              <td className={styles.itemTd}>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  className={styles.itemTableInput}
                                  value={row.discountRate}
                                  onChange={(e) => updateItem(row.id, 'discountRate', Number(e.target.value) || 0)}
                                  aria-label="할인율"
                                />
                              </td>
                              <td className={styles.itemTd}>
                                <input
                                  type="number"
                                  className={styles.itemTableInput}
                                  value={row.unitPrice}
                                  onChange={(e) => updateItem(row.id, 'unitPrice', Number(e.target.value) || 0)}
                                  aria-label="단가"
                                />
                              </td>
                              <td className={styles.itemTd}>
                                <select
                                  className={styles.itemTableSelect}
                                  value={row.vatIncluded ?? 'Y'}
                                  onChange={(e) => updateItem(row.id, 'vatIncluded', e.target.value)}
                                  aria-label="부가세포함구분"
                                >
                                  {MOCK_VAT_INCLUDED_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className={styles.itemTd}>
                                <select
                                  className={styles.itemTableSelect}
                                  value={row.vatType ?? 'TAX'}
                                  onChange={(e) => updateItem(row.id, 'vatType', e.target.value)}
                                  aria-label="부가세유형"
                                >
                                  {MOCK_VAT_TYPE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className={styles.itemTdAction}>
                                <button
                                  type="button"
                                  className={styles.deleteBtn}
                                  onClick={() => removeItem(row.id)}
                                  aria-label="품목 삭제"
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </section>

        {/* 4. 납품 및 운송 정보 (접힘) */}
        <section className={styles.section} aria-label="납품 및 운송 정보">
          <Card className={styles.card}>
            <button
              type="button"
              className={styles.collapseHeader}
              onClick={() => setTransportOpen((o) => !o)}
              aria-expanded={transportOpen}
            >
              <span className={styles.collapseTitle}>납품 및 운송 정보</span>
              <span className={styles.collapseIcon} aria-hidden>
                {transportOpen ? '▼' : '▶'}
              </span>
            </button>
            {transportOpen && (
              <CardBody>
                <div className={styles.transportGrid}>
                  <Input
                    label="도착지"
                    value={transport.destination}
                    onChange={(e) => handleTransportChange('destination', e.target.value)}
                    placeholder="도착지 입력"
                    className={styles.transportInput}
                  />
                  <Input
                    label="운송방법"
                    value={transport.transportMethod}
                    onChange={(e) => handleTransportChange('transportMethod', e.target.value)}
                    placeholder="예: 직송, 대리점경유"
                    className={styles.transportInput}
                  />
                  <Input
                    label="차량번호"
                    value={transport.vehicleNo}
                    onChange={(e) => handleTransportChange('vehicleNo', e.target.value)}
                    placeholder="차량번호"
                    className={styles.transportInput}
                  />
                  <Input
                    label="인계자"
                    value={transport.handoverTo}
                    onChange={(e) => handleTransportChange('handoverTo', e.target.value)}
                    placeholder="인계자 성함"
                    className={styles.transportInput}
                  />
                  <div className={styles.transportFull}>
                    <Input
                      label="요청사항"
                      value={transport.requestNote}
                      onChange={(e) => handleTransportChange('requestNote', e.target.value)}
                      placeholder="운송·납품 관련 요청사항"
                      className={styles.transportInput}
                    />
                  </div>
                </div>
              </CardBody>
            )}
          </Card>
        </section>

        {/* 5. 하단 액션 바 (고정) */}
        <div className={styles.actionBar}>
          <div className={styles.actionBarInner}>
            <Button variant="secondary" onClick={handleTempSave}>
              임시저장
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!shipmentId}
            >
              출고확정
            </Button>
          </div>
        </div>

        {/* 결과 메시지 */}
        {saved && (
          <p className={styles.toast} role="status">
            임시저장되었습니다.
          </p>
        )}
        {confirmed && (
          <p className={styles.toast} role="status">
            출고가 확정되었습니다.
          </p>
        )}
      </div>
    </PageShell>
  );
}
