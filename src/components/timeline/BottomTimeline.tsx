import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { formatUtcDateTime } from '../../utils/formatting';

export const BottomTimeline: React.FC = () => {
  const {
    timeline,
    setTimelinePlaying,
    setTimelineCurrentTime,
    setTimelineSpeed,
    setTimelinePreset,
    stepTimeline,
  } = usePoseidonStore();

  const {
    currentTime,
    startTime,
    endTime,
    isPlaying,
    playbackSpeed,
    selectedPreset,
  } = timeline;

  // Auto-playback effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      stepTimeline(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, stepTimeline]);

  const totalDuration = endTime.getTime() - startTime.getTime();
  const currentElapsed = currentTime.getTime() - startTime.getTime();
  const progressPercent = Math.min(
    100,
    Math.max(0, (currentElapsed / (totalDuration || 1)) * 100)
  );

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseFloat(e.target.value);
    const newTimeMs = startTime.getTime() + (pct / 100) * totalDuration;
    setTimelineCurrentTime(new Date(newTimeMs));
  };

  const presets: ('6h' | '12h' | '24h' | '48h' | '7d')[] = [
    '6h',
    '12h',
    '24h',
    '48h',
    '7d',
  ];

  return (
    <footer className="relative z-30 flex h-9.5 w-full items-center justify-between border-t border-[#D1D5DB] bg-white px-3 text-xs text-gray-800 select-none shadow-xs">
      {/* Left: Compact Playback Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => stepTimeline(-1)}
          title="Step backward 1 hour"
          className="flex h-6.5 items-center gap-0.5 rounded-sm border border-[#D1D5DB] bg-white px-1.5 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <ChevronLeft className="h-3 w-3" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button
          onClick={() => setTimelinePlaying(!isPlaying)}
          title={isPlaying ? 'Pause' : 'Play'}
          className={`flex h-6.5 items-center gap-1 rounded-sm border px-2.5 text-[11px] font-semibold transition ${
            isPlaying
              ? 'border-[#B42318] bg-[#FEF2F2] text-[#B42318]'
              : 'border-[#1769AA] bg-[#1769AA] text-white hover:bg-[#145C96]'
          }`}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={() => stepTimeline(1)}
          title="Step forward 1 hour"
          className="flex h-6.5 items-center gap-0.5 rounded-sm border border-[#D1D5DB] bg-white px-1.5 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3 w-3" />
        </button>

        {/* Playback Speed Multiplier */}
        <button
          onClick={() => {
            const nextSpeed =
              playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : playbackSpeed === 4 ? 8 : 1;
            setTimelineSpeed(nextSpeed as 1 | 2 | 4 | 8);
          }}
          className="h-6.5 rounded-sm border border-[#D1D5DB] bg-white px-1.5 text-[10px] font-mono text-gray-700 hover:bg-gray-50"
          title="Playback speed"
        >
          {playbackSpeed}x
        </button>
      </div>

      {/* Center: Thin Single-Row Timeline */}
      <div className="flex flex-1 max-w-2xl mx-4 items-center gap-2.5">
        <span className="font-mono text-[10px] text-gray-500 whitespace-nowrap shrink-0">
          {formatUtcDateTime(startTime).slice(5, 16)}
        </span>

        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={progressPercent}
            onChange={handleSliderChange}
            className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-[#1769AA]"
          />
        </div>

        <span className="font-mono text-[10px] text-gray-500 whitespace-nowrap shrink-0">
          {formatUtcDateTime(endTime).slice(5, 16)}
        </span>

        {/* Current Active Timestamp Pill */}
        <div className="hidden md:flex items-center gap-1 font-semibold text-[#17324D] bg-[#F8FAFC] px-2 py-0.5 rounded-sm border border-[#E5E7EB] shrink-0">
          <Clock className="h-2.5 w-2.5 text-[#1769AA]" />
          <span className="font-mono text-[10px]">{formatUtcDateTime(currentTime).slice(5, 16)} UTC</span>
        </div>
      </div>

      {/* Right: Lookback Range Presets */}
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-[10px] text-gray-500 mr-0.5 hidden sm:inline font-medium">
          Lookback:
        </span>
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset;
          return (
            <button
              key={preset}
              onClick={() => setTimelinePreset(preset)}
              className={`rounded-sm px-1.5 py-0.5 text-[10px] font-semibold transition border ${
                isSelected
                  ? 'bg-[#17324D] text-white border-[#17324D]'
                  : 'bg-white text-gray-700 border-[#D1D5DB] hover:bg-gray-50'
              }`}
            >
              {preset}
            </button>
          );
        })}
      </div>
    </footer>
  );
};
