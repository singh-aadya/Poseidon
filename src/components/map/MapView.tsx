import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { BasemapStyle } from '../../types';
import { VectorFlowCanvas } from './VectorFlowCanvas';
import { MapControls } from './MapControls';
import { MapIntelligenceBar } from './MapIntelligenceBar';
import { MapLegend } from './MapLegend';

// Fix MapLibre GL Web Worker loading in Vite production builds
maplibregl.config.WORKER_URL = '/maplibre-gl-worker.mjs';

function createOriginEllipse(
  centerLng: number,
  centerLat: number,
  radiusLngKm: number = 3.2,
  radiusLatKm: number = 1.8,
  angleDeg: number = 40
): [number, number][] {
  const points: [number, number][] = [];
  const rad = (angleDeg * Math.PI) / 180;
  const cosAngle = Math.cos(rad);
  const sinAngle = Math.sin(rad);
  const kmPerDegLat = 110.85;
  const kmPerDegLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);
  const rx = radiusLngKm / kmPerDegLng;
  const ry = radiusLatKm / kmPerDegLat;

  for (let i = 0; i <= 36; i++) {
    const theta = (i * 2 * Math.PI) / 36;
    const dx = rx * Math.cos(theta);
    const dy = ry * Math.sin(theta);
    const rotX = dx * cosAngle - dy * sinAngle;
    const rotY = dx * sinAngle + dy * cosAngle;
    points.push([centerLng + rotX, centerLat + rotY]);
  }
  return points;
}

function createSatelliteSwath(centerLng: number, centerLat: number): [number, number][] {
  const dLng = 0.65;
  const dLat = 0.48;
  return [
    [centerLng - dLng - 0.1, centerLat + dLat],
    [centerLng + dLng - 0.05, centerLat + dLat + 0.15],
    [centerLng + dLng + 0.1, centerLat - dLat],
    [centerLng - dLng + 0.05, centerLat - dLat - 0.15],
    [centerLng - dLng - 0.1, centerLat + dLat],
  ];
}

const BACKGROUND_AIS_VESSELS: [number, number, string][] = [
  [-90.82, 28.15, 'BULK CARRIER PACIFIC'],
  [-90.15, 28.25, 'TUG NAVIGATOR'],
  [-89.95, 27.65, 'CREW VESSEL EXPRESS'],
  [-90.75, 27.45, 'CONTAINERSHIP MSC LAURA'],
  [-91.05, 27.95, 'OFFSHORE SUPPLY DEFENDER'],
  [-89.75, 28.05, 'CHEMICAL TANKER STOLT'],
  [-90.55, 28.32, 'FISHING VESSEL BLUEFIN'],
  [-90.25, 27.48, 'BARGE TOW BIG HORSE'],
  [-89.85, 27.82, 'RESEARCH SURVEY FALOR'],
  [-91.12, 27.62, 'GENERAL CARGO ARCTIC'],
  [-90.35, 28.42, 'PILOT BOAT BRAVO'],
  [-90.95, 28.02, 'SUPPLY VESSEL EDISON'],
  [-89.65, 27.52, 'TANKER EAGLE BRASILIA'],
  [-90.68, 27.35, 'TUG MISSISSIPPI TRADER'],
  [-89.9, 28.38, 'CREW TENDER GULF DISCOVERY'],
];

// High-reliability public, open-access maritime and GIS basemaps (NOAA, GEBCO, Esri, OSM)
// Zero API key required, zero watermarks, zero rate limit blocks.
const MAP_STYLES: Record<BasemapStyle, any> = {
  // 1. Maritime Oceanographic Basemap: GEBCO bathymetry, ocean depths, muted blue/gray water, NOAA contours
  'oceanographic': {
    version: 8,
    sources: {
      'esri-ocean-base': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri, GEBCO, NOAA, National Geographic',
      },
      'esri-ocean-ref': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri, GEBCO, NOAA',
      },
    },
    layers: [
      {
        id: 'esri-ocean-base-layer',
        type: 'raster',
        source: 'esri-ocean-base',
        minzoom: 0,
        maxzoom: 16,
      },
      {
        id: 'esri-ocean-ref-layer',
        type: 'raster',
        source: 'esri-ocean-ref',
        minzoom: 0,
        maxzoom: 16,
      },
    ],
  },

  // 2. Government Light Cartographic GIS Basemap: Neutral gray land, crisp boundaries, subtle water
  'light-gis': {
    version: 8,
    sources: {
      'esri-gray-base': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
      },
      'esri-gray-ref': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri',
      },
    },
    layers: [
      {
        id: 'esri-gray-base-layer',
        type: 'raster',
        source: 'esri-gray-base',
        minzoom: 0,
        maxzoom: 16,
      },
      {
        id: 'esri-gray-ref-layer',
        type: 'raster',
        source: 'esri-gray-ref',
        minzoom: 0,
        maxzoom: 16,
      },
    ],
  },

  // 3. Satellite True-Color Orbital Imagery
  'satellite': {
    version: 8,
    sources: {
      'esri-imagery': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
      },
      'esri-boundaries': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri',
      },
    },
    layers: [
      {
        id: 'esri-imagery-layer',
        type: 'raster',
        source: 'esri-imagery',
        minzoom: 0,
        maxzoom: 19,
      },
      {
        id: 'esri-boundaries-layer',
        type: 'raster',
        source: 'esri-boundaries',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },

  // 4. Dark Oceanographic / High-Contrast SAR Analysis Mode
  'dark-matter': {
    version: 8,
    sources: {
      'esri-dark-base': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
      },
      'esri-dark-ref': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri',
      },
    },
    layers: [
      {
        id: 'esri-dark-base-layer',
        type: 'raster',
        source: 'esri-dark-base',
        minzoom: 0,
        maxzoom: 16,
      },
      {
        id: 'esri-dark-ref-layer',
        type: 'raster',
        source: 'esri-dark-ref',
        minzoom: 0,
        maxzoom: 16,
      },
    ],
  },
};

function parseInitialHash(): { center: [number, number]; zoom: number; incidentId: string | null } {
  try {
    const hash = window.location.hash;
    const coordMatch = hash.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z/);
    const incidentMatch = hash.match(/incident=([A-Za-z0-9_-]+)/);

    let center: [number, number] = [15.0, 25.0];
    let zoom = 2.5;

    if (coordMatch) {
      const lng = parseFloat(coordMatch[1]);
      const lat = parseFloat(coordMatch[2]);
      const z = parseFloat(coordMatch[3]);
      if (!isNaN(lng) && !isNaN(lat) && !isNaN(z) && Math.abs(lat) <= 85) {
        center = [lng, lat];
        zoom = Math.min(Math.max(z, 1.5), 18);
      }
    }

    const incidentId = incidentMatch ? incidentMatch[1] : null;

    return { center, zoom, incidentId };
  } catch {
    return { center: [15.0, 25.0], zoom: 2.5, incidentId: null };
  }
}

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  const activeMarkersRef = useRef<maplibregl.Marker[]>([]);

  const {
    incidents,
    activeIncidentId,
    setActiveIncidentId,
    selectedCandidateId,
    setSelectedCandidateId,
    selectedForecastHorizon,
    basemap,
    layers,
    mapFlyTarget,
    clearMapFlyTarget,
    getActiveIncident,
  } = usePoseidonStore();

  const prevBasemapRef = useRef(basemap);
  const activeIncident = getActiveIncident();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initial = parseInitialHash();

    // If an incident ID is specified in URL hash, sync store on load
    if (initial.incidentId) {
      const store = usePoseidonStore.getState();
      if (store.incidents.some((i) => i.id === initial.incidentId)) {
        store.setActiveIncidentId(initial.incidentId);
      }
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[basemap] || MAP_STYLES['oceanographic'],
      center: initial.center,
      zoom: initial.zoom,
      minZoom: 1.5,
      maxZoom: 18,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      interactive: true,
      cooperativeGestures: false,
      scrollZoom: true,
      boxZoom: true,
      dragRotate: true,
      dragPan: true,
      keyboard: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
      touchPitch: true,
      renderWorldCopies: true,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      mapRef.current = map;
      (window as any).__map = map;
      (window as any).__poseidonStore = usePoseidonStore;
      setMapInstance(map);
      setMapLoaded(true);

      // Ensure all standard interactions are enabled
      map.scrollZoom.enable();
      map.dragPan.enable();
      map.doubleClickZoom.enable();
      map.touchZoomRotate.enable();
      map.keyboard.enable();
      map.boxZoom.enable();

      // Configure smooth zooming rate for mouse wheel & trackpad
      map.scrollZoom.setWheelZoomRate(1 / 300);
      map.scrollZoom.setZoomRate(1 / 100);

      // Update URL hash on camera move WITHOUT triggering hashchange event
      const updateUrlHash = () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const currentActiveId = usePoseidonStore.getState().activeIncidentId;
        const newHash = `#/map/@${center.lng.toFixed(2)},${center.lat.toFixed(2)},${zoom.toFixed(1)}z;incident=${currentActiveId}`;
        window.history.replaceState(null, '', window.location.pathname + newHash);
      };

      map.on('moveend', updateUrlHash);
      updateUrlHash();

      map.resize();
    });

    return () => {
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
  }, []);

  // Handle Basemap Switch
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    if (prevBasemapRef.current === basemap) return;
    prevBasemapRef.current = basemap;

    map.setStyle(MAP_STYLES[basemap] || MAP_STYLES['oceanographic']);
    map.once('style.load', () => {
      setupMapLayers(map);
    });
  }, [basemap, mapLoaded]);

  // Setup / Update Map Layers & GeoJSON sources
  const setupMapLayers = useCallback(
    (map: MapLibreMap) => {
      // 1. Slicks Source & Layers
      const slickFeatures = incidents.map((inc) => ({
        type: 'Feature' as const,
        id: inc.id,
        properties: {
          id: inc.id,
          name: inc.name,
          confidence: inc.confidence,
          severity: inc.severity,
          area_km2: inc.area_km2,
          estimated_age_mean: inc.estimated_age_mean,
          isActive: inc.id === activeIncidentId,
        },
        geometry: inc.polygon,
      }));

      const slicksGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: slickFeatures,
      };

      if (!map.getSource('slicks-source')) {
        map.addSource('slicks-source', {
          type: 'geojson',
          data: slicksGeoJSON,
        });

        // Fill layer: Semi-transparent orange/red slick polygon
        map.addLayer({
          id: 'slicks-fill',
          type: 'fill',
          source: 'slicks-source',
          paint: {
            'fill-color': [
              'case',
              ['get', 'isActive'],
              '#DC2626', // Active slick: High visibility semi-transparent red/orange
              ['==', ['get', 'severity'], 'HIGH'],
              '#B42318',
              ['==', ['get', 'severity'], 'MEDIUM'],
              '#C47A00',
              '#D97706',
            ],
            'fill-opacity': [
              'case',
              ['get', 'isActive'],
              0.5,
              0.25,
            ],
          },
        });

        // Boundary layer: Crisp thin red/orange boundary
        map.addLayer({
          id: 'slicks-outline',
          type: 'line',
          source: 'slicks-source',
          paint: {
            'line-color': [
              'case',
              ['get', 'isActive'],
              '#991B1B', // Selected: Thin crisp deep red boundary
              ['==', ['get', 'severity'], 'HIGH'],
              '#B42318',
              ['==', ['get', 'severity'], 'MEDIUM'],
              '#C47A00',
              '#D97706',
            ],
            'line-width': ['case', ['get', 'isActive'], 2.5, 1.4],
          },
        });

        // Interactive click on slick
        map.on('click', 'slicks-fill', (e) => {
          if (e.features && e.features[0]) {
            const incId = e.features[0].properties?.id;
            if (incId) {
              setActiveIncidentId(incId);
            }
          }
        });

        map.on('mouseenter', 'slicks-fill', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'slicks-fill', () => {
          map.getCanvas().style.cursor = '';
        });
      } else {
        const src = map.getSource('slicks-source') as GeoJSONSource;
        src.setData(slicksGeoJSON);
      }

      // 2. Forecast Cone Source (Active Incident)
      const currentForecast = activeIncident.forecasts[selectedForecastHorizon];
      const forecastConeGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: currentForecast
          ? [
              {
                type: 'Feature',
                properties: {
                  horizon: currentForecast.horizon_hours,
                  risk: currentForecast.shoreline_impact_risk,
                },
                geometry: {
                  type: 'Polygon',
                  coordinates: [currentForecast.coordinates],
                },
              },
            ]
          : [],
      };

      if (!map.getSource('forecast-cone-source')) {
        map.addSource('forecast-cone-source', {
          type: 'geojson',
          data: forecastConeGeoJSON,
        });

        map.addLayer({
          id: 'forecast-cone-fill',
          type: 'fill',
          source: 'forecast-cone-source',
          paint: {
            'fill-color': '#7C3AED',
            'fill-opacity': 0.15,
          },
        });

        map.addLayer({
          id: 'forecast-cone-outline',
          type: 'line',
          source: 'forecast-cone-source',
          paint: {
            'line-color': '#6D28D9',
            'line-width': 1.2,
            'line-dasharray': [3, 2],
          },
        });
      } else {
        const src = map.getSource('forecast-cone-source') as GeoJSONSource;
        src.setData(forecastConeGeoJSON);
      }

      // 3. Forecast Trajectory Central Line
      const trajFeatures: GeoJSON.Feature[] = [];
      const horizons: (6 | 12 | 24 | 48)[] = [6, 12, 24, 48];
      const trajPoints: [number, number][] = [
        [activeIncident.coordinates.lng, activeIncident.coordinates.lat],
        ...horizons.map(
          (h) =>
            [
              activeIncident.forecasts[h].predicted_center.lng,
              activeIncident.forecasts[h].predicted_center.lat,
            ] as [number, number]
        ),
      ];

      trajFeatures.push({
        type: 'Feature',
        properties: { type: 'forecast-line' },
        geometry: {
          type: 'LineString',
          coordinates: trajPoints,
        },
      });

      horizons.forEach((h) => {
        trajFeatures.push({
          type: 'Feature',
          properties: {
            label: `+${h}h`,
            horizon: h,
            type: 'forecast-milestone',
          },
          geometry: {
            type: 'Point',
            coordinates: [
              activeIncident.forecasts[h].predicted_center.lng,
              activeIncident.forecasts[h].predicted_center.lat,
            ],
          },
        });
      });

      const forecastTrajGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: trajFeatures,
      };

      if (!map.getSource('forecast-traj-source')) {
        map.addSource('forecast-traj-source', {
          type: 'geojson',
          data: forecastTrajGeoJSON,
        });

        map.addLayer({
          id: 'forecast-traj-line',
          type: 'line',
          source: 'forecast-traj-source',
          filter: ['==', ['get', 'type'], 'forecast-line'],
          paint: {
            'line-color': '#1769AA',
            'line-width': 2.0,
            'line-dasharray': [3, 2],
          },
        });

        map.addLayer({
          id: 'forecast-traj-points',
          type: 'circle',
          source: 'forecast-traj-source',
          filter: ['==', ['get', 'type'], 'forecast-milestone'],
          paint: {
            'circle-color': '#FFFFFF',
            'circle-stroke-color': '#1769AA',
            'circle-stroke-width': 2,
            'circle-radius': 4.5,
          },
        });
      } else {
        const src = map.getSource('forecast-traj-source') as GeoJSONSource;
        src.setData(forecastTrajGeoJSON);
      }

      // 4. Breadcrumb Hindcast Reverse Trail
      const breadcrumbCoords = activeIncident.breadcrumbs.map(
        (b) => [b.lng, b.lat] as [number, number]
      );
      const breadcrumbsGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { type: 'trail' },
            geometry: {
              type: 'LineString',
              coordinates: breadcrumbCoords,
            },
          },
          ...activeIncident.breadcrumbs.map((b) => ({
            type: 'Feature' as const,
            properties: {
              label: b.label,
              confidence: b.confidence,
              offset: b.time_offset_hours,
            },
            geometry: {
              type: 'Point' as const,
              coordinates: [b.lng, b.lat] as [number, number],
            },
          })),
        ],
      };

      if (!map.getSource('breadcrumbs-source')) {
        map.addSource('breadcrumbs-source', {
          type: 'geojson',
          data: breadcrumbsGeoJSON,
        });

        map.addLayer({
          id: 'breadcrumbs-line',
          type: 'line',
          source: 'breadcrumbs-source',
          filter: ['==', ['get', 'type'], 'trail'],
          paint: {
            'line-color': '#C47A00',
            'line-width': 1.6,
            'line-dasharray': [2, 2],
          },
        });

        map.addLayer({
          id: 'breadcrumbs-dots',
          type: 'circle',
          source: 'breadcrumbs-source',
          filter: ['!=', ['get', 'type'], 'trail'],
          paint: {
            'circle-color': '#FFFFFF',
            'circle-stroke-color': '#C47A00',
            'circle-stroke-width': 1.5,
            'circle-radius': 4.0,
          },
        });
      } else {
        const src = map.getSource('breadcrumbs-source') as GeoJSONSource;
        src.setData(breadcrumbsGeoJSON);
      }

      // 5. AIS Candidate Tracks
      const trackFeatures: GeoJSON.Feature[] = [];

      activeIncident.candidates.forEach((cand) => {
        const isSelected = cand.id === selectedCandidateId;

        const normalCoords = cand.historical_track.map((pt) => [pt.lng, pt.lat] as [number, number]);
        trackFeatures.push({
          type: 'Feature',
          properties: {
            vesselId: cand.id,
            vesselName: cand.vessel_name,
            isSelected,
            isSpillWindow: false,
          },
          geometry: {
            type: 'LineString',
            coordinates: normalCoords,
          },
        });

        const spillWindowCoords = cand.historical_track
          .filter((pt) => pt.is_in_spill_window)
          .map((pt) => [pt.lng, pt.lat] as [number, number]);

        if (spillWindowCoords.length >= 2) {
          trackFeatures.push({
            type: 'Feature',
            properties: {
              vesselId: cand.id,
              vesselName: cand.vessel_name,
              isSelected,
              isSpillWindow: true,
            },
            geometry: {
              type: 'LineString',
              coordinates: spillWindowCoords,
            },
          });
        }
      });

      const aisTracksGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: trackFeatures,
      };

      if (!map.getSource('ais-tracks-source')) {
        map.addSource('ais-tracks-source', {
          type: 'geojson',
          data: aisTracksGeoJSON,
        });

        map.addLayer({
          id: 'ais-tracks-normal',
          type: 'line',
          source: 'ais-tracks-source',
          filter: ['!', ['get', 'isSpillWindow']],
          paint: {
            'line-color': [
              'case',
              ['get', 'isSelected'],
              '#0284C7', // Selected candidate: crisp high-contrast blue
              '#94A3B8', // Non-selected: subdued slate
            ],
            'line-width': ['case', ['get', 'isSelected'], 3.0, 1.2],
            'line-opacity': ['case', ['get', 'isSelected'], 1.0, 0.35],
          },
        });

        map.addLayer({
          id: 'ais-tracks-spill-window',
          type: 'line',
          source: 'ais-tracks-source',
          filter: ['get', 'isSpillWindow'],
          paint: {
            'line-color': [
              'case',
              ['get', 'isSelected'],
              '#DC2626', // Highlighted spill window segment
              '#F87171',
            ],
            'line-width': ['case', ['get', 'isSelected'], 3.6, 1.6],
            'line-dasharray': [3, 2],
            'line-opacity': ['case', ['get', 'isSelected'], 1.0, 0.4],
          },
        });
      } else {
        const src = map.getSource('ais-tracks-source') as GeoJSONSource;
        src.setData(aisTracksGeoJSON);
      }

      // 6. Origin Probability Region (Lagrangian Hindcast Dispersion Ellipse)
      const oldestBreadcrumb =
        activeIncident.breadcrumbs.length > 0
          ? activeIncident.breadcrumbs[activeIncident.breadcrumbs.length - 1]
          : { lng: activeIncident.coordinates.lng - 0.17, lat: activeIncident.coordinates.lat - 0.13 };

      const originEllipseCoords = createOriginEllipse(oldestBreadcrumb.lng, oldestBreadcrumb.lat, 3.2, 1.8, 40);

      const originGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              label: 'Origin Probability Region (82% Conf)',
              confidence: 0.82,
            },
            geometry: {
              type: 'Polygon',
              coordinates: [originEllipseCoords],
            },
          },
        ],
      };

      if (!map.getSource('origin-region-source')) {
        map.addSource('origin-region-source', {
          type: 'geojson',
          data: originGeoJSON,
        });

        map.addLayer({
          id: 'origin-region-fill',
          type: 'fill',
          source: 'origin-region-source',
          paint: {
            'fill-color': '#F59E0B',
            'fill-opacity': 0.22,
          },
        });

        map.addLayer({
          id: 'origin-region-outline',
          type: 'line',
          source: 'origin-region-source',
          paint: {
            'line-color': '#D97706',
            'line-width': 1.8,
            'line-dasharray': [4, 2],
          },
        });
      } else {
        const src = map.getSource('origin-region-source') as GeoJSONSource;
        src.setData(originGeoJSON);
      }

      // 7. Satellite Swath Footprint Boundary (Sentinel-1 SAR)
      const swathCoords = createSatelliteSwath(activeIncident.coordinates.lng, activeIncident.coordinates.lat);
      const swathGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              sensor: 'Sentinel-1A C-SAR',
              mode: 'IW GRDH',
            },
            geometry: {
              type: 'Polygon',
              coordinates: [swathCoords],
            },
          },
        ],
      };

      if (!map.getSource('satellite-footprint-source')) {
        map.addSource('satellite-footprint-source', {
          type: 'geojson',
          data: swathGeoJSON,
        });

        map.addLayer({
          id: 'satellite-footprint-fill',
          type: 'fill',
          source: 'satellite-footprint-source',
          paint: {
            'fill-color': '#0284C7',
            'fill-opacity': 0.06,
          },
        });

        map.addLayer({
          id: 'satellite-footprint-outline',
          type: 'line',
          source: 'satellite-footprint-source',
          paint: {
            'line-color': '#0284C7',
            'line-width': 1.5,
            'line-dasharray': [4, 4],
          },
        });
      } else {
        const src = map.getSource('satellite-footprint-source') as GeoJSONSource;
        src.setData(swathGeoJSON);
      }

      // 8. Background AIS Corridor Traffic (Subdued Context Dots)
      const backgroundTrafficFeatures: GeoJSON.Feature[] = BACKGROUND_AIS_VESSELS.map(([lng, lat, name]) => ({
        type: 'Feature',
        properties: { name },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      }));

      const backgroundAisGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: backgroundTrafficFeatures,
      };

      if (!map.getSource('all-ais-source')) {
        map.addSource('all-ais-source', {
          type: 'geojson',
          data: backgroundAisGeoJSON,
        });

        map.addLayer({
          id: 'all-ais-dots',
          type: 'circle',
          source: 'all-ais-source',
          paint: {
            'circle-color': '#64748B',
            'circle-radius': 2.8,
            'circle-opacity': 0.4,
            'circle-stroke-width': 0.5,
            'circle-stroke-color': '#FFFFFF',
          },
        });
      } else {
        const src = map.getSource('all-ais-source') as GeoJSONSource;
        src.setData(backgroundAisGeoJSON);
      }

      // 9. All Incident Centroids (Permanently visible on Common Global Map at all zoom levels)
      const incidentPointsGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: incidents.map((inc) => ({
          type: 'Feature' as const,
          id: inc.id,
          properties: {
            id: inc.id,
            name: inc.name,
            severity: inc.severity,
            confidence: inc.confidence,
            area_km2: inc.area_km2,
            isActive: inc.id === activeIncidentId,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [inc.coordinates.lng, inc.coordinates.lat] as [number, number],
          },
        })),
      };

      if (!map.getSource('incident-centroids-source')) {
        map.addSource('incident-centroids-source', {
          type: 'geojson',
          data: incidentPointsGeoJSON,
        });

        // Outer halo / glow ring
        map.addLayer({
          id: 'incident-centroids-halo',
          type: 'circle',
          source: 'incident-centroids-source',
          paint: {
            'circle-color': [
              'case',
              ['==', ['get', 'severity'], 'HIGH'],
              '#DC2626',
              ['==', ['get', 'severity'], 'MEDIUM'],
              '#D97706',
              '#16A34A',
            ],
            'circle-radius': ['case', ['get', 'isActive'], 14, 8],
            'circle-opacity': ['case', ['get', 'isActive'], 0.45, 0.25],
            'circle-stroke-width': ['case', ['get', 'isActive'], 2, 1],
            'circle-stroke-color': ['case', ['get', 'isActive'], '#17324D', '#FFFFFF'],
          },
        });

        // Inner solid core with crisp white border
        map.addLayer({
          id: 'incident-centroids-core',
          type: 'circle',
          source: 'incident-centroids-source',
          paint: {
            'circle-color': [
              'case',
              ['==', ['get', 'severity'], 'HIGH'],
              '#B42318',
              ['==', ['get', 'severity'], 'MEDIUM'],
              '#C47A00',
              '#15803D',
            ],
            'circle-radius': ['case', ['get', 'isActive'], 6, 4.5],
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#FFFFFF',
          },
        });

        map.on('click', 'incident-centroids-core', (e) => {
          if (e.features && e.features[0]) {
            const incId = e.features[0].properties?.id;
            if (incId) {
              setActiveIncidentId(incId);
            }
          }
        });
        map.on('mouseenter', 'incident-centroids-core', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'incident-centroids-core', () => {
          map.getCanvas().style.cursor = '';
        });
      } else {
        const src = map.getSource('incident-centroids-source') as GeoJSONSource;
        src.setData(incidentPointsGeoJSON);
      }
    },
    [incidents, activeIncidentId, activeIncident, selectedCandidateId, selectedForecastHorizon]
  );

  // Sync layers with store state
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    setupMapLayers(map);

    const toggle = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    };

    toggle('slicks-fill', layers.detected_slicks);
    toggle('slicks-outline', layers.slick_boundaries);
    toggle('forecast-cone-fill', layers.forecast_uncertainty_cone);
    toggle('forecast-cone-outline', layers.forecast_uncertainty_cone);
    toggle('forecast-traj-line', layers.forecast_trajectory);
    toggle('forecast-traj-points', layers.forecast_trajectory);
    toggle('breadcrumbs-line', layers.breadcrumb_trail);
    toggle('breadcrumbs-dots', layers.breadcrumb_trail);
    toggle('ais-tracks-normal', layers.vessel_tracks);
    toggle('ais-tracks-spill-window', layers.vessel_tracks);
    toggle('origin-region-fill', layers.origin_probability_region);
    toggle('origin-region-outline', layers.origin_probability_region);
    toggle('satellite-footprint-fill', layers.satellite_footprint);
    toggle('satellite-footprint-outline', layers.satellite_footprint);
    toggle('all-ais-dots', layers.all_ais_traffic);
  }, [mapLoaded, setupMapLayers, layers]);

  // Render Custom HTML Markers for Incident Labels & Vessels (Government GIS Style)
  const updateIncidentMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    activeMarkersRef.current.forEach((m) => m.remove());
    activeMarkersRef.current = [];

    // 1. Individual Incident GIS Badges (All incidents visible on Common Map)
    if (layers.slick_confidence_badges) {
      incidents.forEach((inc) => {
        const isSelected = inc.id === activeIncidentId;
        const confPercent = Math.round(inc.confidence * 100);
        const dotColor =
          inc.severity === 'HIGH' ? '#B42318' : inc.severity === 'MEDIUM' ? '#C47A00' : '#16A34A';

        const el = document.createElement('div');
        el.className = 'cursor-pointer select-none';

        el.innerHTML = `
          <div class="px-2 py-0.5 rounded border ${
            isSelected
              ? 'bg-[#17324D] border-[#17324D] text-white font-bold shadow-md ring-2 ring-[#0284C7]'
              : 'bg-white/95 border-[#D1D5DB] text-gray-800 shadow-2xs hover:border-gray-400'
          } text-[10px] font-sans transition">
            <div class="flex items-center gap-1.5">
              <span class="inline-block h-2 w-2 rounded-full shrink-0" style="background-color: ${dotColor}"></span>
              <span class="font-mono font-bold">${inc.id}</span>
            </div>
            <div class="text-[9px] ${
              isSelected ? 'text-blue-200' : 'text-gray-500'
            } font-mono pl-3.5 leading-tight">${confPercent}% conf · ${inc.area_km2.toFixed(1)} km²</div>
          </div>
        `;

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        el.addEventListener('pointerdown', (e) => {
          startX = e.clientX;
          startY = e.clientY;
          isDragging = false;
        });

        el.addEventListener('pointermove', (e) => {
          if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) {
            isDragging = true;
          }
        });

        el.addEventListener('click', (e) => {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          e.stopPropagation();
          // Select incident ONLY — never force the camera to jump on click
          setActiveIncidentId(inc.id);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([inc.coordinates.lng, inc.coordinates.lat])
          .addTo(map);

        activeMarkersRef.current.push(marker);
      });
    }

    // 2. Candidate Vessel Directional Markers
    if (layers.vessel_positions && activeIncident.candidates) {
      activeIncident.candidates.forEach((cand) => {
        const isSelected = cand.id === selectedCandidateId;
        const el = document.createElement('div');
        el.className = 'cursor-pointer select-none';

        el.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="flex h-5 w-5 items-center justify-center rounded-full border ${
              isSelected
                ? 'bg-[#17324D] border-white text-white shadow-sm'
                : 'bg-white border-[#1769AA] text-[#1769AA]'
            } transition" style="transform: rotate(${cand.heading_deg}deg);">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4 20L12 16L20 20L12 2Z"/>
              </svg>
            </div>
            <div class="mt-0.5 whitespace-nowrap rounded bg-white/95 border border-[#D1D5DB] px-1 py-0.2 text-[10px] font-sans text-gray-800 shadow-2xs">
              ${cand.vessel_name} (${cand.attribution_score}%)
            </div>
          </div>
        `;

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        el.addEventListener('pointerdown', (e) => {
          startX = e.clientX;
          startY = e.clientY;
          isDragging = false;
        });

        el.addEventListener('pointermove', (e) => {
          if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) {
            isDragging = true;
          }
        });

        el.addEventListener('click', (e) => {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          e.stopPropagation();
          setSelectedCandidateId(cand.id);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([cand.current_position.lng, cand.current_position.lat])
          .addTo(map);

        activeMarkersRef.current.push(marker);
      });
    }

    // 3. Reconstructed Origin Marker
    if (layers.origin_probability_region && activeIncident.breadcrumbs.length > 0) {
      const originPoint = activeIncident.breadcrumbs[activeIncident.breadcrumbs.length - 1];
      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none';
      el.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="px-2 py-0.5 rounded border border-amber-600 bg-amber-500 text-white text-[10px] font-sans font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <span class="inline-block h-2 w-2 rounded-full bg-white shrink-0 animate-ping"></span>
            <span>RECONSTRUCTED ORIGIN (82% CONF)</span>
          </div>
          <div class="text-[9px] font-mono font-semibold text-amber-800 bg-white/90 px-1 rounded border border-amber-300 mt-0.5 shadow-2xs">
            ${originPoint.lng.toFixed(2)}°W, ${originPoint.lat.toFixed(2)}°N · -12.4h
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([originPoint.lng, originPoint.lat])
        .addTo(map);

      activeMarkersRef.current.push(marker);
    }
  }, [
    mapLoaded,
    incidents,
    activeIncidentId,
    activeIncident,
    selectedCandidateId,
    layers.slick_confidence_badges,
    layers.vessel_positions,
    layers.origin_probability_region,
    setActiveIncidentId,
    setSelectedCandidateId,
  ]);

  // Sync HTML markers with map and incident updates (GPU transform natively updates positions during pan/zoom)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    updateIncidentMarkers();

    return () => {
      activeMarkersRef.current.forEach((m) => m.remove());
      activeMarkersRef.current = [];
    };
  }, [updateIncidentMarkers, mapLoaded]);

  // Sync URL hash when activeIncidentId changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const newHash = `#/map/@${center.lng.toFixed(2)},${center.lat.toFixed(2)},${zoom.toFixed(1)}z;incident=${activeIncidentId}`;
    window.history.replaceState(null, '', window.location.pathname + newHash);
  }, [activeIncidentId, mapLoaded]);

  // Handle programmatic flyTo / fitBounds camera targets
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapFlyTarget) return;

    if (mapFlyTarget.bounds) {
      map.fitBounds(mapFlyTarget.bounds, {
        padding: 80,
        maxZoom: 5.5,
        duration: mapFlyTarget.duration || 1400,
        essential: true,
      });
    } else if (mapFlyTarget.center && mapFlyTarget.zoom !== undefined) {
      map.flyTo({
        center: mapFlyTarget.center,
        zoom: mapFlyTarget.zoom,
        duration: mapFlyTarget.duration || 1400,
        essential: true,
      });
    }

    clearMapFlyTarget();
  }, [mapFlyTarget, clearMapFlyTarget]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#CCD7E0]">
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="h-full w-full outline-none" tabIndex={0} />

      {/* Subtle Vector Flow Canvas (animated current and wind streamlines) */}
      <VectorFlowCanvas map={mapInstance || mapRef.current} />

      {/* Floating Conventional GIS Layer Switcher & Map Mode HUD */}
      <MapIntelligenceBar />

      {/* Floating Vertical GIS Map Controls (Right Side) */}
      <MapControls map={mapInstance || mapRef.current} />

      {/* Floating Symbology Legend */}
      <MapLegend />

      {/* Institutional Data Attribution Banner */}
      <div className="absolute right-3.5 bottom-2 z-10 pointer-events-none rounded border border-slate-300 bg-white/90 px-2 py-0.5 text-[10px] font-sans text-slate-600 shadow-2xs">
        <span className="font-semibold text-slate-700">Data sources:</span> Copernicus Sentinel-1 · Global AIS · NOAA/HYCOM · <span className="text-slate-500">Demonstration data</span>
      </div>
    </div>
  );
};
