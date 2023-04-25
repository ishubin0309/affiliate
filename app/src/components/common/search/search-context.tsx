import React, { useMemo, useRef, useState } from "react";
import { format, parse, startOfDay, sub } from "date-fns";

interface SearchContextInterface {
  values: Record<string, string>;
  controlValue: Record<string, string>;
  setControlValue: (key: string, value: string) => void;
  apply: () => void;
}

export const SearchContext = React.createContext<SearchContextInterface>({
  values: {},
  controlValue: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setControlValue: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  apply: () => {},
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const { from, to } = useMemo(() => {
    const now = startOfDay(new Date());
    const from = format(sub(now, { months: 6 }), "yyyyMMdd");
    const to = format(now, "yyyyMMdd");
    return { from, to };
  }, []);

  const [values, setValues] = useState<SearchContextInterface["values"]>({
    from,
    to,
  });
  const valueRef = useRef<SearchContextInterface["values"]>({});

  const setControlValue = (key: string, value: string) => {
    valueRef.current[key] = value;
  };

  const apply = () => {
    setValues({ ...valueRef.current });
  };

  console.log(`muly:SearchProvider`, { from, to });
  return (
    <SearchContext.Provider
      value={{ values, controlValue: valueRef.current, setControlValue, apply }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};

export const getDateParam = (value?: string) =>
  parse(value || "", "yyyyMMdd", new Date());

export const getNumberParam = (value?: string) =>
  value ? Number(value) : undefined;
