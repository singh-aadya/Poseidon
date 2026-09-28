import React from 'react';
import { 
  Radio, 
  Ship, 
  Waves, 
  Wind, 
  Globe2, 
  CheckCircle2,
  Database
} from 'lucide-react';

export const DataSourcesSection: React.FC = () => {
  const sources = [
    {
      category: 'SATELLITE',
      type: 'SAR / Earth Observation',
      icon: Radio,
      description: 'Synthetic Aperture Radar (SAR) dual-pol backscatter and high-resolution multispectral optical observation.',
      feeds: [
        'Copernicus Sentinel-1 C-SAR (IW/EW Modes)',
        'Copernicus Sentinel-2 MultiSpectral (MSI)',
        'USGS/NASA Landsat-9 OLI-2 Radiometry'
      ],
      cadence: '12-Day Repeat • Real-Time Downlink'
    },
    {
      category: 'VESSEL',
      type: 'AIS Telemetry & Kinematics',
      icon: Ship,
      description: 'Global Class-A and Class-B Automatic Identification System vessel position, course, speed, and voyage logs.',
      feeds: [
        'Terrestrial Coastal AIS Receiver Arrays',
        'Low-Earth Orbit Satellite AIS Constellations',
        'IMO / MMSI Maritime Vessel Registry'
      ],
      cadence: 'Continuous Real-Time Streaming'
    },
    {
      category: 'OCEAN',
      type: 'Currents / SST / Waves',
      icon: Waves,
      description: 'Physical oceanographic reanalysis and operational forecasts of surface velocity fields, sea surface temperatures, and wave heights.',
      feeds: [
        'INCOIS High-Resolution Regional Hydrodynamic Models',
        'Copernicus Marine Service (CMEMS Global Ocean)',
        'GEBCO Gridded Subsea Bathymetry'
      ],
      cadence: '6-Hour Operational Cycles'
    },
    {
      category: 'ATMOSPHERE',
      type: 'Wind & Meteorological Forcing',
      icon: Wind,
      description: 'Near-surface 10-meter atmospheric wind velocity, surface pressure anomalies, and boundary layer thermodynamics.',
      feeds: [
        'ECMWF ERA5 Reanalysis & HRES Models',
        'India Meteorological Department (IMD) GFS',
        'NOAA Global Forecast System (GFS 0.25°)'
      ],
      cadence: 'Hourly Reanalysis • 6h Forecasts'
    },
    {
      category: 'GEOSPATIAL',
      type: 'Coastlines & Maritime Zones',
      icon: Globe2,
      description: 'Legal jurisdictional boundaries, baseline coastlines, sensitive mangrove reserves, and port navigational corridors.',
      feeds: [
        'UNCLOS Exclusive Economic Zone (EEZ) 200 NM Limits',
        'High-Resolution Natural Earth & OpenStreetMap Marine',
        'IUCN Marine Protected Areas (MPA) Database'
      ],
      cadence: 'Official Institutional Geodatabase'
    }
  ];

  return (
    <section className="relative py-24 bg-[#F8FCFF] border-b border-[#E2EDF3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-4">
            <Database className="w-3.5 h-3.5 text-[#087EA4]" />
            <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
              Authoritative Ingestion
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-tight">
            Powered by Multi-Source Marine Intelligence.
          </h2>

          <p className="mt-4 text-base text-[#486581] leading-relaxed">
            POSEIDON eliminates single-sensor ambiguity by synthesizing spaceborne radar, maritime kinematics, and hydrodynamic ocean models into one continuous operational awareness picture.
          </p>
        </div>

        {/* 5 Source Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((src, i) => {
            const Icon = src.icon;
            return (
              <div
                key={src.category}
                className="bg-white border border-[#DCEBF2] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#087EA4]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E6F0F6]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#EEF8FC] flex items-center justify-center text-[#087EA4]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-[#071A2B]">
                          {src.category}
                        </span>
                        <div className="text-[11px] text-[#627D98] font-mono">
                          {src.type}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-[#486581] leading-relaxed">
                    {src.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    {src.feeds.map((feed, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-[#334E68]">
                        <CheckCircle2 className="w-3 h-3 text-[#087EA4] shrink-0" />
                        <span className="truncate">{feed}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E6F0F6] flex items-center justify-between text-[10px] font-mono text-[#627D98]">
                  <span>UPDATE FREQUENCY</span>
                  <span className="font-bold text-[#087EA4]">{src.cadence}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
