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
  } = usePoseidonStore();

  const inc = getActiveIncident();
  const selectedCandidate = getSelectedCandidate();
  const { mode, maskOpacity } = satelliteComparison;

  const evidenceChain = [
    {
      step: 1,
      title: 'Satellite Sensor Acquisition',
      finding: 'Sentinel-1A SAR descending pass (Track 135) captures anomaly in MC Block 242.',
      status: 'VERIFIED',
      action: () => setMapIntelligenceMode('satellite'),
    },
    {
      step: 2,
      title: 'Radiometric Calibration',
      finding: 'Converted to Sigma0 NRCS: -24.8 dB backscatter dampening vs -12.1 dB sea clutter.',
      status: 'CALIBRATED',
      action: () => setSatelliteComparison({ mode: 'after' }),
    },
    {
      step: 3,
      title: 'Speckle Filtering & Noise Rejection',
      finding: 'Enhanced Lee 5×5 spatial filter preserves edges while suppressing speckle variance.',
      status: 'PROCESSED',
      action: () => {},
    },
    {
      step: 4,
      title: 'Deep U-Net Slick Segmentation',
      finding: 'ResNeXt-101 Attention U-Net detects slick boundary (IoU 0.912, 18.6 km²).',
      status: 'EXTRACTED',
      action: () => setSatelliteComparison({ mode: 'mask' }),
    },
    {
      step: 5,
      title: 'Look-Alike Discrimination',
      finding: 'Biogenic film, upwelling, and low-wind artifacts filtered. False alarm risk < 12%.',
      status: 'VALIDATED',
      action: () => setActiveMode('detection'),
    },
    {
      step: 6,
      title: 'Weathering & Age Inversion',
      finding: 'Fay spreading + hydrodynamic weathering yields estimated spill age of 8–14 hours.',
      status: 'ESTIMATED',
      action: () => setActiveMode('detection'),
    },
    {
      step: 7,
      title: 'Metocean Lagrangian Hindcast',
      finding: 'HYCOM 0.72 kn currents + GFS 14.2 kn winds reconstruct release point at 27.72°N, 90.62°W.',
      status: 'RECONSTRUCTED',
      action: () => {
        setMapIntelligenceMode('analysis');
        setLayer('origin_probability_region', true);
      },
    },
    {
      step: 8,
      title: 'AIS Trajectory Spatio-Temporal Intersect',
      finding: '12 corridor vessels filtered; MV OCEAN STAR intersects origin with 0.42 km error.',
      status: 'CORRELATED',
      action: () => {
        setActiveMode('attribution');
        setSelectedCandidateId('VESSEL-9481923');
      },
    },
    {
      step: 9,
      title: 'Multi-Factor Attribution Scoring',
      finding: 'Attribution confidence scored at 87% with confirmed 18-minute AIS blackout.',
      status: 'ATTRIBUTED',
      action: () => {
        setActiveMode('attribution');
        setSelectedCandidateId('VESSEL-9481923');
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
    <div className="p-4 space-y-4 text-xs text-gray-800 bg-white">
      {/* 1. Header */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
          <div className="flex items-center gap-1.5 text-[#17324D]">
            <FileText className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>Investigation evidence dossier</span>
          </div>
          <span className="font-mono text-gray-600 font-bold">{inc.id}</span>
        </div>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          Forensic verification bundle combining Copernicus Sentinel-1 C-Band SAR backscatter dampening,
          automated segmentation, and historical AIS transit logs.
        </p>
      </div>

      {/* 2. SATELLITE IMAGE COMPARISON */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
          <div className="flex items-center gap-1.5">
            <Satellite className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>Satellite imagery analysis</span>
          </div>
          <span className="text-gray-500 font-normal">{inc.satellite}</span>
        </div>

        {/* View Mode Switcher */}
        <div className="grid grid-cols-4 gap-1">
          {(['before', 'after', 'mask', 'overlay'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setSatelliteComparison({ mode: m })}
              className={`rounded-sm py-1 text-xs font-semibold capitalize transition border ${
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
        <div className="relative overflow-hidden rounded-sm border border-[#D1D5DB] bg-[#F8FAFC] aspect-video flex items-center justify-center">
          <img
            src={currentImageUrl}
            alt="Satellite analysis preview"
            className="w-full h-full object-cover"
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
          <div className="flex justify-between text-gray-600">
            <span>Segmentation mask opacity</span>
            <span className="font-semibold text-gray-800 font-mono">{Math.round(maskOpacity * 100)}%</span>
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
            className="w-full cursor-pointer h-1.5 bg-gray-200 rounded-sm accent-[#1769AA]"
          />
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

        <table className="gis-table text-xs">
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

      {/* 4. 9-STEP FORENSIC EVIDENCE CHAIN */}
      <div className="border-b border-[#E5E7EB] pb-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
          <span>9-Step forensic evidence chain</span>
          <span className="text-[10px] font-mono text-[#1769AA] font-bold">Chain verified (9/9)</span>
        </div>

        <div className="space-y-1">
          {evidenceChain.map((item) => {
            const isSelected = activeChainStep === item.step;
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
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <span className="font-mono text-[10px] text-slate-400">0{item.step}</span>
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                    {item.status}
                  </span>
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
