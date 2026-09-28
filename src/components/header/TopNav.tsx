import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  ChevronLeft,
  ChevronRight,
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

  const navRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const navModes: { id: AppMode; label: string; shortLabel?: string; operationalOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'detection', label: 'Live Map' },
    { id: 'analytics', label: 'History & Analytics', shortLabel: 'Analytics' },
    { id: 'attribution', label: 'Attribution', operationalOnly: true },
    { id: 'forecast', label: 'Forecast', operationalOnly: true },
    { id: 'evidence', label: 'Evidence', operationalOnly: true },
    { id: 'public-info', label: 'Public Info' },
  ];

  const checkScroll = useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    checkScroll();

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    // Enable mouse wheel horizontal scrolling over nav tabs
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      el.removeEventListener('wheel', handleWheel);
    };
  }, [checkScroll]);

  // Auto-scroll active tab into view when activeMode changes
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      const activeBtn = el.querySelector<HTMLButtonElement>('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
      checkScroll();
    }, 60);
    return () => clearTimeout(timer);
  }, [activeMode, checkScroll]);

  const scrollNav = (direction: 'left' | 'right') => {
    const el = navRef.current;
    if (!el) return;
    const offset = direction === 'left' ? -180 : 180;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <header className="relative z-30 flex h-12 w-full max-w-full items-center justify-between border-b border-[#0F2538] bg-[#17324D] px-2 sm:px-3 text-white select-none shadow-sm box-border min-w-0 overflow-hidden">
      {/* 1. LEFT ZONE: Brand & Sidebar Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0 pr-1 sm:pr-2">
        <button
          onClick={toggleLeftPanel}
          title={leftPanelOpen ? 'Collapse incident list' : 'Expand incident list'}
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2F4F70] bg-[#1C3D5E] text-slate-200 hover:bg-[#254F78] hover:text-white transition shrink-0 cursor-pointer"
        >
          {leftPanelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {/* Institutional Maritime Emblem: Clean Flat Globe */}
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#102438] border border-[#2F4F70] text-[#93C5FD] shrink-0">
            <Globe2 className="h-4 w-4" />
          </div>

          <div className="flex flex-col shrink-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-sm sm:text-base font-bold tracking-tight text-white shrink-0">
                POSEIDON
              </span>
              <span className="hidden min-[1600px]:inline text-xs text-slate-300 font-normal truncate max-w-[190px]">
                Marine Oil Spill Monitoring
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CENTER ZONE: Primary Navigation with Visual Scroll Indicators & Fade Masks */}
      <div className="relative flex-1 min-w-0 flex items-center mx-1 sm:mx-2 overflow-hidden">
        {/* Left Scroll Arrow & Gradient Fade */}
        {canScrollLeft && (
          <div className="absolute left-0 inset-y-0 z-20 flex items-center pr-3 bg-gradient-to-r from-[#17324D] via-[#17324D]/95 to-transparent pointer-events-none">
            <button
              type="button"
              onClick={() => scrollNav('left')}
              title="Scroll navigation left"
              className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#102438] text-slate-200 border border-[#2F4F70] hover:bg-[#254F78] hover:text-white shadow-md transition cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Nav Tabs Container */}
        <nav
          ref={navRef}
          aria-label="Primary Navigation"
          className="flex-1 min-w-0 overflow-x-auto no-scrollbar flex items-center scroll-smooth py-1"
        >
          <div className="flex items-center space-x-1 shrink-0 px-1">
            {navModes.map((mode) => {
              const isActive = activeMode === mode.id;
              const isRestrictedForPublic = currentUser.role === 'public' && mode.operationalOnly;

              return (
                <button
                  key={mode.id}
                  data-active={isActive}
                  onClick={() => setActiveMode(mode.id)}
                  title={
                    isRestrictedForPublic
                      ? `${mode.label} (Operational investigation view - sensitive attribution masked in public mode)`
                      : mode.label
                  }
                  className={`relative flex items-center gap-1 px-2.5 py-1.5 text-xs transition rounded-t-sm whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0F2538] text-white font-semibold border-b-2 border-white'
                      : 'text-slate-200 hover:bg-[#1F4367] hover:text-white font-medium'
                  }`}
                >
                  {mode.shortLabel ? (
                    <>
                      <span className="hidden xl:inline">{mode.label}</span>
                      <span className="xl:hidden">{mode.shortLabel}</span>
                    </>
                  ) : (
                    <span>{mode.label}</span>
                  )}
                  {isRestrictedForPublic && (
                    <Lock className="h-2.5 w-2.5 text-slate-400 opacity-80 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right Scroll Arrow & Gradient Fade */}
        {canScrollRight && (
          <div className="absolute right-0 inset-y-0 z-20 flex items-center pl-3 bg-gradient-to-l from-[#17324D] via-[#17324D]/95 to-transparent pointer-events-none">
            <button
              type="button"
              onClick={() => scrollNav('right')}
              title="Scroll navigation right"
              className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#102438] text-slate-200 border border-[#2F4F70] hover:bg-[#254F78] hover:text-white shadow-md transition cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Subtle vertical divider between Center Navigation and Right Controls */}
      <div className="hidden sm:block h-6 w-px bg-[#2F4F70] shrink-0 mx-1.5" />

      {/* 3. RIGHT ZONE: System Controls & Operational Utility Strip */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1">
        {/* Historical Replay Mode Toggle */}
        <button
          onClick={toggleReplayMode}
          title={isReplayMode ? 'Return to live real-time ingestion mode' : 'Switch to historical incident replay'}
          className={`hidden sm:flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-semibold transition border shrink-0 cursor-pointer ${
            isReplayMode
              ? 'bg-amber-600 border-amber-500 text-white shadow-xs'
              : 'border-[#2F4F70] bg-[#102438] text-slate-300 hover:text-white hover:bg-[#163350]'
          }`}
        >
          <History className="h-3 w-3 shrink-0" />
          <span className="hidden min-[1680px]:inline">{isReplayMode ? 'Replay' : 'Live'}</span>
        </button>

        {/* Compare Incidents Modal Trigger */}
        <button
          onClick={() => {
            const other = incidents.find((i) => i.id !== activeIncidentId) || incidents[0];
            setComparedIncidentIds([activeIncidentId, other.id]);
          }}
          title="Compare incidents side-by-side"
          className="hidden lg:flex items-center gap-1 rounded-sm border border-[#2F4F70] bg-[#102438] px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#163350] transition shrink-0 cursor-pointer"
        >
          <GitCompare className="h-3 w-3 shrink-0" />
          <span className="hidden min-[1680px]:inline">Compare</span>
        </button>

        {/* Alerts Center Trigger */}
        <button
          onClick={() => setAlertsCenterOpen(true)}
          title="Operational Alerts Center & Incident Tasking"
          className="relative flex items-center gap-1.5 rounded-sm border border-[#2F4F70] bg-[#102438] px-2 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#163350] transition shrink-0 cursor-pointer"
        >
          <Bell className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden md:inline">Alerts</span>
          {unreadAlerts > 0 && (
            <span className="rounded-full bg-[#B42318] px-1 py-0.2 font-mono text-[9px] font-bold text-white leading-none shrink-0">
              {unreadAlerts < 10 ? `0${unreadAlerts}` : unreadAlerts}
            </span>
          )}
        </button>

        {/* Role-Based Access Control Switcher */}
        <div className="shrink-0">
          <RoleSwitcher />
        </div>

        {/* Admin Shortcut for Admin Role */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setAdminModalOpen(true)}
            title="Administration & Audit Center"
            className="hidden xl:flex items-center gap-1 rounded-sm border border-purple-600/70 bg-purple-950/70 px-2 py-1 text-xs font-semibold text-purple-200 hover:bg-purple-900 transition shrink-0 cursor-pointer"
          >
            <Settings className="h-3 w-3 text-purple-300 shrink-0" />
            <span className="hidden min-[1680px]:inline">Admin</span>
          </button>
        )}

        {/* Maritime Intelligence Copilot Trigger */}
        <button
          onClick={toggleCopilot}
          title="POSEIDON Maritime Intelligence Copilot"
          className="hidden sm:flex items-center gap-1 rounded-sm border border-cyan-600 bg-cyan-900/90 px-2 py-1 text-xs font-semibold text-cyan-200 hover:bg-cyan-800 hover:text-white transition shadow-2xs shrink-0 cursor-pointer"
        >
          <Bot className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
          <span className="hidden min-[1680px]:inline">Copilot</span>
        </button>

        {/* Run Demonstration Action Button */}
        <button
          onClick={startDemoInvestigation}
          className={`hidden sm:flex items-center gap-1 rounded-sm px-2 sm:px-2.5 py-1 text-xs font-medium transition border shrink-0 cursor-pointer ${
            demoInvestigation.isActive
              ? 'bg-[#C47A00] border-[#995E00] text-white'
              : 'bg-[#1769AA] border-[#13588F] text-white hover:bg-[#145C96]'
          }`}
        >
          <Play className="h-3 w-3 fill-current shrink-0" />
          <span className="hidden xl:inline">{demoInvestigation.isActive ? 'Demo active' : 'Run demo'}</span>
        </button>

        {/* Operational Status Display */}
        <div
          onClick={() => setSystemStatusOpen(true)}
          className="hidden min-[1700px]:flex items-center gap-2 rounded-sm border border-[#2F4F70] bg-[#102438] px-2 py-1 text-[11px] cursor-pointer hover:bg-[#163350] transition shrink-0"
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
          className="hidden sm:flex h-7 w-7 items-center justify-center rounded-sm border border-[#2F4F70] bg-[#1C3D5E] text-slate-200 hover:text-white transition shrink-0 cursor-pointer"
        >
          <Activity className="h-3.5 w-3.5" />
        </button>

        {/* Right Info Panel Toggle */}
        <button
          onClick={toggleRightPanel}
          title={rightPanelOpen ? 'Collapse information panel' : 'Expand information panel'}
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2F4F70] bg-[#1C3D5E] text-slate-200 hover:bg-[#254F78] hover:text-white transition shrink-0 cursor-pointer"
        >
          {rightPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
