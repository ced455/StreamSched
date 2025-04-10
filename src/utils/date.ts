import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Format a date relative to now (e.g., "in 2 hours", "3 days ago")
 */
export function formatRelative(date: string | Date): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) {
    return 'Invalid date';
  }
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

/**
 * Format a date in the user's timezone
 */
export function formatLocalDateTime(date: string | Date, pattern: string = 'PPp'): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) {
    return 'Invalid date';
  }
  return format(parsedDate, pattern);
}

/**
 * Format date in specific timezone
 */
export function formatInTimezone(date: string | Date, pattern: string, timezone: string = getLocalTimezone()): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsedDate)) {
    return 'Invalid date';
  }
  return formatInTimeZone(parsedDate, timezone, pattern) as string;
}

/**
 * Convert date to user's timezone string
 */
export function toLocalTimeString(date: string | Date, timezone: string = getLocalTimezone()): string {
  return formatInTimezone(date, 'yyyy-MM-dd\'T\'HH:mm:ssXXX', timezone);
}

/**
 * Check if a date is in the past
 */
export function isPast(date: string | Date): boolean {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return parsedDate < new Date();
}

/**
 * Format a duration in milliseconds to a human-readable string
 */
export function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  return `${minutes}m`;
}

/**
 * Get a list of supported timezones
 */
export function getSupportedTimezones(): string[] {
  // Return a list of common timezones
  return [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Australia/Sydney',
    'Pacific/Auckland'
  ];
}

/**
 * Get the user's local timezone
 */
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format a time range
 */
export function formatTimeRange(start: string | Date, end?: string | Date, pattern: string = 'p'): string {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  if (!isValid(startDate)) {
    return 'Invalid date';
  }

  if (!end) {
    return format(startDate, pattern);
  }

  const endDate = typeof end === 'string' ? parseISO(end) : end;
  if (!isValid(endDate)) {
    return format(startDate, pattern);
  }

  return `${format(startDate, pattern)} - ${format(endDate, pattern)}`;
}
