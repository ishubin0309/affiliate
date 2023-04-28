import { ExportButton } from "@/components/affiliates/reports/export-button";
import type { OnExport } from "@/components/affiliates/reports/utils";
import { Loading } from "@/components/common/Loading";
import type { ReportDataTableProps } from "@/components/common/data-table/ReportDataTable";
import { ReportDataTable } from "@/components/common/data-table/ReportDataTable";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { SearchDateRange } from "@/components/common/search/search-date-range";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { SettingsIcon } from "lucide-react";
import React from "react";

interface Props<Data extends object> extends ReportDataTableProps<Data> {
  reportName: string;
  isRefetching: boolean;
  totalItems: number;
  children: React.ReactNode;

  handleExport: OnExport;
}

export const ReportControl = <Data extends object>({
  children,
  totalItems,
  reportName,
  isRefetching,
  data,
  columns,
  footerData,
  handleExport,
}: Props<Data>) => {
  const pageSize = 50; // Should be from SearchContext
  const pageCount = Math.ceil(totalItems / pageSize);

  console.log("page size ------>", pageSize);
  console.log("page count ------>", pageCount);

  return data ? (
    <div className="flex w-full flex-col gap-2">
      <PageHeader title="Reports" subTitle={reportName}>
        <div className="flex flex-row gap-2">
          <ExportButton onExport={handleExport} />
          <Button variant="primary" size="rec">
            <SettingsIcon />
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-row flex-wrap items-end gap-2 pb-3">
        <SearchDateRange varName="dateRange" />
        {children}
        <div className="flex-grow" />
        <SearchApply isLoading={isRefetching} />
      </div>

      <ReportDataTable data={data} columns={columns} footerData={footerData} />
      <div className="grid grid-cols-2 gap-2">
        <Pagination count={pageCount} variant="focus" totalItems={totalItems} />
      </div>
    </div>
  ) : (
    <Loading />
  );
};
