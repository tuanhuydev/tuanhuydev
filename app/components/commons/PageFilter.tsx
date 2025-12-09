"use client";

import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
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
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-slate-400" />
        <Input onChange={onSearch} value={value} placeholder={searchPlaceholder} className="pl-10" />
      </div>
      {allowCreate && (
        <Button onClick={onNew} className="flex-shrink-0">
          <PlusCircle className="w-4 h-4 mr-1" />
          {createLabel}
        </Button>
      )}
    </div>
  );
}
