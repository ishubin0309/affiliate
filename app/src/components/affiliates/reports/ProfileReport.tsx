import { usePagination } from "@/components/common/data-table/pagination-hook";
import {
  getNumberParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import { createColumnHelper } from "@tanstack/react-table";
import type { ProfileReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";

export const ProfileReport = () => {
  const {
    values: { dates, merchant_id, trader_id, banner_id, search_type },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);

  const { data, isRefetching } = api.affiliates.getProfileReportData.useQuery({
    ...dateRange,
    merchant_id: getNumberParam(merchant_id),
    search_type: search_type,
    pageParams: pagination.pageParams,
  });
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<ProfileReportType>();

  const createColumn = (id: keyof ProfileReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
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

  const divCol = (
    val: number | null | undefined,
    div: number | null | undefined
  ) => {
    return val && div ? (
      <span>{((val / div) * 100).toFixed(2)}%</span>
    ) : (
      <span>0%</span>
    );
  };

  const columns = [
    createColumn("id", "Profile ID"),
    createColumn("name", "Profile Name"),
    createColumn("url", "Profile URL"),
    createColumn("views", "Impressions"),
    createColumn("clicks", "Clicks"),
    createColumn("totalCPI", "Installations"),
    columnHelper.accessor("CTR" as any, {
      cell: ({ row }) => {
        return divCol(row?.original?.clicks, row?.original?.views);
      },
      header: "Click Through Ratio (CTR)",
    }),
    columnHelper.accessor("click-to-account" as any, {
      cell: ({ row }) =>
        divCol(row?.original?.totalReal, row?.original?.clicks),
      header: "Click to Account",
    }),
    columnHelper.accessor("click-to-sale" as any, {
      cell: ({ row }) => divCol(row?.original?.ftd, row?.original?.clicks),
      header: "Click to Sale",
    }),
    columnHelper.accessor("epc" as any, {
      cell: ({ row }) => divCol(row?.original?.totalCom, row?.original?.clicks),
      header: "EPC",
    }),
    createColumn("totalLeads", "Lead"),
    createColumn("totalDemo", "Demo"),
    createColumn("totalReal", "Accounts"),
    createColumn("ftd", "FTD"),
    createColumn("withdrawal", "Withdrawal Amount"),
    createColumn("chargeback", "ChargeBack Amount"),
    createColumn("volume", "Volume"),
    createColumn("totalPNL", "Group"),
  ];

  const searchType = [
    {
      id: "daily",
      title: "Daily",
    },
    {
      id: "weekly",
      title: "Weekly",
    },
    {
      id: "monthly",
      title: "Monthly",
    },
  ];

  // let totalImpressions = 0;
  // let totalClicks = 0;
  // let totalCPIM = 0;
  // let totalLeadsAccounts = 0;
  // let totalDemoAccounts = 0;
  // let totalRealAccounts = 0;
  // let totalFTD = 0;
  // let totalVolume = 0;
  // const totalBonus = 0;
  // let totalWithdrawal = 0;
  // let totalChargeback = 0;
  // const totalNetRevenue = 0;
  // const totalFooterPNL = 0;
  // const totalActiveTraders = 0;
  // let totalComs = 0;
  // let group = 0;

  // data?.forEach((row: any) => {
  //   totalImpressions += row?.views ? Number(row?.views) : 0;
  //   totalClicks += row?.views ? Number(row?.clicks) : 0;
  //   totalCPIM += row?.views ? Number(row?.totalCPI) : 0;
  //   totalLeadsAccounts += Number(row?.totalLeads);
  //   totalDemoAccounts += Number(row?.totalDemo);
  //   totalRealAccounts += Number(row?.totalReal);
  //   totalFTD += Number(row?.ftd);
  //   totalVolume += Number(row?.volume);
  //   totalWithdrawal += Number(row?.withdrawal);
  //   totalChargeback += Number(row?.chargeback);
  //   totalComs += row?.totalCom;
  //   group += row.totalPNL;
  // });

  // const totalObj = [];
  // totalObj.push({
  //   id: "",
  //   name: "",
  //   totalImpressions,
  //   totalClicks,
  //   totalCPIM,
  //   totalCTR:
  //     totalImpressions > 0
  //       ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%`
  //       : "0%",
  //   totalCTA: totalClicks
  //     ? `${((totalRealAccounts / totalClicks) * 100).toFixed(2)}%`
  //     : "0%",
  //   totalCTS: totalClicks
  //     ? `${((totalFTD / totalClicks) * 100).toFixed(2)}%`
  //     : "0%",
  //   totalComission: totalClicks
  //     ? `${((totalComs / totalClicks) * 100).toFixed(2)}%`
  //     : "0%",
  //   totalLeadsAccounts,
  //   totalDemoAccounts,
  //   totalRealAccounts,
  //   totalFTD,
  //   totalWithdrawal,
  //   totalChargeback,
  //   totalVolume,
  //   group,
  // });

  const handleExport = async (exportType: ExportType) => {
    return null;
  };

  return (
    <ReportControl
      reportName="Profile Report"
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

      <SearchText varName="trader_id" label="Trader ID" />
    </ReportControl>
  );
};
