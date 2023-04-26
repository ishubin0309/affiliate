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
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => <DashboardCards {...args} />,
};

export const LargeNumbers = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 2_125_464,
    lastMonth: 12_125_464,
    value: 125_464,
  },
};

export const SelectModeSelected = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 2_125_464,
    lastMonth: 12_125_464,
    value: 125_464,
    selectColumnsMode: true,
    isChecked: true,
  },
};

export const SelectModeUnSelected = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 2_125_464,
    lastMonth: 12_125_464,
    value: 125_464,
    selectColumnsMode: true,
    isChecked: false,
  },
};
