import DashboardChart from "@/components/common/chart/DashboardChart";

import { format } from "d3-format";
import { ArrowBigDown, ArrowBigUp, CheckIcon, XIcon } from "lucide-react";
import { Bar } from "react-chartjs-2";
import Link from "next/link";

interface Props {
  idx: number | undefined;
  fieldName: string;
  title: string;
  link: string;
  thisMonth: number | undefined;
  lastMonth: number | undefined;
  value: number;
  upDown: boolean | null;
  chartValues: number[];
  selectColumnsMode: boolean;
  handleCheckboxChange: (fieldName: string, checked: boolean) => void;
  isChecked: boolean;
}

const DashboardCards = ({
  idx,
  fieldName,
  title,
  link,
  thisMonth,
  lastMonth,
  value,
  upDown,
  chartValues,
  selectColumnsMode,
  handleCheckboxChange,
  isChecked,
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

  return (
    <Link
      href={"/affiliates/" + link}
      className="relative mb-1 block rounded-2xl bg-white px-2 pt-3 shadow-sm md:px-6"
      key={idx}
    >
      {selectColumnsMode && (
        <div className="absolute inset-0 bg-gray-300  opacity-75"></div>
      )}

      {selectColumnsMode && isChecked && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <CheckIcon className="h-12 w-auto text-green-600" />
        </div>
      )}

      {selectColumnsMode && !isChecked && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <XIcon className="h-10 w-auto text-red-600" />
        </div>
      )}

      {selectColumnsMode && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <input
            className="scale-[25] opacity-0"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              console.log(`muly:click`, { fieldName, c: e.target.checked });
              handleCheckboxChange(fieldName, e.target.checked);
            }}
          />
        </div>
      )}

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
              {format("~s")(value as number | { valueOf(): number })}
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
            {format("~s")(lastMonth as number | { valueOf(): number })}
          </p>
        </div>
        <div className="border-r "></div>
        <div>
          <p className="mt-1 text-xs text-[#404040]">This Month</p>
          <p className="text-center text-sm font-bold text-[#1A1A1A]">
            {format("~s")(thisMonth as number | { valueOf(): number })}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCards;
