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
import type { usePagination } from "@/components/common/data-table/pagination-hook";

interface Props<Data extends object> extends ReportDataTableProps<Data> {
  reportName: string;
  isRefetching: boolean;
  children: React.ReactNode;
  handleExport: OnExport;
  pagination: ReturnType<typeof usePagination>;
}

export const ReportControl = <Data extends object>({
  children,
  reportName,
  isRefetching,
  report,
  columns,
  pagination,
  footerData,
  handleExport,
}: Props<Data>) => {
  return report ? (
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

      <ReportDataTable
        report={report}
        columns={columns}
        footerData={footerData}
      />
      <div className="grid grid-cols-2 gap-2">
        <Pagination
          pagination={pagination}
          totalItems={report.pageInfo.totalItems}
        />
      </div>
    </div>
  ) : (
    <Loading />
  );
};
