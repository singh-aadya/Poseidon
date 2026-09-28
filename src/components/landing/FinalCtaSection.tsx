import React from 'react';
import { ArrowRight, Compass, Shield, Radio, CheckCircle2 } from 'lucide-react';

interface FinalCtaSectionProps {
  onEnterMonitoring: () => void;
  onExploreChain: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onEnterMonitoring,
  onExploreChain
}) => {
  return (
    <section className="relative py-32 bg-[#071A2B] text-white overflow-hidden border-b border-[#1E3A5F]">
      {/* Background subtle satellite radar sweep and bathymetric curves */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#087EA4]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Faint moving radar scan line effect */}
      <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-[#38BDF8]/40 to-transparent pointer-events-none animate-pulse" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B253D] border border-[#1E3A5F] mb-8">
          <Radio className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider font-semibold text-[#38BDF8] uppercase">
            National Marine Intelligence Platform
          </span>
        </div>

        {/* Dramatic Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mx-auto">
          THE OCEAN LEAVES <br />
          <span className="text-[#38BDF8]">EVIDENCE.</span>
        </h2>

        {/* Supporting Line */}
        <p className="mt-6 text-lg sm:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          POSEIDON brings those signals together.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterMonitoring}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#087EA4] hover:bg-[#076B8C] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] group"
          >
            <span>ENTER POSEIDON</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreChain}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0B253D] hover:bg-[#133555] text-slate-200 border border-[#1E3A5F] font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all"
          >
            <span>EXPLORE THE INTELLIGENCE</span>
          </button>
        </div>

        {/* Operational Status Badges */}
        <div className="mt-14 pt-8 border-t border-[#1E3A5F]/70 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>SATELLITE DATA OPERATIONAL</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>AIS INTELLIGENCE OPERATIONAL</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>OCEAN FORECAST OPERATIONAL</span>
          </div>
        </div>
      </div>
    </section>
  );
};
