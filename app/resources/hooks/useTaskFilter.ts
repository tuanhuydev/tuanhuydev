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

/**
 * Shared hook for managing task filter state with debounced search
 * Eliminates code duplication across task pages
 */
export function useTaskFilter<T extends FilterType = FilterType>({
  initialFilter = {} as T,
  onFilterChange,
  debounceDelay = 500,
}: UseTaskFilterOptions<T> = {}): UseTaskFilterReturn<T> {
  const [filter, setFilter] = useState<T>(initialFilter);
  const [searchValue, setSearchValue] = useState("");

  // Debounced search handler that updates the filter
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

  // Handle search input with immediate UI update and debounced filter update
  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      setSearchValue(search); // Update UI immediately
      debouncedSearchUpdate(search); // Debounce the filter update
    },
    [debouncedSearchUpdate],
  );

  // Handle filter changes (e.g., status, project selection)
  const handleFilterChange = useCallback(
    (newFilter: Partial<T>) => {
      const updatedFilter = { ...filter, ...newFilter } as T;
      setFilter(updatedFilter);
      onFilterChange?.(updatedFilter);
    },
    [filter, onFilterChange],
  );

  // Clear search value
  const clearSearch = useCallback(() => {
    setSearchValue("");
    const { search: _, ...rest } = filter as any;
    const newFilter = rest as T;
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
