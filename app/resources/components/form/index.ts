// FormV2 - Optimized Form Components with Native MUI
// Main exports for FormV2 components

// Main Form Component
export { default as DynamicForm } from "./DynamicForm";

// Base Components (prefixed with Form to avoid conflicts with shadcn components)
export { default as FormInput } from "./Fields/Input";
export { default as FormTextarea } from "./Fields/Textarea";
export { default as FormSelect } from "./Fields/Select";
export { default as FormDatePicker } from "./Fields/DatePicker";
export { default as FormMenu } from "./Fields/Menu";
export { default as FormModal } from "./Fields/Modal";

// Dynamic Components
export { default as DynamicText } from "./DynamicText";
export { default as DynamicSelect } from "./DynamicSelect";
export { default as DynamicDatePicker } from "./DynamicDatePicker";
export { default as DynamicMarkdown } from "./DynamicMarkdown";
export { default as DynamicTable } from "./DynamicTable";

// Note: Performance utilities and types can be imported directly:
// import { useFormPerformance } from "./resources/components/common/FormV2/utils/performance";
// import type { FormFieldConfig, DynamicFormProps } from "./resources/components/common/FormV2/types";
