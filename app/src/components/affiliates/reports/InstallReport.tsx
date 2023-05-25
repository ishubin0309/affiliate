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
import { getColumns } from "./utils";

const columnHelper = createColumnHelper<ProfileReportType>();

const createColumn = (id: keyof ProfileReportType, header: string) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
  });

const columns = [
  createColumn("type", "Event Type"),
  createColumn("rdate", "Event Date"),
  createColumn("trader_id", "Trader ID"),
  createColumn("trader_alias", "Trader Alias"),
  createColumn("type", "Trader Status"),
  createColumn("country", "Country"),
  createColumn("affiliate_id", "Affiliate ID"),
  createColumn("username", "Affiliate Username"),
  createColumn("merchant_id", "Merchant ID"),
  createColumn("name", "Merchant Name"),
  createColumn("id", "Creative ID"),
  createColumn("title", "Creative Name"),
];

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

  const country_options = countries?.map((country: any) => {
    return {
      id: country.id,
      title: country.title,
    };
  });
  const { mutateAsync: reportExport } =
    api.affiliates.exportInstallReport.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      country: country,
      trader_id: getNumberParam(trader_id),
      banner_id: banner_id,
      pageParams: pagination.pageParams,
      exportType,
      reportColumns: getColumns(columns),
    });

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
