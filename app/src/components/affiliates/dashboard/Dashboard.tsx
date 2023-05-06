import { SettingsIcon } from "@chakra-ui/icons";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "../../ui/button";
import AccountManager from "./AccountManager";
import { DashboardCountryReport } from "./DashboradCountryReport";
import DeviceReport from "./DeviceReport";

import type { TopMerchantCreativeType } from "../../../server/db-types";
import { api } from "../../../utils/api";

import {
  DateRangeSelect,
  useDateRange,
  useDateRangeDefault,
} from "../../common/DateRangeSelect";

import { Loading } from "@/components/common/Loading";
import { useToast } from "@/components/ui/use-toast";
import { Home, SaveIcon } from "lucide-react";
import Affiliates from "../../../layouts/AffiliatesLayout";
import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";

const allColumns = [
  { id: "Impressions", title: "Impressions", link: "reports/creative-report" },
  { id: "Clicks", title: "Clicks", link: "reports/clicks-report" },
  { id: "Install", title: "Install", link: "reports/install-reports" },
  { id: "Leads", title: "Leads", link: "reports/trader-report" },
  { id: "Demo", title: "Demo", link: "reports/clicks-report" },
  { id: "RealAccount", title: "Real Account", link: "reports/trader-report" },
  { id: "FTD", title: "FTD", link: "reports/trader-report" },
  { id: "Withdrawal", title: "Withdrawal", link: "reports/trader-report" },
  { id: "ChargeBack", title: "ChargeBack", link: "reports/clicks-report" },
  { id: "ActiveTrader", title: "Active Trader", link: "reports/trader-report" },
  { id: "Commission", title: "Commission", link: "reports/quick-summary" },
];

const columnHelper = createColumnHelper<TopMerchantCreativeType>();
export interface ItemType {
  id: number;
  title: string;
  value: string;
  isChecked: boolean;
}
export const Dashboard = () => {
  const { toast } = useToast();
  const { from, to } = useDateRange();

  const [isLoading, setIsLoading] = useState(false);
  const [selectColumnsMode, setSelectColumnsMode] = useState<string[] | null>(
    null
  );

  // const [showSelectedCheckbox, setShowSelectedCheckbox] = useState(false);
  // const [selectedCards, setSelectedCards] = useState<ItemType[]>([]);
  // const [unSelectedCards, setUnSelectedCards] = useState<ItemType[]>([]);
  // const [reportFields, setReportFields] = useState<ItemType[]>([]);
  // const [reportOldFields, setReportOldFields] = useState<ItemType[]>([]);

  const { data } = api.affiliates.getDashboard.useQuery({
    from,
    to,
  });

  const { data: lastMonthData } = api.affiliates.getDashboard.useQuery(
    useDateRangeDefault("last-month"),
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: thisMonthData } = api.affiliates.getDashboard.useQuery(
    useDateRangeDefault("month-to-date"),
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: performanceChart } =
    api.affiliates.getPerformanceChart.useQuery(
      { from, to },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const { data: allPerformanceChart } =
    api.affiliates.getAllPerformanceChart.useQuery(
      { from, to },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const { data: conversionChart } = api.affiliates.getConversionChart.useQuery(
    {
      from,
      to,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: creative } = api.affiliates.getTopMerchantCreative.useQuery(
    undefined,
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );
  const { data: account, refetch } = api.affiliates.getAccount.useQuery(
    undefined,
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  // console.log("TT: ", adminInfo);

  const apiContext = api.useContext();
  const { data: reportsColumns } = api.affiliates.getReportsColumns.useQuery(
    { level: "affiliate", report: "dashStatCols" },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );
  const upsertReportsColumns =
    api.affiliates.upsertReportsColumns.useMutation();

  const handleColumnChange = (fieldName: string, checked: boolean) => {
    if (selectColumnsMode) {
      if (checked) {
        setSelectColumnsMode(
          selectColumnsMode.filter((item) => item !== fieldName)
        );
      } else {
        setSelectColumnsMode([...selectColumnsMode, fieldName]);
      }
    }
  };

  const handleSelectMode = async () => {
    setIsLoading(true);
    try {
      if (selectColumnsMode) {
        const columns = await upsertReportsColumns.mutateAsync({
          level: "affiliate",
          report: "dashStatCols",
          fields: selectColumnsMode || [],
        });

        apiContext.affiliates.getReportsColumns.setData(
          { level: "affiliate", report: "dashStatCols" },
          columns
        );
      }
      setSelectColumnsMode(selectColumnsMode ? null : reportsColumns || []);
      toast({
        title: "Saved dashboard setup",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (
    !data ||
    !creative ||
    !reportsColumns ||
    !performanceChart ||
    !allPerformanceChart ||
    !conversionChart ||
    !lastMonthData ||
    !thisMonthData
  ) {
    return <Loading />;
  }
  return (
    <div className="pt-3.5">
      <div className="block text-base font-medium md:justify-between lg:flex">
        <div className="mb-2.5 flex items-center md:mb-5 lg:mb-5">
          <Home className="text-[#2262C6]" />
          &nbsp;/&nbsp;Dashboard
        </div>
        <div className="mb-2.5 flex">
          <DateRangeSelect />
          <Button className="ml-2 hidden lg:block" variant="primary">
            Update
          </Button>

          <Button
            size="rec"
            variant="secondary"
            onClick={handleSelectMode}
            isLoading={isLoading}
          >
            {selectColumnsMode ? (
              <SaveIcon className="w-4" />
            ) : (
              <SettingsIcon className="w-4" />
            )}
          </Button>
        </div>
        <div className="grid justify-items-stretch lg:hidden">
          <Button className="mb-2 justify-self-end" variant="primary">
            Update
          </Button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {allColumns
          .filter(
            ({ id, title, link }) =>
              selectColumnsMode || !reportsColumns.includes(title)
          )
          .map(({ id, title, link }, idx) => {
            interface Sum {
              [index: string]: number;
            }

            const sumObject = data[0]?._sum as Sum;
            const value: number = sumObject ? Number(sumObject[id]) : 0;
            const lastMonthObject = lastMonthData[0]?._sum as Sum;
            const lastMonth = lastMonthObject ? lastMonthObject[id] : 0;
            const thisMonthObject = thisMonthData[0]?._sum as Sum;
            const thisMonth = thisMonthObject ? thisMonthObject[id] : 0;

            return (
              <DashboardCards
                key={idx}
                idx={idx}
                fieldName={id}
                title={title}
                link={link}
                lastMonth={lastMonth}
                thisMonth={thisMonth}
                value={value}
                performanceChartData={allPerformanceChart}
                selectColumnsMode={!!selectColumnsMode}
                isChecked={!selectColumnsMode?.includes(id)}
                handleCheckboxChange={handleColumnChange}
              />
            );
          })}
      </div>

      <div className="my-6 rounded-2xl bg-white px-2 py-5 shadow-sm md:px-6">
        <DashboardCharts
          performanceChart={performanceChart}
          conversionChart={conversionChart}
        />
      </div>

      <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DeviceReport />
        <DashboardCountryReport />
        <AccountManager />
      </div>
    </div>
  );
};

Dashboard.getLayout = Affiliates;
