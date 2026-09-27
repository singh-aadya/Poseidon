import React, { useState, useMemo } from 'react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { Incident } from '../../types';
import { AnalyticsFilterState } from './types';
import { filterIncidents, calculateKpiMetrics, getTemporalTrends } from './analyticsUtils';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsFilterBar } from './AnalyticsFilterBar';
import { AnalyticsKpiStrip } from './AnalyticsKpiStrip';
import { TemporalTrendsSection } from './TemporalTrendsSection';
import { HistoricalAnalyticsMap } from './HistoricalAnalyticsMap';
import { IncidentDistributionSection } from './IncidentDistributionSection';
import { SpillCharacteristicsSection } from './SpillCharacteristicsSection';
import { EnvironmentalConditionsSection } from './EnvironmentalConditionsSection';
import { AisHistoricalAnalyticsSection } from './AisHistoricalAnalyticsSection';
import { AttributionHistorySection } from './AttributionHistorySection';
import { HistoricalTimelineSection } from './HistoricalTimelineSection';
import { PeriodComparisonSection } from './PeriodComparisonSection';
import { RegionalSummaryTable } from './RegionalSummaryTable';
import { IncidentDetailDrawer } from './IncidentDetailDrawer';
import { DataProvenanceSection } from './DataProvenanceSection';

export const HistoryAnalyticsWorkspace: React.FC = () => {
  const {
    incidents,
    setActiveIncidentId,
    setActiveMode,
    setSelectedCandidateId,
    flyToCoords,
  } = usePoseidonStore();

  // Unified Filter State
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    timeRange: 'all',
    region: 'ALL',
    confidence: 'ALL',
    status: 'ALL',
    ageFilter: 'ALL',
  });

  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Extract all unique regions
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    incidents.forEach((i) => set.add(i.region));
    return Array.from(set).sort();
  }, [incidents]);

  // Filtered dataset
  const filteredIncidents = useMemo(() => {
    const list = filterIncidents(incidents, filters);
    if (!selectedPeriod) return list;

    // Filter by selected year-month period if user clicked a period bar
    return list.filter((i) => {
      const d = new Date(i.detection_time);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
      return key === selectedPeriod;
    });
  }, [incidents, filters, selectedPeriod]);

  // Calculated metrics
  const kpiMetrics = useMemo(() => {
    return calculateKpiMetrics(filteredIncidents, incidents);
  }, [filteredIncidents, incidents]);

  const trends = useMemo(() => {
    return getTemporalTrends(filteredIncidents);
  }, [filteredIncidents]);

  // Handlers for switching views from drill-down or inspection
  const handleOpenLiveMap = (inc: Incident) => {
    setActiveIncidentId(inc.id);
    setActiveMode('detection');
    flyToCoords(inc.coordinates, 10.4);
  };

  const handleOpenAttribution = (inc: Incident) => {
    setActiveIncidentId(inc.id);
    setActiveMode('attribution');
    if (inc.candidates && inc.candidates.length > 0) {
      setSelectedCandidateId(inc.candidates[0].id);
    }
    flyToCoords(inc.coordinates, 10.0);
  };

  const handleOpenForecast = (inc: Incident) => {
    setActiveIncidentId(inc.id);
    setActiveMode('forecast');
    flyToCoords(inc.coordinates, 10.0);
  };

  const handleResetFilters = () => {
    setFilters({
      timeRange: 'all',
      region: 'ALL',
      confidence: 'ALL',
      status: 'ALL',
      ageFilter: 'ALL',
    });
    setSelectedPeriod(null);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#F5F7F9] text-gray-900 font-sans">
      {/* 1. Page Header */}
      <AnalyticsHeader
        totalArchiveCount={incidents.length}
        filteredCount={filteredIncidents.length}
        filteredIncidents={filteredIncidents}
      />

      {/* 2. Global Filter Bar */}
      <AnalyticsFilterBar
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onReset={handleResetFilters}
        availableRegions={availableRegions}
      />

      {/* 3. Main Analytical Content (Scrollable Container) */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* KPI Strip */}
        <AnalyticsKpiStrip metrics={kpiMetrics} />

        {/* Temporal Trends (Incidents Over Time & Area Over Time) */}
        <TemporalTrendsSection
          trends={trends}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />

        {/* Geospatial Hotspot Surveillance Map */}
        <HistoricalAnalyticsMap
          incidents={filteredIncidents}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
          onViewInLiveMap={handleOpenLiveMap}
        />

        {/* Incident Distribution (2x2 Grid) */}
        <IncidentDistributionSection
          incidents={filteredIncidents}
          onSelectRegion={(reg) => setFilters((prev) => ({ ...prev, region: reg }))}
          selectedRegion={filters.region}
        />

        {/* Spill Characteristics & Morphology */}
        <SpillCharacteristicsSection incidents={filteredIncidents} />

        {/* Environmental Conditions at Detection */}
        <EnvironmentalConditionsSection incidents={filteredIncidents} />

        {/* AIS Historical Analytics & Traffic Correlation */}
        <AisHistoricalAnalyticsSection incidents={filteredIncidents} />

        {/* Attribution History & Evidence Factors */}
        <AttributionHistorySection incidents={filteredIncidents} />

        {/* Chronological Incident Timeline Archive */}
        <HistoricalTimelineSection
          incidents={filteredIncidents}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
          onViewInLiveMap={handleOpenLiveMap}
        />

        {/* Period Comparison (Period A vs Period B) */}
        <PeriodComparisonSection allIncidents={incidents} />

        {/* Regional Incident Summary Table */}
        <RegionalSummaryTable
          incidents={filteredIncidents}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
          onViewInLiveMap={handleOpenLiveMap}
        />

        {/* Data Provenance & Archive Quality */}
        <DataProvenanceSection />

        {/* Bottom Spacing */}
        <div className="h-10" />
      </div>

      {/* 4. Incident Detail Slide-out Drawer */}
      {selectedIncident && (
        <IncidentDetailDrawer
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onOpenLiveMap={handleOpenLiveMap}
          onOpenAttribution={handleOpenAttribution}
          onOpenForecast={handleOpenForecast}
        />
      )}
    </div>
  );
};
