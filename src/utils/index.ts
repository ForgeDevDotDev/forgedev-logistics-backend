// Utility functions

export function paginate<T>(items: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

export function formatError(message: string, code?: string) {
  return { error: message, code: code || 'UNKNOWN' };
}

// FIXME: This validation is too basic
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateTrackingCode(city: string): string {
  const num = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  const cityCode = city.substring(0, 3).toUpperCase();
  return `TRK-${num}-${cityCode}`;
}

// TODO: Implement proper distance calculation using Haversine formula
// Currently just returns a rough estimate
export function estimateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const dLat = Math.abs(lat2 - lat1);
  const dLon = Math.abs(lon2 - lon1);
  return Math.sqrt(dLat * dLat + dLon * dLon) * 111;
}

// Status constants — but note these are inconsistent in the codebase
// Some code uses lowercase, some uppercase...
export const ORDER_STATUSES = {
  PENDING: 'pending',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'DELIVERED',
  FAILED: 'failed',
  CANCELLED: 'CANCELLED',
} as const;

export const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['PICKED_UP', 'CANCELLED', 'failed'],
  PICKED_UP: ['in_transit', 'failed'],
  in_transit: ['DELIVERED', 'failed'],
  DELIVERED: [],
  failed: [],
  CANCELLED: [],
};

// NOTE: The transition validation above is NOT actually used anywhere in the routes
// This was supposed to prevent invalid transitions but was never wired up
// A junior dev should probably fix this...
