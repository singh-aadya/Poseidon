import { Incident, IncidentStatus } from '../../types';

export type TimeRangePreset = '30d' | '90d' | '1y' | 'all' | 'custom';
export type ConfidenceFilter = 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type StatusFilter = 'ALL' | 'Under investigation' | 'Resolved' | 'Detected';
export type AgeFilter = 'ALL' | 'fresh' | 'intermediate' | 'aged'; // fresh: <6h, intermediate: 6-24h, aged: >24h

export interface AnalyticsFilterState {
  timeRange: TimeRangePreset;
  customStartDate?: string;
  customEndDate?: string;
  region: string;
  confidence: ConfidenceFilter;
  status: StatusFilter;
  ageFilter: AgeFilter;
}

export type HotspotMode = 'count' | 'area' | 'origin';

export interface RegionalSummaryRow {
  region: string;
  incidentCount: number;
  totalAreaKm2: number;
  avgAgeHours: number;
  candidateVesselsCount: number;
  avgConfidence: number;
  resolvedCount: number;
}
