import React from 'react';
import {
  ShieldAlert,
  Wind,
  Ship,
  FileText,
  Crosshair,
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
  } = usePoseidonStore();

  const inc = getActiveIncident();

  const tabs: { id: AppMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'detection', label: 'Detection', icon: ShieldAlert },
    { id: 'attribution', label: 'Attribution', icon: Ship },
    { id: 'forecast', label: 'Forecast', icon: Wind },
    { id: 'evidence', label: 'Evidence', icon: FileText },
  ];

  return (
    <aside className="relative flex h-full w-96 flex-col border-l border-[#D1D5DB] bg-white text-gray-800 select-none shadow-sm">
      {/* Top Header */}
      <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-500">
            Active incident details
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
              inc.severity === 'HIGH'
                ? 'border-[#B42318] bg-[#FEF2F2] text-[#B42318]'
                : 'border-[#C47A00] bg-[#FFFBEB] text-[#C47A00]'
            }`}
            style={{ borderRadius: '3px' }}
          >
            {inc.severity === 'HIGH' ? 'High confidence' : 'Medium confidence'}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#17324D]">{inc.id}</span>
            <button
              type="button"
              onClick={() => flyToCoords(inc.coordinates, 10.4)}
              title="Focus map on this incident"
              className="flex items-center gap-1 rounded-xs border border-[#BFDBFE] bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#1769AA] hover:bg-[#DBEAFE] transition cursor-pointer"
            >
              <Crosshair className="h-2.5 w-2.5" />
              <span>Focus map</span>
            </button>
          </div>
          <span className="font-mono text-xs text-gray-700 font-semibold">
            {Math.round(inc.confidence * 100)}% detection
          </span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-[#E5E7EB] bg-white text-xs font-medium">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              className={`flex items-center justify-center gap-1.5 py-2.5 transition border-b-2 ${
                isActive
                  ? 'border-[#1769AA] text-[#1769AA] font-bold bg-[#F8FAFC]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subpanel Content */}
      <div className="flex-1 overflow-y-auto">
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
