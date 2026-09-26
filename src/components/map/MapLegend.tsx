import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="absolute left-3.5 bottom-10 z-20 w-60 rounded border border-[#D1D5DB] bg-white shadow-sm text-xs text-gray-800"
      style={{ borderRadius: '4px' }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex cursor-pointer items-center justify-between px-3 py-1.5 border-b border-[#E5E7EB] bg-[#F8FAFC] select-none hover:bg-gray-100 transition"
      >
        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
          Map legend
        </span>
        {collapsed ? (
          <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
        )}
      </div>

      {!collapsed && (
        <div className="p-2.5 space-y-2.5 text-[11px]">
          {/* Oil spill detection */}
          <div>
            <div className="font-semibold text-gray-600 mb-1">
              Oil spill detection
            </div>
            <div className="space-y-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-3 rounded-xs border border-[#B42318] bg-[#B42318]/30" />
                <span className="text-gray-700">High confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-3 rounded-xs border border-[#C47A00] bg-[#C47A00]/30" />
                <span className="text-gray-700">Medium confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-3 rounded-xs border border-[#D97706] bg-[#D97706]/20" />
                <span className="text-gray-700">Low confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-3 rounded-xs border-2 border-[#17324D] bg-[#17324D]/15" />
                <span className="text-gray-900 font-semibold">Active selection</span>
              </div>
            </div>
          </div>

          {/* Vessels & AIS */}
          <div>
            <div className="font-semibold text-gray-600 mb-1">
              Vessel traffic
            </div>
            <div className="space-y-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="text-[#1769AA] font-bold">▲</span>
                <span className="text-gray-700">Vessel position & heading</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#64748B] inline-block" />
                <span className="text-gray-700">Historical track</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#B42318] inline-block border-b border-dashed border-[#B42318]" />
                <span className="text-[#B42318]">Spill window transit</span>
              </div>
            </div>
          </div>

          {/* Forecast & Forcing */}
          <div>
            <div className="font-semibold text-gray-600 mb-1">
              Drift forecast & environment
            </div>
            <div className="space-y-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#1769AA] inline-block" />
                <span className="text-gray-700">Predicted drift path</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-3 rounded-xs border border-[#7C3AED] bg-[#7C3AED]/20" />
                <span className="text-gray-700">Forecast uncertainty zone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#2563EB] inline-block" />
                <span className="text-gray-700">Ocean surface current</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 border-b border-dashed border-gray-400 inline-block" />
                <span className="text-gray-700">Surface wind field</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
