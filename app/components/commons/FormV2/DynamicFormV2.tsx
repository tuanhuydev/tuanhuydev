"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, ButtonProps, CircularProgress, Divider } from "@mui/material";
import { ReactNode, Suspense, lazy, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Control, FieldValues, UseFormReturn, useForm } from "react-hook-form";
import LogService from "server/services/LogService";
import * as yup from "yup";

// Optimized lazy loading with preloading
const DynamicDatePickerV2 = lazy(() =>
  import("./DynamicDatePickerV2").then((module) => ({
    default: module.DynamicDatePickerV2,
  })),
);
const DynamicMarkdownV2 = lazy(() => import("./DynamicMarkdownV2"));
const DynamicSelectV2 = lazy(() => import("./DynamicSelectV2"));
const DynamicTableV2 = lazy(() => import("./DynamicTableV2"));
const DynamicTextV2 = lazy(() => import("./DynamicTextV2"));

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
    // Table specific options
    columns?: Array<{
      config: {
        field: string;
        headerName: string;
        width?: number;
        [key: string]: any;
      };
      options: Array<{ value: string | number; label: string }>;
    }>;
  };
  validate?: FieldValidation;
  style?: ObjectType;
  className?: string;
}

export interface FieldGroup {
  name: string;
  fields: Field[];
}

interface SubmitProps extends ButtonProps {
  allowDefault?: boolean;
}

export interface DynamicFormV2Config {
  fields: Field[] | FieldGroup[];
  setForm?: (form: UseFormReturn) => void;
  submitProps?: Partial<SubmitProps>;
}

export interface DynamicFormV2Props {
  config: DynamicFormV2Config;
  disabled?: boolean;
  onSubmit: (formData: FieldValues, form?: UseFormReturn) => void | Promise<any>;
  mapValues?: ObjectType;
}

// Performance optimization: Create field validation schema
const createFieldValidationSchema = (type: FieldType, validate: FieldValidation) => {
  let schema: any = yup.string();

  switch (type) {
    case "email":
      schema = yup.string().email("Invalid email format");
      break;
    case "number":
      schema = yup.number().typeError("Must be a number");
      break;
    case "datepicker":
      schema = yup.date().typeError("Invalid date");
      break;
    case "select":
      schema = validate.multiple ? yup.array() : yup.mixed();
      break;
    case "table":
      schema = yup.array().min(Number(validate.min) || 0);
      break;
    default:
      schema = yup.string();
  }

  if (validate.required) {
    if (type === "select" && validate.multiple) {
      schema = schema.min(1, "This field is required");
    } else if (type === "table") {
      schema = schema.min(Number(validate.min) || 1, "At least one item is required");
    } else {
      schema = schema.required("This field is required");
    }
  }

  if (validate.min && type !== "table") {
    if (type === "number") {
      schema = schema.min(Number(validate.min), `Must be at least ${validate.min}`);
    } else if (typeof validate.min === "string") {
      schema = schema.min(yup.ref(validate.min), `Must be after ${validate.min}`);
    } else {
      schema = schema.min(Number(validate.min), `Must be at least ${validate.min} characters`);
    }
  }

  if (validate.max) {
    if (type === "number") {
      schema = schema.max(Number(validate.max), `Must be at most ${validate.max}`);
    } else if (typeof validate.max === "string") {
      schema = schema.max(yup.ref(validate.max), `Must be before ${validate.max}`);
    } else {
      schema = schema.max(Number(validate.max), `Must be at most ${validate.max} characters`);
    }
  }

  return schema;
};

// Performance optimization: Check if fields is array or groups
const isFields = (fields: Field[] | FieldGroup[]): fields is Field[] => {
  return Array.isArray(fields) && fields.length > 0 && "type" in fields[0];
};

// Performance optimization: Create schema with memoization
const createSchemaFromFields = (fields: Field[] | FieldGroup[]) => {
  const schema: ObjectType = {};
  const allFields = isFields(fields) ? fields : fields.flatMap((group) => group.fields);

  allFields.forEach(({ name, validate, type }: Field) => {
    if (validate) {
      schema[name] = createFieldValidationSchema(type, validate);
    }
  });

  return yup.object(schema);
};

// Performance optimization: Render fields function
const renderFields = (fields: Array<Field>, control: Control<any>) => {
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
          return <DynamicSelectV2 {...elementProps} />;
        case "richeditor":
          return <DynamicMarkdownV2 {...elementProps} />;
        case "datepicker":
          return <DynamicDatePickerV2 {...elementProps} />;
        case "table":
          return <DynamicTableV2 {...elementProps} />;
        default:
          return <DynamicTextV2 {...elementProps} type={type} />;
      }
    };

    return (
      <Suspense key={name} fallback={<div className="p-2">Loading field...</div>}>
        {renderField()}
      </Suspense>
    );
  });
};

const DynamicFormV2 = memo(function DynamicFormV2({
  config,
  onSubmit,
  mapValues,
  disabled = false,
}: DynamicFormV2Props) {
  // Memoize schema to prevent unnecessary recalculations
  const schema = useMemo(() => createSchemaFromFields(config.fields), [config.fields]);

  // Hooks
  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched", // Only validate after user interaction
    defaultValues: {}, // Provide empty default values to prevent initial validation errors
  });

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

  // Performance optimization: Memoize field checking
  const checkFieldsProps = useCallback(() => {
    let fieldNodes: ReactNode[] = [];

    if (isFields(fields)) {
      fieldNodes = renderFields(fields, control);
    } else {
      fieldNodes = fields.map((group) => (
        <div key={group.name} className="mb-4 flex-grow">
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--mui-palette-text-primary)" }}>
            {group.name}
          </h3>
          <div className="space-y-2 w-full">{renderFields(group.fields, control)}</div>
        </div>
      ));
    }

    setFieldNodes(fieldNodes);
  }, [fields, control]);

  // Memoize the setForm callback to prevent it from changing
  const setFormCallback = useCallback(() => {
    if (config.setForm) {
      config.setForm(form);
    }
  }, [config, form]);

  // Set form reference for parent component (once)
  useEffect(() => {
    setFormCallback();
    // Only run this effect when form or the callback changes
  }, [setFormCallback]);

  // Map initial values - add proper dependency check
  useEffect(() => {
    if (mapValues) {
      const initialValues = { ...mapValues };

      // Convert date strings to Date objects for date picker fields
      const allFields = isFields(config.fields) ? config.fields : config.fields.flatMap((group) => group.fields);
      const dateFields = allFields.filter((field) => field.type === "datepicker");

      dateFields.forEach((field) => {
        const value = initialValues[field.name];
        if (value && typeof value === "string") {
          // Check if it's a valid date string
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            initialValues[field.name] = date;
          }
        }
      });

      // Use reset instead of multiple setValue calls to avoid re-renders
      reset(initialValues);
    }
  }, [mapValues, reset, config.fields]); // Only run when mapValues changes

  // Check and render fields
  useEffect(() => {
    checkFieldsProps();
  }, [checkFieldsProps]);

  // Performance optimization: Memoize submit handler
  const submit = useCallback(
    async (formData: FieldValues) => {
      try {
        await onSubmit(formData, form);
      } catch (error) {
        LogService.log(error);
      }
    },
    [onSubmit, form],
  );

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(submit)}>
      <fieldset disabled={disabled || isSubmitting} className="border-none p-0 m-0">
        <div className="flex flex-wrap">{fieldNodes}</div>
      </fieldset>

      <Divider sx={{ my: 3, mx: 2 }} />

      <div className="flex p-2">
        {allowDefault && (
          <Button
            {...restSubmitProps}
            type="submit"
            onClick={handleSubmit(submit)}
            disabled={disabled || isSubmitting}
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}>
            Submit
          </Button>
        )}
      </div>
    </form>
  );
});

export default DynamicFormV2;
