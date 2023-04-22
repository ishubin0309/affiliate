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

export const FakeTraderReports = () => {
  const [traderReportColumns, settraderReportColumns] = useState([
    { id: "TraderID", title: "Trader ID", isOpen: true },
    { id: "sub_trader_count", title: "Trader Sub Accounts", isOpen: true },
    { id: "RegistrationDate", title: "Registration Date", isOpen: true },
    { id: "TraderStatus", title: "Trader Status", isOpen: true },
    { id: "Country", title: "Country", isOpen: true },
    { id: "affiliate_id", title: "Affiliate ID", isOpen: true },
    { id: "AffiliateUsername", title: "Affiliate Username", isOpen: true },
    { id: "merchant_id", title: "Merchant ID", isOpen: true },
    { id: "MerchantName", title: "Merchant Name", isOpen: true },
    { id: "CreativeID", title: "Creative ID", isOpen: true },
    { id: "CreativeName", title: "Creative Name", isOpen: true },
    { id: "Type", title: "Type", isOpen: true },
    { id: "CreativeLanguage", title: "Creative Language", isOpen: true },
    { id: "ProfileID", title: "Profile ID", isOpen: true },
    { id: "ProfileName", title: "Profile Name", isOpen: true },
    { id: "Param", title: "Param", isOpen: true },
    { id: "Param2", title: "Param2", isOpen: true },
    { id: "Param3", title: "Param3", isOpen: true },
    { id: "Param4", title: "Param4", isOpen: true },
    { id: "Param5", title: "Param5", isOpen: true },
    { id: "FirstDeposit", title: "First Deposit", isOpen: true },
    { id: "Volume", title: "Volume", isOpen: true },
    { id: "WithdrawalAmount", title: "Withdrawal Amount", isOpen: true },
    { id: "ChargeBackAmount", title: "ChargeBack Amount", isOpen: true },
    { id: "totalLots", title: "Lots", isOpen: true },
    { id: "SaleStatus", title: "Sale Status", isOpen: true },
  ]);

  // TODO: Add pagination
  const pageSize = 10;
  const page = 1;

  const isLoading = false;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = fakeTraderReportData
    .slice(startIndex, endIndex)
    .map(({ Date: _date, ...item }) => ({
      Date: new Date(_date),
      ...item,
    }));

  // const { data, isLoading } = api.affiliates.getTraderReport.useQuery({
  //   from,
  //   to,
  //   limit,
  //   page,
  //   merchant_id: merchant_id ? Number(merchant_id) : undefined,
  //   trader_id: traderID,
  // });

  const merchants = [{ id: 1, title: "FXoro" }];
  const columnHelper = createColumnHelper<TraderReportType>();

  const createColumn = (id: keyof TraderReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
      header,
    });

  const columns = traderReportColumns?.map((item: any) =>
    createColumn(item.id, item.title)
  );

  let totalVolume = 0;
  let totalLots = 0;
  let totalWithdrawal = 0;
  let totalChargeback = 0;

  data?.forEach((row: any) => {
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

  return (
    <ReportControl
      reportName="Fake Trader Report (Debug)"
      totalItems={data.length}
      data={data}
      columns={columns}
      footerData={totalObj}
      isRefetching={isLoading}
      handleExport={(exportType: ExportType) => Promise.resolve("ok")}
    >
      <SearchSelect
        label="Merchant"
        choices={merchants}
        varName="merchant_id"
      />
      <SearchSelect
        label="Creative Type"
        choices={creativeType}
        varName="creative_type"
      />
      <SearchText varName="trader_id" label="Trader ID" />
    </ReportControl>
  );

  // return (
  //   <>
  //     <div className="grid grid grid-cols-5 gap-2">
  //       <DateRangeSelect />
  //       <div>
  //         <QuerySelect
  //           label="Merchant"
  //           choices={merchants}
  //           varName="merchant_id"
  //         />
  //       </div>
  //       <div>
  //         <QuerySelect
  //           label="Creative Type"
  //           choices={creativeType}
  //           varName="creative_type"
  //         />
  //       </div>
  //       <div>
  //         <Label>Trader ID</Label>
  //         <Input
  //           value={traderID}
  //           onChange={(event) => setTraderID(event.target.value)}
  //         />
  //       </div>
  //
  //       <div className="my-6 ml-4">
  //         <Button variant="primary">apply</Button>
  //       </div>
  //       <div className="my-6 ml-4">
  //         <DropdownButton />
  //       </div>
  //       <Dialog>
  //         <DialogTrigger>
  //           <Button variant="primary">
  //             <SettingsIcon />
  //           </Button>
  //         </DialogTrigger>
  //         <DialogContent>
  //           <DialogHeader>Trader Report</DialogHeader>
  //           <DialogTitle>Trader Report Control</DialogTitle>
  //           <DialogDescription>
  //             <div className="grid grid-cols-4 gap-2">
  //               {traderReportColumns?.map((item, id) => {
  //                 return (
  //                   <div className="grid  grid-cols-4 gap-2" key={id}>
  //                     <div className="items-top flex space-x-2">
  //                       <Switch
  //                         id={item.id}
  //                         checked={item.isOpen}
  //                         onCheckedChange={(event) =>
  //                           handleToggleChange(event, item.id)
  //                         }
  //                       />
  //                       <div>
  //                         <label
  //                           htmlFor={item.id}
  //                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  //                         >
  //                           {item?.title}
  //                         </label>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           </DialogDescription>
  //         </DialogContent>
  //       </Dialog>
  //       <div></div>
  //     </div>
  //     <h2>Trader Report</h2>
  //     <div className="grid  gap-4">
  //       <DataTable data={data} columns={columns} footerData={totalObj} />
  //     </div>
  //     <div className="grid grid-cols-2 gap-2">
  //       <Pagination count={5} variant="focus" totalItems={data.length} />
  //     </div>
  //   </>
  // );
};
