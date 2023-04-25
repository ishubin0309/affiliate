import DashboardCards from "./DashboardCards";

const meta = {
  component: DashboardCards,
};

export default meta;

export const Primary = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 212000,
    lastMonth: 40000,
    value: 23000,
    performanceChartData: undefined,
  },
};

export const LargeNumbers = {
  args: {
    ...Primary.args,
    thisMonth: 2_125_464,
    lastMonth: 12_125_464,
    value: 125_464,
  },
};
