import React, { useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  FileWarning,
  ArrowRight,
  FolderOpen,
  UserPlus,
  FileCheck2,
  ShieldAlert,
  Clock,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { Employee, DocumentItem, AuditLog, UserSession } from '../types';
import { calculateCompleteness } from '../utils/completeness';

interface DashboardViewProps {
  employees: Employee[];
  documents: DocumentItem[];
  auditLogs: AuditLog[];
  session: UserSession;
  onNavigateEmployees: () => void;
  onSelectEmployee: (emp: Employee) => void;
  onOpenAddModal: () => void;
  onNavigateReports: () => void;
  onNavigateAudit: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  documents,
  auditLogs,
  session,
  onNavigateEmployees,
  onSelectEmployee,
  onOpenAddModal,
  onNavigateReports,
  onNavigateAudit,
}) => {
  // Pre-calculate completeness for each employee
  const employeeStats = useMemo(() => {
    let active = 0;
    let inactive = 0;
    let incomplete = 0;

    const incompleteList: Array<{ employee: Employee; missingCount: number; missingList: string[] }> = [];

    employees.forEach((emp) => {
      if (emp.isArchived) {
        inactive++;
      } else {
        active++;
      }

      // Check completeness
      const empDocs = documents.filter((d) => d.employeeId === emp.id);
      const comp = calculateCompleteness(empDocs);
      if (!comp.isComplete && !emp.isArchived) {
        incomplete++;
        incompleteList.push({
          employee: emp,
          missingCount: comp.missingMandatory.length,
          missingList: comp.missingMandatory.map((m) => m.title),
        });
      }
    });

    return {
      total: employees.length,
      active,
      inactive,
      incomplete,
      incompleteList,
    };
  }, [employees, documents]);

  // Breakdown by department
  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((e) => {
      if (!e.isArchived) {
        counts[e.department] = (counts[e.department] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [employees]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-slate-800 via-slate-800 to-slate-700 text-white rounded-xl p-6 border border-slate-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Human Resource Information System
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {session.role === 'ADMIN' && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
          <button
            onClick={onNavigateReports}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700/80 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-md border border-slate-600/70 transition-colors shadow-xs"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Generate Reports</span>
          </button>
        </div>
      </div>

      {/* Main 4 Metric Cards (Clean, Uncluttered, Tabular Figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Employees */}
        <div
          onClick={onNavigateEmployees}
          className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-slate-300 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Personnel Filed</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {employeeStats.total}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Plantilla &amp; Contractual</span>
            <span className="text-blue-700 font-semibold flex items-center gap-0.5">
              View All <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Metric 2: Active Employees */}
        <div
          onClick={onNavigateEmployees}
          className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-slate-300 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Employees</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {employeeStats.active}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Regular, Casual &amp; Contractual
          </div>
        </div>

        {/* Metric 3: Inactive / Archived */}
        <div
          onClick={onNavigateEmployees}
          className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-slate-300 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Archived / Inactive</span>
            <UserX className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {employeeStats.inactive}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Separated, Transferred, or Retired
          </div>
        </div>

        {/* Metric 4: Incomplete 201 Records */}
        <div
          onClick={onNavigateReports}
          className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-amber-300 cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Incomplete 201 Records</span>
            <FileWarning className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono tabular-nums">
            {employeeStats.incomplete}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium flex items-center justify-between">
            <span>Missing Statutory Docs</span>
            <span className="underline">Audit List</span>
          </div>
        </div>
      </div>

      {/* Two-Column Working Section: Urgent Action List & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Records with Incomplete Documents */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Records Requiring Immediate HR Attention ({employeeStats.incomplete})
              </h2>
            </div>
            <button
              onClick={onNavigateReports}
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
            >
              <span>Export Compliance Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {employeeStats.incompleteList.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              All active employee 201 records currently have complete mandatory documents.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {employeeStats.incompleteList.map(({ employee, missingCount, missingList }) => (
                <div
                  key={employee.id}
                  onClick={() => onSelectEmployee(employee)}
                  className="p-4 sm:px-6 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-900 tabular-nums">
                        {employee.id}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs font-bold text-slate-900">
                        {employee.firstName} {employee.lastName}
                      </span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        ({employee.position})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5">
                      <span className="text-amber-800 font-medium">
                        Missing {missingCount} mandatory document{missingCount !== 1 ? 's' : ''}:
                      </span>
                      <span className="text-slate-600 truncate max-w-md">
                        {missingList.slice(0, 2).join(', ')}
                        {missingList.length > 2 && ` +${missingList.length - 2} more`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEmployee(employee);
                    }}
                    className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open 201 File</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Department Distribution & Quick Stats */}
        <div className="space-y-6">
          {/* Department Breakdown */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                <span>Personnel by Division</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">{departmentCounts.length} units</span>
            </div>

            <div className="space-y-2.5">
              {departmentCounts.map(([dept, count]) => {
                const percentage = Math.round((count / (employeeStats.active || 1)) * 100);
                return (
                  <div key={dept} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 truncate max-w-[180px]" title={dept}>
                        {dept}
                      </span>
                      <span className="font-mono text-slate-900 font-semibold tabular-nums">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Security & Audit Events Preview */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                <span>DPA Audit Log Preview</span>
              </h3>
              <button
                onClick={onNavigateAudit}
                className="text-[11px] font-semibold text-blue-700 hover:underline"
              >
                View Full Log
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="py-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{log.actorName}</span>
                    <span className="text-slate-400 font-mono tabular-nums">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-1">
                    {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
