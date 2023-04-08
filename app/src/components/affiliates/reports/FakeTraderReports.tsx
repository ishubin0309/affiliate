import { fakeTraderReportData } from "@/components/affiliates/reports/fake-trader-report-data";
import { QuerySelect } from "@/components/common/QuerySelect";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Grid } from "@/components/ui/Grid";
import { Button } from "@/components/ui/button";
import { DateRangeSelect } from "@/components/ui/date-range";
import { DropdownButton } from "@/components/ui/drop-down";
import { Input, Label } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import type { TraderReportType } from "../../../server/db-types";
import { Loading } from "../../common/Loading";

export const FakeTraderReports = () => {
  const router = useRouter();
  const [traderID, setTraderID] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(2);
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [isOpen, setOpen] = useState(false);

  const handleDropDown = () => {
    setOpen(!isOpen);
  };

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

  console.log("trader render", {
    data,
    merchants,
    isLoading,
    from,
    to,
  });

  if (isLoading) {
    return <Loading />;
  }

  const createColumn = (id: keyof TraderReportType, header: string) =>
    columnHelper.accessor(id, {
      cell: (info) => info.getValue(),
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

  const creativeType = [
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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleChange = (e: any) => {
    setItemPerPage(e);
  };

  // useEffect(() => {
  //   console.log("from", from, "to", to);
  // }, [from, to]);

  // console.log("query", router.query);

  console.log("router", router.query);
  console.log("trader id ----->", traderID);

  return (
    <>
      <Grid columns={4} gaps={2}>
        <DateRangeSelect setFrom={setFrom} setTo={setTo} />
        <div>
          <QuerySelect
            label="Merchant"
            choices={merchants}
            varName="merchant_id"
          />
        </div>
        <div>
          <Label>Trader ID</Label>
          <Input
            value={traderID}
            onChange={(event) => setTraderID(event.target.value)}
          />
        </div>
        <div>
          <QuerySelect
            label="Creative Type"
            choices={creativeType}
            varName="creative_type"
          />
        </div>
        <div className="my-8 ml-4">
          <Button variant="primary">apply</Button>
        </div>
        <div className="my-8 ml-4">
          <DropdownButton />
        </div>
      </Grid>
      <h2>Trader Report</h2>
      <div className="grid  gap-4">
        <DataTable data={data} columns={columns} footerData={totalObj} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Pagination
          count={5}
          variant="focus"
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={data.length}
          paginate={paginate}
          handleChange={handleChange}
        />
      </div>
    </>
  );
};
