import React, { useState } from 'react';
import { 
  Wind, 
  Compass, 
  Waves, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  Navigation2,
  Layers
} from 'lucide-react';

export const ForecastSection: React.FC = () => {
  const [selectedHorizon, setSelectedHorizon] = useState<'+6h' | '+12h' | '+24h' | '+48h'>('+24h');

  const horizonData = {
    '+6h': {
      label: '+6 HOURS',
      time: 'T + 06:00',
      heading: '068° ENE',
      speed: '0.62 knots',
      dispersionArea: '3.24 km²',
      distanceToCoast: '25.6 NM',
      bufferStatus: 'SAFE (No immediate threat)',
      coneWidth: '1.2 NM',
      polygonScale: 1.15
    },
    '+12h': {
      label: '+12 HOURS',
      time: 'T + 12:00',
      heading: '070° ENE',
      speed: '0.58 knots',
      dispersionArea: '3.82 km²',
      distanceToCoast: '22.8 NM',
      bufferStatus: 'SAFE (Under continuous watch)',
      coneWidth: '2.1 NM',
      polygonScale: 1.35
    },
    '+24h': {
      label: '+24 HOURS',
      time: 'T + 24:00',
      heading: '072° ENE',
      speed: '0.54 knots',
      dispersionArea: '4.65 km²',
      distanceToCoast: '18.2 NM',
      bufferStatus: 'ADVISORY (Coastal buffer intact)',
      coneWidth: '3.8 NM',
      polygonScale: 1.65
    },
    '+48h': {
      label: '+48 HOURS',
      time: 'T + 48:00',
      heading: '075° ENE',
      speed: '0.48 knots',
      dispersionArea: '6.12 km²',
      distanceToCoast: '12.4 NM',
      bufferStatus: 'MONITORED (Secondary mangrove buffer)',
      coneWidth: '5.6 NM',
      polygonScale: 2.1
    }
  };

  const active = horizonData[selectedHorizon];

  return (
    <section id="forecast" className="relative py-28 bg-[#FFFFFF] border-b border-[#E2EDF3] overflow-hidden">
      {/* Background soft oceanic haze */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#EEF8FC] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-4">
            <Waves className="w-3.5 h-3.5 text-[#087EA4]" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
              Hydrodynamic Forward Dispersion
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-tight">
            Understand Where the Spill May Go Next.
          </h2>

          <p className="mt-4 text-base text-[#486581] leading-relaxed">
            By combining high-resolution ocean surface currents from INCOIS, 10-meter wind vectors from ECMWF, and particle-dispersion kinetics, POSEIDON forecasts forward slick corridors and time-to-shore estimates.
          </p>

          {/* Operational Model Workflow */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-[#071A2B]">
            <span className="px-2.5 py-1 rounded bg-[#F8FCFF] border border-[#D5EBF5] text-[#334E68]">
              CURRENT (0.42 m/s)
            </span>
            <span className="text-[#087EA4]">+</span>
            <span className="px-2.5 py-1 rounded bg-[#F8FCFF] border border-[#D5EBF5] text-[#334E68]">
              WIND (12.4 kn)
            </span>
            <span className="text-[#087EA4]">→</span>
            <span className="px-2.5 py-1 rounded bg-[#F8FCFF] border border-[#D5EBF5] text-[#334E68]">
              DRIFT MODEL
            </span>
            <span className="text-[#087EA4]">→</span>
            <span className="px-2.5 py-1 rounded bg-[#EEF8FC] border border-[#087EA4] text-[#087EA4]">
              FORECAST CORRIDOR
            </span>
          </div>
        </div>

        {/* Forecast Timeline Horizon Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#627D98] uppercase">
              FORECAST HORIZON:
            </span>
            {(['+6h', '+12h', '+24h', '+48h'] as const).map((hz) => (
              <button
                key={hz}
                onClick={() => setSelectedHorizon(hz)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider transition-all ${
                  selectedHorizon === hz
                    ? 'bg-[#071A2B] text-white shadow-sm ring-1 ring-[#087EA4]'
                    : 'bg-[#EEF8FC] text-[#334E68] hover:bg-[#E2EDF3] border border-[#D5EBF5]'
                }`}
              >
                {hz.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-[#087EA4] bg-[#EEF8FC] px-3 py-1 rounded-md border border-[#D5EBF5]">
            OCEANIC FORCING: INCOIS HYDRODYNAMIC ENSEMBLE
          </div>
        </div>

        {/* Oceanographic Product Visualizer Card */}
        <div className="bg-[#071A2B] border border-[#1E3A5F] rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Canvas: Oceanographic Map Visualizer (8 cols) */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[460px] bg-[#051424] overflow-hidden flex items-center justify-center select-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Wind stream dashes */}
                <pattern id="oceanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0E2F4D" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="forecastCone" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#087EA4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#087EA4" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="url(#oceanGrid)" />

              {/* Surface Ocean Current Vectors (Flowing ENE) */}
              {[
                [60, 80], [180, 70], [300, 60], [420, 50],
                [80, 160], [200, 150], [320, 140], [440, 130],
                [60, 260], [180, 250], [300, 240], [420, 230],
                [80, 360], [200, 350], [320, 340], [440, 330]
              ].map(([x, y], idx) => (
                <g key={idx} opacity="0.35">
                  <line x1={x} y1={y} x2={x + 35} y2={y - 12} stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 2" />
                  <polygon points={`${x + 35},${y - 12} ${x + 28},${y - 16} ${x + 30},${y - 9}`} fill="#38BDF8" />
                </g>
              ))}

              {/* Indian Maharashtra Coastline (Right boundary) */}
              <path
                d="M 520 0 Q 480 180, 460 320 T 475 480 L 650 480 L 650 0 Z"
                fill="#0B253D"
                stroke="#1E3A5F"
                strokeWidth="2"
              />
              <text x="500" y="40" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                ALIBAG / RAIGAD COASTLINE
              </text>

              {/* Historical Positions (T-12h, T-6h) */}
              <circle cx="90" cy="280" r="3" fill="#64748B" />
              <text x="75" y="300" fill="#64748B" fontSize="9" fontFamily="monospace">T-12h</text>

              <circle cx="140" cy="250" r="3.5" fill="#64748B" />
              <text x="125" y="270" fill="#64748B" fontSize="9" fontFamily="monospace">T-6h</text>

              <line x1="90" y1="280" x2="140" y2="250" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="140" y1="250" x2="200" y2="220" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Current Observed Slick T-0 */}
              <path
                d="M 190 215 C 205 208, 220 215, 225 225 C 228 235, 218 240, 205 238 C 195 235, 188 225, 190 215 Z"
                fill="#020617"
                stroke="#38BDF8"
                strokeWidth="2"
              />
              <circle cx="205" cy="225" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="180" y="200" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
                T-0 OBSERVED
              </text>

              {/* Dynamic Cone of Uncertainty based on selected horizon */}
              {selectedHorizon === '+6h' && (
                <path
                  d="M 215 225 L 280 200 Q 300 208, 290 230 Z"
                  fill="url(#forecastCone)"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}
              {selectedHorizon === '+12h' && (
                <path
                  d="M 215 225 L 340 185 Q 365 200, 350 240 Z"
                  fill="url(#forecastCone)"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}
              {selectedHorizon === '+24h' && (
                <path
                  d="M 215 225 L 400 170 Q 435 195, 410 255 Z"
                  fill="url(#forecastCone)"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}
              {selectedHorizon === '+48h' && (
                <path
                  d="M 215 225 L 450 150 Q 480 190, 455 275 Z"
                  fill="url(#forecastCone)"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              )}

              {/* Projected Centerline */}
              <line x1="205" y1="225" x2="430" y2="185" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2 2" />

              {/* Coastal Buffer Distance Indicator */}
              <line x1="430" y1="185" x2="470" y2="185" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="415" y="175" fill="#F59E0B" fontSize="9" fontFamily="monospace">
                Buffer: {active.distanceToCoast}
              </text>
            </svg>

            {/* Inset Ocean Conditions Box */}
            <div className="absolute top-4 left-4 bg-[#071A2B]/90 backdrop-blur border border-[#1E3A5F] rounded-lg p-2.5 text-[10px] font-mono text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#38BDF8]">CURRENT:</span>
                <span>0.42 m/s @ 072° ENE (INCOIS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-300">WIND:</span>
                <span>12.4 kn @ 245° WSW (ECMWF)</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Operational Telemetry Metrics (4 cols) */}
          <div className="lg:col-span-4 bg-[#081E33] border-t lg:border-t-0 lg:border-l border-[#1E3A5F] p-6 text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A5F]">
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                {active.label} FORECAST
              </span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                LAGRANGIAN ENSEMBLE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-[#0B253D] p-3 rounded-lg border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase">PROJECTED DRIFT HEADING</div>
                <div className="text-base font-bold text-white mt-0.5">{active.heading}</div>
                <div className="text-[10px] text-slate-400 mt-1">Velocity: {active.speed}</div>
              </div>

              <div className="bg-[#0B253D] p-3 rounded-lg border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase">PROJECTED SLICK SURFACE</div>
                <div className="text-base font-bold text-white mt-0.5">{active.dispersionArea}</div>
                <div className="text-[10px] text-slate-400 mt-1">Uncertainty cone width: {active.coneWidth}</div>
              </div>

              <div className="bg-[#0B253D] p-3 rounded-lg border border-[#1E3A5F]">
                <div className="text-[10px] text-slate-400 uppercase">COASTAL DISTANCE & THREAT</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{active.distanceToCoast}</div>
                <div className="text-[10px] text-emerald-400 mt-1">{active.bufferStatus}</div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-normal flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <span>
                Simulations are updated every 6 hours upon ingestion of new atmospheric and hydrodynamic forecast cycles.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
