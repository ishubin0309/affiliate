import DatePicker from "react-datepicker";
import {
  FormControl,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
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

const getDateRange = (value?: string) => {
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

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <FormControl>
        <HStack>
          <div>
            <div className="relative inline-block">
              <select
                className="flex h-full cursor-pointer appearance-none items-center space-x-2 rounded border border-[#D7D7D7] bg-white py-4 pl-2 pr-8 text-xs md:py-2 md:pl-6 md:pr-14 md:text-base"
                placeholder="Select date range"
                value={name}
                onChange={(event) => {
                  if (event.target.value !== "custom") {
                    void handleSelectDateRange(event.target.value as DateRange);
                  }
                }}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="month-to-date">Month to Date</option>
                <option value="last-month">Last Month</option>
                <option value="last-6-month">Last 6 Month</option>
                <option value="year-to-date">Year to Date</option>
                <option value="last-year">Last Year</option>
                <option value="custom">Custom</option>
              </select>

              <div className="absolute right-2 -mt-9 cursor-pointer md:right-6 md:-mt-8 ">
                <Calendar className="h-6 w-6" />
              </div>
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
              <label className="float-left mt-2 px-0 text-sm font-medium text-[#525252] md:px-4">
                Start Date:
              </label>
              <div className="ml-2 flex cursor-pointer items-center justify-center rounded border border-[#D7D7D7] bg-white p-2 text-xs md:px-4 md:text-base">
                <DatePicker
                  selected={from}
                  onChange={async (date: Date) => {
                    setFromDate(date);
                    await handleOnchage(date, to);
                  }}
                ></DatePicker>
              </div>
            </div>

            <div className="inline-block">
              <label className="float-left mt-2 px-0 text-sm font-medium text-[#525252] md:px-4">
                End Date:
              </label>
              <div className="ml-2 flex cursor-pointer items-center justify-center rounded border border-[#D7D7D7] bg-white p-2 text-xs md:px-4 md:text-base">
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

          {/* <DatePicker
          selected={from}
          onChange={(date) => setDateRange(date, to)}
        />
        <DatePicker
          selected={to}
          onChange={(date) => setDateRange(from, date)}
        /> */}
        </HStack>
      </FormControl>
      <Modal isOpen={isOpen} size="3xl" onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent ml={4} mr={4}>
          <div className="flex items-end justify-between pl-6 pt-4 md:pl-8">
            <div className="font-medium text-[#282560]">Add Date</div>
            <Image
              alt="..."
              className="mr-4 h-10 w-10 rounded-full align-middle "
              src="/img/icons/close.png"
              onClick={onClose}
            />
          </div>

          <ModalBody>
            {/* <div className="mt-2 max-w-lg md:mt-7">
              <label className="px-0 text-sm font-medium text-[#525252] md:px-4">
                Start Date
              </label>
              <div className="px-0 pt-2 md:px-2">
                <DatePicker
                  date={fromDate}
                  onChange={setFromDate}
                  handleOnchage={handleOnchage}
                ></DatePicker>
              </div>
            </div>

            <div className="mt-2 max-w-lg pb-10 md:mt-7 md:pb-80">
              <label className="px-0 text-sm font-medium text-[#525252] md:px-4">
                End Date
              </label>
              <div className="px-0 pt-2 md:px-2">
                <DatePicker
                  date={toDate}
                  onChange={setToDate}
                  handleOnchage={handleOnchage}
                ></DatePicker>
              </div>
            </div> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
