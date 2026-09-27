import React from 'react';
import { Database, ShieldCheck, CheckCircle2, Clock, Cpu, FileCheck } from 'lucide-react';

export const DataProvenanceSection: React.FC = () => {
  return (
    <div className="flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-5 shadow-2xs select-none">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-[#17324D]" />
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
            Data Provenance, Quality Assurance & Institutional Standards
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#10B981]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>ISO 19115 Geospatial Metadata Compliant</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {/* Source 1 */}
        <div className="rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3">
          <div className="font-bold text-[#17324D] uppercase text-[11px] mb-1">
            Radar Earth Observation
          </div>
          <p className="text-[11px] text-[#475569]">
            Sentinel-1A / 1B Synthetic Aperture Radar (SAR) C-band Level-1 GRD imagery provided by European Space Agency (ESA) Copernicus Sentinel Hub.
          </p>
          <div className="mt-2 font-mono text-[10px] text-[#64748B]">
            Latency: ~42m post-downlink
          </div>
        </div>

        {/* Source 2 */}
        <div className="rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3">
          <div className="font-bold text-[#17324D] uppercase text-[11px] mb-1">
            Global Vessel Telemetry
          </div>
          <p className="text-[11px] text-[#475569]">
            Terrestrial and Satellite AIS telemetry ingested via Spire Maritime, exactEarth, and Coast Guard streaming APIs with dual-redundant buffers.
          </p>
          <div className="mt-2 font-mono text-[10px] text-[#64748B]">
            Completeness: 99.4% retention
          </div>
        </div>

        {/* Source 3 */}
        <div className="rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3">
          <div className="font-bold text-[#17324D] uppercase text-[11px] mb-1">
            Ocean Hydrodynamics
          </div>
          <p className="text-[11px] text-[#475569]">
            HYCOM (Hybrid Coordinate Ocean Model) 1/12° global surface reanalysis and Mercator Ocean forecast assimilation for current vectors.
          </p>
          <div className="mt-2 font-mono text-[10px] text-[#64748B]">
            Grid Resolution: ~0.08° (~9 km)
          </div>
        </div>

        {/* Source 4 */}
        <div className="rounded-xs bg-[#F8FAFC] border border-[#E2E8F0] p-3">
          <div className="font-bold text-[#17324D] uppercase text-[11px] mb-1">
            Atmospheric Forcing
          </div>
          <p className="text-[11px] text-[#475569]">
            NOAA Global Forecast System (GFS) 0.25° atmospheric model providing 10m surface wind vectors and sea surface pressure fields.
          </p>
          <div className="mt-2 font-mono text-[10px] text-[#64748B]">
            Temporal Resolution: 1-hour intervals
          </div>
        </div>
      </div>

      {/* Model Spec & Institutional Legal Notice */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F1F5F9] pt-3 text-[11px] text-[#64748B]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-[#1E293B]">
            <Cpu className="h-3.5 w-3.5 text-[#0284C7]" />
            Model: POSEIDON-SAR-SegNet v3.2.1
          </span>
          <span>•</span>
          <span className="font-mono">Backbone: ResNeXt-101 / Feature Pyramid</span>
        </div>

        <div className="text-[11px] text-[#475569] max-w-xl text-right sm:text-left">
          <strong>Notice:</strong> Data produced for maritime domain awareness and environmental protection authorities. Official verification required prior to enforcement action.
        </div>
      </div>
    </div>
  );
};
