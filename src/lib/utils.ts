// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan beberapa class CSS menjadi satu string.
 * - Meng-handle class kondisional.
 * - Mengatasi konflik class Tailwind CSS secara otomatis.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}