import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  Edit,
  Archive,
  RotateCcw,
  FileText,
  CheckCircle,
  AlertTriangle,
  Folder,
  Download,
  Eye,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ShieldAlert,
  Clock,
  User,
  ExternalLink,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import {
  Employee,
  DocumentItem,
  DocumentCategory,
  DOCUMENT_CATEGORIES,
  UserSession,
  AuditLog,
} from '../types';
import { calculateCompleteness, MANDATORY_DOCUMENTS } from '../utils/completeness';

interface EmployeeDetailViewProps {
  employee: Employee;
  documents: DocumentItem[];
  auditLogs: AuditLog[];
  session: UserSession;
  onBack: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onOpenUpload: (category?: DocumentCategory, title?: string) => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (docId: string) => void;
}

export const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({
  employee,
  documents,
  auditLogs,
  session,
  onBack,
  onEdit,
  onArchive,
  onRestore,
  onOpenUpload,
  onPreviewDocument,
  onDownloadDocument,
  onDeleteDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'profile' | 'audit'>('documents');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Personal Information and Application Documents': true,
    'Appointment and Employment Documents': true,
    'Oath of Office and Assumption Documents': true,
  });

  const completeness = calculateCompleteness(documents);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    DOCUMENT_CATEGORIES.forEach((c) => (all[c] = true));
    setExpandedCategories(all);
  };

  const collapseAll = () => {
    setExpandedCategories({});
  };

  // Filter audit logs for this specific employee
  const employeeAuditLogs = auditLogs.filter(
    (log) => log.employeeId === employee.id || log.details.includes(employee.id)
  );

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Calculate tenure
  const calculateTenure = (dateStr: string) => {
    const hired = new Date(dateStr);
    const now = new Date();
    const diffYears = now.getFullYear() - hired.getFullYear();
    const diffMonths = now.getMonth() - hired.getMonth();
    const totalMonths = diffYears * 12 + diffMonths;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
    return `${years} yr${years !== 1 ? 's' : ''} ${months} mo${months !== 1 ? 's' : ''}`;
  };

  // Calculate age
  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employee Masterlist</span>
        </button>

        <div className="flex items-center gap-2">
          {session.role === 'ADMIN' && (
            <>
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-xs transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              {employee.isArchived ? (
                <button
                  onClick={onRestore}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Record</span>
                </button>
              ) : (
                <button
                  onClick={onArchive}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold rounded-md shadow-xs transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive Record</span>
                </button>
              )}

              <button
                onClick={() => onOpenUpload()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload 201 Document</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Avatar & Key Metadata */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-900 text-white font-bold text-xl flex items-center justify-center shrink-0 tracking-wider">
              {employee.firstName.charAt(0)}
              {employee.lastName.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900">
                  {employee.firstName} {employee.middleName} {employee.lastName}{' '}
                  {employee.suffix && (
                    <span className="text-slate-500 font-normal">{employee.suffix}</span>
                  )}
                </h1>

                {/* Status Indicator (Zero-Pill Restraint) */}
                <span className="text-xs text-slate-500">
                  {employee.isArchived ? (
                    <span className="text-slate-500 font-semibold">Archived / Separated</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      {employee.employmentStatus} Plantilla
                    </span>
                  )}
                </span>
              </div>

              {/* Position & Department */}
              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-800">{employee.position}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{employee.department}</span>
              </div>

              {/* ID & Dates */}
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                <span>
                  ID:{' '}
                  <strong className="font-mono text-slate-900 tabular-nums">
                    {employee.id}
                  </strong>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>
                  Hired:{' '}
                  <strong className="font-mono text-slate-900 tabular-nums">
                    {employee.dateHired}
                  </strong>{' '}
                  ({calculateTenure(employee.dateHired)})
                </span>
              </div>
            </div>
          </div>

          {/* Completeness Meter */}
          <div className="w-full lg:w-72 bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">201 Statutory Completeness</span>
              <span
                className={`font-mono font-bold text-xs ${
                  completeness.isComplete ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                {completeness.percentage}% ({completeness.completedMandatory}/{completeness.totalMandatory})
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  completeness.isComplete ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
                style={{ width: `${completeness.percentage}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-500">
              {completeness.isComplete ? (
                <span className="text-emerald-700 flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  All mandatory civil service documents submitted.
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {completeness.missingMandatory.length} mandatory document{completeness.missingMandatory.length !== 1 ? 's' : ''} lacking.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2 rounded-md transition-colors ${
              activeTab === 'documents'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            201 Document Drawers ({documents.length} Files)
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 rounded-md transition-colors ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Personnel Service Profile
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 rounded-md transition-colors ${
              activeTab === 'audit'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            DPA Audit Trail ({employeeAuditLogs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: 201 Document Drawers (9 CSC Categories) */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Missing Documents Alert Banner */}
          {!completeness.isComplete && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Action Required: Incomplete 201 Personnel Documentation</span>
              </div>
              <p className="text-xs text-amber-800">
                The following mandatory credentials under Civil Service rules are missing from this personnel record:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {completeness.missingMandatory.map((miss) => (
                  <div
                    key={miss.key}
                    className="flex items-center justify-between p-2 bg-white rounded border border-amber-200 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-slate-800 truncate">{miss.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">{miss.category}</div>
                    </div>
                    {session.role === 'ADMIN' && (
                      <button
                        onClick={() => onOpenUpload(miss.category, miss.title)}
                        className="shrink-0 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-semibold rounded transition-colors"
                      >
                        Upload Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Drawer Expand / Collapse Controls */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500">
            <span>
              9 Standard Civil Service Document Categories · {documents.length} Total Attached Records
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="hover:text-slate-900 transition-colors"
              >
                Expand All
              </button>
              <span>·</span>
              <button
                onClick={collapseAll}
                className="hover:text-slate-900 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* The 9 Categories Accordion / Drawers */}
          <div className="space-y-3">
            {DOCUMENT_CATEGORIES.map((cat, idx) => {
              const catDocs = documents.filter((d) => d.category === cat);
              const isExpanded = Boolean(expandedCategories[cat]);
              const missingInCat = completeness.missingMandatory.filter((m) => m.category === cat);

              return (
                <div
                  key={cat}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs transition-shadow"
                >
                  {/* Category Drawer Header */}
                  <div
                    onClick={() => toggleCategory(cat)}
                    className="px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-4 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        0{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {cat}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>{catDocs.length} record{catDocs.length !== 1 ? 's' : ''} attached</span>
                          {missingInCat.length > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-700 font-semibold">
                                {missingInCat.length} missing required item
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {session.role === 'ADMIN' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenUpload(cat);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
                        >
                          + Add File
                        </button>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Category Drawer Body */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 space-y-2">
                      {/* Lacking items in this category prompt */}
                      {missingInCat.length > 0 && (
                        <div className="p-2.5 bg-amber-50/50 rounded border border-amber-200/80 mb-2 space-y-1">
                          <div className="text-[11px] font-bold text-amber-800">
                            Required Document Checklist:
                          </div>
                          {missingInCat.map((m) => (
                            <div key={m.key} className="text-xs text-amber-900 flex items-center justify-between">
                              <span>• {m.title}</span>
                              {session.role === 'ADMIN' && (
                                <button
                                  onClick={() => onOpenUpload(cat, m.title)}
                                  className="text-[10px] text-blue-700 hover:underline font-semibold"
                                >
                                  Upload
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {catDocs.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No documents currently filed under this category.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {catDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded transition-colors"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 bg-slate-100 rounded text-slate-600 shrink-0 mt-0.5">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                  <div className="text-xs font-bold text-slate-900 truncate">
                                    {doc.documentTitle}
                                  </div>
                                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                                    <span className="font-mono">{doc.fileName}</span>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-mono tabular-nums">{formatFileSize(doc.fileSize)}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>Uploaded: <span className="font-mono tabular-nums">{new Date(doc.uploadDate).toLocaleDateString()}</span></span>
                                    <span aria-hidden="true">·</span>
                                    <span>By {doc.uploadedBy.split(' ')[0]}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Document Action Buttons */}
                              <div className="flex items-center gap-1.5 shrink-0 pl-9 sm:pl-0">
                                <button
                                  onClick={() => onPreviewDocument(doc)}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
                                  title="View document in interactive viewer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Preview</span>
                                </button>

                                <button
                                  onClick={() => onDownloadDocument(doc)}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
                                  title="Download copy to computer"
                                >
                                  <Download className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Download</span>
                                </button>

                                {session.role === 'ADMIN' && (
                                  <button
                                    onClick={() => onDeleteDocument(doc.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                    title="Delete document from 201 file"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Personnel Service Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Official Personnel Profile Record
            </h3>
            {session.role === 'ADMIN' && (
              <button
                onClick={onEdit}
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Modify Details</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Plantilla / Appointment details */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                Civil Service &amp; Plantilla Details
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Employee ID:</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{employee.id}</span>

                <span className="text-slate-500">Designation:</span>
                <span className="col-span-2 font-semibold text-slate-900">{employee.position}</span>

                <span className="text-slate-500">Department:</span>
                <span className="col-span-2 text-slate-900">{employee.department}</span>

                <span className="text-slate-500">Employment Status:</span>
                <span className="col-span-2 font-semibold text-slate-900">{employee.employmentStatus}</span>

                <span className="text-slate-500">Date Hired:</span>
                <span className="col-span-2 font-mono text-slate-900">{employee.dateHired}</span>

                <span className="text-slate-500">Length of Service:</span>
                <span className="col-span-2 text-slate-900">{calculateTenure(employee.dateHired)}</span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
                Personal Identification &amp; Contact
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Full Name:</span>
                <span className="col-span-2 font-semibold text-slate-900">
                  {employee.firstName} {employee.middleName} {employee.lastName} {employee.suffix || ''}
                </span>

                <span className="text-slate-500">Date of Birth:</span>
                <span className="col-span-2 font-mono text-slate-900">
                  {employee.dateOfBirth} ({calculateAge(employee.dateOfBirth)} years old)
                </span>

                <span className="text-slate-500">Official Email:</span>
                <span className="col-span-2 text-slate-900">{employee.email || '—'}</span>

                <span className="text-slate-500">Contact Number:</span>
                <span className="col-span-2 font-mono text-slate-900">{employee.phone || '—'}</span>

                <span className="text-slate-500">Residential Address:</span>
                <span className="col-span-2 text-slate-900 leading-relaxed">{employee.address || '—'}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-[11px] text-slate-400 flex flex-wrap justify-between gap-2">
            <span>Record Created: <span className="font-mono">{new Date(employee.createdAt).toLocaleString()}</span></span>
            <span>Last Updated: <span className="font-mono">{new Date(employee.updatedAt).toLocaleString()}</span></span>
          </div>
        </div>
      )}

      {/* TAB 3: DPA Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Security &amp; Access Log for {employee.id}
              </h3>
              <p className="text-[11px] text-slate-500">
                Permanent chronological record under Republic Act No. 10173 (Data Privacy Act of 2012)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {employeeAuditLogs.length} events recorded
            </span>
          </div>

          {employeeAuditLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No audit records currently found for this employee ID.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2.5 px-4 font-mono text-[11px]">Timestamp (UTC)</th>
                    <th className="py-2.5 px-4">Authorized Actor</th>
                    <th className="py-2.5 px-4">Action Taken</th>
                    <th className="py-2.5 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employeeAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {log.actorName} ({log.actorRole})
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-[11px] px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 leading-normal">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
