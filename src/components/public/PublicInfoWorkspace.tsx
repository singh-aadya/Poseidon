import React, { useState } from 'react';
import {
  Satellite,
  Waves,
  Ship,
  Clock,
  Compass,
  FileText,
  AlertTriangle,
  Phone,
  HelpCircle,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Database,
  Radio,
  Eye,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';

type InfoTab =
  | 'overview'
  | 'sar-detection'
  | 'drift-age'
  | 'vessel-attribution'
  | 'forecasting'
  | 'provenance'
  | 'faq'
  | 'emergency';

export const PublicInfoWorkspace: React.FC = () => {
  const { setActiveMode, currentUser } = usePoseidonStore();
  const [activeTab, setActiveTab] = useState<InfoTab>('overview');
  const [faqSearch, setFaqSearch] = useState('');

  const tabs: { id: InfoTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Program Overview', icon: <Eye className="h-4 w-4" /> },
    { id: 'sar-detection', label: 'SAR & ML Detection', icon: <Satellite className="h-4 w-4" /> },
    { id: 'drift-age', label: 'Spill Age & Drift', icon: <Waves className="h-4 w-4" /> },
    { id: 'vessel-attribution', label: 'Vessel Attribution', icon: <Ship className="h-4 w-4" /> },
    { id: 'forecasting', label: 'Trajectory Forecasting', icon: <Compass className="h-4 w-4" /> },
    { id: 'provenance', label: 'Data Sources & Freshness', icon: <Database className="h-4 w-4" /> },
    { id: 'faq', label: 'Scientific FAQ & Glossary', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'emergency', label: 'Reporting & Emergency', icon: <Phone className="h-4 w-4" /> },
  ];

  const glossaryItems = [
    {
      term: 'SAR (Synthetic Aperture Radar)',
      def: 'An active microwave imaging sensor that illuminates the ocean surface and measures backscattered energy. Capable of operating through clouds, haze, and solar darkness.',
    },
    {
      term: 'Bragg Scattering & Capillary Waves',
      def: 'Microwave radar backscatter is governed by resonance with ocean surface capillary-gravity waves (wavelengths of 2–10 cm). Surfactants damp these small waves, creating specular reflection away from the radar antenna.',
    },
    {
      term: 'Marangoni Effect',
      def: 'Surface tension gradient induced by a thin surfactant or hydrocarbon layer that resists deformation and rapidly dissipates energy of high-frequency capillary waves.',
    },
    {
      term: 'Radar Look-Alikes',
      def: 'False positive dark patches caused by biogenic natural oils (algal blooms, fish spawn), low-wind calms (< 2.5 m/s), rain cells, internal solitary waves, or grease ice.',
    },
    {
      term: 'Fay Spreading Phases',
      def: 'A three-regime hydrodynamic model developed by J.A. Fay describing oil slick radial expansion: Gravity-Inertial (hours 0–1), Gravity-Viscous (hours 1–24), and Surface Tension-Viscous (hours 24+).',
    },
    {
      term: 'Lagrangian Hindcasting',
      def: 'Backward time-stepping of water parcels driven by reverse surface ocean currents (HYCOM) and wind leeway (GFS) to localize the spatio-temporal release window and origin point of an oil slick.',
    },
    {
      term: 'AIS (Automatic Identification System)',
      def: 'VHF transponder system mandated by IMO SOLAS for ships > 300 GT transmitting vessel identity, position, speed over ground (SOG), and course over ground (COG).',
    },
    {
      term: 'Dark Vessel / AIS Blackout',
      def: 'A vessel that intentionally deactivates its AIS Class A transponder or suffers transmission gaps in vicinity of suspected discharge events to evade maritime regulatory detection.',
    },
    {
      term: 'Environmental Sensitivity Index (ESI)',
      def: 'NOAA-standardized cartographic index classifying coastlines from 1 (exposed rocky shores / low sensitivity) to 10 (salt marshes, mangrove wetlands / extreme biological vulnerability).',
    },
  ];

  const filteredGlossary = glossaryItems.filter(
    (item) =>
      item.term.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.def.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="flex h-full w-full max-w-full flex-col bg-[#F8FAFC] text-slate-900 overflow-hidden box-border">
      {/* Top Banner: Scientific / Institutional Authority Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 shrink-0 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                PUBLIC SCIENTIFIC CLEARANCE
              </span>
              <span className="text-xs text-slate-500 font-mono">DOC-PSDN-PUB-2026-v4</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#0F2538] mt-1">
              POSEIDON Public Information & Scientific Methodology Center
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Autonomous satellite SAR marine oil pollution monitoring, hydrodynamic drift hindcasting, and vessel attribution methodology.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setActiveMode('detection')}
              className="flex items-center gap-1.5 rounded-sm bg-[#17324D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1C3D5E] transition"
            >
              <span>Explore Public Live Map</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Body: Sidebar Navigation + Content Canvas */}
      <div className="flex flex-1 min-h-0 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Navigation Sidebar */}
        <aside className="w-56 sm:w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Information Sections
            </div>
          </div>
          <nav className="p-2 space-y-1 flex-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-sm transition text-left ${
                    isActive
                      ? 'bg-[#17324D] text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-sky-300' : 'text-slate-500'}>{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Contact Box */}
          <div className="p-3 m-2 rounded-sm border border-slate-200 bg-slate-50 text-[11px] text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <Phone className="h-3 w-3 text-red-600" />
              <span>Marine Pollution Hotline</span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
              To report an active spill sighting in US waters, contact USCG NRC:
            </p>
            <div className="mt-1 font-mono font-bold text-slate-800">1-800-424-8802</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#F8FAFC]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2538]">
                  Surveillance Scope & Objectives
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  POSEIDON is an automated Earth-observation maritime surveillance and oceanographic forensics system designed to detect, characterize, and trace marine hydrocarbon discharges. It serves environmental protection authorities, coast guards, port state controls, and marine scientific researchers worldwide.
                </p>
              </div>

              {/* 3 Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-blue-50 text-[#1769AA] mb-3">
                    <Satellite className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">1. Autonomous SAR Detection</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Continuous ingest of Copernicus Sentinel-1 C-band SAR. Computer vision segmentation flags surface backscatter dampening with 93.4% validated recall.
                  </p>
                </div>

                <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-teal-50 text-teal-700 mb-3">
                    <Waves className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">2. Hydrodynamic Forensics</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Couples Fay radial spreading equations with high-resolution HYCOM currents and GFS wind advection to backtrack slick movement to exact release timestamps.
                  </p>
                </div>

                <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-indigo-50 text-indigo-700 mb-3">
                    <Ship className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">3. Vessel Trajectory Attribution</h3>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Correlates temporal release origin cones against global AIS ship tracks, flagging speed decelerations, course deviations, and suspicious transponder blackouts.
                  </p>
                </div>
              </div>

              {/* What POSEIDON Monitors */}
              <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">Monitored Marine Domains</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Offshore Energy Infrastructure:</span> Deepwater drilling rigs, production platforms, subsea pipelines, and FPSO units in the Gulf of Mexico, North Sea, and Persian Gulf.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">High-Density Maritime Corridors:</span> Traffic separation schemes (TSS) in the Straits of Malacca, Singapore, Dover, and Florida Straits where illegal bilge dumping occurs.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Sensitive Coastal Ecosystems:</span> NOAA Environmental Sensitivity Index (ESI) Tier 8–10 estuaries, salt marshes, coral reefs, and marine protected areas.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Natural Hydrocarbon Seeps:</span> Baseline cataloging of recurring natural cold seeps (e.g. Green Canyon seeps) to prevent false operational alarms.
                    </div>
                  </div>
                </div>
              </div>

              {/* Public vs Operational Access Disclaimer */}
              <div className="rounded-sm border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldCheck className="h-4 w-4 text-blue-700" />
                  <span>Public Information Policy</span>
                </div>
                <p className="leading-relaxed">
                  The Public Information Center provides open scientific transparency into algorithms, data feeds, and verified public incidents. Under operational protocols, real-time unverified detections and sensitive legal vessel attribution dossiers require authenticated Analyst or Operations credentials to safeguard active enforcement investigations.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SAR & ML DETECTION */}
          {activeTab === 'sar-detection' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2538]">
                  How Oil Spill Detection Works (SAR Physics & Deep Learning)
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Oil slick detection from space relies on active Synthetic Aperture Radar (SAR) microwave sensors operating at C-band (5.4 GHz) frequencies.
                </p>
              </div>

              {/* Visual Diagram: SAR Bragg Scattering vs Specular Reflection */}
              <div className="rounded-sm border border-slate-300 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-3 flex items-center justify-between">
                  <span>Physical Mechanism: Sea Surface Bragg Wave Dampening</span>
                  <span className="text-[10px] font-mono text-slate-500">C-BAND (λ = 5.6 cm)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                  {/* Clean Water */}
                  <div className="border border-slate-200 rounded-sm p-3 bg-slate-50">
                    <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                      <span>Clean Ocean Surface (High Backscatter)</span>
                    </div>
                    <div className="h-28 bg-[#17324D] rounded-sm relative overflow-hidden flex flex-col items-center justify-center text-white p-2">
                      <svg className="w-full h-12" viewBox="0 0 200 40">
                        <path
                          d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20 T120,20 T140,20 T160,20 T180,20 T200,20"
                          fill="none"
                          stroke="#60A5FA"
                          strokeWidth="2"
                        />
                      </svg>
                      <div className="text-[10px] text-center text-sky-200 mt-1">
                        Capillary-Gravity Waves (2–5 cm) ➔ Resonant Bragg Backscatter returns to Radar (-12 to -16 dB)
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      Wind creates short capillary waves. Microwave radar pulses scatter diffusely in all directions, reflecting a strong echo back to the satellite antenna (appears bright/grey).
                    </p>
                  </div>

                  {/* Oil Covered Surface */}
                  <div className="border border-slate-200 rounded-sm p-3 bg-slate-50">
                    <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-600"></span>
                      <span>Hydrocarbon Slick (Backscatter Dampened)</span>
                    </div>
                    <div className="h-28 bg-[#0F172A] rounded-sm relative overflow-hidden flex flex-col items-center justify-center text-white p-2">
                      <svg className="w-full h-12" viewBox="0 0 200 40">
                        <line x1="0" y1="20" x2="200" y2="20" stroke="#38BDF8" strokeWidth="2" />
                        <line x1="30" y1="18" x2="170" y2="18" stroke="#F59E0B" strokeWidth="3" />
                      </svg>
                      <div className="text-[10px] text-center text-amber-300 mt-1">
                        Marangoni Effect flattens surface ➔ Specular forward reflection away from sensor (-24 to -28 dB)
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                      Viscous oil dampens capillary ripples. The sea surface acts like a mirror, bouncing radar energy away from the sensor. The slick appears as a distinct dark anomaly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Machine Learning Pipeline */}
              <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">
                  Deep Learning Segmentation & Look-Alike Discrimination
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Not all dark patches in SAR imagery are oil spills. Low-wind calm zones (&lt; 2 m/s), biogenic slicks (algal blooms), rain cells, and grease ice also produce dampening. POSEIDON filters false positives using a multi-stage convolutional neural network:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="border border-slate-200 rounded-sm p-2.5 bg-slate-50">
                    <div className="font-mono font-bold text-slate-800 text-[11px]">STAGE 1: RADIOMETRY</div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Calibrates $\sigma^0$ radar backscatter, speckle Lee filtering (7x7 window), and adaptive thresholding for dark spot candidate extraction.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-sm p-2.5 bg-slate-50">
                    <div className="font-mono font-bold text-slate-800 text-[11px]">STAGE 2: ATTENTION U-NET</div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      ResNeXt-101 backbone extracts spatial context, slick boundary gradients, elongation ratio, perimeter complexity, and homogeneity.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-sm p-2.5 bg-slate-50">
                    <div className="font-mono font-bold text-slate-800 text-[11px]">STAGE 3: METOCEAN FUSION</div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Cross-references collocated ECMWF/GFS 10m wind speeds. Slicks with wind &gt; 12 m/s or &lt; 2.5 m/s are flagged for manual analyst review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPILL AGE & DRIFT */}
          {activeTab === 'drift-age' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2538]">
                  Spill Age Estimation & Hydrodynamic Drift Hindcasting
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To determine when oil was discharged and which vessel was present, POSEIDON couples Fay's classic oil spreading formulation with backward Lagrangian trajectory advection.
                </p>
              </div>

              {/* Fay Spreading Formula Explained */}
              <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">
                  Fay's Three-Phase Radial Spreading Model
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-[#17324D] text-white">
                      <tr>
                        <th className="p-2 border-r border-[#2F4F70]">Spreading Phase</th>
                        <th className="p-2 border-r border-[#2F4F70]">Time Horizon</th>
                        <th className="p-2 border-r border-[#2F4F70]">Governing Mechanics</th>
                        <th className="p-2">Analytical Radius Formulation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr className="bg-white">
                        <td className="p-2 font-bold text-slate-900">Phase 1: Gravity-Inertial</td>
                        <td className="p-2 font-mono">0 – 1 hour</td>
                        <td className="p-2">Spreading driven by gravity against water inertia; slick thickness &gt; 5 mm</td>
                        <td className="p-2 font-mono text-[11px]">r(t) = k₁ · (Δ · g · V · t²)¼</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="p-2 font-bold text-slate-900">Phase 2: Gravity-Viscous</td>
                        <td className="p-2 font-mono">1 – 24 hours</td>
                        <td className="p-2">Gravitational expansion counteracted by oil/water kinematic viscosity</td>
                        <td className="p-2 font-mono text-[11px]">r(t) = k₂ · (Δ · g · V² · t³ / ν_w½)⅙</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-2 font-bold text-slate-900">Phase 3: Surface Tension</td>
                        <td className="p-2 font-mono">&gt; 24 hours</td>
                        <td className="p-2">Net surface tension drives thin sheen (&lt; 0.1 μm) alongside weathering</td>
                        <td className="p-2 font-mono text-[11px]">r(t) = k₃ · (σ² · t³ / (ρ_w² · ν_w))¼</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Backward Advection Hindcasting */}
              <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">
                  Lagrangian Backward Trajectory Advection
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Given the observed slick boundary at satellite overpass timestamp T_sat, the system computes reverse trajectories for 1,000 numerical parcels using inverted Eulerian velocity fields:
                </p>

                <div className="rounded-sm bg-slate-900 text-slate-100 p-3 font-mono text-xs mb-3">
                  x(t - Δt) = x(t) - [ U_ocean(x,t) + 0.035 · U_wind10m(x,t) ] · Δt + R_turbulent
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="border border-slate-200 rounded-sm p-3 bg-slate-50">
                    <span className="font-bold text-slate-800">Ocean Currents (HYCOM 1/12°):</span> Provides 3D ocean circulation, eddy advection, and tidal current components updated every 3 hours.
                  </div>
                  <div className="border border-slate-200 rounded-sm p-3 bg-slate-50">
                    <span className="font-bold text-slate-800">Wind Leeway Factor (3.5% GFS):</span> Accounts for direct surface drag of atmospheric wind at 10-meter altitude with an empirical 15° Coriolis deflection angle.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VESSEL ATTRIBUTION */}
          {activeTab === 'vessel-attribution' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2538]">
                  AIS-Based Vessel Attribution Methodology
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  How POSEIDON identifies candidate polluter vessels from thousands of commercial ships operating in international and territorial sea lanes.
                </p>
              </div>

              {/* 4 Attribution Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-sm bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1.5">
                    <Compass className="h-4 w-4 text-[#1769AA]" />
                    <span>1. Spatio-Temporal Corridor Intersection</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Filters all AIS tracks intersecting the hindcast release ellipse during the release time interval $[t_0 - 2\sigma, t_0 + 2\sigma]$. Vessels within 1.5 nautical miles receive initial attribution weight.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-sm bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1.5">
                    <Activity className="h-4 w-4 text-amber-600" />
                    <span>2. Kinematic Maneuver Anomalies</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evaluates Speed Over Ground (SOG) and Course Over Ground (COG). Discharges frequently occur during sudden speed decelerations (e.g. slowing from 15 kts to 5 kts for oily bilge discharge).
                  </p>
                </div>

                <div className="border border-slate-200 rounded-sm bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1.5">
                    <Radio className="h-4 w-4 text-red-600" />
                    <span>3. AIS Transmission Blackouts</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Detects intentional transponder deactivations. Gaps exceeding 15 minutes while transiting within 5 NM of the release site significantly increase forensic suspicion score.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-sm bg-white p-4 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1.5">
                    <FileText className="h-4 w-4 text-teal-700" />
                    <span>4. Cargo & Deficiency Risk Index</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cross-references IMO registry data, Deadweight Tonnage (DWT), vessel type (Crude Tanker, Product Tanker, Bulk Carrier), flag state risk tier, and Paris/Tokyo MoU inspection records.
                  </p>
                </div>
              </div>

              {/* Attribution Confidence Formula */}
              <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">
                  Bayesian Attribution Probability Score
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Each candidate vessel $V_i$ receives an integrated attribution confidence score:
                </p>
                <div className="rounded-sm bg-slate-900 text-slate-100 p-3 font-mono text-xs">
                  Score(V_i) = w₁ · P_spatial(d) + w₂ · P_temporal(Δt) + w₃ · P_kinematic(Δv) + w₄ · P_blackout + w₅ · P_risk
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  * Scores &gt; 85% generate automated High-Priority Attribution Review alerts for operational Coast Guard / Maritime Administration tasking.
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FORECASTING */}
          {activeTab === 'forecasting' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2538]">
                  Drift Trajectory Forecasting & Shoreline Impact Analysis
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Numerical forecasting of slick advection over 6, 12, 24, 48, and 72-hour forecast horizons to guide spill response deployment and boom placement.
                </p>
              </div>

              <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">
                  Stochastic Ensemble Particle Tracking
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Rather than a single deterministic line, POSEIDON simulates 10,000 Lagrangian numerical parcels. A random walk diffusion term simulates sub-grid scale oceanic turbulence:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="border border-slate-200 rounded-sm p-3 bg-slate-50">
                    <div className="font-bold text-slate-800">50% Core Impact Contour</div>
                    <p className="text-slate-600 mt-1">High-probability core slick mass where surface skimmers and chemical dispersant aircraft are prioritized.</p>
                  </div>
                  <div className="border border-slate-200 rounded-sm p-3 bg-slate-50">
                    <div className="font-bold text-slate-800">90% Uncertainty Envelope</div>
                    <p className="text-slate-600 mt-1">Maximum extent of thin sheen and weathered emulsions under fluctuating wind gusts and tidal shifts.</p>
                  </div>
                  <div className="border border-slate-200 rounded-sm p-3 bg-slate-50">
                    <div className="font-bold text-slate-800">Shoreline Inundation Time (ETA)</div>
                    <p className="text-slate-600 mt-1">Computes earliest probable coastal landfall down to 30-minute intervals along Environmental Sensitivity Index (ESI) coastlines.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DATA SOURCES & PROVENANCE */}
          {activeTab === 'provenance' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2538]">
                  Data Sources, Sensors & Telemetry Freshness
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Transparent provenance of all satellite Earth observation, metocean models, and maritime tracking data streams integrated into POSEIDON.
                </p>
              </div>

              <div className="rounded-sm border border-slate-200 bg-white overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#17324D] text-white">
                    <tr>
                      <th className="p-3 border-r border-[#2F4F70]">Data Stream</th>
                      <th className="p-3 border-r border-[#2F4F70]">Sensor / Provider</th>
                      <th className="p-3 border-r border-[#2F4F70]">Resolution</th>
                      <th className="p-3 border-r border-[#2F4F70]">Update Frequency</th>
                      <th className="p-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">SAR Radar Imagery</td>
                      <td className="p-3">Copernicus Sentinel-1A/1B (ESA)</td>
                      <td className="p-3 font-mono">10m C-Band IW</td>
                      <td className="p-3">6–12 days revisit</td>
                      <td className="p-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">NOMINAL (99.8%)</span></td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">Optical Multi-spectral</td>
                      <td className="p-3">Sentinel-2 MSI & Landsat 8/9</td>
                      <td className="p-3 font-mono">10m / 30m Optical</td>
                      <td className="p-3">5 days (cloud permitting)</td>
                      <td className="p-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">NOMINAL</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Vessel Telemetry (AIS)</td>
                      <td className="p-3">Spire Global / Terrestrial VHF</td>
                      <td className="p-3 font-mono">Global MMSI tracks</td>
                      <td className="p-3">Real-time (&lt; 2 min)</td>
                      <td className="p-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">NOMINAL (14.2k msgs/s)</span></td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">Ocean Current Vectors</td>
                      <td className="p-3">HYCOM Global 1/12°</td>
                      <td className="p-3 font-mono">0.08° (~8 km grid)</td>
                      <td className="p-3">Every 3 hours</td>
                      <td className="p-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">NOMINAL</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Atmospheric Wind Fields</td>
                      <td className="p-3">NOAA NCEP GFS</td>
                      <td className="p-3 font-mono">0.25° grid</td>
                      <td className="p-3">Every 6 hours</td>
                      <td className="p-3"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">NOMINAL</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SCIENTIFIC FAQ & GLOSSARY */}
          {activeTab === 'faq' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2538]">
                  Scientific Glossary & Frequently Asked Questions
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Definitions of oceanographic, remote sensing, and maritime enforcement terminology.
                </p>
              </div>

              {/* Search Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search glossary terms (e.g. Bragg, Marangoni, AIS, Fay)..."
                  className="w-full rounded-sm border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs placeholder:text-slate-400 focus:border-[#17324D] focus:outline-hidden"
                />
              </div>

              {/* Glossary Grid */}
              <div className="space-y-3">
                {filteredGlossary.map((item, idx) => (
                  <div key={idx} className="rounded-sm border border-slate-200 bg-white p-3.5 shadow-2xs">
                    <div className="font-bold text-xs sm:text-sm text-[#17324D] mb-1">
                      {item.term}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.def}</p>
                  </div>
                ))}
                {filteredGlossary.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-sm">
                    No glossary terms matched your query "{faqSearch}".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: EMERGENCY & REPORTING */}
          {activeTab === 'emergency' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F2538]">
                  Emergency Marine Pollution Reporting Protocols
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Official procedures and emergency contact information for reporting suspected marine oil spills, vessel discharges, and environmental threats.
                </p>
              </div>

              {/* Emergency Contacts Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-red-300 bg-red-50/50 rounded-sm p-4">
                  <div className="text-xs font-bold text-red-900 uppercase tracking-wider mb-1">
                    United States Waters (EEZ)
                  </div>
                  <div className="text-base font-bold text-slate-900">National Response Center (NRC)</div>
                  <div className="mt-2 space-y-1 text-xs text-slate-700">
                    <div>
                      <span className="font-semibold">24/7 Toll-Free Hotline:</span>{' '}
                      <span className="font-mono font-bold text-red-700">1-800-424-8802</span>
                    </div>
                    <div>
                      <span className="font-semibold">Direct Washington DC:</span>{' '}
                      <span className="font-mono font-bold">202-267-2675</span>
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> nrc@uscg.mil
                    </div>
                  </div>
                </div>

                <div className="border border-sky-300 bg-sky-50/50 rounded-sm p-4">
                  <div className="text-xs font-bold text-sky-900 uppercase tracking-wider mb-1">
                    International & European Waters
                  </div>
                  <div className="text-base font-bold text-slate-900">EMSA / IMO Incident Protocol</div>
                  <div className="mt-2 space-y-1 text-xs text-slate-700">
                    <div>
                      <span className="font-semibold">EMSA CleanSeaNet Ops:</span> csn@emsa.europa.eu
                    </div>
                    <div>
                      <span className="font-semibold">IMO MARPOL Reporting:</span> Standard Marine Communication Phrases (SMCP) via VHF Ch 16 / DSC.
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Sighting Data Checklist */}
              <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">
                  Information to Provide When Filing an Incident Report
                </h3>
                <p className="text-xs text-slate-600 mb-3">
                  When reporting a slick to Coast Guard or environmental authorities, ensure the following details are logged:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#17324D]"></span>
                    <span>Exact GPS Coordinates (Latitude / Longitude)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#17324D]"></span>
                    <span>Date, UTC timestamp, and observation platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#17324D]"></span>
                    <span>Estimated length, width, and surface area coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#17324D]"></span>
                    <span>Color/appearance (silver sheen, rainbow, brown mousse, dark black)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#17324D]"></span>
                    <span>Nearby vessels (Name, IMO, MMSI, course, wake trails)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#17324D]"></span>
                    <span>Current weather, wind speed/direction, and sea state</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
