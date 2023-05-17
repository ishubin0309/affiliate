import { Parser } from "json2csv";

import type { Writable } from "stream";
import type { ColumnsType } from "@/server/api/routers/affiliates/reports/reports-utils";

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

  writeStream.write(csv);
};
