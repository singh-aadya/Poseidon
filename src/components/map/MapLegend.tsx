import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegend: React.FC = () => {
  // Default to collapsed / compact as requested in Priority 14
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="absolute left-3.5 bottom-10 z-20 w-52 rounded-sm border border-[#D1D5DB] bg-white shadow-xs text-xs text-gray-800">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex cursor-pointer items-center justify-between px-2.5 py-1.5 border-b border-[#E5E7EB] bg-[#F8FAFC] select-none hover:bg-gray-100 transition"
      >
        <span className="text-[10px] font-semibold text-gray-700">
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
          {/* Oil detection */}
          <div>
            <div className="font-semibold text-gray-700 mb-1">
              Oil detection
            </div>
            <div className="space-y-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#B42318] shrink-0" />
                <span className="text-gray-700">High confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#C47A00] shrink-0" />
                <span className="text-gray-700">Medium confidence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#6B7280] shrink-0" />
                <span className="text-gray-700">Low confidence</span>
              </div>
            </div>
          </div>

          {/* Vessels */}
          <div>
            <div className="font-semibold text-gray-700 mb-1">
              Vessels
            </div>
            <div className="space-y-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="text-[#1769AA] font-bold text-xs leading-none">▲</span>
                <span className="text-gray-700">Vessel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#64748B] inline-block" />
                <span className="text-gray-700">Vessel track</span>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div>
            <div className="font-semibold text-gray-700 mb-1">
              Forecast
            </div>
            <div className="space-y-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#1769AA] inline-block border-b border-dashed border-[#1769AA]" />
                <span className="text-gray-700">Predicted drift</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-3 rounded-xs border border-[#7C3AED] bg-[#7C3AED]/20" />
                <span className="text-gray-700">Uncertainty</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
