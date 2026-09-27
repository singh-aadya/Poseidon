import React from 'react';
import { Ship, Filter, Flag, AlertOctagon, ArrowRight } from 'lucide-react';
import { getAisHistoricalAnalytics } from './analyticsUtils';
import { Incident } from '../../types';

interface AisHistoricalAnalyticsSectionProps {
  incidents: Incident[];
}

export const AisHistoricalAnalyticsSection: React.FC<AisHistoricalAnalyticsSectionProps> = ({
  incidents,
}) => {
  const ais = getAisHistoricalAnalytics(incidents);

  return (
    <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
        <div className="flex items-center gap-2">
          <Ship className="h-4 w-4 text-[#17324D]" />
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
            AIS Historical Analytics & Traffic Correlation
          </h3>
        </div>
        <span className="text-[11px] text-[#64748B] font-mono">
          Spire & exactEarth Feeds
        </span>
      </div>

      {/* 1. Candidate Attribution Funnel */}
      <div className="mt-3.5 border-b border-[#F1F5F9] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
          Candidate Vessel Evaluation Funnel
        </span>
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {ais.funnel.map((step, idx) => (
            <div
              key={step.step}
              className="relative flex flex-col justify-between rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 shadow-2xs"
            >
              <div className="text-[10px] uppercase font-bold text-[#64748B] flex items-center justify-between">
                <span>Stage {idx + 1}</span>
                {idx < 4 && <ArrowRight className="h-3 w-3 text-[#94A3B8]" />}
              </div>
              <div className="mt-2 font-mono text-xl font-extrabold text-[#17324D]">
                {step.value.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] text-[#475569] leading-tight font-medium">
                {step.step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 & 3 & 4 Grid: Vessel Types, Flag States, Behavioral Anomalies */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vessel Types */}
        <div className="rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
            <span className="font-bold text-[#17324D] uppercase text-[11px]">
              Vessel Categories Implicated
            </span>
            <span className="text-[10px] text-[#64748B]">Share</span>
          </div>
          <div className="mt-2 space-y-2">
            {ais.vesselTypes.slice(0, 6).map((vt) => (
              <div key={vt.type}>
                <div className="flex justify-between text-[11px] text-[#334155] mb-0.5">
                  <span className="truncate max-w-[170px]">{vt.type}</span>
                  <span className="font-mono font-bold text-[#0F172A]">
                    {vt.count} ({vt.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-xs bg-[#E2E8F0]">
                  <div
                    className="h-full rounded-xs bg-[#0284C7]"
                    style={{ width: `${vt.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flag States */}
        <div className="rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
            <span className="font-bold text-[#17324D] uppercase text-[11px]">
              Top Candidate Flag States
            </span>
            <Flag className="h-3 w-3 text-[#64748B]" />
          </div>
          <div className="mt-2 space-y-2 font-mono text-[11px]">
            {ais.topFlags.map((fl) => (
              <div
                key={fl.flag}
                className="flex items-center justify-between border-b border-[#F1F5F9] pb-1"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-xs bg-[#E2E8F0] px-1.5 py-0.2 text-[10px] font-bold text-[#1E293B]">
                    {fl.code}
                  </span>
                  <span className="text-[#334155] font-sans text-xs">{fl.flag}</span>
                </div>
                <span className="font-bold text-[#0F172A]">{fl.count} vessels</span>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Anomalies */}
        <div className="rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
            <span className="font-bold text-[#17324D] uppercase text-[11px]">
              Behavioral Anomaly Signals
            </span>
            <AlertOctagon className="h-3 w-3 text-[#EF4444]" />
          </div>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#475569]">Speed Reductions (&gt;3 kn):</span>
              <span className="font-mono font-bold text-[#EF4444] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-xs">
                {ais.anomalies.speedReductionPct}% of cases
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#475569]">Course Deflections (&gt;25°):</span>
              <span className="font-mono font-bold text-[#D97706] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-xs">
                {ais.anomalies.courseDeviationPct}% of cases
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#475569]">Loitering Events (&gt;30 min):</span>
              <span className="font-mono font-bold text-[#D97706] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-xs">
                {ais.anomalies.loiteringPct}% of cases
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#475569]">Recorded AIS Telemetry Gaps:</span>
              <span className="font-mono font-bold text-[#0F172A] bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded-xs">
                {ais.anomalies.aisGapPct}% of cases
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
