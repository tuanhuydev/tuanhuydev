// Core query keys for the application
export const QUERY_KEYS = {
  // UI State
  SHOW_MOBILE_HAMBURGER: "showMobileHamburger",

  // Data entities
  PROJECTS: "projects",
  TASKS: "tasks",
  USERS: "users",
  COMMENTS: "comments",
  POSTS: "posts",
  PERMISSIONS: "permissions",
  RESOURCES: "resources",
  SPRINTS: "sprints",
  STATUS: "status",

  // Special queries
  TODAY_TASKS: "todayTasks",
  CURRENT_USER: "currentUser",
} as const;

// Type for query keys
export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];

/**
 * Creates a stable query key that handles object filters correctly
 * This prevents unnecessary refetches due to object reference changes
 */
export const createStableQueryKey = (
  baseKey: (string | QueryKey)[],
  filter?: ObjectType,
): (string | QueryKey | ObjectType)[] => {
  if (!filter || Object.keys(filter).length === 0) {
    return baseKey;
  }

  // Sort filter keys to ensure consistent object structure
  const sortedFilter = Object.keys(filter)
    .sort()
    .reduce((acc, key) => {
      // Only include truthy values to prevent cache misses
      if (filter[key] !== undefined && filter[key] !== null && filter[key] !== "") {
        acc[key] = filter[key];
      }
      return acc;
    }, {} as ObjectType);

  // Return base key if no valid filter properties
  if (Object.keys(sortedFilter).length === 0) {
    return baseKey;
  }

  return [...baseKey, sortedFilter];
};

/**
 * Helper to create consistent mutation success handlers
 */
export const createInvalidationHandler = (queryClient: any, queryKeys: (string | QueryKey)[][]) => {
  return () => {
    queryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  };
};
