import XLSXWriteStream from "@atomictech/xlsx-write-stream";
import fs from "fs";

export const exportXLSX = (
  columns: Array<string>,
  rows: Array<number>,
  localFileName: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const xlsxWriter = new XLSXWriteStream({ header: true, columns });
  const writeStream = fs.createWriteStream(localFileName);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  xlsxWriter.pipe(writeStream);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  xlsxWriter.write(rows);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  xlsxWriter.end();
};
