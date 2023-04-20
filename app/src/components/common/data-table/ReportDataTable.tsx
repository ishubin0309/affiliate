import { cn } from "@/lib/utils";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import * as React from "react";

export type ReportDataTableProps<Data extends object> = {
  data: Data[] | null | undefined;
  columns: ColumnDef<Data, any>[];
  footerData?: any;
};

export function ReportDataTable<Data extends object>({
  data,
  columns,
  footerData = [],
}: ReportDataTableProps<Data>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // console.log(
  //   "header groups",
  //   getHeaderGroups(),
  //   "row data ---->",
  //   getRowModel()
  // );

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
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "desc" ? (
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

        {footerData && (
          <tfoot className="px-3 py-3">
            <tr className="py-5">
              <td>Total</td>
              {footerData.length > 0 &&
                Object.values(footerData[0]).map((item: any, key) => {
                  return <td key={key}>{item}</td>;
                })}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
