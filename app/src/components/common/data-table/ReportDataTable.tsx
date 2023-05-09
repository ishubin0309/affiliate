import { cn } from "@/lib/utils";
import type { PageInfo } from "@/server/api/routers/affiliates/reports/reports-utils";
import type {
  ColumnDef,
  ColumnSort,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import * as React from "react";
import { useSearchContext } from "../search/search-context";

export type ReportDataTableProps<Data extends object> = {
  report:
    | { data: Data[] | null | undefined; pageInfo: PageInfo; totals?: any }
    | null
    | undefined;
  columns: ColumnDef<Data, any>[];
  footerData?: any;
};

export function ReportDataTable<Data extends object>({
  report,
  columns,
  footerData = [],
}: ReportDataTableProps<Data>) {
  const { setControlValue, controlValue, apply } = useSearchContext();
  const sorting = React.useMemo(() => {
    const _sorting: SortingState =
      controlValue.sorting && controlValue.sorting !== undefined
        ? JSON.parse(controlValue.sorting).map((x: ColumnSort) => x)
        : [];
    return _sorting;
  }, [controlValue.sorting]);

  const onSortingChange = (sortingInfo: any) => {
    const cur_sorting = sortingInfo();
    let existing_sorting = [...sorting];
    let new_sorting: ColumnSort[] = [];
    const matched_sort_index = existing_sorting.findIndex(
      (x) => x.id === cur_sorting[0].id
    );
    // console.log(matched_sort_index);
    if (matched_sort_index >= 0) {
      let matched_sort = { ...existing_sorting[matched_sort_index] };
      existing_sorting = existing_sorting.filter(
        (x, index) => index !== matched_sort_index
      );

      if (matched_sort?.desc === false) {
        matched_sort.desc = true;
        new_sorting = [{ ...matched_sort } as ColumnSort, ...existing_sorting];
      } else {
        new_sorting = existing_sorting;
      }
    } else {
      new_sorting = [...cur_sorting, ...existing_sorting];
    }

    // console.log("**********NEW SORTING", JSON.stringify(new_sorting));
    setControlValue("sorting", JSON.stringify(new_sorting));
    apply();
  };

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: report?.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: onSortingChange,
    getSortedRowModel: getSortedRowModel(),
    // state: {
    //   sorting: sorting,
    // },
    // manualPagination: true,
    // initialState: { pagination: { pageSize: 50, pageIndex: 0 } },
  });

  const headers = [];
  return (
    <div className="scrollbar-thin relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          {getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border border-[#F0F0F0] bg-[#F2F5F7] text-left"
            >
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta = header.column.columnDef.meta;
                headers.push(header.column.columnDef.header);
                const matched_sort = sorting.find(
                  (x) => x.id === header.column.id
                );
                let sorted = "";
                if (matched_sort) {
                  sorted = matched_sort.desc == true ? "desc" : "asc";
                } else {
                  sorted = "";
                }
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="border"
                  >
                    <div className="text=[#323232] flex p-2 text-sm">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <span className="flex items-center pl-2">
                        {sorted !== "" ? (
                          sorted === "desc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : null}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={cn([{ "bg-[#F9FAFF]": index % 2 === 0 }])}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta;
                return (
                  <td
                    key={cell.id}
                    className={cn("border px-2 py-1 text-sm text-[#404040]", {
                      // @ts-ignore
                      "text-right": meta?.isNumeric,
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

        {/*{footerData && (*/}
        {/*  <tfoot className="px-3 py-3">*/}
        {/*    <tr className="py-5">*/}
        {/*      <td>Total</td>*/}
        {/*      {footerData.length > 0 &&*/}
        {/*        Object.values(footerData[0]).map((item: any, key) => {*/}
        {/*          return <td key={key}>{item}</td>;*/}
        {/*        })}*/}
        {/*    </tr>*/}
        {/*  </tfoot>*/}
        {/*)}*/}
      </table>
    </div>
  );
}
