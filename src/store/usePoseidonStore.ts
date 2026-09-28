import { create } from 'zustand';
import {
  Incident,
  AppMode,
  LayerVisibilityState,
  BasemapStyle,
  TimelineState,
  ConfidenceLevel,
  SeverityLevel,
  MapIntelligenceMode,
  NotificationItem,
  CopilotMessage,
  UserProfile,
  OperationalAlert,
  IncidentAssignment,
  AuditLogEntry,
  AlertRuleConfig,
  ResponseWorkflowStage,
} from '../types';
import { MOCK_INCIDENTS } from '../data/mockIncidents';
import {
  MOCK_USERS,
  INITIAL_OPERATIONAL_ALERTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ALERT_RULES,
} from '../data/mockRbacData';

export interface FilterState {
  timePreset: 'all' | '24h' | '48h' | '7d';
  confidence: 'ALL' | ConfidenceLevel;
  severity: 'ALL' | SeverityLevel;
  region: string;
}

import { DEMO_SCENES, DemoScene } from '../components/demo/demoScript';

export type DemoStep = DemoScene;
export const DEMO_STEPS = DEMO_SCENES;

export interface DemoInvestigationState {
  isActive: boolean;
  isPlaying: boolean;
  currentStep: number; // 1-9
  sceneProgress: number; // 0.0 - 1.0 within current scene
  speed: 0.5 | 1 | 1.5 | 2;
  elapsedSeconds: number;
}

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
  notificationDrawerOpen: boolean;
  
  // Basemap & Layers
  basemap: BasemapStyle;
  layers: LayerVisibilityState;
  
  // Timeline
  timeline: TimelineState;
  
  // Filter & Search
  searchQuery: string;
  filters: FilterState;
  
  // Demo Mode
  demoInvestigation: DemoInvestigationState;
  
  // Satellite Split/Compare
  satelliteComparison: {
    mode: 'overlay' | 'split' | 'before' | 'after' | 'mask';
    maskOpacity: number;
  };

  // Map Intelligence Mode & Operations
  mapIntelligenceMode: MapIntelligenceMode;
  isReplayMode: boolean;
  notifications: NotificationItem[];
  comparedIncidentIds: [string, string] | null;
  copilotOpen: boolean;
  copilotMessages: CopilotMessage[];

  // Map Camera Target
  mapFlyTarget: {
    center?: [number, number];
    zoom?: number;
    bounds?: [[number, number], [number, number]];
    duration?: number;
  } | null;

  // Actions
  setActiveIncidentId: (id: string) => void;
  fitAllIncidents: () => void;
  setActiveMode: (mode: AppMode) => void;
  setSelectedCandidateId: (id: string | null) => void;
  setSelectedForecastHorizon: (horizon: 6 | 12 | 24 | 48) => void;
  
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setLeftPanelOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setSystemStatusOpen: (open: boolean) => void;
  setVesselDetailModalOpen: (open: boolean) => void;
  setNotificationDrawerOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  
  setBasemap: (basemap: BasemapStyle) => void;
  toggleLayer: (layer: keyof LayerVisibilityState) => void;
  setLayer: (layer: keyof LayerVisibilityState, value: boolean) => void;
  
  // Intelligence Modes & Replay
  setMapIntelligenceMode: (mode: MapIntelligenceMode) => void;
  toggleReplayMode: () => void;
  setIsReplayMode: (active: boolean) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Comparison & Copilot
  setComparedIncidentIds: (ids: [string, string] | null) => void;
  setCopilotOpen: (open: boolean) => void;
  toggleCopilot: () => void;
  sendCopilotMessage: (text: string) => void;
  executeCopilotAction: (actionType: string, payload?: any) => void;

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
  pauseDemoInvestigation: () => void;
  resumeDemoInvestigation: () => void;
  restartDemoInvestigation: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  goToDemoStep: (step: number) => void;
  setDemoSpeed: (speed: 0.5 | 1 | 1.5 | 2) => void;
  tickDemo: (deltaSeconds: number) => void;
  
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

  // RBAC & User Session
  currentUser: UserProfile;
  users: UserProfile[];
  setCurrentUser: (user: UserProfile) => void;

  // Alerts Center
  alerts: OperationalAlert[];
  alertsCenterOpen: boolean;
  setAlertsCenterOpen: (open: boolean) => void;
  toggleAlertsCenter: () => void;
  acknowledgeAlert: (alertId: string, notes?: string) => void;
  resolveAlert: (alertId: string, notes?: string) => void;
  assignAlert: (alertId: string, team: string, user?: string) => void;
  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;

  // Incident Assignment & Response Workflow
  assignments: Record<string, IncidentAssignment>;
  assignIncidentModalIncidentId: string | null;
  setAssignIncidentModalIncidentId: (id: string | null) => void;
  assignIncident: (
    incidentId: string,
    team: string,
    responder: string,
    escalationLevel?: 'MONITORING' | 'ADVISORY' | 'CRITICAL RESPONSE',
    note?: string
  ) => void;
  addIncidentResponseNote: (incidentId: string, note: string) => void;
  updateIncidentWorkflowStage: (incidentId: string, stage: ResponseWorkflowStage) => void;

  // Audit Trail & Admin Modal
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  alertRules: AlertRuleConfig[];
  toggleAlertRule: (ruleId: string) => void;
  adminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;
}

const DEFAULT_LAYERS: LayerVisibilityState = {
  // Satellite
  sentinel1_sar: true,
  sentinel2_optical: false,
  sar_detection_tiles: true,
  satellite_footprint: false,
  // Oil Spill (Default ON for overview)
  detected_slicks: true,
  slick_boundaries: true,
  slick_age_labels: true,
  slick_confidence_badges: true,
  origin_probability_region: false,
  // AIS (Default OFF - no clutter until requested)
  vessel_positions: false,
  vessel_tracks: false,
  vessel_density_heatmap: false,
  suspicious_vessels_only: false,
  all_ais_traffic: false,
  // Oceanographic (Clean overview)
  ocean_currents: false,
  wind_vectors: false,
  waves: false,
  sea_surface_temp: false,
  // Forecast (Default OFF until requested)
  forecast_trajectory: false,
  forecast_uncertainty_cone: false,
  // Investigation (Default OFF)
  source_candidates: false,
  breadcrumb_trail: false,
  evidence_links: false,
};

const NOW = new Date('2026-09-26T16:00:00Z');
const START_24H = new Date(NOW.getTime() - 24 * 3600 * 1000);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    type: 'detection',
    title: 'SAR Anomaly: High-confidence dampening',
    description: 'Sentinel-1A SAR descending pass confirms -24.8 dB backscatter reduction in MC Block 242 (18.6 km²).',
    timestamp: '14:28 UTC',
    incidentId: 'PSDN-2026-00142',
    read: false,
  },
  {
    id: 'notif-02',
    type: 'attribution',
    title: 'AIS Kinematic Anomaly Detected',
    description: 'MV OCEAN STAR (IMO 9481923) recorded speed anomaly (14.1 → 8.2 kn) and 18-minute transmission gap near reconstructed origin.',
    timestamp: '13:50 UTC',
    incidentId: 'PSDN-2026-00142',
    read: false,
  },
  {
    id: 'notif-03',
    type: 'forecast',
    title: 'Shoreline Trajectory Alert',
    description: 'HYCOM/GFS ensemble run indicates 48h trajectory approaching Chandeleur Sound barrier islands (19 km clearance).',
    timestamp: '11:15 UTC',
    incidentId: 'PSDN-2026-00142',
    read: false,
  },
  {
    id: 'notif-04',
    type: 'system',
    title: 'Metocean Feeds Synchronized',
    description: 'NOAA GFS 0.25° wind field and HYCOM 1/12° ocean surface velocity matrices successfully updated.',
    timestamp: '09:00 UTC',
    read: true,
  },
];

const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: 'copilot-01',
    sender: 'assistant',
    text: 'POSEIDON Maritime Intelligence Copilot online. Active investigation: PSDN-2026-00142 (Mississippi Canyon slick, 18.6 km²). 4 candidate vessels evaluated; MV OCEAN STAR identified with 87% attribution confidence. Select an action below or ask a question.',
    timestamp: '14:30 UTC',
    suggestedActions: [
      { label: 'Inspect Prime Candidate', actionType: 'inspect_candidate', payload: 'VESSEL-9481923' },
      { label: 'Show Reconstructed Origin', actionType: 'show_origin' },
      { label: 'Examine Satellite Swath', actionType: 'satellite_swath' },
      { label: 'Run Shoreline Risk Assessment', actionType: 'forecast_risk' },
    ],
  },
];

export const usePoseidonStore = create<PoseidonState>((set, get) => ({
  incidents: MOCK_INCIDENTS,
  activeIncidentId: 'PSDN-2026-00142',
  activeMode: 'detection',
  selectedCandidateId: 'VESSEL-9481923',
  selectedForecastHorizon: 24,

  mapIntelligenceMode: 'operational',
  isReplayMode: false,
  notifications: INITIAL_NOTIFICATIONS,
  comparedIncidentIds: null,
  copilotOpen: false,
  copilotMessages: INITIAL_COPILOT_MESSAGES,

  leftPanelOpen: true,
  rightPanelOpen: true,
  systemStatusOpen: false,
  vesselDetailModalOpen: false,
  notificationDrawerOpen: false,

  // RBAC & User Session
  currentUser: MOCK_USERS[1], // Default: Dr. Ananya Sharma (Lead Analyst)
  users: MOCK_USERS,

  // Alerts Center
  alerts: INITIAL_OPERATIONAL_ALERTS,
  alertsCenterOpen: false,

  // Incident Assignment & Response Workflow
  assignments: INITIAL_ASSIGNMENTS,
  assignIncidentModalIncidentId: null,

  // Audit Trail & Admin Modal
  auditLogs: INITIAL_AUDIT_LOGS,
  alertRules: INITIAL_ALERT_RULES,
  adminModalOpen: false,

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
    isPlaying: false,
    currentStep: 1,
    sceneProgress: 0,
    speed: 1,
    elapsedSeconds: 0,
  },

  satelliteComparison: {
    mode: 'overlay',
    maskOpacity: 0.7,
  },

  mapFlyTarget: null,
  setActiveIncidentId: (id: string) => {
    if (get().activeIncidentId === id) return;
    const inc = get().incidents.find((i) => i.id === id);
    if (!inc) return;

    const firstCandidate = inc.candidates.length > 0 ? inc.candidates[0].id : null;

    // Notice: mapFlyTarget is deliberately NOT set here.
    // Selecting an incident updates the intelligence panels without forcing the map camera to jump.
    set({
      activeIncidentId: id,
      selectedCandidateId: firstCandidate,
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
  setNotificationDrawerOpen: (open: boolean) => set({ notificationDrawerOpen: open }),
  toggleNotificationDrawer: () => set((s) => ({ notificationDrawerOpen: !s.notificationDrawerOpen })),

  setBasemap: (basemap: BasemapStyle) => set({ basemap }),

  toggleLayer: (layer: keyof LayerVisibilityState) =>
    set((s) => ({
      layers: { ...s.layers, [layer]: !s.layers[layer] },
    })),

  setLayer: (layer: keyof LayerVisibilityState, value: boolean) =>
    set((s) => ({
      layers: { ...s.layers, [layer]: value },
    })),

  // Intelligence Modes & Replay
  setMapIntelligenceMode: (mode: MapIntelligenceMode) => {
    set((s) => {
      const updatedLayers = { ...s.layers };
      if (mode === 'operational') {
        updatedLayers.detected_slicks = true;
        updatedLayers.slick_boundaries = true;
        updatedLayers.vessel_positions = true;
        updatedLayers.forecast_trajectory = true;
      } else if (mode === 'analysis') {
        updatedLayers.origin_probability_region = true;
        updatedLayers.breadcrumb_trail = true;
        updatedLayers.source_candidates = true;
        updatedLayers.vessel_tracks = true;
      } else if (mode === 'satellite') {
        updatedLayers.satellite_footprint = true;
        updatedLayers.sar_detection_tiles = true;
        updatedLayers.sentinel1_sar = true;
      }
      return { mapIntelligenceMode: mode, layers: updatedLayers };
    });
  },

  toggleReplayMode: () => set((s) => ({ isReplayMode: !s.isReplayMode })),
  setIsReplayMode: (isReplayMode: boolean) => set({ isReplayMode }),

  // Notifications
  markNotificationRead: (id: string) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  // Comparison & Copilot
  setComparedIncidentIds: (comparedIncidentIds: [string, string] | null) =>
    set({ comparedIncidentIds }),

  setCopilotOpen: (copilotOpen: boolean) => set({ copilotOpen }),
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),

  executeCopilotAction: (actionType: string, payload?: any) => {
    if (actionType === 'inspect_candidate') {
      const candId = payload || 'VESSEL-9481923';
      set((s) => ({
        activeMode: 'attribution',
        selectedCandidateId: candId,
        layers: { ...s.layers, source_candidates: true, vessel_tracks: true },
      }));
    } else if (actionType === 'show_origin') {
      set((s) => ({
        activeMode: 'forecast',
        mapIntelligenceMode: 'analysis',
        layers: { ...s.layers, origin_probability_region: true, breadcrumb_trail: true },
      }));
    } else if (actionType === 'satellite_swath') {
      set((s) => ({
        mapIntelligenceMode: 'satellite',
        layers: { ...s.layers, satellite_footprint: true, sar_detection_tiles: true },
      }));
    } else if (actionType === 'forecast_risk') {
      set((s) => ({
        activeMode: 'forecast',
        selectedForecastHorizon: 48,
        layers: { ...s.layers, forecast_trajectory: true, forecast_uncertainty_cone: true },
      }));
    }
  },

  sendCopilotMessage: (text: string) => {
    const userMsg: CopilotMessage = {
      id: `copilot-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp:
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) +
        ' UTC',
    };

    const lower = text.toLowerCase();
    let replyText = 'Institutional analysis complete. ';
    let actions: { label: string; actionType: string; payload?: any }[] | undefined;

    if (
      lower.includes('vessel') ||
      lower.includes('candidate') ||
      lower.includes('ocean star') ||
      lower.includes('who') ||
      lower.includes('blame') ||
      lower.includes('attribution')
    ) {
      replyText =
        'Attribution analysis rates MV OCEAN STAR (IMO 9481923) at 87% confidence based on spatial intersection with reverse drift centroid (0.42 km error), speed reduction (14.1 → 8.2 kn), and an 18-minute AIS silence at 23:14 UTC.';
      actions = [
        { label: 'Highlight Candidate Track', actionType: 'inspect_candidate', payload: 'VESSEL-9481923' },
        { label: 'Examine Origin Region', actionType: 'show_origin' },
      ];
    } else if (
      lower.includes('origin') ||
      lower.includes('source') ||
      lower.includes('hindcast') ||
      lower.includes('where')
    ) {
      replyText =
        'Reverse drift trajectory calculated using HYCOM 0.72 kn surface currents and GFS 14.2 kn winds places the probable discharge point at 27.72° N, 90.62° W (±1.4 km, 82% confidence boundary) approximately 12.4 hours prior to SAR observation.';
      actions = [{ label: 'Focus Reconstructed Origin', actionType: 'show_origin' }];
    } else if (
      lower.includes('forecast') ||
      lower.includes('drift') ||
      lower.includes('shore') ||
      lower.includes('coast') ||
      lower.includes('where is it going')
    ) {
      replyText =
        'Forward Lagrangian trajectory predicts east-northeastward advection towards Chandeleur barrier islands at 0.78–0.90 kn. 48h horizon shows 28.4% shoreline impact probability with closest approach of 19 km.';
      actions = [{ label: 'View 48H Forecast Cone', actionType: 'forecast_risk' }];
    } else if (
      lower.includes('satellite') ||
      lower.includes('sar') ||
      lower.includes('sensor') ||
      lower.includes('sentinel')
    ) {
      replyText =
        'Sentinel-1A SAR C-band descending pass acquired at 2026-09-26 12:44 UTC. Normalized Radar Cross Section (NRCS) dampening is -24.8 dB vs -12.1 dB background sea clutter. Clean boundary mask IoU is 0.912.';
      actions = [{ label: 'View Satellite Swath', actionType: 'satellite_swath' }];
    } else {
      const activeInc = get().getActiveIncident();
      replyText = `Analysis of incident ${activeInc.id} indicates surface expression of ${activeInc.area_km2.toFixed(1)} km² with ${(activeInc.confidence * 100).toFixed(0)}% detection confidence. Operational and attribution models are synchronised.`;
      actions = [
        { label: 'Inspect Candidate', actionType: 'inspect_candidate' },
        { label: 'Show Origin Region', actionType: 'show_origin' },
      ];
    }

    const assistantMsg: CopilotMessage = {
      id: `copilot-a-${Date.now() + 1}`,
      sender: 'assistant',
      text: replyText,
      timestamp:
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) +
        ' UTC',
      suggestedActions: actions,
    };

    set((s) => ({
      copilotMessages: [...s.copilotMessages, userMsg, assistantMsg],
    }));
  },

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
    get().goToDemoStep(1);
    set((s) => ({
      demoInvestigation: {
        ...s.demoInvestigation,
        isActive: true,
        isPlaying: true,
        currentStep: 1,
        sceneProgress: 0,
        elapsedSeconds: 0,
      },
    }));
  },

  stopDemoInvestigation: () => {
    set((s) => ({
      demoInvestigation: {
        ...s.demoInvestigation,
        isActive: false,
        isPlaying: false,
      },
    }));
  },

  pauseDemoInvestigation: () => {
    set((s) => ({
      demoInvestigation: {
        ...s.demoInvestigation,
        isPlaying: false,
      },
    }));
  },

  resumeDemoInvestigation: () => {
    set((s) => ({
      demoInvestigation: {
        ...s.demoInvestigation,
        isPlaying: true,
      },
    }));
  },

  restartDemoInvestigation: () => {
    get().goToDemoStep(1);
    set((s) => ({
      demoInvestigation: {
        ...s.demoInvestigation,
        isActive: true,
        isPlaying: true,
        currentStep: 1,
        sceneProgress: 0,
        elapsedSeconds: 0,
      },
    }));
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

  setDemoSpeed: (speed: 0.5 | 1 | 1.5 | 2) => {
    set((s) => ({
      demoInvestigation: {
        ...s.demoInvestigation,
        speed,
      },
    }));
  },

  goToDemoStep: (stepNumber: number) => {
    const scene = DEMO_STEPS.find((s) => s.sceneIndex === stepNumber);
    if (!scene) return;

    const newLayers = { ...DEFAULT_LAYERS, ...scene.layers };

    set((s) => ({
      demoInvestigation: {
        ...s.demoInvestigation,
        isActive: true,
        currentStep: stepNumber,
        sceneProgress: 0,
        elapsedSeconds: 0,
      },
      activeIncidentId: 'PSDN-2026-00142',
      activeMode: scene.associatedMode,
      layers: newLayers,
      mapIntelligenceMode: scene.mapIntelligenceMode || s.mapIntelligenceMode,
      selectedForecastHorizon: scene.forecastHorizon || s.selectedForecastHorizon,
      selectedCandidateId: scene.candidateId !== undefined ? scene.candidateId : s.selectedCandidateId,
      satelliteComparison: scene.satelliteComparison
        ? { ...s.satelliteComparison, ...scene.satelliteComparison }
        : s.satelliteComparison,
      timeline: {
        ...s.timeline,
        currentTime: new Date(scene.timelineTime),
      },
      mapFlyTarget: {
        center: scene.camera.center,
        zoom: scene.camera.zoom,
        duration: scene.camera.duration || 1400,
      },
    }));
  },

  tickDemo: (deltaSeconds: number) => {
    const { demoInvestigation } = get();
    if (!demoInvestigation.isActive || !demoInvestigation.isPlaying) return;

    const currentScene =
      DEMO_STEPS.find((s) => s.sceneIndex === demoInvestigation.currentStep) || DEMO_STEPS[0];
    const duration = currentScene.durationSeconds / demoInvestigation.speed;
    const newElapsed = demoInvestigation.elapsedSeconds + deltaSeconds;
    const newProgress = Math.min(1, newElapsed / duration);

    // If in Scene 2 (Satellite Analysis), update satelliteComparison dynamically based on progress
    if (demoInvestigation.currentStep === 2) {
      if (newProgress < 0.25) {
        set({ satelliteComparison: { mode: 'before', maskOpacity: 0 } });
      } else if (newProgress < 0.5) {
        set({ satelliteComparison: { mode: 'after', maskOpacity: 0 } });
      } else if (newProgress < 0.75) {
        const maskOp = Math.min(0.9, (newProgress - 0.5) * 4 * 0.9);
        set({ satelliteComparison: { mode: 'mask', maskOpacity: maskOp } });
      } else {
        set({ satelliteComparison: { mode: 'overlay', maskOpacity: 0.85 } });
      }
    }

    // If in Scene 8 (Forecast), advance forecast horizon dynamically (6 -> 12 -> 24 -> 48)
    if (demoInvestigation.currentStep === 8) {
      if (newProgress < 0.25 && get().selectedForecastHorizon !== 6) {
        set({ selectedForecastHorizon: 6 });
      } else if (newProgress >= 0.25 && newProgress < 0.5 && get().selectedForecastHorizon !== 12) {
        set({ selectedForecastHorizon: 12 });
      } else if (newProgress >= 0.5 && newProgress < 0.75 && get().selectedForecastHorizon !== 24) {
        set({ selectedForecastHorizon: 24 });
      } else if (newProgress >= 0.75 && get().selectedForecastHorizon !== 48) {
        set({ selectedForecastHorizon: 48 });
      }
    }

    if (newProgress >= 1) {
      if (demoInvestigation.currentStep < DEMO_STEPS.length) {
        get().goToDemoStep(demoInvestigation.currentStep + 1);
      } else {
        set((s) => ({
          demoInvestigation: {
            ...s.demoInvestigation,
            isPlaying: false,
            sceneProgress: 1,
          },
        }));
      }
    } else {
      set((s) => ({
        demoInvestigation: {
          ...s.demoInvestigation,
          sceneProgress: newProgress,
          elapsedSeconds: newElapsed,
        },
      }));
    }
  },

  setSatelliteComparison: (partial) =>
    set((s) => ({
      satelliteComparison: { ...s.satelliteComparison, ...partial },
    })),

  flyToCoords: (coords: { lng: number; lat: number }, zoom: number = 9.8) => {
    set({
      mapFlyTarget: { center: [coords.lng, coords.lat], zoom, duration: 1600 },
    });
  },

  fitAllIncidents: () => {
    set({
      mapFlyTarget: {
        center: [15.0, 25.0],
        zoom: 2.5,
        duration: 1400,
      },
    });
  },

  resetView: () => {
    get().fitAllIncidents();
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

      // Public role access control: only show approved/verified incidents
      if (get().currentUser.role === 'public' && inc.confidence < 0.70) {
        return false;
      }

      return true;
    });
  },

  // RBAC & User Session
  setCurrentUser: (user: UserProfile) => {
    const prev = get().currentUser;
    set({ currentUser: user });
    get().addAuditLog({
      actor: {
        name: user.name,
        role: user.role,
        team: user.team,
      },
      action: 'Switched User Session',
      details: `Switched active persona from ${prev.name} (${prev.role}) to ${user.name} (${user.role}).`,
      previousValue: prev.role,
      newValue: user.role,
    });
  },

  // Alerts Center
  setAlertsCenterOpen: (open: boolean) => set({ alertsCenterOpen: open }),
  toggleAlertsCenter: () => set((state) => ({ alertsCenterOpen: !state.alertsCenterOpen })),

  acknowledgeAlert: (alertId: string, notes?: string) => {
    const { alerts, currentUser, addAuditLog } = get();
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    const now = new Date().toISOString();
    const updated = alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'Acknowledged' as const,
          acknowledgedAt: now,
          acknowledgedBy: currentUser.name,
          notes: notes ? `${a.notes ? a.notes + ' | ' : ''}${notes}` : a.notes,
          read: true,
        };
      }
      return a;
    });

    set({ alerts: updated });
    addAuditLog({
      actor: {
        name: currentUser.name,
        role: currentUser.role,
        team: currentUser.team,
      },
      action: 'Acknowledged Operational Alert',
      incidentId: alert.incidentId,
      details: `Acknowledged alert ${alert.id} (${alert.type}) for ${alert.incidentId}.${notes ? ' Note: ' + notes : ''}`,
      previousValue: `Status: ${alert.status}`,
      newValue: 'Status: Acknowledged',
    });
  },

  resolveAlert: (alertId: string, notes?: string) => {
    const { alerts, currentUser, addAuditLog } = get();
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    const now = new Date().toISOString();
    const updated = alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'Resolved' as const,
          resolvedAt: now,
          resolvedBy: currentUser.name,
          notes: notes ? `${a.notes ? a.notes + ' | ' : ''}${notes}` : a.notes,
          read: true,
        };
      }
      return a;
    });

    set({ alerts: updated });
    addAuditLog({
      actor: {
        name: currentUser.name,
        role: currentUser.role,
        team: currentUser.team,
      },
      action: 'Resolved Operational Alert',
      incidentId: alert.incidentId,
      details: `Resolved alert ${alert.id} (${alert.type}) for ${alert.incidentId}.${notes ? ' Note: ' + notes : ''}`,
      previousValue: `Status: ${alert.status}`,
      newValue: 'Status: Resolved',
    });
  },

  assignAlert: (alertId: string, team: string, user?: string) => {
    const { alerts, currentUser, addAuditLog } = get();
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    const updated = alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          assignedTeam: team,
          assignedUser: user || a.assignedUser,
          read: true,
        };
      }
      return a;
    });

    set({ alerts: updated });
    addAuditLog({
      actor: {
        name: currentUser.name,
        role: currentUser.role,
        team: currentUser.team,
      },
      action: 'Reassigned Alert Team',
      incidentId: alert.incidentId,
      details: `Reassigned alert ${alert.id} to ${team}${user ? ' (' + user + ')' : ''}.`,
      previousValue: `Assigned: ${alert.assignedTeam}`,
      newValue: `Assigned: ${team}`,
    });
  },

  markAlertRead: (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, read: true } : a)),
    }));
  },

  markAllAlertsRead: () => {
    set((state) => ({
      alerts: state.alerts.map((a) => ({ ...a, read: true })),
    }));
  },

  // Incident Assignment & Response Workflow
  setAssignIncidentModalIncidentId: (id: string | null) => set({ assignIncidentModalIncidentId: id }),

  assignIncident: (
    incidentId: string,
    team: string,
    responder: string,
    escalationLevel = 'ADVISORY' as const,
    note?: string
  ) => {
    const { assignments, currentUser, addAuditLog } = get();
    const now = new Date().toISOString();
    const existing = assignments[incidentId];

    const updatedAssignment: IncidentAssignment = {
      incidentId,
      assignedTeam: team,
      assignedResponder: responder,
      assignedBy: currentUser.name,
      assignedAt: now,
      escalationLevel,
      workflowStage: existing ? existing.workflowStage : 'Assigned',
      acknowledgedAt: existing?.acknowledgedAt,
      acknowledgedBy: existing?.acknowledgedBy,
      responseNotes: existing ? [...existing.responseNotes] : [],
    };

    if (note) {
      updatedAssignment.responseNotes.push({
        id: `note-${Date.now()}`,
        author: currentUser.name,
        role: currentUser.role,
        timestamp: now,
        content: note,
      });
    }

    set({
      assignments: {
        ...assignments,
        [incidentId]: updatedAssignment,
      },
    });

    addAuditLog({
      actor: {
        name: currentUser.name,
        role: currentUser.role,
        team: currentUser.team,
      },
      action: 'Assigned Incident Response',
      incidentId,
      details: `Assigned jurisdiction to ${team} (${responder}) with ${escalationLevel} protocol.`,
      newValue: `${team} / ${responder}`,
    });
  },

  addIncidentResponseNote: (incidentId: string, note: string) => {
    const { assignments, currentUser, addAuditLog } = get();
    const now = new Date().toISOString();
    const existing = assignments[incidentId] || {
      incidentId,
      assignedTeam: currentUser.team,
      assignedResponder: currentUser.name,
      assignedBy: currentUser.name,
      assignedAt: now,
      escalationLevel: 'ADVISORY' as const,
      workflowStage: 'Investigating' as const,
      responseNotes: [],
    };

    const newNote = {
      id: `note-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      timestamp: now,
      content: note,
    };

    set({
      assignments: {
        ...assignments,
        [incidentId]: {
          ...existing,
          responseNotes: [newNote, ...existing.responseNotes],
        },
      },
    });

    addAuditLog({
      actor: {
        name: currentUser.name,
        role: currentUser.role,
        team: currentUser.team,
      },
      action: 'Logged Response Observation',
      incidentId,
      details: `Logged note: "${note.length > 60 ? note.slice(0, 57) + '...' : note}"`,
    });
  },

  updateIncidentWorkflowStage: (incidentId: string, stage: ResponseWorkflowStage) => {
    const { assignments, currentUser, addAuditLog } = get();
    const now = new Date().toISOString();
    const existing = assignments[incidentId] || {
      incidentId,
      assignedTeam: currentUser.team,
      assignedResponder: currentUser.name,
      assignedBy: currentUser.name,
      assignedAt: now,
      escalationLevel: 'ADVISORY' as const,
      workflowStage: stage,
      responseNotes: [],
    };

    const prevStage = existing.workflowStage;
    set({
      assignments: {
        ...assignments,
        [incidentId]: {
          ...existing,
          workflowStage: stage,
          acknowledgedAt: stage === 'Acknowledged' ? now : existing.acknowledgedAt,
          acknowledgedBy: stage === 'Acknowledged' ? currentUser.name : existing.acknowledgedBy,
          resolvedAt: stage === 'Resolved' ? now : existing.resolvedAt,
          resolvedBy: stage === 'Resolved' ? currentUser.name : existing.resolvedBy,
        },
      },
    });

    addAuditLog({
      actor: {
        name: currentUser.name,
        role: currentUser.role,
        team: currentUser.team,
      },
      action: 'Updated Workflow Stage',
      incidentId,
      details: `Advanced response workflow from ${prevStage} to ${stage}.`,
      previousValue: prevStage,
      newValue: stage,
    });
  },

  // Audit Trail & Admin Modal
  addAuditLog: (entry) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    set((state) => ({
      auditLogs: [newEntry, ...state.auditLogs.slice(0, 99)],
    }));
  },

  toggleAlertRule: (ruleId: string) => {
    const { currentUser, addAuditLog, alertRules } = get();
    const rule = alertRules.find((r) => r.id === ruleId);
    if (!rule) return;

    const newStatus = !rule.enabled;
    set({
      alertRules: alertRules.map((r) => (r.id === ruleId ? { ...r, enabled: newStatus } : r)),
    });

    addAuditLog({
      actor: {
        name: currentUser.name,
        role: currentUser.role,
        team: currentUser.team,
      },
      action: 'Modified Alert Rule',
      details: `${newStatus ? 'Enabled' : 'Disabled'} automated alert rule "${rule.name}".`,
      previousValue: `Enabled: ${rule.enabled}`,
      newValue: `Enabled: ${newStatus}`,
    });
  },

  setAdminModalOpen: (open: boolean) => set({ adminModalOpen: open }),
}));
