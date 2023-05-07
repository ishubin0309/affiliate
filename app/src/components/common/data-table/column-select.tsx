import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type SelectedColumnList = Record<string, boolean>;

interface Props<Data extends object> {
  reportsColumns?: string[];
  columns: ColumnDef<any, any>[];
  selectColumnsMode: SelectedColumnList | null;
  setSelectColumnsMode: (selectedStatus: SelectedColumnList | null) => void;
}

export const ColumnSelect = <Data extends object>({
  reportsColumns,
  columns,
  setSelectColumnsMode,
  selectColumnsMode,
}: Props<Data>) => {
  const handleColumnChange = (fieldName: string, checked: boolean) => {
    if (selectColumnsMode) {
      setSelectColumnsMode({ ...selectColumnsMode, [fieldName]: checked });
    }
  };

  return (
    <div
      className={cn(
        "mt-4 overflow-hidden transition-all duration-500",
        { "h-52 md:h-44 lg:h-36 xl:h-28": !!selectColumnsMode },
        { "h-0": !selectColumnsMode }
      )}
    >
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-white p-4 shadow-md md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
        {columns.map((item) => {
          const name = String(item.header);
          return (
            <div className="flex items-center space-x-2" key={name}>
              <Checkbox
                className="mr-2 h-[18px] w-[18px] whitespace-nowrap"
                id={name}
                name={name}
                checked={!!selectColumnsMode && !!selectColumnsMode[name]}
                onCheckedChange={(checked: boolean) => {
                  handleColumnChange(name, checked);
                }}
              />
              <label
                htmlFor={name}
                className="cursor-pointer text-sm font-medium leading-none"
              >
                {name}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const getColumnsBySetup = <Data,>(
  columns: ColumnDef<Data, any>[],
  reportsColumns?: string[]
): ColumnDef<Data, any>[] => {
  if (!columns || !columns.length || !columns[0]) return [];

  const filteredColumns = columns.filter(
    (item: any) => !reportsColumns?.includes(String(item.header))
  );

  return filteredColumns.length ? filteredColumns : [columns[0]];
};
