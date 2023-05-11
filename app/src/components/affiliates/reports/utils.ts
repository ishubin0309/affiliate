import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";

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

type RowData = {
  id: string;
  rdate: Date;
  source: string;
  langENG: string;
  langRUS: string;
  langGER: string;
  langFRA: string;
  langITA: string;
  langESP: string;
  langHEB: string;
  langARA: string;
  langCHI: string;
  langPOR: string;
  langJAP: string;
};

type Column = {
  accessor: keyof RowData;
  header: string;
  cell?: (info: { getValue: () => any }) => React.ReactNode;
};

type Columns = Column[];

export const filterReportColumns = (data: Columns): string[] => {
  const report_column = data.map((item) => {
    return item.header;
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return report_column;
};
