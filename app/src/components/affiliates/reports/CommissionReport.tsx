import { ExportButton } from "@/components/affiliates/reports/export-button";
import { DateRangeSelect, useDateRange } from "@/components/ui/date-range";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { createColumnHelper } from "@tanstack/react-table";
import { Calendar, Download, Settings } from "lucide-react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { QuerySelect } from "../../../components/common/QuerySelect";
import { ReportDataTable } from "../../../components/common/data-table/ReportDataTable";
import type { CommissionReportType } from "../../../server/db-types";
import { api } from "../../../utils/api";
import { Loading } from "../../common/Loading";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

export const CommissionReport = () => {
  // const router = useRouter();
  // const { merchant_id, commission } = router.query;
  // // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  // const { from, to } = useDateRange();
  // const [traderID, setTraderID] = useState<string>("");
  // const [reportFields, setReportFields] = useState<
  //   { id: number; title: string; value: string; isChecked: boolean }[]
  // >([]);
  //
  // const { currentPage, itemsPerPage } = router.query;
  //
  // const { data, isLoading } = api.affiliates.getCommissionReport.useQuery({
  //   from: new Date("2016-01-03"),
  //   to: new Date("2023-01-03"),
  //   commission: commission ? String(commission) : "",
  //   trader_id: traderID,
  //   pageParams: {
  //     pageSize: itemsPerPage ? Number(itemsPerPage) : 10,
  //     pageNumber: currentPage ? Number(currentPage) : 1,
  //   },
  // });
  // const { mutateAsync: reportExport } =
  //   api.affiliates.exportCommissionReport.useMutation();
  // const { data: merchants } = api.affiliates.getAllMerchants.useQuery();
  // const columnHelper = createColumnHelper<CommissionReportType>();
  //
  // console.log("Commission render", {
  //   data,
  //   merchants,
  //   isLoading,
  //   from,
  //   to,
  //   merchant_id,
  // });
  //
  // if (isLoading) {
  //   return <Loading />;
  // }
  //
  // const divCol = (
  //   val: number | null | undefined,
  //   div: number | null | undefined
  // ) => {
  //   return val ? (
  //     <span>{((val / (div || 1)) * 100).toFixed(2)}%</span>
  //   ) : (
  //     <span></span>
  //   );
  // };
  //
  // const columns = [
  //   columnHelper.accessor("merchant.name" as any, {
  //     cell: (info) => info.getValue() as string,
  //     header: "Merchant Name",
  //   }),
  //   columnHelper.accessor("merchant_id" as any, {
  //     cell: (info) => info.getValue() as number,
  //     header: "Merchant ID",
  //   }),
  //   columnHelper.accessor("traderID" as any, {
  //     cell: (info) => info.getValue() as number,
  //     header: "Trader ID",
  //   }),
  //   columnHelper.accessor("transactionID" as any, {
  //     cell: (info) => info.getValue() as number,
  //     header: "Transaction ID",
  //     // meta: {
  //     //   isNumeric: true,
  //     // },
  //   }),
  //   columnHelper.accessor("Type" as any, {
  //     cell: (info) => info.getValue() as string,
  //     header: "Type",
  //   }),
  //   columnHelper.accessor("Amount" as any, {
  //     cell: (info) => info.getValue() as number,
  //     header: "Amount",
  //   }),
  //   columnHelper.accessor("level" as any, {
  //     cell: (info) => info.getValue() as string,
  //     header: "Location",
  //   }),
  //   columnHelper.accessor("Commission" as any, {
  //     cell: (info) => info.getValue() as number,
  //     header: "Commission",
  //   }),
  // ];
  //
  // const handleReportField = (event: ChangeEvent<HTMLInputElement>) => {
  //   const value = reportFields.map((item) => {
  //     const temp = Object.assign({}, item);
  //     if (temp.id === parseInt(event.target.value)) {
  //       temp.isChecked = event.target.checked;
  //     }
  //     return temp;
  //   });
  //   setReportFields(value);
  //   const hiddenCols = value.filter((item) => item.isChecked === false);
  //   const remove_fields = hiddenCols
  //     .map((item) => {
  //       return item.value;
  //     })
  //     .join("|");
  //   // await upsertReportsField.mutateAsync({
  //   //   remove_fields,
  //   // });
  // };
  //
  // const handleSelectAll = () => {
  //   const value = reportFields.map((item) => {
  //     const temp = Object.assign({}, item);
  //     temp.isChecked = true;
  //     return temp;
  //   });
  //   setReportFields(value);
  //   const hiddenCols = value.filter((item) => item.isChecked === false);
  //   const remove_fields = hiddenCols
  //     .map((item) => {
  //       return item.value;
  //     })
  //     .join("|");
  //   // await upsertReportsField.mutateAsync({
  //   //   remove_fields,
  //   // });
  // };
  //
  // const handleUnSelectAll = () => {
  //   const value = reportFields.map((item) => {
  //     const temp = Object.assign({}, item);
  //     temp.isChecked = false;
  //     return temp;
  //   });
  //   setReportFields(value);
  //   const hiddenCols = value.filter((item) => item.isChecked === false);
  //   const remove_fields = hiddenCols
  //     .map((item) => {
  //       return item.value;
  //     })
  //     .join("|");
  //   // await upsertReportsField.mutateAsync({
  //   //   remove_fields,
  //   // });
  // };
  //
  // interface Commission {
  //   totalAmount: number;
  //   Commission: number;
  // }
  //
  // let totalAmount = 0;
  // let totalCommission = 0;
  // const totalData = [];
  // data ||
  //   [].forEach((item: any) => {
  //     totalAmount += item?.Amount || 0;
  //     totalCommission += item?.Commission || 0;
  //   });
  // totalData.push({
  //   merchant_id: "",
  //   traderID: "",
  //   transactionID: "",
  //   type: "",
  //   totalAmount: totalAmount.toFixed(2),
  //   location: "",
  //   totalCommission: totalCommission.toFixed(2),
  // });
  //
  // console.log("data", totalData);
  //
  // const commissionOption = [
  //   {
  //     id: "CPA",
  //     title: "CPA / TierCPA / DCPA",
  //   },
  // ];
  //
  // // eslint-disable-next-line @typescript-eslint/require-await
  // const handleExport = async (exportType: ExportType) =>
  //   reportExport({
  //     from: new Date("2022-01-03"),
  //     to: new Date("2023-01-03"),
  //     exportType,
  //   });
  //
  // if (!data) {
  //   return <Loading />;
  // }
  //
  // return (
  //   <>
  //     <div className="w-full pt-3.5">
  //       <div className="block text-base font-medium md:justify-between lg:flex">
  //         <div className="mb-2.5 flex items-center justify-between md:mb-5 lg:mb-5 ">
  //           <div>
  //             <span className="text-[#2262C6]">Affliate Program</span>
  //             &nbsp;/&nbsp; Commission Report
  //           </div>
  //           <Button className="lg:hidden">
  //             <Calendar className="h-6 w-6" />
  //           </Button>
  //         </div>
  //       </div>
  //       <Dialog>
  //         <div>
  //           <div className="flex items-center justify-between">
  //             <div className="flex">
  //               <DialogTrigger>
  //                 <Button variant="ghost">
  //                   <Settings className="h-4 w-4" />
  //                 </Button>
  //               </DialogTrigger>
  //               <span className="font-sm ml-3 hidden items-center justify-between font-medium lg:flex">
  //                 Report Display
  //               </span>
  //             </div>
  //             <div className="hidden lg:block"></div>
  //             <div className="flex space-x-2 lg:hidden">
  //               <Button variant="primary">Show Reports</Button>
  //               <Button variant="primary-outline">Reset Search</Button>
  //               <Button>
  //                 <Download className="h-6 w-6" />
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //         <div className="mt-2 items-center justify-between lg:flex">
  //           <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
  //             <QuerySelect
  //               label="Merchant"
  //               choices={merchants}
  //               varName="merchant_id"
  //             />
  //             <div className="mt-2">
  //               <Label>Trader ID</Label>
  //               <Input
  //                 value={traderID}
  //                 onChange={(event) => setTraderID(event.target.value)}
  //               />
  //             </div>
  //             <QuerySelect
  //               label="Commission"
  //               choices={commissionOption}
  //               varName="commission"
  //             />
  //           </div>
  //           <div className="flex space-x-2">
  //             <button className="hidden rounded-md bg-[#2262C6] px-8 py-2 text-white lg:block">
  //               Show Reports
  //             </button>
  //             <button className="hidden rounded-md border border-[#2262C6] px-8 py-2 text-base font-semibold text-[#2262C6] lg:block">
  //               Reset Search
  //             </button>
  //             <ExportButton onExport={handleExport} />
  //           </div>
  //         </div>
  //
  //         <DialogContent>
  //           <DialogHeader className="text-left text-sm font-medium text-primary">
  //             Manage Field On Report - Quick Summary
  //           </DialogHeader>
  //           <DialogTitle className="text-disabled text-sm font-normal md:mb-6 md:pt-2">
  //             Please activate the fields you want to display on the report:
  //           </DialogTitle>
  //           <div className="grid grid-cols-1 md:mt-10 md:grid-cols-2">
  //             {reportFields.map((field) => {
  //               return (
  //                 <div key={field.id}>
  //                   <div className="mb-6 flex items-center md:mb-10">
  //                     <input
  //                       type="checkbox"
  //                       id={`report-field-${field.id}`}
  //                       checked={field.isChecked}
  //                       value={field.id}
  //                       onChange={(e) => void handleReportField(e)}
  //                       className="form-checkbox text-blueGray-700 h-4 w-4 rounded border-0 transition-all duration-150 ease-linear"
  //                     />
  //                     <div className="ml-5 items-center text-lg font-medium text-black md:ml-10">
  //                       {field.title}
  //                     </div>
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //           <div className="flex justify-between pb-5 font-medium md:pb-8 md:pt-12">
  //             <div className="flex">
  //               <button
  //                 className="mr-3 rounded-md bg-[#2262C6] p-3 text-white md:px-14"
  //                 onClick={handleSelectAll}
  //               >
  //                 Select All
  //               </button>
  //               <button
  //                 className="rounded-md border border-[#1B48BB] bg-[#EFEEFF] p-3 text-[#1B48BB] md:px-12"
  //                 onClick={handleUnSelectAll}
  //               >
  //                 Unselect All
  //               </button>
  //             </div>
  //           </div>
  //         </DialogContent>
  //       </Dialog>
  //
  //       <div className="mb-5 mt-4 w-full rounded bg-white px-2 py-4 shadow-sm">
  //         <ReportDataTable
  //           report={data}
  //           columns={columns}
  //           footerData={totalData}
  //         />
  //       </div>
  //     </div>
  //   </>
  // );

  return null;
};
