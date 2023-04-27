import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { useToast } from "@/components/ui/use-toast";
import { Code2Icon, Copy, Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "../../ui/button";

interface Props {
  values: valueProps[];
  file?: string;
  alt?: string;
  url?: string;
  isOpen?: boolean;
  toggleShow?: boolean;
}

interface valueProps {
  title: string;
  value: string | undefined;
}

export const CreativeMaterialDialogComponent = ({
  values,
  file,
  alt,
  url,
  isOpen,
  toggleShow,
}: Props) => {
  const { toast } = useToast();

  const onCopyClickUrl = async () => {
    await window.navigator.clipboard.writeText(url ?? "");
    toast({
      title: "URL Copied to Clipboard",
      // description: "URL Copied to Clipboard! 📋",
      // status: "success",
      duration: 5000,
      // isClosable: true,
    });
  };

  return (
    <Dialog open={isOpen}>
      <div className="col-span-2 w-full rounded-xl">
        <div className=" bg-[#F5F8FA] p-4 md:px-8">
          <div className="justify-between md:flex">
            <div className="mt-2 flex justify-between md:block">
              <div>
                <div className=" text-sm font-medium text-[#717171]">
                  {values[0]?.title}
                </div>
                <div className="h-12 text-sm font-medium md:mt-3 md:text-base">
                  {values[0]?.value}
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between md:block">
              <div>
                <div className=" text-sm font-medium text-[#717171]">
                  {values[1]?.title}
                </div>
                <div className="text-sm font-medium md:mt-3 md:text-base">
                  {values[1]?.value}
                </div>
              </div>
              <div className="md:hidden">
                <div className=" text-sm font-medium text-[#717171]">
                  {values[2]?.title}
                </div>
                <div className=" text-sm text-[#353535] md:text-base">
                  {values[2]?.value}
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "justify-between pt-1 md:pt-4 " +
              (toggleShow ? "grid grid-cols-2" : " md:flex ")
            }
          >
            <div className="mt-2 hidden md:block">
              <div className=" text-sm font-medium text-[#717171]">
                {values[2]?.title}
              </div>
              <div className=" text-sm text-[#353535] md:text-base">
                {values[2]?.value}
              </div>
            </div>
            <div className="mt-2">
              <div className=" text-sm font-medium text-[#717171]">
                {values[3]?.title}
              </div>
              <div className=" text-sm text-[#353535] md:text-base">
                {values[3]?.value}
              </div>
            </div>
            <div className="mt-2 flex justify-between md:block">
              <div>
                <div className="text-sm font-medium text-[#717171]">
                  {values[4]?.title}
                </div>
                <div className=" text-sm text-[#353535] md:text-base">
                  {!values[4]?.value ? values[4]?.value : 0}
                </div>
              </div>
              <div className="md:hidden">
                <div className="text-sm font-medium text-[#717171]">
                  Language
                </div>
                <div className=" text-sm text-[#353535] md:text-base">
                  English
                </div>
              </div>
            </div>
            <div className="mt-2 hidden md:block">
              <div className=" text-sm font-medium text-[#717171]">
                Language
              </div>
              <div className=" text-sm text-[#353535] md:text-base">
                English
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1 items-end justify-end md:mt-3 md:flex">
          <div className="mt-5 flex items-end justify-center md:justify-end">
            <div className="ml-2">
              <div className="">
                <DialogTrigger>
                  <Button variant="primary-outline" className="md:px-4">
                    Get Tracking Code
                    <div className="ml-2 items-center">
                      <Code2Icon className="text-[#282560]" />
                    </div>
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogContent className="sm:max-w-sm md:max-w-3xl">
        <DialogHeader className="text-left text-lg font-medium text-primary">
          HTML Code
        </DialogHeader>
        <form className="w-full pt-5">
          <div className="mb-6 justify-between md:flex md:space-x-4">
            <div className="mb-3 w-full md:w-1/2">
              <label
                className="mb-2 block  pl-3 text-sm font-medium tracking-wide text-[#525252]"
                htmlFor="grid-first-name"
              >
                Profile
              </label>
              <div className="flex">
                <div className=" relative flex w-full items-center ">
                  <Select defaultValue={"1"}>
                    <SelectTrigger className="border px-4 py-3  text-xs ">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent className="border text-xs">
                      <SelectGroup>
                        <SelectItem value={"1"}>Account 1</SelectItem>
                        <SelectItem value={"2"}>Account 2</SelectItem>
                        <SelectItem value={"3"}>Account 3</SelectItem>
                        <SelectItem value={"4"}>Account 4</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button variant="primary" className="ml-2" size="rec">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <label
                className="mb-2 block pl-3 text-sm font-medium tracking-wide text-[#525252]"
                htmlFor="grid-first-name"
              >
                Dynamic Parameter
              </label>
              <div className="flex">
                <div className=" relative flex w-full items-center ">
                  <Select defaultValue={"1"}>
                    <SelectTrigger className="border px-4 py-3  text-xs ">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent className="border text-xs">
                      <SelectGroup>
                        <SelectItem value={"1"}>Account 1</SelectItem>
                        <SelectItem value={"2"}>Account 2</SelectItem>
                        <SelectItem value={"3"}>Account 3</SelectItem>
                        <SelectItem value={"4"}>Account 4</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button variant="primary" className="ml-2" size="rec">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="-mx-3 mb-6 flex flex-wrap">
            <div className="w-full px-3">
              <textarea
                className="border-#D7D7D7 mb-3 h-48 w-full rounded-3xl border bg-[#F0F9FF] px-4 py-3 text-base font-medium text-[#1B48BB]"
                value='<div class="container">
                                                        <img src="img_5terre_wide.jpg" alt="Cinque Terre" width="1000" height="300">
                                                        <div class="topleft">Top Left</div>
                                                      </div>'
                id="grid-textarea"
              />
            </div>
          </div>
        </form>
        <div className="justify-between md:flex">
          <div className="mb-2 flex justify-between md:block">
            <div className="rounded ">
              <Button variant="primary">Get Code</Button>
            </div>
            <div className="rounded md:hidden">
              <Button variant="primary">
                <div className="text-base text-white">Copy Click Url</div>
                <div className="ml-2">
                  <Copy className="h-4 w-4 text-white" />
                </div>
              </Button>
            </div>
          </div>
          <div className="flex justify-between md:justify-center md:space-x-2">
            <div className="hidden rounded md:block">
              <div className="rounded">
                <Button
                  variant="primary"
                  onClick={() =>
                    window.navigator.clipboard.writeText(url ?? "")
                  }
                >
                  <div className="text-base text-white md:font-medium">
                    Copy Click Url
                  </div>
                  <div className="ml-2">
                    <Copy className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </div>
            </div>
            <div className=" rounded">
              <div className="">
                <Button variant="primary-outline">
                  Get Tracking Code
                  <div className="ml-2">
                    <Code2Icon className="h-5  w-5 text-[#282560]" />
                  </div>
                </Button>
              </div>
            </div>

            <div className="rounded">
              <div className="">
                <Button variant="primary">
                  Download Image
                  <div className="ml-2">
                    <ImageIcon className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
