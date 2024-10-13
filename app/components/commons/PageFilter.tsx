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
  allowCreate?: boolean;
}

export default function PageFilter({
  onSearch,
  onNew,
  createLabel = "Create",
  searchPlaceholder = "Search",
  allowCreate = false,
}: PageFilterProps) {
  return (
    <div className="flex gap-2 items-center mb-6">
      <BaseInput
        onChange={onSearch}
        placeholder={searchPlaceholder}
        className="grow mr-2 rounded-sm"
        startAdornment={<SearchOutlined fontSize="small" className=" dark:fill-slate-50" />}
      />
      {allowCreate && (
        <BaseButton label={createLabel} icon={<ControlPointOutlined fontSize="small" />} onClick={onNew} />
      )}
    </div>
  );
}
