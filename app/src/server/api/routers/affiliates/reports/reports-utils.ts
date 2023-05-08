import type { CommissionReportType } from "@/server/db-types";
import { writeFileSync } from "fs";
import { z } from "zod";
import { exportCSVReport } from "../config/exportCSV";
import { exportJSON } from "../config/exportJson";
import { exportXLSX } from "../config/exportXLSX";
import { env } from "@/env.mjs";

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
  while (hasMoreData) {
    console.log("generic file name ------->", page, items_per_page);
    const { data, pageInfo } = await getPage(page, items_per_page);
    // TODO: write data to to csv, xlsx, json based on exportType

    // console.log("data ----->", data);
    // TODO: should not be needed
    const data_rows = data; // filterData(data, report_type);

    const xlsx_filename = `${generic_filename}.${exportType}`;
    const csv_filename = `${generic_filename}.${exportType}`;
    const json_filename = `${generic_filename}.${exportType}`;

    if (exportType === "xlsx") {
      exportXLSX(columns, data_rows, xlsx_filename);
    } else if (exportType === "csv") {
      exportCSVReport(columns, data_rows, csv_filename);
    } else {
      exportJSON(columns, data, json_filename);
    }

    hasMoreData = data.length >= items_per_page;
    page++;
  }
};

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
