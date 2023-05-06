import { SettingsIcon } from "@chakra-ui/icons";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import AccountManager from "./AccountManager";
import { DashboardCountryReport } from "./DashboradCountryReport";
import DeviceReport from "./DeviceReport";

import type { TopMerchantCreativeType } from "../../../server/db-types";
import { api } from "../../../utils/api";

import { SaveIcon } from "lucide-react";
import Affiliates from "../../../layouts/AffiliatesLayout";
import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";
import { useToast } from "@/components/ui/use-toast";
import {
  getDateRange,
  SearchDateRange,
} from "@/components/common/search/search-date-range";
import { endOfMonth, endOfToday, startOfMonth, sub } from "date-fns";
import {
  getDateParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";

interface CardInfo {
  id: string;
  title: string;
  link: string;
}

const allColumns: CardInfo[] = [
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
  const today = endOfToday();
  const {
    values: { dates },
  } = useSearchContext();
  const { name, ...dateRange } = getDateRange(dates);
  const { values: context } = useSearchContext();
  console.log(`muly:Dashboard`, { context });

  const [isLoading, setIsLoading] = useState(false);
  const [selectColumnsMode, setSelectColumnsMode] = useState<string[] | null>(
    null
  );

  const { data, isRefetching: isRefetchingData } =
    api.affiliates.getDashboard.useQuery(
      {
        ...dateRange,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const { data: lastMonthData } = api.affiliates.getDashboard.useQuery(
    {
      from: startOfMonth(sub(today, { months: 1 })),
      to: endOfMonth(sub(today, { months: 1 })),
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: thisMonthData } = api.affiliates.getDashboard.useQuery(
    {
      from: startOfMonth(today),
      to: today,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: performanceChart, isRefetching: isRefetchingPerformanceChart } =
    api.affiliates.getPerformanceChart.useQuery(
      {
        ...dateRange,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  const {
    data: allPerformanceChart,
    isRefetching: isRefetchingAllPerformanceChart,
  } = api.affiliates.getAllPerformanceChart.useQuery(
    {
      ...dateRange,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const { data: conversionChart, isRefetching: isRefetchingConversionChart } =
    api.affiliates.getConversionChart.useQuery(
      {
        ...dateRange,
      },
      { keepPreviousData: true, refetchOnWindowFocus: false }
    );

  // const { data: creative } = api.affiliates.getTopMerchantCreative.useQuery(
  //   undefined,
  //   { keepPreviousData: true, refetchOnWindowFocus: false }
  // );

  const { data: account } = api.affiliates.getAccount.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

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

  const isRefetching =
    isRefetchingData ||
    isRefetchingPerformanceChart ||
    isRefetchingAllPerformanceChart ||
    isRefetchingConversionChart;
  // !data ||
  // !creative ||
  // !reportsColumns ||
  // !performanceChart ||
  // !allPerformanceChart ||
  // !conversionChart ||
  // !lastMonthData ||
  // !thisMonthData;

  const drawDashboardCard = ({ id, title, link }: CardInfo, idx: number) => {
    interface Sum {
      [index: string]: number;
    }

    const sumObject = (data ? data[0]?._sum : {}) as Sum;
    const value: number = sumObject ? Number(sumObject[id]) : 0;
    const lastMonthObject = (
      lastMonthData ? lastMonthData[0]?._sum : {}
    ) as Sum;
    const lastMonth = lastMonthObject ? lastMonthObject[id] : 0;

    const thisMonthObject = (
      thisMonthData ? thisMonthData[0]?._sum : {}
    ) as Sum;
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
  };

  return (
    <>
      <PageHeader title="Dashboard">
        <SearchDateRange />
        <SearchApply isLoading={isRefetching} />
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
      </PageHeader>
      <div>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {!!reportsColumns &&
            allColumns
              .filter(
                ({ id, title, link }) =>
                  selectColumnsMode || !reportsColumns.includes(title)
              )
              .map(drawDashboardCard)}
        </div>

        <div className="my-6 rounded-2xl bg-white px-2 py-5 shadow-sm md:px-6">
          <DashboardCharts
            performanceChart={performanceChart || []}
            conversionChart={conversionChart || []}
          />
        </div>
      </div>

      <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DeviceReport />
        <DashboardCountryReport />
        <AccountManager />
      </div>
    </>
  );
};

Dashboard.getLayout = Affiliates;
