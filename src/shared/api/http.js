/**
 * HTTP client (axios or fetch wrapper) - 인터셉터 대비
 * 현재는 fetch 기반 래퍼만 제공, 추후 axios 연동 시 인터셉터 추가
 */

const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<Response>}
 */
export function request(url, options = {}) {
  const headers = { ...defaultHeaders, ...options.headers };
  return fetch(url, { ...options, headers });
}

/**
 * @param {string} url
 * @param {object} options
 * @returns {Promise<Response>}
 */
export function get(url, options = {}) {
  return request(url, { ...options, method: 'GET' });
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} options
 * @returns {Promise<Response>}
 */
export function post(url, data, options = {}) {
  return request(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}
