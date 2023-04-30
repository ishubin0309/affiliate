import fs from "fs";
import path from "path";

export const exportJSON = (
  columns: Array<string>,
  rows: Array<number>,
  localFileName: string
) => {
  let path_name = path.join(
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
