/**
 * Node 16 compatibility shim for tools expecting Web Crypto on globalThis.
 * Vite 5+ uses `globalThis.crypto.getRandomValues`, which is not always
 * available on Node 16 without explicit wiring.
 */
try {
  const cryptoModule = require('crypto');
  const webcrypto = cryptoModule.webcrypto;

  // 1) Ensure globalThis.crypto exists for libraries checking browser-like globals.
  if ((!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') && webcrypto) {
    globalThis.crypto = webcrypto;
  }

  // 2) Ensure node:crypto module exposes getRandomValues/randomUUID as expected by Vite internals on older Node.
  if (webcrypto && typeof webcrypto.getRandomValues === 'function' && typeof cryptoModule.getRandomValues !== 'function') {
    cryptoModule.getRandomValues = webcrypto.getRandomValues.bind(webcrypto);
  }
  if (webcrypto && typeof webcrypto.randomUUID === 'function' && typeof cryptoModule.randomUUID !== 'function') {
    cryptoModule.randomUUID = webcrypto.randomUUID.bind(webcrypto);
  }
} catch (_) {
  // Ignore shim failure and let the caller surface the original runtime error.
}
