import { DATE_FORMAT } from "@lib/commons/constants/base";
import UnauthorizedError from "@lib/commons/errors/UnauthorizedError";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes with clsx, resolving conflicts via tailwind-merge.
 */
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

export const transformTextToDashed = (text: string): string => {
  // clear space
  let dashedText = text.toLowerCase().trim();

  // Remove all special characters
  dashedText = dashedText.replace(/[^\w\s]/g, "-");

  // Replace space to dash(-)
  dashedText = dashedText.replace(/\s+/g, "-");
  return dashedText;
};

export const toCapitalize = (str: string): string => {
  const [firstChar, ...restChar] = str;
  return firstChar.toUpperCase().concat(restChar.join(""));
};

export const makeRandomTextByLength = (length: number) => {
  let randomText = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomText += characters.charAt(randomIndex);
  }

  return randomText;
};

export const makeSlug = (text: string) => {
  const hashedLength = 6;
  return text.concat(`-${makeRandomTextByLength(hashedLength)}`);
};

export const isURLValid = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://");
};

export const extractTokenFromRequest = (bearerString: string) => {
  const bearerPrefixLength = 7;

  if (!bearerString || !bearerString.startsWith("Bearer ")) throw new UnauthorizedError("Token missing");

  const token = bearerString.substring(bearerPrefixLength);
  return token;
};

export const isPathActive = (pathName: string, path: string): boolean => {
  if (!pathName || !path) return false;
  return pathName.startsWith(path);
};

/**
 * Estimates reading time for a content string.
 * Assumes an average reading speed of 200 words per minute.
 */
export const readingTime = (content: string): string => {
  const words = content.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
};

export const hasPermission = (permissions: Array<Record<string, unknown>>, criteria: Record<string, unknown>) =>
  permissions.some((permission) =>
    Object.keys(criteria).every((key) => {
      return permission[key] === criteria[key];
    }),
  );

export const formatDateString = (date: string | Date | null | undefined): string => {
  if (date === null || date === undefined) {
    return "-";
  }
  const dateInstance = typeof date === "string" ? new Date(date) : date;
  return format(dateInstance, DATE_FORMAT);
};
