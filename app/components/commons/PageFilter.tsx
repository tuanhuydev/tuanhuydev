"use client";

import BaseInput from "./Inputs/BaseInput";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Button from "@mui/material/Button";
import { ChangeEvent } from "react";

export interface PageFilterProps {
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onNew: () => void;
  createLabel?: string;
  searchPlaceholder?: string;
  allowCreate?: boolean;
  value?: string;
}

export default function PageFilter({
  onSearch,
  onNew,
  createLabel = "Create",
  searchPlaceholder = "Search",
  allowCreate = false,
  value = "",
}: PageFilterProps) {
  return (
    <div className="flex gap-2 items-center mb-6">
      <BaseInput
        onChange={onSearch}
        value={value}
        placeholder={searchPlaceholder}
        className="grow rounded-sm m-2"
        startAdornment={<SearchOutlined fontSize="small" className=" dark:fill-slate-50" />}
      />
      {allowCreate && (
        <Button
          variant="contained"
          endIcon={<ControlPointOutlined fontSize="small" />}
          onClick={onNew}
          className="flex-shrink-0">
          {createLabel}
        </Button>
      )}
    </div>
  );
}
