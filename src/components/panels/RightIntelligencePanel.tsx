import React from 'react';
import {
  ShieldAlert,
  Wind,
  Ship,
  FileText,
  Crosshair,
  X,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { AppMode } from '../../types';
import { DetectionPanel } from './DetectionPanel';
import { AttributionPanel } from './AttributionPanel';
import { ForecastPanel } from './ForecastPanel';
import { EvidencePanel } from './EvidencePanel';

export const RightIntelligencePanel: React.FC = () => {
  const {
    activeMode,
    setActiveMode,
    getActiveIncident,
    flyToCoords,
    toggleRightPanel,
  } = usePoseidonStore();

  const inc = getActiveIncident();
  const { currentUser, assignments, setAssignIncidentModalIncidentId } = usePoseidonStore();
  const assignment = assignments[inc.id] || {
    assignedTeam: 'Indian Coast Guard (ICG) Pollution Response Team',
    assignedResponder: 'Cmdr. Vikram Malhotra',
    workflowStage: 'Assigned',
    escalationLevel: 'CRITICAL RESPONSE',
  };

  const tabs: { id: AppMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'detection', label: 'Detection', icon: ShieldAlert },
    { id: 'attribution', label: 'Attribution', icon: Ship },
    { id: 'forecast', label: 'Forecast', icon: Wind },
    { id: 'evidence', label: 'Evidence', icon: FileText },
  ];

  return (
    <aside className="relative flex h-full w-full max-w-full flex-col md:border-l border-[#D1D5DB] bg-white text-gray-800 select-none shadow-sm box-border min-w-0">
      {/* Mobile/Tablet Grab Handle & Close Bar */}
      <div className="lg:hidden flex items-center justify-between px-3.5 py-2 bg-[#F1F5F9] border-b border-[#E2E8F0] shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 rounded-full bg-slate-400 md:hidden" />
          <span className="font-semibold text-slate-700 text-xs">Incident Intelligence & Dossier</span>
        </div>
        <button
          type="button"
          onClick={toggleRightPanel}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition font-medium cursor-pointer"
          title="Close details panel"
        >
          <span>Close</span>
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Top Header */}
      <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
          <span className="text-[11px] font-semibold text-gray-500 truncate">
            Active incident details
          </span>
          <span
            className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
              inc.severity === 'HIGH'
                ? 'border-[#B42318] bg-[#FEF2F2] text-[#B42318]'
                : 'border-[#C47A00] bg-[#FFFBEB] text-[#C47A00]'
            }`}
            style={{ borderRadius: '3px' }}
          >
            {inc.severity === 'HIGH' ? 'High confidence' : 'Medium confidence'}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-sm font-bold text-[#17324D] truncate">{inc.id}</span>
            <button
              type="button"
              onClick={() => flyToCoords(inc.coordinates, 10.4)}
              title="Focus map on this incident"
              className="flex items-center gap-1 rounded-xs border border-[#BFDBFE] bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#1769AA] hover:bg-[#DBEAFE] transition cursor-pointer shrink-0"
            >
              <Crosshair className="h-2.5 w-2.5" />
              <span>Focus map</span>
            </button>
          </div>
          <span className="font-mono text-xs text-gray-700 font-semibold shrink-0">
            {Math.round(inc.confidence * 100)}% detection
          </span>
        </div>

        {/* Operational Response Tasking Strip */}
        {currentUser.role !== 'public' ? (
          <div className="mt-2 flex items-center justify-between gap-1 bg-[#102438] text-white px-2 py-1.5 rounded-xs text-[10px]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span className="text-slate-300">Team:</span>
              <span className="font-semibold text-sky-200 truncate">{assignment.assignedTeam}</span>
              <span className="hidden sm:inline px-1 py-0.2 rounded-2xs bg-slate-800 text-[9px] font-mono border border-slate-700">
                {assignment.workflowStage}
              </span>
            </div>
            {(currentUser.role === 'operations' || currentUser.role === 'admin') && (
              <button
                onClick={() => setAssignIncidentModalIncidentId(inc.id)}
                className="px-2 py-0.5 text-[10px] font-bold rounded-xs bg-[#1769AA] hover:bg-[#1C3D5E] text-white shrink-0 transition"
              >
                Task / Escalate
              </button>
            )}
          </div>
        ) : (
          <div className="mt-1.5 flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2 py-1 rounded-xs text-[10px] border border-slate-200">
            <span className="font-semibold text-slate-700">Public Clearance:</span>
            <span>Verified incident record & open telemetry</span>
          </div>
        )}
      </div>

      {/* Mode Navigation Tabs: Horizontally scrollable row, never overflows page */}
      <div className="flex w-full items-center border-b border-[#E5E7EB] bg-white text-xs font-medium overflow-x-auto no-scrollbar shrink-0 min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              className={`flex flex-1 min-w-[76px] sm:min-w-[85px] items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1.5 transition border-b-2 shrink-0 whitespace-nowrap text-[11px] sm:text-xs ${
                isActive
                  ? 'border-[#1769AA] text-[#1769AA] font-bold bg-[#F8FAFC]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subpanel Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
        {activeMode === 'overview' || activeMode === 'detection' ? (
          <DetectionPanel />
        ) : activeMode === 'attribution' ? (
          <AttributionPanel />
        ) : activeMode === 'forecast' ? (
          <ForecastPanel />
        ) : (
          <EvidencePanel />
        )}
      </div>
    </aside>
  );
};

