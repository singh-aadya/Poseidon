import React from 'react';
import { AlertCircle, Waves, Clock, Ship, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface AnalyticsKpiStripProps {
  metrics: {
    totalIncidents: number;
    allIncidentsCount: number;
    totalAreaKm2: number;
    avgAgeHours: number;
    minAgeHours: number;
    maxAgeHours: number;
    candidateVesselsEvaluated: number;
  };
}

export const AnalyticsKpiStrip: React.FC<AnalyticsKpiStripProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
      {/* 1. Total Detected Incidents */}
      <div className="relative flex flex-col justify-between rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs hover:border-[#94A3B8] transition">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Total Detected Incidents
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-[#F1F5F9] text-[#17324D]">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-extrabold text-[#17324D] tracking-tight">
            {metrics.totalIncidents}
          </span>
          <span className="font-mono text-xs text-[#64748B]">
            / {metrics.allIncidentsCount} in catalog
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-[#F1F5F9] pt-2 text-[11px]">
          <span className="text-[#64748B]">Trend vs Prior Period:</span>
          <span className="inline-flex items-center gap-0.5 font-mono font-medium text-[#0284C7]">
            <ArrowUpRight className="h-3 w-3" />
            +8.4% (Multi-pass)
          </span>
        </div>
      </div>

      {/* 2. Total Detected Slick Area */}
      <div className="relative flex flex-col justify-between rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs hover:border-[#94A3B8] transition">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Total Slick Area
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-[#EFF6FF] text-[#0284C7]">
            <Waves className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-extrabold text-[#17324D] tracking-tight">
            {metrics.totalAreaKm2.toFixed(1)}
          </span>
          <span className="font-mono text-sm font-semibold text-[#0284C7]">km²</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-[#F1F5F9] pt-2 text-[11px]">
          <span className="text-[#64748B]">Surface Oil Footprint:</span>
          <span className="inline-flex items-center gap-0.5 font-mono font-medium text-[#475569]">
            <Minus className="h-3 w-3 text-[#94A3B8]" />
            Cumulative SAR mask
          </span>
        </div>
      </div>

      {/* 3. Average Slick Age at Detection */}
      <div className="relative flex flex-col justify-between rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs hover:border-[#94A3B8] transition">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Average Slick Age
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-[#FEF3C7] text-[#D97706]">
            <Clock className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-extrabold text-[#17324D] tracking-tight">
            {metrics.avgAgeHours.toFixed(1)}
          </span>
          <span className="font-mono text-sm font-semibold text-[#D97706]">hours</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-[#F1F5F9] pt-2 text-[11px]">
          <span className="text-[#64748B]">Observed Age Range:</span>
          <span className="font-mono font-medium text-[#334155]">
            {metrics.minAgeHours.toFixed(1)}h – {metrics.maxAgeHours.toFixed(1)}h
          </span>
        </div>
      </div>

      {/* 4. AIS Candidate Vessels Evaluated */}
      <div className="relative flex flex-col justify-between rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs hover:border-[#94A3B8] transition">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            High-Evidence Candidates
          </span>
          <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-[#F0FDF4] text-[#16A34A]">
            <Ship className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-extrabold text-[#17324D] tracking-tight">
            {metrics.candidateVesselsEvaluated}
          </span>
          <span className="font-sans text-xs text-[#64748B]">vessels</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-[#F1F5F9] pt-2 text-[11px]">
          <span className="text-[#64748B]">Attribution Confidence:</span>
          <span className="font-mono font-medium text-[#16A34A]">
            Score ≥ 70% threshold
          </span>
        </div>
      </div>
    </div>
  );
};
