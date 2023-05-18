import { usePagination } from "@/components/common/data-table/pagination-hook";
import {
  getNumberParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import type { PixelLogsReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";

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
    columnHelper.accessor("plid" as any, {
      cell: (info) => info.getValue() as number,
      header: "Pixel Fire ID",
    }),
    columnHelper.accessor("dateTime", {
      cell: (info) => info.getValue(),
      header: "Date",
    }),
    columnHelper.accessor("type" as any, {
      cell: (info) => info.getValue() as string,
      header: "Type",
    }),
    columnHelper.accessor("method" as any, {
      cell: (info) => info.getValue() as string,
      header: "Method",
    }),
    columnHelper.accessor("firedUrl", {
      cell: (info) => info.getValue(),
      header: "Fired URL",
    }),
    columnHelper.accessor("pixelResponse", {
      cell: (info) => info.getValue(),
      header: "Response",
    }),
    columnHelper.accessor("totalFired" as any, {
      cell: (info) => info.getValue() as number,
      header: "All Time Fired",
    }),
    columnHelper.accessor("pixel-state" as any, {
      cell: ({ row }) => divCol(row?.original?.pixel_monitor?.affiliate?.valid),
      header: "Pixel State",
    }),
    columnHelper.accessor("pixel_monitor.affiliate.id", {
      cell: (info) => info.getValue(),
      header: "Affiliate ID",
    }),
    columnHelper.accessor("pixel_monitor.affiliate.username", {
      cell: (info) => info.getValue(),
      header: "Affiliate Username",
    }),
    columnHelper.accessor("pixel_monitor.merchant.id", {
      cell: (info) => info.getValue(),
      header: "Merchant ID",
    }),
    columnHelper.accessor("pixel_monitor.merchant", {
      cell: (info) => info.getValue(),
      header: "Merchant",
    }),
    columnHelper.accessor("product_id", {
      cell: (info) => info.getValue(),
      header: "Product ID",
    }),
    columnHelper.accessor("banner_id" as any, {
      cell: (info) => info.getValue() as number,
      header: "Banner ID",
    }),
    columnHelper.accessor("group_id" as any, {
      cell: (info) => info.getValue() as number,
      header: "Group ID",
    }),
  ];

  const country_options = countries?.map((country: any) => {
    return {
      id: country.id,
      title: country.title,
    };
  });

  const handleExport = async (exportType: ExportType) => {
    return null;
  };

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
