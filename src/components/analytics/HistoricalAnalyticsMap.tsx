import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, Flame, CircleDot, Compass, Eye, Maximize2, ExternalLink, Ship } from 'lucide-react';
import { Incident } from '../../types';
import { HotspotMode } from './types';

// Ensure worker URL is configured
maplibregl.config.WORKER_URL = '/maplibre-gl-worker.mjs';

interface HistoricalAnalyticsMapProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident | null) => void;
  onViewInLiveMap: (inc: Incident) => void;
}

// Major shipping lane corridors for geospatial context
const SHIPPING_LANES_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Trans-Atlantic Northern Corridor' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-74.0, 40.5],
          [-50.0, 43.0],
          [-30.0, 47.0],
          [-10.0, 49.5],
          [0.0, 50.5],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Gulf of Mexico Fairways' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-95.0, 29.0],
          [-91.0, 27.5],
          [-88.0, 26.5],
          [-82.5, 24.5],
          [-80.0, 25.5],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'English Channel & North Sea Corridor' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-5.0, 49.0],
          [-1.0, 50.0],
          [1.5, 51.0],
          [3.0, 52.5],
          [4.5, 54.5],
          [7.0, 56.5],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Strait of Malacca Route' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [95.0, 5.5],
          [98.0, 4.0],
          [101.0, 2.5],
          [104.0, 1.2],
          [106.5, 2.0],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Strait of Hormuz Corridor' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [50.0, 27.0],
          [54.0, 26.0],
          [56.5, 26.3],
          [58.0, 24.5],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Mediterranean East-West Trunk' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-5.5, 36.0],
          [2.0, 37.5],
          [11.0, 37.2],
          [15.0, 36.5],
          [24.0, 34.5],
          [32.5, 31.5],
        ],
      },
    },
  ],
};

// 200nm EEZ sample boundaries
const EEZ_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { jurisdiction: 'US Gulf EEZ' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-97.0, 26.0],
          [-93.5, 25.0],
          [-88.0, 24.5],
          [-83.0, 24.0],
          [-81.0, 24.5],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { jurisdiction: 'UK / Norway Median Line' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [1.0, 53.0],
          [2.5, 55.5],
          [3.2, 57.0],
          [1.8, 60.5],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { jurisdiction: 'Persian Gulf Delimitation' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [49.5, 28.5],
          [51.5, 27.0],
          [54.5, 26.0],
          [56.0, 26.2],
        ],
      },
    },
  ],
};

export const HistoricalAnalyticsMap: React.FC<HistoricalAnalyticsMapProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onViewInLiveMap,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  const [hotspotMode, setHotspotMode] = useState<HotspotMode>('count');
  const [showShippingLanes, setShowShippingLanes] = useState(true);
  const [showEez, setShowEez] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);
  const [hoveredIncident, setHoveredIncident] = useState<Incident | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Dark Oceanographic / Slate Basemap style
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-dark-gray': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            attribution: 'Esri, DeLorme, GEBCO, NOAA NGDC',
          },
        },
        layers: [
          {
            id: 'dark-base',
            type: 'raster',
            source: 'esri-dark-gray',
            minzoom: 0,
            maxzoom: 16,
          },
        ],
      },
      center: [-40.0, 28.0],
      zoom: 2.2,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    map.on('load', () => {
      // 1. Shipping lanes
      map.addSource('shipping-lanes', {
        type: 'geojson',
        data: SHIPPING_LANES_GEOJSON,
      });

      map.addLayer({
        id: 'shipping-lanes-line',
        type: 'line',
        source: 'shipping-lanes',
        paint: {
          'line-color': '#38BDF8',
          'line-width': 1.2,
          'line-opacity': 0.35,
          'line-dasharray': [4, 4],
        },
      });

      // 2. EEZ boundaries
      map.addSource('eez-lines', {
        type: 'geojson',
        data: EEZ_GEOJSON,
      });

      map.addLayer({
        id: 'eez-lines-layer',
        type: 'line',
        source: 'eez-lines',
        paint: {
          'line-color': '#64748B',
          'line-width': 1.0,
          'line-opacity': 0.3,
          'line-dasharray': [2, 2],
        },
      });

      // 3. Incident Polygons Source
      map.addSource('incident-polygons', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'incident-polygons-fill',
        type: 'fill',
        source: 'incident-polygons',
        paint: {
          'fill-color': '#EF4444',
          'fill-opacity': 0.45,
        },
      });

      map.addLayer({
        id: 'incident-polygons-outline',
        type: 'line',
        source: 'incident-polygons',
        paint: {
          'line-color': '#F87171',
          'line-width': 1.5,
          'line-opacity': 0.8,
        },
      });

      // 4. Incidents Points Source
      map.addSource('incident-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Heatmap layer for 'count'
      map.addLayer({
        id: 'incidents-heatmap',
        type: 'heatmap',
        source: 'incident-points',
        maxzoom: 9,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(2, 132, 199, 0)',
            0.2,
            'rgba(2, 132, 199, 0.4)',
            0.4,
            'rgba(245, 158, 11, 0.7)',
            0.8,
            'rgba(239, 68, 68, 0.9)',
            1,
            'rgba(255, 255, 255, 1)',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 8, 9, 35],
          'heatmap-opacity': 0.85,
        },
      });

      // Circle layer for points
      map.addLayer({
        id: 'incidents-circles',
        type: 'circle',
        source: 'incident-points',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'area_km2'],
            0,
            5,
            10,
            9,
            25,
            18,
          ],
          'circle-color': [
            'case',
            ['>=', ['get', 'confidence'], 0.85],
            '#0284C7',
            ['>=', ['get', 'confidence'], 0.7],
            '#F59E0B',
            '#94A3B8',
          ],
          'circle-opacity': 0.85,
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 1.5,
        },
      });

      // 5. Origin points source & layer
      map.addSource('incident-origins', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'origin-density-heatmap',
        type: 'heatmap',
        source: 'incident-origins',
        maxzoom: 9,
        paint: {
          'heatmap-weight': 1.5,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(34, 211, 238, 0)',
            0.3,
            'rgba(14, 165, 233, 0.5)',
            0.7,
            'rgba(99, 102, 241, 0.8)',
            1,
            'rgba(217, 70, 239, 1)',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 10, 9, 40],
          'heatmap-opacity': 0.8,
        },
      });

      // Click to select
      map.on('click', 'incidents-circles', (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const id = feat.properties?.id;
        const inc = incidents.find((i) => i.id === id);
        if (inc) {
          onSelectIncident(inc);
        }
      });

      // Hover cursor & preview
      map.on('mouseenter', 'incidents-circles', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0]) {
          const id = e.features[0].properties?.id;
          const found = incidents.find((i) => i.id === id);
          if (found) setHoveredIncident(found);
        }
      });

      map.on('mouseleave', 'incidents-circles', () => {
        map.getCanvas().style.cursor = '';
        setHoveredIncident(null);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update GeoJSON data when incidents change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // 1. Point features
    const pointFeatures: GeoJSON.Feature[] = incidents.map((inc) => ({
      type: 'Feature',
      properties: {
        id: inc.id,
        name: inc.name,
        region: inc.region,
        area_km2: inc.area_km2,
        confidence: inc.confidence,
        date: inc.detection_time.slice(0, 10),
        vessel: inc.candidates[0]?.vessel_name || 'Unattributed',
      },
      geometry: {
        type: 'Point',
        coordinates: [inc.coordinates.lng, inc.coordinates.lat],
      },
    }));

    const pointSource = map.getSource('incident-points') as maplibregl.GeoJSONSource;
    if (pointSource) {
      pointSource.setData({
        type: 'FeatureCollection',
        features: pointFeatures,
      });
    }

    // 2. Polygons
    const polyFeatures: GeoJSON.Feature[] = incidents.map((inc) => ({
      type: 'Feature',
      properties: { id: inc.id },
      geometry: inc.polygon,
    }));

    const polySource = map.getSource('incident-polygons') as maplibregl.GeoJSONSource;
    if (polySource) {
      polySource.setData({
        type: 'FeatureCollection',
        features: polyFeatures,
      });
    }

    // 3. Reverse-drift origin points
    const originFeatures: GeoJSON.Feature[] = incidents.map((inc) => {
      const b = inc.breadcrumbs[inc.breadcrumbs.length - 1];
      const lng = b ? b.lng : inc.coordinates.lng - 0.2;
      const lat = b ? b.lat : inc.coordinates.lat - 0.15;
      return {
        type: 'Feature',
        properties: { id: inc.id },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      };
    });

    const originSource = map.getSource('incident-origins') as maplibregl.GeoJSONSource;
    if (originSource) {
      originSource.setData({
        type: 'FeatureCollection',
        features: originFeatures,
      });
    }
  }, [incidents]);

  // Handle Hotspot Mode Switch
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (hotspotMode === 'count') {
      map.setLayoutProperty('incidents-heatmap', 'visibility', 'visible');
      map.setLayoutProperty('origin-density-heatmap', 'visibility', 'none');
      map.setPaintProperty('incidents-circles', 'circle-radius', 6);
    } else if (hotspotMode === 'area') {
      map.setLayoutProperty('incidents-heatmap', 'visibility', 'none');
      map.setLayoutProperty('origin-density-heatmap', 'visibility', 'none');
      map.setPaintProperty('incidents-circles', 'circle-radius', [
        'interpolate',
        ['linear'],
        ['get', 'area_km2'],
        0,
        5,
        10,
        12,
        25,
        22,
      ]);
    } else if (hotspotMode === 'origin') {
      map.setLayoutProperty('incidents-heatmap', 'visibility', 'none');
      map.setLayoutProperty('origin-density-heatmap', 'visibility', 'visible');
      map.setPaintProperty('incidents-circles', 'circle-radius', 5);
    }
  }, [hotspotMode]);

  // Handle Layer Visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    map.setLayoutProperty(
      'shipping-lanes-line',
      'visibility',
      showShippingLanes ? 'visible' : 'none'
    );
    map.setLayoutProperty('eez-lines-layer', 'visibility', showEez ? 'visible' : 'none');
    map.setLayoutProperty(
      'incident-polygons-fill',
      'visibility',
      showPolygons ? 'visible' : 'none'
    );
    map.setLayoutProperty(
      'incident-polygons-outline',
      'visibility',
      showPolygons ? 'visible' : 'none'
    );
  }, [showShippingLanes, showEez, showPolygons]);

  const resetGlobalView = () => {
    mapRef.current?.easeTo({
      center: [-40.0, 28.0],
      zoom: 2.2,
      duration: 1000,
    });
  };

  return (
    <div className="relative flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs select-none">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#F1F5F9] pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#0284C7]" />
            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Geospatial Hotspot & Density Surveillance
            </h2>
          </div>
          <p className="mt-0.5 text-[11px] text-[#64748B]">
            Interactive global SAR observations with free pan/zoom and density hindcast layers
          </p>
        </div>

        {/* Hotspot View Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-sm border border-[#CBD5E1] bg-[#F8FAFC] p-0.5 text-xs">
            <span className="px-2 text-[11px] font-semibold text-[#64748B]">MODE:</span>
            <button
              onClick={() => setHotspotMode('count')}
              className={`flex items-center gap-1 rounded-xs px-2.5 py-1 text-[11px] font-medium transition ${
                hotspotMode === 'count'
                  ? 'bg-[#17324D] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              <Flame className="h-3 w-3 text-amber-400" />
              <span>Incident Count</span>
            </button>
            <button
              onClick={() => setHotspotMode('area')}
              className={`flex items-center gap-1 rounded-xs px-2.5 py-1 text-[11px] font-medium transition ${
                hotspotMode === 'area'
                  ? 'bg-[#17324D] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              <CircleDot className="h-3 w-3 text-sky-400" />
              <span>Slick Area Size</span>
            </button>
            <button
              onClick={() => setHotspotMode('origin')}
              className={`flex items-center gap-1 rounded-xs px-2.5 py-1 text-[11px] font-medium transition ${
                hotspotMode === 'origin'
                  ? 'bg-[#17324D] text-white font-semibold'
                  : 'text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              <Compass className="h-3 w-3 text-purple-400" />
              <span>Origin Density</span>
            </button>
          </div>

          {/* Reset Global View */}
          <button
            onClick={resetGlobalView}
            className="flex items-center gap-1 rounded-sm border border-[#CBD5E1] bg-white px-2 py-1 text-[11px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition shadow-2xs"
            title="Reset to global world view"
          >
            <Maximize2 className="h-3 w-3" />
            <span>Global Fit</span>
          </button>
        </div>
      </div>

      {/* Layer Toggles Row */}
      <div className="flex flex-wrap items-center gap-4 bg-[#F8FAFC] px-3 py-1.5 border-b border-[#E2E8F0] text-[11px] text-[#475569]">
        <span className="font-semibold text-[#17324D]">Context Layers:</span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={showShippingLanes}
            onChange={(e) => setShowShippingLanes(e.target.checked)}
            className="rounded-xs border-[#CBD5E1] text-[#0284C7] focus:ring-0"
          />
          <span>Major Shipping Corridors</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={showEez}
            onChange={(e) => setShowEez(e.target.checked)}
            className="rounded-xs border-[#CBD5E1] text-[#0284C7] focus:ring-0"
          />
          <span>EEZ Maritime Limits</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={showPolygons}
            onChange={(e) => setShowPolygons(e.target.checked)}
            className="rounded-xs border-[#CBD5E1] text-[#0284C7] focus:ring-0"
          />
          <span>Detected Slick Outlines</span>
        </label>
      </div>

      {/* Map WebGL Canvas */}
      <div className="relative h-96 w-full overflow-hidden bg-[#1E293B]">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Hover Popup Overlay */}
        {hoveredIncident && (
          <div className="pointer-events-none absolute top-3 left-3 z-30 max-w-xs rounded-xs border border-[#17324D] bg-[#0F2538] p-3 text-white shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#254F78] pb-1.5">
              <span className="font-mono font-bold text-sky-400">{hoveredIncident.id}</span>
              <span className="rounded-xs bg-[#17324D] px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                {(hoveredIncident.confidence * 100).toFixed(0)}% CONF
              </span>
            </div>
            <div className="mt-1.5 font-bold text-white text-[12px]">{hoveredIncident.name}</div>
            <div className="mt-1 text-[11px] text-slate-300">
              Region: <strong className="text-white">{hoveredIncident.region}</strong>
            </div>
            <div className="text-[11px] text-slate-300">
              Detected: <strong className="text-white">{hoveredIncident.detection_time.slice(0, 16)} UTC</strong>
            </div>
            <div className="text-[11px] text-slate-300">
              Slick Area: <strong className="font-mono text-sky-300">{hoveredIncident.area_km2} km²</strong>
            </div>
            <div className="mt-1.5 border-t border-[#254F78] pt-1 text-[11px] text-amber-300 flex items-center gap-1">
              <Ship className="h-3 w-3" />
              <span>Prime Candidate: {hoveredIncident.candidates[0]?.vessel_name || 'Under Analysis'}</span>
            </div>
          </div>
        )}

        {/* Selected Incident Inspection Card */}
        {selectedIncident && (
          <div className="absolute bottom-3 right-3 z-30 max-w-sm rounded-xs border border-[#CBD5E1] bg-white p-3.5 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                <span className="font-mono font-bold text-[#17324D]">{selectedIncident.id}</span>
              </div>
              <button
                onClick={() => onSelectIncident(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-2">
              <div className="font-bold text-[#0F172A] text-sm">{selectedIncident.name}</div>
              <div className="mt-1 text-[11px] text-[#475569]">
                Jurisdiction: <strong className="text-[#0F172A]">{selectedIncident.region}</strong>
              </div>
              <div className="text-[11px] text-[#475569]">
                Area: <strong className="font-mono text-[#0284C7]">{selectedIncident.area_km2} km²</strong> | Age: <strong className="font-mono text-[#334155]">{selectedIncident.estimated_age_mean}h</strong>
              </div>
              <div className="text-[11px] text-[#475569]">
                Top Candidate: <strong className="text-[#17324D]">{selectedIncident.candidates[0]?.vessel_name || 'None'}</strong> (Score: {selectedIncident.candidates[0]?.attribution_score ?? 'N/A'})
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex items-center gap-2 border-t border-[#F1F5F9] pt-2.5">
              <button
                onClick={() => onViewInLiveMap(selectedIncident)}
                className="flex-1 flex items-center justify-center gap-1 rounded-sm bg-[#17324D] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#1C3D5E] transition"
              >
                <ExternalLink className="h-3 w-3" />
                <span>VIEW INCIDENT IN LIVE MAP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
