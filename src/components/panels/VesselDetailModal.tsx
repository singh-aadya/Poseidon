import React from 'react';
import { X, Ship, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { formatUtcDateTime } from '../../utils/formatting';

export const VesselDetailModal: React.FC = () => {
  const {
    vesselDetailModalOpen,
    setVesselDetailModalOpen,
    getSelectedCandidate,
    getActiveIncident,
  } = usePoseidonStore();

  if (!vesselDetailModalOpen) return null;

  const vessel = getSelectedCandidate();
  const incident = getActiveIncident();
  if (!vessel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-sm border border-slate-300 bg-white shadow-xl overflow-hidden text-xs text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0F2538] bg-[#17324D] px-4 py-2.5 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#0F2538] text-slate-200">
              <Ship className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white tracking-tight">{vessel.vessel_name}</h2>
                <span className="rounded-sm bg-blue-100 border border-blue-300 px-1.5 py-0.5 text-[10px] text-blue-900 font-semibold font-mono">
                  {vessel.attribution_score}% confidence
                </span>
              </div>
              <div className="text-[11px] text-slate-300">
                {vessel.vessel_type} • Flag: {vessel.flag} ({vessel.flag_code})
              </div>
            </div>
          </div>

          <button
            onClick={() => setVesselDetailModalOpen(false)}
            className="text-slate-300 hover:text-white transition p-1"
            title="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto bg-slate-50/50">
          {/* Vessel Registry Details Grid */}
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-sm border border-slate-200 bg-white p-2">
              <span className="text-[10px] text-slate-500 block">IMO Number</span>
              <span className="font-mono font-semibold text-slate-800">{vessel.imo}</span>
            </div>
            <div className="rounded-sm border border-slate-200 bg-white p-2">
              <span className="text-[10px] text-slate-500 block">MMSI</span>
              <span className="font-mono font-semibold text-slate-800">{vessel.mmsi}</span>
            </div>
            <div className="rounded-sm border border-slate-200 bg-white p-2">
              <span className="text-[10px] text-slate-500 block">Callsign</span>
              <span className="font-mono font-semibold text-slate-800">{vessel.callsign}</span>
            </div>
            <div className="rounded-sm border border-slate-200 bg-white p-2">
              <span className="text-[10px] text-slate-500 block">Dimensions</span>
              <span className="font-mono text-slate-800">{vessel.length_meters}m × {vessel.beam_meters}m</span>
            </div>
            <div className="rounded-sm border border-slate-200 bg-white p-2">
              <span className="text-[10px] text-slate-500 block">Draught / Speed</span>
              <span className="font-mono text-slate-800">{vessel.draught_meters}m / {vessel.speed_knots} kn</span>
            </div>
            <div className="rounded-sm border border-slate-200 bg-white p-2">
              <span className="text-[10px] text-slate-500 block">Destination</span>
              <span className="font-semibold text-slate-800 truncate block">{vessel.destination}</span>
            </div>
          </div>

          {/* Spill Window Overlap Timeline */}
          <div className="rounded-sm border border-slate-200 bg-white p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold border-b border-slate-100 pb-1.5">
              <div className="flex items-center gap-1.5 text-[#1769AA]">
                <Clock className="h-3.5 w-3.5" />
                <span>Spatio-temporal overlap analysis</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">Incident ref: {incident.id}</span>
            </div>

            <div className="relative pt-3 pb-2">
              {/* Timeline bar */}
              <div className="h-2 w-full bg-slate-200 rounded-sm relative">
                {/* Highlighted spill window segment */}
                <div
                  className="absolute top-0 bottom-0 bg-red-200 border-x border-red-400 rounded-sm"
                  style={{ left: '25%', width: '45%' }}
                />
                {/* Vessel Transit event marker */}
                <div
                  className="absolute top-1/2 -mt-2 -ml-1.5 h-4 w-3 bg-[#1769AA] rounded-sm ring-1 ring-white"
                  style={{ left: '42%' }}
                  title="Vessel transit through slick origin"
                />
              </div>

              {/* Time tick labels */}
              <div className="mt-2.5 flex justify-between font-mono text-[10px] text-slate-500">
                <span>18:00 UTC</span>
                <span className="text-red-700 font-medium">20:00 (Window start)</span>
                <span className="text-[#1769AA] font-bold">23:15 (Transit)</span>
                <span className="text-red-700 font-medium">02:00 (Window end)</span>
                <span>06:00 UTC</span>
              </div>
            </div>

            <div className="rounded-sm border border-amber-300 bg-amber-50 p-2 text-[11px] text-amber-900 leading-relaxed">
              <span className="font-semibold text-amber-950">Spatial intersection:</span> Vessel
              transited within 1.2 km of reverse-drift reconstructed origin point at 23:14 UTC, directly
              within the estimated 8–14 hour weathering window.
            </div>
          </div>

          {/* Historical AIS Track Points Table */}
          <div className="rounded-sm border border-slate-200 bg-white p-3 space-y-2">
            <div className="text-[11px] font-semibold text-slate-700">
              Reconstructed AIS position logs
            </div>
            <div className="overflow-x-auto">
              <table className="gis-table">
                <thead>
                  <tr>
                    <th>Timestamp (UTC)</th>
                    <th>Coordinates</th>
                    <th>Speed</th>
                    <th>Heading</th>
                    <th>Analysis flag</th>
                  </tr>
                </thead>
                <tbody>
                  {vessel.historical_track.map((pt: any, i: number) => (
                    <tr
                      key={i}
                      className={
                        pt.is_in_spill_window
                          ? 'bg-red-50 text-red-900 font-medium'
                          : ''
                      }
                    >
                      <td className="font-mono">{formatUtcDateTime(pt.timestamp)}</td>
                      <td className="font-mono">
                        {pt.lat.toFixed(2)}°N, {Math.abs(pt.lng).toFixed(2)}°W
                      </td>
                      <td className="font-mono">{pt.speed_knots} kn</td>
                      <td className="font-mono">{pt.heading}°</td>
                      <td>
                        {pt.is_in_spill_window ? (
                          <span className="inline-block rounded-sm bg-red-100 border border-red-300 px-1.5 py-0.5 text-[9px] font-semibold text-red-800">
                            In spill window
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Passage</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center border-t border-slate-200 bg-white px-4 py-2.5">
          <div className="font-mono text-[10px] text-slate-500">
            Last telemetry refresh: 14:32 UTC
          </div>
          <button
            onClick={() => setVesselDetailModalOpen(false)}
            className="rounded-sm border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
