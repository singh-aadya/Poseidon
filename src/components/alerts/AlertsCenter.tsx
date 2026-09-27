import React, { useState } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  ShieldAlert,
  Info,
  CheckCircle2,
  Filter,
  CheckCheck,
  ArrowRight,
  UserCheck,
  Clock,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Activity,
  PlusCircle,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { AlertSeverity, AlertStatus, OperationalAlert } from '../../types/rbac';

export const AlertsCenter: React.FC = () => {
  const {
    alertsCenterOpen,
    setAlertsCenterOpen,
    alerts,
    currentUser,
    acknowledgeAlert,
    resolveAlert,
    markAlertRead,
    markAllAlertsRead,
    setActiveIncidentId,
    setActiveMode,
    setAssignIncidentModalIncidentId,
  } = usePoseidonStore();

  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [ackNote, setAckNote] = useState('');

  if (!alertsCenterOpen) return null;

  const unreadCount = alerts.filter((a) => !a.read).length;

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${a.id} ${a.incidentId} ${a.incidentName} ${a.description} ${a.assignedTeam} ${a.region}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FEF2F2] text-[#B42318] border border-[#FECDCA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B42318]"></span>
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFFBEB] text-[#C47A00] border border-[#FDE68A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C47A00]"></span>
            WARNING
          </span>
        );
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F0F9FF] text-[#1769AA] border border-[#BAE6FD]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1769AA]"></span>
            INFO
          </span>
        );
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'New':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            NEW
          </span>
        );
      case 'Acknowledged':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            ACKNOWLEDGED
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            IN PROGRESS
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            RESOLVED
          </span>
        );
    }
  };

  const handleOpenIncident = (alert: OperationalAlert) => {
    markAlertRead(alert.id);
    setActiveIncidentId(alert.incidentId);
    if (alert.type === 'ATTRIBUTION_REVIEW') {
      setActiveMode('attribution');
    } else if (alert.type === 'SHORELINE_PROXIMITY' || alert.type === 'TRAJECTORY_SHIFT') {
      setActiveMode('forecast');
    } else {
      setActiveMode('detection');
    }
    setAlertsCenterOpen(false);
  };

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId, ackNote || undefined);
    setAckNote('');
    setSelectedAlertId(null);
  };

  const handleResolve = (alertId: string) => {
    resolveAlert(alertId, ackNote || undefined);
    setAckNote('');
    setSelectedAlertId(null);
  };

  // Determine role permissions
  const canAcknowledge = currentUser.role === 'operations' || currentUser.role === 'admin' || currentUser.role === 'analyst';
  const canAssign = currentUser.role === 'operations' || currentUser.role === 'admin';

  return (
    <>
      {/* Mobile & Tablet Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 transition-opacity"
        onClick={() => setAlertsCenterOpen(false)}
        aria-label="Close Alerts Center"
      />

      {/* Main Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full sm:w-[460px] md:w-[500px] max-w-full flex-col border-l border-slate-300 bg-white shadow-2xl animate-in slide-in-from-right duration-200 box-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0F2538] bg-[#17324D] px-4 py-3 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-sky-400" />
            <div>
              <h2 className="font-sans text-sm font-bold tracking-tight">
                Operational Alerts Center
              </h2>
              <p className="text-[10px] text-slate-300">
                Automated detection anomalies & response tasking
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#B42318] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white ml-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setAlertsCenterOpen(false)}
            className="rounded-xs p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="border-b border-slate-200 bg-slate-50 p-3 space-y-2.5 shrink-0 text-xs">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert ID, incident, or description..."
              className="w-full rounded-sm border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-slate-400 focus:border-[#17324D] focus:outline-hidden"
            />
          </div>

          {/* Severity & Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Sev:</span>
              {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs border transition ${
                    severityFilter === sev
                      ? 'bg-[#17324D] border-[#0F2538] text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAlertsRead}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#1769AA] hover:underline"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Status:</span>
            {(['ALL', 'New', 'Acknowledged', 'In Progress', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs border transition ${
                  statusFilter === st
                    ? 'bg-[#17324D] border-[#0F2538] text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <Bell className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No matching operational alerts.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try clearing filters or search term.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlertId === alert.id;
              return (
                <div
                  key={alert.id}
                  className={`rounded-sm border text-xs transition p-3 ${
                    alert.severity === 'CRITICAL'
                      ? 'border-l-4 border-l-[#B42318] border-red-200 bg-red-50/20'
                      : alert.severity === 'WARNING'
                      ? 'border-l-4 border-l-[#C47A00] border-amber-200 bg-amber-50/20'
                      : 'border-l-4 border-l-[#1769AA] border-blue-200 bg-blue-50/20'
                  } ${!alert.read ? 'ring-1 ring-blue-300' : 'opacity-90'}`}
                >
                  {/* Top row: ID, Badges, Timestamp */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-bold text-slate-900">{alert.id}</span>
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Incident context */}
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">
                      {alert.incidentName} ({alert.incidentId})
                    </span>
                    <span className="text-[10px] text-slate-500">{alert.region}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-sans">
                    {alert.description}
                  </p>

                  {/* Team Assignment & Responder */}
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-[11px] bg-slate-50 p-1.5 rounded-xs border border-slate-200/80">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Shield className="h-3 w-3 text-slate-500" />
                      <span>Team:</span>
                      <span className="font-semibold text-slate-800">{alert.assignedTeam}</span>
                      {alert.assignedUser && (
                        <span className="text-slate-500">({alert.assignedUser})</span>
                      )}
                    </div>

                    {alert.acknowledgedAt && (
                      <span className="text-[10px] text-emerald-700 font-mono">
                        Ack: {new Date(alert.acknowledgedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {/* Notes if available */}
                  {alert.notes && (
                    <div className="mt-1.5 text-[11px] text-slate-600 bg-white p-1.5 rounded-xs border border-slate-200 italic">
                      <span className="font-semibold text-slate-700 not-italic">Note: </span>
                      {alert.notes}
                    </div>
                  )}

                  {/* Interactive Action Row */}
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      {canAcknowledge && alert.status === 'New' && (
                        <button
                          onClick={() => setSelectedAlertId(isSelected ? null : alert.id)}
                          className="px-2 py-1 text-[11px] font-semibold rounded-xs bg-amber-600 text-white hover:bg-amber-700 transition"
                        >
                          Acknowledge
                        </button>
                      )}

                      {canAcknowledge && alert.status === 'Acknowledged' && (
                        <button
                          onClick={() => setSelectedAlertId(isSelected ? null : alert.id)}
                          className="px-2 py-1 text-[11px] font-semibold rounded-xs bg-emerald-700 text-white hover:bg-emerald-800 transition"
                        >
                          Resolve Alert
                        </button>
                      )}

                      {canAssign && (
                        <button
                          onClick={() => {
                            setAssignIncidentModalIncidentId(alert.incidentId);
                            setAlertsCenterOpen(false);
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-xs border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition"
                        >
                          <UserCheck className="h-3 w-3 text-slate-500" />
                          <span>Task Team</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenIncident(alert)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-xs bg-[#17324D] text-white hover:bg-[#1C3D5E] transition"
                    >
                      <span>View Incident</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* In-Line Acknowledge / Resolve Form */}
                  {isSelected && (
                    <div className="mt-2.5 p-2 bg-slate-100 rounded-xs border border-slate-300 space-y-1.5 animate-in fade-in-50">
                      <div className="text-[11px] font-bold text-slate-800">
                        {alert.status === 'New' ? 'Acknowledge Alert' : 'Mark Alert Resolved'} as {currentUser.name}
                      </div>
                      <input
                        type="text"
                        value={ackNote}
                        onChange={(e) => setAckNote(e.target.value)}
                        placeholder="Add response note (e.g., flight tasked, boom deployed)..."
                        className="w-full rounded-xs border border-slate-300 bg-white p-1.5 text-xs focus:border-[#17324D] focus:outline-hidden"
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAlertId(null)}
                          className="px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-200 rounded-xs"
                        >
                          Cancel
                        </button>
                        {alert.status === 'New' ? (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-amber-600 text-white rounded-xs hover:bg-amber-700"
                          >
                            Confirm Acknowledge
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="px-2.5 py-1 text-[10px] font-bold bg-emerald-700 text-white rounded-xs hover:bg-emerald-800"
                          >
                            Confirm Resolution
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Audit Information */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-[10px] text-slate-500 flex items-center justify-between shrink-0">
          <span>Active Role: <strong className="uppercase">{currentUser.role}</strong> ({currentUser.organization})</span>
          <span>POSEIDON Alert Dispatcher v4.2</span>
        </div>
      </div>
    </>
  );
};
