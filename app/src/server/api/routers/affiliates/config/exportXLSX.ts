import XLSXWriteStream from "@atomictech/xlsx-write-stream";
import fs from "fs";
export const exportXLSX = (
  columns: Array<string>,
  rows: Array<number>,
  localFileName: string
) => {
  const xlsxWriter = new XLSXWriteStream({ header: true, columns });
  const writeStream = fs.createWriteStream(localFileName);
  xlsxWriter.pipe(writeStream);

  xlsxWriter.write(rows);
  xlsxWriter.end();
};
