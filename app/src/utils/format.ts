export const formatPrice = (value?: number) => {
  const v = parseFloat((value || 0).toFixed(2));

  return v && v < 0
    ? `($${performanceFormatter(-v)})`
    : `$${performanceFormatter(v)}`;
};

export const isNumeric = (value?: number | string) => {
  if (!value) {
    return false;
  }
  let v = `${value}`;
  v = v.replace("$", "");
  v = v.replace("%", "");
  return !Number.isNaN(parseFloat(v));
};
export const firstLetterUpperCase = (string?: string | null) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export const convertToNumber = (value: number | string): number => {
  if (!value) {
    return 0;
  }
  let v = `${value}`;
  v = v.replace("$", "");
  v = v.replace("%", "");
  v = v.replace("px", "");
  v = v.replace(",", "");
  if (Number.isNaN(parseFloat(v))) {
    return 0;
  }
  return parseFloat(v);
};

export const performanceFormatter = (number: number) => {
  return Intl.NumberFormat("us").format(number).toString();
};

export const conversionFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}%`;
