export interface UrlParams {
  search?: string;
}

export type ApiResponse<T> = { success: boolean; data?: T; error?: string };
