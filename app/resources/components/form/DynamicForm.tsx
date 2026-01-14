"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, ButtonProps } from "@resources/components/common/Button";
import { ReactNode, Suspense, lazy, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Control, FieldValues, UseFormReturn, useForm } from "react-hook-form";
import LogService from "server/services/LogService";
import * as yup from "yup";

// Optimized lazy loading with preloading
const DynamicDatePicker = lazy(() =>
  import("./DynamicDatePicker").then((module) => ({
    default: module.DynamicDatePicker,
  })),
);
const DynamicMarkdown = lazy(() => import("./DynamicMarkdown"));
const DynamicSelect = lazy(() => import("./DynamicSelect"));
const DynamicTable = lazy(() => import("./DynamicTable"));
const DynamicText = lazy(() => import("./DynamicText"));

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
  [key: string]: unknown;
}

export type FieldOptions = {
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
    field: string;
    headerName: string;
    width?: number;
    editable?: boolean;
    type?: "text" | "select" | "number";
    options?: Array<{ value: string | number; label: string }>;
  }>;
};

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  options?: FieldOptions;
  validate?: FieldValidation;
  style?: Record<string, unknown>;
  className?: string;
}

export interface FieldGroup {
  name: string;
  fields: Field[];
}

interface SubmitProps extends ButtonProps {
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
  onSubmit: (formData: FieldValues, form?: UseFormReturn) => void | Promise<unknown>;
  mapValues?: Record<string, unknown>;
}

// Schema creation helpers for type-safe validation
const createStringSchema = (validate: FieldValidation): yup.StringSchema => {
  let schema = yup.string();

  if (validate.required) {
    schema = schema.required("This field is required");
  }

  if (validate.min !== undefined && typeof validate.min === "number") {
    schema = schema.min(validate.min, `Must be at least ${validate.min} characters`);
  }

  if (validate.max !== undefined && typeof validate.max === "number") {
    schema = schema.max(validate.max, `Must be at most ${validate.max} characters`);
  }

  return schema;
};

const createEmailSchema = (validate: FieldValidation): yup.StringSchema => {
  let schema = yup.string().email("Invalid email format");

  if (validate.required) {
    schema = schema.required("This field is required");
  }

  return schema;
};

const createNumberSchema = (validate: FieldValidation): yup.NumberSchema => {
  let schema = yup.number().typeError("Must be a number");

  if (validate.required) {
    schema = schema.required("This field is required");
  }

  if (validate.min !== undefined && typeof validate.min === "number") {
    schema = schema.min(validate.min, `Must be at least ${validate.min}`);
  }

  if (validate.max !== undefined && typeof validate.max === "number") {
    schema = schema.max(validate.max, `Must be at most ${validate.max}`);
  }

  return schema;
};

const createDateSchema = (validate: FieldValidation): yup.DateSchema => {
  let schema = yup.date().typeError("Invalid date");

  if (validate.required) {
    schema = schema.required("This field is required");
  }

  if (validate.min !== undefined && typeof validate.min === "string") {
    schema = schema.min(yup.ref(validate.min), `Must be after ${validate.min}`);
  }

  if (validate.max !== undefined && typeof validate.max === "string") {
    schema = schema.max(yup.ref(validate.max), `Must be before ${validate.max}`);
  }

  return schema;
};

const createSelectSchema = (validate: FieldValidation): yup.Schema => {
  if (validate.multiple) {
    let schema = yup.array();
    if (validate.required) {
      schema = schema.min(1, "This field is required");
    }
    return schema;
  }

  let schema = yup.mixed();
  if (validate.required) {
    schema = schema.required("This field is required");
  }
  return schema;
};

const createTableSchema = (validate: FieldValidation): yup.Schema => {
  const minItems = typeof validate.min === "number" ? validate.min : 0;
  let schema = yup.array().min(minItems);

  if (validate.required) {
    const requiredMin = Math.max(minItems, 1);
    schema = schema.min(requiredMin, "At least one item is required");
  }

  return schema;
};

// Performance optimization: Create field validation schema with type safety
const createFieldValidationSchema = (type: FieldType, validate: FieldValidation): yup.Schema => {
  switch (type) {
    case "email":
      return createEmailSchema(validate);
    case "number":
      return createNumberSchema(validate);
    case "datepicker":
      return createDateSchema(validate);
    case "select":
      return createSelectSchema(validate);
    case "table":
      return createTableSchema(validate);
    case "text":
    case "password":
    case "textarea":
    case "richeditor":
    default:
      return createStringSchema(validate);
  }
};

// Performance optimization: Check if fields is array or groups
const isFields = (fields: Field[] | FieldGroup[]): fields is Field[] => {
  return Array.isArray(fields) && fields.length > 0 && "type" in fields[0];
};

// Performance optimization: Create schema with memoization
const createSchemaFromFields = (fields: Field[] | FieldGroup[]) => {
  const schema: Record<string, yup.Schema> = {};
  const allFields = isFields(fields) ? fields : fields.flatMap((group) => group.fields);

  allFields.forEach(({ name, validate, type }: Field) => {
    if (validate) {
      schema[name] = createFieldValidationSchema(type, validate);
    }
  });

  return yup.object(schema);
};

// Performance optimization: Render fields function
const renderFields = (fields: Array<Field>, control: Control<FieldValues>) => {
  return fields.map((field: Field) => {
    const { name, type, options, label, className, ...restFieldProps } = field;
    const elementProps = {
      control,
      name,
      options: options,
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
          return (
            <DynamicTable {...elementProps} options={options?.columns ? { columns: options.columns } : undefined} />
          );
        default:
          return <DynamicText {...elementProps} type={type} />;
      }
    };

    return (
      <Suspense key={name} fallback={<div className="p-2">Loading field...</div>}>
        <div className={className || "w-full"}>
          {label && (
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {label}
            </label>
          )}
          {renderField()}
        </div>
      </Suspense>
    );
  });
};

const DynamicForm = memo(function DynamicForm({ config, onSubmit, mapValues, disabled = false }: DynamicFormProps) {
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
      // Group first two sections side by side, rest full width
      const sections = fields.map((group, index) => {
        const isHalfWidth = index < 2; // First two sections (Basic Info & Timeline)
        return (
          <div key={group.name} className={isHalfWidth ? "w-full lg:w-1/2 lg:pr-4 last:lg:pr-0" : "w-full"}>
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.name}</h3>
              <div className="mt-1.5 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
            </div>
            <div className="flex flex-wrap gap-5">{renderFields(group.fields, control)}</div>
          </div>
        );
      });

      // Wrap first two in a flex container for side-by-side layout
      fieldNodes = [
        <div key="top-sections" className="flex flex-col lg:flex-row gap-0 lg:gap-8 mb-8">
          {sections.slice(0, 2)}
        </div>,
        ...sections.slice(2).map((section, idx) => (
          <div key={`section-${idx + 2}`} className="mb-8 last:mb-0">
            {section}
          </div>
        )),
      ];
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

  // Wrap submit handler to avoid Promise return type issue
  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      void handleSubmit(submit)(e);
    },
    [handleSubmit, submit],
  );

  return (
    <form className="flex flex-col" onSubmit={handleFormSubmit}>
      <fieldset disabled={disabled || isSubmitting} className="border-none p-0 m-0">
        <div className="space-y-6">{fieldNodes}</div>
      </fieldset>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          {allowDefault && (
            <Button {...restSubmitProps} type="submit" disabled={disabled || isSubmitting} size="lg">
              {isSubmitting ? "Submitting..." : mapValues?.id ? "Update" : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
});

export default DynamicForm;
