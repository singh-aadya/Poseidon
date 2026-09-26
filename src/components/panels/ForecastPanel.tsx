import React from 'react';
import {
  Wind,
  Waves,
  ArrowRight,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { formatCoordinates } from '../../utils/formatting';

export const ForecastPanel: React.FC = () => {
  const {
    getActiveIncident,
    selectedForecastHorizon,
    setSelectedForecastHorizon,
  } = usePoseidonStore();

  const inc = getActiveIncident();
  const currentForecast = inc.forecasts[selectedForecastHorizon];

  const horizons: (6 | 12 | 24 | 48)[] = [6, 12, 24, 48];

  return (
    <div className="space-y-4 p-3.5 text-xs text-gray-800 bg-white">
      {/* 1. Forecast Projection Header & Horizon Selection */}
      <div className="rounded border border-[#D1D5DB] bg-[#F8FAFC] p-3 space-y-2.5" style={{ borderRadius: '4px' }}>
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 uppercase tracking-wide">
          <div className="flex items-center gap-1.5 text-[#17324D]">
            <Wind className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>Drift trajectory forecast</span>
          </div>
          <span className="text-gray-500 font-normal">Lagrangian model</span>
        </div>

        {/* Horizon Buttons (Section 18) */}
        <div>
          <div className="text-[11px] font-medium text-gray-600 mb-1.5">
            Projection horizon
          </div>
          <div className="grid grid-cols-4 gap-1">
            {horizons.map((h) => {
              const isSelected = selectedForecastHorizon === h;
              return (
                <button
                  key={h}
                  onClick={() => setSelectedForecastHorizon(h)}
                  className={`rounded py-1.5 text-xs font-semibold transition border ${
                    isSelected
                      ? 'bg-[#1769AA] text-white border-[#1769AA]'
                      : 'border-[#D1D5DB] bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ borderRadius: '3px' }}
                >
                  +{h} hours
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Projected Horizon Telemetry Card */}
      {currentForecast && (
        <div className="rounded border border-[#D1D5DB] bg-white p-3 space-y-3" style={{ borderRadius: '4px' }}>
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
            <div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Projected center at T+{currentForecast.horizon_hours} hours
              </div>
              <div className="font-mono text-sm font-bold text-[#17324D]">
                {formatCoordinates(currentForecast.predicted_center, 3)}
              </div>
            </div>

            <div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  currentForecast.shoreline_impact_risk === 'HIGH'
                    ? 'border-[#B42318] bg-[#FEF2F2] text-[#B42318]'
                    : currentForecast.shoreline_impact_risk === 'MODERATE'
                    ? 'border-[#C47A00] bg-[#FFFBEB] text-[#C47A00]'
                    : 'border-[#287D3C] bg-[#F0FDF4] text-[#287D3C]'
                }`}
                style={{ borderRadius: '3px' }}
              >
                {currentForecast.shoreline_impact_risk} shoreline risk
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-[#E5E7EB] bg-[#F8FAFC] p-2" style={{ borderRadius: '3px' }}>
              <div className="text-gray-500 text-[10px]">Predicted drift velocity</div>
              <div className="text-sm font-bold text-gray-900">
                {currentForecast.drift_speed_knots.toFixed(2)} kn
              </div>
              <div className="text-[11px] text-gray-600">
                Bearing: {Math.round(currentForecast.drift_bearing_deg)}°
              </div>
            </div>

            <div className="rounded border border-[#E5E7EB] bg-[#F8FAFC] p-2" style={{ borderRadius: '3px' }}>
              <div className="text-gray-500 text-[10px]">Uncertainty radius</div>
              <div className="text-sm font-bold text-gray-900">
                ±{currentForecast.spread_radius_km.toFixed(1)} km
              </div>
              <div className="text-[11px] text-gray-600">Dispersion zone</div>
            </div>
          </div>

          <div className="rounded border border-[#E5E7EB] bg-[#F8FAFC] p-2 flex items-center justify-between text-xs" style={{ borderRadius: '3px' }}>
            <span className="text-gray-600">Distance to nearest coast:</span>
            <span className="font-semibold text-gray-900">
              {currentForecast.closest_shoreline_km} km
            </span>
          </div>
        </div>
      )}

      {/* 3. Metocean Dynamics Table */}
      <div className="rounded border border-[#D1D5DB] bg-white p-3 space-y-2" style={{ borderRadius: '4px' }}>
        <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
          Metocean hydrodynamic forcing
        </div>

        <table className="gis-table text-xs">
          <thead>
            <tr>
              <th className="py-1 px-2 text-[11px]">Component</th>
              <th className="py-1 px-2 text-[11px]">Bearing</th>
              <th className="py-1 px-2 text-[11px] text-right">Magnitude</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 px-2 text-gray-700 font-medium">Ocean surface current (HYCOM)</td>
              <td className="py-1 px-2 text-gray-600">{inc.signature.ambient_current_direction_deg}°</td>
              <td className="py-1 px-2 font-semibold text-right text-gray-900">{inc.signature.ambient_current_knots} kn</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700 font-medium">Surface wind (NOAA GFS)</td>
              <td className="py-1 px-2 text-gray-600">{inc.signature.ambient_wind_direction_deg}°</td>
              <td className="py-1 px-2 font-semibold text-right text-gray-900">{inc.signature.ambient_wind_knots} kn</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700 font-medium">Combined drift resultant</td>
              <td className="py-1 px-2 text-gray-600">{inc.signature.drift_direction_deg}°</td>
              <td className="py-1 px-2 font-semibold text-right text-[#1769AA]">{inc.signature.drift_speed_knots} kn</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Coastal Vulnerability Text */}
      <div className="rounded border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-xs leading-relaxed text-gray-700" style={{ borderRadius: '4px' }}>
        <div className="font-semibold text-gray-800 mb-1">Environmental sensitivity index assessment</div>
        The current drift trajectory projects movement parallel to coastal barrier systems. No immediate shoreline stranding is anticipated within 24 hours under prevailing wind forcing.
      </div>
    </div>
  );
};
