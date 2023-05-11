import fs from "fs";
import path from "path";
import type { Writable } from "stream";

export const generateJSONReport = (
  columns: Array<string>,
  rows: Array<number>,
  writeStream: Writable,
  localFileName: string
) => {
  const path_name = path.join(
    __dirname,
    "../../../../../src/server/api/routers/affiliates/config/generated/" +
      localFileName
  );
  console.log("dir name ----->", __dirname);
  console.log("path name ----->", path_name);
  fs.writeFile(path_name, JSON.stringify(rows), function (err: unknown) {
    if (err) throw err;
    console.log("complete");
  });
};
