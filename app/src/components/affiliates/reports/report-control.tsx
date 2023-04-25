import { PageHeader } from "@/components/common/page/page-header";
import { SearchText } from "@/components/common/search/search-text";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { DataTable } from "@/components/common/data-table/DataTable";
import { Loading } from "@/components/common/Loading";
import React from "react";
import type { ReportDataTableProps } from "@/components/common/data-table/ReportDataTable";
import { ReportDataTable } from "@/components/common/data-table/ReportDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { SearchDateRange } from "@/components/common/search/search-date-range";
import { Pagination } from "@/components/ui/pagination";
import { SearchSelect } from "@/components/common/search/search-select";
import { ExportButton } from "@/components/affiliates/reports/export-button";
import type { OnExport } from "@/components/affiliates/reports/utils";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

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

  return data ? (
    <div className="flex w-full flex-col gap-2">
      <PageHeader title="Reports" subTitle={reportName}>
        <SearchDateRange varName="dateRange" />
        <SearchApply isLoading={isRefetching} />
      </PageHeader>

      <div className="w-full flex-row flex-wrap justify-between gap-2 pb-3 md:flex">
        <div className="flex flex-row gap-2">{children}</div>
        <div className="flex flex-row gap-2">
          <ExportButton onExport={handleExport} />
          <Button variant="primary" size="rec">
            <SettingsIcon />
          </Button>
        </div>
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
