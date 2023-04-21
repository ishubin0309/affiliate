import type { CommissionReportType } from "@/server/db-types";
import { z } from "zod";
import { exportCSVReport } from "../config/exportCSV";
import { exportJSON } from "../config/exportJson";
import { exportXLSX } from "../config/exportXLSX";

// Common params for all reports
export const pageParams = {
  page: z.number().int().optional(),
  items_per_page: z.number().int().optional(),
};

// Common params for all reports export
export const reportParams = {
  exportType: z.enum(["csv", "xlsx", "json"]).optional(),
};

export type ExportType = z.infer<typeof reportParams.exportType>;

// Generic function to export data in csv, xlsx, json format
// Can be used for all reports
export const exportReportLoop = async (
  exportType: ExportType,
  columns: string[], // TODO: define better type, see what is needed for export
  generic_filename: string,
  report_type: string,
  getPage: (page: number, items_per_page: number) => Promise<any[]>
) => {
  let page = 0;
  const items_per_page = 5000;
  let hasMoreData = true;
  while (hasMoreData) {
    console.log("generic file name ------->", generic_filename);
    const data = await getPage(page, items_per_page);
    // TODO: write data to to csv, xlsx, json based on exportType

    console.log("data ----->", data);
    const data_rows = filterData(data, report_type);

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

    hasMoreData = data.length > items_per_page;
    page++;
  }
};

export const filterData = (data: any[], report_type: string) => {
  const data_rows = [] as number[];
  switch (report_type) {
    case "quick-summary":
      data.map((item) => {
        data_rows.push(
          item.Impressions,
          item.Clicks,
          item.Install,
          item.Leads,
          item.Demo,
          item.RealAccount,
          item.FTD,
          item.Withdrawal,
          item.ChargeBack,
          item.ActiveTrader,
          item.Commission
        );
      });
      break;
    case "commission-report":
      data.map((item: CommissionReportType) => {
        data_rows.push(
          item?.merchant_id,
          Number(item?.traderID),
          Number(item?.transactionID),
          Number(item?.Type),
          item?.Amount,
          item?.Country || "",
          item?.Commission
        );
      });
    case "install-report":
      data.map((item) => {
        data_rows.push(
          item?.type,
          item?.rdate,
          item?.trader_id,
          item?.trader_alias,
          item?.trader_status,
          item?.country,
          item?.affiliate_id,
          item?.username,
          item?.merchant_id,
          item?.name,
          item?.id,
          item?.title
        );
      });
    default:
      data.map((item) => {
        data_rows.push(item);
      });
      break;
  }
  return data_rows;
};
