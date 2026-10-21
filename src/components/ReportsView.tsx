import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Employee, DocumentItem, AuditLog, UserSession } from '../types';
import { calculateCompleteness, MANDATORY_DOCUMENTS } from '../utils/completeness';

interface ReportsViewProps {
  employees: Employee[];
  documents: DocumentItem[];
  auditLogs: AuditLog[];
  session: UserSession;
  onRecordAudit: (action: string, details: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  employees,
  documents,
  auditLogs,
  session,
  onRecordAudit,
}) => {
  const [activeTab, setActiveTab] = useState<'incomplete' | 'masterlist' | 'audit'>('incomplete');
  const [reportSearch, setReportSearch] = useState('');

  // Pre-calculate completeness for all employees
  const complianceData = useMemo(() => {
    return employees
      .filter((e) => !e.isArchived)
      .map((emp) => {
        const empDocs = documents.filter((d) => d.employeeId === emp.id);
        const comp = calculateCompleteness(empDocs);
        return {
          employee: emp,
          completeness: comp,
        };
      });
  }, [employees, documents]);

  const incompleteEmployees = useMemo(() => {
    return complianceData.filter((d) => !d.completeness.isComplete);
  }, [complianceData]);

  // Export CSV Helper with UTF-8 BOM for Microsoft Excel compatibility
  const downloadCsv = (filename: string, rows: string[][]) => {
    const csvContent =
      '\uFEFF' +
      rows
        .map((row) =>
          row
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
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Export Masterlist CSV
  const handleExportMasterlistCsv = () => {
    const rows = [
      [
        'Employee ID Number',
        'First Name',
        'Middle Name',
        'Last Name',
        'Suffix',
        'Position / Designation',
        'Office / Department',
        'Employment Status',
        'Date Hired',
        'Date of Birth',
        'Email Address',
        'Contact Number',
        'Residential Address',
        '201 Completeness %',
        'Mandatory Docs Submitted',
      ],
    ];

    employees.forEach((emp) => {
      const empDocs = documents.filter((d) => d.employeeId === emp.id);
      const comp = calculateCompleteness(empDocs);

      rows.push([
        emp.id,
        emp.firstName,
        emp.middleName,
        emp.lastName,
        emp.suffix || '',
        emp.position,
        emp.department,
        emp.employmentStatus,
        emp.dateHired,
        emp.dateOfBirth,
        emp.email,
        emp.phone,
        emp.address,
        `${comp.percentage}%`,
        `${comp.completedMandatory} of ${comp.totalMandatory}`,
      ]);
    });

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCsv(`HR_201_Employee_Masterlist_${dateStr}.csv`, rows);
    onRecordAudit('EXPORT_REPORT', 'Generated and downloaded Master Employee Directory CSV.');
  };

  // 2. Export Incomplete 201 Report CSV
  const handleExportIncompleteReportCsv = () => {
    const rows = [
      [
        'Employee ID Number',
        'Complete Name',
        'Position',
        'Office / Department',
        'Employment Status',
        'Completion Rate',
        'Missing Mandatory Documents List',
      ],
    ];

    incompleteEmployees.forEach(({ employee, completeness }) => {
      const missingTitles = completeness.missingMandatory.map((m) => m.title).join('; ');
      rows.push([
        employee.id,
        `${employee.firstName} ${employee.middleName} ${employee.lastName} ${employee.suffix || ''}`.trim(),
        employee.position,
        employee.department,
        employee.employmentStatus,
        `${completeness.percentage}% (${completeness.completedMandatory}/${completeness.totalMandatory})`,
        missingTitles,
      ]);
    });

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCsv(`HR_201_Incomplete_Documents_Audit_Report_${dateStr}.csv`, rows);
    onRecordAudit('EXPORT_REPORT', 'Generated and downloaded Incomplete 201 Documents Compliance Report CSV.');
  };

  // 3. Export Audit Trail CSV
  const handleExportAuditLogCsv = () => {
    const rows = [
      ['Log ID', 'Timestamp (UTC)', 'Authorized Actor', 'Actor Role', 'Action Type', 'Subject Employee ID', 'Details'],
    ];

    auditLogs.forEach((log) => {
      rows.push([
        log.id,
        log.timestamp,
        log.actorName,
        log.actorRole,
        log.action,
        log.employeeId || '',
        log.details,
      ]);
    });

    const dateStr = new Date().toISOString().split('T')[0];
    downloadCsv(`HR_201_RA10173_Audit_Trail_${dateStr}.csv`, rows);
    onRecordAudit('EXPORT_REPORT', 'Exported permanent RA 10173 Audit Trail CSV.');
  };

  // Browser print official layout
  const handlePrint = () => {
    window.print();
    onRecordAudit('EXPORT_REPORT', 'Invoked official report print/PDF generator.');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Official HR 201 Reports &amp; Compliance Center
          </h2>
          <p className="text-xs text-slate-500">
            Generate and download certified reports in Excel/CSV and printable official formats
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-md shadow-xs transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('incomplete')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
            activeTab === 'incomplete'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Incomplete 201 Documents Report ({incompleteEmployees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('masterlist')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
            activeTab === 'masterlist'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Employee Masterlist Directory ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RA 10173 Audit Activity Report</span>
        </button>
      </div>

      {/* REPORT 1: Incomplete 201 Documents Compliance Report */}
      {activeTab === 'incomplete' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Civil Service Commission 201 File Compliance Audit Report
              </h3>
              <p className="text-xs text-slate-500">
                Identifies active personnel missing mandatory appointment, oath, medical, or statutory documents
              </p>
            </div>

            <button
              onClick={handleExportIncompleteReportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel / CSV</span>
            </button>
          </div>

          {incompleteEmployees.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-800">100% Document Compliance</div>
              <div>All active employees currently have all mandatory civil service documents on file.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-3 px-4 font-mono text-[11px]">Employee ID</th>
                    <th className="py-3 px-4">Complete Name</th>
                    <th className="py-3 px-4">Position / Department</th>
                    <th className="py-3 px-4">Rate</th>
                    <th className="py-3 px-4">Missing Required Documents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incompleteEmployees.map(({ employee, completeness }) => (
                    <tr key={employee.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {employee.id}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900">
                        {employee.firstName} {employee.middleName} {employee.lastName} {employee.suffix || ''}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        <div className="font-semibold text-slate-800">{employee.position}</div>
                        <div className="text-[11px] text-slate-500">{employee.department}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-amber-700">
                          {completeness.percentage}%
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {completeness.completedMandatory} of {completeness.totalMandatory}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-amber-900">
                        <ul className="list-disc list-inside space-y-0.5">
                          {completeness.missingMandatory.map((m) => (
                            <li key={m.key} className="text-slate-700">
                              <span className="font-semibold text-slate-900">{m.title}</span>{' '}
                              <span className="text-[11px] text-slate-400">({m.category})</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* REPORT 2: Master Employee Directory */}
      {activeTab === 'masterlist' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Complete Employee Plantilla Directory
              </h3>
              <p className="text-xs text-slate-500">
                Comprehensive roster with contact, appointment, and residential records
              </p>
            </div>

            <button
              onClick={handleExportMasterlistCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Masterlist CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-3 px-4 font-mono text-[11px]">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 font-mono text-[11px]">Hired</th>
                  <th className="py-3 px-4 font-mono text-[11px]">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-900 tabular-nums">
                      {emp.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {emp.firstName} {emp.middleName} {emp.lastName} {emp.suffix || ''}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{emp.position}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{emp.department}</td>
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {emp.employmentStatus}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 tabular-nums whitespace-nowrap">
                      {emp.dateHired}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {emp.phone || emp.email || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: Audit Activity Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Data Privacy Act of 2012 (RA 10173) Audit Log Export
              </h3>
              <p className="text-xs text-slate-500">
                Chronological record of personnel file accesses, downloads, and changes for privacy compliance inspections
              </p>
            </div>

            <button
              onClick={handleExportAuditLogCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Audit Trail CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 border-b border-slate-200">
                <tr className="text-slate-700 font-semibold">
                  <th className="py-3 px-4 font-mono text-[11px]">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Authorized Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Subject Employee</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.actorName} ({log.actorRole})
                    </td>
                    <td className="py-2.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {log.employeeId || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 leading-normal">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
