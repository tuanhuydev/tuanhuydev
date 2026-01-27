import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const makeFieldMap = (fields: Array<Record<string, unknown>>) => {
  const fieldMap = new Map();
  fields.forEach(({ name, ...restFields }) => {
    if (typeof name === "string" || Array.isArray(name)) {
      fieldMap.set(Array.isArray(name) ? name[0] : name, restFields);
    }
  });
  return fieldMap;
};

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};
