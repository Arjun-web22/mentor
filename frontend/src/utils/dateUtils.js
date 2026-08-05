/**
 * Date formatting utilities
 */

/**
 * Format a date value to YYYY-MM-DD format (safe for date-only values)
 * This avoids timezone shifts that can occur with toISOString()
 *
 * @param {string|Date|null|undefined} value - The date value to format
 * @returns {string} Formatted date as YYYY-MM-DD or "—" if invalid/empty
 */
export const formatDate = (value) => {
  if (!value) return "—";

  // String handling
  if (typeof value === "string") {
    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    // ISO string with timestamp
    if (value.includes("T")) return value.split("T")[0];

    // Invalid string format
    return "—";
  }

  // Date object
  if (value instanceof Date && !isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "—";
};

/**
 * Format a date value to localized date string
 *
 * @param {string|Date|null|undefined} value - The date value to format
 * @returns {string} Formatted date using locale or "—" if invalid/empty
 */
export const formatLocaleDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
};
