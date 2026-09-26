import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Compass, Ship, Orbit, Waves, CheckCircle2 } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';

export const CopilotDrawer: React.FC = () => {
  const {
    copilotOpen,
    setCopilotOpen,
    copilotMessages,
    sendCopilotMessage,
    executeCopilotAction,
    getActiveIncident,
  } = usePoseidonStore();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeInc = getActiveIncident();

  useEffect(() => {
    if (copilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, copilotOpen]);

  if (!copilotOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendCopilotMessage(inputVal.trim());
    setInputVal('');
  };

  const handleChipClick = (actionType: string, payload?: any) => {
    executeCopilotAction(actionType, payload);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-84 sm:w-96 flex-col border-l border-slate-300 bg-white shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-[#17324D] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-cyan-600 text-white shadow-xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-sans text-xs font-bold tracking-tight">POSEIDON Investigation Copilot</h2>
            <div className="text-[10px] text-cyan-200 font-mono">Institutional Decision Support</div>
          </div>
        </div>
        <button
          onClick={() => setCopilotOpen(false)}
          className="rounded-xs p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
          aria-label="Close copilot"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Incident Context Ribbon */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] text-slate-600">
        <span>Context: <strong className="font-mono text-slate-800">{activeInc.id}</strong></span>
        <span className="text-[10px] text-slate-500 font-mono">DEMO / SIMULATED</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {copilotMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                {isUser ? (
                  <>
                    <span>You</span>
                    <User className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    <Bot className="h-3 w-3 text-cyan-700" />
                    <span>Poseidon Intelligence AI</span>
                  </>
                )}
                <span>• {msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[90%] rounded-sm p-2.5 text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#1769AA] text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-800'
                }`}
              >
                {msg.text}
              </div>

              {/* Action Chips */}
              {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 max-w-[95%]">
                  {msg.suggestedActions.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(chip.actionType, chip.payload)}
                      className="flex items-center gap-1 rounded-xs border border-blue-300 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-[#1769AA] hover:bg-blue-100 hover:border-blue-400 transition shadow-2xs"
                    >
                      <Sparkles className="h-3 w-3 text-[#1769AA]" />
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Starters */}
      <div className="border-t border-slate-100 bg-slate-50 px-3 py-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
          Quick queries
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <button
            onClick={() => sendCopilotMessage('What vessel is the prime candidate and why?')}
            className="whitespace-nowrap rounded-xs border border-slate-300 bg-white px-2 py-0.5 text-slate-700 hover:bg-slate-100 transition"
          >
            Vessel attribution rationale?
          </button>
          <button
            onClick={() => sendCopilotMessage('Where was the reconstructed origin of the spill?')}
            className="whitespace-nowrap rounded-xs border border-slate-300 bg-white px-2 py-0.5 text-slate-700 hover:bg-slate-100 transition"
          >
            Origin location & error?
          </button>
          <button
            onClick={() => sendCopilotMessage('What is the shoreline impact probability in 48h?')}
            className="whitespace-nowrap rounded-xs border border-slate-300 bg-white px-2 py-0.5 text-slate-700 hover:bg-slate-100 transition"
          >
            Shoreline risk?
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Copilot about slick, AIS, or forecast..."
            className="flex-1 rounded-sm border border-slate-300 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1769AA] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#17324D] text-white hover:bg-[#1f4060] disabled:opacity-40 transition"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
