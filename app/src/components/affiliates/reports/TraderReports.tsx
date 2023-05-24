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
import { useState } from "react";
import type { TraderReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { ReportControl } from "./report-control";
import { getColumns } from "./utils";

export const creativeType = [
  {
    id: "",
    title: "All",
  },
  {
    id: "image",
    title: "Image",
  },
  {
    id: "mobileleader",
    title: "Mobile Leader",
  },
  {
    id: "mobilesplash",
    title: "Mobile Splash",
  },
  {
    id: "flash",
    title: "Flash",
  },
  {
    id: "widget",
    title: "Widget",
  },
  {
    id: "link",
    title: "Text Link",
  },
  {
    id: "mail",
    title: "Email",
  },
  {
    id: "coupon",
    title: "Coupon",
  },
];

export const TraderReports = () => {
  const router = useRouter();
  const {
    values: { merchant_id, dates, trader_id, banner_id, country },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);
  const [reportFields, setReportFields] = useState<
    { id: number; title: string; value: string; isChecked: boolean }[]
  >([]);

  const { data, isRefetching } = api.affiliates.getTraderReport.useQuery({
    ...dateRange,
    merchant_id: getNumberParam(merchant_id),
    trader_id: trader_id,
    country: country,
    banner_id: banner_id,
    pageParams: pagination.pageParams,
  });

  const { mutateAsync: reportExport } =
    api.affiliates.exportTraderReport.useMutation();

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      ...dateRange,
      merchant_id: getNumberParam(merchant_id),
      trader_id: trader_id,
      country: country,
      banner_id: banner_id,
      exportType,
      pageParams: pagination.pageParams,
      reportColumns: getColumns(columns),
    });
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const { data: countries } = api.affiliates.getLongCountries.useQuery({});
  const columnHelper = createColumnHelper<TraderReportType>();
  const country_options = countries?.map((country: any) => {
    return {
      id: country.id,
      title: country.title,
    };
  });

  console.log("trader render", {
    data,
    merchants,
    isRefetching,
    merchant_id,
  });

  const createColumn = (id: keyof TraderReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue() as string,
      header,
    });

  // TODO: no match between columns here and what display on screen
  const columns = [
    createColumn("TraderID", "Trader ID"),
    // createColumn("sub_trader_count", "Trader Sub Accounts"),
    createColumn("RegistrationDate", "Registration Date"),
    createColumn("TraderStatus", "Trader Status"),
    createColumn("Country", "Country"),
    createColumn("affiliate_id", "Affiliate ID"),
    createColumn("AffiliateUsername", "Affiliate Username"),
    createColumn("merchant_id", "Merchant ID"),
    createColumn("MerchantName", "Merchant Name"),
    createColumn("CreativeID", "Creative ID"),
    createColumn("CreativeName", "Creative Name"),
    createColumn("Type", "Type"),
    createColumn("CreativeLanguage", "Creative Language"),
    createColumn("ProfileID", "Profile ID"),
    createColumn("ProfileName", "Profile Name"),
    createColumn("Param", "Param"),
    createColumn("Param2", "Param2"),
    createColumn("Param3", "Param3"),
    createColumn("Param4", "Param4"),
    createColumn("Param5", "Param5"),
    createColumn("FirstDeposit", "First Deposit"),
    createColumn("Volume", "Volume"),
    createColumn("WithdrawalAmount", "Withdrawal Amount"),
    createColumn("ChargeBackAmount", "ChargeBack Amount"),
    // createColumn("totalLots", "Lots"),
    createColumn("SaleStatus", "Sale Status"),
  ];

  return (
    <ReportControl
      reportName="Users Report"
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
      <SearchText varName="banner_id" label="Banner ID" />

      <SearchSelect label="Filter" choices={creativeType} varName="filter" />
    </ReportControl>
  );
};
