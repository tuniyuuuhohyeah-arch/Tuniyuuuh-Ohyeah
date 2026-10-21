import {
  Employee,
  DocumentItem,
  AuditLog,
  UserSession,
  AuditActionType,
  DOCUMENT_CATEGORIES,
} from '../types';
import { generateSampleDocumentDataUrl } from './sampleDocs';

const STORAGE_KEYS = {
  EMPLOYEES: 'hr201_employees_v1',
  DOCUMENTS: 'hr201_documents_v1',
  AUDIT_LOGS: 'hr201_audit_logs_v1',
  SESSION: 'hr201_session_v1',
};

// Initial realistic seed employees (Philippine Civil Service / Government Agency)
const SEED_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-2021-0084',
    firstName: 'Maria Elena',
    middleName: 'Santos',
    lastName: 'Del Rosario',
    position: 'Director III',
    department: 'Human Resource Management Office',
    employmentStatus: 'Permanent',
    dateHired: '2021-03-15',
    dateOfBirth: '1982-08-24',
    email: 'm.delrosario@agency.gov.ph',
    phone: '+63 917 555 3821',
    address: 'Block 14 Lot 8, San Lorenzo Village, Makati City, Metro Manila',
    isArchived: false,
    createdAt: '2021-03-15T08:00:00.000Z',
    updatedAt: '2026-01-10T14:20:00.000Z',
  },
  {
    id: 'EMP-2022-0142',
    firstName: 'Juan Carlos',
    middleName: 'Bautista',
    lastName: 'Mendoza',
    position: 'Administrative Officer V (HRMO III)',
    department: 'Records & Archives Management Division',
    employmentStatus: 'Permanent',
    dateHired: '2022-06-01',
    dateOfBirth: '1988-11-12',
    email: 'jc.mendoza@agency.gov.ph',
    phone: '+63 928 412 9081',
    address: '45 Katipunan Avenue, Loyola Heights, Quezon City, Metro Manila',
    isArchived: false,
    createdAt: '2022-06-01T08:00:00.000Z',
    updatedAt: '2026-02-14T09:15:00.000Z',
  },
  {
    id: 'EMP-2023-0219',
    firstName: 'Corazon',
    middleName: 'Aquino',
    lastName: 'Fernandez',
    suffix: 'CPA',
    position: 'Supervising Administrative Officer',
    department: 'Financial & Management Planning Division',
    employmentStatus: 'Permanent',
    dateHired: '2023-01-16',
    dateOfBirth: '1985-05-30',
    email: 'c.fernandez@agency.gov.ph',
    phone: '+63 908 772 1944',
    address: 'Unit 12B Greenhills Tower, Ortigas Avenue, San Juan City',
    isArchived: false,
    createdAt: '2023-01-16T08:00:00.000Z',
    updatedAt: '2026-03-01T11:45:00.000Z',
  },
  {
    id: 'EMP-2024-0031',
    firstName: 'Rodrigo Nathaniel',
    middleName: 'Cruz',
    lastName: 'Villanueva',
    position: 'HR Management Officer II',
    department: 'Human Resource Management Office',
    employmentStatus: 'Casual',
    dateHired: '2024-02-01',
    dateOfBirth: '1995-09-18',
    email: 'rn.villanueva@agency.gov.ph',
    phone: '+63 919 823 4410',
    address: '77 Boni Serrano Avenue, Crame, Quezon City',
    isArchived: false,
    createdAt: '2024-02-01T08:00:00.000Z',
    updatedAt: '2026-02-28T16:00:00.000Z',
  },
  {
    id: 'EMP-2024-0088',
    firstName: 'Angelica Marie',
    middleName: 'Tan',
    lastName: 'Ramos',
    position: 'Information Technology Officer I',
    department: 'Management Information Systems Division',
    employmentStatus: 'Contractual',
    dateHired: '2024-07-01',
    dateOfBirth: '1997-04-03',
    email: 'am.ramos@agency.gov.ph',
    phone: '+63 995 311 0299',
    address: '22 Malakas Street, Pinyahan, Diliman, Quezon City',
    isArchived: false,
    createdAt: '2024-07-01T08:00:00.000Z',
    updatedAt: '2026-03-12T10:30:00.000Z',
  },
  {
    id: 'EMP-2023-0177',
    firstName: 'Gabriel',
    middleName: 'Alonzo',
    lastName: 'Navarro',
    position: 'Senior Field Operations Officer',
    department: 'Field Operations Division',
    employmentStatus: 'Permanent',
    dateHired: '2023-05-15',
    dateOfBirth: '1989-07-22',
    email: 'ga.navarro@agency.gov.ph',
    phone: '+63 918 642 7700',
    address: '18 Diamond Street, Marikina Heights, Marikina City',
    isArchived: false,
    createdAt: '2023-05-15T08:00:00.000Z',
    updatedAt: '2026-02-10T14:00:00.000Z',
  },
  {
    id: 'EMP-2020-0012',
    firstName: 'Vicente Paolo',
    middleName: 'Gonzales',
    lastName: 'Mercado',
    suffix: 'Esq.',
    position: 'Attorney IV',
    department: 'Legal & Adjudication Service',
    employmentStatus: 'Archived',
    dateHired: '2020-08-01',
    dateOfBirth: '1979-02-14',
    email: 'vp.mercado@agency.gov.ph',
    phone: '+63 917 888 2301',
    address: '109 Salcedo Village, Legaspi St, Makati City',
    isArchived: true,
    createdAt: '2020-08-01T08:00:00.000Z',
    updatedAt: '2025-11-30T17:00:00.000Z',
  },
];

// Helper to seed standard documents for initial employees
function generateSeedDocuments(): DocumentItem[] {
  const docs: DocumentItem[] = [];

  // Employee 1: Maria Elena Santos Del Rosario (Complete 100%)
  const emp1Docs = [
    { cat: 'Personal Information and Application Documents', title: 'Personal Data Sheet (CS Form 212 Revised 2017)', file: 'CS_Form_212_DelRosario.pdf', type: 'pdf', req: true },
    { cat: 'Personal Information and Application Documents', title: 'PSA Authenticated Certificate of Live Birth', file: 'PSA_BirthCert_DelRosario.pdf', type: 'pdf', req: true },
    { cat: 'Personal Information and Application Documents', title: 'NBI Clearance Certificate 2026', file: 'NBI_Clearance_2026.pdf', type: 'pdf', req: false },
    { cat: 'Appointment and Employment Documents', title: 'CSC Form 33 Appointment Paper (Director III)', file: 'CSC_Form_33_Appointment.pdf', type: 'pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'Position Description Form (PDF)', file: 'Position_Description_Form.pdf', type: 'pdf', req: true },
    { cat: 'Oath of Office and Assumption Documents', title: 'Panunumpa sa Katungkulan (Oath of Office)', file: 'Oath_Of_Office_CSC.pdf', type: 'pdf', req: true },
    { cat: 'Oath of Office and Assumption Documents', title: 'Certificate of Assumption to Duty', file: 'Assumption_To_Duty_Cert.pdf', type: 'pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'Certificate of Eligibility (Career Service Executive Eligibility - CSEE)', file: 'CSC_Eligibility_CSEE.pdf', type: 'pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'Official Transcript of Records & Masteral Diploma (UP Diliman)', file: 'UP_Diploma_TOR.pdf', type: 'pdf', req: true },
    { cat: 'Performance Evaluation', title: 'Individual Performance Commitment and Review (IPCR 2025 Rating: 4.88)', file: 'IPCR_Rating_2025_DelRosario.pdf', type: 'pdf', req: false },
    { cat: 'Medical and Other Required Documents', title: 'CS Form 211 Medical Certificate & Lab Clearance', file: 'CS_Form_211_Medical.pdf', type: 'pdf', req: true },
    { cat: 'Other Supporting Documents', title: 'Statement of Assets, Liabilities and Net Worth (SALN 2025)', file: 'SALN_2025_DelRosario.pdf', type: 'pdf', req: true },
  ];

  emp1Docs.forEach((d, idx) => {
    docs.push({
      id: `doc-emp1-${idx + 1}`,
      employeeId: 'EMP-2021-0084',
      category: d.cat as any,
      documentTitle: d.title,
      fileName: d.file,
      fileType: d.type as any,
      fileSize: 420000 + idx * 35000,
      uploadDate: '2024-04-10T10:15:00.000Z',
      uploadedBy: 'Atty. Mario L. Reyes (HR Admin)',
      status: 'Verified',
      isRequired: d.req,
      dataUrl: generateSampleDocumentDataUrl(d.title, 'Maria Elena Santos Del Rosario', 'EMP-2021-0084', d.cat, '2024-04-10'),
    });
  });

  // Employee 2: Juan Carlos Bautista Mendoza (Missing SALN)
  const emp2Docs = [
    { cat: 'Personal Information and Application Documents', title: 'Personal Data Sheet (CS Form 212 Revised 2017)', file: 'PDS_Mendoza_JC.pdf', req: true },
    { cat: 'Personal Information and Application Documents', title: 'PSA Authenticated Certificate of Live Birth', file: 'PSA_Mendoza.pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'CSC Form 33 Appointment Paper (AO V)', file: 'CSC33_Mendoza.pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'Position Description Form (PDF)', file: 'PDF_Mendoza.pdf', req: true },
    { cat: 'Oath of Office and Assumption Documents', title: 'Panunumpa sa Katungkulan (Oath of Office)', file: 'Oath_Mendoza.pdf', req: true },
    { cat: 'Oath of Office and Assumption Documents', title: 'Certificate of Assumption to Duty', file: 'Assumption_Mendoza.pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'Certificate of Eligibility (CSC Professional Rating: 86.4%)', file: 'CSC_Prof_Eligibility.pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'Official Transcript of Records & Diploma (UST)', file: 'UST_TOR_Diploma.pdf', req: true },
    { cat: 'Performance Evaluation', title: 'IPCR 2025 Semi-Annual Performance Rating: 4.65', file: 'IPCR_2025_Mendoza.pdf', req: false },
    { cat: 'Medical and Other Required Documents', title: 'CS Form 211 Medical Certificate & Lab Clearance', file: 'Medical_2025_Mendoza.pdf', req: true },
    // Notice SALN is missing!
  ];

  emp2Docs.forEach((d, idx) => {
    docs.push({
      id: `doc-emp2-${idx + 1}`,
      employeeId: 'EMP-2022-0142',
      category: d.cat as any,
      documentTitle: d.title,
      fileName: d.file,
      fileType: 'pdf',
      fileSize: 310000 + idx * 22000,
      uploadDate: '2024-05-18T14:30:00.000Z',
      uploadedBy: 'Maria Elena Del Rosario',
      status: 'Verified',
      isRequired: d.req,
      dataUrl: generateSampleDocumentDataUrl(d.title, 'Juan Carlos Bautista Mendoza', 'EMP-2022-0142', d.cat, '2024-05-18'),
    });
  });

  // Employee 3: Corazon Aquino Fernandez (Missing Medical Certificate)
  const emp3Docs = [
    { cat: 'Personal Information and Application Documents', title: 'Personal Data Sheet (CS Form 212 Revised 2017)', file: 'PDS_Fernandez.pdf', req: true },
    { cat: 'Personal Information and Application Documents', title: 'PSA Authenticated Certificate of Live Birth', file: 'PSA_Fernandez.pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'CSC Form 33 Appointment Paper', file: 'Appointment_Fernandez.pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'Position Description Form (PDF)', file: 'PDF_Fernandez.pdf', req: true },
    { cat: 'Oath of Office and Assumption Documents', title: 'Panunumpa sa Katungkulan (Oath of Office)', file: 'Oath_Fernandez.pdf', req: true },
    { cat: 'Oath of Office and Assumption Documents', title: 'Certificate of Assumption to Duty', file: 'Assumption_Fernandez.pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'PRC Board Rating & License (Certified Public Accountant)', file: 'PRC_License_CPA.pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'Official Transcript of Records & Diploma', file: 'TOR_DLSU.pdf', req: true },
    { cat: 'Other Supporting Documents', title: 'Statement of Assets, Liabilities and Net Worth (SALN)', file: 'SALN_Fernandez.pdf', req: true },
    // Missing Medical Certificate CS Form 211!
  ];

  emp3Docs.forEach((d, idx) => {
    docs.push({
      id: `doc-emp3-${idx + 1}`,
      employeeId: 'EMP-2023-0219',
      category: d.cat as any,
      documentTitle: d.title,
      fileName: d.file,
      fileType: 'pdf',
      fileSize: 280000 + idx * 18000,
      uploadDate: '2024-06-20T09:00:00.000Z',
      uploadedBy: 'Juan Carlos Mendoza',
      status: 'Verified',
      isRequired: d.req,
      dataUrl: generateSampleDocumentDataUrl(d.title, 'Corazon Aquino Fernandez', 'EMP-2023-0219', d.cat, '2024-06-20'),
    });
  });

  // Employee 4: Rodrigo Nathaniel Cruz Villanueva (50% complete, missing Oath, Assumption, SALN)
  const emp4Docs = [
    { cat: 'Personal Information and Application Documents', title: 'Personal Data Sheet (CS Form 212 Revised 2017)', file: 'PDS_Villanueva.pdf', req: true },
    { cat: 'Personal Information and Application Documents', title: 'PSA Authenticated Certificate of Live Birth', file: 'PSA_Villanueva.pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'CSC Form 33 Appointment Paper', file: 'Appt_Villanueva.pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'Certificate of Eligibility (CSC Professional)', file: 'CSC_Eligibility.pdf', req: true },
    { cat: 'Medical and Other Required Documents', title: 'CS Form 211 Medical Certificate & Lab Clearance', file: 'MedCert_Villanueva.pdf', req: true },
  ];

  emp4Docs.forEach((d, idx) => {
    docs.push({
      id: `doc-emp4-${idx + 1}`,
      employeeId: 'EMP-2024-0031',
      category: d.cat as any,
      documentTitle: d.title,
      fileName: d.file,
      fileType: 'pdf',
      fileSize: 250000 + idx * 12000,
      uploadDate: '2024-07-02T11:20:00.000Z',
      uploadedBy: 'Juan Carlos Mendoza',
      status: 'Verified',
      isRequired: d.req,
      dataUrl: generateSampleDocumentDataUrl(d.title, 'Rodrigo Nathaniel Cruz Villanueva', 'EMP-2024-0031', d.cat, '2024-07-02'),
    });
  });

  // Employee 5: Angelica Marie Tan Ramos (40% complete)
  const emp5Docs = [
    { cat: 'Personal Information and Application Documents', title: 'Personal Data Sheet (CS Form 212 Revised 2017)', file: 'PDS_Ramos.pdf', req: true },
    { cat: 'Personal Information and Application Documents', title: 'PSA Authenticated Certificate of Live Birth', file: 'PSA_Ramos.pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'CSC Form 33 Appointment Paper (ITO I)', file: 'Appt_Ramos.pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'Official Transcript of Records & Diploma (PUP)', file: 'TOR_Diploma_PUP.pdf', req: true },
  ];

  emp5Docs.forEach((d, idx) => {
    docs.push({
      id: `doc-emp5-${idx + 1}`,
      employeeId: 'EMP-2024-0088',
      category: d.cat as any,
      documentTitle: d.title,
      fileName: d.file,
      fileType: 'pdf',
      fileSize: 290000 + idx * 15000,
      uploadDate: '2024-08-01T15:45:00.000Z',
      uploadedBy: 'Maria Elena Del Rosario',
      status: 'Pending Review',
      isRequired: d.req,
      dataUrl: generateSampleDocumentDataUrl(d.title, 'Angelica Marie Tan Ramos', 'EMP-2024-0088', d.cat, '2024-08-01'),
    });
  });

  // Employee 6: Gabriel Alonzo Navarro (Field Operations Division)
  const emp6Docs = [
    { cat: 'Personal Information and Application Documents', title: 'Personal Data Sheet (CS Form 212 Revised 2017)', file: 'PDS_Navarro.pdf', req: true },
    { cat: 'Personal Information and Application Documents', title: 'PSA Authenticated Certificate of Live Birth', file: 'PSA_Navarro.pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'CSC Form 33 Appointment Paper (Field Ops)', file: 'Appt_Navarro_FieldOps.pdf', req: true },
    { cat: 'Appointment and Employment Documents', title: 'Position Description Form (PDF)', file: 'PDF_Navarro.pdf', req: true },
    { cat: 'Oath of Office and Assumption Documents', title: 'Panunumpa sa Katungkulan (Oath of Office)', file: 'Oath_Navarro.pdf', req: true },
    { cat: 'Oath of Office and Assumption Documents', title: 'Certificate of Assumption to Duty', file: 'Assumption_Navarro.pdf', req: true },
    { cat: 'Eligibility and Educational Records', title: 'Certificate of Eligibility (CSC Professional)', file: 'Eligibility_Navarro.pdf', req: true },
    { cat: 'Medical and Other Required Documents', title: 'CS Form 211 Medical Certificate & Lab Clearance', file: 'Medical_Navarro.pdf', req: true },
    { cat: 'Other Supporting Documents', title: 'Statement of Assets, Liabilities and Net Worth (SALN)', file: 'SALN_Navarro.pdf', req: true },
  ];

  emp6Docs.forEach((d, idx) => {
    docs.push({
      id: `doc-emp6-${idx + 1}`,
      employeeId: 'EMP-2023-0177',
      category: d.cat as any,
      documentTitle: d.title,
      fileName: d.file,
      fileType: 'pdf',
      fileSize: 320000 + idx * 14000,
      uploadDate: '2024-06-15T10:00:00.000Z',
      uploadedBy: 'Juan Carlos Mendoza',
      status: 'Verified',
      isRequired: d.req,
      dataUrl: generateSampleDocumentDataUrl(d.title, 'Gabriel Alonzo Navarro', 'EMP-2023-0177', d.cat, '2024-06-15'),
    });
  });

  return docs;
}

// Initial seed audit logs (RA 10173 compliant records trail)
const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-03-01T08:15:22.000Z',
    actorName: 'Atty. Mario L. Reyes',
    actorRole: 'ADMIN',
    action: 'LOGIN',
    details: 'User authenticated via Secure HR Gateway. Station IP: 192.168.10.45',
  },
  {
    id: 'log-002',
    timestamp: '2026-03-01T08:22:40.000Z',
    actorName: 'Atty. Mario L. Reyes',
    actorRole: 'ADMIN',
    action: 'VIEW_RECORD',
    employeeId: 'EMP-2021-0084',
    employeeName: 'Maria Elena Santos Del Rosario',
    details: 'Viewed 201 personnel records drawer and compliance status.',
  },
  {
    id: 'log-003',
    timestamp: '2026-03-02T10:05:11.000Z',
    actorName: 'Maria Elena Del Rosario',
    actorRole: 'ADMIN',
    action: 'UPLOAD_DOCUMENT',
    employeeId: 'EMP-2024-0088',
    employeeName: 'Angelica Marie Tan Ramos',
    details: 'Uploaded "CSC Form 33 Appointment Paper (ITO I)" to Appointment Documents category.',
  },
  {
    id: 'log-004',
    timestamp: '2026-03-05T14:30:19.000Z',
    actorName: 'Juan Carlos Mendoza',
    actorRole: 'ADMIN',
    action: 'DOWNLOAD_DOCUMENT',
    employeeId: 'EMP-2022-0142',
    employeeName: 'Juan Carlos Bautista Mendoza',
    details: 'Downloaded copy of "CSC Form 33 Appointment Paper (AO V)".',
  },
  {
    id: 'log-005',
    timestamp: '2026-03-10T16:12:00.000Z',
    actorName: 'Auditor Clarissa Gomez',
    actorRole: 'READ_ONLY',
    action: 'VIEW_RECORD',
    employeeId: 'EMP-2023-0219',
    employeeName: 'Corazon Aquino Fernandez',
    details: 'Read-only compliance audit inspection conducted.',
  },
];

export const StorageService = {
  // --- Employees ---
  getEmployees(): Employee[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      if (stored) {
        const emps: Employee[] = JSON.parse(stored);
        let updated = false;
        for (const seed of SEED_EMPLOYEES) {
          if (!emps.some((e) => e.id === seed.id)) {
            emps.push(seed);
            updated = true;
          }
        }
        if (updated) {
          this.saveEmployees(emps);
        }
        return emps;
      }
    } catch (e) {
      console.error('Error reading employees from storage', e);
    }
    // Seed default if empty
    this.saveEmployees(SEED_EMPLOYEES);
    return SEED_EMPLOYEES;
  },

  saveEmployees(employees: Employee[]) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getEmployeeById(id: string): Employee | undefined {
    return this.getEmployees().find((e) => e.id.toLowerCase() === id.toLowerCase());
  },

  saveEmployee(
    employee: Omit<Employee, 'createdAt' | 'updatedAt' | 'isArchived'>,
    actorName: string,
    actorRole: UserSession['role']
  ): { success: boolean; error?: string; employee?: Employee } {
    const employees = this.getEmployees();
    const cleanId = employee.id.trim().toUpperCase();

    // Prevent duplicate Employee ID number!
    if (employees.some((e) => e.id.toUpperCase() === cleanId)) {
      return { success: false, error: `Employee ID "${cleanId}" already exists in the system. Duplicate IDs are prohibited.` };
    }

    if (!employee.firstName.trim() || !employee.lastName.trim()) {
      return { success: false, error: 'First Name and Last Name are required.' };
    }
    if (!employee.position.trim()) {
      return { success: false, error: 'Position / Designation is required.' };
    }
    if (!employee.department.trim()) {
      return { success: false, error: 'Office / Department is required.' };
    }

    const now = new Date().toISOString();
    const newEmp: Employee = {
      ...employee,
      id: cleanId,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };

    employees.unshift(newEmp);
    this.saveEmployees(employees);

    // Audit Log
    this.addAuditLog({
      actorName,
      actorRole,
      action: 'CREATE_RECORD',
      employeeId: newEmp.id,
      employeeName: `${newEmp.firstName} ${newEmp.lastName}`,
      details: `Created new 201 personnel record for ${newEmp.position} in ${newEmp.department}.`,
    });

    return { success: true, employee: newEmp };
  },

  updateEmployee(
    id: string,
    updates: Partial<Employee>,
    actorName: string,
    actorRole: UserSession['role']
  ): { success: boolean; error?: string; employee?: Employee } {
    const employees = this.getEmployees();
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) {
      return { success: false, error: 'Employee not found.' };
    }

    const updated: Employee = {
      ...employees[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    employees[index] = updated;
    this.saveEmployees(employees);

    // Audit Log
    this.addAuditLog({
      actorName,
      actorRole,
      action: 'UPDATE_RECORD',
      employeeId: updated.id,
      employeeName: `${updated.firstName} ${updated.lastName}`,
      details: `Updated personnel details for ${updated.id}.`,
    });

    return { success: true, employee: updated };
  },

  archiveEmployee(
    id: string,
    actorName: string,
    actorRole: UserSession['role']
  ): { success: boolean; error?: string } {
    const employees = this.getEmployees();
    const emp = employees.find((e) => e.id === id);
    if (!emp) return { success: false, error: 'Employee not found.' };

    emp.isArchived = true;
    emp.employmentStatus = 'Archived';
    emp.updatedAt = new Date().toISOString();

    this.saveEmployees(employees);

    this.addAuditLog({
      actorName,
      actorRole,
      action: 'ARCHIVE_RECORD',
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      details: `Archived personnel record in compliance with retention schedule.`,
    });

    return { success: true };
  },

  restoreEmployee(
    id: string,
    actorName: string,
    actorRole: UserSession['role']
  ): { success: boolean; error?: string } {
    const employees = this.getEmployees();
    const emp = employees.find((e) => e.id === id);
    if (!emp) return { success: false, error: 'Employee not found.' };

    emp.isArchived = false;
    emp.employmentStatus = 'Permanent';
    emp.updatedAt = new Date().toISOString();

    this.saveEmployees(employees);

    this.addAuditLog({
      actorName,
      actorRole,
      action: 'RESTORE_RECORD',
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      details: `Restored archived personnel record to active status.`,
    });

    return { success: true };
  },

  // --- Documents ---
  getDocuments(employeeId?: string): DocumentItem[] {
    try {
      let docs: DocumentItem[] = [];
      const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (stored) {
        docs = JSON.parse(stored);
        const seeds = generateSeedDocuments();
        let updated = false;
        for (const s of seeds) {
          if (!docs.some((d) => d.id === s.id)) {
            docs.push(s);
            updated = true;
          }
        }
        if (updated) {
          this.saveDocuments(docs);
        }
      } else {
        docs = generateSeedDocuments();
        this.saveDocuments(docs);
      }

      if (employeeId) {
        return docs.filter((d) => d.employeeId === employeeId);
      }
      return docs;
    } catch (e) {
      console.error('Error reading documents from storage', e);
      return [];
    }
  },

  saveDocuments(documents: DocumentItem[]) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  },

  addDocument(
    doc: Omit<DocumentItem, 'id' | 'uploadDate'>,
    actorName: string,
    actorRole: UserSession['role'],
    employeeName?: string
  ): { success: boolean; document: DocumentItem } {
    const docs = this.getDocuments();
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      uploadDate: new Date().toISOString(),
    };

    docs.unshift(newDoc);
    this.saveDocuments(docs);

    // Audit Log
    this.addAuditLog({
      actorName,
      actorRole,
      action: 'UPLOAD_DOCUMENT',
      employeeId: doc.employeeId,
      employeeName,
      details: `Uploaded document "${doc.documentTitle}" (${doc.fileName}) to "${doc.category}".`,
    });

    return { success: true, document: newDoc };
  },

  deleteDocument(
    docId: string,
    actorName: string,
    actorRole: UserSession['role'],
    employeeName?: string
  ): { success: boolean } {
    const docs = this.getDocuments();
    const doc = docs.find((d) => d.id === docId);
    if (!doc) return { success: false };

    const filtered = docs.filter((d) => d.id !== docId);
    this.saveDocuments(filtered);

    // Audit Log
    this.addAuditLog({
      actorName,
      actorRole,
      action: 'DELETE_DOCUMENT',
      employeeId: doc.employeeId,
      employeeName,
      details: `Removed document "${doc.documentTitle}" from 201 file.`,
    });

    return { success: true };
  },

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading audit logs', e);
    }
    this.saveAuditLogs(SEED_AUDIT_LOGS);
    return SEED_AUDIT_LOGS;
  },

  saveAuditLogs(logs: AuditLog[]) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  },

  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    try {
      const logs = this.getAuditLogs();
      const newEntry: AuditLog = {
        ...entry,
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
      };
      logs.unshift(newEntry);
      // Keep last 1,000 entries
      if (logs.length > 1000) logs.pop();
      this.saveAuditLogs(logs);
    } catch (e) {
      console.error('Error adding audit log', e);
    }
  },

  // --- User Session ---
  getSession(): UserSession {
    const defaultSession: UserSession = {
      username: 'hr_admin_mario',
      name: 'Atty. Mario L. Reyes',
      title: 'Chief Administrative Officer (HRMO V)',
      role: 'ADMIN',
      isAuthenticated: true,
      isLocked: false,
      lastActivity: Date.now(),
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading session', e);
    }
    this.saveSession(defaultSession);
    return defaultSession;
  },

  saveSession(session: UserSession) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  },

  // --- Reset to Factory Seed ---
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },
};
