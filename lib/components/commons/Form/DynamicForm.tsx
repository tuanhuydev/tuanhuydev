"use client";

import Loader from "../Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import { ObjectType } from "@lib/shared/interfaces/base";
import { ButtonProps } from "antd";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useMemo } from "react";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import * as yup from "yup";

const DynamicText = dynamic(async () => (await import("@lib/components/commons/Form/DynamicText")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const DynamicSelect = dynamic(async () => (await import("@lib/components/commons/Form/DynamicSelect")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const DynamicMarkdown = dynamic(async () => (await import("@lib/components/commons/Form/DynamicMarkdown")).default, {
  ssr: false,
  loading: () => <Loader />,
});
const DynamicDatepicker = dynamic(
  async () => (await import("@lib/components/commons/Form/DynamicDatepicker")).default,
  { ssr: false, loading: () => <Loader /> },
);
const Button = dynamic(async () => (await import("antd/es/button")).default, {
  ssr: false,
  loading: () => <Loader />,
});

export interface ElementType {
  name: string;
  type: "text" | "number" | "email" | "password" | "textarea" | "select" | "richeditor" | "datepicker";
  label?: "string";
  options?: {};
  validate?: {};
  style?: {};
  className?: string;
}

export interface DynamicFormProps {
  config: DynamicFormConfig;
  disabled?: boolean;
  onSubmit: (formData: FieldValues, form: UseFormReturn) => void;
  mapValues?: ObjectType;
  submitProps?: Partial<ButtonProps>;
  customSubmit?: ReactNode;
}

export interface DynamicFormConfig {
  fields: ElementType[];
}

const mapValidation = (type: any, validate: ObjectType) => {
  // make yup base on type
  let rule;
  if (type === "number") {
    rule = yup.number();
  } else if (type === "datepicker") {
    rule = yup.date();
  } else if (type === "select") {
    rule = yup.string();
  } else {
    rule = yup.string();
  }

  // Apply rules
  if ("min" in validate) {
    const isNumberMin = Number.isInteger(validate.min);
    rule = rule.min(isNumberMin ? validate.min : yup.ref(validate.min));
  }
  if ("max" in validate) {
    const isNumberMax = Number.isInteger(validate.max);
    rule = rule.max(isNumberMax ? validate.max : yup.ref(validate.max));
  }
  if ("required" in validate && validate.required) {
    rule = rule.required();
  }
  return rule;
};

const makeSchema = ({ fields }: DynamicFormConfig) => {
  const schema: ObjectType = {};
  fields.forEach(({ name, validate, type }: ElementType) => {
    if (validate) schema[name] = mapValidation(type, validate);
  });

  return yup.object(schema);
};

export default function DynamicForm({ config, onSubmit, disabled, mapValues, submitProps }: DynamicFormProps) {
  const form = useForm({ resolver: yupResolver(makeSchema(config)) });
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isLoading, isSubmitting },
  } = form;
  const { fields } = config;

  const registerFields = useMemo(
    () =>
      (fields as Array<ElementType>).map((field: ElementType) => {
        const { name, type, options, ...restFieldProps } = field;
        const elementProps = {
          control,
          name,
          options,
          keyProp: name,
        };
        switch (type) {
          case "select":
            return <DynamicSelect key={name} {...elementProps} {...restFieldProps} />;
          case "richeditor":
            return <DynamicMarkdown key={name} {...elementProps} options={options} {...restFieldProps} />;
          case "datepicker":
            return <DynamicDatepicker key={name} {...elementProps} {...restFieldProps} />;
          default:
            return (
              <DynamicText
                key={name}
                {...elementProps}
                disabled={true}
                {...restFieldProps}
                type={type}
                keyProp={`${name} - ${type}`}
              />
            );
        }
      }),
    [control, fields],
  );

  const submit = (formData: FieldValues) => {
    if (onSubmit) onSubmit(formData, form);
  };

  useEffect(() => {
    if (!mapValues) reset();
    if (mapValues) {
      for (let [key, value] of Object.entries(mapValues)) {
        setValue(key, value);
      }
    }
  }, [form, mapValues, reset, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full">
      <div className="flex flex-wrap relative overflow-auto">{registerFields}</div>
      <div className="flex p-2">
        <Button
          {...submitProps}
          type="primary"
          htmlType="submit"
          loading={isLoading || disabled}
          disabled={isSubmitting}>
          Submit
        </Button>
      </div>
    </form>
  );
}
