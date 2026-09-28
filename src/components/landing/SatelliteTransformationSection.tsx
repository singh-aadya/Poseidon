import React, { useState } from 'react';
import { 
  Scan, 
  Cpu, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Maximize2,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';

export const SatelliteTransformationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'raw' | 'mask' | 'vector'>('all');

  return (
    <section className="relative py-28 bg-[#F8FCFF] border-b border-[#E2EDF3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-4">
            <Scan className="w-3.5 h-3.5 text-[#087EA4]" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
              Sensor-to-Vector Pipeline
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-tight">
            Raw Observation to Geospatial Intelligence.
          </h2>

          <p className="mt-4 text-base text-[#486581] leading-relaxed">
            SAR satellites capture Bragg scattering dampening caused by oil films. POSEIDON passes calibrated radar backscatter through multi-scale deep neural networks to extract verified, vector-ready intelligence.
          </p>

          {/* Flow Indicator */}
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-[#071A2B]">
            <span className="px-2.5 py-1 rounded bg-white border border-[#D5EBF5] text-[#334E68]">
              RAW OBSERVATION
            </span>
            <span className="text-[#087EA4]">→</span>
            <span className="px-2.5 py-1 rounded bg-white border border-[#D5EBF5] text-[#334E68]">
              PIXEL-LEVEL DETECTION
            </span>
            <span className="text-[#087EA4]">→</span>
            <span className="px-2.5 py-1 rounded bg-[#EEF8FC] border border-[#087EA4] text-[#087EA4]">
              GEOSPATIAL INTELLIGENCE
            </span>
          </div>
        </div>

        {/* 3-Column Split-Screen Transformation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. RAW SENTINEL-1 SAR */}
          <div className="bg-white border border-[#DCEBF2] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#087EA4]/40 transition-all">
            <div>
              {/* Header */}
              <div className="p-4 border-b border-[#E6F0F6] bg-[#FAFDFF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span className="font-mono text-xs font-bold text-[#071A2B]">SENTINEL-1 SAR</span>
                </div>
                <span className="text-[10px] font-mono text-[#627D98] bg-[#EEF8FC] px-2 py-0.5 rounded border border-[#D5EBF5]">
                  LEVEL-1 GRD
                </span>
              </div>

              {/* Visual Simulation of Raw SAR */}
              <div className="relative h-64 bg-[#1E293B] overflow-hidden flex items-center justify-center p-4">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="sarGrain" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </radialGradient>
                    <filter id="noiseFilter">
                      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                      <feColorMatrix type="saturate" values="0" />
                      <feComponentTransfer>
                        <feFuncR type="linear" slope="0.3" />
                        <feFuncG type="linear" slope="0.3" />
                        <feFuncB type="linear" slope="0.3" />
                      </feComponentTransfer>
                    </filter>
                  </defs>

                  {/* Noise Texture layer */}
                  <rect width="100%" height="100%" fill="#1E293B" />
                  <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.45" />

                  {/* Ocean wave speckle pattern */}
                  <path d="M 10 30 Q 80 25, 160 35 T 320 30" stroke="#475569" strokeWidth="0.75" fill="none" opacity="0.6" />
                  <path d="M 20 80 Q 110 75, 200 85 T 340 80" stroke="#475569" strokeWidth="0.75" fill="none" opacity="0.6" />
                  <path d="M 15 140 Q 90 135, 180 145 T 330 140" stroke="#475569" strokeWidth="0.75" fill="none" opacity="0.6" />

                  {/* Raw Dark Slick Patch (Capillary wave damping) */}
                  <path
                    d="M 110 110 C 130 95, 180 100, 210 120 C 235 135, 215 160, 185 165 C 150 170, 120 155, 105 135 Z"
                    fill="#020617"
                    opacity="0.92"
                    filter="blur(1.5px)"
                  />
                  <path
                    d="M 190 145 C 210 140, 230 145, 240 155 C 245 165, 225 170, 210 168 Z"
                    fill="#020617"
                    opacity="0.8"
                    filter="blur(1px)"
                  />
                </svg>

                {/* Telemetry Annotation Box */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#071A2B]/85 backdrop-blur-sm border border-slate-700/60 rounded px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>σ°: -21.4 dB (Peak Damping)</span>
                  <span className="text-[#38BDF8]">POL: VV (Dual)</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 space-y-2">
                <div className="text-xs font-bold text-[#071A2B]">Capillary Wave Smoothing</div>
                <p className="text-xs text-[#486581] leading-relaxed">
                  Oil dampens high-frequency ocean gravity-capillary waves, specularly reflecting radar beams away from the satellite and producing dark backscatter anomalies.
                </p>
              </div>
            </div>

            {/* Spec Table */}
            <div className="p-4 border-t border-[#E6F0F6] bg-[#FAFDFF] text-[11px] font-mono space-y-1.5">
              <div className="flex justify-between text-[#627D98]">
                <span>Sensor:</span>
                <span className="text-[#071A2B] font-semibold">C-SAR (5.405 GHz)</span>
              </div>
              <div className="flex justify-between text-[#627D98]">
                <span>Resolution:</span>
                <span className="text-[#071A2B] font-semibold">10m Ground Spacing</span>
              </div>
              <div className="flex justify-between text-[#627D98]">
                <span>Acquisition:</span>
                <span className="text-[#071A2B] font-semibold">Interferometric Wide</span>
              </div>
            </div>
          </div>

          {/* 2. ML SEGMENTATION */}
          <div className="bg-white border border-[#DCEBF2] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#087EA4]/40 transition-all">
            <div>
              {/* Header */}
              <div className="p-4 border-b border-[#E6F0F6] bg-[#FAFDFF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#087EA4] animate-pulse" />
                  <span className="font-mono text-xs font-bold text-[#071A2B]">ML SEGMENTATION</span>
                </div>
                <span className="text-[10px] font-mono text-[#087EA4] bg-[#EEF8FC] px-2 py-0.5 rounded border border-[#D5EBF5]">
                  ATTENTION U-NET
                </span>
              </div>

              {/* Visual Simulation of Probability Mask */}
              <div className="relative h-64 bg-[#0A192F] overflow-hidden flex items-center justify-center p-4">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="heatMask" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="#087EA4" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#0A192F" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Neural Grid Overlay */}
                  <line x1="0" y1="64" x2="320" y2="64" stroke="#1E3A5F" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="0" y1="128" x2="320" y2="128" stroke="#1E3A5F" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="0" y1="192" x2="320" y2="192" stroke="#1E3A5F" strokeWidth="0.5" strokeDasharray="3 3" />

                  {/* Filtered probability heatmap */}
                  <path
                    d="M 110 110 C 130 95, 180 100, 210 120 C 235 135, 215 160, 185 165 C 150 170, 120 155, 105 135 Z"
                    fill="url(#heatMask)"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 190 145 C 210 140, 230 145, 240 155 C 245 165, 225 170, 210 168 Z"
                    fill="url(#heatMask)"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                  />

                  {/* Confidence heat points */}
                  <circle cx="160" cy="130" r="14" fill="#38BDF8" opacity="0.6" filter="blur(4px)" />
                  <circle cx="160" cy="130" r="4" fill="#FFFFFF" />
                  <text x="170" y="133" fill="#FFFFFF" fontSize="9" fontFamily="monospace">P = 0.942</text>
                </svg>

                {/* Telemetry Annotation Box */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#071A2B]/85 backdrop-blur-sm border border-cyan-800/60 rounded px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono text-cyan-200">
                  <span>IoU: 94.2%</span>
                  <span className="text-emerald-400">LOOKALIKE: REJECTED</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 space-y-2">
                <div className="text-xs font-bold text-[#071A2B]">Lookalike Discrimination</div>
                <p className="text-xs text-[#486581] leading-relaxed">
                  Trained on multi-regional radar datasets to reject natural biogenic surfactants, wind shadows, and bathymetric internal waves with a 97.9% true-positive rate.
                </p>
              </div>
            </div>

            {/* Spec Table */}
            <div className="p-4 border-t border-[#E6F0F6] bg-[#FAFDFF] text-[11px] font-mono space-y-1.5">
              <div className="flex justify-between text-[#627D98]">
                <span>Architecture:</span>
                <span className="text-[#071A2B] font-semibold">ResNet-50 + Attention U-Net</span>
              </div>
              <div className="flex justify-between text-[#627D98]">
                <span>Inference Time:</span>
                <span className="text-[#071A2B] font-semibold">184 ms / Scene</span>
              </div>
              <div className="flex justify-between text-[#627D98]">
                <span>Threshold:</span>
                <span className="text-[#071A2B] font-semibold">P &gt; 0.85 Thresholded</span>
              </div>
            </div>
          </div>

          {/* 3. OIL SLICK INTELLIGENCE */}
          <div className="bg-white border border-[#087EA4]/40 ring-1 ring-[#087EA4]/20 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
            <div>
              {/* Header */}
              <div className="p-4 border-b border-[#E6F0F6] bg-[#F0F9FF] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono text-xs font-bold text-[#071A2B]">OIL SLICK INTELLIGENCE</span>
                </div>
                <span className="text-[10px] font-mono text-white bg-[#087EA4] px-2 py-0.5 rounded font-bold">
                  VECTOR GEOJSON
                </span>
              </div>

              {/* Visual Simulation of Vectorized Slick */}
              <div className="relative h-64 bg-[#071A2B] overflow-hidden flex items-center justify-center p-4">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Clean Vector Polygon */}
                  <polygon
                    points="110,110 135,95 180,100 210,120 230,138 215,160 185,165 145,168 120,155 105,135"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                  {/* Polygon Vertices */}
                  {[[110,110], [135,95], [180,100], [210,120], [230,138], [215,160], [185,165], [145,168], [120,155], [105,135]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="2.5" fill="#38BDF8" stroke="#071A2B" strokeWidth="1" />
                  ))}

                  {/* Centroid marker */}
                  <circle cx="165" cy="135" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="165" y1="125" x2="165" y2="145" stroke="#EF4444" strokeWidth="1" />
                  <line x1="155" y1="135" x2="175" y2="135" stroke="#EF4444" strokeWidth="1" />

                  {/* Orientation Vector Arrow */}
                  <line x1="165" y1="135" x2="225" y2="120" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
                  <polygon points="225,120 217,117 219,124" fill="#F59E0B" />
                </svg>

                {/* Telemetry Annotation Box */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0B253D]/90 backdrop-blur-sm border border-[#1E3A5F] rounded px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-200">
                  <span>AREA: 2.85 km²</span>
                  <span className="text-amber-400">AGE: 14.2h ± 2h</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 space-y-2">
                <div className="text-xs font-bold text-[#071A2B]">Attribution-Ready Geometry</div>
                <p className="text-xs text-[#486581] leading-relaxed">
                  Extracted contours are converted into topological GeoJSON polygons with computed centroids, major axes, volumetric bounds, and drift vectors for trajectory modeling.
                </p>
              </div>
            </div>

            {/* Spec Table */}
            <div className="p-4 border-t border-[#E6F0F6] bg-[#FAFDFF] text-[11px] font-mono space-y-1.5">
              <div className="flex justify-between text-[#627D98]">
                <span>Surface Area:</span>
                <span className="text-[#071A2B] font-semibold">2.85 km² (285 ha)</span>
              </div>
              <div className="flex justify-between text-[#627D98]">
                <span>Perimeter:</span>
                <span className="text-[#071A2B] font-semibold">11.42 km</span>
              </div>
              <div className="flex justify-between text-[#627D98]">
                <span>Centroid:</span>
                <span className="text-[#071A2B] font-semibold">19°27'00"N, 71°27'00"E</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
