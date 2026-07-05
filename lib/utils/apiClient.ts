/**
 * Client-side API utilities.
 * Safe to use only in browser contexts ("use client" components).
 */

/**
 * Returns standard JSON headers with Bearer auth token from localStorage.
 * Falls back to Content-Type only when no token is found.
 */
export function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
