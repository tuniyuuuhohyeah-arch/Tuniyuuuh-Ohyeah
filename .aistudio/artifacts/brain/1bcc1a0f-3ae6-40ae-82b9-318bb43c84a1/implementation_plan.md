# Simple HR 201 Files Management System

A secure, intuitive personnel records management system tailored for HR offices managing employee 201 files, featuring Philippine Civil Service standard document classification, document completeness tracking, interactive preview/download, role-based access, and Data Privacy Act (RA 10173) compliant audit trails.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been aligned based on your clarifications. Please review and confirm to proceed with implementation.

- **Confirmed Decision 1 (Organizational Context & 201 Categories)**: Configured specifically for Philippine Civil Service / Public Sector personnel standards with the 9 mandatory categories:
  1. Personal Information & Application Documents (CSC Form 212 Revised 2017 / PDS, PSA Birth & Marriage Certificates, NBI/Police Clearances)
  2. Appointment & Employment Documents (CSC Form 33 Appointment Paper, Position Description Form / PDF, Job Description)
  3. Oath of Office & Assumption Documents (CSC Oath of Office, Certificate of Assumption to Duty)
  4. Eligibility & Educational Records (Civil Service Eligibility Certificate / PRC Board Rating & License, Transcript of Records, Diplomas)
  5. Performance Evaluation (IPCR / Individual Performance Commitment & Review ratings, OPCR)
  6. Leave & Attendance Records (CSC Form 6 Leave Applications, Daily Time Record summaries)
  7. Training and Seminars (Special Orders, Certificates of Completion, LD Needs Assessment)
  8. Medical and Other Required Documents (CS Form 211 Medical Certificate, Blood Test/X-Ray Clearances, Neuro-Psychiatric exam)
  9. Other Supporting Documents (SALN / Statement of Assets, Liabilities and Net Worth, Commendations, Service Cards)
- **Confirmed Decision 2 (Document Interaction & Previews)**: Interactive modal preview for PDFs, image documents (JPG/PNG), and text files with zoom/pan and download affordances, alongside real file upload (local storage + persistent binary storage via IndexedDB).
- **Confirmed Decision 3 (Data Privacy & Compliance - RA 10173)**: Built-in immutable session-backed audit log capturing all view, upload, edit, archive, and download events with actor identity, timestamp, IP/session token, automatic 15-minute inactivity lock, and downloadable Excel/CSV compliance reports.
- **Recommended Default (Persistence Strategy)**: Full client-side browser database engine (IndexedDB + localStorage fallback) with pre-populated realistic agency records (e.g. Department of Administrative Services / Local Government Unit), ensuring instant zero-latency loading, persistent offline-capable operation, and zero loss on page refresh or browser restart.

---

## 1. Overview & Core Concept

- **What It Does**: Provides human resource personnel with an organized, paperless repository for employee 201 files. HR administrators can view high-level workforce metrics, search/filter personnel, maintain employee service profiles, track mandatory document submission completeness, preview and download stored documents, and generate official compliance reports.
- **Target Audience / Persona**:
  - *HR Administrator / Records Officer*: Full administrative authority to add, update, archive employees, upload files, mark document checklist compliance, and export audit trails.
  - *Read-Only Staff / Department Reviewer*: Restricted view-only access to authorized records without upload, edit, or archive permissions.
- **Key Value**: Replaces cumbersome physical filing cabinets and disorganized shared folders with an audit-ready, structured digital 201 cabinet that immediately alerts HR to missing critical credentials (e.g., missing CSC Appointment, expired PRC license, or unfiled SALN).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Authentication & Session**:
   - Secure login screen with role selection (Administrator / HR Personnel vs. Read-Only Auditor) and quick demo switcher.
   - First-time user welcome guide introducing the 7-step 201 filing workflow.
   - Configurable auto-lock session timeout banner (5, 15, or 30 minutes) ensuring RA 10173 compliance in shared HR workstations.

2. **Dashboard & Metric Overview**:
   - High-level metric summary: Total Employees, Active Personnel, Inactive/Archived Personnel, and Records with Incomplete 201 Documents.
   - Quick "Needs Immediate Attention" panel listing employees missing statutory requirements (e.g., PDS, Oath, or Medical).
   - Fast action shortcuts: "Add New Employee", "Generate Incomplete Report", "View Audit Logs".

3. **Employee Directory (Search & Filter)**:
   - High-density tabular grid with employee ID, complete name, office/department, position, employment status, date hired, and document completion percentage.
   - Real-time search by Employee ID Number, Name, Position, or Department.
   - Quick filters by Employment Status (Permanent, Casual, Contractual, Co-Terminus) and Department (Administrative, Finance, Operations, Legal, Executive).

4. **Dedicated Employee 201 File Profile**:
   - Organized two-column or tabbed interface:
     - **Profile Tab**: Personal information, date of birth, contact number, official address, appointment details, and civil service status.
     - **201 File Repository Tab**: 9 categorized document drawers with requirement flags ("Required" vs "Optional"), completion progress bar, upload modal, inline file preview, and download action.
     - **Audit History Tab**: Specific chronological log of accesses and modifications to this employee's file.
   - Status indicators: Complete (all required submitted), Incomplete (missing core statutory documents).

5. **Document Upload & Interactive Preview**:
   - Drag-and-drop or file picker accepting PDF, JPG, PNG, and DOCX files.
   - Interactive document modal with full-screen toggle, zoom controls, download button, and file metadata (file size, upload date, uploader name).

6. **Reporting & Exporting**:
   - Export Master Employee Directory to CSV / Excel-ready format.
   - Export Incomplete 201 Files Compliance Audit Report with detailed missing checklist items.
   - Export RA 10173 Access Audit Trail for records management inspections.

### Visual Identity & Theme

- **Aesthetic Direction**: Professional, restrained, and utilitarian institutional government aesthetic. Crisp surfaces, high contrast, zero unnecessary visual clutter or distracting animations.
- **Color Palette**:
  - Dominant Canvas: Clean crisp white (`#FFFFFF`) and slate gray neutral canvas (`#F8FAFC`).
  - Structural Surfaces: Subtle borders (`#E2E8F0`) and soft card backgrounds (`#FFFFFF`).
  - Institutional Navy Blue (`#0F172A` to `#1E3A8A`) for headers, primary actions, and brand identity.
  - Semantic Status:
    - Active / Complete: Emerald Green (`#16A34A`)
    - Incomplete / Missing: Amber Warning (`#D97706`)
    - Inactive / Archived: Slate Muted (`#64748B`)
- **Typography & Hierarchy**:
  - Primary Display & Headers: `Plus Jakarta Sans` for clean, professional legibility.
  - Body & UI Controls: `Plus Jakarta Sans` / `Public Sans` for dense, scannable data layouts.
  - Data, Dates & IDs: Monospace tabular numerals (`font-mono tabular-nums`) for employee IDs, timestamps, and file sizes.
- **Anti-Slop Discipline**:
  - No decorative status dots or pulsing glowing green badges.
  - Zero-pill metadata: Categories, dates, and file sizes rendered as clean unboxed text separated by `·`.
  - Standard Top Bar Contract: 1-line brand wordmark (`Republic HR 201 Records`), navigation items (`Dashboard`, `Employees`, `Compliance Reports`, `Audit Trail`), and user profile / logout button.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Storage Architecture (IndexedDB + LocalStorage Hybrid)**
  - *Chosen Approach*: Store structured employee metadata and audit logs in reactive browser storage with backup JSON export/import, and store uploaded document binaries in IndexedDB with blob object URL generation.
  - *Why*: Guarantees true persistence across browser reloads, supports real file uploads and interactive previews of actual user-uploaded documents (PDFs and images), without requiring external cloud accounts or third-party storage fees during evaluation.
  - *Alternatives Considered*: Pure in-memory React state (data lost on refresh) or external S3/Firebase (requires third-party API credentials that break hermetic preview).

- **Decision 2: Document Completeness Model**
  - *Chosen Approach*: Define standard mandatory civil service documents for regular appointments (PDS, Appointment Paper, Oath of Office, Assumption, Medical Certificate, and SALN) as mandatory baseline, with dynamic calculation of completion percentage and badge status.
  - *Why*: Gives HR immediate visual diagnosis of which exact papers are missing without having to open every subfolder manually.

- **Decision 3: Role-Based Access Control (RBAC) Enforcement**
  - *Chosen Approach*: Strict UI and state guard: Administrators can create, edit, upload, archive, and download records; Read-Only users can only search, view profile data, and preview approved documents without upload/delete/archive buttons visible or accessible.
  - *Why*: Fulfills Philippine Data Privacy Act principle of proportionality and need-to-know access restriction.

- **Decision 4: Data Privacy Act (RA 10173) Audit Trail & Session Shield**
  - *Chosen Approach*: Every action (viewing a profile, downloading a document, modifying personnel data, logging in) automatically appends an immutable log entry with timestamp, actor name, action type, and target ID. Includes an automatic inactivity timer with quick unlock.
  - *Why*: Meets government compliance inspections for civil service records management.

---

## 4. Technical Architecture & Data Strategy

### System & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Top Navigation & Top Bar Contract                    │
│   [Brand: Republic HR 201 System]  ─  [Nav Links]  ─  [Role / Logout]  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌───────────────────────┐                         ┌──────────────────────┐
│  Dashboard View       │                         │  Employee Directory  │
│  - Total / Active     │                         │  - Live Search Bar   │
│  - Incomplete Stats   │                         │  - Status/Dept Filter│
│  - Urgent Action List │                         │  - High-Density Grid │
└───────────────────────┘                         └──────────┬───────────┘
                                                             │
                                                             ▼
                                                  ┌──────────────────────┐
                                                  │ Employee 201 Profile │
                                                  ├──────────────────────┤
                                                  │ • Personnel Details  │
                                                  │ • 9-Folder 201 Files │
                                                  │ • Completeness Check │
                                                  │ • Upload / Download  │
                                                  └──────────┬───────────┘
                                                             │
           ┌─────────────────────────────────────────────────┼────────────────────────┐
           ▼                                                 ▼                        ▼
┌───────────────────────┐                         ┌──────────────────────┐ ┌───────────────────┐
│ Document Previewer    │                         │ Reports & Exports    │ │ DPA Audit Logs    │
│ - PDF / Image viewer  │                         │ - Employee Masterlist│ │ - Action tracking │
│ - Zoom / Download     │                         │ - Missing Doc Report │ │ - Session Timeout │
└───────────────────────┘                         │ - CSV / Print View   │ │ - Inactive Lock   │
                                                  └──────────────────────┘ └───────────────────┘
                                                             │
                                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    Persistence Layer (IndexedDB + LocalStorage)                        │
│   • Employee Store (ID unique index, profiles, status, archive flag)                   │
│   • Document Store (Category, metadata, blob storage for PDF/images)                   │
│   • Audit Log Store (Chronological immutable security events)                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State Schema

- **Employee**:
  - `id`: string (Unique Employee ID Number, e.g., `EMP-2024-001`)
  - `firstName`, `middleName`, `lastName`, `suffix`: string
  - `position`: string (e.g., "Administrative Officer V")
  - `department`: string (e.g., "Human Resource Management Division")
  - `employmentStatus`: `'Permanent' | 'Casual' | 'Contractual' | 'Co-Terminus' | 'Archived'`
  - `dateHired`: string (YYYY-MM-DD)
  - `dateOfBirth`: string (YYYY-MM-DD)
  - `email`, `phone`, `address`: string
  - `isArchived`: boolean
  - `createdAt`, `updatedAt`: string

- **Document201**:
  - `id`: string (UUID)
  - `employeeId`: string
  - `category`: `DocumentCategory` (1 of 9 CSC standard categories)
  - `title`: string (e.g., "Personal Data Sheet CS Form 212")
  - `fileName`: string
  - `fileType`: string (MIME type or extension: `pdf`, `jpg`, `png`, `docx`)
  - `fileSize`: number (bytes)
  - `fileDataUrl`: string (Data URL or Object URL for real preview/download)
  - `uploadDate`: string
  - `uploadedBy`: string
  - `isRequired`: boolean
  - `status`: `'Verified' | 'Pending Review' | 'Missing'`

- **AuditLog**:
  - `id`: string
  - `timestamp`: string (ISO-8601)
  - `actor`: string (User name / role)
  - `action`: `'LOGIN' | 'LOGOUT' | 'VIEW_RECORD' | 'UPDATE_RECORD' | 'UPLOAD_DOCUMENT' | 'DOWNLOAD_DOCUMENT' | 'ARCHIVE_RECORD' | 'EXPORT_REPORT'`
  - `targetEmployeeId`: string (optional)
  - `details`: string

- **UserSession**:
  - `username`: string
  - `role`: `'ADMIN' | 'READ_ONLY'`
  - `name`: string
  - `lastActivity`: number (for 15-min auto-lock)

### Interactive Handlers & State Workflow

- **Duplicate Prevention**: Form validation checks for pre-existing `id` before saving new employee record, returning clear inline error.
- **Real-time Filter & Search**: Client-side memoized filter matching query against ID, Name, Department, and Position with zero latency.
- **Completeness Calculation**: Dynamically scans the 9 categories against mandatory document definitions, computing integer completion percentage and missing items count.
- **Document Uploader**: Handles drag-and-drop, reads file buffer via `FileReader`, stores in persistent database, logs the upload event to the audit trail, and recalculates employee profile completeness in real time.
- **Report Generation**: Instant one-click CSV export with UTF-8 BOM formatted for direct opening in Microsoft Excel or Google Sheets, alongside a clean printable compliance report view.
