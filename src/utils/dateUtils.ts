import {
  format,
  formatDistanceToNow,
  isPast,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";

/**
 * Utility functions for date formatting and manipulation
 */

export function formatDate(date: Date): string {
  return format(date, "EEEE, MMMM do, yyyy");
}

export function formatDateTime(date: Date): string {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, "h:mm a")}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  }

  return format(date, "MMM do, h:mm a");
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isOverdue(date: Date): boolean {
  return isPast(date);
}

export function getDateStatus(date: Date): "overdue" | "today" | "upcoming" {
  if (isOverdue(date)) return "overdue";
  if (isToday(date)) return "today";
  return "upcoming";
}
