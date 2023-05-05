import DatePicker from "react-datepicker";
import {
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  sub,
} from "date-fns";
import { Calendar } from "lucide-react";
import { queryTypes, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import { useState } from "react";
import { SelectInput } from "@/components/common/select-input";
// import { DatePicker } from "./datepicker/Datepicker";

export type DateRange =
  | "today"
  | "yesterday"
  | "this-week"
  | "month-to-date"
  | "last-month"
  | "last-6-month"
  | "year-to-date"
  | "last-year";

type CustomDateRange = DateRange | "custom";

export const dateRangeChoices = [
  { id: "today", title: "Today" },
  { id: "yesterday", title: "Yesterday" },
  { id: "this-week", title: "This Week" },
  { id: "month-to-date", title: "Month to Date" },
  { id: "last-month", title: "Last Month" },
  { id: "last-6-month", title: "Last 6 Month" },
  { id: "year-to-date", title: "Year to Date" },
  { id: "last-year", title: "Last Year" },
  { id: "custom", title: "Custom" },
];

const formatValueDateRange = (
  from: Date | null | undefined,
  to: Date | null | undefined
) => {
  return `${format(
    from || sub(new Date(), { months: 6 }),
    "yyyyMMdd"
  )}-${format(to || new Date(), "yyyyMMdd")}`;
};

const getPredefinedDateRange = (value?: string | null) => {
  const setRange = (value: CustomDateRange, from: Date, to: Date) => ({
    name: value,
    from,
    to,
  });

  // console.log(`muly:handleSelectDateRange ${value}`, {});
  const today = new Date();
  let range;
  if (value === "today") {
    range = setRange(value, today, today);
  } else if (value === "yesterday") {
    const yesterday = sub(today, { days: 1 });
    range = setRange(value, yesterday, yesterday);
  } else if (value === "this-week") {
    range = setRange(value, startOfWeek(today), today);
  } else if (value === "month-to-date") {
    range = setRange(value, startOfMonth(today), today);
  } else if (value === "last-month") {
    range = setRange(
      value,
      startOfMonth(sub(today, { months: 1 })),
      endOfMonth(sub(today, { months: 1 }))
    );
  } else if (value === "year-to-date") {
    range = setRange(value, startOfYear(today), today);
  } else if (value === "last-year") {
    range = setRange(
      value,
      startOfYear(sub(today, { years: 1 })),
      endOfYear(sub(today, { years: 1 }))
    );
  } /* if (value === "last-6-month") */ else {
    range = setRange(
      "last-6-month",
      startOfMonth(sub(today, { months: 6 })),
      endOfMonth(sub(today, { months: 1 }))
    );
  }

  return range;
};

export const getDateRange = (value?: string) => {
  let range;
  const regex = /^(\d{8})-(\d{8})$/gm;

  if (value && regex.exec(value)) {
    // console.log(`muly:getDateRange parse dates, are they? ${value}`, {
    //   re: regex.exec(value),
    // });
    const [fromS, toS] = (value || "").split("-");

    const from = parse(fromS || "", "yyyyMMdd", new Date());
    const to = parse(toS || "", "yyyyMMdd", new Date());

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      range = getPredefinedDateRange("last-6-month");
    } else {
      range = {
        name: "custom",
        from,
        to,
      };
    }
  } else {
    range = getPredefinedDateRange(value);
  }

  return {
    name: range.name,
    from: startOfDay(range.from),
    to: endOfDay(range.to),
  };
};

interface Props {
  range?: DateRange;
}

export const useDateRange = (defaultRange?: DateRange) => {
  const router = useRouter();
  const { dates } = router.query;

  const value = String(dates);
  // console.log(value);
  return getDateRange(value || defaultRange || "last-6-month");
};

export const useDateRangeDefault = (defaultRange?: string) => {
  // const router = useRouter();
  // const { dates } = router.query;
  // const value = String(dates);
  return getDateRange(defaultRange);
};

export const DateRangeSelect = ({ range: defaultRange }: Props) => {
  const range = defaultRange || "last-6-month";
  const [value, setValue] = useQueryState(
    "dates",
    queryTypes.string.withDefault(range)
  );

  const { name, from, to } = getDateRange(value);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const setDateRange = async (from: Date | null, to: Date | null) => {
    return setValue(formatValueDateRange(from, to));
  };

  const handleOnchage = async (fromDate: Date, toDate: Date) => {
    await setDateRange(fromDate, toDate);
  };

  const handleSelectDateRange = async (value: DateRange) => {
    console.log(value);

    await setValue(value);
  };

  // console.log(`muly:DateRangeSelect render ${name}`, { from, to });

  const month: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <div>
        <div className="relative my-1 mr-2 inline-block lg:my-0">
          <SelectInput
            choices={dateRangeChoices}
            value={name}
            onChange={(value) => {
              if (value !== "custom") {
                void handleSelectDateRange(value as DateRange);
              }
            }}
            placeholder="Select date range"
            icon={<Calendar className="h-4 w-4 opacity-50 ml-2" />}
          />
        </div>

        {/* <div
              className="ml-2 flex cursor-pointer items-center justify-center rounded border border-[#D7D7D7] bg-white p-2 text-xs md:px-4 md:text-base"
              onClick={onOpen}
            >
              {from.getDate()} {month[from.getMonth()]} {from.getFullYear()}{" "}
              &nbsp;&nbsp; TO &nbsp;&nbsp;
              {to.getDate()} {month[to.getMonth()]} {to.getFullYear()}
            </div> */}

        <div className="inline-block">
          <div className="inline-block">
            <div className="customDatePickerStyling my-1 flex cursor-pointer items-center justify-center rounded border border-[#D7D7D7] bg-white p-2 text-xs md:px-4 md:text-sm lg:my-0">
              <DatePicker
                selected={from}
                onChange={async (date: Date) => {
                  setFromDate(date);
                  await handleOnchage(date, to);
                }}
              ></DatePicker>
            </div>
          </div>
          <label className="px-1 text-sm text-[#525252]">To</label>
          <div className="inline-block">
            <div className="customDatePickerStyling my-1 flex cursor-pointer items-center justify-center rounded border border-[#D7D7D7] bg-white p-2 text-xs md:px-4 md:text-sm lg:my-0">
              <DatePicker
                selected={to}
                onChange={async (date: Date) => {
                  setToDate(date);
                  await handleOnchage(from, date);
                }}
              ></DatePicker>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
