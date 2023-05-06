import { createColumnHelper } from "@tanstack/react-table";
import "react-datepicker/dist/react-datepicker.css";
import type { TranslateReportFakeType } from "../../../server/db-types";
import { ReportControl } from "@/components/affiliates/reports/report-control";
import { SearchText } from "@/components/common/search/search-text";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import { api } from "@/utils/api";
import { useSearchContext } from "@/components/common/search/search-context";
import { DateColumn } from "@/components/common/data-table/available-column";
import { usePagination } from "@/components/common/data-table/pagination-hook";
import { getDateRange } from "@/components/common/search/search-date-range";

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
    values: { search, dates },
  } = useSearchContext();
  const pagination = usePagination();
  const { name, ...dateRange } = getDateRange(dates);

  const { data, isRefetching } = api.affiliates.getTranslateReportFake.useQuery(
    {
      ...dateRange,
      search,
      pageParams: pagination.pageParams,
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  console.log(`muly:FakeTranslationReport`, { data, pagination });

  return (
    <ReportControl
      reportName="Fake Translation Report"
      // totalItems={data.length || 0}
      report={data}
      columns={columns}
      pagination={pagination}
      isRefetching={isRefetching}
      handleExport={(exportType: ExportType) => Promise.resolve("ok")}
    >
      <SearchText label="Search" varName="search" />
    </ReportControl>
  );
};
