import React from 'react';
import { Compass, Shield, Activity, ExternalLink } from 'lucide-react';

interface LandingFooterProps {
  onEnterMonitoring: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onEnterMonitoring,
  onNavigateSection
}) => {
  return (
    <footer className="bg-[#051322] text-[#94A3B8] border-t border-[#1E3A5F] py-16 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1E3A5F]/60">
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-[#087EA4] text-white flex items-center justify-center font-bold font-mono shadow-sm">
                Ψ
              </div>
              <div>
                <span className="font-mono text-base font-extrabold tracking-wider text-white">
                  POSEIDON
                </span>
                <div className="text-[10px] font-mono tracking-widest text-[#38BDF8] uppercase font-semibold">
                  MARINE INTELLIGENCE SYSTEM
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Marine Oil Spill Detection & Attribution Intelligence. Synthesizing spaceborne radar, hydrodynamic drift inversion, and AIS vessel kinematics into actionable, legally verifiable evidence.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ALL SUBSYSTEMS NOMINAL [● OPERATIONAL]</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="space-y-3 font-mono">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onEnterMonitoring}
                  className="hover:text-white transition-colors text-left"
                >
                  Live Monitoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('history-analytics')}
                  className="hover:text-white transition-colors text-left"
                >
                  History & Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('attribution')}
                  className="hover:text-white transition-colors text-left"
                >
                  Attribution Model
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('forecast')}
                  className="hover:text-white transition-colors text-left"
                >
                  Forward Forecast
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('evidence')}
                  className="hover:text-white transition-colors text-left"
                >
                  Evidence Dossier
                </button>
              </li>
            </ul>
          </div>

          {/* System Column */}
          <div className="space-y-3 font-mono">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Intelligence System
            </div>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400">Satellite Data (Sentinel-1 SAR)</li>
              <li className="text-slate-400">AIS Kinematics (Class A/B)</li>
              <li className="text-slate-400">Ocean Forcing (INCOIS / CMEMS)</li>
              <li className="text-slate-400">Atmosphere (ECMWF / IMD)</li>
              <li className="text-slate-400">Dossier Sealed (SHA-256)</li>
            </ul>
          </div>

          {/* Operational Status Column */}
          <div className="space-y-3 font-mono">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              System Health
            </div>
            <div className="bg-[#0B253D] border border-[#1E3A5F] rounded-lg p-3 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span>SAR Feed</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AIS Stream</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>INCOIS Grid</span>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Model Latency</span>
                <span className="text-[#38BDF8] font-bold">184 ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 POSEIDON Marine Intelligence System. Built in alignment with IMO & IPIECA operational standards.
          </div>
          <div className="flex items-center gap-4">
            <span>Security: RESTRICTED ACCESS</span>
            <span>Classification: OFFICIAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
