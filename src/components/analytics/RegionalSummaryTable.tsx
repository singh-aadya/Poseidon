import React, { useState, useMemo } from 'react';
import {
  Table,
  Search,
  ArrowUpDown,
  Download,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Incident } from '../../types';
import { getIncidentStatus, exportToCsv, exportSummaryReport } from './analyticsUtils';

interface RegionalSummaryTableProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident) => void;
  onViewInLiveMap: (inc: Incident) => void;
}

type SortColumn = 'id' | 'date' | 'name' | 'region' | 'area' | 'confidence' | 'age' | 'status' | 'score';

export const RegionalSummaryTable: React.FC<RegionalSummaryTableProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onViewInLiveMap,
}) => {
  const [tableSearch, setTableSearch] = useState('');
  const [sortCol, setSortCol] = useState<SortColumn>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter within table
  const filtered = useMemo(() => {
    if (!tableSearch.trim()) return incidents;
    const q = tableSearch.toLowerCase().trim();
    return incidents.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.region.toLowerCase().includes(q) ||
        (i.candidates[0]?.vessel_name && i.candidates[0].vessel_name.toLowerCase().includes(q)) ||
        (i.candidates[0]?.imo && i.candidates[0].imo.includes(q))
    );
  }, [incidents, tableSearch]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: any = a.id;
      let valB: any = b.id;

      if (sortCol === 'date') {
        valA = new Date(a.detection_time).getTime();
        valB = new Date(b.detection_time).getTime();
      } else if (sortCol === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortCol === 'region') {
        valA = a.region;
        valB = b.region;
      } else if (sortCol === 'area') {
        valA = a.area_km2;
        valB = b.area_km2;
      } else if (sortCol === 'confidence') {
        valA = a.confidence;
        valB = b.confidence;
      } else if (sortCol === 'age') {
        valA = a.estimated_age_mean;
        valB = b.estimated_age_mean;
      } else if (sortCol === 'status') {
        valA = getIncidentStatus(a);
        valB = getIncidentStatus(b);
      } else if (sortCol === 'score') {
        valA = a.candidates[0]?.attribution_score || 0;
        valB = b.candidates[0]?.attribution_score || 0;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortAsc]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedRows = sorted.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const handleHeaderClick = (col: SortColumn) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs select-none">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#F1F5F9] pb-3 gap-3">
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 text-[#17324D]" />
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
            Regional Incident Summary & Candidate Ledger
          </h3>
          <span className="rounded-xs bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-mono font-bold text-[#475569]">
            {filtered.length} entries
          </span>
        </div>

        {/* Search, Page size, & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Table Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search ID, vessel, IMO..."
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-sm border border-[#CBD5E1] bg-white py-1 pl-8 pr-3 text-xs text-[#1E293B] placeholder-[#94A3B8] focus:border-[#0284C7] focus:outline-none w-48 shadow-2xs"
            />
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-xs border border-[#CBD5E1] bg-white px-1.5 py-0.5 text-[11px] text-[#1E293B] outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Export Buttons */}
          <button
            onClick={() => exportToCsv(sorted)}
            className="flex items-center gap-1 rounded-sm border border-[#CBD5E1] bg-white px-2 py-1 text-[11px] font-semibold text-[#17324D] hover:bg-[#F8FAFC] transition shadow-2xs"
            title="Export filtered records to CSV"
          >
            <Download className="h-3 w-3 text-[#0284C7]" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => exportSummaryReport(sorted)}
            className="flex items-center gap-1 rounded-sm border border-[#CBD5E1] bg-white px-2 py-1 text-[11px] font-semibold text-[#17324D] hover:bg-[#F8FAFC] transition shadow-2xs"
            title="Export summary text report"
          >
            <FileText className="h-3 w-3 text-[#64748B]" />
            <span>Summary</span>
          </button>
        </div>
      </div>

      {/* Dense Table */}
      <div className="mt-3.5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#CBD5E1] bg-[#F8FAFC] text-[11px] font-bold text-[#475569]">
              <th
                onClick={() => handleHeaderClick('id')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7]"
              >
                <div className="flex items-center gap-1">
                  <span>Incident ID</span>
                  <ArrowUpDown className="h-3 w-3 text-[#94A3B8]" />
                </div>
              </th>
              <th
                onClick={() => handleHeaderClick('date')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7]"
              >
                <div className="flex items-center gap-1">
                  <span>Date (UTC)</span>
                  <ArrowUpDown className="h-3 w-3 text-[#94A3B8]" />
                </div>
              </th>
              <th
                onClick={() => handleHeaderClick('name')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7]"
              >
                <span>Name / Description</span>
              </th>
              <th
                onClick={() => handleHeaderClick('region')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7]"
              >
                <span>Region</span>
              </th>
              <th
                onClick={() => handleHeaderClick('area')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7] text-right"
              >
                <span>Area (km²)</span>
              </th>
              <th
                onClick={() => handleHeaderClick('confidence')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7] text-center"
              >
                <span>Confidence</span>
              </th>
              <th
                onClick={() => handleHeaderClick('age')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7] text-right"
              >
                <span>Est Age</span>
              </th>
              <th
                onClick={() => handleHeaderClick('status')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7] text-center"
              >
                <span>Status</span>
              </th>
              <th className="py-2.5 px-3">
                <span>Prime Candidate (IMO)</span>
              </th>
              <th
                onClick={() => handleHeaderClick('score')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#0284C7] text-center"
              >
                <span>Score</span>
              </th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] font-mono text-[11px]">
            {pagedRows.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              const status = getIncidentStatus(inc);
              const primeCand = inc.candidates[0];

              return (
                <tr
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className={`cursor-pointer transition ${
                    isSelected ? 'bg-[#F0F9FF] font-semibold' : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                  <td className="py-2 px-3 font-bold text-[#0284C7]">
                    {inc.id}
                  </td>
                  <td className="py-2 px-3 text-[#475569]">
                    {inc.detection_time.slice(0, 10)}
                  </td>
                  <td className="py-2 px-3 font-sans font-medium text-[#1E293B] max-w-xs truncate">
                    {inc.name}
                  </td>
                  <td className="py-2 px-3 font-sans text-[#334155]">
                    {inc.region}
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-[#17324D]">
                    {inc.area_km2.toFixed(1)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                        inc.confidence >= 0.85
                          ? 'bg-sky-50 text-sky-700'
                          : inc.confidence >= 0.7
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {(inc.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-[#475569]">
                    {inc.estimated_age_mean}h
                  </td>
                  <td className="py-2 px-3 text-center">
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
                  </td>
                  <td className="py-2 px-3 font-sans text-[#1E293B] max-w-xs truncate">
                    {primeCand ? (
                      <span>
                        {primeCand.vessel_name}{' '}
                        <span className="font-mono text-[#64748B] text-[10px]">
                          ({primeCand.imo})
                        </span>
                      </span>
                    ) : (
                      <span className="text-[#94A3B8] italic">None identified</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {primeCand ? (
                      <span
                        className={`rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          primeCand.attribution_score >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : primeCand.attribution_score >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {primeCand.attribution_score}%
                      </span>
                    ) : (
                      <span className="text-[#94A3B8]">-</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc);
                        }}
                        className="rounded-xs p-1 text-[#64748B] hover:text-[#17324D] hover:bg-[#E2E8F0]"
                        title="View Incident Drill-Down"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewInLiveMap(inc);
                        }}
                        className="rounded-xs p-1 text-[#0284C7] hover:text-[#0369A1] hover:bg-[#E0F2FE]"
                        title="View on Live Map"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-[#F1F5F9] pt-2 text-xs text-[#64748B]">
        <span>
          Showing page <strong className="font-bold text-[#17324D]">{safeCurrentPage}</strong> of{' '}
          <strong className="font-bold text-[#17324D]">{totalPages}</strong> ({sorted.length} total)
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-xs border border-[#CBD5E1] bg-white text-[#17324D] disabled:opacity-40 hover:bg-[#F8FAFC]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-xs border border-[#CBD5E1] bg-white text-[#17324D] disabled:opacity-40 hover:bg-[#F8FAFC]"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
