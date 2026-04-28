import React, { useMemo, useState } from 'react';
import { PageShell } from '../../../../shared/components/PageShell/PageShell';
import { ROUTES } from '../../../../router/routePaths';
import { notify } from '../../../../shared/utils/notify';
import styles from './PartnerOrderDeliveryPage.module.css';

const initialVehicleRows = [
  {
    id: 'v-1',
    requestDate: '2026-04-14',
    outboundNo: 'DN202604140020',
    dealerName: '건설도기특상',
    status: '포장대기',
    qty: 3,
    weight: '0.9t',
    carType: '2.5t',
    driverPhone: '010-0000-0000',
    logisticsCompany: '-',
    destination: '경기도 수원시 팔달구 지동 93-6',
    receiver: '000',
    contact: '010-0000-0000',
    note: '',
  },
  {
    id: 'v-2',
    requestDate: '2026-04-20',
    outboundNo: 'DN202604200113',
    dealerName: '선우대리점',
    status: '배차완료',
    qty: 2,
    weight: '0.6t',
    carType: '1t',
    driverPhone: '010-1234-5678',
    logisticsCompany: '직배',
    destination: '서울시 강동구 성내동 88-2',
    receiver: '김OO',
    contact: '010-2222-3333',
    note: '오후 납품',
  },
];

const initialParcelRows = [
  {
    id: 'p-1',
    requestDate: '2026-04-14',
    outboundNo: 'DN202604140020',
    dealerName: '건설도기특상',
    status: '포장대기',
    boxQty: 3,
    trackingNo: '010-0000-0000',
    logisticsCompany: '-',
    destination: '수원시 팔달구 지동 93-6',
    receiver: '000',
    contact: '010-0000-0000',
    note: '',
  },
  {
    id: 'p-2',
    requestDate: '2026-04-18',
    outboundNo: 'DN202604180091',
    dealerName: '리빙타일',
    status: '발송완료',
    boxQty: 2,
    trackingNo: 'CJ-2254890012',
    logisticsCompany: 'CJ대한통운',
    destination: '부산시 해운대구 좌동 301-1',
    receiver: '박OO',
    contact: '010-8844-2299',
    note: '',
  },
];

const formatDate = (value) => value.replaceAll('-', '.');

const withinRange = (date, start, end) => {
  if (!date) return false;
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

function SectionTable({ title, rows, isParcel, onExport, onSelect, selectedId }) {
  const columnCount = isParcel ? 11 : 13;

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHead}>
        <h3>{title}</h3>
        <button type="button" className={styles.ghostBtn} onClick={onExport}>엑셀 내보내기</button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>출고요청일</th>
              <th>출고번호</th>
              <th>대리점명</th>
              <th>진행상태</th>
              <th className={styles.num}>{isParcel ? '박스수량' : 'PT수량'}</th>
              {!isParcel && <th className={styles.num}>중량</th>}
              {!isParcel && <th>차종</th>}
              <th>{isParcel ? '송장번호' : '화물기사번호'}</th>
              <th>물류회사</th>
              <th>도착지</th>
              <th>수령인</th>
              <th>연락처</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columnCount} className={styles.emptyCell}>조건에 맞는 데이터가 없습니다.</td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={row.id}
                className={selectedId === row.id ? styles.selectedRow : ''}
                onClick={() => onSelect(row.id)}
              >
                <td>{formatDate(row.requestDate)}</td>
                <td>{row.outboundNo}</td>
                <td>{row.dealerName}</td>
                <td>{row.status}</td>
                <td className={styles.num}>{isParcel ? row.boxQty : row.qty}</td>
                {!isParcel && <td className={styles.num}>{row.weight}</td>}
                {!isParcel && <td>{row.carType}</td>}
                <td>{isParcel ? row.trackingNo : row.driverPhone}</td>
                <td>{row.logisticsCompany}</td>
                <td>{row.destination}</td>
                <td>{row.receiver}</td>
                <td>{row.contact}</td>
                <td>{row.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function PartnerOrderDeliveryPage() {
  const [vehicleRows, setVehicleRows] = useState(initialVehicleRows);
  const [parcelRows, setParcelRows] = useState(initialParcelRows);

  const [filters, setFilters] = useState({
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    outboundNo: '',
    dealerName: '',
  });
  const [query, setQuery] = useState(filters);

  const [activeInputTab, setActiveInputTab] = useState('vehicle');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleRows[0]?.id ?? '');
  const [selectedParcelId, setSelectedParcelId] = useState(parcelRows[0]?.id ?? '');

  const filteredVehicleRows = useMemo(
    () => vehicleRows.filter((row) => (
      withinRange(row.requestDate, query.startDate, query.endDate)
      && row.outboundNo.toLowerCase().includes(query.outboundNo.toLowerCase())
      && row.dealerName.toLowerCase().includes(query.dealerName.toLowerCase())
    )),
    [vehicleRows, query],
  );

  const filteredParcelRows = useMemo(
    () => parcelRows.filter((row) => (
      withinRange(row.requestDate, query.startDate, query.endDate)
      && row.outboundNo.toLowerCase().includes(query.outboundNo.toLowerCase())
      && row.dealerName.toLowerCase().includes(query.dealerName.toLowerCase())
    )),
    [parcelRows, query],
  );

  const selectedVehicle = filteredVehicleRows.find((row) => row.id === selectedVehicleId) ?? filteredVehicleRows[0] ?? null;
  const selectedParcel = filteredParcelRows.find((row) => row.id === selectedParcelId) ?? filteredParcelRows[0] ?? null;

  const selectedRow = activeInputTab === 'vehicle' ? selectedVehicle : selectedParcel;

  const updateSelectedField = (key, value) => {
    if (!selectedRow) return;
    if (activeInputTab === 'vehicle') {
      setVehicleRows((prev) => prev.map((row) => (row.id === selectedRow.id ? { ...row, [key]: value } : row)));
      return;
    }
    setParcelRows((prev) => prev.map((row) => (row.id === selectedRow.id ? { ...row, [key]: value } : row)));
  };

  const handleSearch = () => {
    setQuery(filters);
  };

  const handleSave = () => {
    if (!selectedRow) {
      notify.info('선택된 출고 건이 없습니다.');
      return;
    }
    notify.success('출고 정보가 저장되었습니다.');
  };

  return (
    <PageShell title="운임 현황" path={ROUTES.PARTNER_DISPATCH} className={styles.shellWide}>
      <div className={styles.page}>
        <section className={styles.noticeBox}>
          <p>대리점은 본인 출고요청건 조회만 가능합니다.</p>
          <p>영업직원은 본인 대리점 조회가 기본이며, 검색 시 타 대리점 열람이 가능합니다.</p>
          <p>물류직원은 출고건 클릭 시 페이지 이동 없이 탭에서 입력 및 저장할 수 있습니다.</p>
        </section>

        <section className={styles.filterCard}>
          <div className={styles.filterRow}>
            <label>
              <span>시작일</span>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </label>
            <label>
              <span>종료일</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </label>
            <label>
              <span>출고번호</span>
              <input
                value={filters.outboundNo}
                onChange={(e) => setFilters((prev) => ({ ...prev, outboundNo: e.target.value }))}
                placeholder="출고번호"
              />
            </label>
            <label>
              <span>대리점명</span>
              <input
                value={filters.dealerName}
                onChange={(e) => setFilters((prev) => ({ ...prev, dealerName: e.target.value }))}
                placeholder="대리점명"
              />
            </label>
            <button type="button" className={styles.searchBtn} onClick={handleSearch}>조회</button>
          </div>
        </section>

        <SectionTable
          title="차량출고"
          rows={filteredVehicleRows}
          onExport={() => notify.info('차량출고 엑셀 내보내기를 준비 중입니다.')}
          onSelect={(id) => {
            setSelectedVehicleId(id);
            setActiveInputTab('vehicle');
          }}
          selectedId={selectedVehicle?.id}
        />

        <SectionTable
          title="택배출고"
          rows={filteredParcelRows}
          isParcel
          onExport={() => notify.info('택배출고 엑셀 내보내기를 준비 중입니다.')}
          onSelect={(id) => {
            setSelectedParcelId(id);
            setActiveInputTab('parcel');
          }}
          selectedId={selectedParcel?.id}
        />

        <section className={styles.inputCard}>
          <div className={styles.inputHead}>
            <h3>출고 입력</h3>
            <div className={styles.inputTabs}>
              <button
                type="button"
                className={activeInputTab === 'vehicle' ? styles.inputTabActive : styles.inputTab}
                onClick={() => setActiveInputTab('vehicle')}
              >
                차량출고
              </button>
              <button
                type="button"
                className={activeInputTab === 'parcel' ? styles.inputTabActive : styles.inputTab}
                onClick={() => setActiveInputTab('parcel')}
              >
                택배출고
              </button>
            </div>
          </div>

          {!selectedRow && <p className={styles.emptyInput}>출고 목록에서 건을 선택해 주세요.</p>}

          {selectedRow && (
            <div className={styles.inputGrid}>
              <label>
                <span>출고번호</span>
                <input value={selectedRow.outboundNo} disabled />
              </label>
              <label>
                <span>대리점명</span>
                <input value={selectedRow.dealerName} disabled />
              </label>
              <label>
                <span>진행상태</span>
                <input value={selectedRow.status} onChange={(e) => updateSelectedField('status', e.target.value)} />
              </label>
              <label>
                <span>물류회사</span>
                <input value={selectedRow.logisticsCompany} onChange={(e) => updateSelectedField('logisticsCompany', e.target.value)} />
              </label>
              <label>
                <span>{activeInputTab === 'vehicle' ? '화물기사번호' : '송장번호'}</span>
                <input
                  value={activeInputTab === 'vehicle' ? selectedRow.driverPhone : selectedRow.trackingNo}
                  onChange={(e) => updateSelectedField(activeInputTab === 'vehicle' ? 'driverPhone' : 'trackingNo', e.target.value)}
                />
              </label>
              <label>
                <span>수령인</span>
                <input value={selectedRow.receiver} onChange={(e) => updateSelectedField('receiver', e.target.value)} />
              </label>
              <label>
                <span>연락처</span>
                <input value={selectedRow.contact} onChange={(e) => updateSelectedField('contact', e.target.value)} />
              </label>
              <label className={styles.fullRow}>
                <span>비고</span>
                <input value={selectedRow.note} onChange={(e) => updateSelectedField('note', e.target.value)} />
              </label>
            </div>
          )}

          <div className={styles.inputActions}>
            <button type="button" className={styles.primaryBtn} onClick={handleSave}>저장</button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
