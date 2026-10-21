/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Employee,
  DocumentItem,
  AuditLog,
  UserSession,
  UserRole,
  DocumentCategory,
} from './types';
import { StorageService } from './services/storage';
import { TopNavigation } from './components/TopNavigation';
import { DashboardView } from './components/DashboardView';
import { EmployeeDirectoryView } from './components/EmployeeDirectoryView';
import { EmployeeDetailView } from './components/EmployeeDetailView';
import { ReportsView } from './components/ReportsView';
import { AuditLogView } from './components/AuditLogView';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { AddEditEmployeeModal } from './components/AddEditEmployeeModal';
import { SessionLockModal } from './components/SessionLockModal';
import { UserGuideModal } from './components/UserGuideModal';
import { LoginView } from './components/LoginView';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  // Session & Auth state
  const [session, setSession] = useState<UserSession>(() => StorageService.getSession());

  // Navigation views
  const [currentView, setCurrentView] = useState<'dashboard' | 'employees' | 'employee-detail' | 'reports' | 'audit'>('dashboard');

  // Core Data Collections
  const [employees, setEmployees] = useState<Employee[]>(() => StorageService.getEmployees());
  const [documents, setDocuments] = useState<DocumentItem[]>(() => StorageService.getDocuments());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());

  // Selected Employee for Detailed 201 File View
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadDefaultCategory, setUploadDefaultCategory] = useState<DocumentCategory | undefined>(undefined);
  const [uploadDefaultTitle, setUploadDefaultTitle] = useState<string | undefined>(undefined);

  const [previewDocument, setPreviewDocument] = useState<DocumentItem | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // User Notification Banner
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  // Sync session changes to storage
  const updateSession = useCallback((newSession: UserSession) => {
    setSession(newSession);
    StorageService.saveSession(newSession);
  }, []);

  // Activity listener for automatic 15-minute inactivity lock (RA 10173 compliance)
  useEffect(() => {
    const handleUserActivity = () => {
      if (session.isAuthenticated && !session.isLocked) {
        session.lastActivity = Date.now();
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    // 30-second interval check
    const interval = setInterval(() => {
      if (session.isAuthenticated && !session.isLocked) {
        const timeoutMs = 15 * 60 * 1000; // 15 minutes
        if (Date.now() - session.lastActivity > timeoutMs) {
          updateSession({ ...session, isLocked: true });
          StorageService.addAuditLog({
            actorName: session.name,
            actorRole: session.role,
            action: 'LOCK_SESSION',
            details: 'Workstation automatically locked after 15 minutes of inactivity (RA 10173).',
          });
          setAuditLogs(StorageService.getAuditLogs());
        }
      }
    }, 30000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      clearInterval(interval);
    };
  }, [session, updateSession]);

  // Selected employee object
  const currentEmployee = employees.find((e) => e.id === selectedEmployeeId);

  // Handlers for Employee Actions
  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmployeeId(emp.id);
    setCurrentView('employee-detail');

    // Audit Log for Viewing record
    StorageService.addAuditLog({
      actorName: session.name,
      actorRole: session.role,
      action: 'VIEW_RECORD',
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      details: `Opened 201 personnel records drawer for ${emp.position} in ${emp.department}.`,
    });
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleOpenAddEmployee = () => {
    setEditingEmployee(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsAddEditModalOpen(true);
  };

  const handleSaveEmployee = (empData: Omit<Employee, 'createdAt' | 'updatedAt' | 'isArchived'>) => {
    if (editingEmployee) {
      const result = StorageService.updateEmployee(
        editingEmployee.id,
        empData,
        session.name,
        session.role
      );
      if (result.success) {
        setEmployees(StorageService.getEmployees());
        setAuditLogs(StorageService.getAuditLogs());
        showToast(`Employee record for ${empData.firstName} ${empData.lastName} successfully updated.`);
        return { success: true };
      }
      return { success: false, error: result.error };
    } else {
      const result = StorageService.saveEmployee(empData, session.name, session.role);
      if (result.success && result.employee) {
        setEmployees(StorageService.getEmployees());
        setAuditLogs(StorageService.getAuditLogs());
        showToast(`Employee record ${result.employee.id} successfully created.`);
        return { success: true };
      }
      return { success: false, error: result.error };
    }
  };

  const handleArchiveEmployee = (emp: Employee) => {
    if (confirm(`Are you sure you want to archive personnel record for ${emp.firstName} ${emp.lastName} (${emp.id})? Archived records are retained according to Civil Service retention schedules.`)) {
      const res = StorageService.archiveEmployee(emp.id, session.name, session.role);
      if (res.success) {
        setEmployees(StorageService.getEmployees());
        setAuditLogs(StorageService.getAuditLogs());
        showToast(`Employee ${emp.id} archived.`);
      }
    }
  };

  const handleRestoreEmployee = (emp: Employee) => {
    const res = StorageService.restoreEmployee(emp.id, session.name, session.role);
    if (res.success) {
      setEmployees(StorageService.getEmployees());
      setAuditLogs(StorageService.getAuditLogs());
      showToast(`Employee ${emp.id} restored to active status.`);
    }
  };

  // Document Handlers
  const handleOpenUpload = (cat?: DocumentCategory, title?: string) => {
    setUploadDefaultCategory(cat);
    setUploadDefaultTitle(title);
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = (docData: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const empName = currentEmployee
      ? `${currentEmployee.firstName} ${currentEmployee.lastName}`
      : undefined;

    const result = StorageService.addDocument(docData, session.name, session.role, empName);
    if (result.success) {
      setDocuments(StorageService.getDocuments());
      setAuditLogs(StorageService.getAuditLogs());
      showToast(`Document "${docData.documentTitle}" successfully uploaded to 201 file.`);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm('Are you sure you want to delete this document from the 201 file? This action will be recorded in the Data Privacy audit trail.')) {
      const empName = currentEmployee
        ? `${currentEmployee.firstName} ${currentEmployee.lastName}`
        : undefined;

      const res = StorageService.deleteDocument(docId, session.name, session.role, empName);
      if (res.success) {
        setDocuments(StorageService.getDocuments());
        setAuditLogs(StorageService.getAuditLogs());
        showToast('Document deleted from 201 file.');
      }
    }
  };

  const handleDownloadDocument = (doc: DocumentItem) => {
    // Audit Log for downloading
    StorageService.addAuditLog({
      actorName: session.name,
      actorRole: session.role,
      action: 'DOWNLOAD_DOCUMENT',
      employeeId: doc.employeeId,
      employeeName: currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : undefined,
      details: `Downloaded confidential file "${doc.documentTitle}" (${doc.fileName}) from 201 file.`,
    });
    setAuditLogs(StorageService.getAuditLogs());

    // Execute Real Browser File Download
    if (doc.dataUrl) {
      const link = document.createElement('a');
      link.href = doc.dataUrl;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloading ${doc.fileName}...`);
    } else {
      // Fallback text file
      const content = `Republic of the Philippines - Civil Service 201 Record\nDocument: ${doc.documentTitle}\nEmployee ID: ${doc.employeeId}\nCategory: ${doc.category}\nUpload Date: ${doc.uploadDate}\nUploaded By: ${doc.uploadedBy}\nStatus: ${doc.status}\n\n[Confidential Personnel Document - R.A. 10173 Protected]`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName || `${doc.documentTitle.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Downloaded archive record for ${doc.fileName}`);
    }
  };

  // Session Handlers
  const handleLogin = (newSession: UserSession) => {
    updateSession(newSession);
    StorageService.addAuditLog({
      actorName: newSession.name,
      actorRole: newSession.role,
      action: 'LOGIN',
      details: `User signed in successfully with ${newSession.role} role.`,
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Welcome, ${newSession.name}!`);
  };

  const handleLogout = () => {
    StorageService.addAuditLog({
      actorName: session.name,
      actorRole: session.role,
      action: 'LOGOUT',
      details: 'User logged out of the HR 201 system.',
    });
    setAuditLogs(StorageService.getAuditLogs());
    updateSession({
      ...session,
      isAuthenticated: false,
    });
    showToast('Logged out safely.');
  };

  const handleLockSession = () => {
    updateSession({ ...session, isLocked: true });
    StorageService.addAuditLog({
      actorName: session.name,
      actorRole: session.role,
      action: 'LOCK_SESSION',
      details: 'Workstation manually locked by user (RA 10173 security precaution).',
    });
    setAuditLogs(StorageService.getAuditLogs());
  };

  const handleUnlockSession = () => {
    updateSession({ ...session, isLocked: false, lastActivity: Date.now() });
    StorageService.addAuditLog({
      actorName: session.name,
      actorRole: session.role,
      action: 'UNLOCK_SESSION',
      details: 'Workstation unlocked successfully with valid credential verification.',
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast('Workstation unlocked.');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const updatedName = newRole === 'ADMIN' ? 'Atty. Mario L. Reyes' : 'Clarissa M. Gomez, CPA';
    const updatedTitle = newRole === 'ADMIN' ? 'Chief Administrative Officer (HRMO V)' : 'State Auditor IV (COA Inspection)';

    const newSession: UserSession = {
      ...session,
      role: newRole,
      name: updatedName,
      title: updatedTitle,
      username: newRole === 'ADMIN' ? 'admin.mario' : 'auditor.gomez',
    };

    updateSession(newSession);
    StorageService.addAuditLog({
      actorName: newSession.name,
      actorRole: newSession.role,
      action: 'LOGIN',
      details: `Switched active access role to ${newRole}.`,
    });
    setAuditLogs(StorageService.getAuditLogs());
    showToast(`Switched active mode to ${newRole === 'ADMIN' ? 'HR Administrator' : 'Read-Only Auditor'}.`);
  };

  // If user is not authenticated, show login gateway
  if (!session.isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold border ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-rose-900 text-white border-rose-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white ml-2 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Top Bar (Contract: 1 Brand Wordmark, 4-5 Nav Links, 1 Profile/Action) */}
      <TopNavigation
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'employees') {
            setSelectedEmployeeId(null);
          }
        }}
        session={session}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onLockSession={handleLockSession}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Render Active View */}
        {currentView === 'dashboard' && (
          <DashboardView
            employees={employees}
            documents={documents}
            auditLogs={auditLogs}
            session={session}
            onNavigateEmployees={() => setCurrentView('employees')}
            onSelectEmployee={handleSelectEmployee}
            onOpenAddModal={handleOpenAddEmployee}
            onNavigateReports={() => setCurrentView('reports')}
            onNavigateAudit={() => setCurrentView('audit')}
          />
        )}

        {currentView === 'employees' && (
          <EmployeeDirectoryView
            employees={employees}
            documents={documents}
            session={session}
            onSelectEmployee={handleSelectEmployee}
            onOpenAddModal={handleOpenAddEmployee}
            onEditEmployee={handleEditEmployee}
            onArchiveEmployee={handleArchiveEmployee}
            onRestoreEmployee={handleRestoreEmployee}
          />
        )}

        {currentView === 'employee-detail' && currentEmployee && (
          <EmployeeDetailView
            employee={currentEmployee}
            documents={documents.filter((d) => d.employeeId === currentEmployee.id)}
            auditLogs={auditLogs}
            session={session}
            onBack={() => {
              setCurrentView('employees');
              setSelectedEmployeeId(null);
            }}
            onEdit={() => handleEditEmployee(currentEmployee)}
            onArchive={() => handleArchiveEmployee(currentEmployee)}
            onRestore={() => handleRestoreEmployee(currentEmployee)}
            onOpenUpload={handleOpenUpload}
            onPreviewDocument={(doc) => setPreviewDocument(doc)}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {currentView === 'reports' && (
          <ReportsView
            employees={employees}
            documents={documents}
            auditLogs={auditLogs}
            session={session}
            onRecordAudit={(action, details) => {
              StorageService.addAuditLog({
                actorName: session.name,
                actorRole: session.role,
                action: action as any,
                details,
              });
              setAuditLogs(StorageService.getAuditLogs());
            }}
          />
        )}

        {currentView === 'audit' && (
          <AuditLogView
            auditLogs={auditLogs}
            session={session}
            onLockSession={handleLockSession}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Human Resource Information System (HRIS) · Civil Service Commission Compliance Standard
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Republic Act No. 10173 Protected</span>
            <button
              onClick={() => {
                if (confirm('Reset demo data to initial government seed records?')) {
                  StorageService.resetAllData();
                  setEmployees(StorageService.getEmployees());
                  setDocuments(StorageService.getDocuments());
                  setAuditLogs(StorageService.getAuditLogs());
                  setSession(StorageService.getSession());
                  showToast('Database reset to initial sample state.');
                }
              }}
              className="text-slate-400 hover:text-slate-700 underline"
            >
              Reset Sample Data
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {/* 1. Add / Edit Employee Modal */}
      <AddEditEmployeeModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
        existingEmployees={employees}
      />

      {/* 2. Upload Document Modal */}
      {currentEmployee && (
        <UploadDocumentModal
          isOpen={isUploadModalOpen}
          employeeId={currentEmployee.id}
          employeeName={`${currentEmployee.firstName} ${currentEmployee.lastName}`}
          defaultCategory={uploadDefaultCategory}
          defaultTitle={uploadDefaultTitle}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
          currentUserName={session.name}
        />
      )}

      {/* 3. Document Interactive Preview Modal */}
      <DocumentPreviewModal
        document={previewDocument}
        employeeName={currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : undefined}
        onClose={() => setPreviewDocument(null)}
        onDownload={handleDownloadDocument}
      />

      {/* 4. First-Time User Guide Modal */}
      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onGetStarted={() => setCurrentView('employees')}
      />

      {/* 5. Workstation Auto-Lock Modal (RA 10173 Inactivity Protection) */}
      {session.isLocked && (
        <SessionLockModal
          session={session}
          onUnlock={handleUnlockSession}
        />
      )}
    </div>
  );
}
