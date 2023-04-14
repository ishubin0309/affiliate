import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const apiMockData = [
  {
    _sum: {
      Clicks: 1,
      BannerID: 1,
      Impressions: 0,
    },
    merchant_id: 1,
    CountryID: "FR",
  },
  {
    _sum: {
      Clicks: 4,
      BannerID: 1,
      Impressions: 0,
    },
    merchant_id: 1,
    CountryID: "US",
  },
];

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  indexAxis: "y" as const,

  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      grid: {
        display: false,
      },
      ticks: { color: "#000" },
      font: {
        size: 16,
      },
    },
  },
};

const labels = apiMockData.map((data) => {
  return data.CountryID;
});
const clicks = apiMockData.map((data) => {
  return data._sum.Clicks;
});
// const labels = ["Israel", "Brazil", "Canada", "USA", "Somalia"];
export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      // data: [60, 10],
      data: clicks,
      backgroundColor: "#3B5EC2",
      maxBarThickness: 17,
      borderRadius: 3,
    },
  ],
};
interface Props {
  labels: string[];
  data: number[];
  label: string;
}
const CountryChart = ({ labels, data, label }: Props) => {
  return (
    <Bar
      options={options}
      data={{
        labels: labels,
        datasets: [
          {
            label: label,
            // data: [60, 10],
            data: data,
            backgroundColor: "#3B5EC2",
            maxBarThickness: 17,
            borderRadius: 3,
          },
        ],
      }}
    />
  );
};

export default CountryChart;
