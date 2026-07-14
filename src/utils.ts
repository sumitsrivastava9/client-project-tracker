/**
 * Today's date as YYYY-MM-DD in the user's local timezone. Built from
 * date parts on purpose: toISOString() converts to UTC, which can be
 * off by a day near midnight.
 */
export function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const HONORIFICS = new Set(['mr', 'mrs', 'ms', 'miss', 'dr', 'prof']);
const SUFFIXES = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v']);

/**
 * Derives up to two initials from a full name, skipping honorifics and
 * suffixes so "Mrs. Dennis Schulist" gives "DS", not "MS", and
 * "Nicholas Runolfsdottir V" gives "NR", not "NV".
 */
export function getInitials(fullName: string): string {
  const parts = fullName
    .split(/\s+/)
    .map((part) => part.replace(/\./g, ''))
    .filter((part) => part.length > 0)
    .filter((part) => !HONORIFICS.has(part.toLowerCase()))
    .filter((part) => !SUFFIXES.has(part.toLowerCase()));

  if (parts.length === 0) return '?';

  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}
