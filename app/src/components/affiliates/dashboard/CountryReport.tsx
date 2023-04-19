import { useState } from "react";
import type { DashboardDeviceReport } from "../../../server/db-types";
import { api } from "../../../utils/api";
import CountryChart from "../../common/chart/CountryChart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
const AccountManager = () => {
  const [selectedReport, setSelectedReport] = useState<string>("Clicks");
  const [lastDays, setLastDays] = useState<number>(0);

  const { data: reportData } = api.affiliates.getDashboardDeviceReport.useQuery(
    {
      lastDays,
    }
  );
  const labels: string[] =
    reportData?.map((item: DashboardDeviceReport): string => item?.CountryID) ??
    [];
  const values: number[] =
    reportData?.map(
      (item: DashboardDeviceReport): number =>
        item?._sum[selectedReport as keyof typeof item._sum] as number
    ) ?? [];
  const reportDropDown = reportData?.length
    ? Object.keys(reportData[0]?._sum || {})
    : [];

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
            onValueChange={(e: string) => setLastDays(parseInt(e))}
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
          <Select onValueChange={(e) => setSelectedReport(e)}>
            <SelectTrigger className="w-full rounded-sm bg-[#EDF2F7] py-1 px-2">
              <SelectValue placeholder="Clicks" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectGroup>
                {reportDropDown.map((i: string) => (
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
        <CountryChart label={selectedReport} labels={labels} data={values} />
      </div>
    </div>
  );
};

export default AccountManager;
