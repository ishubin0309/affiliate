"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import * as React from "react";
import ReactPaginate from "react-paginate";

import { queryTypes, useQueryState } from "next-usequerystate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useSearchContext } from "@/components/common/search/search-context";
import { usePaginationContext } from "@/components/common/data-table/paginagion-context";
import type { usePagination } from "@/components/common/data-table/pagination-hook";

export interface Props {
  pagination: ReturnType<typeof usePagination>;
  totalItems: number;
}

const paginationVariants = cva(
  "inline-flex h-10 w-10 items-center rounded-md",
  {
    variants: {
      variant: {
        focus: "bg-blue-500 p-4 text-sm font-medium text-white",
        secondary: "p-4 text-sm font-medium text-gray-500 hover:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "focus",
    },
  }
);
export const Pagination = ({
  pagination: {
    pageParams: { pageNumber, pageSize },
    setPageParams,
  },
  totalItems,
}: Props) => {
  const handleChange = (value: string) => {
    void setPageParams({ pageNumber: 1, pageSize: Number(value) });
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const pageNumber = selected + 1;
    setPageParams({ pageNumber, pageSize });
  };

  return (
    <nav className="flex items-center justify-start space-x-2">
      <ReactPaginate
        breakLabel="..."
        nextLabel=">>"
        onPageChange={handlePageClick}
        pageCount={pageCount}
        previousLabel="<<"
        renderOnZeroPageCount={null}
        activeClassName={"item active "}
        breakClassName={"item break-me "}
        containerClassName={"pagination"}
        disabledClassName={"disabled-page"}
        marginPagesDisplayed={2}
        nextClassName={"item next "}
        pageClassName={"item pagination-page "}
        pageRangeDisplayed={2}
        previousClassName={"item previous"}
      />

      <div className="mt-0">
        <Select onValueChange={handleChange} value={String(pageSize)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};
