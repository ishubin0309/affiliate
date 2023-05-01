import { fakeTraderReportData } from "@/components/affiliates/reports/fake-trader-report-data";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import type {
  TraderReportType,
  TranslateReportFakeType,
} from "../../../server/db-types";
import { ReportControl } from "@/components/affiliates/reports/report-control";
import { SearchSelect } from "@/components/common/search/search-select";
import { SearchText } from "@/components/common/search/search-text";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { creativeType } from "@/components/affiliates/reports/TraderReports";
import { api } from "@/utils/api";
import { ClicksReportType } from "../../../server/db-types";
import {
  getDateParam,
  getNumberParam,
  useSearchContext,
} from "@/components/common/search/search-context";
import { parse, sub } from "date-fns";
import { DateColumn } from "@/components/common/data-table/available-column";
import { usePagination } from "@/components/common/data-table/pagination-hook";

const columnHelper = createColumnHelper<TranslateReportFakeType>();
const createColumn = (id: keyof TranslateReportFakeType, header: string) =>
  columnHelper.accessor(id, {
    cell: (info) => info.getValue(),
    header,
  });

const columns = [
  createColumn("id", "ID"),
  columnHelper.accessor("rdate", {
    cell: (info) => DateColumn(info.getValue()),
    header: "Date",
  }),
  createColumn("source", "Source"),
  createColumn("langENG", "Lang ENG"),
  createColumn("langRUS", "Lang RUS"),
  createColumn("langGER", "Lang GER"),
  createColumn("langFRA", "Lang FRA"),
  createColumn("langITA", "Lang ITA"),
  createColumn("langESP", "Lang ESP"),
  createColumn("langHEB", "Lang HEB"),
  createColumn("langARA", "Lang ARA"),
  createColumn("langCHI", "Lang CHI"),
  createColumn("langPOR", "Lang POR"),
  createColumn("langJAP", "Lang JAP"),
];

export const FakeTranslationReport = () => {
  const {
    values: { from, to, search },
  } = useSearchContext();
  const pagination = usePagination();

  const { data, isLoading } = api.affiliates.getTranslateReportFake.useQuery(
    {
      from: getDateParam(from),
      to: getDateParam(to),
      search,
      pageParams: pagination.pageParams,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  return (
    <ReportControl
      reportName="Fake Translation Report"
      // totalItems={data.length || 0}
      report={data}
      columns={columns}
      pagination={pagination}
      isRefetching={isLoading}
      handleExport={(exportType: ExportType) => Promise.resolve("ok")}
    >
      <SearchText label="Search" varName="search" />
    </ReportControl>
  );
};
