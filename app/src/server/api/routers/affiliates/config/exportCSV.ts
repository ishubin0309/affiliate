import fs from "fs";
import { Parser } from "json2csv";
import path from "path";

export const generateCSVReport = (
  header: Array<string>,
  data: Array<number>,
  fileName: string
) => {
  const opts = { header: true, excelString: true };
  const parser = new Parser(opts);
  const csv = parser.parse(data);

  const path_name = path.join(
    __dirname,
    "../../../../../src/server/api/routers/affiliates/config/generated/" +
      fileName
  );
  fs.writeFile(path_name, csv, function (err) {
    if (err) throw err;
    console.log("file saved");
  });
};
