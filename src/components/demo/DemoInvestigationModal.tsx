import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { DEMO_SCENES } from './demoScript';

export const DemoInvestigationModal: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    demoInvestigation,
    startDemoInvestigation,
    stopDemoInvestigation,
    pauseDemoInvestigation,
    resumeDemoInvestigation,
    restartDemoInvestigation,
    nextDemoStep,
    prevDemoStep,
    goToDemoStep,
    setDemoSpeed,
    tickDemo,
  } = usePoseidonStore();

  const { isActive, isPlaying, currentStep, sceneProgress, speed, elapsedSeconds } =
    demoInvestigation;

  // Auto-tick demo loop
  useEffect(() => {
    if (!isActive || !isPlaying) return;

    const intervalMs = 100;
    const interval = setInterval(() => {
      tickDemo(intervalMs / 1000);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isActive, isPlaying, tickDemo]);

  if (!isActive) return null;

  const currentScene =
    DEMO_SCENES.find((s) => s.sceneIndex === currentStep) || DEMO_SCENES[0];

  const totalSceneDuration = currentScene.durationSeconds / speed;
  const currentSceneSeconds = Math.round(sceneProgress * totalSceneDuration);

  // Speed options
  const speeds: (0.5 | 1 | 1.5 | 2)[] = [0.5, 1, 1.5, 2];

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none select-none">
      <div
        className="rounded-sm border border-[#0F2538] bg-[#17324D]/95 text-white shadow-2xl backdrop-blur-md pointer-events-auto transition-all duration-300"
        style={{ borderRadius: '4px' }}
      >
        {/* Top Header Bar: Status Indicator, Title, Speed & Exit */}
        <div className="flex items-center justify-between border-b border-[#254F78] px-3.5 py-2">
          <div className="flex items-center gap-2.5">
            {/* Pulsing Recording Indicator */}
            <div className="flex items-center gap-1.5 rounded-xs bg-[#B91C1C] px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider text-white shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span>DEMO MODE</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
              <span className="font-bold text-white">{currentScene.stageNumber}:</span>
              <span className="text-[#93C5FD] font-semibold">{currentScene.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Multiplier Pill */}
            <div className="flex items-center rounded-xs bg-[#0F2538] p-0.5 border border-[#254F78] text-[10px] font-mono">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => setDemoSpeed(s)}
                  className={`rounded-xs px-1.5 py-0.2 transition ${
                    speed === s
                      ? 'bg-[#1769AA] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Run demonstration at ${s}x speed`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Minimize / Expand Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-xs p-1 text-slate-400 hover:text-white transition"
              title={collapsed ? 'Expand details' : 'Minimize to bar'}
            >
              {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>

            {/* Exit Demo Button */}
            <button
              onClick={stopDemoInvestigation}
              className="rounded-xs p-1 text-slate-400 hover:text-red-400 transition"
              title="Exit demonstration mode"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 9-Segment Discrete Progress Bar */}
        <div className="px-3.5 pt-2.5 pb-1">
          <div className="grid grid-cols-9 gap-1">
            {DEMO_SCENES.map((s) => {
              const isPast = s.sceneIndex < currentStep;
              const isCurrent = s.sceneIndex === currentStep;

              return (
                <button
                  key={s.sceneIndex}
                  onClick={() => goToDemoStep(s.sceneIndex)}
                  className="group flex flex-col text-left cursor-pointer"
                  title={`${s.stageNumber}: ${s.name}`}
                >
                  {/* Segment Bar */}
                  <div className="relative h-2 w-full overflow-hidden rounded-xs bg-[#0F2538] border border-[#254F78]">
                    {isPast && <div className="h-full w-full bg-[#10B981]" />}
                    {isCurrent && (
                      <div
                        className="h-full bg-[#38BDF8] transition-all duration-100"
                        style={{ width: `${Math.round(sceneProgress * 100)}%` }}
                      />
                    )}
                  </div>
                  {/* Segment Label */}
                  <span
                    className={`mt-1 truncate text-[9px] font-mono leading-none ${
                      isCurrent
                        ? 'font-bold text-[#38BDF8]'
                        : isPast
                        ? 'text-emerald-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {s.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expanded Details: Subtitle, Narrative, Controls */}
        {!collapsed && (
          <div className="px-3.5 pb-3 pt-2">
            <div>
              <h3 className="font-sans text-xs font-bold text-white tracking-tight">
                {currentScene.title}
              </h3>
              <div className="text-[11px] text-[#93C5FD] font-medium mt-0.5">
                {currentScene.subtitle}
              </div>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed font-sans">
                {currentScene.narrative}
              </p>
            </div>

            {/* Bottom Controls Row: Play/Pause, Step Back, Step Next, Restart */}
            <div className="mt-3 flex items-center justify-between border-t border-[#254F78] pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                {/* Play / Pause */}
                <button
                  onClick={isPlaying ? pauseDemoInvestigation : resumeDemoInvestigation}
                  className={`flex items-center gap-1.5 rounded-sm px-3 py-1 font-semibold text-xs transition shadow-xs ${
                    isPlaying
                      ? 'border border-[#F59E0B] bg-[#B45309] text-white hover:bg-[#D97706]'
                      : 'border border-[#0284C7] bg-[#0284C7] text-white hover:bg-[#0369A1]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Resume</span>
                    </>
                  )}
                </button>

                {/* Restart */}
                <button
                  onClick={restartDemoInvestigation}
                  className="flex items-center gap-1 rounded-sm border border-[#2F4F70] bg-[#1C3D5E] px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-[#254F78] hover:text-white transition"
                  title="Restart demo from beginning"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Restart</span>
                </button>
              </div>

              {/* Timing Display */}
              <div className="font-mono text-[11px] text-slate-300">
                <span>{currentSceneSeconds}s</span> / <span>{Math.round(totalSceneDuration)}s</span>{' '}
                <span className="text-slate-400">({speed}x)</span>
              </div>

              {/* Step Navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevDemoStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-0.5 rounded-sm border px-2 py-1 text-xs font-medium transition ${
                    currentStep === 1
                      ? 'border-[#2F4F70]/40 text-slate-500 cursor-not-allowed'
                      : 'border-[#2F4F70] bg-[#1C3D5E] text-slate-200 hover:bg-[#254F78] hover:text-white'
                  }`}
                  title="Previous scene"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </button>

                <button
                  onClick={nextDemoStep}
                  className="flex items-center gap-1 rounded-sm border border-[#1769AA] bg-[#1769AA] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#145C96] transition"
                  title={currentStep === DEMO_SCENES.length ? 'Finish demonstration' : 'Next scene'}
                >
                  <span>{currentStep === DEMO_SCENES.length ? 'Finish' : 'Next'}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
