import React from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { formatUtcDateTime, formatCoordinates } from '../../utils/formatting';

export const DetectionPanel: React.FC = () => {
  const { getActiveIncident, setActiveMode } = usePoseidonStore();
  const inc = getActiveIncident();

  const confPercent = Math.round(inc.confidence * 100);
  const lookAlikePercent = Math.round(inc.look_alike.look_alike_probability * 100);

  // Age timeline position (0h - 24h)
  const ageMarkerPercent = Math.min(
    100,
    Math.max(0, (inc.estimated_age_mean / 24) * 100)
  );

  return (
    <div className="space-y-4 p-3.5 text-xs text-gray-800 bg-white">
      {/* 1. Incident Overview Header */}
      <div className="rounded border border-[#D1D5DB] bg-[#F8FAFC] p-3" style={{ borderRadius: '4px' }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            Active incident
          </span>
          <span className="rounded bg-white border border-[#D1D5DB] px-1.5 py-0.5 text-[10px] text-gray-700 font-mono">
            {inc.satellite}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <h2 className="font-mono text-base font-bold text-[#17324D]">
            {inc.id}
          </h2>
          <span className="font-mono text-[11px] text-gray-600">
            {formatCoordinates(inc.coordinates, 2)}
          </span>
        </div>
        <p className="text-xs text-gray-700 mt-0.5">{inc.name}</p>
      </div>

      {/* 2. ESTIMATED SPILL AGE - FIRST-CLASS SCIENTIFIC SECTION (Section 15) */}
      <div className="rounded border border-[#D1D5DB] bg-white p-3 space-y-2.5" style={{ borderRadius: '4px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#17324D] font-bold text-xs">
            <Clock className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>Estimated spill age</span>
          </div>
          <span className="text-[11px] text-gray-500">
            Confidence: 82%
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <div className="text-xl font-bold text-[#17324D]">
            {inc.estimated_age_hours_min}–{inc.estimated_age_hours_max} hours
          </div>
          <div className="text-[11px] text-gray-600">
            Mean: <span className="font-semibold text-gray-900">{inc.estimated_age_mean}h</span>
          </div>
        </div>

        {/* Clean Operational Timeline */}
        <div className="pt-1">
          <div className="relative h-2 w-full rounded bg-[#E2E8F0]">
            {/* Spill age uncertainty range */}
            <div
              className="absolute top-0 bottom-0 bg-[#BFDBFE] rounded"
              style={{
                left: `${(inc.estimated_age_hours_min / 24) * 100}%`,
                width: `${
                  ((inc.estimated_age_hours_max - inc.estimated_age_hours_min) / 24) * 100
                }%`,
              }}
            />
            {/* Age Marker Pointer */}
            <div
              className="absolute top-1/2 -mt-2 -ml-1 h-4 w-2 bg-[#1769AA] rounded-xs shadow-xs"
              style={{ left: `${ageMarkerPercent}%` }}
              title={`Estimated Age: ${inc.estimated_age_mean}h`}
            />
          </div>

          <div className="mt-1.5 flex justify-between text-[10px] text-gray-500 font-mono">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>

        {/* Estimated Spill Release Window */}
        <div className="mt-2 rounded border border-[#E5E7EB] bg-[#F8FAFC] p-2 text-xs">
          <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
            Estimated release window
          </div>
          <div className="flex items-center justify-between text-gray-800 font-medium">
            <span>{formatUtcDateTime(inc.spill_window_start)}</span>
            <ArrowRight className="h-3 w-3 text-gray-400 mx-1 shrink-0" />
            <span>{formatUtcDateTime(inc.spill_window_end)}</span>
          </div>
        </div>
      </div>

      {/* 3. SPILL CHARACTERISTICS (Section 16: Clean Scientific Table) */}
      <div className="rounded border border-[#D1D5DB] bg-white p-3 space-y-2" style={{ borderRadius: '4px' }}>
        <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
          Spill characteristics
        </div>

        <table className="gis-table text-xs">
          <thead>
            <tr>
              <th className="py-1 px-2 text-[11px]">Parameter</th>
              <th className="py-1 px-2 text-[11px] text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 px-2 text-gray-600">Area</td>
              <td className="py-1 px-2 font-semibold text-right text-gray-900">{inc.area_km2.toFixed(1)} km²</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Relative thickness</td>
              <td className="py-1 px-2 font-medium text-right text-gray-900">{inc.signature.thickness_proxy}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Emulsification</td>
              <td className="py-1 px-2 font-medium text-right text-gray-900">{inc.signature.emulsification_proxy}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">SAR contrast</td>
              <td className="py-1 px-2 font-medium text-right text-gray-900">{inc.signature.sar_contrast_ratio.toFixed(1)} dB</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Drift direction</td>
              <td className="py-1 px-2 font-medium text-right text-gray-900">{inc.signature.drift_direction_deg}° @ {inc.signature.drift_speed_knots} kn</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Ambient wind</td>
              <td className="py-1 px-2 font-medium text-right text-gray-900">{inc.signature.ambient_wind_knots} kn</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Ambient current</td>
              <td className="py-1 px-2 font-medium text-right text-gray-900">{inc.signature.ambient_current_knots} kn</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. LOOK-ALIKE ANALYSIS */}
      <div className="rounded border border-[#D1D5DB] bg-white p-3 space-y-2" style={{ borderRadius: '4px' }}>
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 uppercase tracking-wide">
          <span>Look-alike analysis</span>
          <span className="text-gray-500 font-normal">{lookAlikePercent}% False alarm risk</span>
        </div>

        {/* Probability Split Visualizer */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-semibold text-[#287D3C]">Oil slick signature: {confPercent}%</span>
            <span className="text-gray-600">Look-alike: {lookAlikePercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded bg-gray-200 overflow-hidden flex">
            <div
              className="bg-[#287D3C] h-full"
              style={{ width: `${confPercent}%` }}
            />
            <div
              className="bg-[#C47A00] h-full"
              style={{ width: `${lookAlikePercent}%` }}
            />
          </div>
        </div>

        {/* Factors Checklist */}
        <div className="space-y-1.5 pt-1">
          {inc.look_alike.evidence_factors.map((factor) => (
            <div key={factor.name} className="flex items-start gap-2 text-xs">
              {factor.passed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#287D3C] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-medium text-gray-800">{factor.name}</span>
                <span className="text-gray-500 text-[11px] block leading-tight">
                  {factor.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HINDCAST ORIGIN TRAIL */}
      <div className="rounded border border-[#D1D5DB] bg-white p-3 space-y-2" style={{ borderRadius: '4px' }}>
        <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
          Hindcast drift trail (backward reconstruction)
        </div>
        <div className="space-y-1 text-xs">
          {inc.breadcrumbs.map((b) => (
            <div
              key={b.label}
              className="flex items-center justify-between rounded bg-[#F8FAFC] px-2 py-1 border border-[#E5E7EB]"
              style={{ borderRadius: '3px' }}
            >
              <span className="font-medium text-gray-800">{b.label}</span>
              <span className="text-gray-500 font-mono text-[11px]">
                {b.lat.toFixed(2)}° N, {Math.abs(b.lng).toFixed(2)}° W
              </span>
              <span className="text-gray-700 font-semibold text-[11px]">
                {Math.round(b.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Investigation Actions */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => setActiveMode('attribution')}
          className="flex flex-col items-center justify-center rounded border border-[#D1D5DB] bg-[#F8FAFC] p-2 text-gray-800 hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition font-medium text-xs"
          style={{ borderRadius: '4px' }}
        >
          <span>Attribution</span>
          <span className="text-[10px] text-gray-500">Candidate vessels</span>
        </button>

        <button
          onClick={() => setActiveMode('forecast')}
          className="flex flex-col items-center justify-center rounded border border-[#D1D5DB] bg-[#F8FAFC] p-2 text-gray-800 hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition font-medium text-xs"
          style={{ borderRadius: '4px' }}
        >
          <span>Forecast</span>
          <span className="text-[10px] text-gray-500">Drift model</span>
        </button>

        <button
          onClick={() => setActiveMode('evidence')}
          className="flex flex-col items-center justify-center rounded border border-[#D1D5DB] bg-[#F8FAFC] p-2 text-gray-800 hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition font-medium text-xs"
          style={{ borderRadius: '4px' }}
        >
          <span>Evidence</span>
          <span className="text-[10px] text-gray-500">SAR & ML report</span>
        </button>
      </div>
    </div>
  );
};
