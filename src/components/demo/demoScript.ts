import { AppMode, LayerVisibilityState } from '../../types';

export interface DemoScene {
  sceneIndex: number;
  name: string;
  stageNumber: string; // e.g. "SCENE 1/9"
  title: string;
  subtitle: string;
  narrative: string;
  durationSeconds: number;
  associatedMode: AppMode;
  camera: {
    center: [number, number]; // [lng, lat]
    zoom: number;
    duration?: number;
  };
  timelineTime: string; // ISO string
  layers: Partial<LayerVisibilityState>;
  satelliteComparison?: {
    mode: 'before' | 'after' | 'mask' | 'overlay';
    maskOpacity: number;
  };
  forecastHorizon?: 6 | 12 | 24 | 48;
  candidateId?: string;
  mapIntelligenceMode?: 'operational' | 'analysis' | 'satellite';
  highlights?: {
    panelSection?: string;
    mapFeature?: string;
    whyThisVessel?: boolean;
    pulseOrigin?: boolean;
    evidenceChecklistStep?: number;
  };
}

export const DEMO_SCENES: DemoScene[] = [
  // ==========================================
  // SCENE 1 — Detection
  // ==========================================
  {
    sceneIndex: 1,
    name: 'Satellite Detection',
    stageNumber: 'STAGE 1/9',
    title: 'Satellite Sensor Acquisition & Slick Detection',
    subtitle: 'Sentinel-1A SAR descending pass detects anomaly in Mumbai High Offshore Sector',
    narrative:
      'Descending C-band SAR pass detects anomalous backscatter dampening (-24.8 dB) over 18.6 km² in the Mumbai High offshore basin (Arabian Sea, Indian EEZ). Surface capillary waves are suppressed, alerting MRCC Mumbai & INCOIS.',
    durationSeconds: 18,
    associatedMode: 'detection',
    camera: {
      center: [71.45, 19.45],
      zoom: 9.6,
      duration: 1800,
    },
    timelineTime: '2026-09-26T14:22:00Z',
    layers: {
      sentinel1_sar: true,
      sar_detection_tiles: true,
      satellite_footprint: true,
      detected_slicks: true,
      slick_boundaries: true,
      slick_age_labels: true,
      slick_confidence_badges: true,
      origin_probability_region: false,
      vessel_positions: false,
      vessel_tracks: false,
      ocean_currents: false,
      wind_vectors: false,
      forecast_trajectory: false,
      forecast_uncertainty_cone: false,
    },
    mapIntelligenceMode: 'operational',
    highlights: {
      panelSection: 'new-detection',
      mapFeature: 'slick-polygon',
    },
  },

  // ==========================================
  // SCENE 2 — Satellite Analysis
  // ==========================================
  {
    sceneIndex: 2,
    name: 'Satellite Analysis',
    stageNumber: 'STAGE 2/9',
    title: 'Deep U-Net Segmentation & Look-Alike Rejection',
    subtitle: 'Multi-layer radiometric calibration and binary mask extraction',
    narrative:
      'Automated U-Net segmentation extracts the slick boundary with 94.2% confidence and 0.912 IoU. Atmospheric noise, monsoon sea-state clutter, and biogenic film look-alikes are discriminated and rejected.',
    durationSeconds: 18,
    associatedMode: 'evidence',
    camera: {
      center: [71.45, 19.45],
      zoom: 10.6,
      duration: 1500,
    },
    timelineTime: '2026-09-26T14:30:00Z',
    layers: {
      sentinel1_sar: true,
      sar_detection_tiles: true,
      satellite_footprint: true,
      detected_slicks: true,
      slick_boundaries: true,
      slick_age_labels: true,
      slick_confidence_badges: true,
      origin_probability_region: false,
      vessel_positions: false,
    },
    satelliteComparison: {
      mode: 'overlay',
      maskOpacity: 0.85,
    },
    mapIntelligenceMode: 'satellite',
    highlights: {
      panelSection: 'satellite-analysis',
      mapFeature: 'segmentation-mask',
    },
  },

  // ==========================================
  // SCENE 3 — Age Estimation
  // ==========================================
  {
    sceneIndex: 3,
    name: 'Age Estimation',
    stageNumber: 'STAGE 3/9',
    title: 'Weathering Inversion & Spill Release Window Calibration',
    subtitle: 'Estimated elapsed time: 8–14 hours prior to observation',
    narrative:
      'Spill age calibrated to 8–14 hours (mean: 11h) based on SAR backscatter intensity, film thickness proxy, emulsification rate, and Arabian Sea SST (28.6°C). Release window established: 25 Sep 20:00 → 26 Sep 02:00 UTC.',
    durationSeconds: 14,
    associatedMode: 'detection',
    camera: {
      center: [71.45, 19.45],
      zoom: 10.2,
      duration: 1200,
    },
    timelineTime: '2026-09-26T01:00:00Z',
    layers: {
      sentinel1_sar: true,
      detected_slicks: true,
      slick_boundaries: true,
      slick_age_labels: true,
      slick_confidence_badges: true,
      origin_probability_region: false,
      vessel_positions: false,
    },
    mapIntelligenceMode: 'operational',
    highlights: {
      panelSection: 'estimated-age',
      mapFeature: 'spill-window',
    },
  },

  // ==========================================
  // SCENE 4 — Drift Reconstruction
  // ==========================================
  {
    sceneIndex: 4,
    name: 'Drift Reconstruction',
    stageNumber: 'STAGE 4/9',
    title: 'Metocean Lagrangian Hindcasting & Trajectory Inversion',
    subtitle: 'INCOIS OSTM 0.72 kn currents and IMD 14.2 kn winds back-calculate drift',
    narrative:
      'Lagrangian particle hindcasting traces the slick centroid back across 24 hours: T-24h → T-18h → T-12h → T-6h → Detection. Spatially localized Indian Ocean current and Arabian Sea wind vectors drive the advection corridor.',
    durationSeconds: 18,
    associatedMode: 'forecast',
    camera: {
      center: [71.34, 19.40],
      zoom: 10.0,
      duration: 1600,
    },
    timelineTime: '2026-09-25T23:00:00Z',
    layers: {
      detected_slicks: true,
      slick_boundaries: true,
      breadcrumb_trail: true,
      ocean_currents: true,
      wind_vectors: true,
      origin_probability_region: false,
      vessel_positions: false,
      forecast_trajectory: false,
    },
    mapIntelligenceMode: 'analysis',
    highlights: {
      panelSection: 'hindcast-drift',
      mapFeature: 'backward-trajectory',
    },
  },

  // ==========================================
  // SCENE 5 — Origin Reconstruction
  // ==========================================
  {
    sceneIndex: 5,
    name: 'Origin Reconstruction',
    stageNumber: 'STAGE 5/9',
    title: 'Probable Source Region & Hindcast Convergence',
    subtitle: 'Centroid: 19.34° N, 71.22° E (±1.4 km, 82% confidence boundary in Mumbai High Sector)',
    narrative:
      'Reverse drift converges on a 4.2 km² release probability region in Mumbai High West Sector. The system establishes this area as the probable discharge zone during the estimated spill window (25 Sep 23:15 UTC).',
    durationSeconds: 16,
    associatedMode: 'forecast',
    camera: {
      center: [71.22, 19.34],
      zoom: 10.5,
      duration: 1500,
    },
    timelineTime: '2026-09-25T23:15:00Z',
    layers: {
      detected_slicks: true,
      slick_boundaries: true,
      breadcrumb_trail: true,
      origin_probability_region: true,
      ocean_currents: true,
      vessel_positions: false,
      vessel_tracks: false,
    },
    mapIntelligenceMode: 'analysis',
    highlights: {
      panelSection: 'origin-region',
      mapFeature: 'origin-ellipse',
      pulseOrigin: true,
    },
  },

  // ==========================================
  // SCENE 6 — AIS Vessel Correlation
  // ==========================================
  {
    sceneIndex: 6,
    name: 'AIS Vessel Correlation',
    stageNumber: 'STAGE 6/9',
    title: 'Corridor Traffic Query & Spatio-Temporal Intersection',
    subtitle: '12 maritime vessels queried; candidate tanker corridor intersecting Mumbai High fairway',
    narrative:
      'Historical AIS telemetry queried across the 30 km tanker fairway into Mumbai/JNPT reveals candidate traffic intersecting the spill window. Irrelevant cargo vessels fade while suspect tanker tracks are highlighted.',
    durationSeconds: 18,
    associatedMode: 'attribution',
    camera: {
      center: [71.35, 19.38],
      zoom: 9.3,
      duration: 1600,
    },
    timelineTime: '2026-09-25T23:20:00Z',
    layers: {
      detected_slicks: true,
      origin_probability_region: true,
      breadcrumb_trail: true,
      vessel_positions: true,
      vessel_tracks: true,
      source_candidates: true,
      ocean_currents: false,
    },
    mapIntelligenceMode: 'operational',
    highlights: {
      panelSection: 'candidates-list',
      mapFeature: 'candidate-tracks',
    },
  },

  // ==========================================
  // SCENE 7 — Attribution
  // ==========================================
  {
    sceneIndex: 7,
    name: 'Attribution',
    stageNumber: 'STAGE 7/9',
    title: 'Multi-Factor Source Attribution & Kinematic Anomaly',
    subtitle: 'MV OCEAN STAR (IMO 9481923, En route to JNPT) scored at 87% attribution confidence',
    narrative:
      'MV OCEAN STAR shows critical anomalies: speed reduction (14.1 → 8.2 kn), 18-minute AIS blackout at 23:22 UTC, and precise 0.42 km spatial intersection with the reverse-drift centroid in the Arabian Sea.',
    durationSeconds: 20,
    associatedMode: 'attribution',
    camera: {
      center: [71.35, 19.38],
      zoom: 9.8,
      duration: 1400,
    },
    timelineTime: '2026-09-25T23:22:00Z',
    candidateId: 'VESSEL-9481923',
    layers: {
      detected_slicks: true,
      origin_probability_region: true,
      breadcrumb_trail: true,
      vessel_positions: true,
      vessel_tracks: true,
      source_candidates: true,
      evidence_links: true,
    },
    mapIntelligenceMode: 'operational',
    highlights: {
      panelSection: 'attribution-factors',
      mapFeature: 'prime-candidate-track',
      whyThisVessel: true,
    },
  },

  // ==========================================
  // SCENE 8 — Forecast
  // ==========================================
  {
    sceneIndex: 8,
    name: 'Forecast',
    stageNumber: 'STAGE 8/9',
    title: 'Forward Ensemble Drift Projection & Shoreline Risk',
    subtitle: '48-hour Lagrangian projection: closest approach to Maharashtra coast 22 km',
    narrative:
      'Ensemble trajectory projects the slick east-northeastward at 0.78–0.90 kn towards the Raigad/Alibag coastal buffer. The 48-hour uncertainty cone indicates moderate shoreline impact risk, clearing sensitive coastal mangroves by 22 km.',
    durationSeconds: 18,
    associatedMode: 'forecast',
    camera: {
      center: [71.65, 19.55],
      zoom: 9.1,
      duration: 1500,
    },
    timelineTime: '2026-09-27T14:00:00Z',
    forecastHorizon: 48,
    layers: {
      detected_slicks: true,
      slick_boundaries: true,
      forecast_trajectory: true,
      forecast_uncertainty_cone: true,
      ocean_currents: true,
      wind_vectors: true,
      origin_probability_region: false,
      vessel_positions: false,
    },
    mapIntelligenceMode: 'operational',
    highlights: {
      panelSection: 'forecast-cone',
      mapFeature: 'forecast-envelope',
    },
  },

  // ==========================================
  // SCENE 9 — Evidence Dossier
  // ==========================================
  {
    sceneIndex: 9,
    name: 'Evidence Dossier',
    stageNumber: 'STAGE 9/9',
    title: 'Chain-of-Custody Verification & Evidence Dossier',
    subtitle: 'Complete 9-step audit trail compiled for Indian Coast Guard & DG Shipping enforcement',
    narrative:
      'From Sentinel-1 SAR acquisition through U-Net segmentation, INCOIS drift hindcast, and AIS kinematic anomaly scoring: all 9 forensic evidence factors are verified. Legal evidence dossier ready for ICG pollution strike team.',
    durationSeconds: 18,
    associatedMode: 'evidence',
    camera: {
      center: [71.45, 19.45],
      zoom: 9.5,
      duration: 1400,
    },
    timelineTime: '2026-09-26T16:00:00Z',
    layers: {
      sentinel1_sar: true,
      detected_slicks: true,
      slick_boundaries: true,
      origin_probability_region: true,
      breadcrumb_trail: true,
      vessel_tracks: true,
      source_candidates: true,
      forecast_trajectory: true,
    },
    mapIntelligenceMode: 'operational',
    highlights: {
      panelSection: 'evidence-chain-complete',
      evidenceChecklistStep: 9,
    },
  },
];
