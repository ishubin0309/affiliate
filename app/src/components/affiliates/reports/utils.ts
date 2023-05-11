import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { ColumnSort } from "@tanstack/react-table";

export const exportOptions: { id: ExportType; title: string }[] = [
  {
    id: "xlsx",
    title: "Excel",
  },
  {
    id: "csv",
    title: "CSV",
  },
  {
    id: "json",
    title: "JSON",
  },
];

export const conversionFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}%`;

export type OnExport = (exportType: ExportType) => Promise<string | undefined>;

// TODO: refactor this, remove eslint disable and have strong typing
export const filterReportColumns = (data: any[]) => {
  const report_column = data.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return item?.header;
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return report_column;
};
