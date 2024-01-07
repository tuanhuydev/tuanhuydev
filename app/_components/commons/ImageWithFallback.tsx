"use client";

import Loader from "./Loader";
import { EMPTY_STRING } from "@lib/configs/constants";
import { isURLValid } from "@shared/utils/helper";
import dynamic from "next/dynamic";
import { ImageProps } from "next/image";
import React, { memo, useEffect, useState } from "react";

const Image = dynamic(() => import("next/image"), { ssr: false, loading: () => <Loader /> });

const WarningOutlined = dynamic(() => import("@mui/icons-material/WarningAmberOutlined"), {
  ssr: false,
  loading: () => <Loader />,
});

interface ImageWithFallbackProps extends Partial<ImageProps> {
  src?: string;
}
const ImageWithFallback = ({ src = EMPTY_STRING, alt = "image", ...restProps }: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(!isURLValid(src as string));
  }, [src]);
  const shouldRenderImage = src && !hasError;
  return (
    <div className="relative w-full h-full">
      {shouldRenderImage ? (
        <Image {...restProps} src={src} alt={alt} blurDataURL={src} onError={() => setHasError(true)} />
      ) : (
        <WarningOutlined />
      )}
    </div>
  );
};

export default memo(ImageWithFallback);
