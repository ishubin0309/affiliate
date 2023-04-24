import { fakeTraderReportData } from "@/components/affiliates/reports/fake-trader-report-data";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import type { TraderReportType } from "../../../server/db-types";
import { ReportControl } from "@/components/affiliates/reports/report-control";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { creativeType } from "@/components/affiliates/reports/TraderReports";
import { api } from "@/utils/api";
import { ClicksReportType, CountryReportType } from "../../../server/db-types";
import { useSearchContext } from "@/components/common/search/search-context";
import { sub } from "date-fns";

const columnHelper = createColumnHelper<CountryReportType>();
const createColumn = (id: keyof CountryReportType, header: string) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
  });

const columns = [
  createColumn("country", "Country"),
  createColumn("views", "Views"),
  createColumn("clicks", "Clicks"),
  createColumn("cpi", "CPI"),
  createColumn("merchant", "Merchant"),
  createColumn("volume", "Volume"),
  createColumn("withdrawal", "Withdrawal"),
  createColumn("leads", "Leads"),
  createColumn("demo", "Demo"),
  createColumn("real", "Real"),
  createColumn("depositingAccounts", "Depositing Accounts"),
  createColumn("real_ftd", "Real FTD"),
  createColumn("ftd", "FTD"),
  createColumn("ftd_amount", "FTD Amount"),
  createColumn("sumDeposits", "Sum Deposits"),
  createColumn("bonus", "Bonus"),
  createColumn("chargeback", "Chargeback"),
  createColumn("netRevenue", "Net Revenue"),
  createColumn("pnl", "PnL"),
  createColumn("totalCom", "Total Commission"),
  createColumn("Qftd", "QFTD"),
];

export const CountryReports = () => {
  const {
    values: { merchant_id, from, to },
  } = useSearchContext();

  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const { data, isLoading } = api.affiliates.getCountryReport.useQuery({
    from: new Date(from || sub(new Date(), { months: 6 })),
    to: new Date(to || new Date()),
    merchant_id: merchant_id ? Number(merchant_id) : undefined,
  });

  return (
    <ReportControl
      reportName="Country Report"
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
    </ReportControl>
  );
};
