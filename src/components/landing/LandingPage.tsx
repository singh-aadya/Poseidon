import React, { useRef } from 'react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { IntelligenceChainSection } from './IntelligenceChainSection';
import { LiveSystemPreviewSection } from './LiveSystemPreviewSection';
import { SatelliteTransformationSection } from './SatelliteTransformationSection';
import { OriginAttributionSection } from './OriginAttributionSection';
import { ForecastSection } from './ForecastSection';
import { HistoricalAnalyticsSection } from './HistoricalAnalyticsSection';
import { EvidenceChainSection } from './EvidenceChainSection';
import { DataSourcesSection } from './DataSourcesSection';
import { ResponseImpactSection } from './ResponseImpactSection';
import { FinalCtaSection } from './FinalCtaSection';
import { LandingFooter } from './LandingFooter';

export const LandingPage: React.FC = () => {
  const { setActiveMode, setActiveIncidentId } = usePoseidonStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleEnterMonitoring = () => {
    // Select the Indian Mumbai High incident as the primary active context
    setActiveIncidentId('PSDN-2026-00142');
    setActiveMode('detection');
    if (typeof window !== 'undefined') {
      window.location.hash = '#/map/@71.45,19.45,9.2z;incident=PSDN-2026-00142';
    }
  };

  const handleExploreAnalytics = () => {
    setActiveMode('analytics');
    if (typeof window !== 'undefined') {
      window.location.hash = '#/analytics';
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="relative h-screen w-screen overflow-y-auto overflow-x-hidden bg-[#FFFFFF] text-[#071A2B] font-sans scroll-smooth selection:bg-[#087EA4] selection:text-white"
    >
      {/* 1. Transparent/White Sticky Landing Navigation */}
      <LandingNav 
        onEnterMonitoring={handleEnterMonitoring}
        onNavigateSection={handleNavigateSection}
      />

      {/* 2. Cinematic Earth/Ocean Observation Hero */}
      <HeroSection 
        onEnterMonitoring={handleEnterMonitoring}
        onExploreClick={() => handleNavigateSection('the-problem')}
      />

      {/* 3. The Problem Section: Not Just a Detection Problem */}
      <ProblemSection 
        onExploreChain={() => handleNavigateSection('intelligence-chain')}
      />

      {/* 4. POSEIDON Intelligence Chain: 10-Stage Scientific Pipeline */}
      <IntelligenceChainSection 
        onEnterMonitoring={handleEnterMonitoring}
      />

      {/* 5. See the Investigation: Live Monitoring System Immersive Console */}
      <LiveSystemPreviewSection 
        onEnterMonitoring={handleEnterMonitoring}
      />

      {/* 6. Satellite to Intelligence Split-Screen Transformation */}
      <SatelliteTransformationSection />

      {/* 7. Deep Ocean Contrast Section: Origin Analysis & AIS Attribution */}
      <OriginAttributionSection />

      {/* 8. Hydrodynamic Forward Forecast & Uncertainty Corridor */}
      <ForecastSection />

      {/* 9. Longitudinal History & Analytics Section */}
      <HistoricalAnalyticsSection 
        onExploreAnalytics={handleExploreAnalytics}
      />

      {/* 10. Traceable Evidence-First Architecture Timeline */}
      <EvidenceChainSection />

      {/* 11. Authoritative Multi-Source Marine Ingestion */}
      <DataSourcesSection />

      {/* 12. Public & Operational Response Impact */}
      <ResponseImpactSection />

      {/* 13. Dramatic Final Call to Action */}
      <FinalCtaSection 
        onEnterMonitoring={handleEnterMonitoring}
        onExploreChain={() => handleNavigateSection('intelligence-chain')}
      />

      {/* 14. Institutional Minimalist Footer */}
      <LandingFooter 
        onEnterMonitoring={handleEnterMonitoring}
        onNavigateSection={handleNavigateSection}
      />
    </div>
  );
};
