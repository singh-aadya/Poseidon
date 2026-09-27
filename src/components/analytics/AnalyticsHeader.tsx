import React from 'react';
import { Download, FileText, CheckCircle2, Database, Clock, RefreshCw } from 'lucide-react';
import { Incident } from '../../types';
import { exportToCsv, exportSummaryReport } from './analyticsUtils';

interface AnalyticsHeaderProps {
  totalArchiveCount: number;
  filteredCount: number;
  filteredIncidents: Incident[];
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  totalArchiveCount,
  filteredCount,
  filteredIncidents,
}) => {
  return (
    <div className="border-b border-[#CBD5E1] bg-white px-6 py-4 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#17324D] text-white">
              <Database className="h-3.5 w-3.5" />
            </div>
            <h1 className="font-sans text-lg font-bold tracking-tight text-[#17324D] uppercase">
              Historical Spill Intelligence & Pattern Analytics
            </h1>
          </div>
          <p className="mt-1 text-xs text-[#475569]">
            Multi-temporal SAR detection archive, vessel traffic correlation, and drift hindcast records across global maritime jurisdictions
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCsv(filteredIncidents)}
            className="flex items-center gap-1.5 rounded-sm border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#17324D] hover:bg-[#F8FAFC] hover:border-[#94A3B8] transition shadow-2xs"
            title="Download full incident catalog with coordinates and candidates in CSV format"
          >
            <Download className="h-3.5 w-3.5 text-[#0284C7]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => exportSummaryReport(filteredIncidents)}
            className="flex items-center gap-1.5 rounded-sm border border-[#17324D] bg-[#17324D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1C3D5E] transition shadow-2xs"
            title="Generate institutional text summary report"
          >
            <FileText className="h-3.5 w-3.5 text-[#93C5FD]" />
            <span>Export Summary</span>
          </button>
        </div>
      </div>

      {/* Metadata Chips Bar */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-[#F1F5F9] pt-3 text-xs">
        <div className="inline-flex items-center gap-1.5 rounded-sm bg-[#F1F5F9] px-2.5 py-1 text-[#334155] font-mono text-[11px]">
          <Clock className="h-3 w-3 text-[#64748B]" />
          <span>Archive Range: <strong className="font-semibold text-[#0F172A]">2024-01-01 to Present</strong></span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-sm bg-[#F1F5F9] px-2.5 py-1 text-[#334155] font-mono text-[11px]">
          <Database className="h-3 w-3 text-[#64748B]" />
          <span>Indexed Events: <strong className="font-semibold text-[#0F172A]">{filteredCount}</strong> of {totalArchiveCount}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-sm bg-[#F0FDF4] border border-[#DCFCE7] px-2.5 py-1 text-[#166534] font-mono text-[11px]">
          <CheckCircle2 className="h-3 w-3 text-[#16A34A]" />
          <span className="font-semibold">ARCHIVE SYNCED</span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-sm bg-[#F8FAFC] px-2.5 py-1 text-[#64748B] font-mono text-[11px]">
          <RefreshCw className="h-3 w-3 text-[#94A3B8]" />
          <span>Last Refresh: <strong className="font-normal text-[#475569]">2026-09-27 12:00 UTC</strong></span>
        </div>
      </div>
    </div>
  );
};
