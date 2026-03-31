/**
 * 성과 분석(KPI) 페이지의 모의 데이터 생성 및 달성률 계산 공통 유틸리티
 */

/**
 * 분기/월별 모의 실적 데이터 생성기
 * @param {number} base 
 * @param {number} variance 
 * @returns {number[]} 12개월치 실적 데이터 배열
 */
export function makeSeries(base, variance = 0) {
  return Array.from({ length: 12 }, (_, i) => Math.max(0, Math.round(base + i * 40 + variance * ((i % 3) - 1))));
}

/**
 * 달성률(%) 계산
 * @param {number} plan 
 * @param {number} actual 
 * @returns {number} 0~100 이상의 달성률 정수값
 */
export function calcRate(plan, actual) {
  if (!plan) return 0;
  return Math.round((actual / plan) * 100);
}

/**
 * 12개월 전체 합산
 * @param {number[]} arr 
 * @returns {number} 총합
 */
export function sumFullYear(arr) {
  return arr.reduce((acc, cur) => acc + cur, 0);
}

/**
 * 달성률에 따른 스타일 반환 함수
 * 각 페이지의 styles 모듈을 주입받아 사용합니다.
 * @param {number} rate 
 * @param {Object} styles 현재 페이지의 CSS Module 객체
 * @returns {string} 클래스네임
 */
export function getRateClass(rate, styles) {
  if (!styles) return '';
  if (rate >= 105) return styles.rateHigh || '';
  if (rate >= 95) return styles.rateMid || '';
  return styles.rateLow || '';
}
