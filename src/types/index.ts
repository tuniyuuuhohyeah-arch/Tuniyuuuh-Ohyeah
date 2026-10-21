/**
 * Data structures for Republic HR 201 Files Management System
 * Compliant with Philippine Civil Service Commission (CSC) records standards and RA 10173 (Data Privacy Act of 2012).
 */

export type EmploymentStatus = 'Permanent' | 'Casual' | 'Contractual' | 'Co-Terminus' | 'Archived';

export interface Employee {
  id: string; // Employee ID Number (e.g. EMP-2024-001)
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  position: string;
  department: string;
  employmentStatus: EmploymentStatus;
  dateHired: string; // YYYY-MM-DD
  dateOfBirth: string; // YYYY-MM-DD
  email: string;
  phone: string;
  address: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export const STANDARD_DEPARTMENTS = [
  'Human Resource Management Office',
  'Field Operations Division',
  'Records & Archives Management Division',
  'Financial & Management Planning Division',
  'Administrative Service Division',
  'Management Information Systems Division',
  'Legal & Adjudication Service',
  'Internal Audit Unit',
  'Planning & Policy Division',
  'Office of the Director General',
];

export type DocumentCategory =
  | 'Personal Information and Application Documents'
  | 'Appointment and Employment Documents'
  | 'Oath of Office and Assumption Documents'
  | 'Eligibility and Educational Records'
  | 'Performance Evaluation'
  | 'Leave and Attendance Records'
  | 'Training and Seminars'
  | 'Medical and Other Required Documents'
  | 'Other Supporting Documents';

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'Personal Information and Application Documents',
  'Appointment and Employment Documents',
  'Oath of Office and Assumption Documents',
  'Eligibility and Educational Records',
  'Performance Evaluation',
  'Leave and Attendance Records',
  'Training and Seminars',
  'Medical and Other Required Documents',
  'Other Supporting Documents',
];

export type DocumentFileType = 'pdf' | 'jpg' | 'png' | 'docx' | 'other';
export type DocumentVerificationStatus = 'Verified' | 'Pending Review';

export interface DocumentItem {
  id: string;
  employeeId: string;
  category: DocumentCategory;
  documentTitle: string;
  fileName: string;
  fileType: DocumentFileType;
  fileSize: number; // bytes
  uploadDate: string; // ISO date string
  uploadedBy: string;
  status: DocumentVerificationStatus;
  isRequired: boolean;
  dataUrl?: string; // base64 / blob / sample content for preview and download
  notes?: string;
}

export interface MandatoryDocDef {
  key: string;
  category: DocumentCategory;
  title: string;
  description: string;
}

export interface CompletenessResult {
  totalMandatory: number;
  completedMandatory: number;
  percentage: number;
  isComplete: boolean;
  missingMandatory: MandatoryDocDef[];
  submittedMandatory: DocumentItem[];
}

export type UserRole = 'ADMIN' | 'READ_ONLY';

export interface UserSession {
  username: string;
  name: string;
  title: string;
  role: UserRole;
  isAuthenticated: boolean;
  isLocked: boolean;
  lastActivity: number;
}

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW_RECORD'
  | 'CREATE_RECORD'
  | 'UPDATE_RECORD'
  | 'ARCHIVE_RECORD'
  | 'RESTORE_RECORD'
  | 'UPLOAD_DOCUMENT'
  | 'DELETE_DOCUMENT'
  | 'DOWNLOAD_DOCUMENT'
  | 'EXPORT_REPORT'
  | 'LOCK_SESSION'
  | 'UNLOCK_SESSION';

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: AuditActionType;
  employeeId?: string;
  employeeName?: string;
  details: string;
}
