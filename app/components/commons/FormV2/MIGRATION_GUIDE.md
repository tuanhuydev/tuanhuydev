# FormV2 Migration Guide

## Overview

FormV2 is an optimized version of the original Form components, replacing MUI Base components with native MUI components while maintaining performance and functionality.

## Key Improvements

### 🚀 Performance Optimizations

- **React.memo()** for component memoization
- **useMemo()** for expensive calculations
- **Lazy loading** with component preloading
- **Real-time validation** with debouncing
- **Performance monitoring** utilities

### 🔧 Technical Upgrades

- **Native MUI Components**: Replaced MUI Base with @mui/material
- **Better TypeScript Support**: Enhanced type definitions
- **Improved Accessibility**: Built-in ARIA support
- **Modern React Patterns**: Hooks-based architecture

### 🎨 Enhanced Features

- **Conditional Rendering**: Fields can show/hide based on other field values
- **Grid Layout**: Responsive grid system for field positioning
- **Advanced Validation**: Real-time validation with custom rules
- **Performance Metrics**: Built-in performance monitoring

## Migration Steps

### 1. Update Imports

```typescript
// Before (Form)
import { DynamicForm } from "@/components/commons/Form";
// After (FormV2)
import { DynamicFormV2 } from "@/components/commons/FormV2";
```

### 2. Component Mapping

| Original Component | FormV2 Equivalent  | Changes                                    |
| ------------------ | ------------------ | ------------------------------------------ |
| `DynamicForm`      | `DynamicFormV2`    | Enhanced performance, real-time validation |
| `BaseInput`        | `BaseInputV2`      | Native MUI TextField                       |
| `BaseSelect`       | `BaseSelectV2`     | Native MUI Select                          |
| `BaseDatePicker`   | `BaseDatePickerV2` | Optimized DatePicker wrapper               |
| `BaseModal`        | `BaseModalV2`      | Native MUI Modal                           |
| `BaseMenu`         | `BaseMenuV2`       | Native MUI Menu                            |

### 3. API Changes

#### Field Configuration

```typescript
// Enhanced field config with new features
const fieldConfig: FormFieldConfig = {
  id: "email",
  type: "text",
  label: "Email Address",
  required: true,
  // NEW: Grid layout support
  gridSize: { xs: 12, md: 6 },
  // NEW: Conditional rendering
  conditionalRender: (values) => values.contactMethod === "email",
  // NEW: Advanced validation
  validation: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => (value.includes("company.com") ? undefined : "Must use company email"),
  },
};
```

#### Form Props

```typescript
// NEW: Enhanced validation modes
<DynamicFormV2
  fields={fields}
  validationMode="onChange" // 'onChange' | 'onBlur' | 'onSubmit'
  onSubmit={handleSubmit}
  onValidate={handleValidate} // NEW: Custom validation
/>
```

### 4. Performance Monitoring

```typescript
import { useFormPerformance } from "@/components/commons/FormV2";

function MyForm() {
  const { metrics, startTimer, endTimer } = useFormPerformance();

  // Monitor performance
  console.log("Render time:", metrics.renderTime);
  console.log("Re-renders:", metrics.reRenderCount);
}
```

## Breaking Changes

### 1. Prop Name Changes

- `validationMode` is now required for real-time validation
- `gridSize` replaces manual layout props
- `conditionalRender` replaces `showIf` function

### 2. Validation API

```typescript
// Before
const validation = (values) => ({
  email: !values.email ? 'Required' : undefined
});

// After - Enhanced with async support
const validation = async (values) => ({
  email: await validateEmailAsync(values.email)
});
```

### 3. Import Changes

```typescript
// Before - Multiple imports
import { DynamicForm } from "@/components/commons/Form";
// After - Single import
import { BaseInputV2, DynamicFormV2 } from "@/components/commons/FormV2";
import { BaseInput } from "@/components/commons/Inputs";
```

## Examples

### Basic Form

```typescript
import { DynamicFormV2 } from "@/components/commons/FormV2";

const fields = [
  {
    id: "name",
    type: "text",
    label: "Full Name",
    required: true,
    gridSize: { xs: 12, md: 6 },
  },
  {
    id: "email",
    type: "text",
    label: "Email",
    required: true,
    gridSize: { xs: 12, md: 6 },
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
];

function ContactForm() {
  return <DynamicFormV2 fields={fields} validationMode="onChange" onSubmit={(values) => console.log(values)} />;
}
```

### Advanced Form with Conditional Fields

```typescript
const advancedFields = [
  {
    id: "contactMethod",
    type: "select",
    label: "Preferred Contact Method",
    options: [
      { value: "email", label: "Email" },
      { value: "phone", label: "Phone" },
    ],
    gridSize: { xs: 12 },
  },
  {
    id: "email",
    type: "text",
    label: "Email Address",
    required: true,
    conditionalRender: (values) => values.contactMethod === "email",
    gridSize: { xs: 12, md: 6 },
  },
  {
    id: "phone",
    type: "text",
    label: "Phone Number",
    required: true,
    conditionalRender: (values) => values.contactMethod === "phone",
    gridSize: { xs: 12, md: 6 },
  },
];
```

## Performance Best Practices

1. **Use memoization** for complex field configurations
2. **Enable real-time validation** only when needed
3. **Implement debouncing** for expensive validation
4. **Monitor performance** in development mode
5. **Use lazy loading** for large forms

## Testing Migration

1. **Unit Tests**: Update component imports and prop names
2. **Integration Tests**: Verify form submission and validation
3. **Performance Tests**: Compare render times with original
4. **Accessibility Tests**: Verify ARIA compliance

## Support

For migration issues or questions:

- Check the TypeScript definitions in `types.ts`
- Review performance metrics with `useFormPerformance`
- Test components individually before full migration
- Gradual migration is recommended for large applications

## ✅ Migration Status

### COMPLETED ✅

- [x] **Core Components Migration**: All MUI Base components replaced with native MUI
- [x] **Performance Optimizations**: React.memo, useMemo, lazy loading implemented
- [x] **TypeScript Issues Fixed**: All compilation errors resolved
- [x] **Base Components**: BaseInputV2, BaseSelectV2, BaseTextareaV2, BaseDatePickerV2, BaseMenuV2, BaseModalV2
- [x] **Dynamic Components**: DynamicTextV2, DynamicSelectV2, DynamicDatePickerV2, DynamicMarkdownV2, DynamicTableV2
- [x] **Main Form Component**: DynamicFormV2 with real-time validation
- [x] **Performance Utils**: Performance monitoring hooks and utilities
- [x] **Type Definitions**: Comprehensive TypeScript types
- [x] **Example Usage**: ExampleUsage.tsx demonstrating FormV2 components
- [x] **Test Page**: Created /test-formv2 page for testing

### AVAILABLE FOR TESTING 🧪

- **Test Page**: Visit `/test-formv2` to see FormV2 components in action
- **Example Usage**: See `ExampleUsage.tsx` for implementation examples
- **Performance Monitoring**: Built-in performance tracking available

### NEXT STEPS 📋

1. **Integration Testing**: Test FormV2 in actual application scenarios
2. **Performance Benchmarking**: Compare performance with original Form components
3. **Migration Path**: Gradually replace Form usage with FormV2
4. **Documentation**: Create detailed API documentation
5. **Unit Tests**: Add comprehensive test coverage

## LLM-Friendly Component Specifications

### DynamicFormV2

```typescript
/**
 * Main form component that renders a complete form with validation
 * @param {FormFieldConfig[]} fields - Array of field configurations
 * @param {'onChange' | 'onBlur' | 'onSubmit'} validationMode - When to trigger validation
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Function} onValidate - Optional custom validation function
 * @param {Object} initialValues - Optional initial form values
 * @returns {JSX.Element} - Rendered form component
 */
interface DynamicFormV2Props {
  fields: FormFieldConfig[];
  validationMode: "onChange" | "onBlur" | "onSubmit";
  onSubmit: (values: Record<string, any>) => void;
  onValidate?: (values: Record<string, any>) => Record<string, string | undefined>;
  initialValues?: Record<string, any>;
  gridSpacing?: number;
  disabled?: boolean;
}
```

### BaseInputV2

```typescript
/**
 * Basic input component using native MUI TextField
 * @param {string} id - Unique identifier
 * @param {string} label - Input label
 * @param {string} value - Current value
 * @param {Function} onChange - Change handler
 * @param {Object} error - Error state
 * @returns {JSX.Element} - Rendered input component
 */
interface BaseInputV2Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  variant?: "outlined" | "filled" | "standard";
}
```

### BaseSelectV2

```typescript
/**
 * Select component using native MUI Select
 * @param {string} id - Unique identifier
 * @param {string} label - Select label
 * @param {any} value - Current value
 * @param {Array} options - Options to select from
 * @param {Function} onChange - Change handler
 * @param {Object} error - Error state
 * @returns {JSX.Element} - Rendered select component
 */
interface BaseSelectV2Props {
  id: string;
  label: string;
  value: any;
  options: Array<{ value: any; label: string }>;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: "outlined" | "filled" | "standard";
}
```

## Data Schemas

### Form Field Configuration Schema

```typescript
/**
 * Configuration schema for form fields
 * This is the primary data structure used to define forms
 */
interface FormFieldConfig {
  // Core properties
  id: string; // Unique field identifier
  type: "text" | "select" | "date" | "checkbox" | "radio" | "textarea" | "markdown" | "table";
  label: string; // Display label

  // Validation
  required?: boolean; // Is field required
  validation?: {
    // Validation rules
    pattern?: RegExp; // Pattern to validate against
    custom?: (value: any) => string | undefined; // Custom validation function
    min?: number; // Minimum value (for numbers)
    max?: number; // Maximum value (for numbers)
    minLength?: number; // Minimum length (for strings)
    maxLength?: number; // Maximum length (for strings)
  };

  // Layout
  gridSize?: {
    // Responsive grid sizing
    xs?: number; // Extra small screens (phone)
    sm?: number; // Small screens (tablet)
    md?: number; // Medium screens (desktop)
    lg?: number; // Large screens
    xl?: number; // Extra large screens
  };

  // Conditional behavior
  conditionalRender?: (values: Record<string, any>) => boolean; // Function to determine if field should render

  // Type-specific properties
  options?: Array<{ value: any; label: string }>; // For select, radio, checkbox
  rows?: number; // For textarea
  format?: string; // For date fields

  // UI customization
  placeholder?: string; // Placeholder text
  helperText?: string; // Helper text below field
  variant?: "outlined" | "filled" | "standard"; // Input variant

  // Advanced features
  dependsOn?: string[]; // Fields this field depends on
  transform?: (value: any) => any; // Transform value before submit
}
```

### Performance Metrics Schema

```typescript
/**
 * Structure for form performance metrics
 */
interface FormPerformanceMetrics {
  renderTime: number; // Time to render the form in ms
  reRenderCount: number; // Number of re-renders
  validationTime: number; // Time spent in validation in ms
  submitTime: number; // Time to process submission in ms
  fieldUpdateCount: Record<string, number>; // Update count per field
}
```

## Common Usage Patterns

### 1. Basic Field Definition Pattern

```typescript
// Pattern for defining a standard text field
const textField = {
  id: "fieldName", // Unique ID, used as the key in form values
  type: "text", // Field type (text, select, date, etc.)
  label: "Display Label", // User-facing label
  required: true, // Whether the field is required
  gridSize: { xs: 12, md: 6 }, // Responsive grid sizing
  validation: {
    // Validation rules
    pattern: /^[a-z]+$/i, // Regex pattern
    custom: (value) => (value.length > 3 ? undefined : "Too short"),
  },
};
```

### 2. Conditional Field Rendering Pattern

```typescript
// Pattern for showing fields based on other field values
const conditionalField = {
  id: "conditionalField",
  type: "text",
  label: "This field appears conditionally",
  // Show this field only when 'triggerField' equals 'showMe'
  conditionalRender: (values) => values.triggerField === "showMe",
  // Can also use multiple conditions
  // conditionalRender: (values) =>
  //   values.triggerField === "showMe" && values.otherField > 10
};
```

### 3. Advanced Validation Pattern

```typescript
// Pattern for complex validation logic
const fieldWithValidation = {
  id: "email",
  type: "text",
  label: "Email",
  validation: {
    // Built-in pattern validation
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // Custom validation logic
    custom: async (value) => {
      // Can perform async operations
      const isValid = await checkEmailAvailability(value);
      return isValid ? undefined : "Email already taken";
    },
  },
};
```

### 4. Form Submission Pattern

```typescript
// Pattern for handling form submission
const handleSubmit = async (values) => {
  try {
    // Start performance monitoring
    const { startTimer, endTimer } = useFormPerformance();
    startTimer("submission");

    // Process form data
    const processedData = {
      ...values,
      timestamp: new Date().toISOString(),
    };

    // Submit data
    await api.submitForm(processedData);

    // End performance monitoring
    const metrics = endTimer("submission");
    console.log(`Submission took ${metrics.submitTime}ms`);

    // Success handling
    toast.success("Form submitted successfully");
  } catch (error) {
    // Error handling
    toast.error("Form submission failed");
    console.error(error);
  }
};
```
