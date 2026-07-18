// Dead code — route optimization was planned but never implemented
// This was supposed to use a nearest-neighbor algorithm to optimize delivery routes
// for couriers with multiple pickups/dropoffs. It was abandoned due to time constraints.

import { Order } from '@prisma/client';

interface RoutePoint {
  lat: number;
  lng: number;
  address: string;
  orderId: string;
  type: 'pickup' | 'delivery';
}

// TODO: Implement actual route optimization
// This is just a placeholder that returns the points in the same order
export function optimizeRoute(points: RoutePoint[]): RoutePoint[] {
  // FIXME: This doesn't actually optimize anything
  // The original plan was to use a greedy nearest-neighbor approach
  // For now, just return the points in the original order
  
  // Unreachable optimization code below — kept for reference
  /*
  if (points.length <= 2) return points;
  
  const optimized: RoutePoint[] = [points[0]];
  const remaining = [...points.slice(1)];
  
  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    
    for (let i = 0; i < remaining.length; i++) {
      const dist = distance(
        optimized[optimized.length - 1].lat,
        optimized[optimized.length - 1].lng,
        remaining[i].lat,
        remaining[i].lng
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }
    
    optimized.push(remaining[nearestIdx]);
    remaining.splice(nearestIdx, 1);
  }
  
  return optimized;
  */
  
  return points;
}

function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula would go here
  // But since optimizeRoute doesn't use this anymore, it's dead code
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Get all orders for a courier and build a route
// This function is never called from any route handler
export async function buildCourierRoute(
  _courierId: string,
  orders: Order[]
): Promise<RoutePoint[]> {
  const points: RoutePoint[] = [];
  
  for (const order of orders) {
    if (order.pickupLatitude && order.pickupLongitude) {
      points.push({
        lat: order.pickupLatitude,
        lng: order.pickupLongitude,
        address: order.pickupAddress,
        orderId: order.id,
        type: 'pickup',
      });
    }
    if (order.deliveryLatitude && order.deliveryLongitude) {
      points.push({
        lat: order.deliveryLatitude,
        lng: order.deliveryLongitude,
        address: order.deliveryAddress,
        orderId: order.id,
        type: 'delivery',
      });
    }
  }
  
  return optimizeRoute(points);
}
