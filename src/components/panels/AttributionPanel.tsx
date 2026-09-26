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
    <div className="space-y-4 p-3.5 text-xs text-gray-800 bg-white">
      {/* 1. Header & Reconstructed Vessel Activity Summary */}
      <div className="rounded border border-[#D1D5DB] bg-[#F8FAFC] p-3 space-y-2" style={{ borderRadius: '4px' }}>
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 uppercase tracking-wide">
          <div className="flex items-center gap-1.5 text-[#17324D]">
            <Ship className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>AIS spatio-temporal reconstruction</span>
          </div>
          <span className="text-gray-500 font-normal">30 km corridor</span>
        </div>

        {/* Release window context */}
        <div className="rounded bg-white border border-[#E5E7EB] p-2 text-xs" style={{ borderRadius: '3px' }}>
          <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
            Target release window
          </div>
          <div className="flex items-center justify-between text-gray-800 font-medium">
            <span>{formatUtcDateTime(inc.spill_window_start)}</span>
            <ArrowRight className="h-3 w-3 text-gray-400 mx-1 shrink-0" />
            <span>{formatUtcDateTime(inc.spill_window_end)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="rounded border border-[#E5E7EB] bg-white p-2 text-center" style={{ borderRadius: '3px' }}>
            <div className="text-gray-500 text-[10px]">Total vessels evaluated</div>
            <div className="text-sm font-bold text-gray-900">12 vessels</div>
          </div>
          <div className="rounded border border-[#E5E7EB] bg-white p-2 text-center" style={{ borderRadius: '3px' }}>
            <div className="text-gray-500 text-[10px]">Corridor intersections</div>
            <div className="text-sm font-bold text-[#1769AA]">
              {inc.candidates.length} candidates
            </div>
          </div>
        </div>
      </div>

      {/* 2. Source Candidates List (Section 17) */}
      <div className="rounded border border-[#D1D5DB] bg-white p-3 space-y-2" style={{ borderRadius: '4px' }}>
        <div className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
          Source candidates
        </div>

        <div className="space-y-1 text-xs">
          {inc.candidates.map((cand, index) => {
            const isSelected = cand.id === selectedCandidate?.id;
            return (
              <div
                key={cand.id}
                onClick={() => setSelectedCandidateId(cand.id)}
                className={`flex cursor-pointer items-center justify-between rounded border p-2 transition ${
                  isSelected
                    ? 'border-[#1769AA] bg-[#EFF6FF] text-gray-900 font-medium'
                    : 'border-[#E5E7EB] bg-white text-gray-700 hover:bg-[#F8FAFC]'
                }`}
                style={{ borderRadius: '3px' }}
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
                    <div className="text-[11px] text-gray-500">
                      {cand.vessel_type} • {cand.flag}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[#17324D]">
                    {cand.attribution_score}%
                  </div>
                  <div className="text-[10px] text-gray-500">Attribution</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Candidate Evidence & Score Breakdown */}
      {selectedCandidate && (
        <div className="rounded border border-[#D1D5DB] bg-[#F8FAFC] p-3 space-y-3" style={{ borderRadius: '4px' }}>
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
            <div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Candidate assessment
              </div>
              <h3 className="font-sans text-sm font-bold text-[#17324D]">
                {selectedCandidate.vessel_name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[#1769AA]">
                {selectedCandidate.attribution_score}%
              </span>
              <div className="text-[10px] text-gray-500">Attribution confidence</div>
            </div>
          </div>

          {/* Breakdown Score Bars */}
          <div className="space-y-1.5 text-xs">
            <div className="text-[11px] font-semibold text-gray-700 mb-1">
              Consistency scores
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
                  <span className="font-semibold text-gray-800">{metric.val}%</span>
                </div>
                <div className="h-1.5 w-full rounded bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-[#1769AA] rounded"
                    style={{ width: `${metric.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Behavioral Observations */}
          <div className="rounded border border-[#E5E7EB] bg-white p-2.5 space-y-1.5" style={{ borderRadius: '3px' }}>
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              Behavioral observations
            </div>
            <div className="space-y-1 text-xs">
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
              {selectedCandidate.behavioral_signals.loitering_event && (
                <div className="flex items-start gap-1.5 text-gray-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1769AA] mt-0.5 shrink-0" />
                  <span>
                    <strong>Loitering event:</strong>{' '}
                    {selectedCandidate.behavioral_signals.loitering_detail || 'Extended transit duration'}
                  </span>
                </div>
              )}
              {selectedCandidate.behavioral_signals.ais_gap_detected && (
                <div className="flex items-start gap-1.5 text-amber-800">
                  <AlertCircle className="h-3.5 w-3.5 text-[#C47A00] mt-0.5 shrink-0" />
                  <span>
                    <strong>AIS transmission gap:</strong>{' '}
                    {selectedCandidate.behavioral_signals.ais_gap_duration_min} min telemetry gap recorded near origin
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Supporting Candidate (Section 17) */}
          <div className="rounded border border-[#E5E7EB] bg-white overflow-hidden" style={{ borderRadius: '3px' }}>
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
            className="flex w-full items-center justify-center gap-1.5 rounded border border-[#D1D5DB] bg-white py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 transition"
            style={{ borderRadius: '4px' }}
          >
            <ExternalLink className="h-3.5 w-3.5 text-gray-600" />
            <span>Open vessel registry record</span>
          </button>
        </div>
      )}

      {/* 4. Scientific Legal Disclaimer (Section 17 & 51) */}
      <div className="rounded border border-[#E5E7EB] bg-[#F8FAFC] p-2.5 text-[11px] text-gray-600 leading-relaxed" style={{ borderRadius: '4px' }}>
        <strong className="text-gray-800 block mb-0.5">Scientific attribution protocol:</strong>
        Attribution confidence represents model-derived spatio-temporal correlation and
        does not establish legal responsibility. Formal validation requires physical inspection,
        fuel sample comparison, and official maritime inquiry.
      </div>
    </div>
  );
};
