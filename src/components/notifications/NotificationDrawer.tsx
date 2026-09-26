import React from 'react';
import { X, Bell, CheckCheck, AlertTriangle, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveIncidentId,
    setActiveMode,
  } = usePoseidonStore();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'attribution':
        return <ShieldAlert className="h-4 w-4 text-amber-600" />;
      case 'forecast':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'detection':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationRead(item.id);
    if (item.incidentId) {
      setActiveIncidentId(item.incidentId);
      if (item.type === 'attribution') setActiveMode('attribution');
      else if (item.type === 'forecast') setActiveMode('forecast');
      else if (item.type === 'detection') setActiveMode('detection');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-80 sm:w-96 flex-col border-l border-slate-300 bg-white shadow-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-[#17324D] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyan-400" />
          <h2 className="font-sans text-sm font-bold tracking-tight">System Alerts & Advisories</h2>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-600 px-1.5 py-0.2 font-mono text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-xs p-1 text-slate-300 hover:bg-white/10 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Subheader / Actions */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-600">
        <span>Operational event telemetry (SIMULATED)</span>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 font-semibold text-[#1769AA] hover:underline"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1.5">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">No active alerts.</div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`rounded-sm border p-3 text-xs cursor-pointer transition select-none ${
                item.read
                  ? 'border-slate-200 bg-white hover:bg-slate-50 opacity-80'
                  : 'border-l-4 border-l-[#1769AA] border-blue-200 bg-blue-50/40 hover:bg-blue-50/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  {getIcon(item.type)}
                  <span>{item.title}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{item.description}</p>
              {item.incidentId && (
                <div className="mt-2 flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                  <span className="font-mono font-semibold text-slate-700">{item.incidentId}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#1769AA]">
                    <span>View in map</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-[10px] text-slate-500 flex justify-between items-center">
        <span>Feeds: Sentinel-1, AIS, GFS, HYCOM</span>
        <span className="font-mono text-emerald-700 font-semibold">● SYNCED</span>
      </div>
    </div>
  );
};
