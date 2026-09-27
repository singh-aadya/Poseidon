import React from 'react';
import { Layers, Activity, Gauge, Eye } from 'lucide-react';
import { getSpillCharacteristics } from './analyticsUtils';
import { Incident } from '../../types';

interface SpillCharacteristicsSectionProps {
  incidents: Incident[];
}

export const SpillCharacteristicsSection: React.FC<SpillCharacteristicsSectionProps> = ({
  incidents,
}) => {
  const chars = getSpillCharacteristics(incidents);
  const maxBucketCount = Math.max(...chars.sizeDistribution.map((b) => b.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-none">
      {/* 1. Slick Size Distribution */}
      <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#17324D]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Slick Surface Size Distribution (km²)
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono">Geometric area</span>
        </div>

        <div className="mt-3.5 space-y-3">
          {chars.sizeDistribution.map((b) => {
            const pct = (b.count / maxBucketCount) * 100;
            return (
              <div key={b.label} className="text-xs">
                <div className="flex items-center justify-between text-[#334155] mb-1">
                  <span className="font-medium">{b.label}</span>
                  <span className="font-mono font-bold text-[#0F172A]">{b.count} events</span>
                </div>
                <div className="h-2.5 w-full rounded-xs bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-xs bg-[#17324D] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Morphological Metrics & Signature Breakdown */}
      <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-[#0284C7]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Morphological Metrics & Radar Signatures
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono">ESA S1 SAR</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 border-b border-[#F1F5F9] pb-3 text-center">
          <div className="rounded-xs bg-[#F8FAFC] p-2">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Avg Perimeter</div>
            <div className="mt-1 font-mono text-base font-bold text-[#17324D]">
              {chars.avgPerimeterKm} <span className="text-xs font-normal">km</span>
            </div>
          </div>
          <div className="rounded-xs bg-[#F8FAFC] p-2">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Mean Elongation</div>
            <div className="mt-1 font-mono text-base font-bold text-[#0284C7]">
              {chars.meanElongation} : 1
            </div>
          </div>
          <div className="rounded-xs bg-[#F8FAFC] p-2">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Radar Contrast</div>
            <div className="mt-1 font-mono text-base font-bold text-[#D97706]">
              {chars.meanSarContrastDb} <span className="text-xs font-normal">dB</span>
            </div>
          </div>
        </div>

        {/* Thickness & Emulsification distribution */}
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
              Thickness Proxy
            </span>
            <div className="mt-1.5 space-y-1 font-mono text-[11px]">
              {Object.entries(chars.thicknessCounts).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#F8FAFC] py-0.5">
                  <span className="text-[#64748B]">{k}:</span>
                  <span className="font-bold text-[#0F172A]">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
              Emulsification Proxy
            </span>
            <div className="mt-1.5 space-y-1 font-mono text-[11px]">
              {Object.entries(chars.emulsificationCounts).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#F8FAFC] py-0.5">
                  <span className="text-[#64748B]">{k}:</span>
                  <span className="font-bold text-[#0F172A]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
