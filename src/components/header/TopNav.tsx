import React from 'react';
import {
  Globe2,
  Play,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { AppMode } from '../../types';

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
  } = usePoseidonStore();

  const navModes: { id: AppMode; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'detection', label: 'Detection' },
    { id: 'attribution', label: 'Attribution' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'evidence', label: 'Evidence' },
  ];

  return (
    <header className="relative z-30 flex h-12 w-full items-center justify-between border-b border-[#0F2538] bg-[#17324D] px-3.5 text-white select-none shadow-sm">
      {/* Left: Program Branding & Sidebar Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLeftPanel}
          title={leftPanelOpen ? 'Collapse incident list' : 'Expand incident list'}
          className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#2F4F70] bg-[#1C3D5E] text-slate-200 hover:bg-[#254F78] hover:text-white transition"
        >
          {leftPanelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2.5">
          {/* Institutional Maritime Emblem: Clean Flat Globe */}
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#102438] border border-[#2F4F70] text-[#93C5FD]">
            <Globe2 className="h-4 w-4" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-base font-bold tracking-tight text-white">
                POSEIDON
              </span>
              <span className="text-xs text-slate-300 font-normal">
                Marine Oil Spill Monitoring System
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Institutional Navigation Tabs */}
      <nav className="flex items-center space-x-1">
        {navModes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`relative px-3.5 py-1.5 text-xs transition rounded-t-sm ${
                isActive
                  ? 'bg-[#0F2538] text-white font-semibold border-b-2 border-white'
                  : 'text-slate-200 hover:bg-[#1F4367] hover:text-white font-medium'
              }`}
            >
              {mode.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Operational Telemetry Status, Demo Trigger, Panel Toggle */}
      <div className="flex items-center gap-3">
        {/* Run Demonstration Action Button */}
        <button
          onClick={startDemoInvestigation}
          className={`flex items-center gap-1.5 rounded-sm px-3 py-1 text-xs font-medium transition border ${
            demoInvestigation.isActive
              ? 'bg-[#C47A00] border-[#995E00] text-white'
              : 'bg-[#1769AA] border-[#13588F] text-white hover:bg-[#145C96]'
          }`}
        >
          <Play className="h-3 w-3 fill-current" />
          <span>{demoInvestigation.isActive ? 'Demonstration active' : 'Run demonstration'}</span>
        </button>

        {/* Operational Status Display */}
        <div
          onClick={() => setSystemStatusOpen(true)}
          className="hidden md:flex items-center gap-3 rounded-sm border border-[#2F4F70] bg-[#102438] px-2.5 py-1 text-[11px] cursor-pointer hover:bg-[#163350] transition"
          title="Click to view detailed system ingestion status"
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#287D3C]"></span>
            <span className="text-slate-200">Satellite: Operational</span>
          </div>
          <span className="text-[#3E5F80]">|</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#287D3C]"></span>
            <span className="text-slate-200">AIS: Operational</span>
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
