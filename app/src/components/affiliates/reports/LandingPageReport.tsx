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
import type { LandingPageReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";

export const LandingPageReport = () => {
  const router = useRouter();
  const {
    values: { merchant_id, dates, url, creative_type },
  } = useSearchContext();
  const pagination = usePagination();
  const { currentPage, itemsPerPage } = router.query;
  const { name, ...dateRange } = getDateRange(dates);

  const { data, isRefetching } = api.affiliates.getLandingPageData.useQuery({
    ...dateRange,
    merchant_id: getNumberParam(merchant_id),
    url: url,
    creative_type: creative_type,
    pageParams: pagination.pageParams,
  });
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const { data: countries } = api.affiliates.getLongCountries.useQuery({});
  const columnHelper = createColumnHelper<LandingPageReportType>();

  console.log("Landing Page render", {
    data,
    merchants,
    isRefetching,
    merchant_id,
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

  const createColumn = (id: keyof LandingPageReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
      header,
    });

  const columns = [
    createColumn("url", "URL"),
    createColumn("merchant.name", "Merchant"),
    createColumn("views", "Impressions"),
    createColumn("clicks", "Clicks"),
    createColumn("cpi", "Installation"),
    columnHelper.accessor("ctr" as any, {
      cell: ({ row }) => divCol(row?.original?.clicks, row.original.views),
      header: "Click Through Ratio (CTR)",
    }),
    columnHelper.accessor("click-to-account" as any, {
      cell: ({ row }) => divCol(row?.original?.real, row.original.clicks),
      header: "Click to Account",
    }),
    columnHelper.accessor("click-to-sale" as any, {
      cell: ({ row }) => divCol(row?.original?.ftd, row.original.clicks),
      header: "Click to Sale",
    }),
    createColumn("merchant_id", "EPC"),
    createColumn("lead", "Leads"),
    createColumn("demo", "Demo"),
    createColumn("accounts", "Accounts"),
    createColumn("ftd", "FTD"),
    createColumn("volume", "Volume"),
    createColumn("chargeback", "ChargeBack Amount"),
    createColumn("traders", "Active Traders"),
  ];

  const country_options = countries?.map((country: any) => {
    return {
      id: country.id,
      title: country.title,
    };
  });

  // let totalImpressions = 0;
  // let totalClicks = 0;
  // let totalCPIM = 0;
  // let totalLeadsAccounts = 0;
  // let totalDemoAccounts = 0;
  // let totalRealAccounts = 0;
  // let totalFTD = 0;
  // const totalFTDAmount = 0;
  // const totalRealFtd = 0;
  // const totalRealFtdAmount = 0;
  // let totalDeposits = 0;
  // let totalDepositAmount = 0;
  // let totalVolume = 0;
  // let totalBonus = 0;
  // let totalWithdrawal = 0;
  // let totalChargeback = 0;
  // let totalNetRevenue = 0;
  // let totalFooterPNL = 0;
  // let totalActiveTraders = 0;
  // let totalComs = 0;

  // const Data = data as LandingPageReportType[];
  // Data?.forEach((row: LandingPageReportType) => {
  //   totalImpressions += row?._sum?.views;
  //   totalClicks += Number(row?._sum?.clicks);
  //   totalCPIM += Number(row?.cpi);
  //   totalLeadsAccounts += Number(row?.lead ?? 0);
  //   totalDemoAccounts += Number(row?.demo ?? 0);
  //   totalRealAccounts += Number(row?.real ?? 0);
  //   totalFTD += Number(row?.ftd ?? 0);
  //   totalDeposits += Number(row?.deposit ?? 0);
  //   totalDepositAmount += Number(row?.depositsAmount ?? 0);
  //   totalVolume += Number(row?.volume ?? 0);
  //   totalBonus += Number(row?.bonus ?? 0);
  //   totalWithdrawal += Number(row?.withdrawal ?? 0);
  //   totalChargeback += Number(row?.chargeBack ?? 0);
  //   totalNetRevenue += Number(row?.netDeposit ?? 0);
  //   totalFooterPNL += Number(row?.pnl ?? 0);
  //   totalActiveTraders += Number(row?.activeTrader ?? 0);
  //   totalComs += row?.Commission ?? 0;
  // });

  // const totalObj = [];
  // totalObj.push({
  //   URL: "",
  //   totalImpressions,
  //   totalClicks,
  //   totalCPIM,
  //   totalCTR: `${((totalClicks / totalImpressions) * 100).toFixed(2)}%`,
  //   totalCTA: `${((totalRealAccounts / totalClicks) * 100).toFixed(2)}%`,
  //   totalCTS: `${((totalFTD / totalClicks) * 100).toFixed(2)}%`,
  //   totalLeadsAccounts,
  //   totalDemoAccounts,
  //   totalFTD,
  //   totalVolume,
  //   totalWithdrawal,
  //   totalChargeback,
  //   totalActiveTraders,
  //   totalComs,
  // });

  const handleExport = async (exportType: ExportType) => {
    return null;
  };

  return (
    <ReportControl
      reportName="Landing Page Report"
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
