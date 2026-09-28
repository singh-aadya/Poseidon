import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Orbit,
  Radio,
  Compass,
  Crosshair,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { AppMode } from '../../types';

interface HeroSectionProps {
  onEnterMonitoring: (mode?: AppMode) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterMonitoring,
  onExploreClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [telemetryTick, setTelemetryTick] = useState(0);

  // Dynamic scientific Earth Observation canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 850);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    // Slick organic polygon points relative to center
    const slickCenter = { x: width * 0.65, y: height * 0.48 };

    const render = () => {
      time += 0.008;

      // 1. Clear background with deep oceanic gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#04101D'); // Ultra deep navy
      bgGrad.addColorStop(0.5, '#071A2B'); // Institutional ocean navy
      bgGrad.addColorStop(1, '#0C263F'); // Deep water blue
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Atmospheric & Bathymetric Contour Bands
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1;
      for (let r = 80; r < Math.max(width, height); r += 90) {
        ctx.beginPath();
        ctx.arc(width * 0.75, height * 0.35, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Faint Geospatial Geographic Coordinate Grid (Lat/Long Lines)
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 6]);

      const gridSpacingX = width / 10;
      const gridSpacingY = height / 7;

      for (let x = 0; x < width; x += gridSpacingX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacingY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Subtle Coastline Ridge on Eastern Flank (Mumbai / Arabian Sea shelf context)
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.fillStyle = 'rgba(15, 37, 60, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const coastStartX = width * 0.88;
      ctx.moveTo(width, 0);
      ctx.lineTo(coastStartX, 0);
      ctx.bezierCurveTo(
        coastStartX - 40, height * 0.25,
        coastStartX - 20, height * 0.45,
        coastStartX - 70, height * 0.7
      );
      ctx.bezierCurveTo(
        coastStartX - 100, height * 0.85,
        coastStartX - 50, height * 0.95,
        coastStartX - 80, height
      );
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Coastal buffer safety zone boundary
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.15)';
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(coastStartX - 90, 0);
      ctx.bezierCurveTo(
        coastStartX - 130, height * 0.25,
        coastStartX - 110, height * 0.45,
        coastStartX - 160, height * 0.7
      );
      ctx.bezierCurveTo(
        coastStartX - 190, height * 0.85,
        coastStartX - 140, height * 0.95,
        coastStartX - 170, height
      );
      ctx.stroke();
      ctx.restore();

      // 5. Satellite Observation Footprint & Sweeping SAR Swath
      ctx.save();
      const swathProgress = (Math.sin(time * 0.6) + 1) / 2; // slow oscillation 0 to 1
      const swathCenterX = width * (0.45 + swathProgress * 0.25);
      const swathCenterY = height * (0.35 + swathProgress * 0.25);

      // Angled swath polygon
      const swathW = 280;
      const swathH = 420;
      const angle = -0.32; // ~18 deg orbital tilt

      ctx.translate(swathCenterX, swathCenterY);
      ctx.rotate(angle);

      // Swath semi-transparent fill
      const swathGrad = ctx.createLinearGradient(-swathW / 2, -swathH / 2, swathW / 2, swathH / 2);
      swathGrad.addColorStop(0, 'rgba(8, 126, 164, 0.02)');
      swathGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      swathGrad.addColorStop(1, 'rgba(8, 126, 164, 0.02)');
      ctx.fillStyle = swathGrad;
      ctx.fillRect(-swathW / 2, -swathH / 2, swathW, swathH);

      // Swath boundary outline
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-swathW / 2, -swathH / 2, swathW, swathH);

      // Scanning radar line
      const scanY = (Math.sin(time * 2.2) * swathH) / 2;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-swathW / 2, scanY);
      ctx.lineTo(swathW / 2, scanY);
      ctx.stroke();

      // Swath corner crosshairs
      const mark = 8;
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      [
        [-swathW / 2, -swathH / 2],
        [swathW / 2, -swathH / 2],
        [swathW / 2, swathH / 2],
        [-swathW / 2, swathH / 2],
      ].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(cx - mark, cy);
        ctx.lineTo(cx + mark, cy);
        ctx.moveTo(cx, cy - mark);
        ctx.lineTo(cx, cy + mark);
        ctx.stroke();
      });

      ctx.restore();

      // 6. Vessel Traffic Tracks (Inbound / Outbound AIS Corridor)
      ctx.save();
      // Candidate Vessel 1 (MV OCEAN STAR - prime candidate with turn & slow-down)
      const candTrack = [
        { x: width * 0.42, y: height * 0.72 },
        { x: width * 0.48, y: height * 0.64 },
        { x: width * 0.54, y: height * 0.57 },
        { x: width * 0.58, y: height * 0.53 }, // Discharge zone
        { x: width * 0.64, y: height * 0.50 },
        { x: width * 0.72, y: height * 0.47 },
        { x: width * 0.78, y: height * 0.45 },
      ];

      // Draw faint historical track
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red attribution line
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      candTrack.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Prime suspect vessel icon & pulsing ping
      const primePt = candTrack[3]; // At discharge zone
      ctx.setLineDash([]);
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(primePt.x, primePt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      const pulseR = 8 + (Math.sin(time * 3) + 1) * 6;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.8 - pulseR / 24})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(primePt.x, primePt.y, pulseR, 0, Math.PI * 2);
      ctx.stroke();

      // Vessel annotation tag
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px "Noto Sans Mono", monospace';
      ctx.fillText('MV OCEAN STAR [87% ATTRIBUTION]', primePt.x + 12, primePt.y - 8);

      // Innocent commercial traffic track (Blue/Slate)
      const bgTrack = [
        { x: width * 0.38, y: height * 0.38 },
        { x: width * 0.49, y: height * 0.40 },
        { x: width * 0.61, y: height * 0.42 },
        { x: width * 0.73, y: height * 0.44 },
      ];
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      bgTrack.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();
      ctx.restore();

      // 7. Clearly Visible Oil Slick Feature (with authentic backscatter contrast)
      ctx.save();
      const sx = width * 0.61;
      const sy = height * 0.51;

      // Dark slick core (capillary wave dampening)
      ctx.fillStyle = 'rgba(180, 35, 24, 0.45)'; // Crimson/rust slick body
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 1.4;

      ctx.beginPath();
      // Organic elongated polygon shape
      const slickRadiusX = 46;
      const slickRadiusY = 16;
      ctx.ellipse(sx, sy, slickRadiusX, slickRadiusY, 0.65, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Slick inner heavy emulsion core
      ctx.fillStyle = 'rgba(153, 27, 27, 0.75)';
      ctx.beginPath();
      ctx.ellipse(sx + 4, sy - 2, slickRadiusX * 0.5, slickRadiusY * 0.55, 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Reverse drift vector to origin
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)'; // Amber hindcast line
      ctx.lineWidth = 1.4;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(primePt.x, primePt.y);
      ctx.stroke();

      // Hindcast Origin Convergence Ellipse
      ctx.strokeStyle = '#F59E0B';
      ctx.setLineDash([]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(primePt.x, primePt.y, 22, 12, 0.4, 0, Math.PI * 2);
      ctx.stroke();

      // Tactical Slick Coordinate Reticle
      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.font = '9px "Noto Sans Mono", monospace';
      ctx.fillText('SLICK: 18.6 km² | NRCS -24.8 dB', sx + 25, sy + 30);
      ctx.fillText('ORIGIN CONVERGENCE: T-12h', primePt.x - 70, primePt.y + 26);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update real-time scientific telemetry tick every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTick((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden bg-[#071A2B] text-white pt-16 pb-12 sm:pt-20 sm:pb-16 select-none">
      {/* 1. Underlying Cinematic Earth Observation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none opacity-90 transition-opacity duration-700"
      />

      {/* 2. Soft Atmospheric Lighting / Satellite Vignette Gradients */}
      <div className="absolute inset-0 bg-radial-[circle_at_25%_45%] from-transparent via-[#071A2B]/40 to-[#071A2B]/85 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#071A2B] to-transparent pointer-events-none" />

      {/* 3. Foreground Cinematic Narrative Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 sm:pt-12">
          {/* Left Column: Authoritative Headline, Eyebrow & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/50 px-3 py-1 text-[11px] font-mono tracking-wider text-sky-300 backdrop-blur-md mb-6 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
              <span className="font-semibold uppercase tracking-widest">
                Marine Oil Spill Detection & Attribution Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
              FROM SATELLITE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-sky-100">
                PIXELS TO
              </span>
              <br />
              ACTIONABLE EVIDENCE.
            </h1>

            {/* Supporting Text */}
            <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed mb-8">
              POSEIDON integrates satellite imagery, oceanographic conditions and
              AIS vessel intelligence to detect, reconstruct, attribute and
              forecast marine oil spills.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
              <button
                onClick={() => onEnterMonitoring('detection')}
                className="flex items-center justify-center gap-2 rounded-sm bg-[#087EA4] hover:bg-[#0284C7] px-6 py-3 text-sm font-bold text-white shadow-md active:scale-[0.98] transition cursor-pointer"
              >
                <span>ENTER MONITORING SYSTEM</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="flex items-center justify-center gap-2 rounded-sm border border-slate-600/80 bg-slate-900/60 hover:bg-slate-800/80 hover:border-slate-500 px-5 py-3 text-sm font-semibold text-slate-200 backdrop-blur-xs transition cursor-pointer"
              >
                <span>EXPLORE THE INTELLIGENCE</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Operational Status Line */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-[10px] sm:text-[11px] font-mono tracking-wider text-slate-400 border-t border-slate-700/60 pt-4">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium">SATELLITE DATA OPERATIONAL</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium">AIS INTELLIGENCE OPERATIONAL</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium">OCEAN FORECAST OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Scientific Observation Telemetry HUD Card */}
          <div className="lg:col-span-5 hidden lg:flex flex-col gap-3">
            <div className="rounded-sm border border-slate-700/70 bg-[#0E243A]/85 p-4.5 backdrop-blur-md shadow-2xl text-left">
              {/* Header: Acquisition Metadata */}
              <div className="flex items-center justify-between border-b border-slate-700/70 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200">
                    TARGET: PSDN-2026-00142
                  </span>
                </div>
                <span className="text-[10px] font-mono text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-xs border border-sky-800">
                  ARABIAN SEA / MUMBAI HIGH
                </span>
              </div>

              {/* Real-time Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-3.5">
                <div className="bg-[#071A2B]/80 p-2.5 rounded-xs border border-slate-800">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">
                    SAR SENSOR ACQUISITION
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">Sentinel-1A C-SAR</div>
                  <div className="text-[10px] text-sky-400 mt-0.5">VV Pol · NRCS -24.8 dB</div>
                </div>

                <div className="bg-[#071A2B]/80 p-2.5 rounded-xs border border-slate-800">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">
                    SLICK SURFACE EXTENT
                  </div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">18.6 km² Area</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">94.2% ML Confidence</div>
                </div>

                <div className="bg-[#071A2B]/80 p-2.5 rounded-xs border border-slate-800">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">
                    LAGRANGIAN HINDCAST (ORIGIN)
                  </div>
                  <div className="text-sm font-bold text-sky-300 mt-0.5">T-12h Convergence</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">19.34°N, 71.22°E (±1.4 km)</div>
                </div>

                <div className="bg-[#071A2B]/80 p-2.5 rounded-xs border border-slate-800">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">
                    PRIME ATTRIBUTION
                  </div>
                  <div className="text-sm font-bold text-red-400 mt-0.5">MV OCEAN STAR</div>
                  <div className="text-[10px] text-slate-300 mt-0.5">87% Score · 18m AIS Gap</div>
                </div>
              </div>

              {/* Bottom Quick-Launch Trigger */}
              <button
                onClick={() => onEnterMonitoring('detection')}
                className="w-full flex items-center justify-between rounded-xs bg-[#17324D] hover:bg-[#204468] border border-slate-600 px-3 py-2 text-xs font-sans text-sky-200 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-sky-400" />
                  <span className="font-semibold text-white">Inspect Incident on Live Map</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
