import DashboardChart from "@/components/common/chart/DashboardChart";
import { useConfigContext } from "@/components/common/config/config-context";
import { api } from "@/utils/api";
import { VALUE_FORMAT, formatPrice } from "@/utils/format";

import { format } from "d3-format";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";

interface Props {
  idx: number | undefined;
  title: string;
  link: string;
  thisMonth: number | undefined;
  lastMonth: number | undefined;
  value: number;
  value_format?: string;
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
  value_format,
}: Props) => {
  const { config } = useConfigContext();
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
    arrow = <ArrowUp className="text-green-700" />;
  } else if (upDown === false) {
    arrow = <ArrowDown className="text-red-700" />;
  }
  const currency = config?.currency;

  const formatNumber = (num: number) => {
    const formatWithSuffix = (value: number, suffix: string) => {
      const formattedValue =
        value >= 10 || Number.isInteger(value)
          ? Math.round(value)
          : value.toPrecision(2);
      return formattedValue.toString() + suffix;
    };

    if (num >= 1000000) {
      return formatWithSuffix(num / 1000000, "M");
    } else if (num >= 1000) {
      return formatWithSuffix(num / 1000, "K");
    } else {
      return formatWithSuffix(num, "");
    }
  };

  return (
    <Link
      href={"/affiliates/" + link}
      className="relative mb-1 block rounded-2xl bg-white px-2 pt-3 shadow-sm md:px-6"
      key={idx}
    >
      <div className="whitespace-nowrap text-sm font-semibold text-[#2262C6] md:text-base">
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
              {value_format === VALUE_FORMAT.CURRENCY
                ? formatPrice(value, currency)
                : formatNumber(value)}
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
            {value_format === VALUE_FORMAT.CURRENCY
              ? formatPrice(lastMonth, currency)
              : formatNumber(lastMonth as number)}
          </p>
        </div>
        <div className="border-r "></div>
        <div>
          <p className="mt-1 text-xs text-[#404040]">This Month</p>
          <p className="text-center text-sm font-bold text-[#1A1A1A]">
            {value_format === VALUE_FORMAT.CURRENCY
              ? formatPrice(thisMonth, currency)
              : formatNumber(thisMonth as number)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCards;
