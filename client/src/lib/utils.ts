import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatImpact(impact: any): string {
  if (!impact) return "";
  if (typeof impact === "string") return impact;
  if (typeof impact === "object" && impact !== null) {
    const value = impact.value || "";
    const label = impact.label || "";
    return `${value} ${label}`.trim();
  }
  return String(impact);
}
