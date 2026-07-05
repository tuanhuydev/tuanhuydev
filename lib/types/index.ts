/**
 * Shared type barrel.
 * Import shared primitive/utility types from here instead of scattered lib files.
 */

// Primitive aliases
export type ISODateString = string;

// API types
export type { ApiResponse, UrlParams } from "../interfaces/shared";

// User type
export type { User } from "./user";
