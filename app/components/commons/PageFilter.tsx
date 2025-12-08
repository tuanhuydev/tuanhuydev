"use client";

import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import ControlPointOutlined from "@mui/icons-material/ControlPointOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
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
      <div className="relative grow">
        <SearchOutlined
          fontSize="small"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400"
        />
        <Input onChange={onSearch} value={value} placeholder={searchPlaceholder} className="pl-10" />
      </div>
      {allowCreate && (
        <Button onClick={onNew} className="flex-shrink-0">
          <ControlPointOutlined fontSize="small" className="mr-1" />
          {createLabel}
        </Button>
      )}
    </div>
  );
}
