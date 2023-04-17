import { Code2Icon, Copy } from "lucide-react";

import { Button } from "../../ui/button";
import { CreativeMaterialDialogComponent } from "./CreativeMaterialDialogComponent";

interface Props {
  values: valueProps[];
  file?: string;
  alt: string;
  url: string;
}

interface valueProps {
  title: string;
  value: string | undefined;
}

export const CreativeMaterialComponent = ({
  values,
  file,
  alt,
  url,
}: Props) => {
  return (
    <div className=" mb-5 rounded-xl bg-white p-4 shadow">
      <div className="mt-4 flex items-start">
        <div className="w-32 rounded-xl md:w-96">
          <img src={file} className="rounded-xl bg-cover" alt={alt} />
        </div>

        <CreativeMaterialDialogComponent values={values} url={url} />
      </div>
      <div className="mt-1 items-end md:mt-3 md:hidden">
        <div className="">
          <div className="mb-1 ml-2 text-xs font-medium text-[#525252]">
            Click URL
          </div>
          <div className="rounded border border-[#D7D7D7] bg-[#F9F9FF] py-2 px-3 text-sm font-medium text-[#666666] lg:w-96">
            {url}
          </div>
        </div>
        <div className="mt-5 flex items-end justify-center md:justify-end">
          <div className="">
            <div className="">
              <Button
                variant="azure"
                size="md"
                onClick={() => window.navigator.clipboard.writeText(url ?? "")}
              >
                <div className="text-white">Copy Click Url</div>
                <div className="ml-2 items-center">
                  <Copy className="h-4 w-4 text-white" />
                </div>
              </Button>
            </div>
          </div>
          <div className="ml-2">
            <div className="">
              <Button variant="azure-outline" size="md">
                Get HTML Code
                <div className="ml-2 items-center">
                  <Code2Icon className="h-5  w-5 text-[#282560]" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
