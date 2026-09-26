import { Coordinates } from '../types';
import { generateAmbientVectorGrid } from '../utils/geo';

export interface EnvironmentalVectorField {
  currentVectors: Array<{ start: Coordinates; end: Coordinates; speed: number; bearing: number }>;
  windVectors: Array<{ start: Coordinates; end: Coordinates; speed: number; bearing: number }>;
  sstCelsius: number;
  waveHeightMeters: number;
  dominantCurrentBearing: number;
  dominantCurrentSpeed: number;
  dominantWindBearing: number;
  dominantWindSpeed: number;
}

/**
 * Get environmental vectors and telemetry tailored for a given coordinate & incident signature
 */
export function getEnvironmentalField(
  center: Coordinates,
  currentBearing: number = 55,
  currentSpeed: number = 0.75,
  windBearing: number = 220,
  windSpeed: number = 14.0
): EnvironmentalVectorField {
  // Generate vectors within 60 km radius with 12 km spacing
  const currentVectors = generateAmbientVectorGrid(
    center,
    65, // radius km
    12, // spacing km
    currentBearing,
    currentSpeed,
    0.2
  );

  const windVectors = generateAmbientVectorGrid(
    center,
    80, // radius km
    16, // spacing km
    windBearing,
    windSpeed,
    0.15
  );

  return {
    currentVectors,
    windVectors,
    sstCelsius: 28.4,
    waveHeightMeters: 1.2,
    dominantCurrentBearing: currentBearing,
    dominantCurrentSpeed: currentSpeed,
    dominantWindBearing: windBearing,
    dominantWindSpeed: windSpeed,
  };
}
