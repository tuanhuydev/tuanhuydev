"use client";

import Loader from "./Loader";
import { EMPTY_STRING } from "lib/commons/constants/base";
import { isURLValid } from "lib/utils/helper";
import Image, { ImageProps } from "next/image";
import { Suspense, lazy } from "react";
import { useEffect, useState } from "react";

// Replace dynamic import with React lazy
const WarningOutlined = lazy(() => import("@mui/icons-material/WarningAmberOutlined"));

interface BaseImageProps extends Partial<ImageProps> {
  src?: string;
}

const BaseImage = ({
  src = EMPTY_STRING,
  alt = "image",
  quality = 75,
  priority = false,
  sizes = "100vw",
  ...restProps
}: BaseImageProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(!isURLValid(src as string));
  }, [src]);
  const shouldRenderImage = src && !hasError;
  return (
    <div className="relative w-full h-full rounded-md">
      {shouldRenderImage ? (
        <Image
          {...restProps}
          src={src}
          alt={alt}
          quality={quality}
          priority={priority}
          sizes={sizes}
          blurDataURL={src}
          onError={() => setHasError(true)}
        />
      ) : (
        <Suspense fallback={<Loader />}>
          <WarningOutlined />
        </Suspense>
      )}
    </div>
  );
};

export default BaseImage;
