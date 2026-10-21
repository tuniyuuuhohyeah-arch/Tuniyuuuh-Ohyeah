import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Key, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface LoginViewProps {
  onLogin: (session: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [username, setUsername] = useState('admin.mario');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState<string | null>(null);

  const handleQuickLogin = (role: UserRole) => {
    if (role === 'ADMIN') {
      onLogin({
        username: 'admin.mario',
        name: 'Atty. Mario L. Reyes',
        title: 'Chief Administrative Officer (HRMO V)',
        role: 'ADMIN',
        isAuthenticated: true,
        isLocked: false,
        lastActivity: Date.now(),
      });
    } else {
      onLogin({
        username: 'auditor.gomez',
        name: 'Clarissa M. Gomez, CPA',
        title: 'State Auditor IV (COA Inspection)',
        role: 'READ_ONLY',
        isAuthenticated: true,
        isLocked: false,
        lastActivity: Date.now(),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    handleQuickLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        {/* Emblem Badge */}
        <div className="mx-auto w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg tracking-wider">
          HRIS
        </div>
        <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
          Republic of the Philippines
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Human Resource Information System
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Secure Electronic Personnel Repository &amp; Civil Service 201 Records Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-xl border border-slate-700/40 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Choice Pills (Segmented control) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Select Authorized Personnel Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('ADMIN');
                  setUsername('admin.mario');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
                  selectedRole === 'ADMIN'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HR Administrator
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('READ_ONLY');
                  setUsername('auditor.gomez');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
                  selectedRole === 'READ_ONLY'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Read-Only Auditor
              </button>
            </div>
            <p className="text-[11px] text-slate-500 pt-0.5">
              {selectedRole === 'ADMIN'
                ? 'Full authority: add, edit, archive personnel records, and upload 201 files.'
                : 'Restricted authority: view and inspect records without modification permissions.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Authorized Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono"
                />
                <Key className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Log In to 201 Records System</span>
            </button>
          </form>

          {/* Quick Demo Switcher Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Quick One-Click Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="p-2 border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-900 text-[11px] font-semibold rounded text-left transition-colors"
              >
                <div className="font-bold">Atty. Mario Reyes</div>
                <div className="text-[10px] text-blue-700">HR Administrator</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('READ_ONLY')}
                className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-[11px] font-semibold rounded text-left transition-colors"
              >
                <div className="font-bold">Clarissa Gomez</div>
                <div className="text-[10px] text-slate-600">State Auditor (Read-Only)</div>
              </button>
            </div>
          </div>

          {/* Statutory DPA Notice */}
          <div className="text-[10px] text-slate-400 text-center leading-relaxed flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Compliant with Republic Act No. 10173 (Data Privacy Act of 2012)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
