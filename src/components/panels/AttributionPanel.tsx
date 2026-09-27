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
    demoInvestigation,
    layers,
    setLayer,
    currentUser,
  } = usePoseidonStore();

  const isPublic = currentUser.role === 'public';
  const inc = getActiveIncident();
  const selectedCandidate: SourceCandidate =
    inc.candidates.find((c) => c.id === selectedCandidateId) || inc.candidates[0];

  const isScene7 = demoInvestigation.isActive && demoInvestigation.currentStep === 7;
  const progress = demoInvestigation.sceneProgress;

  const attributionFactors = [
    { name: 'Spatial proximity', detail: '0.42 km to origin (±1.4 km)', threshold: 0.12 },
    { name: 'Temporal proximity', detail: '+18 min window offset', threshold: 0.28 },
    { name: 'Trajectory consistency', detail: '0.94 drift alignment r', threshold: 0.44 },
    { name: 'Heading consistency', detail: '12° starboard shift', threshold: 0.60 },
    { name: 'AIS continuity', detail: '18 min blackout logged', threshold: 0.74 },
    { name: 'Behavioural anomaly', detail: '14.1 → 8.2 kn (-42%)', threshold: 0.88 },
  ];

  return (
    <div className="p-4 space-y-4 text-xs text-gray-800 bg-white w-full max-w-full box-border min-w-0">
      {/* Public Role Access Restriction Advisory */}
      {isPublic && (
        <div className="rounded-sm border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
            <span>PUBLIC ACCESS ADVISORY</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">
            Under international maritime data privacy standards, candidate vessel identities under active forensic evaluation are masked for public observers. Switch to Analyst or Incident Commander clearance in the top navigation to review unredacted vessel telemetry, IMO numbers, and engine log correlation.
          </p>
        </div>
      )}

      {/* 1. Header & Reconstructed Vessel Activity Summary */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-gray-700 min-w-0">
          <div className="flex items-center gap-1.5 text-[#17324D] min-w-0">
            <Ship className="h-3.5 w-3.5 text-[#1769AA] shrink-0" />
            <span className="truncate">AIS spatio-temporal reconstruction</span>
          </div>
          <span className="text-gray-500 font-normal shrink-0">30 km corridor</span>
        </div>

        {/* Release window context */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-gray-600 pt-1 min-w-0">
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
            const vesselDisplayName = isPublic ? `Candidate Alpha-0${index + 1}` : cand.vessel_name;
            const vesselSubText = isPublic ? `Commercial Vessel • Flag [Restricted]` : `${cand.vessel_type} • ${cand.flag}`;

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
                      <span>{vesselDisplayName}</span>
                      {cand.behavioral_signals.ais_gap_detected && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-[#C47A00]"
                          title="AIS transmission gap recorded"
                        />
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {vesselSubText}
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
                {isPublic ? 'Candidate Alpha-01 (Active AIS Evaluation)' : selectedCandidate.vessel_name}
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
            <div className="gis-table-container w-full max-w-full overflow-x-auto">
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
          </div>

          {/* 6 Sequential Forensic Attribution Factors */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 mb-1">
              <span>Attribution evidence factors</span>
              {isScene7 && (
                <span className="text-[10px] font-mono text-[#1769AA] font-bold animate-pulse">
                  Verifying factors...
                </span>
              )}
            </div>

            <div className="space-y-1 rounded-sm border border-slate-200 bg-white p-2">
              {attributionFactors.map((factor) => {
                const isVerified = !isScene7 || progress >= factor.threshold;
                return (
                  <div
                    key={factor.name}
                    className={`flex items-center justify-between py-1 px-1.5 rounded transition-all duration-300 gap-1 min-w-0 ${
                      isVerified ? 'bg-slate-50' : 'opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      {isVerified ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="h-3.5 w-3.5 rounded-full border border-gray-300 shrink-0 inline-block" />
                      )}
                      <span className={`text-[11px] truncate ${isVerified ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                        {factor.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] shrink-0">
                      <span className="text-gray-500">{factor.detail}</span>
                      {isVerified && (
                        <span className="text-emerald-700 font-bold ml-1">✓</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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

          {/* Why This Vessel & Connected Attribution Chain */}
          <div className={`rounded-sm border overflow-hidden transition-all ${isScene7 ? 'border-[#1769AA] ring-2 ring-[#0284C7]/30 bg-[#F0F7FF]' : 'border-[#E5E7EB] bg-white'}`}>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
                <span className="h-2 w-2 rounded-full bg-[#1769AA]" />
                <span>Why this vessel?</span>
              </div>
              <button
                onClick={() => setLayer('evidence_links', !layers.evidence_links)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border transition ${
                  layers.evidence_links
                    ? 'bg-[#1769AA] text-white border-[#1769AA]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-slate-100'
                }`}
                title="Toggle connected visual chain on map"
              >
                {layers.evidence_links ? 'Chain highlighted on map' : 'Highlight chain on map'}
              </button>
            </div>

            <div className="p-2.5 space-y-2 text-xs">
              {/* Visual Chain Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-1 rounded bg-white p-2 border border-slate-200 font-mono text-[10px] text-[#17324D] font-semibold">
                <span className="text-[#0284C7] shrink-0">Vessel Trajectory</span>
                <ArrowRight className="h-3 w-3 text-gray-400 shrink-0" />
                <span className="text-[#D97706] shrink-0">Probable Origin</span>
                <ArrowRight className="h-3 w-3 text-gray-400 shrink-0" />
                <span className="text-[#DC2626] shrink-0">Detected Slick</span>
              </div>

              <div className="space-y-1 text-slate-700 text-[11px] leading-relaxed">
                {selectedCandidate.why_this_vessel.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#1769AA] font-bold shrink-0">•</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View Vessel Profile Button / Public Clearance Notice */}
          {isPublic ? (
            <div className="p-2.5 rounded-xs bg-slate-50 border border-slate-200 text-center text-[11px] text-slate-500">
              Commercial vessel registry dossiers require <strong>Operational Analyst</strong> or <strong>Incident Commander</strong> clearance.
            </div>
          ) : (
            <button
              onClick={() => setVesselDetailModalOpen(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-[#D1D5DB] bg-white py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 transition shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-gray-600" />
              <span>Open vessel registry record</span>
            </button>
          )}
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
