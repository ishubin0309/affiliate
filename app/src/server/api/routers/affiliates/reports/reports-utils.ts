import { env } from "@/env.mjs";
import { Storage } from "@google-cloud/storage";
import { writeFileSync } from "fs";
import json2csv from "json2csv";
import { z } from "zod";
import { generateCSVReport } from "../config/exportCSV";
import { generateJSONReport } from "../config/generateJSONReport";
import { generateXLSXReport } from "../config/generateXLSXReport";

// Common params for all reports
export const PageParamsSchema = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
});

export const getPageOffset = (pageParams: PageParam) =>
  (pageParams.pageNumber - 1) * pageParams.pageSize;

export const pageInfo = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
  totalItems: z.number().int(),
});

export type PageParam = z.infer<typeof PageParamsSchema>;
export type PageInfo = z.infer<typeof pageInfo>;

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

export const exportColumns = z.array(z.string().optional());

export type ExportType = z.infer<typeof exportType>;

export type exportColumnsType = z.infer<typeof exportColumns>;

// Generic function to export data in csv, xlsx, json format
// Can be used for all reports

export const exportReportLoop = async (
  GCP_PROJECT_ID: string,
  GCP_KEY_FILE_PATH: string,
  exportType: ExportType,
  columns: string[],
  reportName: string,
  getPage: (page: number, pageSize: number) => Promise<PageResult>
): Promise<string> => {
  const storage = new Storage({
    projectId: GCP_PROJECT_ID,
    keyFilename: GCP_KEY_FILE_PATH,
  });
  console.log("GCP_PROJECT_ID", GCP_PROJECT_ID);
  console.log("GCP_KEY_FILE_PATH", GCP_KEY_FILE_PATH);

  const bucketName = "reports-download-tmp";
  const bucket = storage.bucket(bucketName);
  const fileExtension = `.${exportType}`;

  const file = bucket.file(`${reportName}${fileExtension}`);
  const writeStream = file.createWriteStream({ resumable: false });

  let page = 1;
  const pageSize = 5000;
  let hasMoreData = true;

  while (hasMoreData) {
    const { data, pageInfo } = await getPage(page, pageSize);

    if (exportType === "xlsx") {
      generateXLSXReport(columns, data, writeStream);
    } else if (exportType === "csv") {
      generateCSVReport(columns, data, writeStream);
    } else {
      generateJSONReport(columns, data, writeStream);
    }

    hasMoreData = data.length >= pageSize;
    page++;
  }

  return new Promise((resolve, reject) => {
    writeStream.on("error", (err) => {
      reject(err);
    });

    writeStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${reportName}${fileExtension}`;
      resolve(publicUrl);
    });
  });
};

export function generateCsv(jsonData: any) {
  const parser = json2csv.parse;
  const fields = Object.keys(jsonData[0]); // Get the field names from the first object in the array
  const csvData = parser(jsonData, { fields }); // Convert the JSON data to CSV format
  return csvData;
}

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
