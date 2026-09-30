import React, { useEffect } from 'react';
import { Map, ListFilter, BarChart3 } from 'lucide-react';
import { usePoseidonStore } from './store/usePoseidonStore';
import { TopNav } from './components/header/TopNav';
import { SystemStatusModal } from './components/header/SystemStatusModal';
import { IncidentExplorer } from './components/panels/IncidentExplorer';
import { RightIntelligencePanel } from './components/panels/RightIntelligencePanel';
import { VesselDetailModal } from './components/panels/VesselDetailModal';
import { MapView } from './components/map/MapView';
import { BottomTimeline } from './components/timeline/BottomTimeline';
import { DemoInvestigationModal } from './components/demo/DemoInvestigationModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { CopilotDrawer } from './components/copilot/CopilotDrawer';
import { IncidentComparisonModal } from './components/panels/IncidentComparisonModal';

import { HistoryAnalyticsWorkspace } from './components/analytics/HistoryAnalyticsWorkspace';
import { PublicInfoWorkspace } from './components/public/PublicInfoWorkspace';
import { AlertsCenter } from './components/alerts/AlertsCenter';
import { AssignIncidentModal } from './components/alerts/AssignIncidentModal';
import { AdminAuditModal } from './components/admin/AdminAuditModal';
import { LandingPage } from './components/landing/LandingPage';

export const App: React.FC = () => {
  const {
    activeMode,
    setActiveMode,
    leftPanelOpen,
    toggleLeftPanel,
    setLeftPanelOpen,
    rightPanelOpen,
    toggleRightPanel,
    setRightPanelOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    incidents,
  } = usePoseidonStore();

  // On mobile/tablet, collapse both panels by default so the map is unobstructed
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    }
  }, [setLeftPanelOpen, setRightPanelOpen]);

  // Synchronize browser history / URL hash changes with activeMode
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/overview') && activeMode !== 'overview') {
        setActiveMode('overview');
      } else if (hash.startsWith('#/map') && activeMode === 'overview') {
        setActiveMode('detection');
      } else if (hash.startsWith('#/analytics') && activeMode !== 'analytics') {
        setActiveMode('analytics');
      } else if (hash.startsWith('#/public-info') && activeMode !== 'public-info') {
        setActiveMode('public-info');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeMode, setActiveMode]);

  // Dedicated Cinematic Landing Page for 'overview' mode
  if (activeMode === 'overview') {
    return <LandingPage />;
  }

  return (
    <div className="flex h-screen w-full max-w-full flex-col overflow-hidden bg-[#F5F7F9] text-gray-900 font-sans box-border">
      {/* 1. Compact NASA FIRMS-Style Top Navigation */}
      <TopNav />

      {/* 2. Main Middle Workspace: History & Analytics, Public Info, or Live Map Workspace */}
      {activeMode === 'analytics' ? (
        <main className="relative flex-1 h-full w-full max-w-full overflow-hidden min-w-0">
          <HistoryAnalyticsWorkspace />
        </main>
      ) : activeMode === 'public-info' ? (
        <main className="relative flex-1 h-full w-full max-w-full overflow-hidden min-w-0">
          <PublicInfoWorkspace />
        </main>
      ) : (
        <>
          <div className="relative flex flex-1 min-w-0 overflow-hidden w-full max-w-full">
            {/* Mobile Backdrop for Left Panel Drawer */}
            {leftPanelOpen && (
              <div
                className="fixed inset-0 top-12 z-30 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
                onClick={toggleLeftPanel}
                aria-label="Close incident explorer"
              />
            )}

            {/* Left Collapsible Incident Explorer: Off-canvas drawer on mobile/tablet (< lg), Column on desktop (≥ lg) */}
            {leftPanelOpen && (
              <div className="fixed top-12 bottom-0 left-0 z-40 w-full sm:w-80 max-w-[85vw] lg:relative lg:top-0 lg:bottom-auto lg:z-10 lg:w-72 xl:w-80 shrink-0 shadow-2xl lg:shadow-none transition-all duration-300 flex flex-col">
                <IncidentExplorer />
              </div>
            )}

            {/* Dominant WebGL Map Centerpiece */}
            <main className="relative flex-1 h-full w-full min-w-0 overflow-hidden">
              <MapView />

              {/* Interactive Guided Demo HUD */}
              <DemoInvestigationModal />

              {/* Mobile/Tablet Quick View Switcher: Map | Incidents | Details */}
              <div className="lg:hidden absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-full border border-[#2F4F70] bg-[#102438]/95 px-1.5 py-1 shadow-2xl backdrop-blur-md select-none">
                <button
                  type="button"
                  onClick={() => {
                    setLeftPanelOpen(false);
                    setRightPanelOpen(false);
                  }}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    !leftPanelOpen && !rightPanelOpen
                      ? 'bg-[#1769AA] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Map className="h-3.5 w-3.5" />
                  <span>Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLeftPanelOpen(true);
                    setRightPanelOpen(false);
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    leftPanelOpen
                      ? 'bg-[#1769AA] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span>Incidents</span>
                  <span className="rounded-full bg-[#1C3D5E] px-1.5 py-0.2 text-[10px] font-mono text-sky-200">
                    {incidents.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRightPanelOpen(true);
                    setLeftPanelOpen(false);
                  }}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    rightPanelOpen
                      ? 'bg-[#1769AA] text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Details</span>
                </button>
              </div>
            </main>

            {/* Mobile Backdrop for Right Panel on screens < lg */}
            {rightPanelOpen && (
              <div
                className="fixed inset-0 top-12 z-30 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
                onClick={toggleRightPanel}
                aria-label="Close details panel"
              />
            )}

            {/* Right Collapsible Intelligence Panel: Bottom sheet on mobile (< md), side sheet on tablet (md to < lg), column on desktop (≥ lg) */}
            {rightPanelOpen && (
              <div className="fixed inset-x-0 bottom-0 z-40 max-h-[72vh] w-full rounded-t-xl overflow-hidden shadow-2xl md:rounded-none md:inset-x-auto md:top-12 md:bottom-0 md:right-0 md:max-h-full md:w-88 lg:relative lg:top-0 lg:bottom-auto lg:right-auto lg:z-10 lg:h-full lg:w-88 xl:w-96 shrink-0 lg:shadow-none transition-all duration-300 flex flex-col min-w-0">
                <RightIntelligencePanel />
              </div>
            )}
          </div>

          {/* 3. Bottom Playback Timeline */}
          <BottomTimeline />
        </>
      )}

      {/* 4. Global Floating Modals & Intelligence Drawers */}
      <SystemStatusModal />
      <VesselDetailModal />
      <IncidentComparisonModal />
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
      <AlertsCenter />
      <AssignIncidentModal />
      <AdminAuditModal />
      <CopilotDrawer />
    </div>
  );
};

export default App;
