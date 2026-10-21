import React from 'react';
import { UserSession } from '../types';
import {
  FileText,
  LayoutDashboard,
  Users,
  FileCheck2,
  ShieldAlert,
  HelpCircle,
  Lock,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface TopNavigationProps {
  currentView: 'dashboard' | 'employees' | 'employee-detail' | 'reports' | 'audit';
  onNavigate: (view: 'dashboard' | 'employees' | 'reports' | 'audit') => void;
  session: UserSession;
  onOpenGuide: () => void;
  onLockSession: () => void;
  onLogout: () => void;
  onSwitchRole: (role: 'ADMIN' | 'READ_ONLY') => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentView,
  onNavigate,
  session,
  onOpenGuide,
  onLockSession,
  onLogout,
  onSwitchRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Institutional Top Bar Contract: Zone 1 (Brand) - Zone 2 (4-5 Nav Links) - Zone 3 (Action / Profile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Wordmark Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
                HRIS
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors whitespace-nowrap">
                  Human Resource Information System
                </span>
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  Civil Service 201 Personnel Records
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('employees')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'employees' || currentView === 'employee-detail'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Employee Records</span>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'reports'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-slate-500" />
              <span>Compliance Reports</span>
            </button>

            <button
              onClick={() => onNavigate('audit')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'audit'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>Audit Trail (RA 10173)</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap shrink-0"
              title="First-Time User Workflow Guide"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Guide</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Profile / Role & Security Action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role indicator & switcher dropdown */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {session.name}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                  <span>{session.role === 'ADMIN' ? 'HR Administrator' : 'Read-Only Auditor'}</span>
                </div>
              </div>

              {/* Role Toggle Button (Quick demo helper) */}
              <button
                onClick={() => onSwitchRole(session.role === 'ADMIN' ? 'READ_ONLY' : 'ADMIN')}
                className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors whitespace-nowrap ${
                  session.role === 'ADMIN'
                    ? 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
                title="Click to toggle user permission mode for testing"
              >
                {session.role === 'ADMIN' ? 'Admin Mode' : 'Read-Only'}
              </button>

              {/* Workstation Lock Button (RA 10173 compliance) */}
              <button
                onClick={onLockSession}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="Lock Workstation (RA 10173 Inactivity Protection)"
                aria-label="Lock Workstation"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Logout from HR System"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
