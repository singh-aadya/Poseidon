import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { LayerVisibilityState } from '../../types';

export const LayerControl: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { layers, toggleLayer, setLayer } = usePoseidonStore();

  const layerItems: { key: keyof LayerVisibilityState; label: string }[] = [
    { key: 'detected_slicks', label: 'Oil spill detections' },
    { key: 'vessel_positions', label: 'Vessel positions' },
    { key: 'vessel_tracks', label: 'Vessel tracks' },
    { key: 'wind_vectors', label: 'Wind' },
    { key: 'ocean_currents', label: 'Ocean currents' },
    { key: 'forecast_trajectory', label: 'Forecast' },
    { key: 'sentinel1_sar', label: 'Satellite imagery' },
  ];

  return (
    <div className="absolute left-3.5 top-3.5 z-20">
      {/* Standard GIS Layer Toggle Button: "Layers ▾" */}
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
        <div className="mt-1.5 w-56 rounded-sm border border-[#D1D5DB] bg-white p-3 shadow-md text-xs text-gray-800">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <span className="font-semibold text-gray-900 text-xs">
              Map layers
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
                  setLayer('vessel_positions', true);
                  setLayer('vessel_tracks', true);
                  setLayer('ocean_currents', true);
                  setLayer('forecast_trajectory', true);
                  setLayer('wind_vectors', true);
                }}
                className="text-gray-500 hover:underline"
              >
                Default
              </button>
            </div>
          </div>

          <div className="mt-2.5 space-y-1.5">
            {layerItems.map((item) => {
              const enabled = layers[item.key];
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
      )}
    </div>
  );
};
