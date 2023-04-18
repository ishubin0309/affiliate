import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { exportOptions } from "@/components/affiliates/reports/utils";
import { useState } from "react";
import type { ItemProps } from "@/components/affiliates/reports/QuickSummaryReport";
import type { ExportType } from "@/server/api/routers/affiliates/reports/reports-utils";
import JsFileDownloader from "js-file-downloader";

interface Props {
  onExport: (exportType: ExportType) => Promise<string | undefined>;
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="primary-outline">
            {/*Export{" "}*/}
            {/*{Object.keys(selectedValue).length > 0*/}
            {/*  ? ` ${selectedValue?.title}`*/}
            {/*  : ``}{" "}*/}
            <ChevronDownIcon className="ml-10" />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-40 min-w-[220px] rounded-md bg-white p-[10px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
            sideOffset={5}
            onChange={(event) => {
              console.log(event);
            }}
          >
            {exportOptions.map((item) => {
              return (
                <DropdownMenu.Item
                  key={item.id}
                  onSelect={() => setSelectedItem(item)}
                  className="text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 group relative flex h-[25px] select-none items-center rounded-[3px] px-[2px] py-5 pl-[25px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none"
                >
                  {item.title}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};