import { useDebounce } from "@resources/hooks/useDebounce";
import { ChangeEvent, useCallback, useState } from "react";

interface UseTaskFilterOptions<T extends FilterType = FilterType> {
  initialFilter?: T;
  onFilterChange?: (filter: T) => void;
  debounceDelay?: number;
}

interface UseTaskFilterReturn<T extends FilterType = FilterType> {
  filter: T;
  searchValue: string;
  setFilter: (filter: T | ((prev: T) => T)) => void;
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (newFilter: Partial<T>) => void;
  clearSearch: () => void;
}

export function useTaskFilter<T extends FilterType = FilterType>({
  initialFilter = {} as T,
  onFilterChange,
  debounceDelay = 500,
}: UseTaskFilterOptions<T> = {}): UseTaskFilterReturn<T> {
  const [filter, setFilter] = useState<T>(initialFilter);
  const [searchValue, setSearchValue] = useState("");

  const updateSearchFilter = useCallback(
    (search: string) => {
      setFilter((prevFilter) => {
        const newFilter = search?.length
          ? ({ ...prevFilter, search } as T)
          : (Object.fromEntries(Object.entries(prevFilter).filter(([key]) => key !== "search")) as T);

        onFilterChange?.(newFilter);
        return newFilter;
      });
    },
    [onFilterChange],
  );

  const debouncedSearchUpdate = useDebounce(updateSearchFilter, debounceDelay);

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      setSearchValue(search);
      debouncedSearchUpdate(search);
    },
    [debouncedSearchUpdate],
  );

  const handleFilterChange = useCallback(
    (newFilter: Partial<T>) => {
      const updatedFilter = { ...filter, ...newFilter } as T;
      setFilter(updatedFilter);
      onFilterChange?.(updatedFilter);
    },
    [filter, onFilterChange],
  );

  const clearSearch = useCallback(() => {
    setSearchValue("");
    const { ...rest } = filter;
    const newFilter = rest;
    setFilter(newFilter);
    onFilterChange?.(newFilter);
  }, [filter, onFilterChange]);

  return {
    filter,
    searchValue,
    setFilter,
    handleSearch,
    handleFilterChange,
    clearSearch,
  };
}
