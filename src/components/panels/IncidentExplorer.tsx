import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { Incident } from '../../types';

export const IncidentExplorer: React.FC = () => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const {
    activeIncidentId,
    setActiveIncidentId,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetFilters,
    getFilteredIncidents,
    setRightPanelOpen,
  } = usePoseidonStore();

  const filteredIncidents = getFilteredIncidents();

  const regions = [
    'ALL',
    'Gulf of Mexico',
    'North Atlantic',
    'Arabian Sea',
    'Mediterranean Sea',
    'Strait of Malacca',
    'South China Sea',
    'Persian Gulf',
    'North Sea',
  ];

  const handleSelectIncident = (inc: Incident) => {
    setActiveIncidentId(inc.id);
    setRightPanelOpen(true);
  };

  return (
    <aside className="relative flex h-full w-80 flex-col border-r border-[#D1D5DB] bg-white text-gray-800 select-none shadow-xs">
      {/* Catalog Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-bold text-[#17324D]">
            Detected incidents
          </span>
          <span className="rounded-sm bg-[#E2E8F0] px-1.5 py-0.2 text-[11px] font-mono text-gray-700 font-semibold">
            {filteredIncidents.length}
          </span>
        </div>

        <button
          onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          className={`flex h-6 items-center gap-1 rounded-sm border px-2 text-[11px] font-medium transition ${
            filterDrawerOpen || filters.confidence !== 'ALL' || filters.severity !== 'ALL' || filters.region !== 'ALL'
              ? 'border-[#1769AA] bg-[#EFF6FF] text-[#1769AA]'
              : 'border-[#D1D5DB] bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="h-3 w-3" />
          <span>Filters</span>
          {filterDrawerOpen ? <ChevronUp className="h-3 w-3 ml-0.5" /> : <ChevronDown className="h-3 w-3 ml-0.5" />}
        </button>
      </div>

      {/* Search Input Box */}
      <div className="border-b border-[#E5E7EB] p-2 bg-white">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search incident ID, vessel or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-sm border border-[#D1D5DB] bg-white py-1 pl-8 pr-7 text-xs text-gray-900 placeholder-gray-400 focus:border-[#1769AA] focus:outline-none focus:ring-1 focus:ring-[#1769AA]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1.5 text-xs text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Options Drawer */}
      {filterDrawerOpen && (
        <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] p-3 text-xs space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
            <span>Filter criteria</span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[#1769AA] hover:underline text-[11px]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Confidence Filter */}
          <div>
            <label className="text-[11px] font-medium text-gray-600 block mb-1">Detection confidence</label>
            <div className="grid grid-cols-4 gap-1">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFilters({ confidence: level })}
                  className={`rounded-sm py-1 text-[11px] font-medium transition border ${
                    filters.confidence === level
                      ? 'bg-[#1769AA] text-white border-[#1769AA]'
                      : 'bg-white border-[#D1D5DB] text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {level === 'ALL' ? 'All' : level === 'HIGH' ? 'High' : level === 'MEDIUM' ? 'Med' : 'Low'}
                </button>
              ))}
            </div>
          </div>

          {/* Region Select */}
          <div>
            <label className="text-[11px] font-medium text-gray-600 block mb-1">Geographic region</label>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ region: e.target.value })}
              className="w-full rounded-sm border border-[#D1D5DB] bg-white px-2 py-1 text-xs text-gray-800"
            >
              {regions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg === 'ALL' ? 'All regions' : reg}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Incident Catalog Card List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#E5E7EB]">
        {filteredIncidents.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            <div className="font-semibold text-gray-700">No matching incidents found</div>
            <div className="mt-1 text-[11px] leading-relaxed">
              Try adjusting your search query or reset filters to view all recorded incidents.
            </div>
            <button
              onClick={resetFilters}
              className="mt-3 rounded-sm border border-[#D1D5DB] bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredIncidents.map((inc) => {
            const isSelected = inc.id === activeIncidentId;
            const confPercent = Math.round(inc.confidence * 100);

            // Severity status colors
            const statusColor =
              inc.severity === 'HIGH'
                ? '#B42318'
                : inc.severity === 'MEDIUM'
                ? '#C47A00'
                : '#6B7280';

            return (
              <div
                key={inc.id}
                onClick={() => handleSelectIncident(inc)}
                className={`cursor-pointer px-3.5 py-2.5 transition border-l-4 ${
                  isSelected
                    ? 'border-l-[#1769AA] bg-[#F0F7FF]'
                    : 'border-l-transparent hover:bg-slate-50'
                }`}
              >
                {/* Header: ID + Region */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: statusColor }}
                    />
                    <span className="font-mono text-xs font-bold text-gray-900">
                      {inc.id}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {inc.region}
                  </span>
                </div>

                {/* Slick Name */}
                <div className="mt-0.5 text-xs text-gray-700 font-medium truncate">
                  {inc.name}
                </div>

                {/* Clean Two-Column Metrics Layout (No excessive boxed containers) */}
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-gray-600 pt-1.5 border-t border-slate-100">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500">Confidence</span>
                    <span className="font-semibold text-gray-900 font-mono">{confPercent}%</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500">Area</span>
                    <span className="font-semibold text-gray-900 font-mono">{inc.area_km2.toFixed(1)} km²</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500">Age</span>
                    <span className="font-semibold text-gray-900 font-mono">{inc.estimated_age_hours_min}–{inc.estimated_age_hours_max} h</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500">Candidates</span>
                    <span className="font-semibold text-gray-900 font-mono">{inc.candidates.length}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Catalog Institutional Footer */}
      <div className="border-t border-[#E5E7EB] bg-[#F8FAFC] py-1.5 px-3 text-center text-[10px] text-gray-500 font-sans">
        Copernicus Sentinel-1 SAR catalog
      </div>
    </aside>
  );
};
