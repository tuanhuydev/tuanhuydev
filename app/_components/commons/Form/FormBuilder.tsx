import DynamicForm, { DynamicFormConfig, ElementType } from "./DynamicForm";
import React, { useState } from "react";

const builderConfig: DynamicFormConfig = {
  fields: [
    {
      name: "fieldName",
      type: "text",
      options: {
        placeholder: "Input field",
      },
    },
    {
      name: "fieldType",
      type: "select",
      options: {
        placeholder: "Select Type",
        options: [
          { label: "text", value: "text" },
          { label: "number", value: "number" },
          { label: "select", value: "select" },
        ],
      },
    },
  ],
};

export default function FormBuilder() {
  const [fields, setFields] = useState<ElementType[]>([]);

  const addField = (newField: any) => {
    setFields((currentFields) => [...currentFields, newField]);
  };

  const submit = (formData: any) => {
    console.log(formData);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <DynamicForm config={builderConfig} onSubmit={addField as any} />
      </div>
      {fields.length && (
        <div className="flex-1">
          <DynamicForm config={{ fields }} onSubmit={submit as any} />
        </div>
      )}
    </div>
  );
}
