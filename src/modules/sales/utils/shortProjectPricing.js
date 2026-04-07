export const BASE_DISCOUNT_RATE = 16.67;
export const FACTORY_PRICE_MULTIPLIER = 1.73;

export function computeShortProjectItem(row) {
  const qty = Number(row.qty) || 0;
  const standardPrice = Number(row.standardPrice) || 0;
  const discountRate = Number(row.discountRate) || 0;
  const standardAmount = Math.floor(qty * standardPrice);
  const unitPriceAfterDiscount = Math.floor(standardPrice * (1 - discountRate / 100));
  const amountAfterDiscount = qty * unitPriceAfterDiscount;

  return {
    ...row,
    qty,
    standardPrice,
    discountRate,
    standardAmount,
    unitPriceAfterDiscount,
    amountAfterDiscount,
  };
}

export function computeShortProjectProfitRow(row, extraDiscountDisabled) {
  const qty = Number(row.qty) || 0;
  const costUnitPrice = Number(row.standardPrice) || 0;
  const costAmount = qty * costUnitPrice;

  const factoryUnitPrice = Math.floor(costUnitPrice * FACTORY_PRICE_MULTIPLIER);
  const factoryAmount = Math.floor(qty * factoryUnitPrice);

  const baseDiscountUnitPrice = Math.floor(factoryUnitPrice * (1 - BASE_DISCOUNT_RATE / 100));
  const baseDiscountAmount = Math.floor(qty * baseDiscountUnitPrice);
  const baseDiscountDiff = baseDiscountAmount - factoryAmount;
  const baseVsFactoryRate = factoryAmount ? (baseDiscountDiff / factoryAmount) * 100 : 0;

  const appliedDiscountUnitPrice = extraDiscountDisabled
    ? baseDiscountUnitPrice
    : Math.floor(baseDiscountUnitPrice * (1 - (Number(row.discountRate) || 0) / 100));
  const appliedDiscountAmount = Math.floor(qty * appliedDiscountUnitPrice);
  const appliedDiscountDiff = appliedDiscountAmount - factoryAmount;
  const effectiveDiscountRate = factoryAmount ? (appliedDiscountDiff / factoryAmount) * 100 : 0;
  const grossProfitRate = appliedDiscountAmount ? ((appliedDiscountAmount - costAmount) / appliedDiscountAmount) * 100 : 0;
  const grossProfitAmount = appliedDiscountAmount - costAmount;

  return {
    id: row.id,
    itemCode: row.itemCode,
    unit: row.unit,
    qty,
    costUnitPrice,
    costAmount,
    factoryUnitPrice,
    factoryAmount,
    baseDiscountUnitPrice,
    baseDiscountAmount,
    baseDiscountDiff,
    baseVsFactoryRate,
    appliedDiscountUnitPrice,
    appliedDiscountAmount,
    appliedDiscountDiff,
    effectiveDiscountRate,
    grossProfitRate,
    grossProfitAmount,
    discountRate: Number(row.discountRate) || 0,
  };
}
