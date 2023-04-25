import type { ItemProps } from "@/components/affiliates/reports/QuickSummaryReport";
import type { OnExport } from "@/components/affiliates/reports/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import JsFileDownloader from "js-file-downloader";
import { useState } from "react";

export interface ExportOption {
  id: ExportType;
  title: string;
  icon?: any;
}
interface Props {
  options: ExportOption[];
  selectedOption?: ExportOption | null;
  onExport: OnExport;
}

export const ExportButton = ({ options, selectedOption, onExport }: Props) => {
  const [selectedValue, setSelectedItem] = useState<ItemProps>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async (id: ExportType) => {
    setIsLoading(true);
    try {
      const link = await onExport(id); // selectedValue.id);

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

  const renderDropdownMenu = (
    options: ExportOption[],
    onExport: Props["onExport"]
  ) => {
    return options.map((option: ExportOption, index: number) => {
      return (
        <DropdownMenuItem
          key={index.toString()}
          onClick={() => handleExport(option.id)}
        >
          {option.icon ?? ""}
          <span className="ml-2">{option.title ?? ""}</span>
        </DropdownMenuItem>
      );
    });
  };

  return (
    <div className="flex flex-row">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button isLoading={isLoading}>Export</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          {renderDropdownMenu(options, onExport)}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="text-red-500">TBD</div>
    </div>
  );
};
