import React, { useEffect, useState } from "react";
import type { ImageProps } from "next/image";
import Image from "next/image";

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string;
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => {
    console.log(`muly:ImageWithFallback:useEffect`, { src });
    setImgSrc(src);
  }, [src]);

  console.log(`muly:ImageWithFallback:render`, { props, imgSrc });
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      src={imgSrc}
      onError={(e) => {
        console.log(`muly:ImageWithFallback:OnError`, { e });
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
