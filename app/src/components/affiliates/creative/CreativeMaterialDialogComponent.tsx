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
import { api } from "@/utils/api";
import { Code2Icon, Image as ImageIcon } from "lucide-react";
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
  gridView: boolean;
}

interface valueProps {
  title: string;
  value: string | undefined;
}
interface CodeProps {
  code: string;
  directLink: string;
  htmlCode: string;
  qrCode: string;
}

const initialCodeProps: CodeProps = {
  code: "",
  directLink: "",
  htmlCode: "",
  qrCode: "",
};

export const CreativeMaterialDialogComponent = ({
  values,
  file,
  alt,
  url,
  isOpen,
  creative_id,
  gridView,
}: Props) => {
  const { toast } = useToast();
  const { data: profiles } = api.affiliates.getProfiles.useQuery(undefined, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parameterFirstValues, setParameterFirstValues] = useState("");
  const [codesValues, setCodesValues] = useState<CodeProps>(initialCodeProps);

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
      setCodesValues(codes);
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
      <div className={"mt-4 items-end justify-end md:flex"}>
        <div className="flex items-end justify-center md:justify-end">
          <div className="ml-2">
            <div className="">
              <DialogTrigger>
                <Button
                  variant="primary-outline"
                  className="md:px-4"
                  onClick={() => {
                    setCodesValues(initialCodeProps);
                  }}
                >
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
      <DialogContent className="max-w-[90%] sm:max-w-sm md:max-w-6xl ">
        <DialogHeader className="text-left text-lg font-medium text-primary">
          Get Tracking Code
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
                                  <div className="flex flex-col text-left">
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
                        <AddDynamicParameter />
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
                          value={codesValues?.htmlCode}
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button variant="primary" onClick={DownloadHtmlText}>
                          Download Html As Text
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
                          value={codesValues?.code}
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button variant="primary" onClick={DownloadJsText}>
                          Download Js Code As Text
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
                          value={codesValues?.qrCode}
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button variant="primary" onClick={DownloadQrcodeImage}>
                          Download Qrcode As Image
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
                          value={codesValues?.directLink}
                          id="grid-textarea"
                        />
                      </div>
                      <div className="flex w-full flex-wrap justify-end px-3">
                        <Button
                          variant="primary"
                          onClick={DownloadDirectLinkText}
                        >
                          Download Sirect Link Code As Text
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
