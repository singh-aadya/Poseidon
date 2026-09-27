import React, { useState } from 'react';
import { BarChart3, TrendingUp, Info } from 'lucide-react';
import { MonthBucket } from './analyticsUtils';

interface TemporalTrendsSectionProps {
  trends: MonthBucket[];
  selectedPeriod: string | null;
  onSelectPeriod: (period: string | null) => void;
}

export const TemporalTrendsSection: React.FC<TemporalTrendsSectionProps> = ({
  trends,
  selectedPeriod,
  onSelectPeriod,
}) => {
  const [hoveredBucket, setHoveredBucket] = useState<MonthBucket | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  if (trends.length === 0) {
    return (
      <div className="rounded-xs border border-[#CBD5E1] bg-white p-6 text-center text-xs text-[#64748B]">
        No temporal data available for current filter criteria.
      </div>
    );
  }

  // Calculate scales for Chart 1: Incidents Over Time
  const maxCount = Math.max(...trends.map((t) => t.count), 1);
  const chartHeight = 160;
  const chartWidth = 560;
  const paddingX = 40;
  const paddingY = 24;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const barWidth = Math.max(8, Math.min(28, (innerWidth / trends.length) * 0.7));
  const stepX = innerWidth / (trends.length || 1);

  // Calculate scales for Chart 2: Slick Area Over Time
  const maxArea = Math.max(...trends.map((t) => t.totalAreaKm2), 10);
  // Calculate rolling 3-month average
  const rollingArea = trends.map((_, idx, arr) => {
    const start = Math.max(0, idx - 2);
    const slice = arr.slice(start, idx + 1);
    const sum = slice.reduce((a, b) => a + b.totalAreaKm2, 0);
    return Math.round((sum / slice.length) * 10) / 10;
  });

  // Find peak event in trends
  let peakTrend = trends[0];
  trends.forEach((t) => {
    if (t.totalAreaKm2 > peakTrend.totalAreaKm2) peakTrend = t;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 select-none">
      {/* Chart 1: Incidents Over Time */}
      <div className="relative flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#17324D]" />
            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Incidents Over Time (Frequency by Confidence)
            </h2>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono">
            {selectedPeriod ? `Filtered: ${selectedPeriod}` : 'Click bar to filter'}
          </span>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-end gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-[#475569]">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#0284C7]" />
            High Conf (≥85%)
          </span>
          <span className="flex items-center gap-1 text-[#475569]">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#F59E0B]" />
            Medium (70–84%)
          </span>
          <span className="flex items-center gap-1 text-[#475569]">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#94A3B8]" />
            Low (&lt;70%)
          </span>
        </div>

        {/* Chart SVG */}
        <div className="relative mt-2 flex justify-center">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 overflow-visible"
          >
            {/* Gridlines */}
            {[0, 0.5, 1].map((pct, i) => {
              const y = paddingY + innerHeight * (1 - pct);
              const val = Math.round(maxCount * pct);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={pct === 0 ? '' : '3,3'}
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {trends.map((b, idx) => {
              const cx = paddingX + idx * stepX + stepX / 2;
              const isSelected = selectedPeriod === b.period;

              // Stacked heights
              const highH = (b.highCount / maxCount) * innerHeight;
              const medH = (b.medCount / maxCount) * innerHeight;
              const lowH = (b.lowCount / maxCount) * innerHeight;

              const baseY = paddingY + innerHeight;
              const highY = baseY - highH;
              const medY = highY - medH;
              const lowY = medY - lowH;

              return (
                <g
                  key={b.period}
                  className="cursor-pointer transition"
                  onClick={() => onSelectPeriod(isSelected ? null : b.period)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredBucket(b);
                    setHoverPos({ x: rect.left, y: rect.top });
                  }}
                  onMouseLeave={() => setHoveredBucket(null)}
                >
                  {/* Selection highlight background */}
                  {isSelected && (
                    <rect
                      x={cx - barWidth / 2 - 4}
                      y={paddingY}
                      width={barWidth + 8}
                      height={innerHeight}
                      fill="#E0F2FE"
                      rx="2"
                    />
                  )}

                  {/* High segment */}
                  {highH > 0 && (
                    <rect
                      x={cx - barWidth / 2}
                      y={highY}
                      width={barWidth}
                      height={highH}
                      fill="#0284C7"
                      className="hover:opacity-90"
                    />
                  )}
                  {/* Med segment */}
                  {medH > 0 && (
                    <rect
                      x={cx - barWidth / 2}
                      y={medY}
                      width={barWidth}
                      height={medH}
                      fill="#F59E0B"
                      className="hover:opacity-90"
                    />
                  )}
                  {/* Low segment */}
                  {lowH > 0 && (
                    <rect
                      x={cx - barWidth / 2}
                      y={lowY}
                      width={barWidth}
                      height={lowH}
                      fill="#94A3B8"
                      className="hover:opacity-90"
                    />
                  )}

                  {/* X Axis Label */}
                  <text
                    x={cx}
                    y={chartHeight - 4}
                    fill={isSelected ? '#0284C7' : '#64748B'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {b.label.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip */}
          {hoveredBucket && (
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 z-30 rounded-xs border border-[#17324D] bg-[#0F2538] p-2 text-white shadow-xl text-[11px] font-sans">
              <div className="font-bold text-white border-b border-[#254F78] pb-1">
                {hoveredBucket.label}
              </div>
              <div className="mt-1 flex items-center justify-between gap-3 text-slate-300">
                <span>Total Incidents:</span>
                <span className="font-mono font-bold text-white">{hoveredBucket.count}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span>Total Detected Area:</span>
                <span className="font-mono text-[#38BDF8]">{hoveredBucket.totalAreaKm2} km²</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span>Dominant Region:</span>
                <span className="font-medium text-amber-300">{hoveredBucket.dominantRegion}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Detected Slick Area Over Time */}
      <div className="relative flex flex-col rounded-xs border border-[#CBD5E1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#0284C7]" />
            <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-[#17324D]">
              Detected Slick Area Over Time (km²)
            </h2>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono">
            Peak: {peakTrend.totalAreaKm2} km² ({peakTrend.label})
          </span>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-end gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-[#475569]">
            <span className="h-0.5 w-4 bg-[#0284C7]" />
            Monthly Area (km²)
          </span>
          <span className="flex items-center gap-1 text-[#64748B]">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-[#F59E0B]" />
            Rolling 3-Mo Avg
          </span>
        </div>

        {/* Line & Area Chart SVG */}
        <div className="relative mt-2 flex justify-center">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 overflow-visible"
          >
            {/* Gridlines */}
            {[0, 0.5, 1].map((pct, i) => {
              const y = paddingY + innerHeight * (1 - pct);
              const val = Math.round(maxArea * pct);
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={pct === 0 ? '' : '3,3'}
                  />
                  <text
                    x={paddingX - 6}
                    y={y + 3}
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area fill path */}
            {(() => {
              if (trends.length < 2) return null;
              const points = trends.map((t, idx) => {
                const x = paddingX + idx * stepX + stepX / 2;
                const y = paddingY + innerHeight * (1 - t.totalAreaKm2 / maxArea);
                return `${x},${y}`;
              });
              const firstX = paddingX + stepX / 2;
              const lastX = paddingX + (trends.length - 1) * stepX + stepX / 2;
              const baseY = paddingY + innerHeight;
              const areaD = `M ${firstX},${baseY} L ${points.join(' L ')} L ${lastX},${baseY} Z`;
              const lineD = `M ${points.join(' L ')}`;

              // Rolling line points
              const rollingPoints = rollingArea.map((val, idx) => {
                const x = paddingX + idx * stepX + stepX / 2;
                const y = paddingY + innerHeight * (1 - val / maxArea);
                return `${x},${y}`;
              });
              const rollingLineD = `M ${rollingPoints.join(' L ')}`;

              return (
                <g>
                  {/* Translucent area fill */}
                  <path d={areaD} fill="#BAE6FD" fillOpacity="0.4" />
                  {/* Monthly line */}
                  <path d={lineD} fill="none" stroke="#0284C7" strokeWidth="2" />
                  {/* Rolling 3-mo line */}
                  <path
                    d={rollingLineD}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1.8"
                    strokeDasharray="4,4"
                  />

                  {/* Data points */}
                  {trends.map((t, idx) => {
                    const x = paddingX + idx * stepX + stepX / 2;
                    const y = paddingY + innerHeight * (1 - t.totalAreaKm2 / maxArea);
                    const isPeak = t.period === peakTrend.period;

                    return (
                      <g key={t.period}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isPeak ? 4.5 : 3}
                          fill={isPeak ? '#EF4444' : '#0284C7'}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                        {/* Peak Annotation */}
                        {isPeak && (
                          <g>
                            <rect
                              x={x - 42}
                              y={y - 20}
                              width={84}
                              height={15}
                              fill="#17324D"
                              rx="2"
                            />
                            <text
                              x={x}
                              y={y - 9}
                              fill="#FFFFFF"
                              fontSize="8"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              PEAK: {t.totalAreaKm2} km²
                            </text>
                          </g>
                        )}
                        {/* X Axis Label */}
                        <text
                          x={x}
                          y={chartHeight - 4}
                          fill="#64748B"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {t.label.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}
          </svg>
        </div>
      </div>
    </div>
  );
};
