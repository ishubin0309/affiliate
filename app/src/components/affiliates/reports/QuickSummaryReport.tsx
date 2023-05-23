import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";
import type { QuickReportSummary } from "../../../server/db-types";
import { api } from "../../../utils/api";

import { usePagination } from "@/components/common/data-table/pagination-hook";
import { useSearchContext } from "@/components/common/search/search-context";
import { getDateRange } from "@/components/common/search/search-date-range";
import { SearchSelect } from "@/components/common/search/search-select";
import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

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
  const pagination = usePagination();
  const {
    values: { display, dates },
  } = useSearchContext();
  const [reportFields, setReportFields] = useState<
    { id: number; title: string; value: string; isChecked: boolean }[]
  >([]);
  const [selectedValue, setSelectedItem] = useState<ItemProps>({});
  const { name, ...dateRange } = getDateRange(dates);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { currentPage, itemsPerPage } = router.query;

  const { data, isRefetching } = api.affiliates.getQuickReportSummary.useQuery({
    ...dateRange,
    display: display ? String(display) : undefined,
    pageParams: {
      pageNumber: currentPage ? Number(currentPage) : 1,
      pageSize: itemsPerPage ? Number(itemsPerPage) : 10,
    },
  });

  const { mutateAsync: reportExport } =
    api.affiliates.exportQuickSummaryReport.useMutation();

  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<QuickReportSummary>();

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

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      display: display ? String(display) : undefined,
      exportType,
      reportColumns: getColumns(columns),
    });

  console.log("QuickSummaryReport render", {
    data,
    merchants,
    isRefetching,
  });

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

  return (
    <ReportControl
      reportName="Quick Summary Report"
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
        label="Search Type"
        choices={displayOptions}
        varName="display"
      />
    </ReportControl>
  );
};
