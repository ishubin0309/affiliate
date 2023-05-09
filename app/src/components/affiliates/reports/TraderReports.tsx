import { useDateRange } from "@/components/ui/date-range";
import { createColumnHelper } from "@tanstack/react-table";
import { Calendar } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { ReportDataTable } from "../../../components/common/data-table/ReportDataTable";
import type { TraderReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { Loading } from "../../common/Loading";
import { Button } from "../../ui/button";

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
  const { merchant_id } = router.query;
  const { from, to } = useDateRange();
  const [traderID, setTraderID] = useState<string>("");
  const [reportFields, setReportFields] = useState<
    { id: number; title: string; value: string; isChecked: boolean }[]
  >([]);
  const { currentPage, itemsPerPage } = router.query;

  const { data, isLoading } = api.affiliates.getTraderReport.useQuery({
    from,
    to,
    merchant_id: merchant_id ? Number(merchant_id) : undefined,
    trader_id: traderID,
    pageParams: {
      // TODO
      pageSize: itemsPerPage ? Number(itemsPerPage) : 10,
      pageNumber: currentPage ? Number(currentPage) : 1,
    },
  });
  const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  const columnHelper = createColumnHelper<TraderReportType>();

  console.log("trader render", {
    data,
    merchants,
    isLoading,
    from,
    to,
    merchant_id,
  });

  if (isLoading) {
    return <Loading />;
  }

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

  let totalVolume = 0;
  let totalLots = 0;
  let totalWithdrawal = 0;
  let totalChargeback = 0;

  data?.data?.forEach((row: any) => {
    totalVolume += Number(row?.Volume);
    totalLots += Number(row?.totalLots);
    totalWithdrawal += Number(row?.WithdrawalAmount);
    totalChargeback += Number(row?.ChargeBackAmount);
  });

  const totalObj = [];
  totalObj.push({
    TraderID: "",
    sub_trader_count: "",
    RegistrationDate: "",
    TraderStatus: "",
    Country: "",
    affiliate_id: "",
    AffiliateUsername: "",
    merchant_id: "",
    MerchantName: "",
    CreativeID: "",
    CreativeName: "",
    Type: "",
    CreativeLanguage: "",
    ProfileID: "",
    ProfileName: "",
    Param: "",
    Param2: "",
    Param3: "",
    Param4: "",
    Param5: "",
    totalVolume,
    totalWithdrawal,
    totalChargeback,
    totalLots,
    SaleStatus: "",
  });
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

        <div className="mb-5 mt-4 w-full rounded bg-white px-2 py-4 shadow-sm">
          {/* @ts-ignore */}
          <ReportDataTable
            report={data}
            columns={columns}
            // reportFields={reportFields}
          />
        </div>
      </div>
    </>
  );
};
