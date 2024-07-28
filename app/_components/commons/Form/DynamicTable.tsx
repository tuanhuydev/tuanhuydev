"use client";

import BaseButton from "../buttons/BaseButton";
import { SelectOptionType } from "@lib/configs/types";
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
import { Input, Select, Tooltip } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useController } from "react-hook-form";

export interface DynamicTableColumnProps {
  config: GridColDef;
  options: SelectOptionType[];
}

export interface DynamicTableProps {
  control: any;
  name: string;
  keyProp: string;
  options?: {
    columns: DynamicTableColumnProps[];
  };
}

const DynamicTable = ({ control, name, keyProp, options }: DynamicTableProps) => {
  const { columns } = options || { columns: [] };

  const { field, formState, fieldState } = useController({ name, control });
  const { onChange } = field;
  const { isSubmitting } = formState;
  const { invalid, error, isTouched } = fieldState;

  // State
  const [fieldData, setFieldData] = useState<any>([]);
  const [gridColumns, setGridColumns] = useState<GridColDef[]>([]);

  const CustomHeader = useCallback(
    ({ colDef }: GridColumnHeaderParams) => {
      const { headerName, field } = colDef;

      const addRow = () => {
        let newRow = { id: Date.now().toString() };
        columns.forEach(({ config }: DynamicTableColumnProps) => {
          newRow = { ...newRow, [config.field]: "" };
        });
        setFieldData((prev: any) => [...prev, newRow]);
      };

      if (field === "id") {
        return (
          <BaseButton
            variants="text"
            onClick={addRow}
            label="Add row"
            className="text-slate-500 text-sm"
            icon={<AddCircleOutlineOutlined fontSize="small" />}
          />
        );
      }
      return <span className="text-slate-500 text-sm">{headerName}</span>;
    },
    [columns],
  );

  const updateCell = useCallback((params: GridRenderEditCellParams, value: any) => {
    params.api.setEditCellValue({
      id: params.id,
      field: params.field,
      value: value,
    });
    params.api.stopCellEditMode({ id: params.id, field: params.field });
  }, []);

  useEffect(() => {
    const fieldColumns: GridColDef[] = [...columns, { config: { field: "id", flex: 1 }, options: [] }].map(
      ({ config, options }: DynamicTableColumnProps) => {
        return {
          ...config,
          renderCell: (params: GridRenderCellParams<any, any>) => {
            if (params.field === "id") {
              const removeRow = (value: string) => () => {
                const newData = fieldData.filter((row: any) => row.id !== value);
                setFieldData(newData);
              };

              return (
                <div className="px-2 flex items-center justify-center w-full">
                  <GridActionsCellItem
                    icon={<RemoveCircleOutlineOutlined />}
                    label="Cancel"
                    className="text-primary"
                    onClick={removeRow(params.value)}
                    color="inherit"
                  />
                </div>
              );
            }
            if (!params.value || params.field === "id")
              return (
                <Tooltip placement="bottom" title={"Double click to edit"}>
                  <div className="px-2">-</div>
                </Tooltip>
              );
            return <div className="px-2">{params.value}</div>;
          },
          renderEditCell: (params: GridRenderEditCellParams) => {
            if (!options?.length) {
              return (
                <Input
                  onChange={(event) => {
                    event.preventDefault();
                    const value = event.target.value;
                    updateCell(params, value);
                  }}
                />
              );
            }
            return (
              <Select
                options={options}
                className="w-full h-full"
                value={params.value}
                placeholder="Double click to set value"
                onChange={(newValue) => {
                  updateCell(params, newValue);
                }}
              />
            );
          },
          renderHeader: CustomHeader,
        };
      },
    );
    setGridColumns(fieldColumns);
  }, [CustomHeader, columns, fieldData, updateCell]);

  useEffect(() => {
    const filteredFields = fieldData.map(({ id, isNew, ...restProps }: any) => restProps);
    onChange(filteredFields);
  }, [fieldData, onChange]);

  useEffect(() => {
    if (field.value && !fieldData.length) {
      const data = field.value.map((row: any, index: number) => ({
        ...row,
        id: `Date.now().toString()${index}`,
        isNew: false,
      }));
      setFieldData(data);
    }
  }, [field.value, fieldData]);

  const processRowUpdate = (newRow: ObjectType) => {
    const updatedRow = { ...newRow, isNew: false };
    const newData = fieldData.map((row: ObjectType) => (row.id === newRow.id ? updatedRow : row));
    setFieldData(newData);
    return updatedRow;
  };

  return (
    <div className="px-2 w-full">
      <DataGrid
        columns={gridColumns}
        rows={fieldData}
        sx={{
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell.Mui-selected": {
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "#f1f5f9",
            "&:hover": {
              backgroundColor: "#f8fafc",
            },
          },
        }}
        columnHeaderHeight={42}
        rowHeight={36}
        hideFooterPagination
        autoHeight
        hideFooter
        disableColumnMenu
        disableColumnFilter
        disableColumnResize
        disableColumnSorting
        editMode="cell"
        processRowUpdate={processRowUpdate}
        disableRowSelectionOnClick={isSubmitting}
      />
      {invalid && isTouched && <div className="text-xs font-light text-red-500 capitalize">{error?.message}</div>}
    </div>
  );
};

export default DynamicTable;
