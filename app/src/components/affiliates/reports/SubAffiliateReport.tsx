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
import type { SubAffiliateReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";

export const SubAffiliateReport = () => {
  const router = useRouter();
  const {
    values: { merchant_id, dates, trader_id, unique_id, type },
  } = useSearchContext();
  const pagination = usePagination();
  const { currentPage, itemsPerPage } = router.query;
  const { name, ...dateRange } = getDateRange(dates);

  const { data, isRefetching } = api.affiliates.getSubAffiliateReport.useQuery({
    ...dateRange,
    merchant_id: getNumberParam(merchant_id),
    user_level: "admin",
    trader_id,
    unique_id,
    pageParams: pagination.pageParams,
  });
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<SubAffiliateReportType>();

  console.log("sub affiliate render", {
    data,
    merchants,
    isRefetching,
  });

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
  const createColumn = (id: keyof SubAffiliateReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
      header,
    });

  const columns = [
    createColumn("id", "Affiliate ID"),
    createColumn("mail", "Affiliate Username"),
    createColumn("merchant_name", "Tier Level"),
    createColumn("clicks", "Clicks"),
    createColumn("totalCPI", "Installation"),
    createColumn("totalLeads", "Leads"),
    createColumn("demo", "Demo"),
    createColumn("real", "Accounts"),
    createColumn("volume", "Volume"),
    createColumn("withdrawal", "Withdrawal Amount"),
    createColumn("chargeback", "ChargeBack Amount"),
  ];
  const handleExport = async (exportType: ExportType) => {
    return null;
  };

  return (
    <ReportControl
      reportName="Clicks Report"
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
      <SearchText varName="unique_id" label="Unique ID" />
      <SearchText varName="trader_id" label="Trader ID" />
    </ReportControl>
  );
};
