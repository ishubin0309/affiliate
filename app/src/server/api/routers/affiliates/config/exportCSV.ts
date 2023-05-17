import { Parser } from "json2csv";

import type { ColumnsType } from "@/server/api/routers/affiliates/reports/reports-utils";
import type { Writable } from "stream";

export const generateCSVReport = (
  columns: ColumnsType[],
  data: any[],
  writeStream: Writable,
  localFileName: string
) => {
  const parser = new Parser({
    fields: columns.map(({ header, accessorKey }) => ({
      label: header,
      value: accessorKey,
    })),
  });
  const csv = parser.parse(data);

  writeStream.on("error", (err) => {
    console.error(err);
  });

  writeStream.on("finish", () => {
    console.log(`File  uploaded.`);
  });

  writeStream.end(csv);
};
