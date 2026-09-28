import React, { useState } from 'react';
import { 
  Ship, 
  Compass, 
  RotateCcw, 
  Crosshair, 
  AlertTriangle, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  FileCheck2,
  EyeOff
} from 'lucide-react';

export const OriginAttributionSection: React.FC = () => {
  const [selectedVessel, setSelectedVessel] = useState<string>('ocean-star');

  const evidenceFactors = [
    {
      label: 'TEMPORAL PROXIMITY',
      val: 'Δt = +18 MINS',
      desc: 'Transit window precisely coincides with the thermodynamic weathering release window (05:14 UTC vs 04:56 UTC).',
      status: 'MATCHED',
      color: 'text-emerald-400'
    },
    {
      label: 'SPATIAL PROXIMITY',
      val: 'CPA = 0.82 NM',
      desc: 'Vessel path directly intersected the 95% Gaussian covariance source ellipse of the backward drift model.',
      status: 'CRITICAL',
      color: 'text-amber-400'
    },
    {
      label: 'TRAJECTORY CONSISTENCY',
      val: 'CO-AXIAL ALIGNMENT',
      desc: 'The elongated slick orientation (285° WNW) aligns with the vessel\'s transit azimuth across the Arabian Sea corridor.',
      status: 'CONSISTENT',
      color: 'text-cyan-400'
    },
    {
      label: 'HEADING CONSISTENCY',
      val: 'COURSE 284° WNW',
      desc: 'Heading variance remained under ± 1.5° during transit through the source polygon.',
      status: 'STEADY',
      color: 'text-emerald-400'
    },
    {
      label: 'BEHAVIOURAL ANOMALY',
      val: 'SPEED DROP: 14.2 → 8.1 KN',
      desc: 'Anomalous 43% throttle reduction for 42 minutes inside the source zone without traffic or weather justification.',
      status: 'FLAGGED',
      color: 'text-red-400'
    },
    {
      label: 'AIS CONTINUITY',
      val: '38-MIN SIGNAL GAP',
      desc: 'Terrestrial and satellite receivers logged zero Class-A broadcasts for 38 consecutive minutes during transit.',
      status: 'IRREGULAR',
      color: 'text-red-400'
    }
  ];

  const candidateVessels = [
    {
      id: 'ocean-star',
      name: 'MV OCEAN STAR',
      type: 'Bulk Carrier',
      flag: 'Panama [PA]',
      imo: 'IMO: 9418294',
      score: 87,
      risk: 'PRIMARY CANDIDATE',
      color: '#F59E0B'
    },
    {
      id: 'arabian-breeze',
      name: 'MT ARABIAN BREEZE',
      type: 'Crude Oil Tanker',
      flag: 'Liberia [LR]',
      imo: 'IMO: 9621045',
      score: 18,
      risk: 'CONTROL CANDIDATE',
      color: '#64748B'
    },
    {
      id: 'monsoon',
      name: 'CMA CGM MONSOON',
      type: 'Container Ship',
      flag: 'Singapore [SG]',
      imo: 'IMO: 9387490',
      score: 6,
      risk: 'LOW RELEVANCE',
      color: '#475569'
    }
  ];

  return (
    <section id="attribution" className="relative py-28 bg-[#071A2B] text-white border-b border-[#1E3A5F] overflow-hidden">
      {/* Background radial ocean grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#087EA4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B253D] border border-[#1E3A5F] mb-4">
            <RotateCcw className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#38BDF8] uppercase">
              Lagrangian Inversion & Spatiotemporal Correlation
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            From a Slick to a Probable Source.
          </h2>

          <p className="mt-4 text-base text-slate-300 leading-relaxed font-normal">
            By inverting ocean currents and aerodynamic wind forcing over the slick's estimated age, POSEIDON computes the upstream origin polygon and intersects it with historical AIS vessel traffic.
          </p>

          {/* Scientific Workflow Chain */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-slate-300">
            <span className="px-2.5 py-1 rounded bg-[#0B253D] border border-[#1E3A5F] text-slate-300">
              OIL SLICK
            </span>
            <span className="text-[#38BDF8]">→</span>
            <span className="px-2.5 py-1 rounded bg-[#0B253D] border border-[#1E3A5F] text-slate-300">
              HINDCAST
            </span>
            <span className="text-[#38BDF8]">→</span>
            <span className="px-2.5 py-1 rounded bg-[#0B253D] border border-[#1E3A5F] text-slate-300">
              ORIGIN REGION
            </span>
            <span className="text-[#38BDF8]">→</span>
            <span className="px-2.5 py-1 rounded bg-[#0B253D] border border-[#1E3A5F] text-slate-300">
              AIS TRAFFIC
            </span>
            <span className="text-[#38BDF8]">→</span>
            <span className="px-2.5 py-1 rounded bg-[#087EA4]/30 border border-[#38BDF8] text-[#38BDF8]">
              CANDIDATE VESSELS
            </span>
          </div>
        </div>

        {/* Main Operational Split: Left Tactical Radar Simulation, Right Evidence Factor Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Radar Trajectory Visualizer (7 cols) */}
          <div className="lg:col-span-7 bg-[#051322] border border-[#1E3A5F] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Visual Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1E3A5F] text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="font-bold">ARABIAN SEA SECTOR 4B — SPATIAL INTERSECT</span>
              </div>
              <span className="text-[#38BDF8]">T-14.2H HINDCAST</span>
            </div>

            {/* Radar / Geospatial Coordinate Canvas */}
            <div className="relative h-80 sm:h-96 my-4 bg-[#030B14] rounded-xl border border-[#1E3A5F]/70 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Concentric distance rings */}
                  <pattern id="radarGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                    <circle cx="24" cy="24" r="23.5" fill="none" stroke="#0E2742" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="100%" height="100%" fill="url(#radarGrid)" />

                {/* Range rings from origin */}
                <circle cx="200" cy="210" r="50" fill="none" stroke="#1E3A5F" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="200" cy="210" r="100" fill="none" stroke="#1E3A5F" strokeWidth="1" strokeDasharray="3 3" />
                <text x="255" y="213" fill="#64748B" fontSize="9" fontFamily="monospace">1.0 NM</text>
                <text x="305" y="213" fill="#64748B" fontSize="9" fontFamily="monospace">2.0 NM</text>

                {/* Reverse Drift Vector Line */}
                <path
                  d="M 380 140 Q 290 170, 200 210"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />

                {/* Observed Slick Polygon (T-0) */}
                <path
                  d="M 360 135 C 375 128, 395 138, 400 148 C 402 158, 390 164, 375 160 C 362 156, 355 145, 360 135 Z"
                  fill="#0B253D"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <text x="360" y="125" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  SLICK T-0 (2.85 km²)
                </text>

                {/* Probable Origin Covariance Ellipse (T-14.2h) */}
                <ellipse
                  cx="200"
                  cy="210"
                  rx="48"
                  ry="26"
                  fill="#EF4444"
                  fillOpacity="0.18"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <text x="175" y="248" fill="#F87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ORIGIN (T-14.2h)
                </text>

                {/* Candidate 1: MV OCEAN STAR (Yellow Trajectory - Intersecting) */}
                <path
                  d="M 80 290 L 190 215 L 290 140 L 380 70"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                />
                <circle cx="80" cy="290" r="3.5" fill="#F59E0B" />
                <circle cx="190" cy="215" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="290" cy="140" r="3.5" fill="#F59E0B" />
                <circle cx="380" cy="70" r="4" fill="#38BDF8" />
                <text x="195" y="195" fill="#F59E0B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  MV OCEAN STAR (CPA 0.82 NM)
                </text>

                {/* Candidate 2: Control Vessel MT ARABIAN BREEZE (Dim gray) */}
                <path
                  d="M 60 180 L 160 140 L 280 90 L 380 40"
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <circle cx="160" cy="140" r="3" fill="#64748B" />
                <text x="70" y="170" fill="#64748B" fontSize="9" fontFamily="monospace">
                  MT ARABIAN BREEZE (1.8 NM north)
                </text>

                {/* Candidate 3: Control Vessel CMA CGM MONSOON (Faint) */}
                <path
                  d="M 90 350 L 220 310 L 340 270"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              </svg>

              {/* Inset Telemetry Tag */}
              <div className="absolute top-3 left-3 bg-[#071A2B]/90 backdrop-blur border border-[#1E3A5F] rounded px-2.5 py-1 text-[10px] font-mono text-slate-300">
                <span>BACKWARD DRIFT: -8.4 NM @ 252° WSW</span>
              </div>
            </div>

            {/* Candidate Vessel Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {candidateVessels.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVessel(v.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedVessel === v.id
                      ? 'bg-[#0B253D] border-amber-400/80 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-[#071A2B] border-[#1E3A5F] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase truncate">
                    {v.type}
                  </div>
                  <div className="text-xs font-bold text-white truncate mt-0.5">
                    {v.name}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">{v.imo}</span>
                    <span 
                      className="font-bold" 
                      style={{ color: v.color }}
                    >
                      {v.score}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: 6 Evidentiary Factors (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E3A5F]">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                6-FACTOR EVIDENCE AUDIT
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                MV OCEAN STAR (87%)
              </span>
            </div>

            <div className="space-y-2.5">
              {evidenceFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="bg-[#051322] border border-[#1E3A5F] rounded-xl p-3.5 hover:border-[#38BDF8]/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                      {factor.label}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${factor.color}`}>
                      {factor.val}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {factor.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Scientific Disclaimer Note */}
            <div className="p-3 rounded-lg bg-[#0B253D]/60 border border-[#1E3A5F] text-[11px] text-slate-400 leading-normal flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <span>
                <strong>Evidence-weighted candidate assessment:</strong> POSEIDON provides mathematically grounded probabilistic correlation rather than asserting definitive guilt, preserving strict legal standards for marine environmental compliance.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
