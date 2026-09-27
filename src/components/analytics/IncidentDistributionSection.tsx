import React from 'react';
import { Globe, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { getIncidentDistribution } from './analyticsUtils';
import { Incident } from '../../types';

interface IncidentDistributionSectionProps {
  incidents: Incident[];
  onSelectRegion: (region: string) => void;
  selectedRegion: string;
}

export const IncidentDistributionSection: React.FC<IncidentDistributionSectionProps> = ({
  incidents,
  onSelectRegion,
  selectedRegion,
}) => {
  const dist = getIncidentDistribution(incidents);
  const maxRegionCount = Math.max(...dist.regions.map((r) => r.count), 1);
  const totalIncidents = incidents.length || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
      {/* 1. Distribution by Region */}
      <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#0284C7]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Geographic Concentration by Region
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B]">Click bar to filter</span>
        </div>

        <div className="mt-3.5 space-y-2.5 overflow-y-auto max-h-56 pr-1">
          {dist.regions.map((r) => {
            const pct = (r.count / maxRegionCount) * 100;
            const isSelected = selectedRegion === r.region;
            return (
              <div
                key={r.region}
                onClick={() => onSelectRegion(isSelected ? 'ALL' : r.region)}
                className={`group cursor-pointer rounded-xs p-1.5 transition ${
                  isSelected ? 'bg-[#EFF6FF] border border-[#BFDBFE]' : 'hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E293B] group-hover:text-[#0284C7] transition">
                    {r.region}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-semibold text-[#0F172A]">{r.count} spills</span>
                    <span className="text-[#64748B]">({r.areaKm2} km²)</span>
                  </div>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-xs bg-[#F1F5F9]">
                  <div
                    className="h-full rounded-xs bg-[#0284C7] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Detection Confidence Profile */}
      <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              SAR Detection Confidence & Segmentation IoU
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono">U-Net v3.2</span>
        </div>

        {/* Stacked bar visualization */}
        <div className="mt-4">
          <div className="flex h-4 w-full overflow-hidden rounded-xs bg-[#E2E8F0]">
            {dist.confidenceProfile.map((c) => (
              <div
                key={c.tier}
                className="h-full transition-all duration-500"
                style={{
                  width: `${c.percentage}%`,
                  backgroundColor: c.color,
                }}
                title={`${c.tier}: ${c.count} (${c.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* Breakdown details */}
        <div className="mt-4 space-y-3">
          {dist.confidenceProfile.map((c) => (
            <div key={c.tier} className="flex items-center justify-between border-b border-[#F8FAFC] pb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-xs" style={{ backgroundColor: c.color }} />
                <span className="font-medium text-[#334155]">{c.tier}</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px]">
                <span className="font-bold text-[#0F172A]">
                  {c.count} <span className="font-normal text-[#64748B]">({c.percentage}%)</span>
                </span>
                <span className="text-[#0284C7] bg-[#EFF6FF] px-1.5 py-0.5 rounded-xs">
                  IoU: {c.avgIoU}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Incident Status Breakdown */}
      <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Incident Operational Status & Resolution
            </h3>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#10B981]">
            {dist.statusBreakdown.resolutionRate}% RESOLVED
          </span>
        </div>

        <div className="mt-3.5 space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-[#334155] mb-1">
              <span>Under Active Investigation</span>
              <span className="font-mono font-bold text-[#0284C7]">
                {dist.statusBreakdown.underInvestigation} incidents
              </span>
            </div>
            <div className="h-2 w-full rounded-xs bg-[#F1F5F9]">
              <div
                className="h-full rounded-xs bg-[#0284C7]"
                style={{
                  width: `${(dist.statusBreakdown.underInvestigation / totalIncidents) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#334155] mb-1">
              <span>Attribution Confirmed / Resolved</span>
              <span className="font-mono font-bold text-[#10B981]">
                {dist.statusBreakdown.resolved} incidents
              </span>
            </div>
            <div className="h-2 w-full rounded-xs bg-[#F1F5F9]">
              <div
                className="h-full rounded-xs bg-[#10B981]"
                style={{
                  width: `${(dist.statusBreakdown.resolved / totalIncidents) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#334155] mb-1">
              <span>Detected (Unassigned / Pending Feeds)</span>
              <span className="font-mono font-bold text-[#64748B]">
                {dist.statusBreakdown.detectedOnly} incidents
              </span>
            </div>
            <div className="h-2 w-full rounded-xs bg-[#F1F5F9]">
              <div
                className="h-full rounded-xs bg-[#64748B]"
                style={{
                  width: `${(dist.statusBreakdown.detectedOnly / totalIncidents) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Slick Age Categories at Detection */}
      <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#D97706]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Slick Age & Natural Look-Alike Probability
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B]">Mean proxy</span>
        </div>

        <div className="mt-3.5 space-y-2.5">
          {dist.ageCategories.map((a) => (
            <div key={a.category} className="rounded-xs bg-[#F8FAFC] p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#17324D]">{a.category}</span>
                <span className="font-mono font-bold text-[#0F172A]">{a.count} detections</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Natural Look-Alike Risk:</span>
                <span className="font-mono font-semibold text-[#D97706]">
                  {a.meanLookAlike}% prob
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
