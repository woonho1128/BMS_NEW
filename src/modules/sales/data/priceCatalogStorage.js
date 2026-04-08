import { PRICE_PRODUCT_DATA } from './priceCatalogMock';

export const PRICE_CATALOG_STORAGE_KEY = 'bms_price_catalog_products_v1';

function normalizeProduct(product) {
  const docFiles = product?.docFiles || {};
  return {
    ...product,
    seriesName: product?.seriesName || product?.series || '',
    waterSavingGrade: product?.waterSavingGrade || '',
    shippingOrigin: product?.shippingOrigin || '',
    docFiles: {
      testReport: Array.isArray(docFiles.testReport) ? docFiles.testReport : [],
      ecoCert: Array.isArray(docFiles.ecoCert) ? docFiles.ecoCert : [],
      drawingPdf: Array.isArray(docFiles.drawingPdf) ? docFiles.drawingPdf : [],
      drawingDwg: Array.isArray(docFiles.drawingDwg) ? docFiles.drawingDwg : [],
    },
  };
}

export function loadPriceCatalogProducts() {
  if (typeof window === 'undefined') return PRICE_PRODUCT_DATA;
  try {
    const raw = window.localStorage.getItem(PRICE_CATALOG_STORAGE_KEY);
    if (!raw) return PRICE_PRODUCT_DATA.map(normalizeProduct);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return PRICE_PRODUCT_DATA.map(normalizeProduct);
    return parsed.map(normalizeProduct);
  } catch {
    return PRICE_PRODUCT_DATA.map(normalizeProduct);
  }
}

export function savePriceCatalogProducts(products) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PRICE_CATALOG_STORAGE_KEY, JSON.stringify((products || []).map(normalizeProduct)));
  } catch {
    // noop
  }
}
