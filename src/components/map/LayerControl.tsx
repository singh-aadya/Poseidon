import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { LayerVisibilityState, BasemapStyle } from '../../types';

export const LayerControl: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { basemap, setBasemap, layers, toggleLayer, setLayer } = usePoseidonStore();

  const basemapList: { id: BasemapStyle; label: string }[] = [
    { id: 'oceanographic', label: 'Maritime Oceanographic (NOAA/GEBCO)' },
    { id: 'light-gis', label: 'Government GIS Light' },
    { id: 'satellite', label: 'Satellite Orbital Imagery' },
    { id: 'dark-matter', label: 'Dark SAR High-Contrast' },
  ];

  const intelligenceLayers: { key: keyof LayerVisibilityState; label: string }[] = [
    { key: 'detected_slicks', label: 'Detected oil slicks' },
    { key: 'origin_probability_region', label: 'Reconstructed origin region' },
    { key: 'satellite_footprint', label: 'Satellite SAR swath footprint' },
    { key: 'source_candidates', label: 'Candidate vessel markers' },
    { key: 'vessel_tracks', label: 'Candidate historical tracks' },
    { key: 'all_ais_traffic', label: 'Background corridor AIS' },
    { key: 'breadcrumb_trail', label: 'Reverse drift hindcast' },
    { key: 'forecast_trajectory', label: '48h forecast trajectory' },
    { key: 'forecast_uncertainty_cone', label: 'Forecast uncertainty cone' },
    { key: 'ocean_currents', label: 'Surface currents (HYCOM)' },
    { key: 'wind_vectors', label: 'Surface winds (GFS)' },
  ];

  return (
    <div className="relative">
      {/* Standard GIS Layer Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-sm border border-[#D1D5DB] px-3 py-1.5 text-xs font-semibold shadow-xs transition ${
          isOpen
            ? 'bg-[#17324D] text-white border-[#17324D]'
            : 'bg-white text-gray-800 hover:bg-gray-50'
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        <span>Layers ▾</span>
      </button>

      {/* Standard GIS Layer Selector Dialog */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-72 rounded-sm border border-[#D1D5DB] bg-white p-3 shadow-md text-xs text-gray-800 max-h-[75vh] overflow-y-auto z-30">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <span className="font-bold text-gray-900 text-xs">
              GIS Layer Catalog
            </span>
            <div className="flex gap-2 text-[11px]">
              <button
                onClick={() => {
                  Object.keys(layers).forEach((k) => setLayer(k as keyof LayerVisibilityState, true));
                }}
                className="text-[#1769AA] hover:underline"
              >
                All on
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  setLayer('detected_slicks', true);
                  setLayer('slick_boundaries', true);
                  setLayer('origin_probability_region', true);
                  setLayer('satellite_footprint', true);
                  setLayer('vessel_positions', true);
                  setLayer('vessel_tracks', true);
                  setLayer('source_candidates', true);
                  setLayer('breadcrumb_trail', true);
                  setLayer('forecast_trajectory', true);
                  setLayer('forecast_uncertainty_cone', true);
                  setLayer('all_ais_traffic', false);
                  setLayer('ocean_currents', true);
                  setLayer('wind_vectors', true);
                }}
                className="text-gray-500 hover:underline"
              >
                Default
              </button>
            </div>
          </div>

          {/* Group 1: Basemap */}
          <div className="mt-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Basemap
            </div>
            <div className="space-y-1 pl-1">
              {basemapList.map((bm) => (
                <label
                  key={bm.id}
                  className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-gray-900 text-gray-700 select-none"
                >
                  <input
                    type="radio"
                    name="basemap-layer-group"
                    checked={basemap === bm.id}
                    onChange={() => setBasemap(bm.id)}
                    className="h-3.5 w-3.5 text-[#1769AA] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs">{bm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group 2: Intelligence */}
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Intelligence Layers
            </div>
            <div className="space-y-1.5 pl-1">
              {intelligenceLayers.map((item) => {
                const enabled = !!layers[item.key];
                return (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-gray-900 text-gray-700 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => toggleLayer(item.key)}
                      className="h-3.5 w-3.5 rounded-xs border-gray-300 text-[#1769AA] focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
