import { ColumnSort } from "@tanstack/react-table";

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

export const serializeSorting = (sorting: ColumnSort[]) => {
  return sorting.map(({ id, desc }) => `${desc ? "-" : ""}${id}`).join(",");
};
export const deserializeSorting = (sort_string?: string): ColumnSort[] => {
  let res: ColumnSort[] = [];
  if (sort_string && sort_string !== "") {
    let split_info = sort_string.split(",").map((x) => {
      const sort_info = x.split("-");
      if (sort_info.length == 1) {
        if (sort_info[0] === "") {
          return null;
        }

        return {
          id: sort_info[0],
          desc: false,
        } as ColumnSort;
      } else if (sort_info.length == 2) {
        return {
          id: sort_info[1],
          desc: true,
        } as ColumnSort;
      } else {
        return null;
      }
    });
    res = split_info.filter((x): x is ColumnSort => x !== null);
  }
  return res;
};
