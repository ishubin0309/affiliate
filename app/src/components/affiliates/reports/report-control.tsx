import { ExportButton } from "@/components/affiliates/reports/export-button";
import type { OnExport } from "@/components/affiliates/reports/utils";
import { Loading } from "@/components/common/Loading";
import type { ReportDataTableProps } from "@/components/common/data-table/ReportDataTable";
import { ReportDataTable } from "@/components/common/data-table/ReportDataTable";
import type { usePagination } from "@/components/common/data-table/pagination-hook";
import { PageHeader } from "@/components/common/page/page-header";
import { SearchApply } from "@/components/common/search/saerch-apply-button";
import { SearchDateRange } from "@/components/common/search/search-date-range";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { SaveIcon, SettingsIcon } from "lucide-react";
import React, { useState } from "react";

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectColumnsMode, setSelectColumnsMode] = useState<string[] | null>(
    null
  );

  const handleColumnChange = (fieldName: string, checked: boolean) => {
    if (selectColumnsMode) {
      if (checked) {
        setSelectColumnsMode([...selectColumnsMode, fieldName]);
      } else {
        setSelectColumnsMode(
          selectColumnsMode.filter((item) => item !== fieldName)
        );
      }
    }
  };

  const apiContext = api.useContext();
  const { data: reportsColumns } = api.affiliates.getReportsColumns.useQuery(
    { level: "affiliate", report: reportName },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const upsertReportsColumns =
    api.affiliates.upsertReportsColumns.useMutation();

  const handleSelectMode = async () => {
    setIsLoading(true);
    try {
      if (selectColumnsMode) {
        const columns = await upsertReportsColumns.mutateAsync({
          level: "affiliate",
          report: reportName,
          fields: selectColumnsMode || [],
        });

        apiContext.affiliates.getReportsColumns.setData(
          { level: "affiliate", report: reportName },
          columns
        );
      }
      setSelectColumnsMode(selectColumnsMode ? null : reportsColumns || []);
      toast({
        title: "Saved " + reportName + " Setup",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return report ? (
    <div className="flex w-full flex-col gap-2">
      <PageHeader title="Reports" subTitle={reportName}>
        <div className="flex flex-row gap-2">
          <ExportButton onExport={handleExport} />
          <Button
            variant="primary"
            size="rec"
            onClick={handleSelectMode}
            isLoading={isLoading}
          >
            {selectColumnsMode ? (
              <SaveIcon className="w-4" />
            ) : (
              <SettingsIcon />
            )}
          </Button>
        </div>
      </PageHeader>

      <div className="flex flex-row flex-wrap items-end gap-2 pb-3">
        <SearchDateRange />
        {children}
        <div className="flex-grow" />
        <SearchApply isLoading={isRefetching} />
      </div>

      <div
        className={`mt-4 overflow-hidden transition-all duration-500	 ${
          selectColumnsMode ? "h-52 md:h-28" : "h-0"
        }`}
      >
        <div className="bg-white p-4 shadow">
          {columns.map((item: any) => (
            <div className="mr-5 inline-block" key={item.accessorKey}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="h-[18px] w-[18px]"
                  id={item.accessorKey}
                  name={item.accessorKey}
                  checked={selectColumnsMode?.includes(item.accessorKey)}
                  onCheckedChange={(checked: boolean) => {
                    handleColumnChange(item.accessorKey, checked);
                  }}
                />
                <label
                  htmlFor={item.header}
                  className="cursor-pointer text-sm font-medium leading-none"
                >
                  {item.header}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      {report.pageInfo.totalItems > 0 ? (
        <ReportDataTable
          report={report}
          columns={columns.filter((item: any) =>
            reportsColumns?.includes(item.accessorKey)
          )}
          footerData={footerData}
        />
      ) : (
        <div className="flex h-40 items-center justify-center">
          No results to display.
        </div>
      )}
      {report.pageInfo.totalItems > report.pageInfo.pageSize && (
        <div className="grid grid-cols-2 gap-2">
          <Pagination
            pagination={pagination}
            totalItems={report.pageInfo.totalItems}
          />
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};
