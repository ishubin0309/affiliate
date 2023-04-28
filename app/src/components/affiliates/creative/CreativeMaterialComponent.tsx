import React from "react";
import { CreativeMaterialDialogComponent } from "./CreativeMaterialDialogComponent";

interface Props {
  values: valueProps[];
  file?: string;
  alt: string;
  url: string;
  toggleShow?: boolean;
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
        </div>
        <CreativeMaterialDialogComponent
          values={values}
          url={url}
          toggleShow={toggleShow}
        />
      </div>
    </div>
  );
};
