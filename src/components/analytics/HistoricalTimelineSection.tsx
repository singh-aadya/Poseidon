import React from 'react';
import { History, Ship, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { Incident } from '../../types';
import { getIncidentStatus } from './analyticsUtils';

interface HistoricalTimelineSectionProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident) => void;
  onViewInLiveMap: (inc: Incident) => void;
}

export const HistoricalTimelineSection: React.FC<HistoricalTimelineSectionProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onViewInLiveMap,
}) => {
  // Sort descending by detection_time
  const sorted = [...incidents].sort(
    (a, b) => new Date(b.detection_time).getTime() - new Date(a.detection_time).getTime()
  );

  return (
    <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs select-none">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#17324D]" />
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
            Chronological Incident Timeline Archive (2024–2026)
          </h3>
        </div>
        <span className="text-[11px] text-[#64748B] font-mono">
          {sorted.length} events logged
        </span>
      </div>

      {/* Horizontal / Vertical scrollable timeline */}
      <div className="mt-3.5 space-y-2 max-h-96 overflow-y-auto pr-1.5">
        {sorted.map((inc) => {
          const isSelected = selectedIncident?.id === inc.id;
          const status = getIncidentStatus(inc);
          const primeCand = inc.candidates[0];

          return (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xs border p-3 cursor-pointer transition ${
                isSelected
                  ? 'border-[#0284C7] bg-[#F0F9FF] shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              {/* Left Column: Date & Identity */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center justify-center rounded-xs bg-[#17324D] px-2.5 py-1.5 text-white font-mono text-center shrink-0">
                  <span className="text-[9px] uppercase tracking-wider text-slate-300">
                    {new Date(inc.detection_time).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    {new Date(inc.detection_time).getUTCDate()}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {new Date(inc.detection_time).getUTCFullYear()}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#17324D] group-hover:text-[#0284C7] transition">
                      {inc.id}
                    </span>
                    <span className="rounded-xs bg-[#E2E8F0] px-1.5 py-0.2 text-[10px] font-medium text-[#475569]">
                      {inc.region}
                    </span>
                    <span
                      className={`rounded-xs px-1.5 py-0.2 text-[10px] font-semibold ${
                        status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : status === 'Under investigation'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mt-1 font-sans text-xs font-semibold text-[#0F172A]">
                    {inc.name}
                  </div>

                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[#64748B] font-mono">
                    <span>
                      Observed: {new Date(inc.detection_time).toISOString().slice(11, 16)} UTC
                    </span>
                    <span>•</span>
                    <span className="text-[#0284C7] font-semibold">{inc.area_km2} km²</span>
                    <span>•</span>
                    <span>Age: {inc.estimated_age_mean}h</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Candidate Attribution & Actions */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#F1F5F9]">
                {primeCand ? (
                  <div className="flex items-center gap-1.5 text-xs text-right">
                    <Ship className="h-3 w-3 text-[#64748B]" />
                    <span className="font-medium text-[#1E293B]">{primeCand.vessel_name}</span>
                    <span
                      className={`font-mono text-[11px] font-bold px-1.5 py-0.2 rounded-xs ${
                        primeCand.attribution_score >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : primeCand.attribution_score >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {primeCand.attribution_score}%
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#94A3B8] italic">No AIS candidate</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewInLiveMap(inc);
                    }}
                    className="flex items-center gap-1 rounded-xs border border-[#CBD5E1] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#17324D] hover:bg-[#F8FAFC] transition shadow-2xs"
                    title="Open on live map"
                  >
                    <ExternalLink className="h-2.5 w-2.5 text-[#0284C7]" />
                    <span>Live Map</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
