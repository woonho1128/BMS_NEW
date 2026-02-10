/**
 * 조건부 클래스명 조합
 * @param {...(string|undefined|null|false|Record<string, boolean>)} args
 * @returns {string}
 */
export function classnames(...args) {
  const classes = [];
  for (const arg of args) {
    if (arg == null || arg === false) continue;
    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object') {
      for (const [key, value] of Object.entries(arg)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}
