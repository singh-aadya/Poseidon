import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Database, Satellite, Radio } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';

export const SystemStatusModal: React.FC = () => {
  const { systemStatusOpen, setSystemStatusOpen } = usePoseidonStore();

  if (!systemStatusOpen) return null;

  const pipelines = [
    {
      name: 'Satellite SAR Constellation (Sentinel-1 & EOS-04)',
      source: 'ISRO NRSC Ocean Ingest / ESA Copernicus Hub',
      status: 'Operational',
      latency: '2.4 min avg ingest',
      lastSync: '14:22 UTC (Pass 148)',
      icon: Satellite,
    },
    {
      name: 'AIS Telemetry Stream & Maritime Domain Awareness',
      source: 'DG Shipping National AIS Mesh & S-AIS (Spire/Orbcomm)',
      status: 'Operational',
      latency: '14s feed interval',
      lastSync: '14:32 UTC (Active)',
      icon: Radio,
    },
    {
      name: 'Oceanographic Metocean Forcing',
      source: 'INCOIS OSTM / NOAA GFS Wind + HYCOM 1/12° Current',
      status: 'Operational',
      latency: 'Hourly 4D assimilation',
      lastSync: '12:00 UTC cycle',
      icon: Database,
    },
    {
      name: 'Deep U-Net Detection Engine',
      source: 'ResNeXt-101 Attention U-Net TensorRT Inference',
      status: 'Operational',
      latency: '410ms per 100km² swath',
      lastSync: 'v2.4.1 Active Weights',
      icon: Cpu,
    },
    {
      name: 'Lagrangian Drift Forecaster',
      source: 'Runge-Kutta 4th Order Particle Dispersion',
      status: 'Operational',
      latency: 'Real-time 48h projections',
      lastSync: 'Nominal',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-sm border border-slate-300 bg-white shadow-xl overflow-hidden text-xs text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0F2538] bg-[#17324D] px-4 py-2.5 text-white">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-sm font-semibold tracking-tight">
              System status & data pipelines
            </span>
          </div>
          <button
            onClick={() => setSystemStatusOpen(false)}
            className="text-slate-300 hover:text-white transition p-1"
            title="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 bg-slate-50/50">
          {/* Demo Data Notice */}
          <div className="flex items-start gap-2.5 rounded-sm border border-amber-300 bg-amber-50 p-2.5 text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-xs text-amber-950">
                Demonstration environment active
              </span>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Incidents, SAR dampening masks, and AIS vessel tracks are calibrated synthetic scenarios
                engineered to demonstrate end-to-end detection, age estimation, and attribution workflows.
              </p>
            </div>
          </div>

          {/* Pipelines Grid */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-700">
              Operational ingestion & inference pipelines
            </div>
            <div className="space-y-1.5">
              {pipelines.map((pipe) => {
                const Icon = pipe.icon;
                return (
                  <div
                    key={pipe.name}
                    className="flex items-center justify-between rounded-sm border border-slate-200 bg-white p-2.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-[11px]">{pipe.name}</div>
                        <div className="text-[10px] text-slate-500">{pipe.source}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 justify-end">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{pipe.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{pipe.latency}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environmental assimilation info */}
          <div className="rounded-sm border border-slate-200 bg-white p-2.5 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Satellite data refresh rate:</span>
              <span className="font-mono text-slate-800">12h SAR / 5d Optical</span>
            </div>
            <div className="flex justify-between">
              <span>AIS position refresh:</span>
              <span className="font-mono text-slate-800">Continuous Class A/B Stream</span>
            </div>
            <div className="flex justify-between">
              <span>Geodetic datum & projection:</span>
              <span className="font-mono text-slate-800">WGS 84 / Web Mercator (EPSG:3857)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 bg-white px-4 py-2.5">
          <button
            onClick={() => setSystemStatusOpen(false)}
            className="rounded-sm border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
