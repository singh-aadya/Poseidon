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
  const {
    getActiveIncident,
    setActiveMode,
    setSatelliteComparison,
    setMapIntelligenceMode,
    demoInvestigation,
  } = usePoseidonStore();
  const inc = getActiveIncident();

  const confPercent = Math.round(inc.confidence * 100);
  const lookAlikePercent = Math.round(inc.look_alike.look_alike_probability * 100);

  const isScene1 = demoInvestigation.isActive && demoInvestigation.currentStep === 1;
  const isScene3 = demoInvestigation.isActive && demoInvestigation.currentStep === 3;

  // Age timeline position (0h - 24h)
  const ageMarkerPercent = Math.min(
    100,
    Math.max(0, (inc.estimated_age_mean / 24) * 100)
  );

  return (
    <div className="p-4 space-y-4 text-xs text-gray-800 bg-white">
      {/* 1. Incident Overview Header (Visual Dominance: Incident ID, Confidence, Area) */}
      <div className={`border-b border-[#E5E7EB] pb-3.5 transition-all ${isScene1 ? 'ring-2 ring-[#B91C1C] rounded-sm p-2 bg-[#FEF2F2]' : ''}`}>
        {isScene1 && (
          <div className="mb-2 flex items-center justify-between rounded-xs bg-[#B91C1C] px-2 py-0.5 text-white text-[10px] font-mono font-bold animate-pulse">
            <span>● NEW SATELLITE DETECTION</span>
            <span>{inc.area_km2} km² • {confPercent}% CONF</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-500">
            Active incident
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            {inc.satellite} • {inc.polarization}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <h2 className="font-mono text-base font-bold text-[#17324D]">
            {inc.id}
          </h2>
          <span className="text-xs font-bold text-[#1769AA] font-mono">
            {confPercent}% confidence
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-0.5">
          <p className="text-xs text-gray-700 font-medium">{inc.name}</p>
          <span className="font-mono text-[10px] text-gray-500">
            {formatCoordinates(inc.coordinates, 2)}
          </span>
        </div>
      </div>

      {/* 2. ESTIMATED SPILL AGE (Visual Dominance #3) */}
      <div className={`border-b border-[#E5E7EB] pb-3.5 space-y-2 transition-all ${isScene3 ? 'ring-2 ring-[#0284C7] rounded-sm p-2 bg-[#EFF6FF]' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-900 font-semibold text-xs">
            <Clock className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>Estimated spill age</span>
          </div>
          <span className="text-[11px] text-gray-500">
            Confidence: 82%
          </span>
        </div>

        {isScene3 && (
          <div className="rounded-xs bg-[#DBEAFE] border border-[#BFDBFE] p-1.5 text-[11px] text-[#1E40AF]">
            <strong>Estimated from SAR characteristics and temporal observations</strong>
          </div>
        )}

        <div className="flex items-baseline justify-between pt-0.5">
          <div className="text-lg font-bold text-[#17324D]">
            {inc.estimated_age_hours_min}–{inc.estimated_age_hours_max} hours
          </div>
          <div className="text-[11px] text-gray-600">
            Mean: <span className="font-semibold text-gray-900 font-mono">{inc.estimated_age_mean}h</span>
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

          <div className="mt-1 flex justify-between text-[10px] text-gray-500 font-mono">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>

        {/* Estimated Spill Release Window */}
        <div className="pt-1.5 flex items-center justify-between text-[11px] text-gray-600">
          <span className="text-gray-500">Release window</span>
          <div className="flex items-center gap-1 font-mono text-[11px] font-medium text-gray-800">
            <span>{formatUtcDateTime(inc.spill_window_start).slice(5)}</span>
            <ArrowRight className="h-3 w-3 text-gray-400 shrink-0" />
            <span>{formatUtcDateTime(inc.spill_window_end).slice(5)}</span>
          </div>
        </div>
      </div>

      {/* 3. SPILL CHARACTERISTICS (Priority 17: Clean Two-Column Scientific Table) */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="text-[11px] font-semibold text-gray-700">
          Spill characteristics
        </div>

        <table className="gis-table text-xs">
          <tbody>
            <tr>
              <td className="py-1 px-2 text-gray-600">Area</td>
              <td className="py-1 px-2 font-bold text-right text-gray-900 font-mono">{inc.area_km2.toFixed(1)} km²</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Relative thickness</td>
              <td className="py-1 px-2 font-medium text-right text-gray-800">Sheen / Moderate</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Emulsification</td>
              <td className="py-1 px-2 font-medium text-right text-gray-800">{inc.signature.emulsification_proxy}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">SAR contrast</td>
              <td className="py-1 px-2 font-medium text-right text-gray-800 font-mono">{inc.signature.sar_contrast_ratio.toFixed(1)} dB</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Drift direction</td>
              <td className="py-1 px-2 font-medium text-right text-gray-800 font-mono">{inc.signature.drift_direction_deg}° @ {inc.signature.drift_speed_knots} kn</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Ambient wind</td>
              <td className="py-1 px-2 font-medium text-right text-gray-800 font-mono">{inc.signature.ambient_wind_knots} kn</td>
            </tr>
            <tr>
              <td className="py-1 px-2 text-gray-600">Ambient current</td>
              <td className="py-1 px-2 font-medium text-right text-gray-800 font-mono">{inc.signature.ambient_current_knots} kn</td>
            </tr>
          </tbody>
        </table>

        {/* 3-Step Satellite Verification Workflow */}
        <div className="pt-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            3-Step Satellite Verification
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                setSatelliteComparison({ mode: 'after' });
                setMapIntelligenceMode('satellite');
              }}
              className="rounded-xs border border-slate-300 bg-white p-1 text-center hover:bg-slate-50 transition"
            >
              <div className="font-bold text-[10px] text-slate-800">1. Raw SAR</div>
              <div className="text-[9px] text-slate-500 font-mono">-24.8 dB</div>
            </button>
            <button
              onClick={() => {
                setSatelliteComparison({ mode: 'mask' });
                setMapIntelligenceMode('satellite');
              }}
              className="rounded-xs border border-slate-300 bg-white p-1 text-center hover:bg-slate-50 transition"
            >
              <div className="font-bold text-[10px] text-slate-800">2. Mask</div>
              <div className="text-[9px] text-slate-500 font-mono">IoU 0.912</div>
            </button>
            <button
              onClick={() => {
                setSatelliteComparison({ mode: 'overlay' });
                setMapIntelligenceMode('operational');
              }}
              className="rounded-xs border border-slate-300 bg-white p-1 text-center hover:bg-slate-50 transition"
            >
              <div className="font-bold text-[10px] text-slate-800">3. Slick</div>
              <div className="text-[9px] text-slate-500 font-mono">18.6 km²</div>
            </button>
          </div>
        </div>

        {/* SAR Sensor Physics Parameters */}
        <div className="rounded-sm border border-slate-200 bg-slate-50 p-2 space-y-1 text-[11px] mt-2">
          <div className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-200 pb-0.5">
            SAR Sensor Physics & Calibration
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <div><span className="text-slate-500">Frequency:</span> <strong className="font-mono text-slate-800">C-Band (5.405 GHz)</strong></div>
            <div><span className="text-slate-500">Incidence:</span> <strong className="font-mono text-slate-800">38.4° (Mid-swath)</strong></div>
            <div><span className="text-slate-500">Polarization:</span> <strong className="font-mono text-slate-800">VV (Copolarized)</strong></div>
            <div><span className="text-slate-500">Dampening:</span> <strong className="font-mono text-emerald-700">12.7 dB Delta</strong></div>
          </div>
        </div>
      </div>

      {/* 4. LOOK-ALIKE ANALYSIS */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
          <span>Look-alike analysis</span>
          <span className="text-gray-500 font-normal font-mono">{lookAlikePercent}% False alarm risk</span>
        </div>

        {/* Probability Split Bar */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-semibold text-[#287D3C]">Oil slick signature: {confPercent}%</span>
            <span className="text-gray-500">Look-alike: {lookAlikePercent}%</span>
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
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="text-[11px] font-semibold text-gray-700">
          Hindcast drift trail (backward reconstruction)
        </div>
        <div className="space-y-1 text-xs">
          {inc.breadcrumbs.map((b) => (
            <div
              key={b.label}
              className="flex items-center justify-between py-1 px-2 rounded-sm bg-slate-50 border border-slate-200"
            >
              <span className="font-medium text-gray-800">{b.label}</span>
              <span className="text-gray-500 font-mono text-[11px]">
                {b.lat.toFixed(2)}° N, {Math.abs(b.lng).toFixed(2)}° W
              </span>
              <span className="text-gray-700 font-semibold text-[11px] font-mono">
                {Math.round(b.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => setActiveMode('attribution')}
          className="flex flex-col items-center justify-center rounded-sm border border-[#D1D5DB] bg-white p-2 text-gray-800 hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition font-medium text-xs shadow-2xs"
        >
          <span className="font-semibold">Attribution</span>
          <span className="text-[10px] text-gray-500">Source candidates</span>
        </button>

        <button
          onClick={() => setActiveMode('forecast')}
          className="flex flex-col items-center justify-center rounded-sm border border-[#D1D5DB] bg-white p-2 text-gray-800 hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition font-medium text-xs shadow-2xs"
        >
          <span className="font-semibold">Forecast</span>
          <span className="text-[10px] text-gray-500">Drift trajectory</span>
        </button>

        <button
          onClick={() => setActiveMode('evidence')}
          className="flex flex-col items-center justify-center rounded-sm border border-[#D1D5DB] bg-white p-2 text-gray-800 hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition font-medium text-xs shadow-2xs"
        >
          <span className="font-semibold">Evidence</span>
          <span className="text-[10px] text-gray-500">SAR & ML report</span>
        </button>
      </div>
    </div>
  );
};
