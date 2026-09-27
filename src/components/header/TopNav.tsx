import React from 'react';
import {
  Globe2,
  Play,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Bell,
  Bot,
  GitCompare,
  History,
  Lock,
  Shield,
  Settings,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { AppMode } from '../../types';
import { RoleSwitcher } from './RoleSwitcher';

export const TopNav: React.FC = () => {
  const {
    activeMode,
    setActiveMode,
    leftPanelOpen,
    toggleLeftPanel,
    rightPanelOpen,
    toggleRightPanel,
    startDemoInvestigation,
    demoInvestigation,
    setSystemStatusOpen,
    alerts,
    setAlertsCenterOpen,
    toggleCopilot,
    isReplayMode,
    toggleReplayMode,
    incidents,
    activeIncidentId,
    setComparedIncidentIds,
    currentUser,
    setAdminModalOpen,
  } = usePoseidonStore();

  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const navModes: { id: AppMode; label: string; operationalOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'detection', label: 'Live Map' },
    { id: 'analytics', label: 'History & Analytics' },
    { id: 'attribution', label: 'Attribution', operationalOnly: true },
    { id: 'forecast', label: 'Forecast', operationalOnly: true },
    { id: 'evidence', label: 'Evidence', operationalOnly: true },
    { id: 'public-info', label: 'Public Info' },
  ];

  return (
    <header className="relative z-30 flex h-12 w-full max-w-full items-center justify-between border-b border-[#0F2538] bg-[#17324D] px-2 sm:px-3.5 text-white select-none shadow-sm box-border min-w-0">
      {/* Left: Program Branding & Sidebar Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          onClick={toggleLeftPanel}
          title={leftPanelOpen ? 'Collapse incident list' : 'Expand incident list'}
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2F4F70] bg-[#1C3D5E] text-slate-200 hover:bg-[#254F78] hover:text-white transition"
        >
          {leftPanelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2">
          {/* Institutional Maritime Emblem: Clean Flat Globe */}
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#102438] border border-[#2F4F70] text-[#93C5FD]">
            <Globe2 className="h-4 w-4" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-base font-bold tracking-tight text-white">
                POSEIDON
              </span>
              <span className="hidden sm:inline text-xs text-slate-300 font-normal">
                Marine Oil Spill Monitoring System
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Institutional Navigation Tabs */}
      <nav className="flex items-center space-x-0.5 sm:space-x-1 overflow-x-auto no-scrollbar min-w-0 shrink">
        {navModes.map((mode) => {
          const isActive = activeMode === mode.id;
          const isRestrictedForPublic = currentUser.role === 'public' && mode.operationalOnly;

          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              title={
                isRestrictedForPublic
                  ? `${mode.label} (Operational investigation view - sensitive attribution masked in public mode)`
                  : mode.label
              }
              className={`relative flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 text-xs transition rounded-t-sm whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#0F2538] text-white font-semibold border-b-2 border-white'
                  : 'text-slate-200 hover:bg-[#1F4367] hover:text-white font-medium'
              }`}
            >
              <span>{mode.label}</span>
              {isRestrictedForPublic && (
                <Lock className="h-2.5 w-2.5 text-slate-400 opacity-80" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Operational Telemetry Status, Demo Trigger, Role Switcher, Panel Toggle */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Historical Replay Mode Toggle */}
        <button
          onClick={toggleReplayMode}
          title={isReplayMode ? 'Return to live real-time ingestion mode' : 'Switch to historical incident replay'}
          className={`hidden sm:flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold transition border ${
            isReplayMode
              ? 'bg-amber-600 border-amber-500 text-white shadow-xs'
              : 'border-[#2F4F70] bg-[#102438] text-slate-300 hover:text-white hover:bg-[#163350]'
          }`}
        >
          <History className="h-3 w-3" />
          <span className="hidden xl:inline">{isReplayMode ? 'Replay' : 'Live'}</span>
        </button>

        {/* Compare Incidents Modal Trigger */}
        <button
          onClick={() => {
            const other = incidents.find((i) => i.id !== activeIncidentId) || incidents[0];
            setComparedIncidentIds([activeIncidentId, other.id]);
          }}
          title="Compare incidents side-by-side"
          className="hidden md:flex items-center gap-1 rounded-sm border border-[#2F4F70] bg-[#102438] px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#163350] transition"
        >
          <GitCompare className="h-3 w-3" />
          <span className="hidden xl:inline">Compare</span>
        </button>

        {/* Alerts Center Trigger */}
        <button
          onClick={() => setAlertsCenterOpen(true)}
          title="Operational Alerts Center & Incident Tasking"
          className="relative flex items-center gap-1.5 rounded-sm border border-[#2F4F70] bg-[#102438] px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#163350] transition"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Alerts</span>
          {unreadAlerts > 0 && (
            <span className="rounded-full bg-[#B42318] px-1 py-0.2 font-mono text-[9px] font-bold text-white leading-none">
              {unreadAlerts < 10 ? `0${unreadAlerts}` : unreadAlerts}
            </span>
          )}
        </button>

        {/* Role-Based Access Control Switcher */}
        <RoleSwitcher />

        {/* Admin Shortcut for Admin Role */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setAdminModalOpen(true)}
            title="Administration & Audit Center"
            className="hidden lg:flex items-center gap-1 rounded-sm border border-purple-600/70 bg-purple-950/70 px-2 py-1 text-xs font-semibold text-purple-200 hover:bg-purple-900 transition"
          >
            <Settings className="h-3 w-3 text-purple-300" />
            <span className="hidden xl:inline">Admin</span>
          </button>
        )}

        {/* Maritime Intelligence Copilot Trigger */}
        <button
          onClick={toggleCopilot}
          title="POSEIDON Maritime Intelligence Copilot"
          className="hidden sm:flex items-center gap-1 rounded-sm border border-cyan-600 bg-cyan-900/90 px-2 py-1 text-xs font-semibold text-cyan-200 hover:bg-cyan-800 hover:text-white transition shadow-2xs"
        >
          <Bot className="h-3.5 w-3.5 text-cyan-300" />
          <span className="hidden xl:inline">Copilot</span>
        </button>

        {/* Run Demonstration Action Button */}
        <button
          onClick={startDemoInvestigation}
          className={`hidden sm:flex items-center gap-1 rounded-sm px-2.5 py-1 text-xs font-medium transition border ${
            demoInvestigation.isActive
              ? 'bg-[#C47A00] border-[#995E00] text-white'
              : 'bg-[#1769AA] border-[#13588F] text-white hover:bg-[#145C96]'
          }`}
        >
          <Play className="h-3 w-3 fill-current" />
          <span className="hidden md:inline">{demoInvestigation.isActive ? 'Demo active' : 'Run demo'}</span>
        </button>

        {/* Operational Status Display */}
        <div
          onClick={() => setSystemStatusOpen(true)}
          className="hidden 2xl:flex items-center gap-2.5 rounded-sm border border-[#2F4F70] bg-[#102438] px-2 py-1 text-[11px] cursor-pointer hover:bg-[#163350] transition"
          title="Click to view detailed system ingestion status"
        >
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#287D3C]"></span>
            <span className="text-slate-200">Satellite</span>
          </div>
          <span className="text-[#3E5F80]">|</span>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#287D3C]"></span>
            <span className="text-slate-200">AIS</span>
          </div>
        </div>

        {/* System Details Dialog Trigger */}
        <button
          onClick={() => setSystemStatusOpen(true)}
          title="System pipeline status"
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2F4F70] bg-[#1C3D5E] text-slate-200 hover:text-white transition"
        >
          <Activity className="h-3.5 w-3.5" />
        </button>

        {/* Right Info Panel Toggle */}
        <button
          onClick={toggleRightPanel}
          title={rightPanelOpen ? 'Collapse information panel' : 'Expand information panel'}
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2F4F70] bg-[#1C3D5E] text-slate-200 hover:bg-[#254F78] hover:text-white transition"
        >
          {rightPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
