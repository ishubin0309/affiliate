import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import type { ColumnDef } from "@tanstack/react-table";
import { SaveIcon } from "lucide-react";
import React, { useRef, useState } from "react";
export type SelectedColumnList = Record<string, boolean>;

interface Props<Data extends object> {
  reportsColumns?: string[];
  reportName: string;
  columns: ColumnDef<any, any>[];
  selectColumnsMode: SelectedColumnList | null;
  setSelectColumnsMode: (selectedStatus: SelectedColumnList | null) => void;
}

export const ColumnSelect = <Data extends object>({
  reportsColumns,
  columns,
  setSelectColumnsMode,
  reportName,
  selectColumnsMode,
}: Props<Data>) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const upsertReportsColumns =
    api.affiliates.upsertReportsColumns.useMutation();

  const apiContext = api.useContext();

  const handleSelectMode = async () => {
    if (!selectColumnsMode) {
      /// reverse logic
      const selected: SelectedColumnList = {};
      columns.forEach((item) => {
        const name = String(item.header);
        const exclude = reportsColumns?.includes(name);
        selected[name] = !exclude;
      });
      setSelectColumnsMode(selected);
    } else {
      setIsLoading(true);
      try {
        const excludedFields: string[] = [];
        Object.keys(selectColumnsMode).forEach((name) => {
          if (!selectColumnsMode[name]) {
            excludedFields.push(name);
          }
        });
        const columns = await upsertReportsColumns.mutateAsync({
          level: "affiliate",
          report: reportName,
          fields: excludedFields,
        });

        apiContext.affiliates.getReportsColumns.setData(
          { level: "affiliate", report: reportName },
          columns
        );
        setSelectColumnsMode(null);
        toast({
          title: "Saved " + reportName + " Setup",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleColumnChange = (fieldName: string, checked: boolean) => {
    if (selectColumnsMode) {
      setSelectColumnsMode({ ...selectColumnsMode, [fieldName]: checked });
    }
  };

  React.useEffect(() => {
    const element = elementRef.current;
    if (element !== null) {
      if (selectColumnsMode) {
        const contentHeight = element.scrollHeight + 33;
        element.style.height = `${contentHeight}px`;
      } else {
        element.style.height = `${0}px`;
      }
    }
  }, [selectColumnsMode]);

  return (
    <div
      ref={elementRef}
      className={cn(
        "mt-4 overflow-hidden bg-white shadow-md transition-all duration-500",
        { "p-4": !!selectColumnsMode },
        { "h-0": !selectColumnsMode }
      )}
    >
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8">
        {columns.map((item) => {
          const name = String(item.header);
          return (
            <div className="flex items-center space-x-2" key={name}>
              <Checkbox
                className="h-[18px] w-[18px] whitespace-nowrap"
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
      <div className={"mt-4 items-end justify-end md:flex"}>
        <div className="flex items-end justify-center md:justify-end">
          <div className="ml-2">
            <Button
              variant="primary"
              size="rec"
              onClick={handleSelectMode}
              isLoading={isLoading}
            >
              <SaveIcon className="w-4" />
            </Button>
          </div>
        </div>
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
