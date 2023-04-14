import DashboardChart from "@/components/common/chart/DashboardChart";
import { UpwardArrowIcon } from "@/components/icons";
import { format } from "d3-format";
import { Bar } from "react-chartjs-2";

interface Props {
  idx: number | undefined;
  item: { id: number; title: string; value: string; isChecked: boolean };
  thisMonth: number | undefined;
  lastMonth: number | undefined;
  value: number;
  performanceChartData: any;
}

const DashboardCards = ({
  idx,
  item,
  thisMonth,
  lastMonth,
  value,
  performanceChartData,
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
  return (
    <div
      className="mb-1 w-60 rounded-2xl bg-white px-2 pt-3 shadow-sm md:px-6"
      key={idx}
    >
      <div className="text-sm font-semibold text-[#2262C6] md:text-base">
        {item?.title}{" "}
        <span className="hidden text-xs font-normal text-[#B9B9B9] md:inline-flex md:text-sm">
          {" "}
          ( Last 6 Month)
        </span>
      </div>
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex h-12 items-center">
            <div className="flex items-center">
              <UpwardArrowIcon />
            </div>
            <span className="ml-1 text-xl font-bold md:ml-3">
              {format("~s")(value as number | { valueOf(): number })}
            </span>
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          {performanceChartData ? (
            <DashboardChart
              performanceChartData={performanceChartData}
              value={item?.value}
            />
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
    </div>
  );
};

export default DashboardCards;
