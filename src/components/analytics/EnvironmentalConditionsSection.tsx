import React from 'react';
import { Wind, Waves, Thermometer, AlertTriangle, CheckCircle } from 'lucide-react';
import { getEnvironmentalCorrelation } from './analyticsUtils';
import { Incident } from '../../types';

interface EnvironmentalConditionsSectionProps {
  incidents: Incident[];
}

export const EnvironmentalConditionsSection: React.FC<EnvironmentalConditionsSectionProps> = ({
  incidents,
}) => {
  const env = getEnvironmentalCorrelation(incidents);
  const maxWindCount = Math.max(...env.windBuckets.map((b) => b.count), 1);

  return (
    <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs select-none">
      {/* Header with Institutional Scientific Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F1F5F9] pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-[#0284C7]" />
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
            Environmental Conditions at Detection
          </h3>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-xs bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-1 text-[11px] text-[#92400E]">
          <AlertTriangle className="h-3 w-3 text-[#D97706]" />
          <span>Note: Observed at acquisition; correlation does not imply causation.</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Wind Speed Distribution & SAR Detection Viability Window */}
        <div className="flex flex-col justify-between rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17324D] uppercase text-[11px]">
                Wind Speed Distribution
              </span>
              <span className="text-[10px] text-[#64748B]">NOAA GFS</span>
            </div>
            <div className="mt-1 text-[11px] text-[#64748B]">
              Optimal SAR oil contrast: <strong className="text-[#10B981]">3–12 m/s (6–23 kn)</strong>
            </div>

            <div className="mt-3 space-y-2">
              {env.windBuckets.map((b) => {
                const pct = (b.count / maxWindCount) * 100;
                return (
                  <div key={b.label}>
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className={`font-medium ${b.optimal ? 'text-[#0284C7]' : 'text-[#475569]'}`}>
                        {b.label}
                      </span>
                      <span className="font-mono font-bold text-[#0F172A]">{b.count}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-xs bg-[#E2E8F0] overflow-hidden">
                      <div
                        className={`h-full rounded-xs ${b.optimal ? 'bg-[#0284C7]' : 'bg-[#94A3B8]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Ocean Surface Current Dynamics */}
        <div className="flex flex-col justify-between rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17324D] uppercase text-[11px]">
                Surface Current Speed
              </span>
              <span className="text-[10px] text-[#64748B]">HYCOM 1/12°</span>
            </div>
            <div className="mt-1 text-[11px] text-[#64748B]">
              Advection driver for reverse and forward drift cones
            </div>

            <div className="mt-4 space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5 text-xs">
                <span className="text-[#64748B]">Mean Current:</span>
                <span className="font-bold text-[#17324D] text-sm">{env.meanCurrentKnots} kn</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5 text-xs">
                <span className="text-[#64748B]">Min Observed:</span>
                <span className="font-semibold text-[#475569]">{env.minCurrentKnots} kn</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Max Observed:</span>
                <span className="font-semibold text-[#D97706]">{env.maxCurrentKnots} kn</span>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-xs bg-[#EFF6FF] border border-[#DBEAFE] p-2 text-[11px] text-[#1E40AF] flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>Consistent with high-fidelity hindcast reliability</span>
          </div>
        </div>

        {/* 3. Sea Surface Temperature & Wave Height */}
        <div className="flex flex-col justify-between rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17324D] uppercase text-[11px]">
                SST & Significant Wave Height
              </span>
              <span className="text-[10px] text-[#64748B]">In-situ & Model</span>
            </div>
            <div className="mt-1 text-[11px] text-[#64748B]">
              Determines evaporation rate and radar backscatter
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xs bg-white border border-[#E2E8F0] p-2.5 shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-[#D97706] mb-1">
                  <Thermometer className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase">Mean SST</span>
                </div>
                <div className="font-mono text-lg font-bold text-[#17324D]">
                  {env.meanSstCelsius}°C
                </div>
              </div>

              <div className="rounded-xs bg-white border border-[#E2E8F0] p-2.5 shadow-2xs">
                <div className="flex items-center justify-center gap-1 text-[#0284C7] mb-1">
                  <Waves className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase">Mean Wave</span>
                </div>
                <div className="font-mono text-lg font-bold text-[#17324D]">
                  {env.meanWaveHeightMeters} m
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-[#64748B] text-center font-mono">
            Copernicus Marine In-Situ Near Real-Time Network
          </div>
        </div>
      </div>
    </div>
  );
};
