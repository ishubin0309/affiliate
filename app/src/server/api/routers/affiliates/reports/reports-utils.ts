import { z } from "zod";

// Common params for all reports
export const pageParams = {
  page: z.number().int().optional(),
  items_per_page: z.number().int().optional(),
};

// Common params for all reports export
export const reportParams = {
  exportType: z.enum(["csv", "xlsx", "json"]).optional(),
};

// Generic function to export data in csv, xlsx, json format
// Can be used for all reports
export const exportReportLoop = async (
  exportType: "csv" | "xlsx" | "json",
  columns: unknown[], // TODO: define better type, see what is needed for export
  getPage: (page: number) => Promise<any[]>
) => {
  let page = 0;
  let hasMoreData = true;
  while (hasMoreData) {
    const data = await getPage(page);

    // TODO: write data to to csv, xlsx, json based on exportType

    hasMoreData = !!data?.length;
    page++;
  }
};
