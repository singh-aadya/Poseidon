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
    demoInvestigation,
    pauseDemoInvestigation,
    resumeDemoInvestigation,
    nextDemoStep,
    prevDemoStep,
    setDemoSpeed,
  } = usePoseidonStore();

  const {
    currentTime,
    startTime,
    endTime,
    isPlaying,
    playbackSpeed,
    selectedPreset,
  } = timeline;

  const isDemoActive = demoInvestigation.isActive;
  const isDemoPlaying = demoInvestigation.isPlaying;

  // Auto-playback effect (for normal timeline mode when demo is off)
  useEffect(() => {
    if (!isPlaying || isDemoActive) return;

    const interval = setInterval(() => {
      stepTimeline(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isDemoActive, stepTimeline]);

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
    <footer className="relative z-30 flex h-9.5 w-full max-w-full overflow-hidden items-center border-t border-[#D1D5DB] bg-white px-2 sm:px-3 text-xs text-gray-800 select-none shadow-xs box-border min-w-0">
      <div className="flex items-center justify-between w-full gap-1.5 sm:gap-2 min-w-0">
        {/* Left: Compact Playback Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <button
            onClick={isDemoActive ? prevDemoStep : () => stepTimeline(-1)}
            disabled={isDemoActive && demoInvestigation.currentStep === 1}
            title={isDemoActive ? 'Previous demo scene' : 'Step backward 1 hour'}
            className="flex h-6.5 items-center gap-0.5 rounded-sm border border-[#D1D5DB] bg-white px-1 sm:px-1.5 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="h-3 w-3" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={() => {
              if (isDemoActive) {
                if (isDemoPlaying) pauseDemoInvestigation();
                else resumeDemoInvestigation();
              } else {
                setTimelinePlaying(!isPlaying);
              }
            }}
            title={(isDemoActive ? isDemoPlaying : isPlaying) ? 'Pause' : 'Play'}
            className={`flex h-6.5 items-center gap-1 rounded-sm border px-2 sm:px-2.5 text-[11px] font-semibold transition cursor-pointer ${
              (isDemoActive ? isDemoPlaying : isPlaying)
                ? 'border-[#B42318] bg-[#FEF2F2] text-[#B42318]'
                : 'border-[#1769AA] bg-[#1769AA] text-white hover:bg-[#145C96]'
            }`}
          >
            {(isDemoActive ? isDemoPlaying : isPlaying) ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3 fill-current" />
            )}
            <span className="hidden sm:inline">{(isDemoActive ? isDemoPlaying : isPlaying) ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={isDemoActive ? nextDemoStep : () => stepTimeline(1)}
            title={isDemoActive ? 'Next demo scene' : 'Step forward 1 hour'}
            className="flex h-6.5 items-center gap-0.5 rounded-sm border border-[#D1D5DB] bg-white px-1 sm:px-1.5 text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3 w-3" />
          </button>

          {/* Playback Speed Multiplier */}
          <button
            onClick={() => {
              if (isDemoActive) {
                const nextSpeed =
                  demoInvestigation.speed === 0.5
                    ? 1
                    : demoInvestigation.speed === 1
                    ? 1.5
                    : demoInvestigation.speed === 1.5
                    ? 2
                    : 0.5;
                setDemoSpeed(nextSpeed as 0.5 | 1 | 1.5 | 2);
              } else {
                const nextSpeed =
                  playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : playbackSpeed === 4 ? 8 : 1;
                setTimelineSpeed(nextSpeed as 1 | 2 | 4 | 8);
              }
            }}
            className="h-6.5 rounded-sm border border-[#D1D5DB] bg-white px-1 sm:px-1.5 text-[10px] font-mono text-gray-700 hover:bg-gray-50 cursor-pointer shrink-0"
            title="Playback speed"
          >
            {isDemoActive ? `${demoInvestigation.speed}x` : `${playbackSpeed}x`}
          </button>
        </div>

        {/* Center: Single-Row Timeline with Demo Mode synchronization */}
        <div className="flex flex-1 max-w-2xl mx-1 sm:mx-3 items-center gap-1.5 sm:gap-2.5 min-w-0">
          {isDemoActive ? (
            <div className="flex-1 flex items-center justify-between bg-[#F0FDF4] border border-[#BBF7D0] px-2 sm:px-3 py-1 rounded-sm text-xs truncate">
              <div className="flex items-center gap-1.5 font-mono text-[11px] truncate">
                <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
                <span className="font-bold text-[#166534] shrink-0">
                  STAGE {demoInvestigation.currentStep}/9
                </span>
                <span className="text-[#15803D] hidden sm:inline truncate">
                  — {formatUtcDateTime(currentTime).slice(5, 16)} UTC
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#166534] shrink-0">
                {Math.round(demoInvestigation.sceneProgress * 100)}%
              </div>
            </div>
          ) : (
            <>
              <span className="font-mono text-[9px] sm:text-[10px] text-gray-500 whitespace-nowrap shrink-0 hidden sm:inline">
                {formatUtcDateTime(startTime).slice(5, 16)}
              </span>

              <div className="relative flex-1 flex items-center min-w-[60px]">
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

              {/* Current Active Timestamp Pill */}
              <div className="flex items-center gap-1 font-semibold text-[#17324D] bg-[#F8FAFC] px-1.5 py-0.5 rounded-sm border border-[#E5E7EB] shrink-0">
                <Clock className="h-2.5 w-2.5 text-[#1769AA] hidden sm:inline" />
                <span className="font-mono text-[9px] sm:text-[10px]">
                  {formatUtcDateTime(currentTime).slice(11, 16)} UTC
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right: Lookback Range Presets (Visible on md and up) */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-gray-500 mr-0.5 hidden lg:inline font-medium">
            Lookback:
          </span>
          {presets.map((preset) => {
            const isSelected = selectedPreset === preset;
            return (
              <button
                key={preset}
                onClick={() => setTimelinePreset(preset)}
                className={`rounded-sm px-1.5 py-0.5 text-[10px] font-semibold transition border cursor-pointer ${
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
      </div>
    </footer>
  );
};
