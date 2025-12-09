"use client";

import Input from "./Fields/Input";
import Select from "./Fields/Select";
import { Button } from "@resources/components/common/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@resources/components/common/Table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MinusCircle, PlusCircle } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useController } from "react-hook-form";

export interface DynamicTableColumnProps {
  field: string;
  headerName: string;
  width?: number;
  editable?: boolean;
  type?: "text" | "select" | "number";
  options?: SelectOptionType[];
}

export interface DynamicTableProps {
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

const DynamicTable = memo(function DynamicTable({ control, name, options }: DynamicTableProps) {
  const { columns: columnConfigs = [] } = options || {};

  const { field, formState, fieldState } = useController({ name, control });
  const { onChange } = field;
  const { isSubmitting } = formState;
  const { invalid, error } = fieldState;

  const [fieldData, setFieldData] = useState<any[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);

  // Generate unique ID helper
  const generateUniqueId = useCallback(() => {
    return `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addRow = useCallback(() => {
    let newRow: any = { id: generateUniqueId() };
    columnConfigs.forEach((column) => {
      newRow[column.field] = "";
    });
    const newData = [...fieldData, newRow];
    setFieldData(newData);
    onChange(newData);
  }, [columnConfigs, fieldData, onChange, generateUniqueId]);

  const deleteRow = useCallback(
    (rowId: string) => {
      const newData = fieldData.filter((row: any) => row.id !== rowId);
      setFieldData(newData);
      onChange(newData);
    },
    [fieldData, onChange],
  );

  const updateCell = useCallback(
    (rowId: string, columnId: string, value: any) => {
      setFieldData((prev) => {
        const updatedData = prev.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row));
        onChange(updatedData);
        return updatedData;
      });
      setEditingCell(null);
    },
    [onChange],
  );

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const cols: ColumnDef<any>[] = columnConfigs.map((colConfig, index) => ({
      accessorKey: colConfig.field,
      id: colConfig.field,
      header: ({ table }) => (
        <div className="flex justify-between items-center w-full">
          <span className="font-semibold text-sm">{colConfig.headerName}</span>
          {index === 0 && (
            <Button variant="ghost" size="icon" disabled={isSubmitting} onClick={addRow}>
              <PlusCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
      cell: ({ row, column }) => {
        const cellValue = row.getValue(column.id);
        const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id;

        if (isEditing) {
          if (colConfig.options && colConfig.options.length > 0) {
            return (
              <Select
                value={cellValue}
                onChange={(newValue) => updateCell(row.id, column.id, newValue)}
                keyProp={`${row.id}-${column.id}`}
                options={{
                  options: colConfig.options,
                  placeholder: "Select...",
                }}
                className="w-full"
              />
            );
          }
          return (
            <Input
              value={String(cellValue || "")}
              onChange={(e) => updateCell(row.id, column.id, e.target.value)}
              placeholder="Enter value"
              className="w-full"
              autoFocus
              onBlur={() => setEditingCell(null)}
            />
          );
        }

        // Display mode
        if (colConfig.options && colConfig.options.length > 0) {
          const option = colConfig.options.find((opt) => opt.value === cellValue);
          return (
            <div
              className="cursor-pointer hover:bg-muted/50 p-2 rounded"
              onClick={() => setEditingCell({ rowId: row.id, columnId: column.id })}>
              {option?.label || String(cellValue || "")}
            </div>
          );
        }

        return (
          <div
            className="cursor-pointer hover:bg-muted/50 p-2 rounded"
            onClick={() => setEditingCell({ rowId: row.id, columnId: column.id })}>
            {String(cellValue || "")}
          </div>
        );
      },
      size: colConfig.width || 150,
    }));

    // Add actions column
    cols.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => deleteRow(row.id)}>
          <MinusCircle className="w-4 h-4" />
        </Button>
      ),
      size: 100,
    });

    return cols;
  }, [columnConfigs, isSubmitting, addRow, deleteRow, updateCell, editingCell]);

  useEffect(() => {
    if (field.value && Array.isArray(field.value) && fieldData.length === 0) {
      const dataWithIds = field.value.map((row: any) => {
        const hasValidId = row.id && typeof row.id === "string" && row.id.trim() !== "";
        return {
          ...row,
          id: hasValidId ? row.id : generateUniqueId(),
        };
      });
      setFieldData(dataWithIds);
    }
  }, [field.value, fieldData.length, generateUniqueId]);

  const table = useReactTable({
    data: fieldData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="p-2 self-stretch w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No data. Click + to add a row.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {invalid && <div className="text-xs font-light text-red-500 capitalize mt-1">{error?.message}</div>}
    </div>
  );
});

export default DynamicTable;
