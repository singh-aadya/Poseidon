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
    <footer className="relative z-30 flex h-13 w-full items-center justify-between border-t border-[#D1D5DB] bg-white px-4 text-xs text-gray-800 select-none shadow-xs">
      {/* Left: Standard Operational Playback Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => stepTimeline(-1)}
          title="Step backward 1 hour"
          className="flex h-7 items-center gap-1 rounded border border-[#D1D5DB] bg-white px-2 font-medium text-gray-700 hover:bg-gray-50 transition"
          style={{ borderRadius: '3px' }}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <button
          onClick={() => setTimelinePlaying(!isPlaying)}
          title={isPlaying ? 'Pause' : 'Play'}
          className={`flex h-7 items-center gap-1.5 rounded border px-3 font-semibold transition ${
            isPlaying
              ? 'border-[#B42318] bg-[#FEF2F2] text-[#B42318]'
              : 'border-[#1769AA] bg-[#1769AA] text-white hover:bg-[#145C96]'
          }`}
          style={{ borderRadius: '3px' }}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          onClick={() => stepTimeline(1)}
          title="Step forward 1 hour"
          className="flex h-7 items-center gap-1 rounded border border-[#D1D5DB] bg-white px-2 font-medium text-gray-700 hover:bg-gray-50 transition"
          style={{ borderRadius: '3px' }}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {/* Speed Multiplier Button */}
        <button
          onClick={() => {
            const nextSpeed =
              playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : playbackSpeed === 4 ? 8 : 1;
            setTimelineSpeed(nextSpeed as 1 | 2 | 4 | 8);
          }}
          className="ml-1 h-7 rounded border border-[#D1D5DB] bg-white px-2 text-[11px] font-mono text-gray-700 hover:bg-gray-50"
          style={{ borderRadius: '3px' }}
          title="Playback speed"
        >
          {playbackSpeed}x
        </button>
      </div>

      {/* Center: Clean Government Timeline Slider */}
      <div className="flex flex-1 max-w-xl mx-6 flex-col justify-center">
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
          <span className="font-mono">{formatUtcDateTime(startTime)}</span>
          <div className="flex items-center gap-1 font-semibold text-[#17324D] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E5E7EB]">
            <Clock className="h-3 w-3 text-[#1769AA]" />
            <span className="font-mono text-xs">{formatUtcDateTime(currentTime)}</span>
          </div>
          <span className="font-mono">Now ({formatUtcDateTime(endTime)})</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={progressPercent}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer accent-[#1769AA]"
          />
        </div>
      </div>

      {/* Right: Operational Lookback Range Presets */}
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-gray-500 mr-1 hidden sm:inline font-medium">
          Lookback:
        </span>
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset;
          return (
            <button
              key={preset}
              onClick={() => setTimelinePreset(preset)}
              className={`rounded px-2 py-1 text-[11px] font-semibold transition border ${
                isSelected
                  ? 'bg-[#17324D] text-white border-[#17324D]'
                  : 'bg-white text-gray-700 border-[#D1D5DB] hover:bg-gray-50'
              }`}
              style={{ borderRadius: '3px' }}
            >
              {preset}
            </button>
          );
        })}
      </div>
    </footer>
  );
};
