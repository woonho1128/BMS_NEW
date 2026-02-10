/**
 * 라우팅 헬퍼 (placeholder 대비)
 */

/**
 * path가 현재 location과 일치하는지 (정확 또는 prefix)
 * @param {string} path
 * @param {string} currentPathname
 * @param {boolean} exact
 * @returns {boolean}
 */
export function isPathActive(path, currentPathname, exact = false) {
  if (path === '/') return currentPathname === '/';
  if (exact) return currentPathname === path;
  return currentPathname === path || currentPathname.startsWith(path + '/');
}
