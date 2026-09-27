import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  History,
  ArrowRight,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { ResponseWorkflowStage } from '../../types/rbac';

export const AssignIncidentModal: React.FC = () => {
  const {
    assignIncidentModalIncidentId,
    setAssignIncidentModalIncidentId,
    assignments,
    assignIncident,
    addIncidentResponseNote,
    updateIncidentWorkflowStage,
    currentUser,
    incidents,
  } = usePoseidonStore();

  const [selectedTeam, setSelectedTeam] = useState('USCG Gulf Strike Team');
  const [selectedResponder, setSelectedResponder] = useState('Cmdr. James Miller');
  const [escalationLevel, setEscalationLevel] = useState<'MONITORING' | 'ADVISORY' | 'CRITICAL RESPONSE'>('CRITICAL RESPONSE');
  const [newNote, setNewNote] = useState('');

  if (!assignIncidentModalIncidentId) return null;

  const incident = incidents.find((i) => i.id === assignIncidentModalIncidentId);
  const currentAssignment = assignments[assignIncidentModalIncidentId] || {
    incidentId: assignIncidentModalIncidentId,
    assignedTeam: 'USCG Gulf Strike Team',
    assignedResponder: 'Cmdr. James Miller',
    assignedBy: 'System Auto-Dispatcher',
    assignedAt: new Date().toISOString(),
    escalationLevel: 'CRITICAL RESPONSE',
    workflowStage: 'Assigned' as ResponseWorkflowStage,
    responseNotes: [],
  };

  const workflowStages: ResponseWorkflowStage[] = [
    'Detection',
    'Alert',
    'Assigned',
    'Acknowledged',
    'Investigating',
    'Responding',
    'Resolved',
  ];

  const currentStageIndex = workflowStages.indexOf(currentAssignment.workflowStage);

  const availableTeams = [
    'USCG Gulf Strike Team',
    'NOAA HAZMAT Scientific Support',
    'Copernicus Marine Rapid Response',
    'EPA Region 6 Response Center',
    'Clean Gulf Associates (Industry Co-op)',
  ];

  const availableResponders: Record<string, string[]> = {
    'USCG Gulf Strike Team': ['Cmdr. James Miller', 'Lt. Marcus Brody', 'Duty Officer Sector NOLA'],
    'NOAA HAZMAT Scientific Support': ['Dr. Elena Vance', 'Dr. Aris Thorne', 'Regional Scientific Coordinator'],
    'Copernicus Marine Rapid Response': ['Dr. Simon Wright', 'Analyst Marine Unit 3'],
    'EPA Region 6 Response Center': ['On-Scene Coordinator (OSC)', 'Enforcement Lead TX/LA'],
    'Clean Gulf Associates (Industry Co-op)': ['Rapid Boom Task Force Lead', 'Skimmer Ops Dispatch'],
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    assignIncident(
      assignIncidentModalIncidentId,
      selectedTeam,
      selectedResponder,
      escalationLevel,
      newNote.trim() ? newNote : undefined
    );
    setNewNote('');
    setAssignIncidentModalIncidentId(null);
  };

  const handleAddNoteOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addIncidentResponseNote(assignIncidentModalIncidentId, newNote.trim());
    setNewNote('');
  };

  const handleStageClick = (stage: ResponseWorkflowStage) => {
    updateIncidentWorkflowStage(assignIncidentModalIncidentId, stage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl border border-slate-300 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-50 duration-150 box-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0F2538] bg-[#17324D] px-4 py-3 text-white shrink-0">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-sky-400" />
            <div>
              <h2 className="font-sans text-sm font-bold tracking-tight">
                Incident Response Tasking & Workflow
              </h2>
              <p className="text-[10px] text-slate-300">
                {incident?.name || assignIncidentModalIncidentId} ({assignIncidentModalIncidentId})
              </p>
            </div>
          </div>
          <button
            onClick={() => setAssignIncidentModalIncidentId(null)}
            className="rounded-xs p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Workflow Stage Tracker: Detection → Alert → Assigned → Acknowledged → Investigating → Responding → Resolved */}
          <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Operational Workflow Status Engine</span>
              <span className="font-mono text-[#17324D] font-bold">STAGE: {currentAssignment.workflowStage.toUpperCase()}</span>
            </div>

            <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1 gap-1">
              {workflowStages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = stage === currentAssignment.workflowStage;
                return (
                  <button
                    key={stage}
                    onClick={() => handleStageClick(stage)}
                    title={`Click to set stage to ${stage}`}
                    className={`flex flex-col items-center flex-1 min-w-[70px] p-1.5 rounded-xs transition text-center ${
                      isCurrent
                        ? 'bg-[#17324D] text-white font-bold shadow-xs'
                        : isPassed
                        ? 'bg-blue-100/80 text-blue-900 hover:bg-blue-200'
                        : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-[9px] font-mono">0{idx + 1}</div>
                    <div className="text-[10px] truncate max-w-full">{stage}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form to Assign Team & Responder */}
          <form onSubmit={handleSaveAssignment} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Responsible Team / Agency
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    const defaultResp = availableResponders[e.target.value]?.[0] || 'Duty Officer';
                    setSelectedResponder(defaultResp);
                  }}
                  className="w-full rounded-xs border border-slate-300 bg-white p-2 text-xs focus:border-[#17324D] focus:outline-hidden"
                >
                  {availableTeams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Designated Individual Responder
                </label>
                <select
                  value={selectedResponder}
                  onChange={(e) => setSelectedResponder(e.target.value)}
                  className="w-full rounded-xs border border-slate-300 bg-white p-2 text-xs focus:border-[#17324D] focus:outline-hidden"
                >
                  {(availableResponders[selectedTeam] || ['Duty Officer']).map((resp) => (
                    <option key={resp} value={resp}>
                      {resp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Escalation Level */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Escalation Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['MONITORING', 'ADVISORY', 'CRITICAL RESPONSE'] as const).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setEscalationLevel(lvl)}
                    className={`py-1.5 px-2 rounded-xs border text-center font-bold text-[10px] transition ${
                      escalationLevel === lvl
                        ? lvl === 'CRITICAL RESPONSE'
                          ? 'bg-[#B42318] border-[#912018] text-white shadow-xs'
                          : lvl === 'ADVISORY'
                          ? 'bg-[#C47A00] border-[#995E00] text-white shadow-xs'
                          : 'bg-[#1769AA] border-[#13588F] text-white shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Note input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Operational Tasking / Response Note
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log operational directives (e.g., aerial flyover dispatch, boom containment coordinates, shoreline notification)..."
                rows={2}
                className="w-full rounded-xs border border-slate-300 bg-white p-2 text-xs focus:border-[#17324D] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleAddNoteOnly}
                disabled={!newNote.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xs border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 disabled:opacity-50 transition"
              >
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                <span>Add Note Only</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xs bg-[#17324D] text-white text-xs font-bold hover:bg-[#1C3D5E] transition"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Update Tasking & Escalation</span>
              </button>
            </div>
          </form>

          {/* Activity & Note History */}
          <div className="border-t border-slate-200 pt-3">
            <h3 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-slate-500" />
              <span>Response Activity & Chronological Log</span>
            </h3>

            <div className="space-y-2 max-h-44 overflow-y-auto">
              {currentAssignment.responseNotes.length === 0 ? (
                <div className="text-slate-500 text-[11px] italic bg-slate-50 p-2.5 rounded-xs border border-slate-100">
                  No response notes recorded yet. Assigned by {currentAssignment.assignedBy} at{' '}
                  {new Date(currentAssignment.assignedAt).toLocaleTimeString()}.
                </div>
              ) : (
                currentAssignment.responseNotes.map((note) => (
                  <div key={note.id} className="p-2.5 bg-slate-50 rounded-xs border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-bold text-slate-800">
                        {note.author} ({note.role.toUpperCase()})
                      </span>
                      <span className="font-mono">{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-700 text-[11px] leading-relaxed">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Logged by: <strong>{currentUser.name}</strong></span>
          <button
            onClick={() => setAssignIncidentModalIncidentId(null)}
            className="px-3 py-1 bg-white border border-slate-300 rounded-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
