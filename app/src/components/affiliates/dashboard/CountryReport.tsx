import { api } from "@/utils/api";
import { useState } from "react";
import CountryChart from "../../common/chart/CountryChart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
interface ApiData {
  _sum: {
    Clicks: number;
    BannerID: number;
    Impressions: number;
  };
  merchant_id: number;
  CountryID: string;
}
const AccountManager = () => {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [lastDays, setLastDays] = useState<number>(0);
  const [countryDropDown, setCountryDropDown] = useState<string[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartValues, setChartValues] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ApiData[]>([]);
  const getApiData = () => {
    if (Array.isArray(data)) {
      setChartData(data);
      setCountryDropDown(Object.keys(data[0]?._sum));
      const labels: string[] = data.map((data: ApiData) => data.CountryID);
      const values: number[] = data.map((data: ApiData) => data._sum.Clicks);
      setChartLabels(labels);
      setChartValues(values);
    }
  };
  const data: unknown = api.affiliates.getDashboardDeviceReport.useQuery({
    lastDays,
  });
  getApiData();
  const onReportChange = (value: string) => {
    // set chart label
    setSelectedReport(value);
    // set the chart value
    const values: number[] = chartData.map(
      (data: ApiData) => data._sum[value as keyof ApiData["_sum"]]
    );
    setChartValues(values);
  };

  return (
    <div className="rounded-2xl bg-white px-2 py-5 shadow-sm md:px-5">
      <div className="mb-3 text-xl font-bold text-[#2262C6]">
        Country Report
      </div>
      <div className="mb-7 flex justify-between">
        <div className="text-base font-light">session by device</div>
        <div className="flex items-center justify-center text-xs font-light">
          <Select
            defaultValue={"90"}
            onValueChange={(e: string) => setLastDays(parseInt(e) as number)}
          >
            <SelectTrigger className="pr-2 text-xs font-light text-black">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent className="pr-2 text-xs font-light text-black">
              <SelectGroup>
                <SelectItem value={"90"}>Last 90 Days</SelectItem>
                <SelectItem value={"30"}>Last 30 Days</SelectItem>
                <SelectItem value={"1"}>Last 1 Day</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="align-center mb-5 flex justify-center">
        <img width="243" src="/img/worldMap.png" alt="worldmap" />
      </div>

      <div className="mb-3 flex justify-between">
        <div className="text-base font-medium text-[#2262C6]">Report</div>
        <div className="flex w-48 items-center justify-center text-xs">
          <Select onValueChange={onReportChange}>
            <SelectTrigger className="w-full rounded-sm bg-[#EDF2F7] py-1 px-2">
              <SelectValue placeholder="Clicks" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectGroup>
                {countryDropDown.map((i: string) => (
                  <>
                    <SelectItem value={i}>{i}</SelectItem>
                  </>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex h-48 items-center justify-between">
        <CountryChart
          label={selectedReport}
          labels={chartLabels}
          data={chartValues}
        />
      </div>
    </div>
  );
};

export default AccountManager;
