import React, { useState } from 'react';
import {
  X,
  Shield,
  Sliders,
  History,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Database,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';

export const AdminAuditModal: React.FC = () => {
  const {
    adminModalOpen,
    setAdminModalOpen,
    auditLogs,
    users,
    alertRules,
    toggleAlertRule,
    currentUser,
    setCurrentUser,
  } = usePoseidonStore();

  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'rules'>('audit');
  const [auditSearch, setAuditSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  if (!adminModalOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    if (roleFilter !== 'ALL' && log.actor.role !== roleFilter) return false;
    if (auditSearch.trim()) {
      const q = auditSearch.toLowerCase();
      const match = `${log.id} ${log.action} ${log.actor.name} ${log.actor.team} ${log.details} ${log.incidentId || ''}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-sm shadow-2xl border border-slate-300 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-50 duration-150 box-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0F2538] bg-[#17324D] px-4 py-3 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-400" />
            <div>
              <h2 className="font-sans text-sm font-bold tracking-tight">
                System Administration & Operational Audit Center
              </h2>
              <p className="text-[10px] text-slate-300">
                Institutional governance, role provisioning, alert rule thresholds, and compliance logs
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminModalOpen(false)}
            className="rounded-xs p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 py-1.5 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xs transition ${
              activeTab === 'audit'
                ? 'bg-[#17324D] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xs transition ${
              activeTab === 'users'
                ? 'bg-[#17324D] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>User Clearance & Roles ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xs transition ${
              activeTab === 'rules'
                ? 'bg-[#17324D] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Alert Generation Rules ({alertRules.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* TAB 1: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search logs, actors, or actions..."
                    className="w-full rounded-xs border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs focus:border-[#17324D] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-1 self-start sm:self-auto overflow-x-auto">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Role Filter:</span>
                  {['ALL', 'admin', 'operations', 'analyst', 'public'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-xs border transition ${
                        roleFilter === r
                          ? 'bg-[#17324D] border-[#0F2538] text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table / Cards Container */}
              <div className="border border-slate-200 rounded-sm overflow-hidden bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#17324D] text-white">
                      <tr>
                        <th className="p-2.5 border-r border-[#2F4F70]">ID / Timestamp</th>
                        <th className="p-2.5 border-r border-[#2F4F70]">Actor & Clearance</th>
                        <th className="p-2.5 border-r border-[#2F4F70]">Action</th>
                        <th className="p-2.5 border-r border-[#2F4F70]">Incident</th>
                        <th className="p-2.5">Operational Details & State Transition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">
                            No audit log records found matching query.
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50 transition">
                            <td className="p-2.5 font-mono text-[11px] align-top whitespace-nowrap">
                              <div className="font-bold text-slate-900">{log.id}</div>
                              <div className="text-[10px] text-slate-500">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </div>
                            </td>

                            <td className="p-2.5 align-top whitespace-nowrap">
                              <div className="font-bold text-slate-900">{log.actor.name}</div>
                              <div className="text-[10px] text-slate-500">{log.actor.team}</div>
                              <span className="inline-block mt-0.5 px-1 py-0.2 rounded-xs text-[9px] font-mono uppercase bg-slate-100 border border-slate-300 font-semibold">
                                {log.actor.role}
                              </span>
                            </td>

                            <td className="p-2.5 align-top whitespace-nowrap">
                              <span className="font-semibold text-slate-800 bg-blue-50 px-1.5 py-0.5 rounded-xs border border-blue-200">
                                {log.action}
                              </span>
                            </td>

                            <td className="p-2.5 align-top font-mono text-[11px] whitespace-nowrap">
                              {log.incidentId ? (
                                <span className="font-bold text-[#1769AA]">{log.incidentId}</span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>

                            <td className="p-2.5 align-top text-[11px]">
                              <div className="text-slate-800 leading-relaxed">{log.details}</div>
                              {log.previousValue && log.newValue && (
                                <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-slate-600 bg-slate-50 p-1 rounded-xs border border-slate-200">
                                  <span className="line-through text-slate-400">{log.previousValue}</span>
                                  <ArrowRight className="h-3 w-3 text-slate-400" />
                                  <span className="font-bold text-emerald-700">{log.newValue}</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS & CLEARANCE */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                Active user clearance identities and operational authority delegations:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {users.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      className={`p-3.5 rounded-sm border transition bg-white shadow-2xs ${
                        isCurrent ? 'border-[#1769AA] ring-1 ring-blue-300' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-[#17324D] text-xs font-bold text-white">
                            {u.avatarInitials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{u.name}</div>
                            <div className="text-[10px] text-slate-500">{u.email}</div>
                          </div>
                        </div>

                        <span className="px-1.5 py-0.5 rounded-xs text-[10px] font-mono uppercase bg-slate-100 border border-slate-300 font-bold">
                          {u.clearanceLevel}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                        <div>
                          <strong className="text-slate-700">Role:</strong> <span className="uppercase font-semibold">{u.role}</span>
                        </div>
                        <div>
                          <strong className="text-slate-700">Title:</strong> {u.title}
                        </div>
                        <div>
                          <strong className="text-slate-700">Organization:</strong> {u.organization}
                        </div>
                        <div>
                          <strong className="text-slate-700">Tasking Unit:</strong> {u.team}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                        {isCurrent ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Currently Active Session</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setCurrentUser(u)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          >
                            Switch to this User
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ALERT GENERATION RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                Automated threshold engine rules for triggering real-time alerts across SAR ingest and AIS correlation pipelines:
              </div>

              <div className="space-y-2">
                {alertRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 bg-white rounded-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{rule.id}</span>
                        <span className="font-bold text-slate-800">{rule.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            rule.severity === 'CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rule.severity}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        Category: <strong className="text-slate-700">{rule.category}</strong> | Threshold:{' '}
                        <strong className="text-slate-800">
                          &gt; {rule.thresholdValue} {rule.unit}
                        </strong>{' '}
                        | Auto-Assign: <span className="font-semibold text-slate-700">{rule.autoAssignTeam}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => toggleAlertRule(rule.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-semibold transition ${
                          rule.enabled
                            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {rule.enabled ? (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Logged as System Admin: <strong>{currentUser.name}</strong></span>
          <button
            onClick={() => setAdminModalOpen(false)}
            className="px-3 py-1 bg-white border border-slate-300 rounded-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close Admin Center
          </button>
        </div>
      </div>
    </div>
  );
};
