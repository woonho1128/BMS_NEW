import { Card, CardBody } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button/Button';
import { classnames } from '../../../../shared/utils/classnames';
import styles from '../PartnerRegisterPage.module.css';

export function PartnerMapCard({
  formData,
  mapPins,
  handleMapCenterChange,
  handleAddPoint,
  handlePointChange,
  handleRemovePoint,
}) {
  return (
    <Card title="7) 반경 3Km 내 당사/경쟁사 현황" className={styles.card}>
      <CardBody>
        <div className={styles.editableBlock}>
          <div className={styles.mapControlBar}>
            <div className={styles.mapControlGrid}>
              <label className={styles.inlineField}>
                <span>중심 위도</span>
                <input
                  type="number"
                  step="0.0001"
                  className={styles.inlineInput}
                  value={formData.mapCenter?.lat ?? ''}
                  onChange={(e) => handleMapCenterChange('lat', e.target.value)}
                />
              </label>
              <label className={styles.inlineField}>
                <span>중심 경도</span>
                <input
                  type="number"
                  step="0.0001"
                  className={styles.inlineInput}
                  value={formData.mapCenter?.lng ?? ''}
                  onChange={(e) => handleMapCenterChange('lng', e.target.value)}
                />
              </label>
              <label className={styles.inlineField}>
                <span>반경(Km)</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className={styles.inlineInput}
                  value={formData.mapCenter?.radiusKm ?? 3}
                  onChange={(e) => handleMapCenterChange('radiusKm', e.target.value)}
                />
              </label>
            </div>
            <Button variant="secondary" onClick={handleAddPoint}>
              점 추가
            </Button>
          </div>

          <div className={styles.mapSection}>
            <div className={styles.mapCanvas} role="img" aria-label="반경 지도 미리보기">
              <div className={styles.mapRadius} />
              <div className={classnames(styles.mapMarker, styles.mapCenterMarker)} style={{ left: '50%', top: '50%' }}>
                <span className={styles.mapPinLabel}>대리점</span>
              </div>
              {mapPins.map((pin) => (
                <div
                  key={pin.id}
                  className={classnames(styles.mapMarker, pin.type === 'our' ? styles.mapMarkerOur : styles.mapMarkerCompetitor)}
                  style={{
                    left: `${Math.min(92, Math.max(8, 50 + ((Number(pin.lng) - Number(formData.mapCenter?.lng || 126.978)) * 260) / (Number(formData.mapCenter?.radiusKm || 3) * 2)))}%`,
                    top: `${Math.min(92, Math.max(8, 50 - ((Number(pin.lat) - Number(formData.mapCenter?.lat || 37.5665)) * 260) / (Number(formData.mapCenter?.radiusKm || 3) * 2)))}%`,
                  }}
                >
                  <span className={styles.mapPinLabel}>{pin.name || '-'}</span>
                </div>
              ))}
            </div>
            <div className={styles.mapMeta}>
              <div className={styles.mapMetaRow}>
                <span className={styles.mapMetaLabel}>중심 좌표</span>
                <strong>
                  {Number(formData.mapCenter?.lat || 37.5665).toFixed(4)}, {Number(formData.mapCenter?.lng || 126.978).toFixed(4)}
                </strong>
              </div>
              <div className={styles.mapMetaRow}>
                <span className={styles.mapMetaLabel}>반경</span>
                <strong>{Number(formData.mapCenter?.radiusKm || 3)}Km</strong>
              </div>
              <div className={styles.mapLegend}>
                <span><i className={classnames(styles.legendDot, styles.legendCenter)} />대리점</span>
                <span><i className={classnames(styles.legendDot, styles.legendOur)} />당사</span>
                <span><i className={classnames(styles.legendDot, styles.legendCompetitor)} />경쟁사</span>
              </div>
            </div>
          </div>

          <div className={styles.placeTableWrap}>
            <table className={styles.placeTable}>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>지점명</th>
                  <th>위도</th>
                  <th>경도</th>
                  <th>메모</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {formData.nearbyPoints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyCell}>점을 추가해 주세요.</td>
                  </tr>
                ) : (
                  formData.nearbyPoints.map((point) => (
                    <tr key={point.id}>
                      <td>
                        <select
                          className={styles.select}
                          value={point.type}
                          onChange={(e) => handlePointChange(point.id, 'type', e.target.value)}
                        >
                          <option value="our">당사</option>
                          <option value="competitor">경쟁사</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className={styles.input}
                          value={point.name || ''}
                          onChange={(e) => handlePointChange(point.id, 'name', e.target.value)}
                          placeholder="지점명"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.0001"
                          className={styles.input}
                          value={point.lat ?? ''}
                          onChange={(e) => handlePointChange(point.id, 'lat', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.0001"
                          className={styles.input}
                          value={point.lng ?? ''}
                          onChange={(e) => handlePointChange(point.id, 'lng', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className={styles.input}
                          value={point.note || ''}
                          onChange={(e) => handlePointChange(point.id, 'note', e.target.value)}
                          placeholder="메모"
                        />
                      </td>
                      <td>
                        <button type="button" className={styles.deleteBtn} onClick={() => handleRemovePoint(point.id)}>
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default PartnerMapCard;
