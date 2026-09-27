import React from 'react';
import { Target, CheckCircle2, Shield, Info } from 'lucide-react';
import { getAttributionHistory } from './analyticsUtils';
import { Incident } from '../../types';

interface AttributionHistorySectionProps {
  incidents: Incident[];
}

export const AttributionHistorySection: React.FC<AttributionHistorySectionProps> = ({
  incidents,
}) => {
  const attr = getAttributionHistory(incidents);
  const maxScoreBucketCount = Math.max(...attr.scoreBuckets.map((b) => b.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-none">
      {/* 1. Attribution Score Distribution */}
      <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#17324D]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Attribution Score Distribution (0–100 Scale)
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono">Probabilistic ML</span>
        </div>

        {/* Threshold badges */}
        <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono">
          <span className="rounded-xs bg-slate-100 border border-slate-300 px-1.5 py-0.5 text-slate-700">
            &lt;50: Inconclusive
          </span>
          <span className="rounded-xs bg-amber-50 border border-amber-300 px-1.5 py-0.5 text-amber-800">
            50–69: Plausible
          </span>
          <span className="rounded-xs bg-sky-50 border border-sky-300 px-1.5 py-0.5 text-sky-800">
            70–84: Strong
          </span>
          <span className="rounded-xs bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 text-emerald-800">
            ≥85: Conclusive
          </span>
        </div>

        <div className="mt-3.5 space-y-3">
          {attr.scoreBuckets.map((b) => {
            const pct = (b.count / maxScoreBucketCount) * 100;
            const barColor =
              b.min >= 85
                ? 'bg-[#10B981]'
                : b.min >= 70
                ? 'bg-[#0284C7]'
                : b.min >= 50
                ? 'bg-[#F59E0B]'
                : 'bg-[#94A3B8]';

            return (
              <div key={b.label} className="text-xs">
                <div className="flex items-center justify-between text-[#334155] mb-1">
                  <span className="font-medium">{b.label}</span>
                  <span className="font-mono font-bold text-[#0F172A]">{b.count} candidates</span>
                </div>
                <div className="h-2.5 w-full rounded-xs bg-[#F1F5F9] overflow-hidden">
                  <div
                    className={`h-full rounded-xs ${barColor} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Evidence Factor Reliability Analysis Table */}
      <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#0284C7]" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Evidence Factor Reliability & Weight
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B]">5 core metrics</span>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[11px] font-bold text-[#475569]">
                <th className="py-2 px-2">Evidence Factor</th>
                <th className="py-2 px-2 text-center">Weight</th>
                <th className="py-2 px-2 text-center">Avg Score</th>
                <th className="py-2 px-2 text-right">Positive Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] font-mono text-[11px]">
              {attr.evidenceFactors.map((f) => (
                <tr key={f.factor} className="hover:bg-[#F8FAFC] transition">
                  <td className="py-2 px-2 font-sans font-medium text-[#1E293B]">
                    <div>{f.factor}</div>
                    <div className="text-[10px] text-[#64748B] font-normal">{f.description}</div>
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-[#17324D]">
                    {f.modelWeight}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="rounded-xs bg-[#EFF6FF] px-1.5 py-0.5 text-[#0284C7] font-bold">
                      {f.avgScore}/100
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right font-bold text-[#10B981]">
                    {f.positiveRatePct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
