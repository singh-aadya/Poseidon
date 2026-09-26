import React, { useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import {
  Plus,
  Minus,
  Compass,
  Home,
  Crosshair,
  Layers,
  Maximize2,
  Minimize2,
  Ruler,
  Check,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { BasemapStyle } from '../../types';

interface MapControlsProps {
  map: MapLibreMap | null;
}

export const MapControls: React.FC<MapControlsProps> = ({ map }) => {
  const { basemap, setBasemap, getActiveIncident, resetView, flyToCoords } = usePoseidonStore();
  const [basemapOpen, setBasemapOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [measureActive, setMeasureActive] = useState(false);

  const activeIncident = getActiveIncident();

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    map?.zoomIn({ duration: 250 });
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    map?.zoomOut({ duration: 250 });
  };

  const handleResetNorth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    map?.resetNorthPitch({ duration: 400 });
  };

  const handleFocusIncident = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (activeIncident) {
      flyToCoords(activeIncident.coordinates, 10.4);
    }
  };

  const handleResetView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resetView();
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const basemapOptions: { id: BasemapStyle; label: string; desc: string }[] = [
    { id: 'oceanographic', label: 'Maritime Oceanographic', desc: 'NOAA / GEBCO bathymetry & contours' },
    { id: 'light-gis', label: 'Government GIS (Light)', desc: 'Muted neutral reference' },
    { id: 'satellite', label: 'Satellite Imagery', desc: 'High-res orbital imagery' },
    { id: 'dark-matter', label: 'Dark Oceanographic', desc: 'High-contrast SAR mode' },
  ];

  return (
    <div className="absolute right-3.5 top-3.5 z-20 flex flex-col items-end gap-2 pointer-events-none">
      {/* Basemap Selection Flyout */}
      {basemapOpen && (
        <div className="mb-1 w-64 rounded-sm border border-[#D1D5DB] bg-white p-2 shadow-md pointer-events-auto">
          <div className="px-2 py-1 text-[10px] font-semibold text-gray-500 border-b border-gray-100">
            Basemap layer
          </div>
          <div className="mt-1 space-y-0.5">
            {basemapOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBasemap(opt.id);
                  setBasemapOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-sm px-2.5 py-1.5 text-left text-xs transition ${
                  basemap === opt.id
                    ? 'bg-[#EFF6FF] text-[#1769AA] font-semibold border border-[#BFDBFE]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div>
                  <div className="font-medium text-gray-900">{opt.label}</div>
                  <div className="text-[10px] text-gray-500">{opt.desc}</div>
                </div>
                {basemap === opt.id && <Check className="h-3.5 w-3.5 text-[#1769AA] shrink-0 ml-1" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conventional Government GIS Control Stack (36px buttons) */}
      <div className="flex flex-col overflow-hidden rounded-sm border border-[#D1D5DB] bg-white shadow-xs divide-y divide-[#E5E7EB] pointer-events-auto">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in"
          className="flex h-9 w-9 items-center justify-center text-gray-700 hover:bg-gray-100 transition"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
          className="flex h-9 w-9 items-center justify-center text-gray-700 hover:bg-gray-100 transition"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleResetNorth}
          title="Reset orientation (North up)"
          className="flex h-9 w-9 items-center justify-center text-gray-700 hover:bg-gray-100 transition"
        >
          <Compass className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleFocusIncident}
          title="Zoom to active incident"
          className="flex h-9 w-9 items-center justify-center text-[#1769AA] hover:bg-gray-100 transition"
        >
          <Crosshair className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleResetView}
          title="Reset to global view"
          className="flex h-9 w-9 items-center justify-center text-gray-700 hover:bg-gray-100 transition"
        >
          <Home className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setBasemapOpen(!basemapOpen);
          }}
          title="Select basemap"
          className={`flex h-9 w-9 items-center justify-center transition ${
            basemapOpen ? 'bg-[#EFF6FF] text-[#1769AA]' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Layers className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMeasureActive(!measureActive);
          }}
          title="Measure distance"
          className={`flex h-9 w-9 items-center justify-center transition ${
            measureActive ? 'bg-[#EFF6FF] text-[#1769AA]' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Ruler className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit full screen' : 'Full screen map'}
          className="flex h-9 w-9 items-center justify-center text-gray-700 hover:bg-gray-100 transition"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      {measureActive && (
        <div className="rounded-sm border border-[#D1D5DB] bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm pointer-events-auto">
          Click map to measure nautical distance
        </div>
      )}
    </div>
  );
};
