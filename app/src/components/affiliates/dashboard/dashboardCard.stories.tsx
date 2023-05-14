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
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const LargeNumbers = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 2_125_464,
    lastMonth: 12_125_464,
    upDown: false,
    value: 125_464,
  },
};

export const LargeNumbers2 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 200_125_464,
    lastMonth: 12_125_464,
    value: 125_464,
    upDown: null,
  },
};

export const test1 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 0.5,
    lastMonth: 0.46585,
    value: 0.513232,
  },
};

export const test2 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 1,
    lastMonth: 1.67667,
    value: 1.427474,
  },
};

export const test4 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 10.47328947239,
    lastMonth: 11.23636,
    value: 9.64646,
  },
};

export const test6 = {
  ...Primary,
  args: {
    ...Primary.args,
    thisMonth: 999.747744,
    lastMonth: 1000,
    value: 1227.327732,
  },
};

export const test7 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 1000,
    lastMonth: 1000,
    value: 1000,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const test8 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 1500,
    lastMonth: 1500,
    value: 1500,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const test9 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 10000,
    lastMonth: 10000,
    value: 10000,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const test10 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 15600,
    lastMonth: 15600,
    value: 15600,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const test11 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 999000,
    lastMonth: 999000,
    value: 999000,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const test12 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 1000000,
    lastMonth: 1000000,
    value: 1000000,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const test13 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 1500000,
    lastMonth: 1500000,
    value: 1500000,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const test14 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 10000000,
    lastMonth: 10000000,
    value: 10000000,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

export const test15 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 15600000,
    lastMonth: 15600000,
    value: 15600000,
    upDown: true,
    chartValues: [10, 10, 4, 5, 2, 3],
    selectColumnsMode: false,
    isChecked: false,
    handleCheckboxChange: (id: any, checkedStatus: boolean) => {
      console.log(`muly:handleCheckboxChange`, {});
    },
  },
  render: (args: any) => (
    <div className="max-w-sm">
      <DashboardCards {...args} />
    </div>
  ),
};

// export const SelectModeSelected = {
//   ...Primary,
//   args: {
//     ...Primary.args,
//     thisMonth: 2_125_464,
//     lastMonth: 12_125_464,
//     value: 125_464,
//     selectColumnsMode: true,
//     isChecked: true,
//   },
// };
//
// export const SelectModeUnSelected = {
//   ...Primary,
//   args: {
//     ...Primary.args,
//     thisMonth: 2_125_462,
//     lastMonth: 12_125_464,
//     value: 125_464,
//     selectColumnsMode: true,
//     isChecked: false,
//   },
// };
