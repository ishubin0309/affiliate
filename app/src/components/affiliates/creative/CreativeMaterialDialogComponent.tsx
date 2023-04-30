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

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { Code2Icon, Copy, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { AddDynamicParameter } from "./AddDynamicParameter";

interface Props {
  values: valueProps[];
  file?: string;
  alt?: string;
  url?: string;
  isOpen?: boolean;

  creative_id: number;
  toggleShow: boolean;
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
  creative_id,
  toggleShow,
}: Props) => {
  const { toast } = useToast();
  const { data: profiles } = api.affiliates.getProfiles.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parameterFirstValues, setParameterFirstValues] = useState("");
  const [params, setParams] = useState<string[]>([]);
  const [profile_id, setProfile_id] = useState<number>();

  const generateBannerCode = api.affiliates.generateBannerCode.useMutation();

  const handleGetCode = async () => {
    setIsLoading(true);
    try {
      console.log(`muly:handleGetCode`, {
        creative_id,
        params,
        profile_id,
      });

      if (!profile_id) {
        // TODO: Show error that need to select profile
        return;
      }

      const codes = await generateBannerCode.mutateAsync({
        creative_id,
        params,
        profile_id,
      });

      console.log(`muly:handleGetCode codes`, {
        codes,
        creative_id,
        params,
        profile_id,
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const DownloadHtmlText = () => {
    console.log("DownloadHtmlText");
  };
  const DownloadJsText = () => {
    console.log("DownloadJsText");
  };
  const DownloadDirectLinkText = () => {
    console.log("DownloadDirectLinkText");
  };
  const DownloadQrcodeImage = () => {
    console.log("DownloadQrcodeImage");
  };

  return (
    <Dialog open={isOpen}>
      <div className="w-full rounded-xl lg:ml-5">
        <div className=" bg-[#F5F8FA] p-4 md:px-8">
          <div className="justify-between md:flex">
            <div className="mt-2 flex justify-between md:block">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  {values[0]?.title}
                </label>
                <div className="h-12 text-sm text-[#353535] md:text-base">
                  {values[0]?.value}
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between md:block">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  {values[1]?.title}
                </label>
                <div className="text-sm text-[#353535] md:text-base">
                  {values[1]?.value}
                </div>
              </div>
              <div className="md:hidden">
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  {values[2]?.title}
                </label>
                <div className="text-sm text-[#353535] md:text-base">
                  {values[2]?.value}
                </div>
              </div>
            </div>
          </div>
          <div className="justify-between pt-1 md:flex md:pt-12 ">
            <div className="mt-2 hidden md:block">
              <label className="mb-1 block text-sm font-bold text-gray-700">
                {values[2]?.title}
              </label>
              <div className="text-sm text-[#353535] md:text-base">
                {values[2]?.value}
              </div>
            </div>
            <div className="mt-2">
              <label className="mb-1 block text-sm font-bold text-gray-700">
                {values[3]?.title}
              </label>
              <div className="text-sm text-[#353535] md:text-base">
                {values[3]?.value}
              </div>
            </div>
            <div className="mt-2 flex justify-between md:block">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  {values[4]?.title}
                </label>
                <div className="text-sm text-[#353535] md:text-base">
                  {!values[4]?.value ? values[4]?.value : 0}
                </div>
              </div>
              <div className="md:hidden">
                <label className="mb-1 block text-sm font-bold text-gray-700">
                  Language
                </label>
                <div className="text-sm text-[#353535] md:text-base">
                  English
                </div>
              </div>
            </div>
            <div className="mt-2 hidden md:block">
              <label className="mb-1 block text-sm font-bold text-gray-700">
                Language
              </label>
              <div className="text-sm text-[#353535] md:text-base">English</div>
            </div>
          </div>
        </div>
        <div
          className={
            "items-end justify-end md:flex" +
            (toggleShow ? "" : " mt-1 pt-0.5 md:mt-3  ")
          }
        >
          <div className="mt-5 flex items-end justify-center md:justify-end">
            <div className="ml-2">
              <div className="">
                <DialogTrigger>
                  <Button variant="primary-outline" className="md:px-4">
                    Get HTML Code
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

      <DialogContent className="max-w-[90%] sm:max-w-sm md:max-w-6xl ">
        <DialogHeader className="text-left text-lg font-medium text-primary">
          HTML Code
        </DialogHeader>
        <form className="w-full pt-5">
          <div className="justify-between md:flex md:space-x-4">
            <div className="w-full md:w-1/4">
              <div className="mb-6 justify-between md:flex md:space-x-4">
                <div className="w-full">
                  <div className="mb-3">
                    <label
                      className="mb-2 block  pl-3 text-sm font-medium tracking-wide text-[#525252]"
                      htmlFor="grid-first-name"
                    >
                      Profile
                    </label>
                    <div className="flex">
                      <div className="relative flex w-full items-center ">
                        <Select
                          defaultValue={String(profile_id)}
                          onValueChange={(value) =>
                            setProfile_id(Number(value))
                          }
                        >
                          <SelectTrigger className="border px-4 py-3  text-xs ">
                            <SelectValue placeholder="Select profile" />
                          </SelectTrigger>
                          <SelectContent className="border text-xs">
                            <SelectGroup>
                              {profiles?.map(({ name, url, id }, index) => (
                                <SelectItem value={String(id)} key={id}>
                                  <div className="flex flex-col">
                                    <div>
                                      <b>{name}</b>
                                    </div>
                                    <div>{url}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      className="mb-2 block pl-3 text-sm font-medium tracking-wide text-[#525252]"
                      htmlFor="grid-first-name"
                    >
                      Dynamic Parameter
                    </label>
                    <div className="flex flex-wrap">
                      <div className="relative flex w-full flex-wrap items-center justify-between ">
                        <div className="w-[calc(100%-56px)]">
                          <Input
                            className="w-full"
                            placeholder="Add parameter"
                            value={parameterFirstValues}
                            onChange={(e) => {
                              setParameterFirstValues(e.target.value);
                            }}
                          />
                        </div>

                        <AddDynamicParameter setParametersValue={setParams} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 rounded md:mb-0">
                <Button
                  onClick={handleGetCode}
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Get Code
                </Button>
              </div>
            </div>
            <div className="w-full md:w-3/4">
              {" "}
              <div>
                <Tabs defaultValue="HtmlCode">
                  <TabsList className="flex-wrap justify-start whitespace-nowrap">
                    <TabsTrigger value="HtmlCode">HTML Code</TabsTrigger>
                    <TabsTrigger value="JSCode">JS Code</TabsTrigger>
                    <TabsTrigger value="QrCode">QR Code</TabsTrigger>
                    <TabsTrigger value="DirectLinkCode">
                      Direct Link Code
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent className="border-0 p-0" value="HtmlCode">
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
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button variant="primary" onClick={DownloadHtmlText}>
                          Download html as text
                          <div className="ml-2">
                            <ImageIcon className="h-4 w-4 text-white" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent className="border-0 p-0" value="JSCode">
                    <div className="-mx-3 mb-6 flex flex-wrap">
                      <div className="w-full px-3">
                        <textarea
                          className="border-#D7D7D7 mb-3 h-48 w-full rounded-3xl border bg-[#F0F9FF] px-4 py-3 text-base font-medium text-[#1B48BB]"
                          value='<div class="container">

                                                        <div class="topleft">JSCode</div>
                                                      </div>'
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button variant="primary" onClick={DownloadJsText}>
                          Download js code as text
                          <div className="ml-2">
                            <ImageIcon className="h-4 w-4 text-white" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent className="border-0 p-0" value="QrCode">
                    <div className="-mx-3 mb-6 flex flex-wrap">
                      <div className="w-full px-3">
                        <textarea
                          className="border-#D7D7D7 mb-3 h-48 w-full rounded-3xl border bg-[#F0F9FF] px-4 py-3 text-base font-medium text-[#1B48BB]"
                          value='<div class="container">

                                                        <div class="topleft">QrCode</div>
                                                      </div>'
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button variant="primary" onClick={DownloadQrcodeImage}>
                          Download qrcode as image
                          <div className="ml-2">
                            <ImageIcon className="h-4 w-4 text-white" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent className="border-0 p-0" value="DirectLinkCode">
                    <div className="-mx-3 mb-6 flex flex-wrap">
                      <div className="w-full px-3">
                        <textarea
                          className="border-#D7D7D7 mb-3 h-48 w-full rounded-3xl border bg-[#F0F9FF] px-4 py-3 text-base font-medium text-[#1B48BB]"
                          value='<div class="container">

                                                        <div class="topleft">https://go.best-brokers-partners.com/click.php?ctag=a500-b781-p60</div>
                                                      </div>'
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button
                          variant="primary"
                          onClick={DownloadDirectLinkText}
                        >
                          Download direct link code as text
                          <div className="ml-2">
                            <ImageIcon className="h-4 w-4 text-white" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>{" "}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
