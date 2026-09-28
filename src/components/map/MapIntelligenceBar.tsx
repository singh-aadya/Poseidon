import React from 'react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { LayerControl } from './LayerControl';
import { MapIntelligenceMode } from '../../types';
import { Activity, Compass, Orbit, Waves, Globe, Crosshair } from 'lucide-react';

export const MapIntelligenceBar: React.FC = () => {
  const {
    mapIntelligenceMode,
    setMapIntelligenceMode,
    getActiveIncident,
    getSelectedCandidate,
    isReplayMode,
    fitAllIncidents,
    flyToCoords,
  } = usePoseidonStore();

  const incident = getActiveIncident();
  const candidate = getSelectedCandidate();

  const modes: { id: MapIntelligenceMode; label: string; icon: React.ReactNode; tooltip: string }[] = [
    {
      id: 'operational',
      label: 'Operational',
      icon: <Activity className="h-3 w-3" />,
      tooltip: 'Slicks, active AIS vessels, and forward drift forecasts',
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: <Compass className="h-3 w-3" />,
      tooltip: 'Reverse drift hindcast, reconstructed origin, and candidate tracks',
    },
    {
      id: 'satellite',
      label: 'Satellite',
      icon: <Orbit className="h-3 w-3" />,
      tooltip: 'Sentinel-1 SAR swath footprint and radar backscatter dampening',
    },
  ];

  return (
    <div className="absolute left-3.5 top-3.5 z-20 flex flex-col gap-2 max-w-[calc(100%-120px)] pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
        {/* Conventional GIS Layer Catalog button */}
        <LayerControl />

        {/* Map Mode Switcher: OPERATIONAL | ANALYSIS | SATELLITE */}
        <div className="flex items-center rounded-sm border border-[#D1D5DB] bg-white p-0.5 shadow-xs">
          <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-r border-slate-200 select-none hidden sm:block">
            Mode
          </div>
          <div className="flex items-center gap-0.5 pl-0.5">
            {modes.map((m) => {
              const isActive = mapIntelligenceMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMapIntelligenceMode(m.id)}
                  title={m.tooltip}
                  className={`flex items-center gap-1.5 rounded-xs px-2.5 py-1 text-xs font-semibold transition select-none ${
                    isActive
                      ? 'bg-[#17324D] text-white shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* World Overview & Focus Selected Actions */}
        <div className="flex items-center gap-1 rounded-sm border border-[#D1D5DB] bg-white p-0.5 shadow-xs">
          <button
            type="button"
            onClick={fitAllIncidents}
            title="View all incidents (fit overview)"
            className="flex items-center gap-1 rounded-xs px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Globe className="h-3.5 w-3.5 text-[#1769AA]" />
            <span>All Incidents</span>
          </button>
          <span className="h-4 w-px bg-slate-200" />
          <button
            type="button"
            onClick={() => flyToCoords(incident.coordinates, 10.4)}
            title={`Focus active incident: ${incident.id}`}
            className="flex items-center gap-1 rounded-xs px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <Crosshair className="h-3.5 w-3.5 text-[#B42318]" />
            <span>Focus Active</span>
          </button>
        </div>

        {/* Replay indicator pill if active */}
        {isReplayMode && (
          <div className="flex items-center gap-1.5 rounded-sm border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>HISTORICAL REPLAY</span>
          </div>
        )}
      </div>

      {/* Map Intelligence Overlay HUD (Unobtrusive Institutional Panel) */}
      <div className="pointer-events-auto flex items-center gap-3 rounded-sm border border-[#D1D5DB] bg-white/95 backdrop-blur-xs px-3 py-1.5 text-xs text-slate-700 shadow-xs flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold text-slate-900">{incident.id}</span>
          <span className="text-[10px] font-sans rounded bg-slate-100 px-1.5 py-0.2 text-slate-600 border border-slate-200">
            {incident.area_km2.toFixed(1)} km²
          </span>
        </div>

        <span className="text-slate-300">|</span>

        <div className="flex items-center gap-1.5 text-[11px]">
          <Waves className="h-3 w-3 text-cyan-700 shrink-0" />
          <span className="text-slate-600">
            Wind <strong className="font-mono text-slate-800">{incident.signature.ambient_wind_knots}kt ({incident.signature.ambient_wind_direction_deg}°)</strong>
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-600">
            Current <strong className="font-mono text-slate-800">{incident.signature.ambient_current_knots}kt ({incident.signature.ambient_current_direction_deg}°)</strong>
          </span>
        </div>

        {mapIntelligenceMode === 'analysis' && (
          <>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200">
              <span className="font-semibold">Reconstructed Origin:</span>
              <span className="font-mono">
                {incident.breadcrumbs && incident.breadcrumbs.length > 0
                  ? `${Math.abs(incident.breadcrumbs[0].lat).toFixed(2)}°${incident.breadcrumbs[0].lat >= 0 ? 'N' : 'S'}, ${Math.abs(incident.breadcrumbs[0].lng).toFixed(2)}°${incident.breadcrumbs[0].lng >= 0 ? 'E' : 'W'}`
                  : '19.34°N, 71.22°E'}
              </span>
              <span className="text-[10px] font-bold text-amber-700">(82% conf)</span>
            </div>
          </>
        )}

        {mapIntelligenceMode === 'satellite' && (
          <>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-[11px] text-cyan-900 bg-cyan-50/80 px-2 py-0.5 rounded border border-cyan-200">
              <span className="font-semibold">Sensor:</span>
              <span>Sentinel-1A C-SAR (VV)</span>
              <span className="font-mono text-[10px] text-cyan-700">NRCS -24.8dB</span>
            </div>
          </>
        )}

        {candidate && (
          <>
            <span className="text-slate-300 hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500">Prime candidate:</span>
              <span className="font-bold text-slate-800">{candidate.vessel_name}</span>
              <span className="font-mono text-[10px] text-[#1769AA] font-bold">({candidate.attribution_score}%)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
