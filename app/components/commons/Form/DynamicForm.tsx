import Loader from "../Loader";
import BaseButton from "../buttons/BaseButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { ButtonProps } from "antd/es/button";
import dynamic from "next/dynamic";
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import * as yup from "yup";

const DynamicColorPicker = dynamic(() => import("./DynamicColorPicker"));
const DynamicDatepicker = dynamic(() => import("./DynamicDatepicker"));
const DynamicMarkdown = dynamic(() => import("./DynamicMarkdown"));
const DynamicSelect = dynamic(() => import("./DynamicSelect"));
const DynamicTable = dynamic(() => import("./DynamicTable"));
const DynamicText = dynamic(() => import("./DynamicText"));

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
  const allFields = isFieldArray(fields) ? fields : fields.flatMap((group) => group.fields);
  allFields.forEach(({ name, validate, type }: Field) => {
    if (validate) schema[name] = fieldValidationSchema(type, validate);
  });

  return yup.object(schema);
};

const DynamicForm = ({ config, onSubmit, mapValues, submitProps }: DynamicFormProps) => {
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
          ...restFieldProps,
        };
        switch (type) {
          case "select":
            return <DynamicSelect key={name} {...elementProps} />;
          case "richeditor":
            return <DynamicMarkdown key={name} {...elementProps} />;
          case "datepicker":
            return <DynamicDatepicker key={name} {...elementProps} />;
          case "colorpicker":
            return <DynamicColorPicker key={name} {...elementProps} />;
          case "table":
            return <DynamicTable key={name} {...elementProps} />;
          default:
            return <DynamicText key={`${name} - ${type}`} {...elementProps} type={type} />;
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
      registeredFields = fields.flatMap((group: ElementGroup) => [
        <div className="m-0 px-2 text-slate-500 font-bold" key={group.name}>
          {group.name}
        </div>,
        ...registerFields(group.fields),
      ]);
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
        setValue(key, valueToUpdate, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    }
  }, [mapValues, reset, setValue]);

  return useMemo(
    () => (
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
            disabled={isSubmitting}
          />
        </div>
      </form>
    ),
    [registeredFields, submitProps, handleSubmit, submit, isSubmitting],
  );
};

export default DynamicForm;
