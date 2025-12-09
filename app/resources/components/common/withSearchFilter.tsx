"use client";

import PageFilter from "@resources/components/common/PageFilter";
import { useDebounce } from "@resources/hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState, useEffect } from "react";

interface FilterConfig {
  basePath: string;
  searchPlaceholder: string;
  createLabel: string;
  createPath: string;
  allowCreate?: boolean;
}

interface WithSearchFilterProps {
  searchPlaceholder?: string;
  createLabel?: string;
  allowCreate?: boolean;
}

export function withSearchFilter(config: FilterConfig) {
  return function SearchFilterComponent({
    searchPlaceholder = config.searchPlaceholder,
    createLabel = config.createLabel,
    allowCreate = config.allowCreate ?? true,
  }: WithSearchFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState("");

    // Sync with URL params on mount and when searchParams change
    useEffect(() => {
      const currentSearch = searchParams.get("search") || "";
      setSearchValue(currentSearch);
    }, [searchParams]);

    const handleSearch = (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      router.push(`${config.basePath}?${params.toString()}`);
    };

    const debouncedSearch = useDebounce(handleSearch, 500);

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setSearchValue(newValue); // Update immediately for responsive UI
      debouncedSearch(newValue); // Debounce the URL update
    };

    const navigateCreate = () => {
      router.push(config.createPath);
    };

    return (
      <PageFilter
        onSearch={onSearch}
        onNew={navigateCreate}
        searchPlaceholder={searchPlaceholder}
        createLabel={createLabel}
        allowCreate={allowCreate}
        value={searchValue}
      />
    );
  };
}
