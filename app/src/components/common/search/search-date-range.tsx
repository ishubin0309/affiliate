import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSearchContext } from "@/components/common/search/search-context";
import { sub } from "date-fns";

interface Props {
  varName: string;
  label?: string;
}

export const SearchDateRange = ({ varName, label }: Props) => {
  const { setControlValue, controlValue } = useSearchContext();
  const [value, setValue] = useState(controlValue[varName] || "");

  return <div className="text-red-500">TBD - SELECT DATE RANGE - TBD</div>;
};

export const convertDateRangeToQuery = (value: string) => {
  return {
    from: sub(new Date(), { months: 6 }),
    to: new Date(),
  };
};
