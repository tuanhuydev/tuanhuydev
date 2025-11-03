"use client";

import DynamicFormV2 from "./DynamicFormV2";
import type { DynamicFormV2Props, Field, FieldGroup } from "./DynamicFormV2";
import { Box, Card, CardContent, Tabs, Tab, Typography, Divider, Chip } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";

// Complex form with advanced features
const AdvancedFormExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [formRef, setFormRef] = useState<UseFormReturn | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  const formValuesRef = useRef<any>({});
  const [initialValues] = useState({
    projectType: "website",
    includeHosting: "true",
    startDate: new Date(),
    budget: 5000,
    teamMembers: [
      { id: "1", name: "John Doe", role: "developer", hours: "40" },
      { id: "2", name: "Jane Smith", role: "designer", hours: "30" },
    ],
  });

  // Set up subscription to form values to avoid infinite renders
  useEffect(() => {
    if (formRef) {
      const subscription = formRef.watch((values) => {
        // Store in ref to avoid re-renders during field initialization
        formValuesRef.current = values;
        // Only update state when needed for UI
        setFormValues(values);
      });

      return () => subscription.unsubscribe();
    }
  }, [formRef]);

  // Project Details Fields - using ref for conditions to avoid re-renders
  const projectFields: Field[] = [
    {
      name: "projectName",
      type: "text",
      label: "Project Name",
      validate: { required: true, min: 5, max: 100 },
      options: {
        placeholder: "Enter project name",
        className: "w-full",
      },
      className: "w-full",
    },
    {
      name: "projectCode",
      type: "text",
      label: "Project Code",
      validate: { required: true, min: 3, max: 10 },
      options: {
        placeholder: "e.g. PRJ-001",
        className: "w-full",
      },
      className: "w-full",
    },
    {
      name: "projectType",
      type: "select",
      label: "Project Type",
      validate: { required: true },
      options: {
        options: [
          { value: "website", label: "Website Development" },
          { value: "mobileApp", label: "Mobile Application" },
          { value: "desktop", label: "Desktop Software" },
          { value: "api", label: "API Development" },
          { value: "infrastructure", label: "Infrastructure Setup" },
        ],
        mode: "single",
        placeholder: "Select project type",
      },
      className: "w-full",
    },
    {
      name: "includeHosting",
      type: "select",
      label: "Include Hosting",
      options: {
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
        placeholder: "Select option",
      },
      className: "w-full",
    },
    {
      name: "hostingProvider",
      type: "select",
      label: "Hosting Provider",
      options: {
        options: [
          { value: "aws", label: "Amazon Web Services" },
          { value: "azure", label: "Microsoft Azure" },
          { value: "gcp", label: "Google Cloud Platform" },
          { value: "digitalocean", label: "DigitalOcean" },
          { value: "other", label: "Other" },
        ],
        placeholder: "Select provider",
        // Use ref for stable conditional check
        disabled: formValuesRef.current?.includeHosting === "false",
      },
      className: "w-full",
    },
    {
      name: "otherHostingProvider",
      type: "text",
      label: "Other Provider Name",
      options: {
        placeholder: "Enter provider name",
        // Use ref for stable conditional checks
        disabled:
          formValuesRef.current?.hostingProvider !== "other" || formValuesRef.current?.includeHosting === "false",
      },
      className: "w-full",
    },
    {
      name: "startDate",
      type: "datepicker",
      label: "Start Date",
      validate: { required: true },
      className: "w-full",
    },
    {
      name: "endDate",
      type: "datepicker",
      label: "End Date",
      validate: {
        required: true,
        min: "startDate", // This references the startDate field for validation
      },
      className: "w-full",
    },
    {
      name: "budget",
      type: "number",
      label: "Budget (USD)",
      validate: {
        required: true,
        min: 1000,
      },
      options: {
        placeholder: "Enter budget amount",
      },
      className: "w-full",
    },
    {
      name: "projectDescription",
      type: "textarea",
      label: "Project Description",
      validate: { required: true, min: 50, max: 500 },
      options: {
        rows: 4,
        placeholder: "Provide a detailed description of the project...",
      },
      className: "w-full",
    },
  ];

  // Team Members section with a table field
  const teamFields: Field[] = [
    {
      name: "projectManager",
      type: "text",
      label: "Project Manager",
      validate: { required: true },
      options: { placeholder: "Enter project manager's name" },
      className: "w-full",
    },
    {
      name: "clientContact",
      type: "text",
      label: "Client Contact",
      validate: { required: true },
      options: { placeholder: "Enter client contact name" },
      className: "w-full",
    },
    {
      name: "teamMembers",
      type: "table",
      label: "Team Members",
      validate: { required: true, min: 1 },
      options: {
        columns: [
          {
            config: {
              field: "name",
              headerName: "Team Member Name",
              width: 200,
            },
            options: [],
          },
          {
            config: {
              field: "role",
              headerName: "Role",
              width: 150,
            },
            options: [
              { value: "developer", label: "Developer" },
              { value: "designer", label: "Designer" },
              { value: "qa", label: "QA Engineer" },
              { value: "devops", label: "DevOps" },
              { value: "manager", label: "Manager" },
            ],
          },
          {
            config: {
              field: "hours",
              headerName: "Hours/Week",
              width: 120,
            },
            options: [],
          },
        ],
      },
      className: "w-full",
    },
  ];

  // Technical Requirements with markdown editor
  const requirementsFields: Field[] = [
    {
      name: "requirementsDoc",
      type: "richeditor",
      label: "Technical Requirements",
      validate: { required: true },
      options: {
        placeholder: "Enter detailed technical requirements...",
        rows: 8,
      },
      className: "w-full",
    },
    {
      name: "technologyStack",
      type: "select",
      label: "Technology Stack",
      validate: { required: true },
      options: {
        mode: "multiple",
        options: [
          { value: "react", label: "React" },
          { value: "angular", label: "Angular" },
          { value: "vue", label: "Vue.js" },
          { value: "node", label: "Node.js" },
          { value: "python", label: "Python" },
          { value: "java", label: "Java" },
          { value: "dotnet", label: ".NET" },
          { value: "php", label: "PHP" },
          { value: "go", label: "Go" },
          { value: "ruby", label: "Ruby" },
          { value: "aws", label: "AWS" },
          { value: "azure", label: "Azure" },
          { value: "gcp", label: "Google Cloud" },
          { value: "mongodb", label: "MongoDB" },
          { value: "mysql", label: "MySQL" },
          { value: "postgres", label: "PostgreSQL" },
          { value: "redis", label: "Redis" },
          { value: "docker", label: "Docker" },
          { value: "kubernetes", label: "Kubernetes" },
        ],
        placeholder: "Select technologies",
      },
      className: "w-full",
    },
    {
      name: "apiIntegrations",
      type: "table",
      label: "API Integrations",
      options: {
        columns: [
          {
            config: {
              field: "name",
              headerName: "API Name",
              width: 200,
            },
            options: [],
          },
          {
            config: {
              field: "endpoint",
              headerName: "Endpoint",
              width: 250,
            },
            options: [],
          },
          {
            config: {
              field: "authType",
              headerName: "Auth Type",
              width: 150,
            },
            options: [
              { value: "none", label: "None" },
              { value: "basic", label: "Basic Auth" },
              { value: "oauth2", label: "OAuth 2.0" },
              { value: "apiKey", label: "API Key" },
              { value: "jwt", label: "JWT" },
            ],
          },
        ],
      },
      className: "w-full",
    },
  ];

  const fieldGroups: FieldGroup[] = [
    {
      name: "Project Details",
      fields: projectFields,
    },
    {
      name: "Team Composition",
      fields: teamFields,
    },
    {
      name: "Technical Requirements",
      fields: requirementsFields,
    },
  ];

  const handleSubmit = async (data: any, form?: UseFormReturn) => {
    console.log("Complex form submitted with data:", data);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message
      alert("Project successfully created!");

      // Optional: Reset form or redirect
      // form?.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating project. Please try again.");
    }
  };

  // Handle form updates without causing infinite loops
  const handleFormChange = (form: UseFormReturn) => {
    if (!formRef) {
      // Only set form ref once to avoid re-renders
      setFormRef(form);

      // Initialize ref with current values
      formValuesRef.current = form.getValues();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card elevation={2} sx={{ overflow: "visible" }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f8fafc" }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 2,
                "& .MuiTab-root": {
                  fontSize: "0.875rem",
                  py: 2,
                },
              }}>
              <Tab label="Project Information" />
              <Tab label="Preview" disabled={!formRef} />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box sx={{ p: 3, width: "100%" }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                New Project Setup
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Complete the form below to set up a new project. All fields marked with * are required.
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <DynamicFormV2
                  config={{
                    fields: fieldGroups,
                    setForm: handleFormChange,
                    submitProps: {
                      variant: "outlined",
                      color: "primary",
                    },
                  }}
                  mapValues={initialValues}
                  onSubmit={handleSubmit}
                />
              </Box>
            </Box>
          )}

          {activeTab === 1 && formRef && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Project Summary
              </Typography>

              <Box
                sx={{
                  bgcolor: "#f1f5f9",
                  p: 3,
                  borderRadius: 1,
                  mb: 3,
                  border: "1px solid #e2e8f0",
                }}>
                {formRef && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Project Name
                      </Typography>
                      <Typography variant="body1">{formRef.getValues().projectName || "Not specified"}</Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Project Code
                      </Typography>
                      <Typography variant="body1">{formRef.getValues().projectCode || "Not specified"}</Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Type
                      </Typography>
                      <Typography variant="body1">
                        {formRef.getValues().projectType === "website" && "Website Development"}
                        {formRef.getValues().projectType === "mobileApp" && "Mobile Application"}
                        {formRef.getValues().projectType === "desktop" && "Desktop Software"}
                        {formRef.getValues().projectType === "api" && "API Development"}
                        {formRef.getValues().projectType === "infrastructure" && "Infrastructure Setup"}
                        {!formRef.getValues().projectType && "Not specified"}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Budget
                      </Typography>
                      <Typography variant="body1">
                        {formRef.getValues().budget
                          ? `$${formRef.getValues().budget.toLocaleString()}`
                          : "Not specified"}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Timeline
                      </Typography>
                      <Typography variant="body1">
                        {formRef.getValues().startDate && formRef.getValues().endDate
                          ? `${new Date(formRef.getValues().startDate).toLocaleDateString()} to ${new Date(
                              formRef.getValues().endDate,
                            ).toLocaleDateString()}`
                          : "Not specified"}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Team Size
                      </Typography>
                      <Typography variant="body1">
                        {formRef.getValues().teamMembers
                          ? `${formRef.getValues().teamMembers.length} members`
                          : "Not specified"}
                      </Typography>
                    </div>
                  </div>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Technology Stack
              </Typography>
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                }}>
                {formRef.getValues().technologyStack &&
                  formRef.getValues().technologyStack.map((tech: string) => (
                    <Chip
                      key={tech}
                      label={tech}
                      size="small"
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 500,
                      }}
                    />
                  ))}
                {!formRef.getValues().technologyStack && (
                  <Typography variant="body2" color="text.secondary">
                    No technologies selected
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                }}>
                <button
                  type="button"
                  className="mr-3 px-6 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
                  onClick={() => setActiveTab(0)}>
                  Edit Project
                </button>
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-medium rounded-md bg-primary text-white shadow-sm hover:bg-primary/90">
                  Submit Project
                </button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedFormExample;
