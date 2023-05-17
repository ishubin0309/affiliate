import fs from "fs";
import { Parser } from "json2csv";

export const generateCSVReport = (
  header: Array<string>,
  data: Array<number>,
  fileName: string,
) => {
  const opts = { header: true, excelString: true };
  const parser = new Parser(opts);
  const csv = parser.parse(data);

  fs.writeFile(fileName, csv, function (err) {
    if (err) throw err;
    console.log("file saved");
  });
};
