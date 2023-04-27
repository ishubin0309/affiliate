import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function CalendarDatePicker() {
  const [date, setDate] = React.useState<Date>(new Date());
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (/\D\/$/.test(value)) value = value.substr(0, value.length - 3);
    let values = value.split("/").map(function (v) {
      return v.replace(/\D/g, "");
    });
    if (values[0]) values[0] = checkValue(values[0], 12);
    if (values[1]) values[1] = checkValue(values[1], 31);
    let output = values.map(function (v, i) {
      return v.length == 2 && i < 2 ? v + " / " : v;
    });
    value = output.join("").substr(0, 14);
    setInputValue(value);
    if (value.length > 9) {
      const checkDate = new Date(value);
      setDate(checkDate);
    } else {
      console.log("Invalid input value format");
    }
  };

  const checkValue = (str: any, max: any) => {
    if (str.charAt(0) !== "0" || str == "00") {
      var num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) num = 1;
      str =
        num > parseInt(max.toString().charAt(0)) && num.toString().length == 1
          ? "0" + num
          : num.toString();
    }
    return str;
  };

  const formatDate = (date: any) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("/");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div style={{ position: "relative" }}>
          <Input
            type="text"
            placeholder="MM/DD/YYYY"
            className={cn(" w-[280px] justify-start text-left font-normal")}
            style={{ wordSpacing: "-3px" }}
            value={inputValue}
            onChange={handleInputChange}
          />
          <CalendarIcon
            className="mr-2 h-4 w-4"
            style={{
              position: "absolute",
              right: "0",
              top: "13px",
              cursor: "pointer",
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          today={date}
          onSelect={(event: any) => {
            const d = formatDate(event);
            setInputValue(d);
            setDate(event);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
