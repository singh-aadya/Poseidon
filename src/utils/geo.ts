import { Coordinates } from '../types';

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
export function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function toDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculate Great Circle distance between two points in kilometers
 */
export function haversineDistanceKm(p1: Coordinates, p2: Coordinates): number {
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Calculate initial bearing from p1 to p2 in degrees (0 = North, 90 = East)
 */
export function calculateBearingDeg(p1: Coordinates, p2: Coordinates): number {
  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);
  const dLng = toRad(p2.lng - p1.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

/**
 * Calculate destination coordinates given start point, distance in km, and bearing in degrees
 */
export function calculateDestinationPoint(
  start: Coordinates,
  distanceKm: number,
  bearingDeg: number
): Coordinates {
  const dByR = distanceKm / EARTH_RADIUS_KM;
  const brng = toRad(bearingDeg);
  const lat1 = toRad(start.lat);
  const lon1 = toRad(start.lng);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dByR) +
      Math.cos(lat1) * Math.sin(dByR) * Math.cos(brng)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(dByR) * Math.cos(lat1),
      Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: toDeg(lat2),
    lng: ((toDeg(lon2) + 540) % 360) - 180,
  };
}

/**
 * Generate a realistic organic slick polygon with irregular edges
 */
export function generateOrganicSlickPolygon(
  center: Coordinates,
  areaKm2: number,
  elongationAxisDeg: number = 45,
  elongationRatio: number = 3.2,
  seed: number = 42
): [number, number][] {
  const points: [number, number][] = [];
  const numVertices = 24;
  const baseRadiusKm = Math.sqrt(areaKm2 / Math.PI);

  for (let i = 0; i < numVertices; i++) {
    const angleDeg = (i / numVertices) * 360;
    const angleRad = toRad(angleDeg);

    // Elongation calculation along specified axis
    const relativeAngle = toRad(angleDeg - elongationAxisDeg);
    const stretch = 1 + (elongationRatio - 1) * Math.cos(relativeAngle) ** 2;

    // Pseudo-random organic perturbation
    const noise =
      Math.sin(angleRad * 3 + seed) * 0.18 +
      Math.cos(angleRad * 5 + seed * 2) * 0.12;

    const currentRadius = baseRadiusKm * stretch * (0.85 + noise);
    const dest = calculateDestinationPoint(center, currentRadius, angleDeg);
    points.push([dest.lng, dest.lat]);
  }

  // Close polygon
  points.push(points[0]);
  return points;
}

/**
 * Generate uncertainty cone polygon for drift forecast
 */
export function generateForecastConePolygon(
  origin: Coordinates,
  predictedCenter: Coordinates,
  spreadRadiusKm: number,
  bearingDeg: number
): [number, number][] {
  const distance = haversineDistanceKm(origin, predictedCenter);
  const coneVertices: [number, number][] = [];

  // Start at origin
  coneVertices.push([origin.lng, origin.lat]);

  // Sweep from right boundary to left boundary across the front arc
  const sweepAngleDeg = Math.min(65, Math.max(25, (spreadRadiusKm / (distance || 1)) * 50));
  const steps = 14;

  for (let i = 0; i <= steps; i++) {
    const angle = (bearingDeg - sweepAngleDeg) + (i / steps) * (sweepAngleDeg * 2);
    const pt = calculateDestinationPoint(origin, distance + spreadRadiusKm * Math.cos(toRad((i / steps - 0.5) * 180)), angle);
    coneVertices.push([pt.lng, pt.lat]);
  }

  // Close back to origin
  coneVertices.push([origin.lng, origin.lat]);
  return coneVertices;
}

/**
 * Generate a grid of ambient vector arrows around an incident for currents or winds
 */
export function generateAmbientVectorGrid(
  center: Coordinates,
  radiusKm: number,
  spacingKm: number,
  baseBearingDeg: number,
  baseSpeed: number,
  perturbationScale: number = 0.15
): Array<{ start: Coordinates; end: Coordinates; speed: number; bearing: number }> {
  const vectors: Array<{ start: Coordinates; end: Coordinates; speed: number; bearing: number }> = [];
  const steps = Math.floor(radiusKm / spacingKm);

  for (let x = -steps; x <= steps; x++) {
    for (let y = -steps; y <= steps; y++) {
      const distFromCenter = Math.sqrt(x * x + y * y) * spacingKm;
      if (distFromCenter > radiusKm) continue;

      const pEast = calculateDestinationPoint(center, x * spacingKm, 90);
      const pLoc = calculateDestinationPoint(pEast, y * spacingKm, 0);

      // Local variability
      const localNoiseAngle = Math.sin(x * 0.7 + y * 0.5) * 18 * perturbationScale;
      const localBearing = (baseBearingDeg + localNoiseAngle + 360) % 360;
      const localSpeed = Math.max(0.2, baseSpeed * (1 + Math.cos(x * 0.4 - y * 0.6) * perturbationScale));

      // Arrow length represents speed (scaled down for visualization)
      const arrowLengthKm = Math.min(spacingKm * 0.75, (localSpeed / 15) * spacingKm);
      const pEnd = calculateDestinationPoint(pLoc, arrowLengthKm, localBearing);

      vectors.push({
        start: pLoc,
        end: pEnd,
        speed: localSpeed,
        bearing: localBearing,
      });
    }
  }

  return vectors;
}
