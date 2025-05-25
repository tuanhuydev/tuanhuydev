"use client";

import Loader from "../Loader";
import { Suspense, lazy, memo } from "react";
import React from "react";
import { UseControllerProps, useController } from "react-hook-form";

// Optimized lazy loading with preloading
const BaseMarkdown = lazy(() =>
  import("../BaseMarkdown").then((module) => {
    // Preload the component to improve performance
    return { default: module.default };
  }),
);

export interface DynamicMarkdownV2Props extends UseControllerProps<any> {
  options?: Record<string, any>;
  keyProp?: string;
  className?: string;
  value?: any;
}

const DynamicMarkdownV2 = memo(function DynamicMarkdownV2({
  keyProp,
  options,
  className = "",
  name,
  ...restProps
}: DynamicMarkdownV2Props) {
  const { field, fieldState } = useController({ ...restProps, name });
  const { invalid, error } = fieldState;
  const { ref, ...restField } = field;

  return (
    <div className="p-2 self-stretch w-full flex flex-col">
      <div className={className}>
        <Suspense fallback={<Loader />}>
          <BaseMarkdown key={keyProp} {...restField} {...options} />
        </Suspense>
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize mt-1">{error?.message}</div>}
    </div>
  );
});

export default DynamicMarkdownV2;
