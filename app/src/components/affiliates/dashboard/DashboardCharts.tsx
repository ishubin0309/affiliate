import PerformanceLineChart from "@/components/common/chart/PerformanceLineChart";
import ConversionChart from "../../common/chart/ConversionChart";
import PerformanceChart from "../../common/chart/PerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

const DashboardCharts = () => {
  const performanceChart = [
    {
      date: "Dec, 2022",
      Accounts: 5,
      ActiveTraders: 1,
    },
    {
      date: "Jan, 2023",
      Accounts: 3,
      ActiveTraders: 1,
    },
    {
      date: "Feb, 2023",
      Accounts: 6,
      ActiveTraders: 1,
    },
    {
      date: "Mar, 2023",
      Accounts: 4,
      ActiveTraders: 1,
    },
  ];
  const conversionChart = [
    {
      date: "Dec, 2022",
      Conversions: 16.666666666666664,
    },
    {
      date: "Jan, 2023",
      Conversions: 14,
    },
    {
      date: "Feb, 2023",
      Conversions: 18,
    },
    {
      date: "Mar, 2023",
      Conversions: 19,
    },
    {
      date: "Apr, 2023",
      Conversions: 11,
    },
  ];

  return (
    <Tabs defaultValue="Performance">
      <TabsList>
        <TabsTrigger value="Performance">Performance Chart</TabsTrigger>
        <TabsTrigger value="LineChart">PerformanceLineChart Chart</TabsTrigger>
        <TabsTrigger value="conversion">Conversion Chart</TabsTrigger>
      </TabsList>
      <TabsContent value="Performance">
        <div className="mt-5 h-80 pb-5">
          <PerformanceChart performanceChartData={performanceChart} />
        </div>
      </TabsContent>
      <TabsContent value="conversion">
        <div className="mt-5 h-80  pb-5">
          <ConversionChart conversionChartData={conversionChart} />
        </div>
      </TabsContent>
      <TabsContent value="LineChart">
        <div className="mt-5 h-80  pb-5">
          <PerformanceLineChart performanceChartData={performanceChart} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardCharts;
