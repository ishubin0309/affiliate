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
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 0.5,
    lastMonth: 0.5,
    value: 0.5,
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

export const test2 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 1,
    lastMonth: 1,
    value: 1,
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

export const test3 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 3.87,
    lastMonth: 3.87,
    value: 3.87,
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

export const test4 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 10,
    lastMonth: 10,
    value: 10,
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

export const test5 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 15.6,
    lastMonth: 15.6,
    value: 15.6,
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

export const test6 = {
  args: {
    idx: 0,
    item: {
      id: 0,
      title: "title",
      value: "RealAccount",
      isChecked: false,
    },
    thisMonth: 999,
    lastMonth: 999,
    value: 999,
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
