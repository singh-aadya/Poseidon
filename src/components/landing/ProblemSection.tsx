import React from 'react';
import { HelpCircle, Clock, Compass, Navigation, ArrowUpRight, Search, AlertCircle, ArrowDown } from 'lucide-react';

interface ProblemSectionProps {
  onExploreChain?: () => void;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ onExploreChain }) => {
  const investigativeSteps = [
    {
      num: '01',
      question: 'WHAT IS IT?',
      subtitle: 'Discrimination & Radiometry',
      description:
        'Differentiating true mineral oil slicks from biogenic lookalikes, algal blooms, low-wind ocean calm zones, and internal waves using dual-polarization SAR backscatter and damping ratios.',
      metric: 'DAMPING RATIO: 8.4 dB',
      status: 'VERIFIED SLICK',
      icon: Search,
      tag: 'SPECTRAL CONFIDENCE: 94.2%',
    },
    {
      num: '02',
      question: 'WHEN DID IT HAPPEN?',
      subtitle: 'Weathering & Temporal Age',
      description:
        'Determining the exact spill window through evaporative volume loss, emulsification kinetics, dispersion signatures, and optical slick elongation.',
      metric: 'ELAPSED AGE: 14.2h ± 2.0h',
      status: 'TIME WINDOW BOUNDED',
      icon: Clock,
      tag: 'SPILL WINDOW: 04:15 - 06:30 UTC',
    },
    {
      num: '03',
      question: 'WHERE DID IT COME FROM?',
      subtitle: 'Ocean Dynamic Hindcasting',
      description:
        'Back-projecting current slick coordinates along time-inverted Lagrangian drift trajectories driven by reanalysis ocean currents and surface wind drag.',
      metric: 'ORIGIN CENTROID: 19°22\'14"N, 71°18\'40"E',
      status: 'SOURCE ELLIPSE DERIVED',
      icon: Compass,
      tag: 'BACKWARD DRIFT: 8.4 NM',
    },
    {
      num: '04',
      question: 'WHICH VESSELS ARE RELEVANT?',
      subtitle: 'AIS Spatiotemporal Correlation',
      description:
        'Cross-referencing historical AIS vessel trajectories with the reconstructed origin window to identify ships that physically intersected the spill space-time envelope.',
      metric: 'CORRELATED VESSELS: 4 IDENTIFIED',
      status: '1 CANDIDATE HIGH-CONFIDENCE',
      icon: Navigation,
      tag: 'PRIMARY SUSPECT: 87% SCORE',
    },
    {
      num: '05',
      question: 'WHERE WILL IT GO NEXT?',
      subtitle: 'Hydrodynamic Forward Forecasting',
      description:
        'Simulating particle dispersion across +6h, +12h, +24h, and +48h oceanographic projections to anticipate shoreline impact risks and ecologically sensitive zone threats.',
      metric: 'COASTAL DISTANCE: 28.4 NM',
      status: 'BUFFER TIME: 38.6 HOURS',
      icon: ArrowUpRight,
      tag: 'SENSITIVE REEF ALERT: PASSIVE',
    },
  ];

  return (
    <section id="the-problem" className="relative py-28 bg-[#FFFFFF] border-b border-[#E2EDF3] overflow-hidden">
      {/* Subtle scientific grid & bathymetric background line */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(8, 126, 164, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(8, 126, 164, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#F8FCFF] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-5">
            <AlertCircle className="w-3.5 h-3.5 text-[#087EA4]" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
              The Scientific Challenge
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-[1.15]">
            An oil spill is not just a detection problem.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-[#334E68] leading-relaxed font-normal">
            Finding a dark patch in satellite imagery is only the beginning. Response teams need to understand what happened, when it happened, where it came from, where it is moving, and which vessels may be connected to the event.
          </p>
        </div>

        {/* 5-Question Sequential Investigative Chain */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {investigativeSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative bg-[#F8FCFF] hover:bg-[#FFFFFF] border border-[#DCEBF2] hover:border-[#087EA4]/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {/* Step Index badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EEF8FC] text-[#087EA4] border border-[#D5EBF5]">
                      STEP {step.num}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-[#EEF8FC] flex items-center justify-center text-[#087EA4] group-hover:bg-[#087EA4] group-hover:text-white transition-colors duration-200">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#071A2B] tracking-tight group-hover:text-[#087EA4] transition-colors">
                    {step.question}
                  </h3>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#627D98] mt-0.5 mb-3 font-medium">
                    {step.subtitle}
                  </div>

                  <p className="text-xs text-[#486581] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Technical data annotation */}
                <div className="mt-6 pt-4 border-t border-[#E6F0F6]">
                  <div className="text-[10px] font-mono text-[#627D98] uppercase tracking-wider mb-1">
                    Telemetry Check
                  </div>
                  <div className="font-mono text-[11px] font-semibold text-[#071A2B] truncate">
                    {step.metric}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono font-medium text-[#087EA4]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#087EA4]" />
                    {step.tag}
                  </div>
                </div>

                {/* Connecting arrow for desktop */}
                {idx < investigativeSteps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#EEF8FC] border border-[#CCE6F3] items-center justify-center text-[#087EA4] shadow-sm">
                    <span className="text-[10px] font-bold">→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Investigative Philosophy Callout Bar */}
        <div className="mt-12 bg-gradient-to-r from-[#EEF8FC] via-[#F8FCFF] to-[#EEF8FC] border border-[#D5EBF5] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#087EA4] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#071A2B]">
                Rigorous Multi-Disciplinary Synthesis
              </div>
              <div className="text-xs text-[#486581] mt-0.5">
                Synthetic Aperture Radar (SAR) alone only flags darkness. POSEIDON correlates SAR with hydrodynamic drift, meteorological wind stress, and AIS kinematic profiles.
              </div>
            </div>
          </div>

          {onExploreChain && (
            <button
              onClick={onExploreChain}
              className="shrink-0 px-4 py-2 rounded-lg bg-[#071A2B] hover:bg-[#0B253D] text-white text-xs font-semibold tracking-wide flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Explore Intelligence Chain</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#38BDF8]" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
