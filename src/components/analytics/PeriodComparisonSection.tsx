import React, { useState } from 'react';
import { GitCompare, Calendar, ArrowRightLeft, Minus } from 'lucide-react';
import { Incident } from '../../types';
import { comparePeriods } from './analyticsUtils';

interface PeriodComparisonSectionProps {
  allIncidents: Incident[];
}

export const PeriodComparisonSection: React.FC<PeriodComparisonSectionProps> = ({
  allIncidents,
}) => {
  const [comparisonMode, setComparisonMode] = useState<'years' | '90days'>('years');

  const comparisonRows =
    comparisonMode === 'years'
      ? comparePeriods(allIncidents, '2026', '2025')
      : comparePeriods(allIncidents, 'last90', 'prior90');

  const periodALabel = comparisonMode === 'years' ? 'Year 2026 (YTD)' : 'Last 90 Days';
  const periodBLabel = comparisonMode === 'years' ? 'Year 2025' : 'Prior 90 Days';

  return (
    <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs select-none">
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F1F5F9] pb-3 gap-2">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-[#0284C7]" />
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
            Period-over-Period Surveillance Comparison
          </h3>
        </div>

        <div className="flex items-center rounded-sm border border-[#CBD5E1] bg-[#F8FAFC] p-0.5 text-xs">
          <button
            onClick={() => setComparisonMode('years')}
            className={`rounded-xs px-2.5 py-1 text-[11px] font-medium transition ${
              comparisonMode === 'years'
                ? 'bg-[#17324D] text-white font-semibold'
                : 'text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            2026 vs 2025
          </button>
          <button
            onClick={() => setComparisonMode('90days')}
            className={`rounded-xs px-2.5 py-1 text-[11px] font-medium transition ${
              comparisonMode === '90days'
                ? 'bg-[#17324D] text-white font-semibold'
                : 'text-[#475569] hover:bg-[#E2E8F0]'
            }`}
          >
            Last 90d vs Prior 90d
          </button>
        </div>
      </div>

      {/* Comparison Table with Neutral Scientific Styling */}
      <div className="mt-3.5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[11px] font-bold text-[#475569]">
              <th className="py-2.5 px-3">Surveillance Metric</th>
              <th className="py-2.5 px-3 font-mono text-[#17324D] bg-[#F1F5F9]">
                {periodALabel} (Period A)
              </th>
              <th className="py-2.5 px-3 font-mono text-[#64748B]">{periodBLabel} (Period B)</th>
              <th className="py-2.5 px-3 text-right">Variance / Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] font-mono text-[11px]">
            {comparisonRows.map((row) => (
              <tr key={row.metric} className="hover:bg-[#F8FAFC] transition">
                <td className="py-2.5 px-3 font-sans font-medium text-[#1E293B]">
                  {row.metric}
                </td>
                <td className="py-2.5 px-3 font-bold text-[#17324D] bg-[#F8FAFC]">
                  {row.periodA}
                </td>
                <td className="py-2.5 px-3 text-[#475569]">{row.periodB}</td>
                <td className="py-2.5 px-3 text-right">
                  <span className="inline-flex items-center gap-1 rounded-xs bg-[#F1F5F9] border border-[#CBD5E1] px-2 py-0.5 font-bold text-[#334155]">
                    {row.delta}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-[11px] text-[#64748B] flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2">
        <Minus className="h-3 w-3 text-[#94A3B8]" />
        <span>
          Note: Neutral variance indicators reflect SAR sensor coverage frequency and revisit orbital mechanics, not purely spill incidence variation.
        </span>
      </div>
    </div>
  );
};
