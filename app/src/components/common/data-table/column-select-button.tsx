import { Button } from "@/components/ui/button";
import { SaveIcon, SettingsIcon } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import type { ColumnDef } from "@tanstack/react-table";
import type { SelectedColumnList } from "@/components/common/data-table/column-select";

interface Props {
  columns: ColumnDef<any, any>[];
  reportsColumns?: string[];
  reportName: string;
  selectColumnsMode: SelectedColumnList | null;
  setSelectColumnsMode: (selectedStatus: SelectedColumnList | null) => void;
}

export const ColumnSelectButton = ({
  columns,
  selectColumnsMode,
  setSelectColumnsMode,
  reportName,
  reportsColumns,
}: Props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const upsertReportsColumns =
    api.affiliates.upsertReportsColumns.useMutation();

  const apiContext = api.useContext();

  const handleSelectMode = async () => {
    if (!selectColumnsMode) {
      /// reverse logic
      const selected: SelectedColumnList = {};
      columns.forEach((item) => {
        const name = String(item.header);
        const exclude = reportsColumns?.includes(name);
        selected[name] = !exclude;
      });
      setSelectColumnsMode(selected);
    } else {
      setIsLoading(true);
      try {
        const excludedFields: string[] = [];
        Object.keys(selectColumnsMode).forEach((name) => {
          if (!selectColumnsMode[name]) {
            excludedFields.push(name);
          }
        });
        const columns = await upsertReportsColumns.mutateAsync({
          level: "affiliate",
          report: reportName,
          fields: excludedFields,
        });

        apiContext.affiliates.getReportsColumns.setData(
          { level: "affiliate", report: reportName },
          columns
        );
        setSelectColumnsMode(null);
        toast({
          title: "Saved " + reportName + " Setup",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      variant="primary"
      size="rec"
      onClick={handleSelectMode}
      isLoading={isLoading}
    >
      {!!selectColumnsMode ? <SaveIcon className="w-4" /> : <SettingsIcon />}
    </Button>
  );
};
