"use client";

import Loader from "../Loader";
import BaseButton from "../buttons/BaseButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { ButtonProps } from "antd/es/button";
import dynamic from "next/dynamic";
import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import * as yup from "yup";

export interface ElementType {
  name: string;
  type: "text" | "number" | "email" | "password" | "textarea" | "select" | "richeditor" | "datepicker" | "colorpicker";
  label?: "string";
  options?: ObjectType;
  validate?: ObjectType;
  style?: ObjectType;
  className?: string;
}

export interface DynamicFormProps {
  config: DynamicFormConfig;
  disabled?: boolean;
  onSubmit: (formData: FieldValues, form?: UseFormReturn) => void | Promise<any>;
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
  switch (type) {
    case "number":
      rule = yup.number();
      break;
    case "datepicker":
      rule = yup.date();
      break;
    case "select":
      const isMultipleSelect = "multiple" in validate && validate?.multiple;
      rule = isMultipleSelect ? yup.array() : yup.string();
      break;
    default:
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
  if ("match" in validate) {
    rule = (rule as yup.StringSchema).oneOf([yup.ref(validate.match)], "Passwords must match");
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

export default function DynamicForm({ config, onSubmit, mapValues, submitProps }: DynamicFormProps) {
  const form = useForm({ resolver: yupResolver(makeSchema(config)) });
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isSubmitting },
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
            const DynamicSelect = dynamic(
              async () => (await import("@components/commons/Form/DynamicSelect")).default,
              {
                loading: () => <Loader />,
              },
            );
            return <DynamicSelect key={name} {...elementProps} options={options} {...restFieldProps} />;
          case "richeditor":
            const DynamicMarkdown = dynamic(
              async () => (await import("@components/commons/Form/DynamicMarkdown")).default,
              {
                loading: () => <Loader />,
              },
            );
            return <DynamicMarkdown key={name} {...elementProps} options={options} {...restFieldProps} />;
          case "datepicker":
            const DynamicDatepicker = dynamic(
              async () => (await import("@components/commons/Form/DynamicDatepicker")).default,
              {
                loading: () => <Loader />,
              },
            );
            return <DynamicDatepicker key={name} {...elementProps} {...restFieldProps} />;
          case "colorpicker":
            const DynamicColorPicker = dynamic(
              async () => (await import("@components/commons/Form/DynamicColorPicker")).default,
              {
                loading: () => <Loader />,
              },
            );
            return <DynamicColorPicker key={name} {...elementProps} {...restFieldProps} />;
          default:
            const DynamicText = dynamic(async () => (await import("@components/commons/Form/DynamicText")).default, {
              loading: () => <Loader />,
            });
            return (
              <DynamicText key={name} {...elementProps} {...restFieldProps} type={type} keyProp={`${name} - ${type}`} />
            );
        }
      }),
    [control, fields],
  );

  const submit = useCallback(
    async (formData: FieldValues) => {
      if (onSubmit) await onSubmit(formData, form);
    },
    [form, onSubmit],
  );

  useEffect(() => {
    if (!mapValues) reset();
    if (mapValues) {
      for (let [key, value] of Object.entries(mapValues)) {
        let valueToUpdate = value;
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        const isDateValue = typeof value === "string" && regex.test(value);
        if (isDateValue) {
          valueToUpdate = new Date(value);
        }
        setValue(key, valueToUpdate, { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [mapValues, reset, setValue]);
  return (
    <form className="w-full">
      <div className="flex flex-wrap relative overflow-auto">{registerFields}</div>
      <div className="h-px bg-gray-100 mt-1 mb-3  mx-2"></div>

      <div className="flex p-2">
        <BaseButton
          {...submitProps}
          type="submit"
          label="Submit"
          onClick={handleSubmit(submit)}
          loading={isSubmitting}
          disabled={isSubmitting}></BaseButton>
      </div>
    </form>
  );
}
