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
    <nav className="flex items-center justify-start space-x-0">
      <ReactPaginate
        breakLabel="..."
        nextLabel={<ChevronsRight />}
        onPageChange={handlePageClick}
        pageCount={pageCount}
        previousLabel={<ChevronsLeft />}
        renderOnZeroPageCount={null}
        activeClassName="paginate-item paginate-active"
        breakClassName="paginate-item paginate-break-me "
        containerClassName="paginate-pagination"
        disabledClassName="paginate-disabled-page"
        marginPagesDisplayed={2}
        nextClassName="paginate-item paginate-next"
        pageClassName="paginate-item paginate-pagination-page"
        pageRangeDisplayed={2}
        previousClassName="paginate-item paginate-previous"
      />

      <div className="mt-0">
        <Select onValueChange={handleChange} value={String(pageSize)}>
          <SelectTrigger >
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
