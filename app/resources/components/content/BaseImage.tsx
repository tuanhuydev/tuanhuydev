"use client";

import Loader from "../common/Loader";
import { EMPTY_STRING } from "lib/commons/constants/base";
import { isURLValid } from "lib/utils/helper";
import { TriangleAlert } from "lucide-react";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

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
          placeholder="empty"
          onError={() => setHasError(true)}
        />
      ) : (
        <TriangleAlert className="w-6 h-6 text-amber-500" />
      )}
    </div>
  );
};

export default BaseImage;
