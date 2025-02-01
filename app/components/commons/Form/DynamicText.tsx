"use client";

import BaseInput from "../Inputs/BaseInput";
import BaseTextarea from "../Inputs/BaseTextarea";
import { Ref, forwardRef } from "react";
import { UseControllerProps, useController } from "react-hook-form";

// TODO: Implement Input Number

export interface DynamicInputProps extends UseControllerProps<any> {
  type: "text" | "email" | "password" | "number" | "textarea";
  options?: {
    placeholder?: string;
    disabled?: boolean;
  };
  keyProp?: string;
  className?: string;
  validate?: ObjectType;
}

// validate: ObjectType

export default forwardRef(function DynamicText(
  {
    type,
    options = { disabled: false },
    keyProp,
    className = "w-full",
    validate = {},
    ...restProps
  }: DynamicInputProps,
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
    disabled: isSubmitting || options.disabled,
  };

  let element;
  switch (type) {
    case "password":
      element = <BaseInput key={keyProp} {...subElementProps} type="password" />;
      break;
    case "textarea":
      element = (
        <BaseTextarea key={keyProp} {...subElementProps} ref={ref} minRows={4}>
          {value}
        </BaseTextarea>
      );
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
