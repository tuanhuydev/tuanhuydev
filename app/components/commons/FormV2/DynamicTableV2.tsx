"use client";

import BaseButton from "../buttons/BaseButton";
import BaseInputV2 from "./BaseInputV2";
import BaseSelectV2 from "./BaseSelectV2";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlined from "@mui/icons-material/RemoveCircleOutlineOutlined";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { memo, useCallback, useEffect, useState } from "react";
import { useController } from "react-hook-form";

export interface DynamicTableColumnProps {
  config: GridColDef;
  options: SelectOptionType[];
}

export interface DynamicTableV2Props {
  control: any;
  name: string;
  keyProp: string;
  options?: {
    columns: DynamicTableColumnProps[];
  };
}

interface SelectOptionType {
  label: string;
  value: string | number;
}

const DynamicTableV2 = memo(function DynamicTableV2({ control, name, options }: DynamicTableV2Props) {
  const { columns } = options || { columns: [] };

  const { field, formState, fieldState } = useController({ name, control });
  const { onChange } = field;
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;

  // State
  const [fieldData, setFieldData] = useState<any>([]);
  const [gridColumns, setGridColumns] = useState<GridColDef[]>([]);

  // Generate unique ID helper
  const generateUniqueId = useCallback(() => {
    return `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Fallback row ID getter for extra safety
  const getRowId = useCallback(
    (row: any) => {
      if (row.id) return row.id;
      // Emergency fallback - should not happen with proper ID generation
      console.warn("Row missing ID in DynamicTableV2, generating emergency ID:", row);
      return generateUniqueId();
    },
    [generateUniqueId],
  );

  const CustomHeader = useCallback(
    ({ colDef }: GridColumnHeaderParams) => {
      const { headerName, field } = colDef;

      const addRow = () => {
        let newRow = { id: generateUniqueId() };
        columns.forEach((column) => {
          const fieldName = column.config.field;
          newRow = { ...newRow, [fieldName]: "" };
        });
        const newData = [...fieldData, newRow];
        setFieldData(newData);
        onChange(newData);
      };

      return (
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold text-sm">{headerName}</span>
          {field === columns[0]?.config?.field && (
            <BaseButton
              variants="text"
              disabled={isSubmitting}
              onClick={addRow}
              icon={<AddCircleOutlineOutlined fontSize="small" />}
            />
          )}
        </div>
      );
    },
    [columns, fieldData, isSubmitting, onChange, generateUniqueId],
  );

  const EditSelectCell = useCallback((props: GridRenderEditCellParams, selectOptions: SelectOptionType[]) => {
    const { id, value, field, api } = props;

    const handleChange = (newValue: any) => {
      api.setEditCellValue({ id, field, value: newValue });
    };

    return (
      <BaseSelectV2
        value={value}
        onChange={handleChange}
        keyProp={`${id}-${field}`}
        options={{
          options: selectOptions,
          placeholder: "Select...",
        }}
        className="w-full"
      />
    );
  }, []);

  const EditInputCell = useCallback((props: GridRenderEditCellParams) => {
    const { id, value, field, api } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      api.setEditCellValue({ id, field, value: newValue });
    };

    return <BaseInputV2 value={value || ""} onChange={handleChange} placeholder="Enter value" className="w-full" />;
  }, []);

  const RenderSelectCell = useCallback((params: GridRenderCellParams, selectOptions: SelectOptionType[]) => {
    const option = selectOptions.find((opt) => opt.value === params.value);
    return <span>{option?.label || params.value}</span>;
  }, []);

  const makeColumns = useCallback(() => {
    const newColumns: GridColDef[] = columns.map((column) => {
      const { config, options } = column;
      const hasOptions = options && options.length > 0;

      return {
        ...config,
        renderHeader: CustomHeader,
        renderCell: hasOptions ? (params) => RenderSelectCell(params, options) : undefined,
        renderEditCell: hasOptions ? (params) => EditSelectCell(params, options) : EditInputCell,
        editable: true,
      };
    });

    // Add action column
    newColumns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          key="delete"
          icon={<RemoveCircleOutlineOutlined />}
          label="Delete"
          onClick={() => {
            const newData = fieldData.filter((row: any) => row.id !== params.id);
            setFieldData(newData);
            onChange(newData);
          }}
          color="inherit"
        />,
      ],
    });

    return newColumns;
  }, [columns, CustomHeader, EditInputCell, EditSelectCell, RenderSelectCell, fieldData, onChange]);

  useEffect(() => {
    setGridColumns(makeColumns());
  }, [makeColumns]);

  useEffect(() => {
    if (field.value && Array.isArray(field.value) && fieldData.length === 0) {
      const dataWithIds = field.value.map((row: any) => {
        // Check if row already has a valid ID
        const hasValidId = row.id && typeof row.id === "string" && row.id.trim() !== "";

        return {
          ...row,
          id: hasValidId ? row.id : generateUniqueId(),
        };
      });
      setFieldData(dataWithIds);
    }
  }, [field.value, fieldData.length, generateUniqueId]);

  const processRowUpdate = useCallback(
    (newRow: any) => {
      setFieldData((prev: any[]) => {
        const updatedData = prev.map((row: any) => (row.id === newRow.id ? newRow : row));
        onChange(updatedData);
        return updatedData;
      });
      return newRow;
    },
    [onChange],
  );

  return (
    <div className="p-2 self-stretch w-full">
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={fieldData}
          columns={gridColumns}
          getRowId={getRowId}
          processRowUpdate={processRowUpdate}
          hideFooter
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-root": {
              border: "1px solid rgb(203, 213, 225)",
              borderRadius: "0.375rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.875rem",
              borderColor: "rgb(229, 231, 235)",
            },
            "& .MuiDataGrid-columnHeader": {
              fontSize: "0.875rem",
              fontWeight: 600,
              backgroundColor: "rgb(249, 250, 251)",
              borderColor: "rgb(229, 231, 235)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgb(249, 250, 251)",
            },
          }}
        />
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize mt-1">{error?.message}</div>}
    </div>
  );
});

export default DynamicTableV2;
