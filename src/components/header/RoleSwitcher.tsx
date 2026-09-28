import React, { useState, useRef, useEffect } from 'react';
import { Shield, ChevronDown, User, Check, Lock, Settings } from 'lucide-react';
import { usePoseidonStore } from '../../store/usePoseidonStore';
import { UserProfile, UserRole } from '../../types/rbac';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, setCurrentUser, users, setAdminModalOpen } = usePoseidonStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'public':
        return 'bg-slate-700 text-slate-200 border-slate-600';
      case 'analyst':
        return 'bg-sky-900 text-sky-200 border-sky-700';
      case 'operations':
        return 'bg-amber-900 text-amber-200 border-amber-700';
      case 'admin':
        return 'bg-purple-900 text-purple-200 border-purple-700';
      default:
        return 'bg-slate-700 text-slate-200 border-slate-600';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'public':
        return 'Public Info, Approved Incidents & Map Exploration';
      case 'analyst':
        return 'Forensic SAR, AIS Attribution & Trajectory Analysis';
      case 'operations':
        return 'Alerts Center, Incident Tasking & Response Actions';
      case 'admin':
        return 'System Configuration, Rule Thresholds & Audit Trail';
    }
  };

  return (
    <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
      {/* Role Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Active Persona: ${currentUser.name} (${currentUser.role.toUpperCase()})`}
        className="flex items-center gap-1.5 sm:gap-2 rounded-sm border border-[#2F4F70] bg-[#102438] px-2 py-1 text-xs text-white hover:bg-[#163350] transition select-none shrink-0 cursor-pointer"
      >
        {/* User avatar initials */}
        <div className="flex h-5 w-5 items-center justify-center rounded-xs bg-[#1F4367] text-[10px] font-bold text-sky-200 shrink-0">
          {currentUser.avatarInitials}
        </div>

        <div className="flex flex-col items-start leading-none text-left">
          <span className="hidden lg:inline font-semibold text-[11px] text-slate-100 max-w-[110px] truncate">
            {currentUser.name}
          </span>
          <span
            className={`text-[9px] font-mono uppercase px-1 rounded-xs border mt-0.5 ${getRoleBadgeStyle(
              currentUser.role
            )}`}
          >
            {currentUser.role}
          </span>
        </div>

        <ChevronDown className={`h-3 w-3 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      {/* Role Selection Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-1rem)] rounded-sm border border-slate-300 bg-white shadow-2xl z-50 animate-in fade-in-50 duration-100 divide-y divide-slate-100">
          {/* Header */}
          <div className="p-3 bg-slate-50 border-b border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Role-Based Access Control (RBAC)
            </div>
            <div className="text-xs font-semibold text-slate-800 mt-0.5">
              Switch Operational Persona
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Navigation, incident data, and action permissions adapt to active clearance.
            </p>
          </div>

          {/* User List */}
          <div className="p-1 space-y-0.5 max-h-72 overflow-y-auto">
            {users.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xs transition flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-200'
                      : 'hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-[#17324D] text-xs font-bold text-white shrink-0 mt-0.5">
                    {u.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {u.name}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded-xs border font-semibold ${getRoleBadgeStyle(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 truncate">{u.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{u.organization}</div>
                    <div className="text-[10px] text-slate-500 mt-1 font-sans italic bg-slate-50 p-1 rounded-xs border border-slate-100">
                      {getRoleDescription(u.role)}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-[#1769AA] shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin shortcuts if user is admin */}
          {currentUser.role === 'admin' && (
            <div className="p-2 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setAdminModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xs border border-purple-300 bg-purple-100/70 text-purple-900 text-xs font-semibold hover:bg-purple-200 transition"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Open Administration & Audit Center</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
