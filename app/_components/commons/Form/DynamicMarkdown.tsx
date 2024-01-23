"use client";

import Loader from "../Loader";
import dynamic from "next/dynamic";
import React from "react";
import { UseControllerProps, useController } from "react-hook-form";

const BaseMarkdown = dynamic(async () => (await import("../BaseMarkdown")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export interface DynamicMarkdownProps extends UseControllerProps<any> {
  options?: ObjectType;
  keyProp?: string;
  className?: string;
  value?: any;
}

export default function DynamicMarkdown({
  keyProp,
  options,
  className = "",
  name,
  ...restProps
}: DynamicMarkdownProps) {
  const { field, fieldState } = useController({ ...restProps, name });
  const { invalid, error } = fieldState;
  const { ref, ...restField } = field;
  return (
    <div className={"p-2 self-stretch w-full flex flex-col"}>
      <div className={className}>
        <BaseMarkdown key={keyProp} {...restField} {...options} />
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
}
