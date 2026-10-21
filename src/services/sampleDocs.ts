/**
 * Utility to generate realistic SVG Data-URLs representing official
 * Philippine Civil Service 201 documents for immediate interactive preview and download.
 */

export function generateSampleDocumentDataUrl(
  title: string,
  employeeName: string,
  employeeId: string,
  category: string,
  date: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#ffffff; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
    <!-- Background Paper Texture & Border -->
    <rect width="800" height="1100" fill="#fcfdfd" />
    <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#cbd5e1" stroke-width="2" />
    <rect x="35" y="35" width="730" height="1030" fill="none" stroke="#94a3b8" stroke-width="0.75" />

    <!-- Official Header / Republic Emblem -->
    <circle cx="400" cy="95" r="32" fill="#1e3a8a" opacity="0.08" />
    <text x="400" y="85" text-anchor="middle" font-size="11" font-weight="600" fill="#475569" letter-spacing="1.5">REPUBLIC OF THE PHILIPPINES</text>
    <text x="400" y="103" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a" letter-spacing="1">CIVIL SERVICE COMMISSION</text>
    <text x="400" y="119" text-anchor="middle" font-size="10" fill="#64748b">OFFICIAL PERSONNEL RECORDS MANAGEMENT DIVISION (201 FILE)</text>
    <line x1="120" y1="135" x2="680" y2="135" stroke="#1e3a8a" stroke-width="1.5" />

    <!-- Document Title -->
    <rect x="150" y="155" width="500" height="38" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
    <text x="400" y="180" text-anchor="middle" font-size="14" font-weight="700" fill="#1e3a8a" letter-spacing="0.5">${escapeXml(title.toUpperCase())}</text>

    <!-- Category Kicker -->
    <text x="400" y="215" text-anchor="middle" font-size="10" font-weight="600" fill="#64748b" letter-spacing="1">CATEGORY: ${escapeXml(category.toUpperCase())}</text>

    <!-- Personnel Meta Box -->
    <rect x="60" y="240" width="680" height="120" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    
    <text x="80" y="270" font-size="11" font-weight="600" fill="#64748b">EMPLOYEE NAME:</text>
    <text x="210" y="270" font-size="13" font-weight="700" fill="#0f172a">${escapeXml(employeeName)}</text>
    
    <text x="80" y="300" font-size="11" font-weight="600" fill="#64748b">EMPLOYEE ID NO:</text>
    <text x="210" y="300" font-size="12" font-family="monospace" font-weight="600" fill="#0f172a">${escapeXml(employeeId)}</text>
    
    <text x="80" y="330" font-size="11" font-weight="600" fill="#64748b">DOCUMENT DATE:</text>
    <text x="210" y="330" font-size="12" fill="#334155">${escapeXml(date)}</text>

    <text x="480" y="270" font-size="11" font-weight="600" fill="#64748b">STATUS:</text>
    <text x="560" y="270" font-size="12" font-weight="700" fill="#16a34a">VERIFIED ATTESTED</text>
    
    <text x="480" y="300" font-size="11" font-weight="600" fill="#64748b">COMPLIANCE:</text>
    <text x="560" y="300" font-size="11" fill="#334155">RA 10173 DPA Protected</text>

    <!-- Document Body Content Sample -->
    <rect x="60" y="380" width="680" height="480" rx="4" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    <rect x="60" y="380" width="680" height="32" rx="4" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    <text x="80" y="401" font-size="11" font-weight="700" fill="#334155">CERTIFIED RECORD SUMMARY</text>

    <!-- Simulated Record Rows -->
    <text x="80" y="445" font-size="12" fill="#334155">This official document constitutes an authorized component of the subject employee&apos;s</text>
    <text x="80" y="468" font-size="12" fill="#334155">201 Personnel Record under Civil Service Commission Rules and Records Management Policies.</text>

    <line x1="80" y1="490" x2="720" y2="490" stroke="#f1f5f9" stroke-width="1" />

    <text x="80" y="525" font-size="11" font-weight="600" fill="#64748b">STATUTORY PURPOSE:</text>
    <text x="80" y="548" font-size="11" fill="#1e293b">Verification of qualification standards, employment terms, and official civil service eligibility.</text>

    <text x="80" y="590" font-size="11" font-weight="600" fill="#64748b">CONFIDENTIALITY CLAUSE (R.A. NO. 10173):</text>
    <text x="80" y="612" font-size="11" fill="#475569">Access to this 201 file is strictly restricted to authorized Human Resource Officers and lawful</text>
    <text x="80" y="632" font-size="11" fill="#475569">oversight bodies. Unauthorized disclosure, copying, or dissemination is punishable by law.</text>

    <!-- Table of Certified Attributes -->
    <rect x="80" y="660" width="640" height="150" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.75" />
    <line x1="80" y1="695" x2="720" y2="695" stroke="#cbd5e1" stroke-width="0.75" />
    <line x1="280" y1="660" x2="280" y2="810" stroke="#cbd5e1" stroke-width="0.75" />
    
    <text x="95" y="682" font-size="10" font-weight="700" fill="#475569">RECORD FIELD</text>
    <text x="295" y="682" font-size="10" font-weight="700" fill="#475569">VERIFIED VALUE</text>

    <text x="95" y="722" font-size="11" fill="#475569">Document Classification</text>
    <text x="295" y="722" font-size="11" font-weight="600" fill="#0f172a">Permanent Personnel Archival (Series 2026)</text>

    <text x="95" y="752" font-size="11" fill="#475569">Authentication Seal</text>
    <text x="295" y="752" font-size="11" font-weight="600" fill="#0f172a">CSC Registry Attested - Digital Hash Matched</text>

    <text x="95" y="782" font-size="11" fill="#475569">Custodian Office</text>
    <text x="295" y="782" font-size="11" font-weight="600" fill="#0f172a">HR Management &amp; Personnel Records Division</text>

    <!-- Stamp & Signatures -->
    <!-- Stamp circle -->
    <g transform="translate(140, 930) rotate(-6)">
      <circle cx="0" cy="0" r="48" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-dasharray="4,2" opacity="0.85" />
      <text x="0" y="-18" text-anchor="middle" font-size="8" font-weight="700" fill="#1d4ed8">CSC RECORDS DEPT</text>
      <text x="0" y="2" text-anchor="middle" font-size="11" font-weight="800" fill="#1d4ed8">VERIFIED</text>
      <text x="0" y="18" text-anchor="middle" font-size="8" font-weight="700" fill="#1d4ed8">201 ARCHIVE</text>
      <text x="0" y="30" text-anchor="middle" font-size="7" fill="#1d4ed8">${escapeXml(date)}</text>
    </g>

    <!-- Signatures section -->
    <line x1="480" y1="970" x2="700" y2="970" stroke="#0f172a" stroke-width="1.2" />
    <text x="590" y="990" text-anchor="middle" font-size="11" font-weight="700" fill="#0f172a">ATTY. MARIO L. REYES</text>
    <text x="590" y="1005" text-anchor="middle" font-size="10" fill="#475569">Chief Administrative Officer, HRMD</text>
    <text x="590" y="1020" text-anchor="middle" font-size="9" fill="#94a3b8">Authorized Custodian of Records</text>

    <!-- Barcode & Footer Security Serial -->
    <rect x="60" y="1035" width="220" height="15" fill="#0f172a" opacity="0.1" />
    <text x="60" y="1062" font-size="9" font-family="monospace" fill="#94a3b8">CSC-201-${escapeXml(employeeId)}-SECURED-RA10173-CONFIDENTIAL</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
