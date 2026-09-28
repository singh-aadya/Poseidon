import React, { useState } from 'react';
import { 
  Maximize2, 
  Layers, 
  Radio, 
  Ship, 
  Wind, 
  Compass, 
  ShieldAlert, 
  ArrowRight, 
  ExternalLink,
  Info,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface LiveSystemPreviewSectionProps {
  onEnterMonitoring: () => void;
}

export const LiveSystemPreviewSection: React.FC<LiveSystemPreviewSectionProps> = ({ onEnterMonitoring }) => {
  const [activeCallout, setActiveCallout] = useState<string | null>('detection');

  const callouts = [
    {
      id: 'detection',
      label: 'SLICK DETECTION',
      title: 'Attention U-Net SAR Mask',
      desc: '2.85 km² mineral oil polygon identified from Sentinel-1A C-SAR backscatter damping at -18.4 dB contrast ratio.',
      badge: '94.2% ML Confidence',
      coords: '19°27\'00"N, 71°27\'00"E'
    },
    {
      id: 'origin',
      label: 'ORIGIN RECONSTRUCTION',
      title: 'Lagrangian Source Ellipse',
      desc: 'Backward drift trajectory models origin location 8.4 NM west-southwest at coordinates 19°22\'14"N, 71°18\'40"E.',
      badge: 'T-14.2h Time Window',
      coords: '19°22\'14"N, 71°18\'40"E'
    },
    {
      id: 'hindcast',
      label: 'DRIFT HINDCAST',
      title: 'Hydrodynamic Inversion',
      desc: 'Drift trajectory calculated using INCOIS surface currents (0.42 m/s @ 072°) and 3% ERA5 wind drag vector.',
      badge: '5,000 Particle Solver',
      coords: 'Vector: 072° @ 0.58 kn'
    },
    {
      id: 'ais',
      label: 'AIS CORRELATION',
      title: 'Vessel Intercept Analysis',
      desc: 'MV OCEAN STAR (IMO: 9418294) track intersects the origin ellipse at 05:14 UTC with a recorded 6-knot speed drop.',
      badge: '87% Attribution Score',
      coords: 'CPA: 0.82 NM'
    },
    {
      id: 'forecast',
      label: 'FORECAST CORRIDOR',
      title: 'Forward Cone of Uncertainty',
      desc: 'Hydrodynamic forward trajectory projecting slick dispersion over +48h. Current coastal buffer is 28.4 NM (38.6 hours).',
      badge: 'Coastal Alert: Safe (>36h)',
      coords: 'Heading: 068° ENE'
    }
  ];

  return (
    <section id="live-monitoring" className="relative py-28 bg-[#FFFFFF] border-b border-[#E2EDF3] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#EEF8FC]/60 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-4">
            <Activity className="w-3.5 h-3.5 text-[#087EA4]" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
              Operational Command Interface
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-tight">
            See the Investigation in Real Time.
          </h2>

          <p className="mt-4 text-base text-[#486581] leading-relaxed">
            The POSEIDON operational suite integrates live incident feeds, Earth-observation layers, kinematic vessel telemetry, and forward trajectory models into a unified geospatial command view.
          </p>
        </div>

        {/* Tactical Callout Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {callouts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCallout(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                activeCallout === c.id
                  ? 'bg-[#071A2B] text-white shadow-sm ring-2 ring-[#087EA4]/40'
                  : 'bg-[#EEF8FC] text-[#334E68] hover:bg-[#E2EDF3] border border-[#D5EBF5]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Immersive Operational Command Console Mockup */}
        <div className="relative rounded-2xl bg-[#071A2B] border border-[#1E3A5F] shadow-2xl overflow-hidden">
          {/* Top Console Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0B253D] border-b border-[#1E3A5F] text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono font-bold text-white tracking-wider">POSEIDON CORE</span>
              </div>
              <span className="text-[#64748B]">|</span>
              <span className="font-mono text-[#94A3B8] hidden sm:inline">
                INCIDENT: <strong className="text-white">PSDN-2026-00142</strong> (MUMBAI HIGH SECTOR 4B)
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] text-[#38BDF8] bg-[#071A2B] px-2.5 py-1 rounded border border-[#1E3A5F] hidden md:inline">
                SAR: SENTINEL-1A • 10m IW
              </span>
              <button
                onClick={onEnterMonitoring}
                className="flex items-center gap-1.5 text-white hover:text-[#38BDF8] font-mono text-xs transition-colors"
                title="Open Fullscreen System"
              >
                <span>LIVE SYSTEM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Console Split View: Left Incidents, Center Tactical Map, Right Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
            {/* Left Column: Active Incidents List (3 cols) */}
            <div className="hidden lg:block lg:col-span-3 bg-[#081E33] border-r border-[#1E3A5F] p-4 text-xs font-mono space-y-3">
              <div className="flex items-center justify-between text-[#94A3B8] pb-2 border-b border-[#1E3A5F]/60">
                <span className="font-bold uppercase tracking-wider text-[10px]">ACTIVE SPILL INCIDENTS</span>
                <span className="bg-[#0B253D] text-[#38BDF8] px-1.5 py-0.5 rounded text-[10px]">3 RECENT</span>
              </div>

              {/* Active Item */}
              <div className="p-3 rounded-lg bg-[#0F3254] border border-[#38BDF8]/40 shadow-sm text-left">
                <div className="flex items-center justify-between text-[#38BDF8] font-bold">
                  <span>PSDN-2026-00142</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[9px]">
                    CRITICAL
                  </span>
                </div>
                <div className="text-white font-sans text-xs font-semibold mt-1">
                  Mumbai High Offshore Platform North
                </div>
                <div className="text-[#94A3B8] text-[10px] mt-2 space-y-0.5">
                  <div>Area: <strong className="text-white">2.85 km²</strong> • Age: <strong className="text-white">14.2h</strong></div>
                  <div>Primary: <strong className="text-amber-400">MV OCEAN STAR (87%)</strong></div>
                </div>
              </div>

              {/* Secondary Items */}
              <div className="p-3 rounded-lg bg-[#0B253D]/50 border border-[#1E3A5F] opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>PSDN-2026-00139</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px]">
                    MODERATE
                  </span>
                </div>
                <div className="text-slate-300 font-sans text-xs mt-1 truncate">
                  Cochin Maritime Approach Channel
                </div>
                <div className="text-[#64748B] text-[10px] mt-1">
                  Area: 0.94 km² • Candidate: MT KAVERI
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#0B253D]/50 border border-[#1E3A5F] opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-[#94A3B8]">
                  <span>PSDN-2026-00135</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px]">
                    LOW RISK
                  </span>
                </div>
                <div className="text-slate-300 font-sans text-xs mt-1 truncate">
                  Gulf of Khambhat Industrial Sector
                </div>
                <div className="text-[#64748B] text-[10px] mt-1">
                  Area: 0.42 km² • Under Evaluation
                </div>
              </div>
            </div>

            {/* Center Column: Tactical Earth Observation Map View (6 cols) */}
            <div className="lg:col-span-6 relative bg-[#041220] min-h-[380px] sm:min-h-[480px] overflow-hidden flex items-center justify-center select-none">
              {/* Bathymetry and ocean grid canvas simulation */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Grid pattern */}
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0E304F" strokeWidth="0.5" />
                  </pattern>
                  <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="slickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>

                {/* Base grid */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Subtle bathymetric depth curves */}
                <path d="M -50 150 Q 200 80, 500 220 T 900 180" fill="none" stroke="#0B253D" strokeWidth="1.5" />
                <path d="M -50 280 Q 250 210, 600 360 T 950 310" fill="none" stroke="#0B253D" strokeWidth="1.5" />
                <path d="M -50 420 Q 300 350, 700 500 T 1000 450" fill="none" stroke="#0B253D" strokeWidth="1.5" />

                {/* Indian Coastline (Simplified geometry on right) */}
                <path 
                  d="M 680 0 Q 640 160, 610 320 T 630 600 L 800 600 L 800 0 Z" 
                  fill="#061A2B" 
                  stroke="#1E3A5F" 
                  strokeWidth="1.5" 
                />

                {/* Hindcast Trajectory Vector (Backward in time) */}
                <path
                  d="M 330 250 Q 250 290, 180 320"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Probable Origin Ellipse (T-14.2h) */}
                <ellipse
                  cx="180"
                  cy="320"
                  rx="34"
                  ry="20"
                  fill="#EF4444"
                  fillOpacity="0.15"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* AIS Vessel Track of MV OCEAN STAR */}
                <path
                  d="M 120 380 L 180 320 L 260 210 L 340 110"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                />
                {/* AIS Waypoints */}
                <circle cx="120" cy="380" r="3.5" fill="#F59E0B" />
                <circle cx="180" cy="320" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="260" cy="210" r="3.5" fill="#F59E0B" />
                <circle cx="340" cy="110" r="4" fill="#38BDF8" />

                {/* Forward Forecast Dispersion Cone (+48h) */}
                <path
                  d="M 330 250 L 490 200 Q 560 220, 520 280 Z"
                  fill="url(#corridorGrad)"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Current Observed Slick Polygon (T-0) */}
                <path
                  d="M 315 240 C 330 235, 345 242, 350 252 C 352 262, 340 268, 328 266 C 316 264, 308 250, 315 240 Z"
                  fill="url(#slickGrad)"
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
              </svg>

              {/* Interactive Tactical HUD Overlay Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                <div className="px-2.5 py-1 rounded bg-[#071A2B]/90 backdrop-blur border border-[#1E3A5F] text-[10px] font-mono text-[#38BDF8] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                  <span>LAT: 19°27'00"N • LON: 71°27'00"E</span>
                </div>
              </div>

              {/* Pin 1: Slick Detection Callout */}
              <div 
                className={`absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform ${
                  activeCallout === 'detection' ? 'scale-110' : 'opacity-80 hover:opacity-100'
                }`}
                onClick={() => setActiveCallout('detection')}
              >
                <div className="px-2 py-0.5 rounded bg-[#071A2B] border border-[#38BDF8] text-[9px] font-mono font-bold text-[#38BDF8] shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  SLICK DETECTION (2.85 km²)
                </div>
              </div>

              {/* Pin 2: Origin Ellipse Callout */}
              <div 
                className={`absolute top-[60%] left-[24%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform ${
                  activeCallout === 'origin' ? 'scale-110' : 'opacity-80 hover:opacity-100'
                }`}
                onClick={() => setActiveCallout('origin')}
              >
                <div className="px-2 py-0.5 rounded bg-[#071A2B] border border-red-500 text-[9px] font-mono font-bold text-red-400 shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  ORIGIN (T-14.2h)
                </div>
              </div>

              {/* Pin 3: AIS Correlation Callout */}
              <div 
                className={`absolute top-[22%] left-[44%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform ${
                  activeCallout === 'ais' ? 'scale-110' : 'opacity-80 hover:opacity-100'
                }`}
                onClick={() => setActiveCallout('ais')}
              >
                <div className="px-2 py-0.5 rounded bg-[#071A2B] border border-amber-400 text-[9px] font-mono font-bold text-amber-300 shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <Ship className="w-2.5 h-2.5" />
                  MV OCEAN STAR (87%)
                </div>
              </div>

              {/* Pin 4: Forecast Corridor Callout */}
              <div 
                className={`absolute top-[38%] left-[68%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform ${
                  activeCallout === 'forecast' ? 'scale-110' : 'opacity-80 hover:opacity-100'
                }`}
                onClick={() => setActiveCallout('forecast')}
              >
                <div className="px-2 py-0.5 rounded bg-[#071A2B] border border-[#38BDF8] text-[9px] font-mono font-bold text-cyan-300 shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <Wind className="w-2.5 h-2.5" />
                  +48H FORECAST
                </div>
              </div>

              {/* Bottom active detail card overlay */}
              {activeCallout && (
                <div className="absolute bottom-3 inset-x-3 z-30 bg-[#071A2B]/95 backdrop-blur-md border border-[#1E3A5F] rounded-lg p-3 text-xs text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                        {callouts.find(c => c.id === activeCallout)?.label}
                      </span>
                      <span className="text-[10px] text-[#64748B]">|</span>
                      <span className="font-mono text-[10px] text-amber-400">
                        {callouts.find(c => c.id === activeCallout)?.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {callouts.find(c => c.id === activeCallout)?.desc}
                    </div>
                  </div>

                  <div className="shrink-0 font-mono text-[10px] text-[#94A3B8] bg-[#0B253D] px-2 py-1 rounded border border-[#1E3A5F]">
                    {callouts.find(c => c.id === activeCallout)?.coords}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Incident Intelligence Panel (3 cols) */}
            <div className="lg:col-span-3 bg-[#081E33] border-l border-[#1E3A5F] p-4 text-xs font-mono space-y-4">
              <div className="flex items-center justify-between text-[#94A3B8] pb-2 border-b border-[#1E3A5F]/60">
                <span className="font-bold uppercase tracking-wider text-[10px]">INTELLIGENCE DOSSIER</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
                </span>
              </div>

              {/* Metric 1 */}
              <div className="bg-[#0B253D] p-3 rounded-lg border border-[#1E3A5F]">
                <div className="text-[10px] text-[#94A3B8] uppercase">TOP CANDIDATE VESSEL</div>
                <div className="text-sm font-bold text-white mt-0.5">MV OCEAN STAR</div>
                <div className="text-[10px] text-amber-400 mt-1 flex items-center justify-between">
                  <span>IMO: 9418294</span>
                  <span className="font-bold">87% MATCH</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0B253D] p-2.5 rounded-lg border border-[#1E3A5F]">
                  <div className="text-[9px] text-[#94A3B8] uppercase">ESTIMATED AGE</div>
                  <div className="text-xs font-bold text-white mt-0.5">14.2 Hours</div>
                </div>
                <div className="bg-[#0B253D] p-2.5 rounded-lg border border-[#1E3A5F]">
                  <div className="text-[9px] text-[#94A3B8] uppercase">SLICK AREA</div>
                  <div className="text-xs font-bold text-white mt-0.5">2.85 km²</div>
                </div>
              </div>

              {/* Metric 3: Drift & Shore Threat */}
              <div className="bg-[#0B253D] p-3 rounded-lg border border-[#1E3A5F] space-y-1 text-[11px]">
                <div className="text-[10px] text-[#94A3B8] uppercase">COASTAL BUFFER TIME</div>
                <div className="text-emerald-400 font-bold text-sm">38.6 Hours (28.4 NM)</div>
                <div className="text-[10px] text-[#94A3B8]">Alibag / Raigad Shoreline</div>
              </div>

              {/* CTA Inside Panel */}
              <button
                onClick={onEnterMonitoring}
                className="w-full py-2.5 px-3 rounded-lg bg-[#087EA4] hover:bg-[#076B8C] text-white text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all shadow-md group"
              >
                <span>OPEN FULL INVESTIGATION</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Global CTA beneath preview */}
        <div className="mt-10 text-center">
          <button
            onClick={onEnterMonitoring}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-[#071A2B] hover:bg-[#0B253D] text-white text-sm font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl group"
          >
            <span>EXPLORE LIVE MONITORING</span>
            <ArrowRight className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="mt-3 text-xs font-mono text-[#627D98]">
            No login required for read-only public observation data
          </div>
        </div>
      </div>
    </section>
  );
};
