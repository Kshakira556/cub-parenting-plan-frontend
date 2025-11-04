// src/utils/dateFormatter.ts

export const formatDate = (dateStr: string, options?: Intl.DateTimeFormatOptions): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return ""; // invalid date fallback

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleString(undefined, { ...defaultOptions, ...options });
};

// Example usage:
// formatDate("2025-11-04T17:44:04.518Z") -> "Nov 04, 2025, 17:44"
// formatDate("2025-11-04", { year: 'numeric', month: 'long', day: 'numeric' }) -> "November 04, 2025"
