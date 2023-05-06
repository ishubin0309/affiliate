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
import { Button } from "@/components/ui/button";

interface IProps {
  allowTyping: boolean;
}

export function CalendarDatePicker({ allowTyping }: IProps) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [inputValue, setInputValue] = React.useState<string>("");

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    let value = event.target.value;
    if (/\D\/$/.test(value)) value = value.substring(0, value.length - 3);
    let values = value.split("/").map(function (v) {
      return v.replace(/\D/g, "");
    });
    if (values[0]) values[0] = checkValue(values[0], 12);
    if (values[1]) values[1] = checkValue(values[1], 31);
    let output = values.map(function (v: any, i) {
      const d = new Date().getFullYear() % 100;
      if (i == 0 && v.length == 2) {
        return v + " / ";
      } else if (i == 1 && v.length == 2) {
        return v + " / ";
      } else if (i == 2 && v.length == 2 && Number(v) > d + 5) {
        return 19 + v;
      } else if (i == 2 && v.length == 2 && Number(v) < d + 5 && v !== "20") {
        return 20 + v;
      } else if (i == 2 && v.length == 4 && Number(v?.slice(2, 4)) > d + 5) {
        return new Date().getFullYear() + 5;
      } else {
        return v;
      }
    });

    if (output[2]?.length === 3 && output[2]?.slice(0, 2) !== "20") {
      value = output.join("").substring(0, 10);
    } else {
      value = output.join("").substring(0, 14);
    }
    setInputValue(value);
    if (value.length > 9) {
      const checkDate = new Date(value);
      setDate(checkDate);
    } else {
      console.log("Invalid input value format");
    }
  }

  function checkValue(str: string, max: number) {
    if (str.charAt(0) !== "0" || str == "00") {
      var num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) num = 1;
      str =
        num > parseInt(max.toString().charAt(0)) && num.toString().length == 1
          ? "0" + num
          : num.toString();
    }
    return str;
  }

  function formatDate(date: Date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("/");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const element = document.getElementById("day-picker-input");
    if (event.key === " ") {
      element?.click();
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {!allowTyping ? (
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        ) : (
          <div style={{ position: "relative" }}>
            <Input
              type="text"
              id="day-picker-input"
              placeholder="MM/DD/YYYY"
              className={cn(" w-[280px] justify-start text-left font-normal")}
              style={{ wordSpacing: "-3px" }}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
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
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          showOutsideDays={true}
          today={date}
          onSelect={(event: any) => {
            const d = formatDate(event);
            event ? setInputValue(d) : setInputValue("");
            setDate(event);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
