"use server";

import BaseError from "@lib/commons/errors/BaseError";
import { revalidatePath } from "next/cache";

/**
 * Generic server action for data mutation
 * Centralizes revalidation logic and error handling
 */
export async function mutateData<T>(
  actionFn: () => Promise<T>,
  path?: string,
  errorMessage: string = "Failed to update data",
) {
  try {
    const result = await actionFn();

    // Revalidate the specified path if provided
    if (path) {
      revalidatePath(path);
    }

    return { data: result, error: null };
  } catch (error) {
    console.error(`Error in mutateData:`, error);
    const message = error instanceof BaseError ? error.message : errorMessage;
    return { data: null, error: message };
  }
}
