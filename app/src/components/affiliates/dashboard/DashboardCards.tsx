import DashboardChart from "@/components/common/chart/DashboardChart";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";

interface Props {
  idx: number | undefined;
  title: string;
  link: string;
  thisMonth: number | undefined;
  lastMonth: number | undefined;
  value: number;
  upDown: boolean | null;
  chartValues: number[];
}

const DashboardCards = ({
  idx,
  title,
  link,
  thisMonth,
  lastMonth,
  value,
  upDown,
  chartValues,
}: Props) => {
  const options = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: false,
        text: "",
      },
    },
    legend: {
      display: false,
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    maintainAspectRatio: false,
  };
  const labels = ["", "", "", "", "", ""];
  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: [5, 10, 8, 12],
        backgroundColor: "#2262C6",
      },
    ],
  };

  let arrow = null;
  if (upDown === true) {
    arrow = <ArrowBigUp className="text-green-700" />;
  } else if (upDown === false) {
    arrow = <ArrowBigDown className="text-red-700" />;
  }

  function countDecimals(value: number) {
    // Check if floating point is .5 then return 2 which will return same value 
    // otherwise decrease floating point number
    if (value % 1 === 0.5) {
      return 2;
    } else {
      if (Math.floor(value) === value) return 0;
      return value.toString().split(".")[1]?.length || 0;
    }
  }

  function formatNumber(num: number) {
    if (num >= 1000000) {
      const formattedNum =
        num / 1000000 >= 10
          ? Math.round(num / 1000000)
          : Number.isInteger(num / 1000000)
          ? (num / 1000000).toString()
          : (num / 1000000).toFixed(1);
      return formattedNum.toString() + "M";
    } else if (num >= 1000) {
      const formattedNum =
        num / 1000 >= 10
          ? Math.round(num / 1000)
          : Number.isInteger(num / 1000)
          ? (num / 1000).toString()
          : (num / 1000).toFixed(1);
      return formattedNum.toString() + "K";
    } else {
      return Number.isInteger(num)
        ? num.toString()
        : num.toFixed(countDecimals(num) - 1);
    }
  }

  return (
    <Link
      href={"/affiliates/" + link}
      className="relative mb-1 block rounded-2xl bg-white px-2 pt-3 shadow-sm md:px-6"
      key={idx}
    >
      <div className="text-sm font-semibold text-[#2262C6] md:text-base">
        {title}
        <span className="hidden text-xs font-normal text-[#B9B9B9] md:inline-flex md:text-sm">
          {" "}
          ( Last 6 Month)
        </span>
      </div>
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex h-12 items-center">
            <div className="flex items-center">{arrow}</div>
            <span className="ml-1 text-xl font-bold md:ml-3">
              {formatNumber(value )}
            </span>
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          {chartValues.length ? (
            <DashboardChart chartValues={chartValues} />
          ) : (
            <Bar width={"100%"} height={"50px"} options={options} data={data} />
          )}
        </div>
      </div>
      <div className="mt-2 flex justify-around border-t border-gray-200 pb-2">
        <div>
          <p className="mt-1 text-xs text-[#404040]">Last Month</p>
          <p className="text-center text-sm font-bold text-[#1A1A1A]">
            {formatNumber(lastMonth as number)}
          </p>
        </div>
        <div className="border-r "></div>
        <div>
          <p className="mt-1 text-xs text-[#404040]">This Month</p>
          <p className="text-center text-sm font-bold text-[#1A1A1A]">
            {formatNumber(thisMonth as number)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCards;
