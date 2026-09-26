import React from 'react';
import {
  Wind,
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
    <div className="p-4 space-y-4 text-xs text-gray-800 bg-white">
      {/* 1. Forecast Projection Header & Horizon Selection */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
          <div className="flex items-center gap-1.5 text-[#17324D]">
            <Wind className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>Drift trajectory forecast</span>
          </div>
          <span className="text-gray-500 font-normal">Lagrangian model</span>
        </div>

        {/* Horizon Buttons */}
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
                  className={`rounded-sm py-1.5 text-xs font-semibold transition border ${
                    isSelected
                      ? 'bg-[#1769AA] text-white border-[#1769AA]'
                      : 'border-[#D1D5DB] bg-white text-gray-700 hover:bg-slate-50'
                  }`}
                >
                  +{h} hours
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Projected Horizon Telemetry */}
      {currentForecast && (
        <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold text-gray-500">
                Projected center at T+{currentForecast.horizon_hours} hours
              </div>
              <div className="font-mono text-xs font-bold text-[#17324D]">
                {formatCoordinates(currentForecast.predicted_center, 3)}
              </div>
            </div>

            <div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm border ${
                  currentForecast.shoreline_impact_risk === 'HIGH'
                    ? 'border-[#B42318] bg-[#FEF2F2] text-[#B42318]'
                    : currentForecast.shoreline_impact_risk === 'MODERATE'
                    ? 'border-[#C47A00] bg-[#FFFBEB] text-[#C47A00]'
                    : 'border-[#287D3C] bg-[#F0FDF4] text-[#287D3C]'
                }`}
              >
                {currentForecast.shoreline_impact_risk} shoreline risk
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-2">
              <div className="text-gray-500 text-[10px]">Predicted velocity</div>
              <div className="text-sm font-bold text-gray-900 font-mono">
                {currentForecast.drift_speed_knots.toFixed(2)} kn
              </div>
              <div className="text-[10px] text-gray-600 font-mono">
                Bearing: {Math.round(currentForecast.drift_bearing_deg)}°
              </div>
            </div>

            <div className="rounded-sm border border-slate-200 bg-slate-50 p-2">
              <div className="text-gray-500 text-[10px]">Uncertainty radius</div>
              <div className="text-sm font-bold text-gray-900 font-mono">
                ±{currentForecast.spread_radius_km.toFixed(1)} km
              </div>
              <div className="text-[10px] text-gray-600">Dispersion envelope</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 text-gray-700">
            <span className="text-gray-500">Distance to nearest shoreline:</span>
            <span className="font-bold text-gray-900 font-mono">
              {currentForecast.closest_shoreline_km} km
            </span>
          </div>

          {/* Operational Forecast Progression Sequence Table */}
          <div className="pt-2 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Ensemble Progression Sequence
            </div>
            <table className="gis-table text-[11px] w-full">
              <thead>
                <tr>
                  <th className="py-1 px-1.5 text-left">Horizon</th>
                  <th className="py-1 px-1.5 text-left">Projected Center</th>
                  <th className="py-1 px-1.5 text-right">Coast Dist</th>
                  <th className="py-1 px-1.5 text-right">Risk</th>
                </tr>
              </thead>
              <tbody>
                {horizons.map((h) => {
                  const fc = inc.forecasts[h];
                  const isSel = selectedForecastHorizon === h;
                  return (
                    <tr
                      key={h}
                      onClick={() => setSelectedForecastHorizon(h)}
                      className={`cursor-pointer hover:bg-slate-50 transition ${isSel ? 'bg-blue-50/80 font-semibold' : ''}`}
                    >
                      <td className="py-1 px-1.5 font-bold text-slate-800">+{h}H</td>
                      <td className="py-1 px-1.5 font-mono text-slate-600">{formatCoordinates(fc.predicted_center, 2)}</td>
                      <td className="py-1 px-1.5 text-right font-mono text-slate-800">{fc.closest_shoreline_km} km</td>
                      <td className="py-1 px-1.5 text-right">
                        <span
                          className={`text-[9px] font-bold px-1 py-0.2 rounded border ${
                            fc.shoreline_impact_risk === 'HIGH'
                              ? 'text-red-700 bg-red-50 border-red-200'
                              : fc.shoreline_impact_risk === 'MODERATE'
                              ? 'text-amber-700 bg-amber-50 border-amber-200'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          {fc.shoreline_impact_risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Metocean Dynamics Table */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="text-[11px] font-semibold text-gray-700">
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
              <td className="py-1 px-2 text-gray-600 font-mono">{inc.signature.ambient_current_direction_deg}°</td>
              <td className="py-1 px-2 font-semibold text-right text-gray-900 font-mono">{inc.signature.ambient_current_knots} kn</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700 font-medium">Surface wind (NOAA GFS)</td>
              <td className="py-1 px-2 text-gray-600 font-mono">{inc.signature.ambient_wind_direction_deg}°</td>
              <td className="py-1 px-2 font-semibold text-right text-gray-900 font-mono">{inc.signature.ambient_wind_knots} kn</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-700 font-medium">Combined drift resultant</td>
              <td className="py-1 px-2 text-gray-600 font-mono">{inc.signature.drift_direction_deg}°</td>
              <td className="py-1 px-2 font-semibold text-right text-[#1769AA] font-mono">{inc.signature.drift_speed_knots} kn</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Coastal Vulnerability Text */}
      <div className="p-2 text-[11px] leading-relaxed text-gray-600 border-t border-slate-100">
        <strong className="text-gray-800 block mb-0.5">Environmental sensitivity index assessment:</strong>
        The current drift trajectory projects movement parallel to coastal barrier systems. No immediate shoreline stranding is anticipated within 24 hours under prevailing wind forcing.
      </div>
    </div>
  );
};
