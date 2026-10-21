import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileCheck,
  FileText,
  AlertCircle,
  FolderOpen,
  Check,
} from 'lucide-react';
import {
  DocumentCategory,
  DOCUMENT_CATEGORIES,
  DocumentFileType,
  DocumentVerificationStatus,
  DocumentItem,
} from '../types';

interface UploadDocumentModalProps {
  isOpen: boolean;
  employeeId: string;
  employeeName: string;
  defaultCategory?: DocumentCategory;
  defaultTitle?: string;
  onClose: () => void;
  onUploadSuccess: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  currentUserName: string;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  employeeId,
  employeeName,
  defaultCategory,
  defaultTitle,
  onClose,
  onUploadSuccess,
  currentUserName,
}) => {
  const [category, setCategory] = useState<DocumentCategory>(
    defaultCategory || 'Personal Information and Application Documents'
  );
  const [documentTitle, setDocumentTitle] = useState(defaultTitle || '');
  const [verificationStatus, setVerificationStatus] = useState<DocumentVerificationStatus>('Verified');
  const [isRequired, setIsRequired] = useState(true);
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Standard recommended titles based on selected category
  const getCategoryRecommendations = (cat: DocumentCategory) => {
    switch (cat) {
      case 'Personal Information and Application Documents':
        return [
          'Personal Data Sheet (CS Form 212 Revised 2017)',
          'Work Experience Sheet (Attachment to CS Form 212)',
          'PSA Authenticated Certificate of Live Birth',
          'PSA Marriage Certificate',
          'NBI Clearance Certificate',
          'Police Clearance',
        ];
      case 'Appointment and Employment Documents':
        return [
          'CSC Form 33 Appointment Paper',
          'Position Description Form (PDF)',
          'Plantilla Item Certification',
          'Contract of Service / Job Order Agreement',
          'Notice of Salary Increment (NOSI)',
          'Notice of Salary Adjustment (NOSA)',
        ];
      case 'Oath of Office and Assumption Documents':
        return [
          'Panunumpa sa Katungkulan (Oath of Office)',
          'Certificate of Assumption to Duty',
          'Turnover Certificate / Clearance',
        ];
      case 'Eligibility and Educational Records':
        return [
          'Certificate of Eligibility (CSC Professional / Subprofessional)',
          'PRC Board Rating Certificate & Professional License',
          'Bar Rating Certificate & Supreme Court Roll Number',
          'Official Transcript of Records (TOR)',
          'College Diploma / Certificate of Graduation',
          'Post-Graduate Degree Certificate (Masteral/Doctorate)',
        ];
      case 'Performance Evaluation':
        return [
          'Individual Performance Commitment and Review (IPCR) Summary',
          'Division Performance Commitment and Review (DPCR)',
          'Office Performance Commitment and Review (OPCR)',
          'Performance Appraisal Report for Casual/Contractual',
        ];
      case 'Leave and Attendance Records':
        return [
          'Application for Leave (CSC Form No. 6 Revised 2020)',
          'Certificate of Leave Credits Balance',
          'Daily Time Record (DTR Form 48) Summary',
          'Maternity / Paternity / Solo Parent Leave Certification',
        ];
      case 'Training and Seminars':
        return [
          'Certificate of Training Completion (40 Hours or above)',
          'Special Order for Attendance to Local/Foreign Training',
          'Post-Training Echo Report and Action Plan',
          'Supervisory Development Course (SDC) Certificate',
        ];
      case 'Medical and Other Required Documents':
        return [
          'CS Form 211 Medical Certificate & Diagnostic Clearance',
          'Drug Test Certificate (Accredited DOH Laboratory)',
          'Chest X-Ray / Radiologic Report',
          'Neuro-Psychiatric Examination Clearance',
        ];
      case 'Other Supporting Documents':
        return [
          'Statement of Assets, Liabilities and Net Worth (SALN)',
          'Service Record Certificate (Updated)',
          'Certificate of Commendation / Honor Award',
          'GSIS / PhilHealth / Pag-IBIG Member Record',
        ];
      default:
        return [];
    }
  };

  const handleFileChange = (file: File) => {
    setError(null);
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!hasValidExt) {
      setError('Please select a valid document format: PDF, JPG, PNG, or DOCX.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB maximum limit.');
      return;
    }

    setSelectedFile(file);

    // If document title is empty, pre-fill from filename
    if (!documentTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setDocumentTitle(cleanName);
    }

    // Read data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentTitle.trim()) {
      setError('Document Name/Title is required.');
      return;
    }

    if (!selectedFile) {
      setError('Please choose or drop a file to upload.');
      return;
    }

    setIsProcessing(true);

    let fileType: DocumentFileType = 'pdf';
    const lowerName = selectedFile.name.toLowerCase();
    if (lowerName.endsWith('.pdf')) fileType = 'pdf';
    else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) fileType = 'jpg';
    else if (lowerName.endsWith('.png')) fileType = 'png';
    else if (lowerName.endsWith('.docx')) fileType = 'docx';
    else fileType = 'other';

    onUploadSuccess({
      employeeId,
      category,
      documentTitle: documentTitle.trim(),
      fileName: selectedFile.name,
      fileType,
      fileSize: selectedFile.size,
      uploadedBy: currentUserName,
      status: verificationStatus,
      isRequired,
      dataUrl: fileDataUrl || undefined,
      notes: notes.trim() || undefined,
    });

    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-900 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Upload 201 Personnel Document
              </h3>
              <p className="text-xs text-slate-500">
                Employee: <strong className="text-slate-800">{employeeName}</strong> ({employeeId})
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Document Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as DocumentCategory);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden bg-white"
            >
              {DOCUMENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Document Title with Quick Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Document Name / Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Official civil service form title</span>
            </div>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g., CS Form 212 Personal Data Sheet or CSC Form 33 Appointment"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />

            {/* Quick Suggestions */}
            <div className="mt-2">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                Common Standard Forms in this Category:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getCategoryRecommendations(category).slice(0, 4).map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setDocumentTitle(rec)}
                    className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded text-slate-700 transition-colors text-left"
                  >
                    + {rec.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Drag & Drop File Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select or Drop File <span className="text-rose-500">*</span>
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : selectedFile
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">{selectedFile.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB · Ready to save
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setFileDataUrl(null);
                    }}
                    className="ml-auto text-xs text-rose-600 hover:text-rose-800 underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs font-medium text-slate-700">
                    Click to browse or drag and drop personnel document here
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Supports PDF, JPG, PNG, and DOCX (Max 25MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Verification & Status Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Verification Status
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as DocumentVerificationStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden bg-white"
              >
                <option value="Verified">Verified &amp; Attested (Official)</option>
                <option value="Pending Review">Pending HR Review / Authentication</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="rounded border-slate-300 text-blue-900 focus:ring-slate-900"
                />
                <span>Mandatory / Statutory Requirement</span>
              </label>
            </div>
          </div>

          {/* 5. Notes / Document Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Remarks / Custodian Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Authenticated copy from Civil Service Commission Central Office"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
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
            disabled={isProcessing || !selectedFile}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{isProcessing ? 'Saving to 201 File...' : 'Upload & Archive Document'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
