import { fakeTraderReportData } from "@/components/affiliates/reports/fake-trader-report-data";
import { QuerySelect } from "@/components/common/QuerySelect";
import { DataTable } from "@/components/common/data-table/DataTable";
import { DateRangeSelect } from "@/components/ui/date-range";
import { Pagination } from "@/components/ui/pagination";
import { FormLabel, Grid, GridItem, Input } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import type { TraderReportType } from "../../../server/db-types";
import { useDateRange } from "../../common/DateRangeSelect";
import { Loading } from "../../common/Loading";

export const FakeTraderReports = () => {
  const router = useRouter();
  const { merchant_id } = router.query;
  const { from, to } = useDateRange();
  const [traderID, setTraderID] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState(2);

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
    merchant_id,
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

  return (
    <>
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap={6}
        alignContent={"center"}
        width="90%"
        alignItems={"center"}
        alignSelf="center"
      >
        <DateRangeSelect />
        <GridItem>
          <QuerySelect
            label="Merchant"
            choices={merchants}
            varName="merchant_id"
          />
        </GridItem>{" "}
        <GridItem>
          <FormLabel>Trader ID</FormLabel>
          <Input
            value={traderID}
            onChange={(event) => setTraderID(event.target.value)}
          />
        </GridItem>
        <GridItem>
          <QuerySelect
            label="Creative Type"
            choices={creativeType}
            varName="creative_type"
          />
        </GridItem>
      </Grid>
      <h2>Trader Report</h2>
      <Grid
        alignContent={"center"}
        alignItems={"center"}
        width="100%"
        alignSelf="center"
        overflow={"scroll"}
      >
        <DataTable data={data} columns={columns} footerData={totalObj} />
      </Grid>
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
