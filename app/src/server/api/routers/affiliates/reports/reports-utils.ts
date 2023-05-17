import { env } from "@/env.mjs";
import fs, { writeFileSync } from "fs";
import os from "os";
import path from "path";
import { z } from "zod";
import { uploadFile } from "../config/cloud-storage";
import { generateCSVReport } from "../config/exportCSV";
import { generateJSONReport } from "../config/generateJSONReport";
import { generateXLSXReport } from "../config/generateXLSXReport";

// Common params for all reports
export const PageParamsSchema = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
});

export const SortingParamSchema = z
  .object({
    id: z.string(),
    desc: z.boolean(),
  })
  .array()
  .optional();

export const getPageOffset = (pageParams: PageParam) =>
  (pageParams.pageNumber - 1) * pageParams.pageSize;

export const getSortingInfo = (sortingParam: SortingParam) => {
  return sortingParam?.map((x) => {
    const res: {
      [key: string]: string;
    } = {};
    res[x.id] = x.desc ? "desc" : "asc";
    return res;
  });
};

export const pageInfo = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
  totalItems: z.number().int(),
});

export type PageParam = z.infer<typeof PageParamsSchema>;
export type PageInfo = z.infer<typeof pageInfo>;
export type SortingParam = z.infer<typeof SortingParamSchema>;

export interface PageResult {
  data: any[];
  pageInfo: PageInfo;
}

export const splitToPages = <Row>(data: Row[], pageParams: PageParam) => {
  const offset = getPageOffset(pageParams);
  const pageData = data.slice(offset, offset + pageParams.pageSize);
  const pageInfo = {
    pageNumber: pageParams.pageNumber,
    pageSize: pageParams.pageSize,
    totalItems: data.length,
  };
  return { data: pageData, pageInfo };
};

// Common params for all reports export
export const exportType = z.enum(["csv", "xlsx", "json"]);

export type ExportType = z.infer<typeof exportType>;

// Generic function to export data in csv, xlsx, json format
// Can be used for all reports
export const exportReportLoop = async (
  exportType: ExportType,
  columns: string[], // TODO: define better type, see what is needed for export
  generic_filename: string,
  report_type: string,
  getPage: (page: number, items_per_page: number) => Promise<PageResult>
) => {
  let page = 1;
  const items_per_page = 5000;
  let hasMoreData = true;
  const tmpDir = os.tmpdir();
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }
  const tmpFile = path.join(tmpDir, Date.now().toString());

  while (hasMoreData) {
    // console.log("generic file name ------->", page, items_per_page);
    const { data, pageInfo } = await getPage(page, items_per_page);
    // TODO: write data to to csv, xlsx, json based on exportType

    // console.log("data ----->", data);
    // TODO: should not be needed
    const data_rows = data; // filterData(data, report_type);

    if (exportType === "xlsx") {
      generateXLSXReport(columns, data_rows, tmpFile);
    } else if (exportType === "csv") {
      generateCSVReport(columns, data_rows, tmpFile);
    } else {
      generateJSONReport(columns, data, tmpFile);
    }

    hasMoreData = data.length >= items_per_page;
    page++;
  }
  const bucketName = "reports-download-tmp";
  const serviceKey = path.join(
    __dirname,
    "../../../../../api-front-dashbord-a4ee8aec074c.json"
  );

  const public_url = await uploadFile(
    serviceKey,
    "api-front-dashbord",
    bucketName,
    tmpFile
  );

  fs.unlinkSync(tmpFile);

  return public_url;
};

// export const convertArrayOfObjectsToCSV = (arr: object[]) => {
//   const separator = ",";
//   const keys = Object.keys(arr[0]);
//   const csvHeader = keys.join(separator);
//   const csvRows = arr.map((obj) => {
//     return keys
//       .map((key) => {
//         return obj[key];
//       })
//       .join(separator);
//   });
//
//   const filtered_data = [];
//   filtered_data.push(csvRows.join("\n"));
//   return filtered_data;
// };

// export const filterData = (data: any[], report_type: string) => {
//   const data_rows = [] as number[];
//   switch (report_type) {
//     case "quick-summary":
//       data.map((item) => {
//         data_rows.push(
//           item.Impressions,
//           item.Clicks,
//           item.Install,
//           item.Leads,
//           item.Demo,
//           item.RealAccount,
//           item.FTD,
//           item.Withdrawal,
//           item.ChargeBack,
//           item.ActiveTrader,
//           item.Commission
//         );
//       });
//       break;
//     case "commission-report":
//       data.map((item: CommissionReportType) => {
//         data_rows.push(
//           item?.merchant_id,
//           Number(item?.traderID),
//           Number(item?.transactionID),
//           Number(item?.Type),
//           item?.Amount,
//           // item?.Country || "",
//           item?.Commission
//         );
//       });
//     case "install-report":
//       data.map((item) => {
//         data_rows.push(
//           item?.type,
//           item?.rdate,
//           item?.trader_id,
//           item?.trader_alias,
//           item?.trader_status,
//           item?.country,
//           item?.affiliate_id,
//           item?.username,
//           item?.merchant_id,
//           item?.name,
//           item?.id,
//           item?.title
//         );
//       });
//     default:
//       // console.log("data ------>", data?.data);
//       data?.data?.map((item) => {
//         data_rows.push(item);
//       });
//       break;
//   }
//   return data_rows;
// };

export const debugSaveData = (name: string, data: any) => {
  if (env.NODE_ENV !== "production") {
    writeFileSync(`./tmp/${name}.json`, JSON.stringify(data, null, 2));
  }
};
