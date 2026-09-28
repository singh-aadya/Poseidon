import React, { useState } from 'react';
import {
  Satellite,
  FileText,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';

export const EvidencePanel: React.FC = () => {
  const [activeChainStep, setActiveChainStep] = useState<number>(1);

  const {
    getActiveIncident,
    satelliteComparison,
    setSatelliteComparison,
    getSelectedCandidate,
    setActiveMode,
    setMapIntelligenceMode,
    setLayer,
    setSelectedCandidateId,
    demoInvestigation,
  } = usePoseidonStore();

  const inc = getActiveIncident();
  const selectedCandidate = getSelectedCandidate();
  const { mode, maskOpacity } = satelliteComparison;

  const isScene2 = demoInvestigation.isActive && demoInvestigation.currentStep === 2;
  const isScene9 = demoInvestigation.isActive && demoInvestigation.currentStep === 9;
  const sceneProgress = demoInvestigation.sceneProgress;
  const visibleCount = isScene9 ? Math.min(9, Math.floor(sceneProgress * 9.8) + 1) : 9;

  const evidenceChain = [
    {
      step: 1,
      title: 'Sentinel-1 SAR Acquisition',
      finding: 'Sentinel-1A C-SAR descending pass (Track 135) captures backscatter dampening anomaly.',
      status: 'VERIFIED',
      action: () => setMapIntelligenceMode('satellite'),
    },
    {
      step: 2,
      title: 'Slick Detection',
      finding: 'ResNeXt-101 Attention U-Net detects slick boundary (IoU 0.912, 18.6 km² area).',
      status: 'DETECTED',
      action: () => setSatelliteComparison({ mode: 'mask' }),
    },
    {
      step: 3,
      title: 'Slick Characterization',
      finding: 'Radiometric backscatter (-24.8 dB) validates petroleum crude film dampening.',
      status: 'CHARACTERIZED',
      action: () => setSatelliteComparison({ mode: 'after' }),
    },
    {
      step: 4,
      title: 'Age Estimation',
      finding: 'Fay spreading and hydrodynamic weathering models calibrate spill release window to 8–14 hours.',
      status: 'CALIBRATED',
      action: () => setActiveMode('detection'),
    },
    {
      step: 5,
      title: 'Drift Reconstruction',
      finding: 'Lagrangian hindcast (INCOIS OSTM 0.72 kn currents + IMD 14.2 kn winds) traces 24h reverse advection.',
      status: 'RECONSTRUCTED',
      action: () => {
        setMapIntelligenceMode('analysis');
        setLayer('breadcrumb_trail', true);
      },
    },
    {
      step: 6,
      title: 'Origin Region',
      finding: 'Particles converge on 4.2 km² source probability region in Mumbai High Sector at 19.34°N, 71.22°E (82% confidence).',
      status: 'CONVERGED',
      action: () => {
        setMapIntelligenceMode('analysis');
        setLayer('origin_probability_region', true);
      },
    },
    {
      step: 7,
      title: 'AIS Correlation',
      finding: '12 corridor vessels evaluated; 3 candidate trajectories intersect release window.',
      status: 'CORRELATED',
      action: () => {
        setActiveMode('attribution');
        setLayer('vessel_tracks', true);
      },
    },
    {
      step: 8,
      title: 'Candidate Vessel',
      finding: 'MV OCEAN STAR attributed at 87% confidence with 18-minute AIS blackout at 23:22 UTC.',
      status: 'ATTRIBUTED',
      action: () => {
        setActiveMode('attribution');
        setSelectedCandidateId('VESSEL-9481923');
      },
    },
    {
      step: 9,
      title: 'Forecast',
      finding: 'Ensemble trajectory models 48h spreading (approaching Maharashtra coastal buffer, 22 km clearance).',
      status: 'PROJECTED',
      action: () => {
        setActiveMode('forecast');
      },
    },
  ];

  const handlePrintDossier = () => {
    window.print();
  };

  const currentImageUrl =
    mode === 'before'
      ? inc.sar_imagery.before_url
      : mode === 'mask'
      ? inc.sar_imagery.segmented_mask_url
      : mode === 'after'
      ? inc.sar_imagery.sar_vv_url
      : inc.sar_imagery.overlay_composite_url;

  return (
    <div className="p-4 space-y-4 text-xs text-gray-800 bg-white w-full max-w-full box-border min-w-0">
      {/* 1. Header */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-gray-700 min-w-0">
          <div className="flex items-center gap-1.5 text-[#17324D] min-w-0">
            <FileText className="h-3.5 w-3.5 text-[#1769AA] shrink-0" />
            <span className="truncate">Investigation evidence dossier</span>
          </div>
          <span className="font-mono text-gray-600 font-bold shrink-0">{inc.id}</span>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Forensic verification bundle combining Copernicus Sentinel-1 C-Band SAR backscatter dampening,
          automated segmentation, and historical AIS transit logs.
        </p>
      </div>

      {/* 2. SATELLITE IMAGE COMPARISON */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-gray-700 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <Satellite className="h-3.5 w-3.5 text-[#1769AA] shrink-0" />
            <span className="truncate">Satellite imagery analysis</span>
          </div>
          <span className="text-gray-500 font-normal shrink-0">{inc.satellite}</span>
        </div>

        {/* View Mode Switcher: 2x2 grid on narrow screens, 4 cols on wider */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {(['before', 'after', 'mask', 'overlay'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSatelliteComparison({ mode: m })}
              className={`rounded-sm py-1 px-1.5 text-xs font-semibold capitalize transition border text-center ${
                mode === m
                  ? 'bg-[#1769AA] text-white border-[#1769AA]'
                  : 'border-[#D1D5DB] bg-white text-gray-700 hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Image Frame */}
        <div className="relative overflow-hidden rounded-sm border border-[#D1D5DB] bg-[#F8FAFC] aspect-video w-full max-w-full flex items-center justify-center">
          <img
            src={currentImageUrl}
            alt="Satellite analysis preview"
            className="w-full h-full object-cover max-w-full"
            style={{
              opacity: mode === 'mask' ? maskOpacity : 1.0,
            }}
          />

          <div className="absolute top-2 left-2 rounded-xs bg-white/90 border border-[#D1D5DB] px-1.5 py-0.5 text-[10px] font-sans font-medium text-gray-700 shadow-2xs">
            Layer: {mode.toUpperCase()}
          </div>
        </div>

        {/* Mask Opacity Slider */}
        <div className="space-y-1 pt-1 text-xs">
          <div className="flex justify-between items-center text-gray-600 min-w-0">
            <span className="truncate pr-2">Segmentation mask opacity</span>
            <span className="font-semibold text-gray-800 font-mono shrink-0">{Math.round(maskOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={maskOpacity}
            onChange={(e) =>
              setSatelliteComparison({ maskOpacity: parseFloat(e.target.value) })
            }
            className="w-full max-w-full cursor-pointer h-1.5 bg-gray-200 rounded-sm accent-[#1769AA]"
          />
        </div>

        {/* Slick detected card */}
        <div className={`rounded-sm border p-2.5 space-y-1.5 transition ${isScene2 ? 'border-[#1769AA] ring-2 ring-[#0284C7]/30 bg-[#F0F7FF]' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[#17324D] text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Slick detected</span>
            </div>
            <span className="font-mono text-[10px] font-bold text-[#1769AA] bg-white px-1.5 py-0.5 rounded border border-[#BFDBFE]">
              {(inc.ml_metrics.detection_confidence * 100).toFixed(1)}% CONF
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/80">
            <div>
              <span className="text-gray-500 text-[10px]">Area:</span>
              <span className="font-bold text-gray-900 font-mono ml-1">{inc.area_km2} km²</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px]">Geometry:</span>
              <span className="font-bold text-gray-900 ml-1">Asymmetric Plume</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px]">Confidence:</span>
              <span className="font-bold text-emerald-700 font-mono ml-1">{(inc.confidence * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-500 text-[10px]">Estimated Age:</span>
              <span className="font-bold text-amber-700 font-mono ml-1">{inc.estimated_age_mean}h window</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TECHNICAL MODEL METRICS TABLE */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
          <span>Model inference specifications</span>
          <span className="text-[#287D3C] font-semibold text-xs flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </span>
        </div>

        <div className="gis-table-container w-full max-w-full overflow-x-auto">
          <table className="gis-table text-xs w-full">
            <thead>
              <tr>
                <th className="py-1 px-2 text-[11px]">Parameter</th>
                <th className="py-1 px-2 text-[11px] text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 px-2 text-gray-600">Architecture</td>
                <td className="py-1 px-2 font-medium text-right text-gray-900">{inc.ml_metrics.architecture}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600">Backbone</td>
                <td className="py-1 px-2 font-medium text-right text-gray-900">ResNeXt-101 (32x8d)</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600">Detection confidence</td>
                <td className="py-1 px-2 font-semibold text-right text-gray-900 font-mono">{(inc.ml_metrics.detection_confidence * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600">Intersection over Union (IoU)</td>
                <td className="py-1 px-2 font-semibold text-right text-gray-900 font-mono">{inc.ml_metrics.iou_score.toFixed(3)}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600">Dice coefficient</td>
                <td className="py-1 px-2 font-medium text-right text-gray-900 font-mono">{inc.ml_metrics.dice_coefficient.toFixed(3)}</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600">Look-alike probability</td>
                <td className="py-1 px-2 font-medium text-right text-gray-900 font-mono">{(inc.ml_metrics.look_alike_probability * 100).toFixed(1)}%</td>
              </tr>
              <tr>
                <td className="py-1 px-2 text-gray-600">Spatial resolution</td>
                <td className="py-1 px-2 font-medium text-right text-gray-900 font-mono">10.0 m/pixel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. 9-STEP FORENSIC EVIDENCE CHAIN */}
      <div className={`border-b border-[#E5E7EB] pb-3.5 space-y-2 transition ${isScene9 ? 'ring-2 ring-emerald-500/40 rounded-sm p-2 bg-emerald-50/20' : ''}`}>
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
          <span>9-Step forensic evidence chain</span>
          <span className="text-[10px] font-mono text-[#1769AA] font-bold">
            {isScene9 ? `Assembling chain (${visibleCount}/9)...` : 'Chain verified (9/9)'}
          </span>
        </div>

        {/* Evidence Dossier Ready Banner for Scene 9 */}
        {isScene9 && visibleCount >= 9 && (
          <div className="rounded-sm border border-emerald-300 bg-emerald-50 p-2.5 flex items-center justify-between text-xs text-emerald-900 font-semibold shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Investigation evidence dossier ready</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              Verified Complete
            </span>
          </div>
        )}

        <div className="space-y-1">
          {evidenceChain.map((item) => {
            const isSelected = activeChainStep === item.step;
            const isStepVerified = !isScene9 || item.step <= visibleCount;
            return (
              <div
                key={item.step}
                onClick={() => {
                  setActiveChainStep(item.step);
                  item.action();
                }}
                className={`rounded-sm border p-2 cursor-pointer transition select-none ${
                  isSelected
                    ? 'border-l-4 border-l-[#1769AA] border-[#BFDBFE] bg-[#F0F7FF]'
                    : isStepVerified
                    ? 'border-slate-200 bg-white hover:bg-slate-50'
                    : 'border-slate-100 bg-slate-50/60 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <span className="font-mono text-[10px] text-slate-400">0{item.step}</span>
                    <span>{item.title}</span>
                  </div>
                  {isStepVerified ? (
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span>{item.status}</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-400">PENDING</span>
                  )}
                </div>
                {isSelected && (
                  <p className="mt-1.5 text-[11px] text-slate-600 leading-relaxed border-t border-blue-100 pt-1">
                    {item.finding}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. AIS & Metocean Corroboration Summary */}
      {selectedCandidate && (
        <div className="py-2 px-2.5 rounded-sm bg-slate-50 border border-slate-200 text-xs text-gray-700 space-y-1">
          <div className="font-semibold text-gray-800">AIS passage corroboration</div>
          <p className="leading-relaxed">
            {selectedCandidate.vessel_name} transited within 1.2 km of reverse-drift origin point at 23:14 UTC.
            AIS broadcast logs record an 18-minute gap in position transmission coincident with transit.
          </p>
        </div>
      )}

      {/* 5. Export Action */}
      <div className="pt-1">
        <button
          onClick={handlePrintDossier}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-[#1769AA] bg-[#1769AA] py-2 text-xs font-semibold text-white hover:bg-[#145C96] transition shadow-xs"
        >
          <Printer className="h-4 w-4" />
          <span>Export incident report (PDF)</span>
        </button>
      </div>
    </div>
  );
};
