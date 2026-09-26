import React, { useState } from 'react';
import {
  Ship,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { SourceCandidate } from '../../types';
import { formatUtcDateTime } from '../../utils/formatting';

export const AttributionPanel: React.FC = () => {
  const [whyExpanded, setWhyExpanded] = useState(true);

  const {
    getActiveIncident,
    selectedCandidateId,
    setSelectedCandidateId,
    setVesselDetailModalOpen,
  } = usePoseidonStore();

  const inc = getActiveIncident();
  const selectedCandidate: SourceCandidate =
    inc.candidates.find((c) => c.id === selectedCandidateId) || inc.candidates[0];

  return (
    <div className="p-4 space-y-4 text-xs text-gray-800 bg-white">
      {/* 1. Header & Reconstructed Vessel Activity Summary */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
          <div className="flex items-center gap-1.5 text-[#17324D]">
            <Ship className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>AIS spatio-temporal reconstruction</span>
          </div>
          <span className="text-gray-500 font-normal">30 km corridor</span>
        </div>

        {/* Release window context */}
        <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1">
          <span className="text-gray-500">Target release window</span>
          <div className="flex items-center gap-1 font-mono text-[11px] text-gray-800 font-medium">
            <span>{formatUtcDateTime(inc.spill_window_start).slice(5)}</span>
            <ArrowRight className="h-3 w-3 text-gray-400 shrink-0" />
            <span>{formatUtcDateTime(inc.spill_window_end).slice(5)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1.5">
          <div className="py-1.5 px-2 rounded-sm bg-slate-50 border border-slate-200 text-center">
            <div className="text-gray-500 text-[10px]">Evaluated corridor vessels</div>
            <div className="text-sm font-bold text-gray-900 font-mono">12 vessels</div>
          </div>
          <div className="py-1.5 px-2 rounded-sm bg-slate-50 border border-slate-200 text-center">
            <div className="text-gray-500 text-[10px]">Origin intersections</div>
            <div className="text-sm font-bold text-[#1769AA] font-mono">
              {inc.candidates.length} candidates
            </div>
          </div>
        </div>
      </div>

      {/* 2. Source Candidates List */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="text-[11px] font-semibold text-gray-700">
          Source candidates
        </div>

        <div className="space-y-1 text-xs">
          {inc.candidates.map((cand, index) => {
            const isSelected = cand.id === selectedCandidate?.id;
            return (
              <div
                key={cand.id}
                onClick={() => setSelectedCandidateId(cand.id)}
                className={`flex cursor-pointer items-center justify-between rounded-sm border p-2 transition ${
                  isSelected
                    ? 'border-l-4 border-l-[#1769AA] border-[#BFDBFE] bg-[#F0F7FF] text-gray-900'
                    : 'border-[#E5E7EB] bg-white text-gray-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-400 font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <span>{cand.vessel_name}</span>
                      {cand.behavioral_signals.ais_gap_detected && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[#C47A00]"
                          title="AIS transmission gap recorded"
                        />
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {cand.vessel_type} • {cand.flag}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[#17324D] font-mono">
                    {cand.attribution_score}%
                  </div>
                  <div className="text-[9px] text-gray-500">Confidence</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Candidate Evidence & Score Breakdown */}
      {selectedCandidate && (
        <div className="border-b border-[#E5E7EB] pb-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold text-gray-500">
                Candidate assessment
              </div>
              <h3 className="font-sans text-sm font-bold text-[#17324D]">
                {selectedCandidate.vessel_name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-[#1769AA] font-mono">
                {selectedCandidate.attribution_score}%
              </span>
              <div className="text-[10px] text-gray-500">Attribution score</div>
            </div>
          </div>

          {/* Spatio-Temporal Match Breakdown */}
          <div className="rounded-sm border border-slate-200 bg-slate-50 p-2.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 border-b border-slate-200 pb-1">
              <span>Spatio-temporal match metrics</span>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                P(Source | Evidence) = 0.87
              </span>
            </div>
            <table className="w-full text-[11px]">
              <tbody className="divide-y divide-slate-200/70">
                <tr>
                  <td className="py-1 text-slate-600">Distance to reconstructed origin</td>
                  <td className="py-1 text-right font-mono font-bold text-slate-900">0.42 km <span className="text-[10px] text-slate-400 font-normal">(±1.4 km)</span></td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Temporal passage offset</td>
                  <td className="py-1 text-right font-mono font-bold text-slate-900">+18 min <span className="text-[10px] text-slate-400 font-normal">(coincident)</span></td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Kinematic speed anomaly</td>
                  <td className="py-1 text-right font-mono font-bold text-amber-700">14.1 → 8.2 kn <span className="text-[10px] text-amber-600 font-normal">(-41.8%)</span></td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Heading adjustment</td>
                  <td className="py-1 text-right font-mono font-bold text-slate-900">12° starboard <span className="text-[10px] text-slate-400 font-normal">(in window)</span></td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-600">Drift trajectory alignment</td>
                  <td className="py-1 text-right font-mono font-bold text-slate-900">0.94 <span className="text-[10px] text-slate-400 font-normal">(Pearson r)</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown Score Bars */}
          <div className="space-y-1.5 text-xs">
            <div className="text-[11px] font-semibold text-gray-700 mb-1">
              Multi-criteria consistency scores
            </div>
            {[
              { label: 'Spatial proximity', val: selectedCandidate.breakdown.spatio_temporal_proximity },
              { label: 'Trajectory consistency', val: selectedCandidate.breakdown.trajectory_consistency },
              { label: 'Spill-window overlap', val: selectedCandidate.breakdown.spill_window_overlap },
              { label: 'Behavioral anomaly', val: selectedCandidate.breakdown.behavior_anomaly },
              { label: 'Drift compatibility', val: selectedCandidate.breakdown.drift_compatibility },
              { label: 'AIS continuity', val: selectedCandidate.breakdown.ais_continuity },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-gray-600">{metric.label}</span>
                  <span className="font-semibold text-gray-800 font-mono">{metric.val}%</span>
                </div>
                <div className="h-1.5 w-full rounded-xs bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-[#1769AA] rounded-xs"
                    style={{ width: `${metric.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Behavioral Observations */}
          <div className="py-2 px-2.5 rounded-sm bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="text-[10px] font-semibold text-gray-600 mb-1">
              Behavioral observations
            </div>
            {selectedCandidate.behavioral_signals.speed_reduction && (
              <div className="flex items-start gap-1.5 text-gray-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#1769AA] mt-0.5 shrink-0" />
                <span>
                  <strong>Speed reduction:</strong>{' '}
                  {selectedCandidate.behavioral_signals.speed_reduction_detail || 'Deceleration observed in sector'}
                </span>
              </div>
            )}
            {selectedCandidate.behavioral_signals.course_deviation && (
              <div className="flex items-start gap-1.5 text-gray-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#1769AA] mt-0.5 shrink-0" />
                <span>
                  <strong>Course deviation:</strong>{' '}
                  {selectedCandidate.behavioral_signals.course_deviation_detail || 'Course shifted temporarily'}
                </span>
              </div>
            )}
            {selectedCandidate.behavioral_signals.ais_gap_detected && (
              <div className="flex items-start gap-1.5 text-amber-900">
                <AlertCircle className="h-3.5 w-3.5 text-[#C47A00] mt-0.5 shrink-0" />
                <span>
                  <strong>AIS transmission gap:</strong>{' '}
                  {selectedCandidate.behavioral_signals.ais_gap_duration_min} min telemetry gap recorded near origin
                </span>
              </div>
            )}
          </div>

          {/* Evidence Supporting Candidate */}
          <div className="rounded-sm border border-[#E5E7EB] bg-white overflow-hidden">
            <button
              onClick={() => setWhyExpanded(!whyExpanded)}
              className="flex w-full items-center justify-between p-2 text-left text-xs font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              <span>Evidence supporting candidate</span>
              {whyExpanded ? <ChevronUp className="h-3.5 w-3.5 text-gray-500" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-500" />}
            </button>
            {whyExpanded && (
              <div className="p-2.5 pt-0 space-y-1.5 border-t border-[#F1F5F9] text-xs text-gray-700">
                {selectedCandidate.why_this_vessel.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#1769AA] font-bold shrink-0">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View Vessel Profile Button */}
          <button
            onClick={() => setVesselDetailModalOpen(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-[#D1D5DB] bg-white py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 transition shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-gray-600" />
            <span>Open vessel registry record</span>
          </button>
        </div>
      )}

      {/* 4. Scientific Legal Disclaimer */}
      <div className="p-2 text-[10px] text-gray-500 leading-relaxed border-t border-slate-100">
        <strong className="text-gray-700 block mb-0.5">Scientific attribution protocol:</strong>
        Attribution confidence represents model-derived spatio-temporal correlation and
        does not establish legal responsibility. Formal validation requires physical inspection,
        fuel sample comparison, and official maritime inquiry.
      </div>
    </div>
  );
};
