import React from 'react';
import { X, CheckCircle2, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onGetStarted,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'Log in to the Application',
      desc: 'Access the system using your authorized HR credentials. Roles are separated between HR Administrator (full add/edit/upload/archive privileges) and Read-Only Staff (view-only inspection).',
    },
    {
      num: '2',
      title: 'View the Employee Masterlist',
      desc: 'Browse all active plantilla personnel and contractual staff in a clean tabular directory showing plantilla item numbers, positions, and current 201 file completeness.',
    },
    {
      num: '3',
      title: 'Search or Filter Employees',
      desc: 'Instantly find personnel records by typing an Employee ID, full or partial name, position, or official department in the prominent live search bar.',
    },
    {
      num: '4',
      title: 'Open Dedicated 201 File Drawer',
      desc: 'Click on any employee row or "Open 201 File" button to access their secure personnel repository organized into the 9 standard Philippine Civil Service categories.',
    },
    {
      num: '5',
      title: 'Upload, View, or Download Documents',
      desc: 'Upload common document formats (PDF, JPG, PNG, DOCX) directly into the proper folder. Preview documents inside an interactive viewer with zoom/rotate controls, or download them securely.',
    },
    {
      num: '6',
      title: 'Check Completeness of Required Documents',
      desc: 'Monitor the automated statutory completeness meter. The system flags missing mandatory civil service credentials such as CSC Form 212 (PDS), Oath of Office, Medical Certificate, and SALN.',
    },
    {
      num: '7',
      title: 'Generate Official Compliance Reports',
      desc: 'Download one-click Excel/CSV rosters, generate missing-document compliance audit summaries for management review, and export the RA 10173 immutable activity log.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-xs">
              CSC
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                HR 201 Files Standard Operating Procedure
              </h2>
              <p className="text-xs text-slate-500">
                User Guide &amp; 7-Step Personnel Filing Workflow
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

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Data Privacy Act of 2012 (RA 10173) Notice:</strong> Personnel records and 201 files contain sensitive personal information (SPI). All views, downloads, uploads, and changes are recorded with your official timestamp in the audit trail.
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {steps.map((step) => (
              <div key={step.num} className="py-3 flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Compliant with Civil Service Commission (CSC) Memorandum Circulars
          </span>
          <button
            onClick={() => {
              onClose();
              onGetStarted();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors"
          >
            <span>Proceed to Records</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
