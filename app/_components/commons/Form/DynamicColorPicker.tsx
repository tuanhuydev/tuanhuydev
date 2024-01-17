"use client";

import { ObjectType } from "@lib/shared/interfaces/base";
import { Color } from "antd/es/color-picker/color";
import dynamic from "next/dynamic";
import React from "react";
import { UseControllerProps, useController } from "react-hook-form";

const ColorPicker = dynamic(async () => (await import("antd/es/color-picker")).default, { ssr: false });

export interface DynamicColorPickerProps extends UseControllerProps<any> {
  options?: ObjectType;
  keyProp?: string;
  className?: string;
}

export default function DynamicColorPicker({
  options = { placeholder: "Color" },
  keyProp,
  className = "w-full",
  ...restProps
}: DynamicColorPickerProps) {
  const { field, fieldState, formState } = useController(restProps);
  const { ref, onChange, ...restField } = field;
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;

  const handleChange = (value: Color) => {
    onChange(value.toHexString());
  };

  return (
    <div className={`p-2 self-stretch ${className}`}>
      <div className="w-full flex items-center gap-x-1 mb-1">
        {options.placeholder && <h4 className="m-0 p-0 font-normal">{options.placeholder}</h4>}:&nbsp;
        <ColorPicker
          {...restField}
          {...options}
          key={keyProp}
          onChange={handleChange}
          disabled={isSubmitting}
          showText
          format="hex"
          className="w-full"
        />
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
}
