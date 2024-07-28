"use client";

import Loader from "../Loader";
import BaseButton from "../buttons/BaseButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { ButtonProps } from "antd/es/button";
import dynamic from "next/dynamic";
import { Fragment, ReactNode, useCallback, useEffect, useState } from "react";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import * as yup from "yup";

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
  | "colorpicker"
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
  options?: ObjectType;
  validate?: FieldValidation;
  style?: ObjectType;
  className?: string;
}
export interface ElementGroup {
  name: string;
  fields: Field[];
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
  fields: Field[] | ElementGroup[];
}

const isFieldArray = (fields: any): fields is Field[] => {
  return Array.isArray(fields) && fields.length > 0 && "type" in fields[0];
};

const isElementGroupArray = (fields: any): fields is ElementGroup[] => {
  return Array.isArray(fields) && fields.length > 0 && "fields" in fields[0];
};

const fieldValidationSchema = (type: any, validate: ObjectType) => {
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
    case "table":
      rule = yup.array();
      break;
    default:
      rule = yup.string();
  }

  // Apply rules

  if ("min" in validate) {
    const isNumberMin = Number.isInteger(validate.min);
    rule = rule.min(
      isNumberMin ? validate.min : yup.ref(validate.min),
      `Field must greater than equal field '${validate.min}'`,
    );
  }
  if ("max" in validate) {
    const isNumberMax = Number.isInteger(validate.max);
    rule = rule.max(
      isNumberMax ? validate.max : yup.ref(validate.max),
      `Field must less than equal field '${validate.min}'`,
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
  const allFields = isFieldArray(fields) ? fields : fields.flatMap((group) => group.fields);
  allFields.forEach(({ name, validate, type }: Field) => {
    if (validate) schema[name] = fieldValidationSchema(type, validate);
  });

  return yup.object(schema);
};

const DynamicSelect = dynamic(() => import("@components/commons/Form/DynamicSelect"), { loading: () => <Loader /> });

const DynamicMarkdown = dynamic(() => import("@components/commons/Form/DynamicMarkdown"), {
  loading: () => <Loader />,
});

const DynamicDatepicker = dynamic(() => import("@components/commons/Form/DynamicDatepicker"), {
  loading: () => <Loader />,
});

const DynamicColorPicker = dynamic(() => import("@components/commons/Form/DynamicColorPicker"), {
  loading: () => <Loader />,
});

const DynamicText = dynamic(() => import("@components/commons/Form/DynamicText"), { loading: () => <Loader /> });

const DynamicTable = dynamic(() => import("./DynamicTable"), { loading: () => <Loader /> });

export default function DynamicForm({ config, onSubmit, mapValues, submitProps }: DynamicFormProps) {
  const form = useForm({ resolver: yupResolver(makeSchema(config)) });
  const [registeredFields, setRegisteredFields] = useState<ReactNode[]>([]);
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;
  const { fields } = config;

  const registerFields = useCallback(
    (fields: Array<Field>) => {
      return fields.map((field: Field) => {
        const { name, type, options, ...restFieldProps } = field;
        const elementProps = {
          control,
          name,
          options: options as any,
          keyProp: name,
        };
        switch (type) {
          case "select":
            return <DynamicSelect key={name} {...elementProps} {...restFieldProps} />;
          case "richeditor":
            return <DynamicMarkdown key={name} {...elementProps} {...restFieldProps} />;
          case "datepicker":
            return <DynamicDatepicker key={name} {...elementProps} {...restFieldProps} />;
          case "colorpicker":
            return <DynamicColorPicker key={name} {...elementProps} {...restFieldProps} />;
          case "table":
            return <DynamicTable key={name} {...elementProps} {...restFieldProps} />;
          default:
            return (
              <DynamicText key={name} {...elementProps} {...restFieldProps} type={type} keyProp={`${name} - ${type}`} />
            );
        }
      });
    },
    [control],
  );

  const checkFieldsProps = useCallback(() => {
    let registeredFields: ReactNode[] = [];
    if (isFieldArray(fields)) {
      registeredFields = registerFields(fields);
    } else if (isElementGroupArray(fields)) {
      registeredFields = fields.map((group: ElementGroup) => {
        return (
          <Fragment key={group.name}>
            <div className="m-0 px-2 text-slate-500 font-bold">{group.name}</div>
            {registerFields(group.fields)}
          </Fragment>
        );
      });
    }
    setRegisteredFields(registeredFields);
  }, [fields, registerFields]);

  const submit = useCallback(
    async (formData: FieldValues) => {
      try {
        if (onSubmit) await onSubmit(formData, form);
      } catch (error) {
        console.log(error);
      }
    },
    [form, onSubmit],
  );

  useEffect(() => {
    checkFieldsProps();
  }, [checkFieldsProps]);

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
      <div className="flex flex-wrap relative overflow-auto">{registeredFields}</div>
      <div className="h-px bg-gray-100 dark:bg-slate-700 mt-1 mb-3 mx-2"></div>

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
