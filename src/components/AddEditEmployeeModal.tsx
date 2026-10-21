import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { Employee, EmploymentStatus, STANDARD_DEPARTMENTS } from '../types';

interface AddEditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Employee, 'createdAt' | 'updatedAt' | 'isArchived'>) => { success: boolean; error?: string };
  initialData?: Employee | null;
  existingEmployees: Employee[];
}

export const AddEditEmployeeModal: React.FC<AddEditEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingEmployees,
}) => {
  const isEditing = Boolean(initialData);

  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('Human Resource Management Office');
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>('Permanent');
  const [dateHired, setDateHired] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setFirstName(initialData.firstName);
      setMiddleName(initialData.middleName || '');
      setLastName(initialData.lastName);
      setSuffix(initialData.suffix || '');
      setPosition(initialData.position);
      setDepartment(initialData.department);
      setEmploymentStatus(initialData.employmentStatus);
      setDateHired(initialData.dateHired);
      setDateOfBirth(initialData.dateOfBirth);
      setEmail(initialData.email);
      setPhone(initialData.phone);
      setAddress(initialData.address);
    } else {
      // Auto-suggest next employee ID
      const year = new Date().getFullYear();
      const count = existingEmployees.length + 1;
      const formattedNum = String(count).padStart(4, '0');
      setId(`EMP-${year}-${formattedNum}`);

      setFirstName('');
      setMiddleName('');
      setLastName('');
      setSuffix('');
      setPosition('');
      setDepartment('Human Resource Management Office');
      setEmploymentStatus('Permanent');
      setDateHired(new Date().toISOString().split('T')[0]);
      setDateOfBirth('1990-01-01');
      setEmail('');
      setPhone('+63 9');
      setAddress('');
    }
    setError(null);
  }, [initialData, isOpen, existingEmployees.length]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = id.trim().toUpperCase();

    // Validation
    if (!cleanId) {
      setError('Employee ID Number is required.');
      return;
    }

    if (!isEditing) {
      const duplicate = existingEmployees.some((emp) => emp.id.toUpperCase() === cleanId);
      if (duplicate) {
        setError(`Employee ID "${cleanId}" is already assigned to another employee. Duplicate IDs are prohibited.`);
        return;
      }
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('Both First Name and Last Name are required.');
      return;
    }

    if (!position.trim()) {
      setError('Position / Designation is required.');
      return;
    }

    if (!department.trim()) {
      setError('Office / Department is required.');
      return;
    }

    if (!dateHired) {
      setError('Date Hired is required.');
      return;
    }

    if (!dateOfBirth) {
      setError('Date of Birth is required.');
      return;
    }

    const result = onSave({
      id: cleanId,
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      suffix: suffix.trim() || undefined,
      position: position.trim(),
      department: department.trim(),
      employmentStatus,
      dateHired,
      dateOfBirth,
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    if (!result.success) {
      setError(result.error || 'Failed to save employee record.');
    } else {
      onClose();
    }
  };

  const departmentsList = STANDARD_DEPARTMENTS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center">
              {isEditing ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Employee Personnel Record' : 'Add New Plantilla Employee'}
              </h3>
              <p className="text-xs text-slate-500">
                Official 201 Personnel Record Entry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Employee ID and Employment Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
              Plantilla &amp; Appointment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee ID Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={id}
                  disabled={isEditing}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g., EMP-2026-0045"
                  className={`w-full px-3 py-2 text-xs border rounded-md font-mono focus:ring-2 focus:ring-slate-900 focus:outline-hidden ${
                    isEditing ? 'bg-slate-100 text-slate-500 border-slate-200' : 'border-slate-300'
                  }`}
                />
                {!isEditing && (
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Unique official identification number</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employment Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value as EmploymentStatus)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden bg-white"
                >
                  <option value="Permanent">Permanent (Regular Plantilla)</option>
                  <option value="Casual">Casual</option>
                  <option value="Contractual">Contractual / COS</option>
                  <option value="Co-Terminus">Co-Terminus</option>
                  {isEditing && <option value="Archived">Archived / Separated</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date Hired (Assumption) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateHired}
                  onChange={(e) => setDateHired(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Position / Plantilla Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g., Administrative Officer V or Director III"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Office / Department / Division <span className="text-rose-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden bg-white"
                >
                  {departmentsList.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Complete Name */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
              Personal Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g., Maria Elena"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="e.g., Santos"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g., Del Rosario"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Suffix
                </label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g., Jr., III, CPA"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username@agency.gov.ph"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: Residential Address */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
              Residential Address
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complete Residential Address (House/Lot, Street, Barangay, Municipality/City, Province)
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Block 14 Lot 8, San Lorenzo Village, Makati City, Metro Manila"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Create 201 Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
