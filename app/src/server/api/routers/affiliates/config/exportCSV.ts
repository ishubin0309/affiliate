import csvWriter from "csv-write-stream";
import fs from "fs";

export const exportCSVReport = (
  header: Array<string>,
  data: Array<number>,
  fileName: string
) => {
  const writer = csvWriter({ headers: header, separator: ",\t\t\t" });
  writer.pipe(fs.createWriteStream(fileName));
  writer.write(data);
  writer.end();
};
