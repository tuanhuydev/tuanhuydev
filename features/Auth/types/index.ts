export interface User {
  id: string;
  email: string;
  name?: string;
  permissionId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Permission {
  id: string;
  name: string;
  rules: string[];
  description?: string;
}

export interface Session {
  user: User;
  permissions: string[];
  accessToken: string;
  expiresAt?: string;
}

export interface AuthState {
  currentUser: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInResponse {
  accessToken: string;
  user?: User;
}

// Permission constants (you can expand these based on your app)
export enum UserPermissions {
  VIEW_USER = "VIEW_USER",
  CREATE_USER = "CREATE_USER",
  EDIT_USER = "EDIT_USER",
  DELETE_USER = "DELETE_USER",

  VIEW_PROJECT = "VIEW_PROJECT",
  CREATE_PROJECT = "CREATE_PROJECT",
  EDIT_PROJECT = "EDIT_PROJECT",
  DELETE_PROJECT = "DELETE_PROJECT",

  VIEW_POST = "VIEW_POST",
  CREATE_POST = "CREATE_POST",
  EDIT_POST = "EDIT_POST",
  DELETE_POST = "DELETE_POST",

  VIEW_TASK = "VIEW_TASK",
  CREATE_TASK = "CREATE_TASK",
  EDIT_TASK = "EDIT_TASK",
  DELETE_TASK = "DELETE_TASK",

  VIEW_SETTING = "VIEW_SETTING",
  EDIT_SETTING = "EDIT_SETTING",
}

export type PermissionCheck = {
  hasPermission: (permission: string | UserPermissions) => boolean;
  hasAllPermissions: (permissions: (string | UserPermissions)[]) => boolean;
  hasAnyPermission: (permissions: (string | UserPermissions)[]) => boolean;
};
