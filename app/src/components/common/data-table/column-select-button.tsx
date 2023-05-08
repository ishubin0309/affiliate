import type { SelectedColumnList } from "@/components/common/data-table/column-select";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { SettingsIcon } from "lucide-react";

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
      setSelectColumnsMode(null);
    }
  };

  return (
    <Button variant="primary" size="rec" onClick={handleSelectMode}>
      <SettingsIcon />
    </Button>
  );
};
