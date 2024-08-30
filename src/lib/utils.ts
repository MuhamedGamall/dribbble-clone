import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatNumber(number: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });

  if (number >= 1e9) return formatter.format(number / 1e9) + "b";
  if (number >= 1e6) return formatter.format(number / 1e6) + "m";
  if (number >= 1e3) return formatter.format(number / 1e3) + "k";
  return formatter.format(number);
}