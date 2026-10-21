import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  FolderOpen,
  Edit,
  Archive,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  FileText,
  X,
  ChevronRight,
} from 'lucide-react';
import { Employee, EmploymentStatus, DocumentItem, UserSession, STANDARD_DEPARTMENTS } from '../types';
import { calculateCompleteness } from '../utils/completeness';

interface EmployeeDirectoryViewProps {
  employees: Employee[];
  documents: DocumentItem[];
  session: UserSession;
  onSelectEmployee: (emp: Employee) => void;
  onOpenAddModal: () => void;
  onEditEmployee: (emp: Employee) => void;
  onArchiveEmployee: (emp: Employee) => void;
  onRestoreEmployee: (emp: Employee) => void;
}

export const EmployeeDirectoryView: React.FC<EmployeeDirectoryViewProps> = ({
  employees,
  documents,
  session,
  onSelectEmployee,
  onOpenAddModal,
  onEditEmployee,
  onArchiveEmployee,
  onRestoreEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE_ALL');
  const [completenessFilter, setCompletenessFilter] = useState<'ALL' | 'COMPLETE' | 'INCOMPLETE'>('ALL');

  // Extract unique departments
  const departments = useMemo(() => {
    const set = new Set<string>(STANDARD_DEPARTMENTS);
    employees.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set).sort();
  }, [employees]);

  // Pre-calculate completeness for all employees
  const completenessMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateCompleteness>>();
    employees.forEach((emp) => {
      const empDocs = documents.filter((d) => d.employeeId === emp.id);
      map.set(emp.id, calculateCompleteness(empDocs));
    });
    return map;
  }, [employees, documents]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return employees.filter((emp) => {
      // 1. Text Search: ID, Name, Position, Department
      if (query) {
        const fullName = `${emp.firstName} ${emp.middleName} ${emp.lastName} ${emp.suffix || ''}`.toLowerCase();
        const matchesId = emp.id.toLowerCase().includes(query);
        const matchesName = fullName.includes(query);
        const matchesPosition = emp.position.toLowerCase().includes(query);
        const matchesDept = emp.department.toLowerCase().includes(query);

        if (!matchesId && !matchesName && !matchesPosition && !matchesDept) {
          return false;
        }
      }

      // 2. Department filter
      if (selectedDepartment !== 'ALL' && emp.department !== selectedDepartment) {
        return false;
      }

      // 3. Status filter
      if (selectedStatus === 'ACTIVE_ALL') {
        if (emp.isArchived) return false;
      } else if (selectedStatus === 'ARCHIVED') {
        if (!emp.isArchived) return false;
      } else if (selectedStatus !== 'ALL') {
        if (emp.employmentStatus !== selectedStatus) return false;
      }

      // 4. Completeness filter
      if (completenessFilter !== 'ALL') {
        const comp = completenessMap.get(emp.id);
        if (completenessFilter === 'COMPLETE' && !comp?.isComplete) return false;
        if (completenessFilter === 'INCOMPLETE' && comp?.isComplete) return false;
      }

      return true;
    });
  }, [employees, searchQuery, selectedDepartment, selectedStatus, completenessFilter, completenessMap]);

  return (
    <div className="space-y-4">
      {/* View Header with Title and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Employee 201 Personnel Directory
          </h2>
          <p className="text-xs text-slate-500">
            Master repository of plantilla personnel records and attached civil service files
          </p>
        </div>

        {session.role === 'ADMIN' && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {/* Prominent Search & Basic Filter Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Employee ID (e.g. EMP-2024-001), Employee Name, Position, or Department..."
            className="w-full pl-10 pr-10 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Department Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Department:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              >
                <option value="ACTIVE_ALL">Active Personnel Only</option>
                <option value="Permanent">Permanent</option>
                <option value="Casual">Casual</option>
                <option value="Contractual">Contractual</option>
                <option value="Co-Terminus">Co-Terminus</option>
                <option value="ARCHIVED">Archived / Separated</option>
                <option value="ALL">All Records (Inc. Archived)</option>
              </select>
            </div>

            {/* Completeness Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">201 Compliance:</span>
              <select
                value={completenessFilter}
                onChange={(e) => setCompletenessFilter(e.target.value as any)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              >
                <option value="ALL">All Compliance Levels</option>
                <option value="COMPLETE">Complete (100% Submitted)</option>
                <option value="INCOMPLETE">Incomplete (Needs Attention)</option>
              </select>
            </div>
          </div>

          <div className="text-slate-500 text-[11px] font-mono tabular-nums">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </div>
      </div>

      {/* High-Density Tabular Directory Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        {filteredEmployees.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">No personnel records found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No employees match the current search term or filter criteria. Try adjusting your query or filters.
              </p>
            </div>
            {(searchQuery || selectedDepartment !== 'ALL' || selectedStatus !== 'ACTIVE_ALL' || completenessFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('ALL');
                  setSelectedStatus('ACTIVE_ALL');
                  setCompletenessFilter('ALL');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold select-none">
                  <th className="py-3 px-4 font-mono text-[11px]">Employee ID</th>
                  <th className="py-3 px-4">Complete Name</th>
                  <th className="py-3 px-4">Position / Designation</th>
                  <th className="py-3 px-4">Office / Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 font-mono text-[11px]">Date Hired</th>
                  <th className="py-3 px-4">201 Completeness</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const comp = completenessMap.get(emp.id);
                  const isComplete = comp?.isComplete;
                  const pct = comp?.percentage ?? 0;

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* ID Number */}
                      <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {emp.id}
                      </td>

                      {/* Complete Name */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                          {emp.firstName} {emp.middleName ? `${emp.middleName} ` : ''}{emp.lastName}{' '}
                          {emp.suffix && <span className="font-normal text-slate-500">{emp.suffix}</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {emp.email || 'No email filed'}
                        </div>
                      </td>

                      {/* Position */}
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap font-medium">
                        {emp.position}
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate" title={emp.department}>
                        {emp.department}
                      </td>

                      {/* Employment Status */}
                      <td className="py-3 px-4 whitespace-nowrap text-xs">
                        {emp.isArchived ? (
                          <span className="text-slate-400 font-medium">Archived</span>
                        ) : (
                          <span className="font-semibold text-slate-700">
                            {emp.employmentStatus}
                          </span>
                        )}
                      </td>

                      {/* Date Hired */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 tabular-nums whitespace-nowrap">
                        {emp.dateHired}
                      </td>

                      {/* 201 Completeness */}
                      <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="w-36 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span
                              className={`font-semibold ${
                                isComplete ? 'text-emerald-700' : 'text-amber-700'
                              }`}
                            >
                              {isComplete ? 'Complete' : `${comp?.missingMandatory.length} Missing`}
                            </span>
                            <span className="font-mono text-slate-500 tabular-nums">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isComplete ? 'bg-emerald-600' : 'bg-amber-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectEmployee(emp)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors"
                            title="Open dedicated 201 File Drawer"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>201 File</span>
                          </button>

                          {session.role === 'ADMIN' && (
                            <>
                              <button
                                onClick={() => onEditEmployee(emp)}
                                className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                                title="Edit employee information"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {emp.isArchived ? (
                                <button
                                  onClick={() => onRestoreEmployee(emp)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                  title="Restore archived record"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => onArchiveEmployee(emp)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                  title="Archive employee record"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
