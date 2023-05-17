import type { ColumnsType } from "@/server/api/routers/affiliates/reports/reports-utils";
import path from "path";
import type { Writable } from "stream";
import XLSX from "xlsx";

export const generateXLSXReport = (
  columns: Array<ColumnsType>,
  rows: Array<number>,
  writeStream: Writable,
  localFileName: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call

  const path_name = path.join(
    __dirname,
    "../../../../../src/server/api/routers/affiliates/config/generated/" +
      localFileName
  );

  const binaryWS = XLSX.utils.json_to_sheet(rows);

  // Create a new Workbook
  const wb = XLSX.utils.book_new();

  // Name your sheet
  XLSX.utils.book_append_sheet(wb, binaryWS, "Fake Report");

  // export your excel
  XLSX.writeFile(wb, path_name);
};
