import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import type { ClicksReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { DateRangeSelect, useDateRange } from "../../common/DateRangeSelect";
import { ReportControl } from "@/components/affiliates/reports/report-control";
import { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import {
  getDateParam,
  getNumberParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { DateColumn } from "@/components/common/data-table/available-column";

const columnHelper = createColumnHelper<ClicksReportType>();
const createColumn = (id: keyof ClicksReportType, header: string) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
  });

const columns = [
  createColumn("id", "ID"),
  createColumn("uid", "UID"),
  createColumn("views", "Impression"),
  createColumn("clicks", "Click"),
  columnHelper.accessor("rdate", {
    cell: (info) => DateColumn(info.getValue()),
    header: "Date",
  }),
  createColumn("type", "Type"),
  createColumn("merchant_name", "Merchant"),
  createColumn("banner_id", "Banner ID"),
  createColumn("profile_id", "Profile ID"),
  createColumn("profile_name", "Profile Name"),
  createColumn("param", "Param"),
  createColumn("param2", "Param 2"),
  createColumn("refer_url", "Refer URL"),
  createColumn("country", "Country"),
  createColumn("ip", "IP"),
  createColumn("platform", "Platform"),
  createColumn("os", "Operating System"),
  createColumn("osVersion", "OS Version"),
  createColumn("browser", "Browser"),
  createColumn("broswerVersion", "Browser Version"),
  createColumn("trader_id", "Trader ID"),
  createColumn("trader_name", "Trader Alias"),
  createColumn("leads", "Lead"),
  createColumn("demo", "Demo"),
  createColumn("sale_status", "Sales Status"),
  createColumn("real", "Accounts"),
  createColumn("ftd", "FTD"),
  createColumn("volume", "Volume"),
  createColumn("withdrawal", "Withdrawal Amount"),
  createColumn("chargeback", "ChargeBack Amount"),
  createColumn("Qftd", "Active Traders"),
];

const typeOptions = [
  {
    id: "clicks",
    title: "Clicks",
  },
  {
    id: "views",
    title: "Views",
  },
];

export const ClicksReport = () => {
  const {
    values: { merchant_id, from, to, trader_id, unique_id, type },
  } = useSearchContext();

  const { data, isLoading } = api.affiliates.getClicksReport.useQuery(
    {
      from: getDateParam(from),
      to: getDateParam(to),
      type: type === "all" ? undefined : type === "clicks" ? "clicks" : "views",
      merchant_id: getNumberParam(merchant_id),
      trader_id,
      unique_id,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: merchants } = api.affiliates.getAllMerchants.useQuery(
    undefined,
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  return (
    <ReportControl
      reportName="Clicks Report"
      totalItems={data?.length || 0}
      data={data}
      columns={columns}
      isRefetching={isLoading}
      handleExport={(exportType: ExportType) => Promise.resolve("ok")}
    >
      <SearchSelect
        label="Merchant"
        choices={merchants}
        varName="merchant_id"
      />
      <SearchText varName="unique_id" label="Unique ID" />
      <SearchText varName="trader_id" label="Trader ID" />
      <SearchSelect varName="type" label={"Type"} choices={typeOptions} />
    </ReportControl>
  );
};
