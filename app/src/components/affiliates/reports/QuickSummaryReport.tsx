import { DateRangeSelect, useDateRange } from "@/components/ui/date-range";
import { Pagination } from "@/components/ui/pagination";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";
import { QuerySelect } from "../../../components/common/QuerySelect";
import { ReportDataTable } from "../../../components/common/data-table/ReportDataTable";
import type { QuickReportSummary } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { Loading } from "../../common/Loading";
import { Button } from "../../ui/button";

import { ExportButton } from "@/components/affiliates/reports/export-button";
import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { Calendar, Download, Settings } from "lucide-react";

const fields = [
  "Impressions",
  "Clicks",
  "Install",
  "Leads",
  "Demo",
  "Real Account",
  "FTD",
  "Withdrawal",
  "ChargeBack",
  "Active Trader",
  "Commission",
];
export interface ItemProps {
  id?: ExportType;
  title?: string;
}

export const QuickSummaryReport = () => {
  const router = useRouter();
  const { merchant_id, display } = router.query;
  const [reportFields, setReportFields] = useState<
    { id: number; title: string; value: string; isChecked: boolean }[]
  >([]);
  const [selectedValue, setSelectedItem] = useState<ItemProps>({});
  const { from, to } = useDateRange();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { currentPage, itemsPerPage } = router.query;

  const { data, isLoading } = api.affiliates.getQuickReportSummary.useQuery({
    from: new Date("2022-01-03"),
    to: new Date("2023-01-03"),
    display: display ? String(display) : undefined,
    pageNumber: currentPage ? Number(currentPage) : 1,
    pageSize: itemsPerPage ? Number(itemsPerPage) : 10,
  });

  const { mutateAsync: reportExport } =
    api.affiliates.exportQuickSummaryReport.useMutation();

  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<QuickReportSummary>();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      from: new Date("2022-01-03"),
      to: new Date("2023-01-03"),
      display: display ? String(display) : undefined,
      exportType,
    });

  // console.log("QuickSummaryReport render", {
  //   data,
  //   merchants,
  //   isLoading,
  //   from,
  //   to,
  //   display,
  //   merchant_id,
  // });

  if (isLoading) {
    return <Loading />;
  }

  const divCol = (
    val: number | null | undefined,
    div: number | null | undefined
  ) => {
    return val && div ? (
      <span>{((val / div) * 100).toFixed(2)}%</span>
    ) : (
      <span>N/A</span>
    );
  };

  const columns = [
    columnHelper.accessor("merchant_id", {
      cell: (info) => info.getValue(),
      header: "Merchant",
    }),
    columnHelper.accessor("Impressions", {
      cell: (info) => info.getValue(),
      header: "Impressions",
    }),
    columnHelper.accessor("Clicks", {
      cell: (info) => info.getValue(),
      header: "Clicks",
    }),
    columnHelper.accessor("Install", {
      cell: (info) => info.getValue(),
      header: "Installation",
      // meta: {
      //   isNumeric: true,
      // },
    }),
    columnHelper.accessor("Leads", {
      cell: (info) => info.getValue(),
      header: "Leads",
    }),
    columnHelper.accessor("Demo", {
      cell: (info) => info.getValue(),
      header: "Demo",
    }),
    columnHelper.accessor("RealAccount", {
      cell: (info) => info.getValue(),
      header: "Accounts",
    }),
    columnHelper.accessor("FTD", {
      cell: (info) => info.getValue(),
      header: "FTD",
    }),
    columnHelper.accessor("Withdrawal", {
      cell: (info) => info.getValue(),
      header: "Withdrawal Amount",
    }),
    columnHelper.accessor("ChargeBack", {
      cell: (info) => info.getValue(),
      header: "ChargeBack Amount",
    }),
    columnHelper.accessor("ActiveTrader", {
      cell: (info) => info.getValue(),
      header: "Active Traders",
    }),
    columnHelper.accessor("Commission", {
      cell: ({ row }) => {
        // console.log("row ---->", row);
        return <span>{row?.original?.Commission?.toFixed(2)}</span>;
      },
      header: "Commission",
    }),
    columnHelper.accessor("click-through-ratio" as any, {
      cell: ({ row }) =>
        divCol(row?.original?.Clicks, row.original.Impressions),
      header: "Click Through Ratio(CTR)",
    }),
    columnHelper.accessor("click-to-account" as any, {
      cell: ({ row }) =>
        divCol(row?.original?.RealAccount, row.original.Clicks),
      header: "Click to Account",
    }),
    columnHelper.accessor("click-to-sale" as any, {
      cell: ({ row }) => divCol(row?.original?.FTD, row.original.Clicks),
      header: "Click to Sale",
    }),

    columnHelper.accessor("Volume", {
      cell: (info) => info.getValue(),
      header: "Volume",
    }),
  ];

  const displayOptions = [
    {
      id: "monthly",
      title: "monthly",
    },
    {
      id: "weekly",
      title: "weekly",
    },
    {
      id: "daily",
      title: "daily",
    },
  ];

  let totalImpressions = 0;
  let totalClicks = 0;
  let totalCPIM = 0;
  let totalLeadsAccounts = 0;
  let totalDemoAccounts = 0;
  let totalRealAccounts = 0;
  let totalFTD = 0;
  let totalFTDAmount = 0;
  let totalRealFtd = 0;
  let totalRealFtdAmount = 0;
  let totalDeposits = 0;
  let totalDepositAmount = 0;
  let totalVolume = 0;
  let totalBonus = 0;
  let totalWithdrawal = 0;
  let totalChargeback = 0;
  let totalNetRevenue = 0;
  let totalFooterPNL = 0;
  let totalActiveTraders = 0;
  let totalComs = 0;

  data?.forEach((row: any) => {
    totalImpressions += row?.Impressions;
    totalClicks += Number(row?.Clicks);
    totalCPIM += Number(row?.Install);
    totalLeadsAccounts += Number(row?.Leads);
    totalDemoAccounts += Number(row?.Demo);
    totalRealAccounts += Number(row?.RealAccount);
    totalFTD += Number(row?.FTD);
    totalFTDAmount += Number(row?.FTDAmount);
    totalRealFtd += Number(row?.RawFTD);
    totalRealFtdAmount += Number(row?.RawFTDAmount);
    totalDeposits += Number(row?.Deposits);
    totalDepositAmount += Number(row?.DepositsAmount);
    totalVolume += Number(row?.Volume);
    totalBonus += Number(row?.Bonus);
    totalWithdrawal += Number(row?.Withdrawal);
    totalChargeback += Number(row?.ChargeBack);
    totalNetRevenue += Number(row?.NetDeposit);
    totalFooterPNL += Number(row?.PNL);
    totalActiveTraders += Number(row?.ActiveTrader);
    totalComs += row?.Commission;
  });

  const totalObj = [];
  totalObj.push({
    totalImpressions,
    totalClicks,
    totalCPIM,
    totalCTR: `${((totalClicks / totalImpressions) * 100).toFixed(2)}%`,
    totalCTA: `${((totalRealAccounts / totalClicks) * 100).toFixed(2)}%`,
    totalCTS: `${((totalFTD / totalClicks) * 100).toFixed(2)}%`,
    totalLeadsAccounts,
    totalDemoAccounts,
    totalRealAccounts,
    totalFTD,
    totalVolume,
    totalWithdrawal,
    totalChargeback,
    totalActiveTraders,
    totalComs,
  });

  // console.log("link ----->", link);
  return (
    <>
      <div className="w-full pt-3.5">
        <div className="block text-base font-medium md:justify-between lg:flex">
          <div className="mb-2.5 flex items-center justify-between md:mb-5 lg:mb-5 ">
            <div>
              <span className="text-[#2262C6]">Affliate Program</span>
              &nbsp;/&nbsp;Quick Summary Report
            </div>
            <Button className="lg:hidden">
              <Calendar className="h-6 w-6" />
            </Button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <div className="flex">
              <Button variant="primary-outline">
                <Settings className="h-4 w-4" />
              </Button>
              <span className="font-sm ml-3 hidden items-center justify-between font-medium lg:flex">
                Report Display
              </span>
            </div>
            <div className="hidden lg:block">
              <DateRangeSelect />
            </div>
            <div className="flex space-x-2 lg:hidden">
              <Button variant="primary">Show Reports</Button>
              <Button variant="primary-outline">Reset Search</Button>
              <Button>
                <Download className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-2 items-center justify-between lg:flex">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <QuerySelect
              label="Merchant"
              choices={merchants}
              varName="merchant_id"
            />
            <QuerySelect
              label="Search Type"
              choices={displayOptions}
              varName="display"
            />
          </div>
          <div className="flex space-x-2">
            <button className="hidden rounded-md bg-[#2262C6] px-8 py-2 text-white lg:block">
              Show Reports
            </button>
            <button className="hidden rounded-md border border-[#2262C6] px-8 py-2 text-base font-semibold text-[#2262C6] lg:block">
              Reset Search
            </button>
            <ExportButton onExport={handleExport} />
          </div>
        </div>

        <div className="mb-5 mt-4 w-full rounded bg-white px-2 py-4 shadow-sm">
          <ReportDataTable
            data={data}
            columns={columns}
            // reportFields={reportFields}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Pagination count={5} variant="focus" totalItems={100} />
        </div>
      </div>
    </>
  );
};
