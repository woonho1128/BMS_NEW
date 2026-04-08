import { message } from 'antd';

function open(type, text) {
  const content = String(text || '');
  try {
    if (message && typeof message[type] === 'function') {
      message[type](content);
    }
  } catch {
    // Keep silent in environments without antd message context.
  }
}

export const notify = {
  success(text) {
    open('success', text);
  },
  info(text) {
    open('info', text);
  },
  warning(text) {
    open('warning', text);
  },
  error(text) {
    open('error', text);
  },
};

export function confirmAction(text) {
  return window.confirm(String(text || ''));
}
