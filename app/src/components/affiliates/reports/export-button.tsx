import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import type { OnExport } from "@/components/affiliates/reports/utils";
import { exportOptions } from "@/components/affiliates/reports/utils";
import { useState } from "react";
import type { ItemProps } from "@/components/affiliates/reports/QuickSummaryReport";
import JsFileDownloader from "js-file-downloader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onExport: OnExport;
}

export const ExportButton = ({ onExport }: Props) => {
  const [selectedValue, setSelectedItem] = useState<ItemProps>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const link = await onExport("csv"); // selectedValue.id);

      if (link) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const download = new JsFileDownloader({ url: link, autoStart: false });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await download.start();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row">
      <Button onClick={handleExport} isLoading={isLoading}>
        Export
      </Button>
      <div className="text-red-500">TBD</div>
    </div>
  );
};
