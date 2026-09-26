import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { LayerVisibilityState } from '../../types';

export const LayerControl: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { layers, toggleLayer, setLayer } = usePoseidonStore();

  const layerCategories: {
    title: string;
    items: { key: keyof LayerVisibilityState; label: string }[];
  }[] = [
    {
      title: 'Oil spill detection',
      items: [
        { key: 'detected_slicks', label: 'Oil spill detections' },
        { key: 'slick_boundaries', label: 'Slick boundaries' },
        { key: 'slick_confidence_badges', label: 'Confidence indicators' },
        { key: 'slick_age_labels', label: 'Age annotations' },
      ],
    },
    {
      title: 'AIS vessel traffic',
      items: [
        { key: 'vessel_positions', label: 'Vessel positions' },
        { key: 'vessel_tracks', label: 'Vessel historical tracks' },
        { key: 'suspicious_vessels_only', label: 'Candidate vessels only' },
      ],
    },
    {
      title: 'Oceanographic data',
      items: [
        { key: 'ocean_currents', label: 'Ocean surface currents' },
        { key: 'wind_vectors', label: 'Surface wind fields' },
        { key: 'waves', label: 'Significant wave height' },
        { key: 'sea_surface_temp', label: 'Sea surface temperature' },
      ],
    },
    {
      title: 'Forecast & trajectory',
      items: [
        { key: 'forecast_trajectory', label: 'Predicted drift path' },
        { key: 'forecast_uncertainty_cone', label: 'Forecast uncertainty zone' },
        { key: 'breadcrumb_trail', label: 'Hindcast origin trail' },
      ],
    },
    {
      title: 'Satellite imagery',
      items: [
        { key: 'sentinel1_sar', label: 'Sentinel-1 SAR C-Band' },
        { key: 'sar_detection_tiles', label: 'SAR acquisition frames' },
        { key: 'sentinel2_optical', label: 'Sentinel-2 MSI Optical' },
      ],
    },
  ];

  return (
    <div className="absolute left-3.5 top-3.5 z-20">
      {/* Layer Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded border border-[#D1D5DB] px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
          isOpen
            ? 'bg-[#17324D] text-white border-[#17324D]'
            : 'bg-white text-gray-800 hover:bg-gray-50'
        }`}
        style={{ borderRadius: '4px' }}
      >
        <Layers className="h-3.5 w-3.5" />
        <span>Layers</span>
        {isOpen ? <ChevronUp className="h-3.5 w-3.5 ml-0.5" /> : <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
      </button>

      {/* Standard GIS Layer Selector Dialog */}
      {isOpen && (
        <div
          className="mt-1.5 w-64 max-h-[calc(100vh-120px)] overflow-y-auto rounded border border-[#D1D5DB] bg-white p-3 shadow-md text-xs text-gray-800"
          style={{ borderRadius: '4px' }}
        >
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
                  setLayer('ocean_currents', true);
                  setLayer('forecast_trajectory', true);
                }}
                className="text-gray-500 hover:underline"
              >
                Default
              </button>
            </div>
          </div>

          <div className="mt-2.5 space-y-3">
            {layerCategories.map((cat) => (
              <div key={cat.title} className="space-y-1">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                  {cat.title}
                </div>

                <div className="space-y-1 pl-0.5">
                  {cat.items.map((item) => {
                    const enabled = layers[item.key];
                    return (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-gray-900 text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => toggleLayer(item.key)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-[#1769AA] focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
