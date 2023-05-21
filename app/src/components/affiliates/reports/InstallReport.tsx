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
import type { InstallReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";

export const InstallReport = () => {
  const router = useRouter();
  const {
    values: { dates, country, trader_id, banner_id },
  } = useSearchContext();
  const pagination = usePagination();
  const { currentPage, itemsPerPage } = router.query;
  const { name, ...dateRange } = getDateRange(dates);

  const { data, isRefetching } = api.affiliates.getInstallReport.useQuery({
    ...dateRange,
    country: country,
    trader_id: getNumberParam(trader_id),
    banner_id: banner_id,
    pageParams: pagination.pageParams,
  });
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const { data: countries } = api.affiliates.getLongCountries.useQuery({});
  const columnHelper = createColumnHelper<InstallReportType>();

  console.log("Install render", {
    data,
    merchants,
    isRefetching,
  });

  const type_options = [
    {
      id: "install",
      title: "Install",
    },
    {
      id: "uninstall",
      title: "Uninstall",
    },
  ];
  const divCol = (
    val: number | null | undefined,
    div: number | null | undefined
  ) => {
    return val ? (
      <span>{((val / (div || 1)) * 100).toFixed(2)}%</span>
    ) : (
      <span></span>
    );
  };

  console.log("countries ----->", countries);

  const columns = [
    columnHelper.accessor("type", {
      cell: (info) => info.getValue() as string,
      header: "Event Type",
    }),
    columnHelper.accessor("rdate", {
      cell: (info) => info.getValue() as Date,
      header: "Event Date",
    }),
    columnHelper.accessor("trader_id", {
      cell: (info) => info.getValue() as number,
      header: "Trader ID",
    }),
    columnHelper.accessor("trader_alias", {
      cell: (info) => info.getValue() as string,
      header: "Trader Alias",
    }),
    columnHelper.accessor("type", {
      cell: (info) => info.getValue() as string,
      header: "Trader Status",
    }),
    columnHelper.accessor("country", {
      cell: (info) => info.getValue() as string,
      header: "Country",
    }),
    columnHelper.accessor("affiliate_id", {
      cell: (info) => info.getValue() as number,
      header: "Affiliate ID",
    }),
    columnHelper.accessor("username", {
      cell: (info) => info.getValue() as string,
      header: "Affiliate Username",
    }),
    columnHelper.accessor("merchant_id", {
      cell: (info) => info.getValue() as number,
      header: "Merchant ID",
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue() as string,
      header: "Merchant Name",
    }),
    columnHelper.accessor("id", {
      cell: (info) => info.getValue() as number,
      header: "Creative ID",
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue() as string,
      header: "Creative Name",
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
      reportName="Install Report"
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
      <SearchText varName="trader_id" label="Trader ID" />
      <SearchText varName="banner_id" label="Banner ID" />
      <SearchText varName="parameter" label="Parameter" />
      <SearchText varName="parameter2" label="Parameter 2" />
      <SearchSelect label="Type" choices={type_options} varName="type" />
    </ReportControl>
  );
};
