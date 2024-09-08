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
  options?: {
    placeholder?: string;
  };
  keyProp?: string;
  className?: string;
  validate?: ObjectType;
}

// validate: ObjectType

export default forwardRef(function DynamicText(
  { type, options = {}, keyProp, className = "w-full", validate = {}, ...restProps }: DynamicInputProps,
  ref: Ref<any>,
) {
  const { field, fieldState, formState } = useController(restProps);
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;

  // Initialize field value with an empty string or a default value
  const { value = "", ...restField } = field;

  const subElementProps = {
    ...restField,
    ...options,
    value,
    ref,
    disabled: isSubmitting,
  };

  let element;
  switch (type) {
    case "password":
      element = <BaseInput key={keyProp} {...subElementProps} type="password" />;
      break;
    case "number":
      element = <InputNumber key={keyProp} {...subElementProps} ref={ref} className="w-full" />;
      break;
    case "textarea":
      element = <TextArea key={keyProp} {...subElementProps} ref={ref} rows={4} />;
      break;
    default:
      element = <BaseInput key={keyProp} {...subElementProps} ref={ref} type="text" />;
      break;
  }
  return (
    <div className={`p-2 self-stretch ${className}`}>
      <div className="mb-1">{element}</div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
});
