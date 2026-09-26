import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
} from 'lucide-react';
import { usePoseidonStore, DEMO_STEPS } from '../../store/usePoseidonStore';

export const DemoInvestigationModal: React.FC = () => {
  const {
    demoInvestigation,
    nextDemoStep,
    prevDemoStep,
    goToDemoStep,
    stopDemoInvestigation,
  } = usePoseidonStore();

  if (!demoInvestigation.isActive) return null;

  const currentStep = DEMO_STEPS.find(
    (s) => s.stepIndex === demoInvestigation.currentStep
  ) || DEMO_STEPS[0];

  return (
    <div
      style={{ pointerEvents: 'none' }}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4 pointer-events-none"
    >
      <div
        className="rounded border border-[#0F2538] bg-[#17324D] p-3.5 shadow-md text-white pointer-events-auto"
        style={{ borderRadius: '4px', pointerEvents: 'auto' }}
      >
        {/* Header with Step Numbers */}
        <div className="flex items-center justify-between pb-2 border-b border-[#2A4B6D]">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#102438] text-white font-mono text-[11px] font-bold">
              {currentStep.stepIndex}
            </span>
            <span className="text-xs font-semibold text-white">
              Demonstration walkthrough
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Step markers */}
            <div className="flex items-center gap-1">
              {DEMO_STEPS.map((s) => (
                <button
                  key={s.stepIndex}
                  onClick={() => goToDemoStep(s.stepIndex)}
                  className={`h-2 rounded transition-all ${
                    s.stepIndex === currentStep.stepIndex
                      ? 'w-4 bg-white'
                      : s.stepIndex < currentStep.stepIndex
                      ? 'w-2 bg-[#287D3C]'
                      : 'w-2 bg-[#2A4B6D]'
                  }`}
                  title={s.title}
                />
              ))}
            </div>

            <button
              onClick={stopDemoInvestigation}
              title="Close demonstration"
              className="text-slate-300 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-2.5 space-y-1">
          <div className="text-[11px] font-semibold text-[#93C5FD]">
            {currentStep.title}
          </div>
          <h3 className="text-sm font-bold text-white">
            {currentStep.subtitle}
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed pt-0.5">
            {currentStep.description}
          </p>
        </div>

        {/* Controls */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#2A4B6D]">
          <button
            onClick={prevDemoStep}
            disabled={currentStep.stepIndex === 1}
            className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium transition ${
              currentStep.stepIndex === 1
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'bg-[#1C3D5E] border border-[#2F4F70] text-white hover:bg-[#254F78]'
            }`}
            style={{ borderRadius: '3px' }}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-[11px] text-slate-300 font-mono">
            Step {currentStep.stepIndex} of {DEMO_STEPS.length}
          </span>

          <button
            onClick={nextDemoStep}
            className="flex items-center gap-1 rounded bg-[#1769AA] border border-[#13588F] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#145C96] transition shadow-xs"
            style={{ borderRadius: '3px' }}
          >
            <span>
              {currentStep.stepIndex === DEMO_STEPS.length ? 'Finish' : 'Next step'}
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
