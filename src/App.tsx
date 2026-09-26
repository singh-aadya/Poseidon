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

export const App: React.FC = () => {
  const {
    leftPanelOpen,
    rightPanelOpen,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
  } = usePoseidonStore();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#F5F7F9] text-gray-900 font-sans">
      {/* 1. Compact NASA FIRMS-Style Top Navigation */}
      <TopNav />

      {/* 2. Main Middle Workspace: Map + Floating Collapsible Overlays */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Collapsible Incident Explorer */}
        {leftPanelOpen && (
          <div className="absolute lg:relative z-20 h-full w-80 max-w-[85vw] shrink-0 shadow-2xl transition-all duration-300">
            <IncidentExplorer />
          </div>
        )}

        {/* Dominant WebGL Map Centerpiece */}
        <main className="relative flex-1 h-full w-full overflow-hidden">
          <MapView />

          {/* Interactive Guided Demo HUD */}
          <DemoInvestigationModal />
        </main>

        {/* Right Collapsible Intelligence Panel */}
        {rightPanelOpen && (
          <div className="absolute right-0 top-0 bottom-0 lg:relative z-20 h-full w-96 max-w-[90vw] shrink-0 shadow-2xl transition-all duration-300">
            <RightIntelligencePanel />
          </div>
        )}
      </div>

      {/* 3. Bottom Playback Timeline */}
      <BottomTimeline />

      {/* 4. Global Floating Modals & Intelligence Drawers */}
      <SystemStatusModal />
      <VesselDetailModal />
      <IncidentComparisonModal />
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
      <CopilotDrawer />
    </div>
  );
};

export default App;
