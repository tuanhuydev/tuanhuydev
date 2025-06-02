"use client";

import BaseButton, { BaseButtonProps } from "../buttons/BaseButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { Suspense, lazy, ReactNode, useCallback, useEffect, useState } from "react";
import { Control, FieldValues, UseFormReturn, useForm } from "react-hook-form";
import LogService from "server/services/LogService";
import * as yup from "yup";

// Replace dynamic imports with React lazy
const DynamicDatePicker = lazy(() =>
  import("./DynamicDatePicker").then((module) => ({
    default: module.DynamicDatePicker,
  })),
);
const DynamicMarkdown = lazy(() => import("./DynamicMarkdown"));
const DynamicSelect = lazy(() => import("./DynamicSelect"));
const DynamicTable = lazy(() => import("./DynamicTable"));
const DynamicText = lazy(() => import("./DynamicText"));

export type ObjectType = Record<string, any>;

type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "select"
  | "richeditor"
  | "datepicker"
  | "table";

export interface FieldValidation {
  required?: boolean;
  min?: number | string;
  max?: number | string;
  match?: string;
  multiple?: boolean;
}

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  options?: {
    placeholder?: string;
    mode?: "multiple" | "single";
    rows?: number;
    format?: string;
    size?: "small" | "large";
    disabled?: boolean;
    multiple?: boolean;
    options?: Array<{ value: string; label: string }>;
    className?: string;
  };
  validate?: FieldValidation;
  style?: ObjectType;
  className?: string;
}

export interface FieldGroup {
  name: string;
  fields: Field[];
}

interface SubmitProps extends BaseButtonProps {
  allowDefault?: boolean;
}

export interface DynamicFormConfig {
  fields: Field[] | FieldGroup[];
  setForm?: (form: UseFormReturn) => void;
  submitProps?: Partial<SubmitProps>;
}

export interface DynamicFormProps {
  config: DynamicFormConfig;
  disabled?: boolean;
  onSubmit: (formData: FieldValues, form?: UseFormReturn) => void | Promise<any>;
  mapValues?: ObjectType;
}

const isFields = (fields: any): fields is Field[] => {
  return Array.isArray(fields) && fields.length > 0 && "type" in fields[0];
};

const isFieldGroups = (fields: any): fields is FieldGroup[] => {
  return Array.isArray(fields) && fields.length > 0 && "fields" in fields[0];
};

const fieldValidationSchema = (type: any, validate: ObjectType) => {
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
    case "table":
      rule = yup.array();
      break;
    default:
      rule = yup.string();
  }

  if ("min" in validate) {
    const isNumberMin = Number.isInteger(validate.min);
    rule = rule.min(
      isNumberMin ? validate.min : yup.ref(validate.min),
      `Field must be greater than or equal to '${validate.min}'`,
    );
  }
  if ("max" in validate) {
    const isNumberMax = Number.isInteger(validate.max);
    rule = rule.max(
      isNumberMax ? validate.max : yup.ref(validate.max),
      `Field must be less than or equal to '${validate.min}'`,
    );
  }

  if ("required" in validate && validate.required) {
    rule = rule.required("Required Field");
  }

  if ("match" in validate) {
    rule = (rule as yup.StringSchema).oneOf([yup.ref(validate.match)], "Passwords must match");
  }
  return rule;
};

const makeSchema = ({ fields }: DynamicFormConfig) => {
  const schema: ObjectType = {};
  const allFields = isFields(fields) ? fields : fields.flatMap((group) => group.fields);
  allFields.forEach(({ name, validate, type }: Field) => {
    if (validate) schema[name] = fieldValidationSchema(type, validate);
  });

  return yup.object(schema);
};

const mapFields = (fields: Array<Field>, control: Control<any>) => {
  return fields.map((field: Field) => {
    const { name, type, options, ...restFieldProps } = field;
    const elementProps = {
      control,
      name,
      options: options as any,
      keyProp: name,
      ...restFieldProps,
    };

    // Wrap each dynamic component in a Suspense boundary
    const renderField = () => {
      switch (type) {
        case "select":
          return <DynamicSelect {...elementProps} />;
        case "richeditor":
          return <DynamicMarkdown {...elementProps} />;
        case "datepicker":
          return <DynamicDatePicker {...elementProps} />;
        case "table":
          return <DynamicTable {...elementProps} />;
        default:
          return <DynamicText {...elementProps} type={type} />;
      }
    };

    return (
      <Suspense key={name} fallback={<div className="p-2">Loading field...</div>}>
        {renderField()}
      </Suspense>
    );
  });
};

const DynamicForm = ({ config, onSubmit, mapValues }: DynamicFormProps) => {
  // Hooks
  const form = useForm({ resolver: yupResolver(makeSchema(config)) });

  // State
  const [fieldNodes, setFieldNodes] = useState<ReactNode[]>([]);

  // Constants
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;
  const { fields, submitProps = {} } = config;
  const { allowDefault = true, ...restSubmitProps } = submitProps;

  const checkFieldsProps = useCallback(() => {
    let fieldNodes: ReactNode[] = [];

    if (isFields(fields)) {
      fieldNodes = mapFields(fields, control);
    } else if (isFieldGroups(fields)) {
      fieldNodes = fields.flatMap((group: FieldGroup) => [
        <div className="m-0 px-2 text-slate-500 font-bold" key={group.name}>
          {group.name}
        </div>,
        ...mapFields(group.fields, control),
      ]);
    }
    setFieldNodes(fieldNodes);
  }, [control, fields]);

  const submit = useCallback(
    async (formData: FieldValues) => {
      try {
        if (onSubmit) await onSubmit(formData, form);
      } catch (error) {
        LogService.log(error);
      }
    },
    [form, onSubmit],
  );

  const mappingValues = useCallback(() => {
    if (!mapValues) reset();
    if (mapValues) {
      for (let [key, value] of Object.entries(mapValues)) {
        console.log(key, value);
        let valueToUpdate = value;
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        const isDateValue = typeof value === "string" && regex.test(value);
        if (isDateValue) {
          valueToUpdate = new Date(value);
        }
        setValue(key, valueToUpdate, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [mapValues, reset, setValue]);

  useEffect(() => {
    checkFieldsProps();
  }, [checkFieldsProps]);

  useEffect(() => {
    mappingValues();
  }, [mappingValues]);

  useEffect(() => {
    if (form && "setForm" in config && typeof config.setForm === "function") {
      config.setForm(form);
    }
  }, [config, form]);

  return (
    <form className="w-full">
      <div className="flex flex-wrap relative overflow-auto">{fieldNodes}</div>
      <div className="h-px bg-gray-100 dark:bg-slate-700 mt-1 mb-3 mx-2"></div>
      <div className="flex p-2">
        {allowDefault && (
          <BaseButton
            {...restSubmitProps}
            type="submit"
            label="Submit"
            onClick={handleSubmit(submit)}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        )}
      </div>
    </form>
  );
};

export default DynamicForm;
