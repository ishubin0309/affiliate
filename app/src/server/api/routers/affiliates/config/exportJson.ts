import fs from "fs";

export const exportJSON = (
  columns: Array<string>,
  rows: Array<number>,
  localFileName: string
) => {
  fs.writeFile(localFileName, JSON.stringify(rows), function (err: unknown) {
    if (err) throw err;
    console.log("complete");
  });
};