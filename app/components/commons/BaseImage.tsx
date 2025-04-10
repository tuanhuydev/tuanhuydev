"use client";

import Loader from "./Loader";
import { EMPTY_STRING } from "lib/commons/constants/base";
import { isURLValid } from "lib/utils/helper";
import dynamic from "next/dynamic";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

const WarningOutlined = dynamic(() => import("@mui/icons-material/WarningAmberOutlined"), {
  ssr: false,
  loading: () => <Loader />,
});

interface BaseImageProps extends Partial<ImageProps> {
  src?: string;
}

const BaseImage = ({ src = EMPTY_STRING, alt = "image", ...restProps }: BaseImageProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(!isURLValid(src as string));
  }, [src]);
  const shouldRenderImage = src && !hasError;
  return (
    <div className="relative w-full h-full rounded-md">
      {shouldRenderImage ? (
        <Image {...restProps} src={src} alt={alt} blurDataURL={src} onError={() => setHasError(true)} />
      ) : (
        <WarningOutlined />
      )}
    </div>
  );
};

export default BaseImage;
