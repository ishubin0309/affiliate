import { usePagination } from "@/components/common/data-table/pagination-hook";
import {
  getNumberParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import type { PixelLogsReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

export const PixelLogReports = () => {
  const router = useRouter();
  const pagination = usePagination();
  const {
    values: { merchant_id, dates, group_id, country },
  } = useSearchContext();
  const { name, ...dateRange } = getDateRange(dates);

  const { data, isRefetching } = api.affiliates.getPixelLogReport.useQuery({
    ...dateRange,
    merchant_id: getNumberParam(merchant_id),
    country: country ? String(country) : "",
    group_id: group_id ? String(group_id) : "",
    pageParams: pagination.pageParams,
  });
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const { data: countries } = api.affiliates.getLongCountries.useQuery({});
  const columnHelper = createColumnHelper<PixelLogsReportType>();
  const createColumn = (id: keyof PixelLogsReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info: { getValue: () => string }) => info.getValue(),
      header,
    });

  // console.log("Clicks render", {
  // 	data,
  // 	merchants,
  // 	isLoading,
  // 	from,
  // 	to,
  // 	merchant_id,
  // });

  const divCol = (valid: number | null | undefined) => {
    return valid === 1 ? <span>Active</span> : <span>Blocked</span>;
  };

  const columns = [
    createColumn("id", "Pixel Fire ID"),
    createColumn("dateTime", "Date"),
    createColumn("pixel_monitor.type", "Type"),
    createColumn("pixel_monitor.method", "Method"),
    createColumn("firedUrl", "Fired URL"),
    createColumn("pixelResponse", "Response"),
    createColumn("totalFired", "All Time Fired"),
    columnHelper.accessor("pixel-state" as any, {
      cell: ({ row }) => divCol(row?.original?.pixel_monitor?.affiliate?.valid),
      header: "Pixel State",
    }),
    createColumn("pixel_monitor.affiliate.id", "Affiliate ID"),
    createColumn("pixel_monitor.affiliate.username", "Affiliate Username"),
    createColumn("pixel_monitor.merchant.id", "Merchant ID"),
    createColumn("pixel_monitor.merchant", "Merchant"),
    createColumn("product_id", "Product ID"),
    createColumn("banner_id", "Banner ID"),
    createColumn("group_id", "Group ID"),
  ];

  const country_options = countries?.map((country: any) => {
    return {
      id: country.id,
      title: country.title,
    };
  });

  const { mutateAsync: reportExport } =
    api.affiliates.exportPixelLogReportData.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      country: country ? String(country) : "",
      group_id: group_id ? String(group_id) : "",
      pageParams: pagination.pageParams,
      exportType,
      reportColumns: getColumns(columns),
    });

  return (
    <ReportControl
      reportName="Pixel Log Report"
      report={data}
      columns={columns}
      pagination={pagination}
      isRefetching={isRefetching}
      handleExport={async (exportType: ExportType) => handleExport(exportType)}
    >
      <SearchSelect
        label="Merchant"
        choices={merchants}
        varName="merchant_id"
      />
      <SearchSelect
        label="Country"
        choices={country_options}
        varName="country"
      />
      <SearchText varName="unique_id" label="Unique ID" />
      <SearchText varName="trader_id" label="Trader ID" />
    </ReportControl>
  );
};
