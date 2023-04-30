import React from "react";
import { Code2Icon, Copy } from "lucide-react";
import { Button } from "../../ui/button";
import { CreativeMaterialDialogComponent } from "./CreativeMaterialDialogComponent";

interface Props {
  values: valueProps[];
  file?: string;
  alt: string;
  url: string;
  toggleShow?: boolean;
  creative_id: number;
}

interface valueProps {
  title: string;
  value: string | undefined;
}

interface ImageWithFallbackProps {
  src: string | undefined | null;
  alt: string;
}

export const CreativeMaterialComponent = ({
  values,
  file,
  alt,
  url,
  toggleShow,
  creative_id,
}: Props) => {
  const ImageWithFallback = ({ src, alt }: ImageWithFallbackProps) => {
    const [image, setImage] = React.useState(src ?? "/img/fallback.jpg");

    const handleImageError = (): void => {
      setImage("/img/fallback.jpg");
    };

    return (
      <img
        src={image}
        alt={alt}
        onError={handleImageError}
        className="mx-auto	my-0 max-h-64 rounded-xl bg-cover"
      />
    );
  };

  return (
    <div className="mb-5 rounded-xl bg-white p-4 shadow">
      <div
        className={
          "mt-4 items-start " +
          (toggleShow
            ? "md:grid md:grid-cols-1 md:gap-4"
            : "md:grid md:grid-cols-3 md:gap-4")
        }
      >
        <div className="mx-auto mb-5 h-64 rounded-xl">
          <ImageWithFallback src={file} alt={alt} />
          <CreativeMaterialDialogComponent
            values={values}
            url={url}
            creative_id={creative_id}
          />
        </div>
      </div>

      {/*<div className="mt-1 items-end md:mt-3 md:hidden">*/}
      {/*  <div className="">*/}
      {/*    <div className="mb-1 ml-2 text-xs font-medium text-[#525252]">*/}
      {/*      Click URL*/}
      {/*    </div>*/}
      {/*    <div className="rounded border border-[#D7D7D7] bg-[#F9F9FF] px-3 py-2 text-sm font-medium text-[#666666] lg:w-96">*/}
      {/*      {url}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="mt-5 flex items-end justify-center md:justify-end">*/}
      {/*    <div className="">*/}
      {/*      <div>*/}
      {/*        <Button*/}
      {/*          className="text-xs"*/}
      {/*          variant="primary"*/}
      {/*          size="sm"*/}
      {/*          onClick={() => window.navigator.clipboard.writeText(url ?? "")}*/}
      {/*        >*/}
      {/*          Copy Click Url*/}
      {/*          <div className="ml-2 items-center">*/}
      {/*            <Copy className="h-4 w-4" />*/}
      {/*          </div>*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="ml-2">*/}
      {/*      <div>*/}
      {/*        <Button variant="primary-outline" size="sm" className="text-xs">*/}
      {/*          Get HTML Code*/}
      {/*          <div className="ml-2 items-center">*/}
      {/*            <Code2Icon className="h-4  w-4 text-[#282560]" />*/}
      {/*          </div>*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};
