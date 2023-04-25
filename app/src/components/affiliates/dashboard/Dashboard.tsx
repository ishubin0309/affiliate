import { SettingsIcon } from "@chakra-ui/icons";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import AccountManager from "./AccountManager";
import DashboradCountryReport from "./DashboradCountryReport";
import DeviceReport from "./DeviceReport";

import type { TopMerchantCreativeType } from "../../../server/db-types";
import { api } from "../../../utils/api";

import {
  DateRangeSelect,
  useDateRange,
  useDateRangeDefault,
} from "../../common/DateRangeSelect";

import { Loading } from "@/components/common/Loading";
import { Home, SaveIcon } from "lucide-react";
import Affiliates from "../../../layouts/AffiliatesLayout";
import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";
const fields = [
  "Impressions",
  "Clicks",
  "Install",
  "Leads",
  "Demo",
  "Real Account",
  "FTD",
  "Withdrawal",
  "ChargeBack",
  "Active Trader",
  "Commission",
];
const columnHelper = createColumnHelper<TopMerchantCreativeType>();
export interface ItemType {
  id: number;
  title: string;
  value: string;
  isChecked: boolean;
}
export const Dashboard = () => {
  const { from, to } = useDateRange();
  const [isChecked, setIsChecked] = useState(false);
  const [selectColumnsMode, setSelectColumnsMode] = useState<boolean>(false);
  const [showSelectedCheckbox, setShowSelectedCheckbox] = useState(false);
  const [selectedCards, setSelectedCards] = useState<ItemType[]>([]);
  const [unSelectedCards, setUnSelectedCards] = useState<ItemType[]>([]);
  const [reportFields, setReportFields] = useState<ItemType[]>([]);
  const [reportOldFields, setReportOldFields] = useState<ItemType[]>([]);

  const { data } = api.affiliates.getDashboard.useQuery({
    from,
    to,
  });

  const { data: lastMonthData } = api.affiliates.getDashboard.useQuery(
    useDateRangeDefault("last-month")
  );

  const { data: thisMonthData } = api.affiliates.getDashboard.useQuery(
    useDateRangeDefault("month-to-date")
  );

  const { data: performanceChart } =
    api.affiliates.getPerformanceChart.useQuery({ from, to });

  const { data: allPerformanceChart } =
    api.affiliates.getAllPerformanceChart.useQuery({ from, to });

  const { data: conversionChart } = api.affiliates.getConversionChart.useQuery({
    from,
    to,
  });

  const { data: creative } = api.affiliates.getTopMerchantCreative.useQuery();
  // const { data: report } = api.affiliates.getDashboardCountryReport.useQuery();
  const { data: reportsHiddenCols } =
    api.affiliates.getReportsHiddenCols.useQuery();
  const { data: account, refetch } = api.affiliates.getAccount.useQuery();

  const upsertReportsField = api.affiliates.upsertReportsField.useMutation();
  useEffect(() => {}, [selectedCards]);
  useEffect(() => {
    const fieldsArray = fields.map((field, i) => {
      return {
        id: i,
        title: field,
        value: field.replace(/\s/g, ""),
        isChecked: !reportsHiddenCols?.includes(field),
      };
    });
    setReportFields(fieldsArray);
    setReportOldFields(fieldsArray);
  }, [reportsHiddenCols]);
  useEffect(() => {
    if (showSelectedCheckbox) {
      setReportFields([...selectedCards, ...unSelectedCards]);
    } else {
      console.log(reportOldFields, "reportOldFields");

      setReportFields(reportOldFields);
    }
  }, [showSelectedCheckbox, reportOldFields]);
  if (
    !data ||
    !creative ||
    // !report ||
    !performanceChart ||
    !allPerformanceChart ||
    !conversionChart ||
    !lastMonthData ||
    !thisMonthData
  ) {
    return <Loading />;
  }

  const columns = [
    columnHelper.accessor("merchant.name", {
      cell: (info) => info.getValue(),
      header: "Merchant",
    }),
    columnHelper.accessor("language.title", {
      cell: (info) => info.getValue(),
      header: "Language",
    }),
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      header: "Creative Name",
    }),
    columnHelper.accessor("file", {
      cell: ({ row }) => {
        return !!row.original.file ? (
          <img
            className="w-44 bg-cover md:w-full"
            src={row.original.file}
            alt={row.original.alt}
          />
        ) : null;
      },
      header: "Preview",
    }),
    columnHelper.accessor("width", {
      cell: ({ row }) => {
        return (
          <span>
            {row.original.width}x{row.original.height}
          </span>
        );
      },
      header: "LP Preview",
    }),
  ];
  const handleSelectMode = () => {
    setSelectColumnsMode(!selectColumnsMode);
    console.log(selectColumnsMode, "selectColumnsMode");
    if (selectColumnsMode) {
      setReportFields(selectedCards);
      // setSelectedCards([]);
      // setUnSelectedCards([]);
    }
  };

  const handleCheckboxChange = (item: any, checkedStatus: boolean) => {
    if (checkedStatus) {
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, item]);
      setUnSelectedCards((prevUnSelectedCards) =>
        prevUnSelectedCards.filter(
          (selectedItem) => selectedItem.id !== item.id
        )
      );
    } else {
      setSelectedCards((prevSelectedCards) =>
        prevSelectedCards.filter((selectedItem) => selectedItem.id !== item.id)
      );
      setUnSelectedCards((prevUnSelectedCards) => [
        ...prevUnSelectedCards,
        item,
      ]);
    }
  };

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

          <button
            className="ml-2 rounded-md bg-white px-2 outline-0 drop-shadow md:px-3 md:pb-2 md:pt-1.5"
            onClick={handleSelectMode}
          >
            {selectColumnsMode ? (
              <SaveIcon className="w-4" />
            ) : (
              <SettingsIcon className="w-4" />
            )}
          </button>
        </div>
        <div className="grid justify-items-stretch lg:hidden">
          <Button className="mb-2 justify-self-end" variant="primary">
            Update
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="mb-6 flex items-center md:mb-10">
          <input
            type="checkbox"
            disabled={
              selectedCards.length > 0 || unSelectedCards.length > 0
                ? false
                : true
            }
            className="form-checkbox text-blueGray-700 h-4 w-4 rounded border-0 transition-all duration-150 ease-linear"
            onChange={() => setShowSelectedCheckbox(!showSelectedCheckbox)}
          />
          <div className="ml-5 items-center text-sm font-normal text-black md:ml-5">
            selected show checkmark or X
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
\        {reportFields

          .filter((item) => item.isChecked)
          .map((item, idx) => {
            interface Sum {
              [index: string]: number;
            }
            const sumObject = data[0]?._sum as Sum;
            const value: number = sumObject ? Number(sumObject[item.value]) : 0;
            const lastMonthObject = lastMonthData[0]?._sum as Sum;
            const lastMonth = lastMonthObject ? lastMonthObject[item.value] : 0;
            const thisMonthObject = thisMonthData[0]?._sum as Sum;
            const thisMonth = thisMonthObject ? thisMonthObject[item.value] : 0;

            return (
              <>
                <DashboardCards
                  key={idx}
                  idx={idx}
                  item={item}
                  lastMonth={lastMonth}
                  thisMonth={thisMonth}
                  value={value}
                  performanceChartData={allPerformanceChart}
                  selectColumnsMode={selectColumnsMode}
                  handleCheckboxChange={handleCheckboxChange}
                  selectedCards={selectedCards}
                  unSelectedCards={unSelectedCards}
                  isChecked={isChecked}
                />
              </>
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
        <DashboradCountryReport />
        <AccountManager
          first_name={account?.first_name}
          last_name={account?.last_name}
          mail={account?.mail}
        />
      </div>
      {/*  Top Performing Creative Commented for a while will be added later */}
      {/* <div className="mb-5 rounded-2xl bg-white px-2 py-5 shadow-sm md:px-5">
        <div className="text-xl font-bold text-[#2262C6] ">
          Top Performing Creative
        </div>
        <DataTable data={creative} columns={columns} />
      </div> */}
    </div>
  );
};

Dashboard.getLayout = Affiliates;
