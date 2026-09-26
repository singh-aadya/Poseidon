import React, { useState } from 'react';
import { X, ArrowRight, GitCompare, Check, AlertCircle } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { Incident } from '../../types';

export const IncidentComparisonModal: React.FC = () => {
  const {
    incidents,
    comparedIncidentIds,
    setComparedIncidentIds,
    setActiveIncidentId,
  } = usePoseidonStore();

  const [idA, setIdA] = useState<string>(comparedIncidentIds ? comparedIncidentIds[0] : incidents[0]?.id || '');
  const [idB, setIdB] = useState<string>(
    comparedIncidentIds ? comparedIncidentIds[1] : incidents[1]?.id || incidents[0]?.id || ''
  );

  if (!comparedIncidentIds) return null;

  const incA: Incident | undefined = incidents.find((i) => i.id === idA) || incidents[0];
  const incB: Incident | undefined = incidents.find((i) => i.id === idB) || incidents[1] || incidents[0];

  const candidateA = incA?.candidates[0];
  const candidateB = incB?.candidates[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 animate-in fade-in duration-150">
      <div className="flex w-full max-w-4xl flex-col rounded-sm border border-slate-300 bg-white shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#17324D] px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-cyan-400" />
            <h2 className="font-sans text-sm font-bold tracking-tight">Spatio-Temporal Incident Comparison</h2>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-cyan-200">
              Comparative Analysis
            </span>
          </div>
          <button
            onClick={() => setComparedIncidentIds(null)}
            className="rounded-xs p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Incident Selectors */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 bg-slate-50 p-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Primary Target Incident (A)
            </label>
            <select
              value={idA}
              onChange={(e) => setIdA(e.target.value)}
              className="w-full rounded-sm border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 font-sans focus:outline-hidden focus:border-[#1769AA]"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} — {inc.name} ({inc.area_km2.toFixed(1)} km²)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Reference Incident (B)
            </label>
            <select
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              className="w-full rounded-sm border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 font-sans focus:outline-hidden focus:border-[#1769AA]"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} — {inc.name} ({inc.area_km2.toFixed(1)} km²)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Data Matrix */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <table className="gis-table text-xs w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-2 px-3 text-left w-1/3">Metric / Parameter</th>
                <th className="py-2 px-3 text-left w-1/3 text-[#17324D] font-bold">{incA.id}</th>
                <th className="py-2 px-3 text-left w-1/3 text-slate-700 font-bold">{incB.id}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">Location / Region</td>
                <td className="py-2 px-3 font-medium text-slate-900">{incA.name} ({incA.region})</td>
                <td className="py-2 px-3 font-medium text-slate-900">{incB.name} ({incB.region})</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">Estimated Slick Area</td>
                <td className="py-2 px-3 font-mono font-bold text-slate-900">{incA.area_km2.toFixed(1)} km²</td>
                <td className="py-2 px-3 font-mono font-bold text-slate-900">{incB.area_km2.toFixed(1)} km²</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">Detection Confidence</td>
                <td className="py-2 px-3 font-mono text-[#1769AA] font-bold">{(incA.confidence * 100).toFixed(0)}%</td>
                <td className="py-2 px-3 font-mono text-[#1769AA] font-bold">{(incB.confidence * 100).toFixed(0)}%</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">Severity Classification</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    incA.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {incA.severity}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    incB.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {incB.severity}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">Spill Age Estimate</td>
                <td className="py-2 px-3 font-mono">{incA.estimated_age_hours_min}–{incA.estimated_age_hours_max}h (mean {incA.estimated_age_mean}h)</td>
                <td className="py-2 px-3 font-mono">{incB.estimated_age_hours_min}–{incB.estimated_age_hours_max}h (mean {incB.estimated_age_mean}h)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">SAR Sensor & Polarization</td>
                <td className="py-2 px-3 text-slate-800">{incA.satellite} ({incA.polarization})</td>
                <td className="py-2 px-3 text-slate-800">{incB.satellite} ({incB.polarization})</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">SAR Contrast Ratio</td>
                <td className="py-2 px-3 font-mono font-semibold text-slate-800">{incA.signature.sar_contrast_ratio.toFixed(1)} dB</td>
                <td className="py-2 px-3 font-mono font-semibold text-slate-800">{incB.signature.sar_contrast_ratio.toFixed(1)} dB</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">Prime Source Candidate</td>
                <td className="py-2 px-3">
                  <div className="font-bold text-slate-900">{candidateA?.vessel_name || 'None'}</div>
                  <div className="text-[11px] text-[#1769AA] font-mono">Attribution: {candidateA?.attribution_score || 0}%</div>
                </td>
                <td className="py-2 px-3">
                  <div className="font-bold text-slate-900">{candidateB?.vessel_name || 'None'}</div>
                  <div className="text-[11px] text-[#1769AA] font-mono">Attribution: {candidateB?.attribution_score || 0}%</div>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">Shoreline Impact Risk (48h)</td>
                <td className="py-2 px-3 font-semibold text-slate-800">{incA.forecasts[48]?.shoreline_impact_risk || 'N/A'}</td>
                <td className="py-2 px-3 font-semibold text-slate-800">{incB.forecasts[48]?.shoreline_impact_risk || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-slate-600 font-semibold">Metocean Conditions</td>
                <td className="py-2 px-3 text-[11px] text-slate-700">
                  Wind {incA.signature.ambient_wind_knots}kt ({incA.signature.ambient_wind_direction_deg}°) · Cur {incA.signature.ambient_current_knots}kt ({incA.signature.ambient_current_direction_deg}°)
                </td>
                <td className="py-2 px-3 text-[11px] text-slate-700">
                  Wind {incB.signature.ambient_wind_knots}kt ({incB.signature.ambient_wind_direction_deg}°) · Cur {incB.signature.ambient_current_knots}kt ({incB.signature.ambient_current_direction_deg}°)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <span className="text-[11px] text-slate-500">
            Click to set active investigation focus in main map workstation:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveIncidentId(incA.id);
                setComparedIncidentIds(null);
              }}
              className="rounded-xs border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition"
            >
              Focus {incA.id}
            </button>
            <button
              onClick={() => {
                setActiveIncidentId(incB.id);
                setComparedIncidentIds(null);
              }}
              className="rounded-xs bg-[#17324D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1f4060] transition shadow-xs"
            >
              Focus {incB.id}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
