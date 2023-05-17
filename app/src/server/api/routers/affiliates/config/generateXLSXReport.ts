import XLSX from "xlsx";

export const generateXLSXReport = (
  columns: Array<string>,
  rows: Array<number>,
  localFileName: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call

  const binaryWS = XLSX.utils.json_to_sheet(rows);

  // Create a new Workbook
  const wb = XLSX.utils.book_new();

  // Name your sheet
  XLSX.utils.book_append_sheet(wb, binaryWS, "Fake Report");

  // export your excel
  XLSX.writeFile(wb, localFileName);
};
