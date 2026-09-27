export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type IncidentStatus = 'Detected' | 'Under investigation' | 'Resolved';
export type AppMode = 'overview' | 'detection' | 'attribution' | 'forecast' | 'evidence' | 'analytics' | 'public-info' | 'admin';

export * from './rbac';

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface SlickPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

export interface SpillSignature {
  estimated_age_hours_min: number;
  estimated_age_hours_max: number;
  estimated_age_mean: number;
  area_km2: number;
  perimeter_km: number;
  thickness_proxy: 'SHEEN' | 'MODERATE' | 'HEAVY' | 'CRUDE SLICK';
  emulsification_proxy: 'NONE' | 'LOW' | 'LOW–MODERATE' | 'MODERATE' | 'HIGH';
  sar_intensity_mean_db: number;
  sar_contrast_ratio: number;
  shape_elongation: number; // ratio > 1
  motion_consistency: 'LOW' | 'MODERATE' | 'HIGH';
  drift_direction_deg: number;
  drift_speed_knots: number;
  ambient_wind_knots: number;
  ambient_wind_direction_deg: number;
  ambient_current_knots: number;
  ambient_current_direction_deg: number;
  ambient_sst_celsius: number;
  wave_height_meters: number;
}

export interface LookAlikeAnalysis {
  oil_slick_probability: number; // 0.0 - 1.0
  look_alike_probability: number; // 0.0 - 1.0
  look_alike_type_candidates: string[];
  evidence_factors: {
    name: string;
    description: string;
    passed: boolean;
    confidence_weight: number;
  }[];
}

export interface BreadcrumbPoint {
  time_offset_hours: number;
  timestamp: string;
  label: string; // e.g. "T-12h"
  lng: number;
  lat: number;
  confidence: number;
}

export interface SourceCandidate {
  id: string;
  vessel_name: string;
  imo: string;
  mmsi: string;
  callsign: string;
  vessel_type: 'Chemical/Oil Tanker' | 'Crude Oil Tanker' | 'Bulk Carrier' | 'Container Ship' | 'General Cargo' | 'Offshore Supply';
  flag: string;
  flag_code: string;
  length_meters: number;
  beam_meters: number;
  draught_meters: number;
  speed_knots: number;
  heading_deg: number;
  destination: string;
  eta: string;
  current_position: Coordinates;
  attribution_score: number; // 0 - 100
  breakdown: {
    spatio_temporal_proximity: number;
    trajectory_consistency: number;
    spill_window_overlap: number;
    behavior_anomaly: number;
    drift_compatibility: number;
    ais_continuity: number;
  };
  why_this_vessel: string[];
  behavioral_signals: {
    speed_reduction: boolean;
    speed_reduction_detail?: string;
    course_deviation: boolean;
    course_deviation_detail?: string;
    loitering_event: boolean;
    loitering_detail?: string;
    spill_window_proximity: boolean;
    ais_gap_detected: boolean;
    ais_gap_duration_min?: number;
    ais_gap_timestamp?: string;
  };
  historical_track: {
    lng: number;
    lat: number;
    timestamp: string;
    speed_knots: number;
    heading: number;
    is_in_spill_window: boolean;
  }[];
}

export interface ForecastCone {
  horizon_hours: 6 | 12 | 24 | 48;
  predicted_center: Coordinates;
  spread_radius_km: number;
  drift_speed_knots: number;
  drift_bearing_deg: number;
  shoreline_impact_risk: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH';
  closest_shoreline_km: number;
  coordinates: [number, number][]; // Polygon ring for uncertainty cone
}

export interface MLModelMetrics {
  architecture: string;
  backbone: string;
  detection_confidence: number;
  iou_score: number;
  dice_coefficient: number;
  look_alike_probability: number;
  resolution_meters_per_pixel: number;
  acquisition_satellite: string;
  polarization: string;
  orbit_pass: 'ASCENDING' | 'DESCENDING';
  beam_mode: string;
  acquisition_timestamp: string;
}

export interface Incident {
  id: string; // e.g. "PSDN-2026-00142"
  name: string;
  region: string;
  coordinates: Coordinates;
  polygon: SlickPolygon;
  confidence: number; // 0.0 - 1.0
  severity: SeverityLevel;
  status?: IncidentStatus;
  area_km2: number;
  estimated_age_hours_min: number;
  estimated_age_hours_max: number;
  estimated_age_mean: number;
  detection_time: string;
  spill_window_start: string;
  spill_window_end: string;
  satellite: 'Sentinel-1A SAR' | 'Sentinel-1B SAR' | 'RADARSAT Constellation' | 'TerraSAR-X' | 'Sentinel-2 MSI';
  polarization: 'VV' | 'VH' | 'VV+VH' | 'HH';
  signature: SpillSignature;
  look_alike: LookAlikeAnalysis;
  breadcrumbs: BreadcrumbPoint[];
  forecasts: Record<6 | 12 | 24 | 48, ForecastCone>;
  candidates: SourceCandidate[];
  ml_metrics: MLModelMetrics;
  sar_imagery: {
    before_url: string;
    sar_vv_url: string;
    segmented_mask_url: string;
    overlay_composite_url: string;
  };
}

export interface LayerVisibilityState {
  // Satellite
  sentinel1_sar: boolean;
  sentinel2_optical: boolean;
  sar_detection_tiles: boolean;
  satellite_footprint: boolean;
  // Oil Spill
  detected_slicks: boolean;
  slick_boundaries: boolean;
  slick_age_labels: boolean;
  slick_confidence_badges: boolean;
  origin_probability_region: boolean;
  // AIS
  vessel_positions: boolean;
  vessel_tracks: boolean;
  vessel_density_heatmap: boolean;
  suspicious_vessels_only: boolean;
  all_ais_traffic: boolean;
  // Oceanographic
  ocean_currents: boolean;
  wind_vectors: boolean;
  waves: boolean;
  sea_surface_temp: boolean;
  // Forecast
  forecast_trajectory: boolean;
  forecast_uncertainty_cone: boolean;
  // Investigation
  source_candidates: boolean;
  breadcrumb_trail: boolean;
  evidence_links: boolean;
}

export type BasemapStyle = 'light-gis' | 'oceanographic' | 'satellite' | 'dark-matter';

export type MapIntelligenceMode = 'operational' | 'analysis' | 'satellite';

export interface TimelineState {
  currentTime: Date;
  startTime: Date;
  endTime: Date;
  isPlaying: boolean;
  playbackSpeed: 1 | 2 | 4 | 8;
  selectedPreset: '6h' | '12h' | '24h' | '48h' | '7d';
}

export interface NotificationItem {
  id: string;
  type: 'detection' | 'attribution' | 'forecast' | 'system';
  title: string;
  description: string;
  timestamp: string;
  incidentId?: string;
  read: boolean;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
}

