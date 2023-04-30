import { QuerySelect } from "@/components/common/QuerySelect";
import { Pagination } from "@/components/ui/pagination";
import { type ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Calendar, Download, Settings } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { ReportDataTable } from "../../../components/common/data-table/ReportDataTable";
import type { TraderReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { DateRangeSelect, useDateRange } from "../../common/DateRangeSelect";
import { Loading } from "../../common/Loading";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { ExportButton } from "./export-button";

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

  const { mutateAsync: reportExport } =
    api.affiliates.exportTraderReport.useMutation();

  const { data, isLoading } = api.affiliates.getTraderReport.useQuery({
    from,
    to,
    pageSize: itemsPerPage ? Number(itemsPerPage) : 10,
    pageNumber: currentPage ? Number(currentPage) : 1,
    merchant_id: merchant_id ? Number(merchant_id) : undefined,
    trader_id: traderID,
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
    createColumn("sub_trader_count", "Trader Sub Accounts"),
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
    createColumn("totalLots", "Lots"),
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

  const handleSelectAll = async () => {
    const value = reportFields.map((item) => {
      const temp = Object.assign({}, item);
      temp.isChecked = true;
      return temp;
    });
    setReportFields(value);
    const hiddenCols = value.filter((item) => item.isChecked === false);
    const remove_fields = hiddenCols
      .map((item) => {
        return item.value;
      })
      .join("|");
    // await upsertReportsField.mutateAsync({
    //   remove_fields,
    // });
  };

  const handleUnSelectAll = async () => {
    const value = reportFields.map((item) => {
      const temp = Object.assign({}, item);
      temp.isChecked = false;
      return temp;
    });
    setReportFields(value);
    const hiddenCols = value.filter((item) => item.isChecked === false);
    const remove_fields = hiddenCols
      .map((item) => {
        return item.value;
      })
      .join("|");
    // await upsertReportsField.mutateAsync({
    //   remove_fields,
    // });
  };

  const handleExport = async (exportType: ExportType) =>
    reportExport({
      from: new Date("2022-01-03"),
      to: new Date("2023-01-03"),
      exportType,
    });

  const handleReportField = (event: any) => {
    void event;
  };

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
        <Dialog>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex">
                <DialogTrigger>
                  <Button variant="primary-outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
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
              <ExportButton
                report_name="trader-report"
                onExport={handleExport}
              />
            </div>
          </div>

          <DialogContent>
            <DialogHeader className="text-left text-sm font-medium text-primary">
              Manage Field On Report - Quick Summary
            </DialogHeader>
            <DialogTitle className="text-disabled text-sm font-normal md:mb-6 md:pt-2">
              Please activate the fields you want to display on the report:
            </DialogTitle>
            <div className="grid grid-cols-1 md:mt-10 md:grid-cols-2">
              {reportFields.map((field) => {
                return (
                  <div key={field.id}>
                    <div className="mb-6 flex items-center md:mb-10">
                      <input
                        type="checkbox"
                        id={`report-field-${field.id}`}
                        checked={field.isChecked}
                        value={field.id}
                        onChange={(e) => void handleReportField(e)}
                        className="form-checkbox text-blueGray-700 h-4 w-4 rounded border-0 transition-all duration-150 ease-linear"
                      />
                      <div className="ml-5 items-center text-lg font-medium text-black md:ml-10">
                        {field.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between pb-5 font-medium md:pb-8 md:pt-12">
              <div className="flex">
                <button
                  className="mr-3 rounded-md bg-[#2262C6] p-3 text-white md:px-14"
                  onClick={handleSelectAll}
                >
                  Select All
                </button>
                <button
                  className="rounded-md border border-[#1B48BB] bg-[#EFEEFF] p-3 text-[#1B48BB] md:px-12"
                  onClick={handleUnSelectAll}
                >
                  Unselect All
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mb-5 mt-4 w-full rounded bg-white px-2 py-4 shadow-sm">
          {data?.data?.length > 0 ? (
            <ReportDataTable
              data={data?.data}
              columns={columns}
              // reportFields={reportFields}
            />
          ) : (
            <div className="flex justify-between pb-5 font-medium md:pb-8 md:pt-12">
              <div className="text-center">No Data</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Pagination count={5} variant="focus" totalItems={100} />
        </div>
      </div>
    </>
  );
};
