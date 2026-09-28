import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  PieChart, 
  Calendar, 
  ArrowRight,
  Database,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface HistoricalAnalyticsSectionProps {
  onExploreAnalytics: () => void;
}

export const HistoricalAnalyticsSection: React.FC<HistoricalAnalyticsSectionProps> = ({ onExploreAnalytics }) => {
  const regions = [
    { name: 'Mumbai High Offshore Oil Field', pct: 42, color: '#087EA4', incidents: 38 },
    { name: 'Gulf of Khambhat Industrial Sector', pct: 28, color: '#38BDF8', incidents: 25 },
    { name: 'Cochin International Shipping Route', pct: 18, color: '#64748B', incidents: 16 },
    { name: 'Bay of Bengal Deepwater Corridors', pct: 12, color: '#94A3B8', incidents: 11 }
  ];

  const historicalMonths = [
    { month: 'OCT', count: 6, area: 14.2 },
    { month: 'NOV', count: 9, area: 22.8 },
    { month: 'DEC', count: 12, area: 31.4 },
    { month: 'JAN', count: 8, area: 19.5 },
    { month: 'FEB', count: 14, area: 38.2 },
    { month: 'MAR', count: 18, area: 46.8 },
    { month: 'APR', count: 15, area: 39.1 },
    { month: 'MAY', count: 21, area: 54.0 },
    { month: 'JUN', count: 11, area: 28.6 },
    { month: 'JUL', count: 7, area: 18.2 },
    { month: 'AUG', count: 9, area: 24.1 },
    { month: 'SEP', count: 16, area: 41.5 }
  ];

  return (
    <section id="history-analytics" className="relative py-28 bg-[#F8FCFF] border-b border-[#E2EDF3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8FC] border border-[#D5EBF5] mb-4">
              <BarChart3 className="w-3.5 h-3.5 text-[#087EA4]" />
              <span className="text-[11px] font-mono tracking-wider font-semibold text-[#087EA4] uppercase">
                Longitudinal Intelligence
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071A2B] tracking-tight leading-tight">
              See the Pattern Behind the Incident.
            </h2>

            <p className="mt-4 text-base text-[#486581] leading-relaxed">
              Multi-year Sentinel-1 SAR surveillance reveals spatial clustering, recurring discharge hot-spots, and maritime flag-state compliance profiles across Exclusive Economic Zones.
            </p>
          </div>

          <button
            onClick={onExploreAnalytics}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#071A2B] hover:bg-[#0B253D] text-white text-xs font-semibold tracking-wide transition-all shadow-md group shrink-0 self-start md:self-auto"
          >
            <span>EXPLORE HISTORY & ANALYTICS</span>
            <ArrowRight className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Scientific Metric Callouts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-[#DCEBF2] rounded-xl p-5 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-[#627D98] tracking-wider">
              TOTAL AREA MONITORED
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#071A2B] mt-1">
              1,420,000 <span className="text-xs text-[#087EA4]">km²</span>
            </div>
            <div className="text-xs text-[#627D98] mt-1 font-mono">
              Indian EEZ & Adjacent High Seas
            </div>
          </div>

          <div className="bg-white border border-[#DCEBF2] rounded-xl p-5 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-[#627D98] tracking-wider">
              ANALYZED SAR PASSES
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#071A2B] mt-1">
              1,842 <span className="text-xs text-[#087EA4]">Scenes</span>
            </div>
            <div className="text-xs text-[#627D98] mt-1 font-mono">
              Sentinel-1 C-SAR IW & EW Modes
            </div>
          </div>

          <div className="bg-white border border-[#DCEBF2] rounded-xl p-5 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-[#627D98] tracking-wider">
              ATTRIBUTED CORRELATIONS
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#071A2B] mt-1">
              78.4%
            </div>
            <div className="text-xs text-[#627D98] mt-1 font-mono">
              Vessels intersecting origin bounds
            </div>
          </div>

          <div className="bg-white border border-[#DCEBF2] rounded-xl p-5 shadow-sm">
            <div className="text-[10px] font-mono uppercase text-[#627D98] tracking-wider">
              MEAN DETECTION TIME
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#071A2B] mt-1">
              42 <span className="text-xs text-[#087EA4]">Mins</span>
            </div>
            <div className="text-xs text-[#627D98] mt-1 font-mono">
              From Copernicus downlink to alert
            </div>
          </div>
        </div>

        {/* 2-Column Scientific Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Chart: Monthly Detections Histogram (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#DCEBF2] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6F0F6]">
              <div>
                <h3 className="text-sm font-bold text-[#071A2B]">
                  Incidents & Slick Area Over Time
                </h3>
                <div className="text-xs font-mono text-[#627D98] mt-0.5">
                  Monthly frequency & cumulative surface area (km²)
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-[#071A2B]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#087EA4]" /> Incidents
                </span>
                <span className="flex items-center gap-1.5 text-[#627D98]">
                  <span className="w-2.5 h-0.5 bg-[#38BDF8]" /> Area (km²)
                </span>
              </div>
            </div>

            {/* Scientific Bar Chart */}
            <div className="h-60 mt-6 flex items-end justify-between gap-1.5 sm:gap-2 px-2">
              {historicalMonths.map((item, i) => {
                const heightPct = (item.count / 24) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[9px] font-mono text-[#627D98] opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </div>
                    <div className="w-full bg-[#EEF8FC] rounded-t-sm h-48 flex items-end justify-center overflow-hidden">
                      <div
                        className="w-full bg-[#087EA4] group-hover:bg-[#076B8C] transition-all rounded-t-sm"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-medium text-[#627D98]">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E6F0F6] flex items-center justify-between text-[11px] font-mono text-[#627D98]">
              <span>Annual Monsoonal Surge: May - Sept</span>
              <span className="text-[#087EA4] font-medium">Correlation: High Tanker Transit Volume</span>
            </div>
          </div>

          {/* Right Chart: Regional Geographic Distribution (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#DCEBF2] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E6F0F6]">
                <div>
                  <h3 className="text-sm font-bold text-[#071A2B]">
                    Regional Geographic Distribution
                  </h3>
                  <div className="text-xs font-mono text-[#627D98] mt-0.5">
                    Proportion of detected discharges by maritime sector
                  </div>
                </div>
                <MapPin className="w-4 h-4 text-[#087EA4]" />
              </div>

              <div className="mt-6 space-y-4">
                {regions.map((region, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-[#071A2B] truncate max-w-[220px]">
                        {region.name}
                      </span>
                      <span className="font-bold text-[#087EA4]">
                        {region.pct}% ({region.incidents})
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#EEF8FC] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${region.pct}%`,
                          backgroundColor: region.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inset Note */}
            <div className="mt-6 p-3.5 rounded-xl bg-[#F8FCFF] border border-[#DCEBF2] text-xs text-[#486581] leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#087EA4] shrink-0 mt-0.5" />
              <span>
                All historical incidents preserve full raw sensor telemetry, model parameter checkpoints, and spatial vector boundaries for longitudinal compliance studies.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
