import React from 'react';
import { Filter, RotateCcw, X, Calendar, MapPin, ShieldCheck, Activity, Clock } from 'lucide-react';
import { AnalyticsFilterState, TimeRangePreset, ConfidenceFilter, StatusFilter, AgeFilter } from './types';

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilterState;
  onFilterChange: (updated: Partial<AnalyticsFilterState>) => void;
  onReset: () => void;
  availableRegions: string[];
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableRegions,
}) => {
  const timePresets: { id: TimeRangePreset; label: string }[] = [
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '1y', label: 'Last 1 Year' },
    { id: 'all', label: 'All Archive' },
    { id: 'custom', label: 'Custom' },
  ];

  const confidenceTiers: { id: ConfidenceFilter; label: string }[] = [
    { id: 'ALL', label: 'All Conf' },
    { id: 'HIGH', label: 'High (≥85%)' },
    { id: 'MEDIUM', label: 'Medium (70–84%)' },
    { id: 'LOW', label: 'Low (<70%)' },
  ];

  const statusTiers: { id: StatusFilter; label: string }[] = [
    { id: 'ALL', label: 'All Status' },
    { id: 'Under investigation', label: 'Under Investigation' },
    { id: 'Resolved', label: 'Resolved / Closed' },
    { id: 'Detected', label: 'Detected Only' },
  ];

  const ageTiers: { id: AgeFilter; label: string }[] = [
    { id: 'ALL', label: 'All Ages' },
    { id: 'fresh', label: 'Fresh (<6h)' },
    { id: 'intermediate', label: 'Intermediate (6–24h)' },
    { id: 'aged', label: 'Aged (>24h)' },
  ];

  // Active filter count (excluding defaults)
  const isFiltered =
    filters.timeRange !== 'all' ||
    filters.region !== 'ALL' ||
    filters.confidence !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.ageFilter !== 'ALL';

  return (
    <div className="sticky top-0 z-20 border-b border-[#CBD5E1] bg-[#F8FAFC] px-6 py-2.5 shadow-2xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* 1. Time Range Selector */}
          <div className="flex items-center rounded-sm border border-[#CBD5E1] bg-white p-0.5 shadow-2xs">
            <span className="flex items-center px-2 text-[#64748B]">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="font-semibold text-[11px] text-[#475569]">PERIOD:</span>
            </span>
            {timePresets.map((t) => (
              <button
                key={t.id}
                onClick={() => onFilterChange({ timeRange: t.id })}
                className={`rounded-xs px-2.5 py-1 text-[11px] font-medium transition ${
                  filters.timeRange === t.id
                    ? 'bg-[#17324D] text-white font-semibold'
                    : 'text-[#475569] hover:bg-[#F1F5F9]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Custom Date Pickers (visible if custom selected) */}
          {filters.timeRange === 'custom' && (
            <div className="flex items-center gap-1 bg-white border border-[#CBD5E1] rounded-sm px-2 py-0.5">
              <input
                type="date"
                value={filters.customStartDate || ''}
                onChange={(e) => onFilterChange({ customStartDate: e.target.value })}
                className="text-[11px] font-mono text-[#17324D] bg-transparent outline-none"
              />
              <span className="text-[#94A3B8] text-[11px]">→</span>
              <input
                type="date"
                value={filters.customEndDate || ''}
                onChange={(e) => onFilterChange({ customEndDate: e.target.value })}
                className="text-[11px] font-mono text-[#17324D] bg-transparent outline-none"
              />
            </div>
          )}

          {/* 2. Region Dropdown */}
          <div className="flex items-center rounded-sm border border-[#CBD5E1] bg-white px-2 py-1 shadow-2xs">
            <MapPin className="h-3 w-3 text-[#0284C7] mr-1.5" />
            <span className="text-[11px] font-semibold text-[#475569] mr-1.5">REGION:</span>
            <select
              value={filters.region}
              onChange={(e) => onFilterChange({ region: e.target.value })}
              className="bg-transparent text-[11px] font-medium text-[#17324D] outline-none cursor-pointer"
            >
              <option value="ALL">All Jurisdictions ({availableRegions.length})</option>
              {availableRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Detection Confidence Filter */}
          <div className="flex items-center rounded-sm border border-[#CBD5E1] bg-white p-0.5 shadow-2xs">
            <span className="flex items-center px-1.5 text-[#64748B]">
              <ShieldCheck className="h-3 w-3 mr-1 text-[#10B981]" />
              <span className="font-semibold text-[11px] text-[#475569]">CONFIDENCE:</span>
            </span>
            {confidenceTiers.map((c) => (
              <button
                key={c.id}
                onClick={() => onFilterChange({ confidence: c.id })}
                className={`rounded-xs px-2 py-0.5 text-[11px] font-medium transition ${
                  filters.confidence === c.id
                    ? 'bg-[#17324D] text-white font-semibold'
                    : 'text-[#475569] hover:bg-[#F1F5F9]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* 4. Spill Status Filter */}
          <div className="flex items-center rounded-sm border border-[#CBD5E1] bg-white px-2 py-1 shadow-2xs">
            <Activity className="h-3 w-3 text-[#F59E0B] mr-1.5" />
            <span className="text-[11px] font-semibold text-[#475569] mr-1.5">STATUS:</span>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value as StatusFilter })}
              className="bg-transparent text-[11px] font-medium text-[#17324D] outline-none cursor-pointer"
            >
              {statusTiers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Slick Age Filter */}
          <div className="flex items-center rounded-sm border border-[#CBD5E1] bg-white px-2 py-1 shadow-2xs">
            <Clock className="h-3 w-3 text-[#64748B] mr-1.5" />
            <span className="text-[11px] font-semibold text-[#475569] mr-1.5">SLICK AGE:</span>
            <select
              value={filters.ageFilter}
              onChange={(e) => onFilterChange({ ageFilter: e.target.value as AgeFilter })}
              className="bg-transparent text-[11px] font-medium text-[#17324D] outline-none cursor-pointer"
            >
              {ageTiers.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Action */}
        <div className="flex items-center gap-2">
          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 rounded-sm border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#64748B] hover:text-[#DC2626] hover:border-[#FCA5A5] transition shadow-2xs"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Summary Chips */}
      {isFiltered && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[#E2E8F0] pt-1.5 text-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">Active Filters:</span>
          {filters.timeRange !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#E2E8F0] px-2 py-0.5 text-[11px] font-medium text-[#334155]">
              Period: {filters.timeRange}
              <button onClick={() => onFilterChange({ timeRange: 'all' })} className="hover:text-red-600">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          {filters.region !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#E2E8F0] px-2 py-0.5 text-[11px] font-medium text-[#334155]">
              Region: {filters.region}
              <button onClick={() => onFilterChange({ region: 'ALL' })} className="hover:text-red-600">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          {filters.confidence !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#E2E8F0] px-2 py-0.5 text-[11px] font-medium text-[#334155]">
              Conf: {filters.confidence}
              <button onClick={() => onFilterChange({ confidence: 'ALL' })} className="hover:text-red-600">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          {filters.status !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#E2E8F0] px-2 py-0.5 text-[11px] font-medium text-[#334155]">
              Status: {filters.status}
              <button onClick={() => onFilterChange({ status: 'ALL' })} className="hover:text-red-600">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          {filters.ageFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#E2E8F0] px-2 py-0.5 text-[11px] font-medium text-[#334155]">
              Age: {filters.ageFilter}
              <button onClick={() => onFilterChange({ ageFilter: 'ALL' })} className="hover:text-red-600">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
