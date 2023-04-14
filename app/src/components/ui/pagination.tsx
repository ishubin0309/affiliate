"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import * as React from "react";

import { queryTypes, useQueryState } from "next-usequerystate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface PaginationProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: any;
  count: number;
  variant?: string;
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
const Pagination = React.forwardRef<HTMLInputElement, PaginationProps>(
  ({ error, className, variant, ...props }, ref) => {
    const [currentPage, setCurrentPage] = useQueryState(
      "currentPage",
      queryTypes.integer.withDefault(1)
    );
    const [itemsPerPage, setItemPerPage] = useQueryState(
      "itemsPerPage",
      queryTypes.integer.withDefault(10)
    );

    const paginate = (event: any, type: string) => {
      if (type === "increase") {
        void setCurrentPage((currentPage) => currentPage + 1);
      } else if (type === "decrease") {
        void setCurrentPage((currentPage) => currentPage - 1);
      } else {
        void setCurrentPage(event);
      }
    };
    const handleChange = (e: any) => {
      void setItemPerPage(e);
    };
    const pages = [];
    const page =
      props.totalItems / itemsPerPage < 1 ? 1 : props.totalItems / itemsPerPage;
    for (let i = 1; i <= page; i++) {
      pages.push(i);
    }

    // console.log("items per page ", props.totalItems / props.itemsPerPage);
    return (
      <nav
        className="flex items-center justify-start space-x-2"
        ref={ref}
        {...props}
      >
        <a
          onClick={(event) => paginate(event, "decrease")}
          className="inline-flex items-center gap-2 rounded-md p-4 text-gray-500 hover:text-blue-600"
        >
          <ChevronsLeft />
        </a>

        {pages.map((item, key) => {
          return (
            <a
              className={
                item === currentPage
                  ? cn(paginationVariants({ variant: "focus" }))
                  : cn(paginationVariants({ variant: "secondary" }))
              }
              onClick={(event) => paginate(item, "onpoint")}
              aria-current="page"
              key={key}
            >
              {item}
            </a>
          );
        })}
        <a
          onClick={(event) => paginate(event, "increase")}
          className="inline-flex items-center gap-2 rounded-md p-4 text-gray-500 hover:text-blue-600"
        >
          <ChevronsRight />
        </a>

        <div className="mt-2">
          <Select onValueChange={handleChange}>
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
  }
);
Pagination.displayName = "Pagination";

export { Pagination };
