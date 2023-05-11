import { Parser } from "json2csv";

import type { Writable } from "stream";

export const generateCSVReport = (
  columns: string[],
  data: any[],
  writeStream: Writable,
  localFileName: string
) => {
  const opts = { fields: columns };
  const parser = new Parser(opts);
  const csv = parser.parse(data);

  writeStream.write(csv);
};
