import React, { useEffect } from 'react';
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

export const App: React.FC = () => {
  const {
    activeMode,
    leftPanelOpen,
    toggleLeftPanel,
    setLeftPanelOpen,
    rightPanelOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
  } = usePoseidonStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setLeftPanelOpen(false);
    }
  }, [setLeftPanelOpen]);

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
                className="fixed inset-0 z-30 bg-black/40 lg:hidden transition-opacity"
                onClick={toggleLeftPanel}
                aria-label="Close incident explorer"
              />
            )}

            {/* Left Collapsible Incident Explorer: Drawer on mobile/tablet (< lg), Column on desktop (≥ lg) */}
            {leftPanelOpen && (
              <div className="fixed inset-y-0 left-0 z-40 h-full w-full sm:w-80 max-w-[85vw] lg:relative lg:inset-auto lg:z-10 lg:w-72 xl:w-80 shrink-0 shadow-2xl lg:shadow-none transition-all duration-300">
                <IncidentExplorer />
              </div>
            )}

            {/* Dominant WebGL Map Centerpiece */}
            <main className="relative flex-1 h-full w-full min-w-0 overflow-hidden">
              <MapView />

              {/* Interactive Guided Demo HUD */}
              <DemoInvestigationModal />
            </main>

            {/* Right Collapsible Intelligence Panel: Bottom sheet on mobile (< md), column on tablet & desktop (≥ md) */}
            {rightPanelOpen && (
              <div className="fixed inset-x-0 bottom-9.5 z-30 max-h-[72vh] w-full max-w-full md:relative md:inset-auto md:z-10 md:h-full md:max-h-full md:w-80 lg:w-88 xl:w-96 shrink-0 shadow-2xl md:shadow-none transition-all duration-300 flex flex-col min-w-0">
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
