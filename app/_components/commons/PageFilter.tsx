"use client";

import BaseInput from "./Inputs/BaseInput";
import BaseButton from "./buttons/BaseButton";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { ChangeEvent } from "react";

export interface PageFilterProps {
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  onNew: () => void;
  createLabel?: string;
  searchPlaceholder?: string;
}

export default function PageFilter({
  onSearch,
  onNew,
  createLabel = "Create",
  searchPlaceholder = "Search",
}: PageFilterProps) {
  return (
    <div className="flex gap-2 items-center mb-6">
      <BaseInput
        onChange={onSearch}
        placeholder={searchPlaceholder}
        className="grow mr-2 rounded-sm"
        startAdornment={<SearchOutlined fontSize="small" />}
      />
      <BaseButton label={createLabel} icon={<ControlPointOutlined fontSize="small" />} onClick={onNew} />
    </div>
  );
}
