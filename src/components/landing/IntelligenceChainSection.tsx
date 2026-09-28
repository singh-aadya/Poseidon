import React, { useState } from 'react';
import { 
  Radio, 
  Scan, 
  Layers, 
  Clock, 
  RotateCcw, 
  Crosshair, 
  Ship, 
  Scale, 
  Wind, 
  FileCheck2,
  ChevronRight,
  Database,
  ExternalLink
} from 'lucide-react';

interface IntelligenceChainSectionProps {
  onEnterMonitoring?: () => void;
}

export const IntelligenceChainSection: React.FC<IntelligenceChainSectionProps> = ({ onEnterMonitoring }) => {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages = [
    {
      id: 'satellite',
      num: '01',
      name: 'SATELLITE',
      label: 'Sentinel-1 SAR Observation',
      description: 'Continuous ingest of Sentinel-1 C-Band synthetic aperture radar Level-1 Ground Range Detected (GRD) products over oceanic corridors.',
      icon: Radio,
      sensor: 'Copernicus Sentinel-1A / 1B C-SAR',
      annotation: 'Interferometric Wide (IW) • VV/VH dual-pol',
      parameters: [
        { label: 'Pixel Spacing', value: '10m × 10m' },
        { label: 'Incidence Angle', value: '29.1° - 46.0°' },
        { label: 'Orbit Cycle', value: '12-Day Repeat' },
        { label: 'Radiometric Calibration', value: 'σ° (sigma-naught) dB' }
      ]
    },
    {
      id: 'detection',
      num: '02',
      name: 'DETECTION',
      label: 'Pixel-Level Slick Segmentation',
      description: 'Multi-scale Attention U-Net deep segmentation network differentiates oil film capillary damping from low-wind calm waters and biogenic slicks.',
      icon: Scan,
      sensor: 'Attention U-Net v4 Neural Engine',
      annotation: 'Adaptive contrast thresholding • 94.2% IoU',
      parameters: [
        { label: 'Model Backbone', value: 'ResNet-50 + Spatial Attention' },
        { label: 'Confidence Score', value: '0.942 Prob' },
        { label: 'False Alarm Rate', value: '< 2.1% validated' },
        { label: 'Inference Latency', value: '184 ms / 100km²' }
      ]
    },
    {
      id: 'characterization',
      num: '03',
      name: 'CHARACTERIZATION',
      label: 'Geometric & Thickness Profiling',
      description: 'Vector polygon extraction, surface area calculation, perimeter-to-area ratio, aspect ratio orientation, and Bonn-agreement optical thickness proxy estimation.',
      icon: Layers,
      sensor: 'Bonn Agreement Thickness Matrix',
      annotation: 'Contour vectorization • Multi-polygon cluster',
      parameters: [
        { label: 'Estimated Area', value: '2.85 km² (285 ha)' },
        { label: 'Perimeter Length', value: '11.42 km' },
        { label: 'Major Axis', value: '4.82 km @ 285° WNW' },
        { label: 'Est. Volume Range', value: '14.2 - 28.5 m³' }
      ]
    },
    {
      id: 'age',
      num: '04',
      name: 'AGE ESTIMATION',
      label: 'Weathering & Temporal Signature',
      description: 'ADIOS-coupled thermodynamic weathering model estimates evaporative volume loss, photo-oxidation state, and emulsification kinetics.',
      icon: Clock,
      sensor: 'ADIOS 2 / Mackay Weathering Engine',
      annotation: 'Evaporative loss curve • Viscosity curve',
      parameters: [
        { label: 'Calculated Age', value: '14.2 hours (± 2.0h)' },
        { label: 'Evaporation Loss', value: '34.8% by mass' },
        { label: 'Emulsification Water', value: '48.2% water-in-oil' },
        { label: 'Release Window', value: '04:15 - 06:30 UTC' }
      ]
    },
    {
      id: 'drift',
      num: '05',
      name: 'DRIFT RECONSTRUCTION',
      label: 'Hindcast-Based Backward Drift',
      description: 'Time-reversed Lagrangian particle tracking backwards in time through hydrodynamic currents (INCOIS / HYCOM) and 3% wind leeway drag.',
      icon: RotateCcw,
      sensor: 'OpenDrift Lagrangian Backward Solver',
      annotation: 'Stochastic particle ensemble: N=5,000',
      parameters: [
        { label: 'Surface Velocity', value: '0.42 m/s @ 072° ENE' },
        { label: 'Wind Leeway Factor', value: '3.0% vector drag' },
        { label: 'Hindcast Duration', value: '-14.0 hours' },
        { label: 'Backward Distance', value: '8.4 NM reverse track' }
      ]
    },
    {
      id: 'origin',
      num: '06',
      name: 'ORIGIN ANALYSIS',
      label: 'Source Ellipse & Bounding Box',
      description: 'Probabilistic origin containment ellipse derived from backward particle dispersion centroids, identifying the probable coordinates of discharge.',
      icon: Crosshair,
      sensor: 'Gaussian Kernel Density Estimator (KDE)',
      annotation: '95% Confidence Spatial Covariance Ellipse',
      parameters: [
        { label: 'Origin Centroid', value: '19°22\'14"N, 71°18\'40"E' },
        { label: 'Semi-Major Axis', value: '1.42 NM' },
        { label: 'Semi-Minor Axis', value: '0.68 NM' },
        { label: 'Temporal Boundary', value: 'T-12h to T-16h' }
      ]
    },
    {
      id: 'ais',
      num: '07',
      name: 'AIS CORRELATION',
      label: 'Vessel Trajectory Matching',
      description: 'Interrogation of historical terrestrial and satellite AIS streams to reconstruct all commercial, tanker, and cargo vessel positions within the origin spatiotemporal envelope.',
      icon: Ship,
      sensor: 'Global Maritime AIS Stream Ingest',
      annotation: 'Spatiotemporal KD-Tree intersection filter',
      parameters: [
        { label: 'Candidates Filtered', value: '4 vessels within 5 NM' },
        { label: 'Primary Vessel', value: 'MV OCEAN STAR (IMO 9418294)' },
        { label: 'CPA to Origin', value: '0.82 NM' },
        { label: 'Time Offset', value: '+18 mins from release' }
      ]
    },
    {
      id: 'attribution',
      num: '08',
      name: 'ATTRIBUTION',
      label: 'Evidence-Weighted Candidate Ranking',
      description: 'Multi-criteria scoring model aggregating spatial proximity, temporal proximity, course coincidence, speed drop anomaly, and AIS transmission continuity.',
      icon: Scale,
      sensor: 'Bayesian Evidentiary Assessment Matrix',
      annotation: 'Weight-balanced multi-factor attribution',
      parameters: [
        { label: 'Primary Score', value: '87 / 100 (High Risk)' },
        { label: 'Behavioral Anomaly', value: 'Speed drop: 14.2 → 8.1 kn' },
        { label: 'AIS Continuity', value: '38-min transponder gap' },
        { label: 'Control Vessel Scores', value: '18%, 12%, 6% (Low)' }
      ]
    },
    {
      id: 'forecast',
      num: '09',
      name: 'FORECAST',
      label: 'Forward Dispersion & Shoreline Risk',
      description: 'Forward-marching ocean hydrodynamic ensemble predicting slick movement and weathering over +6h, +12h, +24h, and +48h horizons with coastal alert triggers.',
      icon: Wind,
      sensor: 'INCOIS Ocean Ensemble + ECMWF Winds',
      annotation: 'Cone of uncertainty + Coastal buffer',
      parameters: [
        { label: 'Current Heading', value: '068° ENE @ 0.58 kn' },
        { label: '+24h Projected Area', value: '4.65 km² dispersion' },
        { label: 'Nearest Coast', value: 'Alibag Coastline (28.4 NM)' },
        { label: 'Est. Shore Contact', value: '> 38.6 hours (No imm. threat)' }
      ]
    },
    {
      id: 'evidence',
      num: '10',
      name: 'EVIDENCE',
      label: 'Traceable Investigation Dossier',
      description: 'Cryptographically sealed SHA-256 evidentiary dossier documenting every sensor input, model run parameter, vessel track record, and analyst sign-off.',
      icon: FileCheck2,
      sensor: 'Forensic Audit & Legal Dossier Engine',
      annotation: 'Court-admissible PDF & GeoJSON package',
      parameters: [
        { label: 'Report Status', value: 'Generated & SHA-256 Sealed' },
        { label: 'Chain of Custody', value: 'Immutable Timestamped Log' },
        { label: 'Agency Handover', value: 'Indian Coast Guard Ready' },
        { label: 'Format Standards', value: 'ISO 19115 / OGC WFS / PDF' }
      ]
    }
  ];

  const current = stages[selectedStage];
  const CurrentIcon = current.icon;

  return (
    <section id="intelligence-chain" className="relative py-28 bg-[#F8FCFF] border-b border-[#E2EDF3] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#EEF8FC] via-[#E6F4FA]/50 to-[#EEF8FC] rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E2EDF3]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-4">
              <Database className="w-3.5 h-3.5 text-[#087EA4]" />
              <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
                End-to-End Pipeline
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-tight">
              The POSEIDON Intelligence Chain
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#486581] leading-relaxed">
              From raw satellite observations to court-admissible maritime attribution dossiers: ten rigorous, mathematically grounded stages of analysis.
            </p>
          </div>

          {onEnterMonitoring && (
            <button
              onClick={onEnterMonitoring}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#087EA4] hover:bg-[#076B8C] text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow self-start md:self-auto shrink-0"
            >
              <span>See Live in System</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 10-Stage Horizontal Stepper Track */}
        <div className="mt-12 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
          <div className="flex items-center gap-2 min-w-[960px] relative">
            {/* Base line */}
            <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-[#DCEBF2] -translate-y-1/2 z-0" />

            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === idx;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(idx)}
                  className={`relative z-10 flex-1 flex flex-col items-center p-2 rounded-xl transition-all duration-200 text-center group ${
                    isSelected
                      ? 'bg-white shadow-md border border-[#087EA4]'
                      : 'hover:bg-white/80 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#087EA4] text-white shadow-sm'
                        : 'bg-[#EEF8FC] text-[#486581] group-hover:text-[#087EA4]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="mt-2 text-[10px] font-mono font-bold text-[#627D98]">
                    {stage.num}
                  </span>
                  <span
                    className={`text-[11px] font-bold tracking-tight uppercase truncate max-w-[85px] mt-0.5 ${
                      isSelected ? 'text-[#071A2B]' : 'text-[#486581]'
                    }`}
                  >
                    {stage.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Detailed Stage Visualizer */}
        <div className="mt-8 bg-white border border-[#DCEBF2] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Stage Overview */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#EEF8FC] border border-[#D5EBF5] flex items-center justify-center text-[#087EA4]">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#087EA4]/10 text-[#087EA4] border border-[#087EA4]/20">
                      STAGE {current.num} OF 10
                    </span>
                    <span className="text-xs font-mono text-[#627D98]">
                      {current.sensor}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#071A2B] tracking-tight mt-1">
                    {current.label}
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#334E68] leading-relaxed">
                {current.description}
              </p>

              <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#087EA4] bg-[#EEF8FC] px-3 py-1.5 rounded-lg border border-[#D5EBF5]">
                <span className="w-2 h-2 rounded-full bg-[#087EA4]" />
                {current.annotation}
              </div>

              {/* Navigation buttons between stages */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  disabled={selectedStage === 0}
                  onClick={() => setSelectedStage((prev) => Math.max(0, prev - 1))}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-[#DCEBF2] bg-[#F8FCFF] text-[#334E68] hover:bg-[#EEF8FC] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  ← Previous Stage
                </button>
                <button
                  disabled={selectedStage === stages.length - 1}
                  onClick={() => setSelectedStage((prev) => Math.min(stages.length - 1, prev + 1))}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#071A2B] text-white hover:bg-[#0B253D] disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  Next Stage →
                </button>
              </div>
            </div>

            {/* Right Column: Scientific Telemetry Card */}
            <div className="lg:col-span-6 bg-[#F8FCFF] border border-[#E2EDF3] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2EDF3] pb-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#627D98] font-bold">
                  Operational Parameters & Metrics
                </div>
                <div className="text-[10px] font-mono text-[#087EA4] bg-[#EEF8FC] px-2 py-0.5 rounded border border-[#D5EBF5]">
                  REAL-TIME ALGORITHM
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.parameters.map((param, i) => (
                  <div key={i} className="bg-white border border-[#E6F0F6] rounded-lg p-3">
                    <div className="text-[10px] font-mono text-[#627D98] uppercase tracking-wider">
                      {param.label}
                    </div>
                    <div className="text-sm font-mono font-bold text-[#071A2B] mt-1">
                      {param.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-[#627D98] leading-normal pt-2 font-mono flex items-center justify-between">
                <span>Verification State: Complete</span>
                <span className="text-[#087EA4] font-medium">Standard Compliance: IPIECA / IMO / NOAA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
