"use client";

import styles from "./PageFilter.module.css";
import { Button } from "@resources/components/common/Button";
import { Input } from "@resources/components/common/Input";
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
    <div className={styles.row}>
      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} />
        <Input onChange={onSearch} value={value} placeholder={searchPlaceholder} className={styles.searchInput} />
      </div>
      {allowCreate && (
        <Button onClick={onNew} className={styles.createButton}>
          <PlusCircle className={styles.createIcon} />
          {createLabel}
        </Button>
      )}
    </div>
  );
}
