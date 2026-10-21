import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Lock,
  Clock,
  Eye,
  FileCheck,
  FileText,
  UserCheck,
} from 'lucide-react';
import { AuditLog, AuditActionType, UserSession } from '../types';

interface AuditLogViewProps {
  auditLogs: AuditLog[];
  session: UserSession;
  onLockSession: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  auditLogs,
  session,
  onLockSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (selectedAction !== 'ALL' && log.action !== selectedAction) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesActor = log.actorName.toLowerCase().includes(q);
        const matchesDetails = log.details.toLowerCase().includes(q);
        const matchesEmpId = log.employeeId?.toLowerCase().includes(q);
        const matchesEmpName = log.employeeName?.toLowerCase().includes(q);
        if (!matchesActor && !matchesDetails && !matchesEmpId && !matchesEmpName) {
          return false;
        }
      }
      return true;
    });
  }, [auditLogs, searchQuery, selectedAction]);

  const handleExportCsv = () => {
    const rows = [
      ['Log ID', 'Timestamp (UTC)', 'Authorized Actor', 'Actor Role', 'Action', 'Subject Employee ID', 'Subject Name', 'Audit Details'],
    ];

    filteredLogs.forEach((log) => {
      rows.push([
        log.id,
        log.timestamp,
        log.actorName,
        log.actorRole,
        log.action,
        log.employeeId || '',
        log.employeeName || '',
        log.details,
      ]);
    });

    const csvContent =
      '\uFEFF' +
      rows
        .map((r) =>
          r
            .map((cell) => {
              const str = cell ?? '';
              if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RA10173_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-800" />
            <span>Republic Act No. 10173 (Data Privacy Act) Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500">
            Immutable, permanent audit log of all personnel 201 file accesses, document downloads, modifications, and credential verifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLockSession}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Lock Station</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Compliance Advisory Banner */}
      <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-700" />
          <span>Statutory Compliance Notice (National Privacy Commission Circulars)</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          In strict accordance with the Philippine Data Privacy Act of 2012 (RA 10173), every administrative access to confidential 201 records (including viewing personal data sheets, salary increments, medical certificates, or disciplinary papers) is recorded with non-repudiable timestamps. Periodic audit logs must be submitted during Civil Service Commission and National Privacy Commission compliance checks.
        </p>
      </div>

      {/* Search & Action Filter Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Actor name, Employee ID, or activity details..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Action:</span>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-hidden"
            >
              <option value="ALL">All Actions</option>
              <option value="LOGIN">LOGIN</option>
              <option value="VIEW_RECORD">VIEW_RECORD</option>
              <option value="UPLOAD_DOCUMENT">UPLOAD_DOCUMENT</option>
              <option value="DOWNLOAD_DOCUMENT">DOWNLOAD_DOCUMENT</option>
              <option value="CREATE_RECORD">CREATE_RECORD</option>
              <option value="UPDATE_RECORD">UPDATE_RECORD</option>
              <option value="ARCHIVE_RECORD">ARCHIVE_RECORD</option>
              <option value="RESTORE_RECORD">RESTORE_RECORD</option>
              <option value="EXPORT_REPORT">EXPORT_REPORT</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 text-[11px] font-mono tabular-nums">
          {filteredLogs.length} matching events
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold select-none">
                <th className="py-3 px-4 font-mono text-[11px]">Timestamp (UTC)</th>
                <th className="py-3 px-4">Authorized User / Role</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4 font-mono text-[11px]">Subject ID</th>
                <th className="py-3 px-4">Details &amp; Audit Trail Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{log.actorName}</div>
                    <div className="text-[10px] text-slate-500">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700 font-semibold tabular-nums whitespace-nowrap">
                    {log.employeeId || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-normal max-w-xl">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
