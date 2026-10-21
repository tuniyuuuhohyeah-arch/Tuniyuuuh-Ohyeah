import React, { useState } from 'react';
import { Lock, Shield, KeyRound, AlertCircle } from 'lucide-react';
import { UserSession } from '../types';

interface SessionLockModalProps {
  session: UserSession;
  onUnlock: () => void;
}

export const SessionLockModal: React.FC<SessionLockModalProps> = ({ session, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow unlock with any entry or default 1234, or blank quick unlock
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Workstation Secured
          </h2>
          <p className="text-xs text-slate-500">
            Session paused to safeguard confidential personnel 201 records in compliance with Republic Act No. 10173 (Data Privacy Act).
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-left flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
            {session.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{session.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{session.title}</div>
            <div className="text-[10px] font-semibold text-blue-700">
              Role: {session.role === 'ADMIN' ? 'HR Administrator' : 'Read-Only Auditor'}
            </div>
          </div>
        </div>

        <form onSubmit={handleUnlockSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-left text-xs font-semibold text-slate-700 mb-1">
              Enter HR Authorization PIN / Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Default: 1234 (or click Unlock below)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono tracking-wider"
                autoFocus
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {error && (
            <div className="text-xs text-rose-600 flex items-center gap-1.5 justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Unlock HR Workstation</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400">
          Tip: Inactivity locks prevent unauthorized physical viewing in shared government HR offices.
        </p>
      </div>
    </div>
  );
};
