import React from 'react';
import {
  X,
  MapPin,
  Satellite,
  Compass,
  Ship,
  ExternalLink,
  Layers,
  Clock,
  ShieldCheck,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Incident } from '../../types';
import { getIncidentStatus } from './analyticsUtils';

interface IncidentDetailDrawerProps {
  incident: Incident | null;
  onClose: () => void;
  onOpenLiveMap: (incident: Incident) => void;
  onOpenAttribution: (incident: Incident) => void;
  onOpenForecast: (incident: Incident) => void;
}

export const IncidentDetailDrawer: React.FC<IncidentDetailDrawerProps> = ({
  incident,
  onClose,
  onOpenLiveMap,
  onOpenAttribution,
  onOpenForecast,
}) => {
  if (!incident) return null;

  const status = getIncidentStatus(incident);
  const primeCand = incident.candidates[0];
  const originBreadcrumb = incident.breadcrumbs[incident.breadcrumbs.length - 1];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-[#CBD5E1] bg-white shadow-2xl select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#CBD5E1] bg-[#17324D] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-tight text-[#38BDF8]">
            {incident.id}
          </span>
          <span
            className={`rounded-xs px-2 py-0.5 text-[10px] font-bold ${
              status === 'Resolved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : status === 'Under investigation'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
            }`}
          >
            {status}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-xs p-1 text-slate-300 hover:bg-[#1C3D5E] hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Name & Region */}
        <div>
          <h2 className="font-sans text-base font-bold text-[#0F172A]">{incident.name}</h2>
          <div className="mt-1 flex items-center gap-2 text-[#475569]">
            <MapPin className="h-3.5 w-3.5 text-[#0284C7]" />
            <span>{incident.region}</span>
            <span>•</span>
            <span className="font-mono">
              {incident.coordinates.lat.toFixed(4)}° N, {Math.abs(incident.coordinates.lng).toFixed(4)}° W
            </span>
          </div>
        </div>

        {/* Quick Transition Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onOpenLiveMap(incident)}
            className="flex items-center justify-center gap-1.5 rounded-sm bg-[#17324D] px-2 py-2 text-xs font-semibold text-white hover:bg-[#1C3D5E] transition shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Live Map</span>
          </button>
          <button
            onClick={() => onOpenAttribution(incident)}
            className="flex items-center justify-center gap-1.5 rounded-sm border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-2 text-xs font-semibold text-[#17324D] hover:bg-[#F1F5F9] transition shadow-2xs"
          >
            <Ship className="h-3.5 w-3.5 text-[#0284C7]" />
            <span>Attribution</span>
          </button>
          <button
            onClick={() => onOpenForecast(incident)}
            className="flex items-center justify-center gap-1.5 rounded-sm border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-2 text-xs font-semibold text-[#17324D] hover:bg-[#F1F5F9] transition shadow-2xs"
          >
            <Compass className="h-3.5 w-3.5 text-[#D97706]" />
            <span>Forecast</span>
          </button>
        </div>

        {/* SAR Acquisition Specs */}
        <div className="rounded-xs border border-[#CBD5E1] bg-[#F8FAFC] p-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
            <span className="font-bold text-[#17324D] uppercase text-[11px] flex items-center gap-1.5">
              <Satellite className="h-3.5 w-3.5 text-[#0284C7]" />
              SAR Satellite Observation Details
            </span>
            <span className="font-mono text-[#0284C7] font-bold text-[10px]">
              {(incident.confidence * 100).toFixed(1)}% CONF
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div>
              <span className="text-[#64748B]">Sensor:</span>{' '}
              <strong className="text-[#1E293B] font-semibold">{incident.satellite}</strong>
            </div>
            <div>
              <span className="text-[#64748B]">Polarization:</span>{' '}
              <strong className="text-[#1E293B] font-semibold">{incident.polarization}</strong>
            </div>
            <div>
              <span className="text-[#64748B]">Acquisition:</span>{' '}
              <strong className="text-[#1E293B] font-semibold">
                {incident.detection_time.slice(0, 16)} UTC
              </strong>
            </div>
            <div>
              <span className="text-[#64748B]">Resolution:</span>{' '}
              <strong className="text-[#1E293B] font-semibold">
                {incident.ml_metrics?.resolution_meters_per_pixel || 10}m / px
              </strong>
            </div>
            <div>
              <span className="text-[#64748B]">Pass Orbit:</span>{' '}
              <strong className="text-[#1E293B] font-semibold">
                {incident.ml_metrics?.orbit_pass || 'DESCENDING'}
              </strong>
            </div>
            <div>
              <span className="text-[#64748B]">Segmentation IoU:</span>{' '}
              <strong className="text-[#10B981] font-semibold">
                {incident.ml_metrics?.iou_score.toFixed(3) || '0.865'}
              </strong>
            </div>
          </div>
        </div>

        {/* Morphology & Signature Breakdown */}
        <div className="rounded-xs border border-[#CBD5E1] bg-white p-3">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-1.5">
            <span className="font-bold text-[#17324D] uppercase text-[11px] flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-[#17324D]" />
              Morphology & Physical Signatures
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between border-b border-[#F8FAFC] py-1">
              <span className="text-[#64748B]">Detected Surface Area:</span>
              <span className="font-mono font-bold text-[#17324D]">{incident.area_km2} km²</span>
            </div>
            <div className="flex justify-between border-b border-[#F8FAFC] py-1">
              <span className="text-[#64748B]">Slick Perimeter:</span>
              <span className="font-mono font-bold text-[#17324D]">
                {incident.signature?.perimeter_km || '24.2'} km
              </span>
            </div>
            <div className="flex justify-between border-b border-[#F8FAFC] py-1">
              <span className="text-[#64748B]">Mean Slick Age:</span>
              <span className="font-mono font-bold text-[#D97706]">
                {incident.estimated_age_mean} hours
              </span>
            </div>
            <div className="flex justify-between border-b border-[#F8FAFC] py-1">
              <span className="text-[#64748B]">Thickness Proxy:</span>
              <span className="font-mono font-bold text-[#1E293B]">
                {incident.signature?.thickness_proxy || 'MODERATE'}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#F8FAFC] py-1">
              <span className="text-[#64748B]">Shape Elongation:</span>
              <span className="font-mono font-bold text-[#1E293B]">
                {incident.signature?.shape_elongation || '3.4'} : 1
              </span>
            </div>
            <div className="flex justify-between border-b border-[#F8FAFC] py-1">
              <span className="text-[#64748B]">SAR Contrast Ratio:</span>
              <span className="font-mono font-bold text-[#1E293B]">
                {incident.signature?.sar_contrast_ratio || '-24.2'} dB
              </span>
            </div>
          </div>
        </div>

        {/* Reconstructed Drift Origin (Hindcast) */}
        <div className="rounded-xs border border-[#CBD5E1] bg-[#F8FAFC] p-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
            <span className="font-bold text-[#17324D] uppercase text-[11px] flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[#0284C7]" />
              Reverse-Drift Hindcast Origin
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">HYCOM + GFS</span>
          </div>

          <div className="mt-2.5 font-mono text-[11px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Calculated Origin:</span>
              <span className="font-bold text-[#0F172A]">
                {originBreadcrumb
                  ? `${originBreadcrumb.lat.toFixed(4)}° N, ${Math.abs(originBreadcrumb.lng).toFixed(4)}° W`
                  : 'Derived centroid'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Spill Window:</span>
              <span className="text-[#334155]">
                {incident.spill_window_start.slice(11, 16)} to {incident.spill_window_end.slice(11, 16)} UTC
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Ambient Current:</span>
              <span className="text-[#334155]">
                {incident.signature?.ambient_current_knots} kn @ {incident.signature?.ambient_current_direction_deg}°
              </span>
            </div>
          </div>
        </div>

        {/* Prime Candidate Vessel */}
        {primeCand ? (
          <div className="rounded-xs border border-[#CBD5E1] bg-white p-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-1.5">
              <span className="font-bold text-[#17324D] uppercase text-[11px] flex items-center gap-1.5">
                <Ship className="h-3.5 w-3.5 text-[#10B981]" />
                Primary AIS Candidate Vessel
              </span>
              <span className="rounded-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 font-mono font-bold text-[10px]">
                Score: {primeCand.attribution_score}%
              </span>
            </div>

            <div className="mt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F172A] text-sm">{primeCand.vessel_name}</span>
                <span className="font-mono text-[#64748B] text-[11px]">IMO {primeCand.imo}</span>
              </div>
              <div className="mt-1 text-[#475569] font-mono text-[11px]">
                Flag: <strong className="text-[#1E293B]">{primeCand.flag}</strong> | Type: <strong className="text-[#1E293B]">{primeCand.vessel_type}</strong>
              </div>

              {/* Attribution Factors Breakdown */}
              <div className="mt-3 border-t border-[#F1F5F9] pt-2 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Spatial Proximity:</span>
                  <span className="font-bold text-[#0284C7]">{primeCand.breakdown.spatio_temporal_proximity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Trajectory Consistency:</span>
                  <span className="font-bold text-[#0284C7]">{primeCand.breakdown.trajectory_consistency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Spill Window Overlap:</span>
                  <span className="font-bold text-[#0284C7]">{primeCand.breakdown.spill_window_overlap}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Behavior Anomaly:</span>
                  <span className="font-bold text-[#D97706]">{primeCand.breakdown.behavior_anomaly}%</span>
                </div>
              </div>

              {/* Why This Vessel */}
              {primeCand.why_this_vessel && primeCand.why_this_vessel.length > 0 && (
                <div className="mt-2.5 rounded-xs bg-[#EFF6FF] border border-[#BFDBFE] p-2 text-[11px] text-[#1E40AF]">
                  <ul className="list-disc pl-3.5 space-y-0.5">
                    {primeCand.why_this_vessel.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xs border border-[#CBD5E1] bg-[#F8FAFC] p-3 text-center text-[#64748B] italic">
            No AIS candidate vessel currently attributed.
          </div>
        )}
      </div>
    </div>
  );
};
