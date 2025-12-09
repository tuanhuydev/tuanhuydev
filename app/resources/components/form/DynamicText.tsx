"use client";

import Input from "./Fields/Input";
import Textarea from "./Fields/Textarea";
import { Ref, forwardRef, memo } from "react";
import { UseControllerProps, useController } from "react-hook-form";

export interface DynamicTextProps extends UseControllerProps<any> {
  type: "text" | "email" | "password" | "number" | "textarea";
  options?: {
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
  };
  keyProp?: string;
  className?: string;
  validate?: Record<string, any>;
}

const DynamicText = memo(
  forwardRef<any, DynamicTextProps>(function DynamicText(
    { type, options = { disabled: false }, keyProp, className = "w-full", validate = {}, ...restProps },
    ref: Ref<any>,
  ) {
    const { field, fieldState, formState } = useController(restProps);
    const { isSubmitting } = formState;
    const { invalid, error } = fieldState;

    const { value = "", ...restField } = field;

    const subElementProps = {
      ...restField,
      ...options,
      value,
      ref,
      disabled: isSubmitting || options.disabled,
      error: invalid,
      helperText: error?.message,
    };

    let element;
    switch (type) {
      case "password":
        element = <Input key={keyProp} {...subElementProps} type="password" />;
        break;
      case "email":
        element = <Input key={keyProp} {...subElementProps} type="email" />;
        break;
      case "number":
        element = <Input key={keyProp} {...subElementProps} type="number" />;
        break;
      case "textarea":
        element = (
          <Textarea
            key={keyProp}
            {...subElementProps}
            minRows={options.rows || 4}
            placeholder={options.placeholder || "Enter text..."}
          />
        );
        break;
      default:
        element = <Input key={keyProp} {...subElementProps} type="text" />;
        break;
    }

    return <div className={`p-2 self-stretch ${className}`}>{element}</div>;
  }),
);

export default DynamicText;
