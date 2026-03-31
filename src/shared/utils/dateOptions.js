export function getCurrentYear() {
  return new Date().getFullYear();
}

export function createYearOptions(count = 5, startYear = getCurrentYear()) {
  return Array.from({ length: count }, (_, i) => {
    const year = startYear - i;
    return { value: String(year), label: `${year}년` };
  });
}

export function createMonthOptions() {
  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: String(month), label: `${month}월` };
  });
}
