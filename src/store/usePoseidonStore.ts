import { create } from 'zustand';
import {
  Incident,
  AppMode,
  LayerVisibilityState,
  BasemapStyle,
  TimelineState,
  ConfidenceLevel,
  SeverityLevel,
} from '../types';
import { MOCK_INCIDENTS } from '../data/mockIncidents';

export interface FilterState {
  timePreset: 'all' | '24h' | '48h' | '7d';
  confidence: 'ALL' | ConfidenceLevel;
  severity: 'ALL' | SeverityLevel;
  region: string;
}

export interface DemoStep {
  stepIndex: number;
  title: string;
  subtitle: string;
  description: string;
  associatedMode: AppMode;
  camera: { lng: number; lat: number; zoom: number };
  highlightElement?: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepIndex: 1,
    title: 'Step 1: Satellite anomaly acquisition',
    subtitle: 'Sentinel-1 C-Band SAR passes over Gulf of Mexico',
    description: 'Sentinel-1A SAR descending pass captures anomalous backscatter dampening (-24.8 dB) in Mississippi Canyon Lease Block 242. Surface capillary waves are suppressed across 18.6 km².',
    associatedMode: 'detection',
    camera: { lng: -90.45, lat: 27.85, zoom: 9.8 },
  },
  {
    stepIndex: 2,
    title: 'Step 2: Deep U-Net slick segmentation',
    subtitle: 'Automated pixel-level segmentation mask extraction',
    description: 'ResNeXt-101 Attention U-Net model segments slick perimeter with 94.2% confidence and 0.912 Intersection-over-Union (IoU), filtering out non-oil water artifacts.',
    associatedMode: 'detection',
    camera: { lng: -90.45, lat: 27.85, zoom: 10.4 },
  },
  {
    stepIndex: 3,
    title: 'Step 3: Slick aging & weathering model',
    subtitle: 'Atmospheric & hydrodynamic weathering analysis',
    description: 'Emulsification proxy, film thickness, and ambient temperature (28.4°C) yield an estimated spill age of 8–14 hours (spill release window: 25 Sep 20:00 → 26 Sep 02:00 UTC).',
    associatedMode: 'detection',
    camera: { lng: -90.45, lat: 27.85, zoom: 10.4 },
  },
  {
    stepIndex: 4,
    title: 'Step 4: Metocean forcing & drift hindcast',
    subtitle: 'Ocean current (0.72 kn NE) & surface wind (14.2 kn SW)',
    description: 'Lagrangian particle hindcasting traces slick centroid back 12 hours to origin point (27.72° N, 90.62° W) at 23:15 UTC.',
    associatedMode: 'forecast',
    camera: { lng: -90.52, lat: 27.80, zoom: 9.9 },
  },
  {
    stepIndex: 5,
    title: 'Step 5: AIS spatio-temporal reconstruction',
    subtitle: 'Correlating historical vessel trajectories through spill window',
    description: 'Querying historical AIS tracks reveals 12 vessels transited within 30 km, of which 5 directly intersected the probable backward release corridor.',
    associatedMode: 'attribution',
    camera: { lng: -90.35, lat: 27.82, zoom: 9.2 },
  },
  {
    stepIndex: 6,
    title: 'Step 6: Source candidate identification',
    subtitle: 'Filtering target vessels against kinematic anomalies',
    description: 'Chemical/Oil Tanker MV OCEAN STAR (IMO 9481923) emerges as prime candidate with 87% attribution confidence, exhibiting anomalous deceleration from 14.1 to 8.2 kn.',
    associatedMode: 'attribution',
    camera: { lng: -90.0, lat: 27.95, zoom: 8.8 },
  },
  {
    stepIndex: 7,
    title: 'Step 7: Multi-factor attribution scoring',
    subtitle: 'Probabilistic evidence breakdown & AIS gap detection',
    description: 'Multi-criteria scoring calculates 94% spatial proximity, 91% trajectory alignment, and an 18-minute AIS transmission interruption precisely at the origin point.',
    associatedMode: 'attribution',
    camera: { lng: -90.2, lat: 27.9, zoom: 9.4 },
  },
  {
    stepIndex: 8,
    title: 'Step 8: Ensemble drift forecast & shoreline risk',
    subtitle: '48-hour forward drift projection & uncertainty envelope',
    description: 'Forward trajectory projects slick northeastward at 0.78–0.90 kn. 48-hour uncertainty cone indicates moderate shoreline impact risk (19 km from coastal barrier islands).',
    associatedMode: 'forecast',
    camera: { lng: -90.1, lat: 28.05, zoom: 8.9 },
  },
];

interface PoseidonState {
  incidents: Incident[];
  activeIncidentId: string;
  activeMode: AppMode;
  selectedCandidateId: string | null;
  selectedForecastHorizon: 6 | 12 | 24 | 48;
  
  // Panels
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  systemStatusOpen: boolean;
  vesselDetailModalOpen: boolean;
  
  // Basemap & Layers
  basemap: BasemapStyle;
  layers: LayerVisibilityState;
  
  // Timeline
  timeline: TimelineState;
  
  // Filter & Search
  searchQuery: string;
  filters: FilterState;
  
  // Demo Mode
  demoInvestigation: {
    isActive: boolean;
    currentStep: number; // 1-8
  };
  
  // Satellite Split/Compare
  satelliteComparison: {
    mode: 'overlay' | 'split' | 'before' | 'after' | 'mask';
    maskOpacity: number;
  };

  // Map Camera Target
  mapFlyTarget: { center: [number, number]; zoom: number; duration?: number } | null;

  // Actions
  setActiveIncidentId: (id: string) => void;
  setActiveMode: (mode: AppMode) => void;
  setSelectedCandidateId: (id: string | null) => void;
  setSelectedForecastHorizon: (horizon: 6 | 12 | 24 | 48) => void;
  
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setLeftPanelOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setSystemStatusOpen: (open: boolean) => void;
  setVesselDetailModalOpen: (open: boolean) => void;
  
  setBasemap: (basemap: BasemapStyle) => void;
  toggleLayer: (layer: keyof LayerVisibilityState) => void;
  setLayer: (layer: keyof LayerVisibilityState, value: boolean) => void;
  
  // Timeline Actions
  setTimelinePlaying: (isPlaying: boolean) => void;
  setTimelineCurrentTime: (time: Date) => void;
  setTimelineSpeed: (speed: 1 | 2 | 4 | 8) => void;
  setTimelinePreset: (preset: '6h' | '12h' | '24h' | '48h' | '7d') => void;
  stepTimeline: (direction: -1 | 1) => void;
  
  // Search & Filters
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // Demo Actions
  startDemoInvestigation: () => void;
  stopDemoInvestigation: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  goToDemoStep: (step: number) => void;
  
  // Satellite compare actions
  setSatelliteComparison: (partial: Partial<{ mode: 'overlay' | 'split' | 'before' | 'after' | 'mask'; maskOpacity: number }>) => void;
  
  // Navigation
  flyToCoords: (coords: { lng: number; lat: number }, zoom?: number) => void;
  resetView: () => void;
  clearMapFlyTarget: () => void;
  
  // Computed helpers
  getActiveIncident: () => Incident;
  getSelectedCandidate: () => any | null;
  getFilteredIncidents: () => Incident[];
}

const DEFAULT_LAYERS: LayerVisibilityState = {
  // Satellite
  sentinel1_sar: true,
  sentinel2_optical: false,
  sar_detection_tiles: true,
  // Oil Spill
  detected_slicks: true,
  slick_boundaries: true,
  slick_age_labels: true,
  slick_confidence_badges: true,
  // AIS
  vessel_positions: true,
  vessel_tracks: true,
  vessel_density_heatmap: false,
  suspicious_vessels_only: false,
  // Oceanographic
  ocean_currents: true,
  wind_vectors: true,
  waves: false,
  sea_surface_temp: false,
  // Forecast
  forecast_trajectory: true,
  forecast_uncertainty_cone: true,
  // Investigation
  source_candidates: true,
  breadcrumb_trail: true,
  evidence_links: true,
};

const NOW = new Date('2026-09-26T16:00:00Z');
const START_24H = new Date(NOW.getTime() - 24 * 3600 * 1000);

export const usePoseidonStore = create<PoseidonState>((set, get) => ({
  incidents: MOCK_INCIDENTS,
  activeIncidentId: 'PSDN-2026-00142',
  activeMode: 'detection',
  selectedCandidateId: 'VESSEL-9481923',
  selectedForecastHorizon: 24,

  leftPanelOpen: true,
  rightPanelOpen: true,
  systemStatusOpen: false,
  vesselDetailModalOpen: false,

  basemap: 'oceanographic',
  layers: DEFAULT_LAYERS,

  timeline: {
    currentTime: NOW,
    startTime: START_24H,
    endTime: NOW,
    isPlaying: false,
    playbackSpeed: 1,
    selectedPreset: '24h',
  },

  searchQuery: '',
  filters: {
    timePreset: '24h',
    confidence: 'ALL',
    severity: 'ALL',
    region: 'ALL',
  },

  demoInvestigation: {
    isActive: false,
    currentStep: 1,
  },

  satelliteComparison: {
    mode: 'overlay',
    maskOpacity: 0.7,
  },

  mapFlyTarget: { center: [-90.45, 27.85], zoom: 10.4, duration: 1800 },

  setActiveIncidentId: (id: string) => {
    const inc = get().incidents.find((i) => i.id === id);
    if (!inc) return;

    const firstCandidate = inc.candidates.length > 0 ? inc.candidates[0].id : null;

    set({
      activeIncidentId: id,
      selectedCandidateId: firstCandidate,
      mapFlyTarget: {
        center: [inc.coordinates.lng, inc.coordinates.lat],
        zoom: 10.4,
        duration: 1800,
      },
    });
  },

  setActiveMode: (mode: AppMode) => {
    set({ activeMode: mode });
  },

  setSelectedCandidateId: (id: string | null) => {
    set({ selectedCandidateId: id });
  },

  setSelectedForecastHorizon: (horizon: 6 | 12 | 24 | 48) => {
    set({ selectedForecastHorizon: horizon });
  },

  toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
  toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
  setLeftPanelOpen: (open: boolean) => set({ leftPanelOpen: open }),
  setRightPanelOpen: (open: boolean) => set({ rightPanelOpen: open }),
  setSystemStatusOpen: (open: boolean) => set({ systemStatusOpen: open }),
  setVesselDetailModalOpen: (open: boolean) => set({ vesselDetailModalOpen: open }),

  setBasemap: (basemap: BasemapStyle) => set({ basemap }),

  toggleLayer: (layer: keyof LayerVisibilityState) =>
    set((s) => ({
      layers: { ...s.layers, [layer]: !s.layers[layer] },
    })),

  setLayer: (layer: keyof LayerVisibilityState, value: boolean) =>
    set((s) => ({
      layers: { ...s.layers, [layer]: value },
    })),

  setTimelinePlaying: (isPlaying: boolean) =>
    set((s) => ({ timeline: { ...s.timeline, isPlaying } })),

  setTimelineCurrentTime: (time: Date) =>
    set((s) => ({ timeline: { ...s.timeline, currentTime: time } })),

  setTimelineSpeed: (playbackSpeed: 1 | 2 | 4 | 8) =>
    set((s) => ({ timeline: { ...s.timeline, playbackSpeed } })),

  setTimelinePreset: (selectedPreset: '6h' | '12h' | '24h' | '48h' | '7d') => {
    const hours =
      selectedPreset === '6h'
        ? 6
        : selectedPreset === '12h'
        ? 12
        : selectedPreset === '24h'
        ? 24
        : selectedPreset === '48h'
        ? 48
        : 168; // 7 days
    const newStart = new Date(NOW.getTime() - hours * 3600 * 1000);
    set((s) => ({
      timeline: {
        ...s.timeline,
        selectedPreset,
        startTime: newStart,
        endTime: NOW,
        currentTime: NOW,
      },
      filters: {
        ...s.filters,
        timePreset: selectedPreset === '7d' ? '7d' : selectedPreset === '48h' ? '48h' : '24h',
      },
    }));
  },

  stepTimeline: (direction: -1 | 1) => {
    const { currentTime, startTime, endTime, playbackSpeed } = get().timeline;
    const stepMs = 3600 * 1000 * playbackSpeed * direction; // 1 hour step
    let nextMs = currentTime.getTime() + stepMs;
    if (nextMs > endTime.getTime()) nextMs = startTime.getTime();
    if (nextMs < startTime.getTime()) nextMs = endTime.getTime();
    set((s) => ({
      timeline: { ...s.timeline, currentTime: new Date(nextMs) },
    }));
  },

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),

  setFilters: (newFilters: Partial<FilterState>) =>
    set((s) => ({ filters: { ...s.filters, ...newFilters } })),

  resetFilters: () =>
    set({
      filters: {
        timePreset: '24h',
        confidence: 'ALL',
        severity: 'ALL',
        region: 'ALL',
      },
      searchQuery: '',
    }),

  startDemoInvestigation: () => {
    const step1 = DEMO_STEPS[0];
    set({
      activeIncidentId: 'PSDN-2026-00142',
      selectedCandidateId: 'VESSEL-9481923',
      activeMode: step1.associatedMode,
      demoInvestigation: {
        isActive: true,
        currentStep: 1,
      },
      mapFlyTarget: {
        center: [step1.camera.lng, step1.camera.lat],
        zoom: step1.camera.zoom,
        duration: 1600,
      },
    });
  },

  stopDemoInvestigation: () => {
    set({
      demoInvestigation: {
        isActive: false,
        currentStep: 1,
      },
    });
  },

  nextDemoStep: () => {
    const current = get().demoInvestigation.currentStep;
    if (current < DEMO_STEPS.length) {
      get().goToDemoStep(current + 1);
    } else {
      get().stopDemoInvestigation();
    }
  },

  prevDemoStep: () => {
    const current = get().demoInvestigation.currentStep;
    if (current > 1) {
      get().goToDemoStep(current - 1);
    }
  },

  goToDemoStep: (stepNumber: number) => {
    const step = DEMO_STEPS.find((s) => s.stepIndex === stepNumber);
    if (!step) return;

    set({
      demoInvestigation: {
        isActive: true,
        currentStep: stepNumber,
      },
      activeMode: step.associatedMode,
      mapFlyTarget: {
        center: [step.camera.lng, step.camera.lat],
        zoom: step.camera.zoom,
        duration: 1500,
      },
    });
  },

  setSatelliteComparison: (partial) =>
    set((s) => ({
      satelliteComparison: { ...s.satelliteComparison, ...partial },
    })),

  flyToCoords: (coords: { lng: number; lat: number }, zoom: number = 9.8) => {
    set({
      mapFlyTarget: { center: [coords.lng, coords.lat], zoom, duration: 1800 },
    });
  },

  resetView: () => {
    set({
      mapFlyTarget: { center: [-35.0, 25.0], zoom: 3.2, duration: 2000 },
    });
  },

  clearMapFlyTarget: () => set({ mapFlyTarget: null }),

  getActiveIncident: () => {
    const { incidents, activeIncidentId } = get();
    return incidents.find((i) => i.id === activeIncidentId) || incidents[0];
  },

  getSelectedCandidate: () => {
    const incident = get().getActiveIncident();
    const candidateId = get().selectedCandidateId;
    if (!candidateId) return incident.candidates[0] || null;
    return incident.candidates.find((c) => c.id === candidateId) || incident.candidates[0] || null;
  },

  getFilteredIncidents: () => {
    const { incidents, searchQuery, filters } = get();
    return incidents.filter((inc) => {
      // Search text match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = inc.id.toLowerCase().includes(q);
        const matchName = inc.name.toLowerCase().includes(q);
        const matchRegion = inc.region.toLowerCase().includes(q);
        const matchVessel = inc.candidates.some(
          (c) =>
            c.vessel_name.toLowerCase().includes(q) ||
            c.imo.includes(q) ||
            c.mmsi.includes(q)
        );
        if (!matchId && !matchName && !matchRegion && !matchVessel) return false;
      }

      // Confidence filter
      if (filters.confidence !== 'ALL') {
        const conf = inc.confidence;
        if (filters.confidence === 'HIGH' && conf < 0.85) return false;
        if (filters.confidence === 'MEDIUM' && (conf < 0.7 || conf >= 0.85)) return false;
        if (filters.confidence === 'LOW' && conf >= 0.7) return false;
      }

      // Severity filter
      if (filters.severity !== 'ALL' && inc.severity !== filters.severity) {
        return false;
      }

      // Region filter
      if (filters.region !== 'ALL' && inc.region !== filters.region) {
        return false;
      }

      return true;
    });
  },
}));
