// Auth hooks
export { useFetch } from "./hooks/useFetch";
export { useAuth } from "./hooks/useAuth";

// Auth services
export { default as AuthApiService } from "./services/AuthApiService";

// Auth types
export type { User, Permission, Session, AuthState, SignInCredentials, SignInResponse, PermissionCheck } from "./types";

export { UserPermissions } from "./types";

// Re-export for backward compatibility (temporary during migration)
export { useFetch as useSession } from "./hooks/useFetch";
