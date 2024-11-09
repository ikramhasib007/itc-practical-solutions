import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Local (BST) date format DD/MM/YYYY
 */
export const dateFormat = "DD/MM/YYYY";
/**
 * Format's MMM DD, YYYY HH:mm:ss A
 */
export const dateTimeFormat = "MMM DD, YYYY HH:mm:ss A";
