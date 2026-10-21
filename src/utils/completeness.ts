import { DocumentCategory, DocumentItem, MandatoryDocDef, CompletenessResult } from '../types';

/**
 * Standard Mandatory Personnel 201 Documents required under Philippine Civil Service
 * guidelines (CSC Memorandum Circulars and Omnibus Rules on Appointments).
 */
export const MANDATORY_DOCUMENTS: MandatoryDocDef[] = [
  {
    key: 'pds_csc_212',
    category: 'Personal Information and Application Documents',
    title: 'Personal Data Sheet (CS Form 212 Revised 2017)',
    description: 'Sworn personal data sheet with passport-size ID photo and work experience sheet.',
  },
  {
    key: 'psa_birth_cert',
    category: 'Personal Information and Application Documents',
    title: 'PSA Authenticated Certificate of Live Birth',
    description: 'Official birth certificate issued by the Philippine Statistics Authority.',
  },
  {
    key: 'csc_form_33',
    category: 'Appointment and Employment Documents',
    title: 'CSC Form 33 Appointment Paper',
    description: 'Duly approved or attested appointment paper issued by the appointing authority.',
  },
  {
    key: 'pdf_position_desc',
    category: 'Appointment and Employment Documents',
    title: 'Position Description Form (PDF)',
    description: 'Official duties, responsibilities, and qualification standards for the plantilla item.',
  },
  {
    key: 'oath_of_office',
    category: 'Oath of Office and Assumption Documents',
    title: 'Panunumpa sa Katungkulan (Oath of Office)',
    description: 'Subscribed and sworn oath before an authorized administering officer.',
  },
  {
    key: 'assumption_to_duty',
    category: 'Oath of Office and Assumption Documents',
    title: 'Certificate of Assumption to Duty',
    description: 'Certification specifying the exact date the employee formally assumed duty.',
  },
  {
    key: 'eligibility_cert',
    category: 'Eligibility and Educational Records',
    title: 'Certificate of Eligibility or PRC License',
    description: 'CSC Professional/Subprofessional rating, RA 1080 bar/board license, or equivalent.',
  },
  {
    key: 'transcript_diploma',
    category: 'Eligibility and Educational Records',
    title: 'Official Transcript of Records & Diploma',
    description: 'Authenticated collegiate or post-graduate academic credentials.',
  },
  {
    key: 'medical_cert_211',
    category: 'Medical and Other Required Documents',
    title: 'CS Form 211 Medical Certificate & Lab Clearance',
    description: 'Physician certificate with drug test, chest x-ray, and urinalysis clearances.',
  },
  {
    key: 'saln_filing',
    category: 'Other Supporting Documents',
    title: 'Statement of Assets, Liabilities and Net Worth (SALN)',
    description: 'Sworn annual SALN submission compliant with Republic Act No. 6713.',
  },
];

/**
 * Calculates completeness percentage and details for an employee's 201 file.
 */
export function calculateCompleteness(documents: DocumentItem[]): CompletenessResult {
  const missingMandatory: MandatoryDocDef[] = [];
  const submittedMandatory: DocumentItem[] = [];

  for (const def of MANDATORY_DOCUMENTS) {
    // Match by key or title similarity in matching category
    const found = documents.find((doc) => {
      if (doc.category !== def.category) return false;
      const docTitle = doc.documentTitle.toLowerCase();
      const defTitle = def.title.toLowerCase();
      const defKey = def.key.toLowerCase();

      return (
        docTitle.includes(defKey) ||
        docTitle.includes(defTitle.split(' ')[0]) ||
        (def.key === 'pds_csc_212' && (docTitle.includes('pds') || docTitle.includes('212'))) ||
        (def.key === 'csc_form_33' && (docTitle.includes('appointment') || docTitle.includes('33'))) ||
        (def.key === 'oath_of_office' && (docTitle.includes('oath') || docTitle.includes('panunumpa'))) ||
        (def.key === 'assumption_to_duty' && docTitle.includes('assumption')) ||
        (def.key === 'eligibility_cert' && (docTitle.includes('eligibility') || docTitle.includes('prc') || docTitle.includes('license'))) ||
        (def.key === 'transcript_diploma' && (docTitle.includes('transcript') || docTitle.includes('diploma') || docTitle.includes('tor'))) ||
        (def.key === 'medical_cert_211' && (docTitle.includes('medical') || docTitle.includes('211'))) ||
        (def.key === 'saln_filing' && docTitle.includes('saln'))
      );
    });

    if (found) {
      submittedMandatory.push(found);
    } else {
      missingMandatory.push(def);
    }
  }

  const total = MANDATORY_DOCUMENTS.length;
  const completed = submittedMandatory.length;
  const percentage = Math.round((completed / total) * 100);

  return {
    totalMandatory: total,
    completedMandatory: completed,
    percentage,
    isComplete: completed === total,
    missingMandatory,
    submittedMandatory,
  };
}
