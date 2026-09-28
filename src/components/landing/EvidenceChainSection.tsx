import React from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Clock, 
  Waves, 
  RotateCcw, 
  Ship, 
  Scale, 
  Wind, 
  Lock,
  Download
} from 'lucide-react';

export const EvidenceChainSection: React.FC = () => {
  const chainSteps = [
    {
      num: '01',
      title: 'SATELLITE OBSERVATION',
      agency: 'ESA Copernicus / IN-ISRO Ingest',
      desc: 'Sentinel-1A SAR Level-1 Ground Range Detected (GRD) interferometric wide swath scene at 10m spatial resolution.',
      provenance: 'SHA-256: 8f4e2...b91a',
      icon: Radio,
    },
    {
      num: '02',
      title: 'SLICK GEOMETRY & RADIOMETRY',
      agency: 'Attention U-Net Neural Segmenter',
      desc: 'Vectorized GeoJSON polygon of 2.85 km² with characteristic Bragg wave damping ratio of -21.4 dB and 11.42 km perimeter.',
      provenance: 'Polygon Vertices: 14 Nodes',
      icon: Layers,
    },
    {
      num: '03',
      title: 'AGE ESTIMATION',
      agency: 'Thermodynamic Weathering Engine',
      desc: 'Evaporative mass-fraction loss (34.8%) and emulsification state model release window between 04:15 and 06:30 UTC (Age: 14.2h ± 2h).',
      provenance: 'Mackay Loss Matrix v2.1',
      icon: Clock,
    },
    {
      num: '04',
      title: 'ENVIRONMENTAL CONDITIONS',
      agency: 'INCOIS Marine & ECMWF Reanalysis',
      desc: 'Ingested surface current field (0.42 m/s @ 072° ENE) and 10-meter atmospheric wind velocity (12.4 kn @ 245° WSW).',
      provenance: 'Hydrodynamic Grid: 0.08° Res',
      icon: Waves,
    },
    {
      num: '05',
      title: 'DRIFT HINDCAST',
      agency: 'Lagrangian Backward Solver',
      desc: 'Stochastic 5,000-particle time-inversion tracking the slick centroid -8.4 NM reverse trajectory to source coordinates 19°22\'14"N, 71°18\'40"E.',
      provenance: 'Run Hash: 0x93C...F812',
      icon: RotateCcw,
    },
    {
      num: '06',
      title: 'AIS TRAJECTORY CORRELATION',
      agency: 'Global Maritime AIS Stream',
      desc: 'Automated KD-tree spatiotemporal intersection filter examining all vessels within a 25 NM radius of the source ellipse.',
      provenance: '4 Vessels Ingested',
      icon: Ship,
    },
    {
      num: '07',
      title: 'CANDIDATE ASSESSMENT',
      agency: 'Multi-Criteria Bayesian Matrix',
      desc: 'Evidence-weighted candidate scoring: MV OCEAN STAR flagged with 87% index (CPA 0.82 NM, speed drop 14.2 → 8.1 kn, 38-min AIS silence).',
      provenance: 'Audit Score: 87 / 100',
      icon: Scale,
    },
    {
      num: '08',
      title: 'FORWARD FORECAST & BUFFER',
      agency: 'Oceanographic Ensemble Model',
      desc: 'Forward drift corridor projections over +48 hours with coastal proximity evaluation (28.4 NM to Alibag coast, 38.6-hour buffer).',
      provenance: 'Alert Horizon: +48 Hours',
      icon: Wind,
    }
  ];

  return (
    <section id="evidence" className="relative py-28 bg-[#FFFFFF] border-b border-[#E2EDF3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#087EA4]" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
              Chain of Custody & Traceability
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-tight">
            Every Conclusion Has a Trail of Evidence.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#334E68] leading-relaxed">
            POSEIDON connects observations, models, and vessel intelligence into a traceable investigation. Every hypothesis is supported by immutable data signatures suitable for institutional reporting.
          </p>
        </div>

        {/* Vertical Evidence Chain Timeline */}
        <div className="relative border-l-2 border-[#DCEBF2] ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {chainSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative group">
                {/* Node circle on timeline */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-[#087EA4] flex items-center justify-center text-[#087EA4] group-hover:bg-[#087EA4] group-hover:text-white transition-all shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content Box */}
                <div className="bg-[#F8FCFF] group-hover:bg-white border border-[#DCEBF2] group-hover:border-[#087EA4]/40 rounded-xl p-5 sm:p-6 transition-all shadow-sm group-hover:shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E6F0F6]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#087EA4] bg-[#EEF8FC] px-2 py-0.5 rounded border border-[#D5EBF5]">
                        STEP {step.num}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#071A2B]">
                        {step.title}
                      </h3>
                    </div>

                    <div className="text-[11px] font-mono text-[#627D98]">
                      {step.agency}
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-[#486581] leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#E6F0F6] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#627D98]">Cryptographic Seal:</span>
                    <span className="text-[#087EA4] font-semibold bg-white px-2 py-0.5 rounded border border-[#DCEBF2]">
                      {step.provenance}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dossier Legal Admissibility Card */}
        <div className="mt-16 bg-gradient-to-r from-[#071A2B] via-[#0B253D] to-[#071A2B] rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#1E3A5F]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#38BDF8] font-mono text-xs font-bold">
              <Lock className="w-4 h-4" />
              <span>FORENSIC DOSSIER COMPLIANCE</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold tracking-tight">
              Court-Admissible Maritime Enforcement Package
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every investigation report bundles raw geotiff SAR slices, AIS track CSVs, Lagrangian vector checkpoints, and environmental condition matrices into an immutable ZIP archive formatted to ISO 19115 and OGC spatial standards.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-[#0F3254] border border-[#38BDF8]/30 font-mono text-xs text-white">
              SHA-256 SEALED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
