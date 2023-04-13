import AccountManager from "./AccountManager";
import CountryReport from "./CountryReport";
import DashboardCharts from "./DashboardCharts";
import DeviceReport from "./DeviceReport";

const meta = {
  component: DeviceReport,
};
const report = {
  first_name: "ner",
  last_name: "cohen",
  mail: "aridantang@gmail.com",
};

export default meta;

export const DeviceReports = {
  render: () => <DeviceReport />,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
    },
  },
};

export const CountryReports = {
  render: () => <CountryReport />,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
    },
  },
};

export const AccountManagers = {
  render: () => (
    <AccountManager
      first_name={report.first_name}
      last_name={report.last_name}
      mail={report.mail}
    />
  ),
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
    },
  },
};
export const Charts = {
  render: () => <DashboardCharts />,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
    },
  },
};
export const impression = {
  render: () => (
    <div className="mb-1 w-60 rounded-2xl bg-white px-2 pt-3 shadow-sm md:px-6">
      <div className="text-sm font-semibold text-[#2262C6] md:text-base">
        Impression{" "}
        <span className="hidden text-xs font-normal text-[#B9B9B9] md:inline-flex md:text-sm">
          {" "}
          ( Last 6 Month)
        </span>
      </div>
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex h-12 items-center">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
              >
                <path
                  d="M6.66685 13.0001L6.66685 3.27612L10.1955 6.80479L11.1382 5.86212L6.00018 0.724121L0.862183 5.86212L1.80485 6.80479L5.33352 3.27612L5.33352 13.0001L6.66685 13.0001Z"
                  fill="#50B8B6"
                />
              </svg>
            </div>
            <span className="ml-1 text-xl font-bold md:ml-3">10</span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-around border-t border-gray-200 pb-2">
        <div>
          <p className="mt-1 text-xs text-[#404040]">Last Month</p>
          <p className="text-center text-sm font-bold text-[#1A1A1A]">440</p>
        </div>
        <div className="border-r "></div>
        <div>
          <p className="mt-1 text-xs text-[#404040]">This Month</p>
          <p className="text-center text-sm font-bold text-[#1A1A1A]">210</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=1210-28142&t=ljE9QCN43WSsoBp3-0",
    },
  },
};
