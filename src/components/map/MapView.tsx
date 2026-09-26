import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { BasemapStyle, Incident } from '../../types';
import { VectorFlowCanvas } from './VectorFlowCanvas';
import { MapControls } from './MapControls';
import { LayerControl } from './LayerControl';
import { MapLegend } from './MapLegend';

const MAP_STYLES: Record<BasemapStyle, any> = {
  'light-gis': {
    version: 8,
    sources: {
      'carto-light': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        ],
        tileSize: 256,
        attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'carto-light-layer',
        type: 'raster',
        source: 'carto-light',
        minzoom: 0,
        maxzoom: 20,
      },
    ],
  },
  'oceanographic': {
    version: 8,
    sources: {
      'esri-ocean': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: '&copy; Esri, GEBCO, NOAA, National Geographic',
      },
    },
    layers: [
      {
        id: 'esri-ocean-layer',
        type: 'raster',
        source: 'esri-ocean',
        minzoom: 0,
        maxzoom: 16,
      },
    ],
  },
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
    },
    layers: [
      {
        id: 'esri-imagery-layer',
        type: 'raster',
        source: 'esri-imagery',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  'dark-matter': {
    version: 8,
    sources: {
      'carto-dark': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        ],
        tileSize: 256,
        attribution: '&copy; CARTO &copy; OpenStreetMap',
      },
    },
    layers: [
      {
        id: 'carto-dark-layer',
        type: 'raster',
        source: 'carto-dark',
        minzoom: 0,
        maxzoom: 20,
      },
    ],
  },
};

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
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

  const activeIncident = getActiveIncident();

  const getInitialCoordinates = () => {
    try {
      const hash = window.location.hash;
      const match = hash.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z/);
      if (match) {
        return {
          lng: parseFloat(match[1]),
          lat: parseFloat(match[2]),
          zoom: parseFloat(match[3]),
        };
      }
    } catch {
      // fallback
    }
    return { lng: -90.45, lat: 27.85, zoom: 9.6 };
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initial = getInitialCoordinates();

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[basemap] || MAP_STYLES['light-gis'],
      center: [initial.lng, initial.lat],
      zoom: initial.zoom,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);
      map.resize();
    });

    // Update URL hash on camera move
    map.on('moveend', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const currentActiveId = usePoseidonStore.getState().activeIncidentId;
      window.location.hash = `/map/@${center.lng.toFixed(2)},${center.lat.toFixed(2)},${zoom.toFixed(1)}z;incident=${currentActiveId}`;
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle Basemap Switch
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;
    map.setStyle(MAP_STYLES[basemap] || MAP_STYLES['light-gis']);
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

        // Fill layer: Restrained scientific colors (no neon glow)
        map.addLayer({
          id: 'slicks-fill',
          type: 'fill',
          source: 'slicks-source',
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'severity'], 'HIGH'],
              '#B42318',
              ['==', ['get', 'severity'], 'MEDIUM'],
              '#C47A00',
              '#D97706',
            ],
            'fill-opacity': [
              'case',
              ['get', 'isActive'],
              0.4,
              0.25,
            ],
          },
        });

        // Boundary layer: Crisp thin border
        map.addLayer({
          id: 'slicks-outline',
          type: 'line',
          source: 'slicks-source',
          paint: {
            'line-color': [
              'case',
              ['get', 'isActive'],
              '#17324D', // Selected: Dark Navy / Dark Red border
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
              '#1769AA',
              '#64748B',
            ],
            'line-width': ['case', ['get', 'isSelected'], 2.2, 1.2],
            'line-opacity': ['case', ['get', 'isSelected'], 0.9, 0.5],
          },
        });

        map.addLayer({
          id: 'ais-tracks-spill-window',
          type: 'line',
          source: 'ais-tracks-source',
          filter: ['get', 'isSpillWindow'],
          paint: {
            'line-color': '#B42318',
            'line-width': ['case', ['get', 'isSelected'], 3.0, 1.8],
            'line-dasharray': [3, 2],
          },
        });
      } else {
        const src = map.getSource('ais-tracks-source') as GeoJSONSource;
        src.setData(aisTracksGeoJSON);
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
  }, [mapLoaded, setupMapLayers, layers]);

  // Render Custom HTML Markers for Incident Labels & Vessels (Government GIS Style)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    activeMarkersRef.current.forEach((m) => m.remove());
    activeMarkersRef.current = [];

    // 1. Incident centroid markers
    if (layers.slick_confidence_badges) {
      incidents.forEach((inc) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer select-none';

        const isSelected = inc.id === activeIncidentId;
        const confPercent = Math.round(inc.confidence * 100);
        const dotColor =
          inc.severity === 'HIGH' ? '#B42318' : inc.severity === 'MEDIUM' ? '#C47A00' : '#6B7280';

        el.innerHTML = `
          <div class="flex items-center gap-1.5 px-2 py-0.5 rounded border ${
            isSelected
              ? 'bg-white border-[#17324D] text-[#17324D] font-bold shadow-sm ring-1 ring-[#17324D]'
              : 'bg-white/95 border-[#D1D5DB] text-gray-700 shadow-2xs hover:border-gray-400'
          } text-[11px] font-sans transition">
            <span class="inline-block h-2 w-2 rounded-full shrink-0" style="background-color: ${dotColor}"></span>
            <span class="font-mono text-[10px] font-semibold">${inc.id.replace('PSDN-2026-', '')}</span>
            <span class="text-gray-500 font-mono text-[10px]">${confPercent}%</span>
          </div>
        `;

        el.onclick = (e) => {
          e.stopPropagation();
          setActiveIncidentId(inc.id);
        };

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([inc.coordinates.lng, inc.coordinates.lat])
          .addTo(map);

        activeMarkersRef.current.push(marker);
      });
    }

    // 2. Candidate Vessel Directional Markers
    if (layers.vessel_positions) {
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

        el.onclick = (e) => {
          e.stopPropagation();
          setSelectedCandidateId(cand.id);
        };

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([cand.current_position.lng, cand.current_position.lat])
          .addTo(map);

        activeMarkersRef.current.push(marker);
      });
    }

    return () => {
      activeMarkersRef.current.forEach((m) => m.remove());
      activeMarkersRef.current = [];
    };
  }, [
    mapLoaded,
    incidents,
    activeIncidentId,
    activeIncident,
    selectedCandidateId,
    layers.slick_confidence_badges,
    layers.vessel_positions,
  ]);

  // Handle programmatic flyTo camera targets
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapFlyTarget) return;

    map.flyTo({
      center: mapFlyTarget.center,
      zoom: mapFlyTarget.zoom,
      duration: mapFlyTarget.duration || 1400,
      essential: true,
    });

    clearMapFlyTarget();
  }, [mapFlyTarget, clearMapFlyTarget]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#E2E8F0]">
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Subtle Vector Flow Canvas (animated current and wind streamlines) */}
      <VectorFlowCanvas map={mapRef.current} />

      {/* Floating Conventional GIS Layer Switcher */}
      <LayerControl />

      {/* Floating Vertical GIS Map Controls (Right Side) */}
      <MapControls map={mapRef.current} />

      {/* Floating Symbology Legend */}
      <MapLegend />

      {/* Institutional Data Attribution Banner (Section 27) */}
      <div className="absolute right-3.5 bottom-10 z-10 pointer-events-none rounded border border-[#D1D5DB] bg-white/95 px-2.5 py-1 text-[11px] font-sans text-gray-600 shadow-xs">
        <span className="font-semibold text-gray-700">Data sources:</span> Copernicus Sentinel-1 • Global AIS • NOAA / HYCOM • <span className="text-gray-500">Demonstration data</span>
      </div>
    </div>
  );
};
