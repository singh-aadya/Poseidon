import { Coordinates } from '../types';

/**
 * Format decimal coordinates into clean navigation format
 * e.g. 28.142° N, 89.654° W
 */
export function formatCoordinates(coord: Coordinates, decimals: number = 3): string {
  const latDir = coord.lat >= 0 ? 'N' : 'S';
  const lngDir = coord.lng >= 0 ? 'E' : 'W';
  const absLat = Math.abs(coord.lat).toFixed(decimals);
  const absLng = Math.abs(coord.lng).toFixed(decimals);
  return `${absLat}° ${latDir}, ${absLng}° ${lngDir}`;
}

/**
 * Format timestamp into standard UTC maritime format
 * e.g. "26 Sep 14:22 UTC"
 */
export function formatUtcDateTime(dateStrOrDate: string | Date): string {
  const date = typeof dateStrOrDate === 'string' ? new Date(dateStrOrDate) : dateStrOrDate;
  if (isNaN(date.getTime())) return 'UNKNOWN UTC';

  const day = date.getUTCDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getUTCMonth()];
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${day} ${month} ${hours}:${minutes} UTC`;
}

/**
 * Format time only in UTC
 * e.g. "14:22 UTC"
 */
export function formatUtcTime(dateStrOrDate: string | Date): string {
  const date = typeof dateStrOrDate === 'string' ? new Date(dateStrOrDate) : dateStrOrDate;
  if (isNaN(date.getTime())) return '--:-- UTC';

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes} UTC`;
}

/**
 * Format compass bearing with cardinal direction
 * e.g. 74° (ENE)
 */
export function formatBearingWithCardinal(deg: number): string {
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(((deg % 360) / 22.5)) % 16;
  return `${Math.round(deg).toString().padStart(3, '0')}° (${cardinals[idx]})`;
}

/**
 * Format area in km2
 */
export function formatAreaKm2(km2: number): string {
  return `${km2.toFixed(1)} km²`;
}

/**
 * Format knots
 */
export function formatKnots(knots: number): string {
  return `${knots.toFixed(1)} kn`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  // If value is 0.0 - 1.0, scale up; if already 0 - 100, keep as is
  const pct = value <= 1.0 ? value * 100 : value;
  return `${Math.round(pct)}%`;
}
