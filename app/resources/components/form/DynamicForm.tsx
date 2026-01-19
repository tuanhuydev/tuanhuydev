"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, ButtonProps } from "@resources/components/common/Button";
import { logService } from "@server/services/LogService";
import { Suspense, lazy, memo, useEffect, useMemo, useImperativeHandle, forwardRef } from "react";
import { Control, FieldValues, UseFormReturn, useForm } from "react-hook-form";
import * as yup from "yup";

// --- LAZY LOADED COMPONENTS ---
const DynamicDatePicker = lazy(() => import("./DynamicDatePicker").then((m) => ({ default: m.DynamicDatePicker })));
const DynamicMarkdown = lazy(() => import("./DynamicMarkdown"));
const DynamicSelect = lazy(() => import("./DynamicSelect"));
const DynamicTable = lazy(() => import("./DynamicTable"));
const DynamicText = lazy(() => import("./DynamicText"));

// --- TYPE DEFINITIONS ---
export type FieldType =
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
  // allow flexible props
  [key: string]: unknown;
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

// Expose these methods to the parent via Ref
export interface DynamicFormHandle {
  submit: () => void;
  reset: UseFormReturn["reset"];
  getForm: () => UseFormReturn;
}

// --- COMPONENT MAPPING ---
const FIELD_COMPONENTS = {
  select: DynamicSelect,
  richeditor: DynamicMarkdown,
  datepicker: DynamicDatePicker,
  table: DynamicTable,
  text: DynamicText,
} as const;

// --- SCHEMA HELPERS ---
const createStringSchema = (validate: FieldValidation): yup.StringSchema => {
  let schema = yup.string();
  if (validate.required) schema = schema.required("This field is required");
  if (typeof validate.min === "number") schema = schema.min(validate.min, `Must be at least ${validate.min} chars`);
  if (typeof validate.max === "number") schema = schema.max(validate.max, `Must be at most ${validate.max} chars`);
  return schema;
};

const createEmailSchema = (validate: FieldValidation): yup.StringSchema => {
  let schema = yup.string().email("Invalid email format");
  if (validate.required) schema = schema.required("This field is required");
  return schema;
};

const createNumberSchema = (validate: FieldValidation): yup.NumberSchema => {
  let schema = yup.number().typeError("Must be a number");
  if (validate.required) schema = schema.required("This field is required");
  if (typeof validate.min === "number") schema = schema.min(validate.min, `Min value is ${validate.min}`);
  if (typeof validate.max === "number") schema = schema.max(validate.max, `Max value is ${validate.max}`);
  return schema;
};

const createDateSchema = (validate: FieldValidation): yup.DateSchema => {
  let schema = yup.date().typeError("Invalid date");
  if (validate.required) schema = schema.required("This field is required");
  if (typeof validate.min === "string") schema = schema.min(new Date(validate.min), `After ${validate.min}`);
  if (typeof validate.max === "string") schema = schema.max(new Date(validate.max), `Before ${validate.max}`);
  return schema;
};

const createSelectSchema = (validate: FieldValidation): yup.Schema => {
  if (validate.multiple) {
    let schema = yup.array();
    if (validate.required) schema = schema.min(1, "Selection required");
    return schema;
  }
  let schema = yup.mixed();
  if (validate.required) schema = schema.required("Selection required");
  return schema;
};

const createTableSchema = (validate: FieldValidation): yup.Schema => {
  const minItems = typeof validate.min === "number" ? validate.min : 0;
  let schema = yup.array().min(minItems);
  if (validate.required) {
    schema = schema.min(Math.max(minItems, 1), "At least one item required");
  }
  return schema;
};

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

const isFields = (fields: Field[] | FieldGroup[]): fields is Field[] => {
  return Array.isArray(fields) && fields.length > 0 && "type" in fields[0];
};

const createSchemaFromFields = (fields: Field[] | FieldGroup[]) => {
  const schema: Record<string, yup.Schema> = {};
  const allFields = isFields(fields) ? fields : fields.flatMap((group) => group.fields);

  allFields.forEach(({ name, validate, type }) => {
    if (validate) {
      schema[name] = createFieldValidationSchema(type, validate);
    }
  });

  return yup.object(schema);
};

// --- SUB-COMPONENTS ---
const FormField = memo(({ field, control }: { field: Field; control: Control<FieldValues> }) => {
  const { name, type, options, label, className, ...rest } = field;

  // Determine which component to render
  const Component = FIELD_COMPONENTS[type as keyof typeof FIELD_COMPONENTS] || DynamicText;

  // Calculate specific conditions
  const isTextType = !["select", "richeditor", "datepicker", "table"].includes(type);

  // PREPARE PROPS:
  // We construct the props object BEFORE rendering to avoid the
  // "complex type inference" crash in the Next.js build worker.
  const componentProps: Record<string, unknown> = {
    control,
    name,
    keyProp: name,
    ...rest,
  };

  // Handle Options & Table Columns safely
  if (type === "table") {
    // Explicitly handle columns for table type
    // We use FieldOptions['columns'] interface instead of `typeof options` to prevent recursion
    const safeColumns: NonNullable<FieldOptions["columns"]> = options?.columns ?? [];

    componentProps.options = {
      ...(options ?? {}),
      columns: safeColumns,
    };
    // If DynamicTable also needs 'columns' as a direct prop:
    componentProps.columns = safeColumns;
  } else {
    // Pass standard options for other fields
    componentProps.options = options;
  }

  // Handle Text Types
  if (isTextType) {
    componentProps.type = type;
  }

  return (
    <div className={className || "w-full"}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      {/* We cast Component to 'any' here specifically to avoid TypeScript complaining 
        about the union of incompatible props across different component types. 
        The runtime logic above ensures the correct props are present.
      */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Component {...(componentProps as any)} />
    </div>
  );
});
FormField.displayName = "FormField";

/**
 * Handles the Layout Logic
 */
const RenderFormContent = ({ config, control }: { config: DynamicFormConfig; control: Control<FieldValues> }) => {
  const { fields } = config;

  if (isFields(fields)) {
    return (
      <div className="space-y-5">
        {fields.map((f) => (
          <FormField key={f.name} field={f} control={control} />
        ))}
      </div>
    );
  }

  const topSections = fields.slice(0, 2);
  const bottomSections = fields.slice(2);

  return (
    <>
      {topSections.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 mb-8">
          {topSections.map((group, index) => (
            <div key={group.name} className={`w-full ${index === 0 ? "lg:pr-4" : ""} lg:w-1/2`}>
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.name}</h3>
                <div className="mt-1.5 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
              </div>
              <div className="flex flex-wrap gap-5">
                {group.fields.map((f) => (
                  <FormField key={f.name} field={f} control={control} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {bottomSections.map((group) => (
        <div key={group.name} className="mb-8 last:mb-0">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.name}</h3>
            <div className="mt-1.5 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
          </div>
          <div className="flex flex-wrap gap-5">
            {group.fields.map((f) => (
              <FormField key={f.name} field={f} control={control} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

// --- MAIN COMPONENT ---
const DynamicForm = forwardRef<DynamicFormHandle, DynamicFormProps>(function DynamicForm(
  { config, onSubmit, mapValues, disabled = false },
  ref,
) {
  const schema = useMemo(() => createSchemaFromFields(config.fields), [config.fields]);

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {},
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;
  const { allowDefault = true, ...restSubmitProps } = config.submitProps || {};

  const internalSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data, form);
    } catch (error) {
      logService.log(error);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: () => void handleSubmit(internalSubmit)(),
    reset: (values) => reset(values),
    getForm: () => form,
  }));

  useEffect(() => {
    if (config.setForm) {
      config.setForm(form);
    }
  }, [config.setForm, form]);

  useEffect(() => {
    if (mapValues) {
      const initialValues = { ...mapValues };
      const allFields = isFields(config.fields) ? config.fields : config.fields.flatMap((g) => g.fields);

      allFields
        .filter((f) => f.type === "datepicker")
        .forEach((f) => {
          const val = initialValues[f.name];
          if (typeof val === "string") {
            const date = new Date(val);
            if (!isNaN(date.getTime())) initialValues[f.name] = date;
          }
        });

      reset(initialValues);
    }
  }, [mapValues, reset, config.fields]);

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit(internalSubmit)}>
      <Suspense fallback={<div className="p-8 w-full text-center text-gray-500 animate-pulse">Loading form...</div>}>
        <fieldset disabled={disabled || isSubmitting} className="border-none p-0 m-0 w-full">
          <RenderFormContent config={config} control={control} />
        </fieldset>
      </Suspense>

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

export default memo(DynamicForm);
