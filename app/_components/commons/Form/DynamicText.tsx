"use client";

import BaseInput from "../Inputs/BaseInput";
import Loader from "../Loader";
import dynamic from "next/dynamic";
import React, { Ref, forwardRef } from "react";
import { UseControllerProps, useController } from "react-hook-form";

const InputNumber = dynamic(async () => (await import("antd/es/input-number")).default, {
  ssr: false,
  loading: () => <Loader />,
});

const TextArea = dynamic(async () => (await import("antd/es/input")).default.TextArea, {
  ssr: false,
  loading: () => <Loader />,
});

export interface DynamicInputProps extends UseControllerProps<any> {
  type: "text" | "email" | "password" | "number" | "textarea";
  options?: ObjectType;
  keyProp?: string;
  className?: string;
}

export default forwardRef(function DynamicText(
  { type, options, keyProp, className = "w-full", ...restProps }: DynamicInputProps,
  ref: Ref<any>,
) {
  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;

  let element;
  switch (type) {
    case "password":
      element = <BaseInput key={keyProp} {...field} {...options} type="password" ref={ref} disabled={isSubmitting} />;
      break;
    case "number":
      element = (
        <InputNumber key={keyProp} {...field} {...options} ref={ref} className="w-full" disabled={isSubmitting} />
      );
      break;
    case "textarea":
      element = <TextArea key={keyProp} {...field} {...options} ref={ref} rows={4} disabled={isSubmitting} />;
      break;
    default:
      element = <BaseInput key={keyProp} {...field} {...options} ref={ref} type="text" disabled={isSubmitting} />;
      break;
  }
  return (
    <div className={`p-2 self-stretch ${className}`}>
      <div className="mb-1">{element}</div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
});
