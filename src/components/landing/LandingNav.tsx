import React, { useState, useEffect } from 'react';
import {
  Globe2,
  ArrowRight,
  Menu,
  X,
  Activity,
  Layers,
  BarChart3,
  Compass,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { AppMode } from '../../types';

interface LandingNavProps {
  onEnterMonitoring: (mode?: AppMode) => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ 
  onEnterMonitoring,
  onNavigateSection 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setActiveMode } = usePoseidonStore();

  useEffect(() => {
    const container = document.getElementById('landing-container') || window;
    const handleScroll = () => {
      const scrollY = container instanceof Window ? container.scrollY : (container as HTMLElement).scrollTop;
      setScrolled(scrollY > 24);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    setMobileMenuOpen(false);
    const container = document.getElementById('landing-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2EDF3] py-2.5'
          : 'bg-white/85 backdrop-blur-sm border-b border-[#E2EDF3]/70 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LEFT: Institutional Logo & Title */}
        <div 
          onClick={scrollToTop}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#071A2B] text-white font-mono font-bold shadow-sm group-hover:bg-[#087EA4] transition-colors">
            Ψ
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-sm sm:text-base font-extrabold tracking-tight text-[#071A2B] leading-none">
              POSEIDON
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#087EA4] uppercase mt-0.5 font-bold">
              MARINE INTELLIGENCE SYSTEM
            </span>
          </div>
        </div>

        {/* CENTER: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#486581]">
          <button
            onClick={scrollToTop}
            className="text-[#071A2B] font-bold hover:text-[#087EA4] transition cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection('the-problem')}
            className="hover:text-[#087EA4] transition cursor-pointer"
          >
            The Problem
          </button>
          <button
            onClick={() => scrollToSection('intelligence-chain')}
            className="hover:text-[#087EA4] transition cursor-pointer"
          >
            Intelligence Chain
          </button>
          <button
            onClick={() => scrollToSection('live-monitoring')}
            className="hover:text-[#087EA4] transition cursor-pointer"
          >
            Live Monitoring
          </button>
          <button
            onClick={() => scrollToSection('attribution')}
            className="hover:text-[#087EA4] transition cursor-pointer"
          >
            Attribution
          </button>
          <button
            onClick={() => scrollToSection('forecast')}
            className="hover:text-[#087EA4] transition cursor-pointer"
          >
            Forecast
          </button>
          <button
            onClick={() => scrollToSection('history-analytics')}
            className="hover:text-[#087EA4] transition cursor-pointer"
          >
            History & Analytics
          </button>
          <button
            onClick={() => scrollToSection('evidence')}
            className="hover:text-[#087EA4] transition cursor-pointer"
          >
            Evidence
          </button>
        </nav>

        {/* RIGHT: Operational Status & Primary Action */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Operational Status Pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-[#D5EBF5] bg-[#EEF8FC] px-3 py-1 text-[11px] font-mono shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#071A2B]">SYSTEM:</span>
            <span className="text-emerald-700 font-extrabold tracking-wide">[● OPERATIONAL]</span>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={() => onEnterMonitoring('detection')}
            className="flex items-center gap-2 rounded-lg bg-[#071A2B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#087EA4] active:scale-[0.98] transition cursor-pointer group"
          >
            <span>ENTER MONITORING SYSTEM</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#38BDF8] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 text-slate-700 hover:text-black rounded-sm border border-slate-200 bg-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-700">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToTop();
              }}
              className="text-left py-1 text-[#071A2B] font-semibold"
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('the-problem')}
              className="text-left py-1 hover:text-[#087EA4]"
            >
              The Problem
            </button>
            <button
              onClick={() => scrollToSection('intelligence-chain')}
              className="text-left py-1 hover:text-[#087EA4]"
            >
              Intelligence Chain
            </button>
            <button
              onClick={() => scrollToSection('live-monitoring')}
              className="text-left py-1 hover:text-[#087EA4]"
            >
              Live Monitoring
            </button>
            <button
              onClick={() => scrollToSection('attribution')}
              className="text-left py-1 hover:text-[#087EA4]"
            >
              Attribution
            </button>
            <button
              onClick={() => scrollToSection('forecast')}
              className="text-left py-1 hover:text-[#087EA4]"
            >
              Forecast
            </button>
            <button
              onClick={() => scrollToSection('history-analytics')}
              className="text-left py-1 hover:text-[#087EA4]"
            >
              History & Analytics
            </button>
            <button
              onClick={() => scrollToSection('evidence')}
              className="text-left py-1 hover:text-[#087EA4]"
            >
              Evidence
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>SYSTEM STATUS: OPERATIONAL</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterMonitoring('detection');
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-sm bg-[#071A2B] py-2.5 text-xs font-semibold text-white hover:bg-[#087EA4] transition"
              >
                <span>ENTER MONITORING SYSTEM</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
