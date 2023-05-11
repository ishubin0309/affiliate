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

export type OnExport = (exportType: ExportType) => Promise<string | undefined>;

export const conversionFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}%`;

export const filterReportColumns = (data: any[]) => {
  const report_column = data.map((item) => {
    return item?.header;
  });
  return report_column;
};
