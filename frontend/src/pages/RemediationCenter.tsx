import { useState, useEffect, useRef } from 'react';
import {
  CheckCircle,
  Clock,
  Cpu,
  UploadCloud,
  PlayCircle,
  Sparkles,
  UserCheck,
  FileCheck,
  ShieldAlert,
  Building2,
  TrendingDown,
  RotateCcw,
  Check,
  X,
  Edit3,
  AlertTriangle,
  Activity,
  Layers,
  ExternalLink,
  Filter,
  FileText,
  Folder,
  FolderOpen,
  FolderUp,
  Upload
} from 'lucide-react';

interface RemediationProps {
  dashboardData?: any;
  initialCaseId?: string | null;
  onUpdateCompliance?: (
    requirementId: string,
    newStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'EVIDENCE_PENDING',
    actualValue?: string,
    gapText?: string
  ) => void;
}

// ── 26 STATUTORY COMPLIANCE PRESETS FOR INSTANT CSV TESTING ──
export const SAMPLE_26_COMPLIANT_CSV = `requirement_id,requirement_name,authority,category,required_value,actual_value,status,observation
VIG-R26-001,B.Tech degree credit requirement,VFSTR,Credits,>= 160 credits,162 graduating + 10 binary credits,COMPLIANT,Curriculum audit confirmed 162 total credits
VIG-R26-002,Maximum credits registered per regular semester,VFSTR,Credits,<= 25 credits,24 credits max registered,COMPLIANT,Registration logs enforce 24 credit ceiling
VIG-R26-003,Minimum instructional days in regular semester,VFSTR,Academic Calendar,>= 90 working days,94 working days verified,COMPLIANT,Academic calendar verified with biometric logs
VIG-R26-004,Lecture credit equivalence,VFSTR,Curriculum,1 lecture hr/wk = 1 credit,1 hr/wk = 1 credit,COMPLIANT,BoS course structure conforms
VIG-R26-005,Practical credit equivalence,VFSTR,Laboratory,2 practical hrs/wk = 1 credit,2 hrs/wk = 1 credit,COMPLIANT,Laboratory curriculum verified
VIG-R26-006,Course outcome count,VFSTR,Curriculum,4 to 6 COs per course,5 COs defined per course,COMPLIANT,All syllabus files contain 5 COs mapped to POs
VIG-R26-007,Mandatory textbook per course,VFSTR,Learning Resources,>= 1 textbook,2 prescribed textbooks per course,COMPLIANT,Course files verified
VIG-R26-008,Reference books per course,VFSTR,Learning Resources,2 to 3 reference books,3 reference books prescribed,COMPLIANT,Library syllabus repository verified
VIG-R26-009,Student attendance qualifying threshold,VFSTR,Assessment,>= 75% attendance,82.4% average attendance,COMPLIANT,Biometric and LMS portal logs verified
VIG-R26-010,Formative assessment minimum,VFSTR,Assessment,>= 50% (30/60),52% average formative marks,COMPLIANT,Internal evaluation records verified
VIG-R26-011,Summative assessment minimum,VFSTR,Assessment,>= 40% (16/40),44% average summative marks,COMPLIANT,End-semester assessment audit confirmed
VIG-R26-012,Laboratory manual availability,VFSTR,Laboratory,Available with schedule,Available and published on LMS,COMPLIANT,Complete lab manual uploaded with schedule
VIG-AICTE-001,Regular faculty provision,AICTE,Faculty,FSR 1:15 / Cadre 1:2:6,FSR 1:14.2 / Cadre 1:2:6 verified,COMPLIANT,Faculty roster meets AICTE norms
VIG-AICTE-002,PG course professor with PhD,AICTE,Faculty,>= 1 Professor with PhD per PG,2 Professors with PhD appointed,COMPLIANT,PG faculty roster verified
VIG-UGC-001,Faculty appointment qualifications,UGC,Faculty Qualification,UGC minimum qualifications,100% faculty meet UGC criteria,COMPLIANT,HR service register audited
VIG-UGC-002,Anti-ragging institutional compliance,UGC,Student Safety,Committee & 100% undertakings,Active with 100% undertakings,COMPLIANT,Portal and committee orders active
VIG-UGC-003,Student grievance redressal mechanism,UGC,Student Support,SGRC mechanism active,Published portal & active SGRC,COMPLIANT,Grievance cell logs verified
VIG-NBA-001,NBA program accreditation applicability,NBA,Accreditation,Accredited with valid dates,Tier-1 Accredited through 2028,COMPLIANT,Accreditation certificates verified
VIG-NBA-002,NBA student-faculty ratio,NBA,Faculty / Accreditation,<= 1:20 ratio,1:15.2 student-faculty ratio,COMPLIANT,Department faculty workload audited
VIG-NBA-003,NBA PhD faculty evidence,NBA,Faculty Qualification,>= 30% PhD faculty,42.5% PhD qualified faculty,COMPLIANT,Research credentials verified
VIG-NBA-004,NBA library and learning resources evidence,NBA,Library,Learning resources maintained,120100+ volumes & IEEE digital,COMPLIANT,Library subscription invoices verified
VIG-VFSTR-001,Central library current resource snapshot,VFSTR,Library,>= 120100 volumes,124500 volumes cataloged,COMPLIANT,Central library stock verified
VIG-VFSTR-002,Anti-ragging committee existence,VFSTR,Committee,Active committee published,Constituted & published on site,COMPLIANT,Current order published
VIG-VFSTR-003,Institutional committee evidence coverage,VFSTR,Governance,30 statutory committees,30/30 committees constituted,COMPLIANT,IQAC and statutory records verified
VIG-INT-001,FSR-CSE-001 program ratio check,VFSTR / Agent 54,Internal Compliance,FSR <= 1:15,1:14.5 FSR in CSE,COMPLIANT,Department staff ratio verified
VIG-INT-002,CRED-ECE-001 credit structure check,VFSTR / Agent 54,Internal Compliance,>= 160 credits,164 credits curriculum,COMPLIANT,ECE curriculum compliant`;

export const SAMPLE_26_MISMATCHED_CSV = `requirement_id,requirement_name,authority,category,required_value,actual_value,status,observation
VIG-R26-001,B.Tech degree credit requirement,VFSTR,Credits,>= 160 credits,148 graduating credits,NON_COMPLIANT,Deficit of 12 credits in curriculum structure
VIG-R26-002,Maximum credits registered per regular semester,VFSTR,Credits,<= 25 credits,28 credits registered,NON_COMPLIANT,Overload exceeding statutory cap of 25
VIG-R26-003,Minimum instructional days in regular semester,VFSTR,Academic Calendar,>= 90 working days,81 working days conducted,NON_COMPLIANT,Deficit of 9 instructional days in semester calendar
VIG-R26-004,Lecture credit equivalence,VFSTR,Curriculum,1 lecture hr/wk = 1 credit,0.75 hr/wk = 1 credit,NON_COMPLIANT,Contact hour deficiency
VIG-R26-005,Practical credit equivalence,VFSTR,Laboratory,2 practical hrs/wk = 1 credit,1 hr/wk = 1 credit,NON_COMPLIANT,Laboratory contact hour mismatch
VIG-R26-006,Course outcome count,VFSTR,Curriculum,4 to 6 COs per course,2 COs defined per course,NON_COMPLIANT,Only 2 COs specified instead of minimum 4
VIG-R26-007,Mandatory textbook per course,VFSTR,Learning Resources,>= 1 textbook,0 textbooks prescribed,NON_COMPLIANT,No mandatory textbook listed in syllabus
VIG-R26-008,Reference books per course,VFSTR,Learning Resources,2 to 3 reference books,1 reference book listed,NON_COMPLIANT,Deficit in reference bibliography
VIG-R26-009,Student attendance qualifying threshold,VFSTR,Assessment,>= 75% attendance,64.2% average attendance,NON_COMPLIANT,Attendance is below 75% cutoff and exceeds condonable limit
VIG-R26-010,Formative assessment minimum,VFSTR,Assessment,>= 50% (30/60),38% average formative marks,NON_COMPLIANT,Formative marks fall below 50% threshold
VIG-R26-011,Summative assessment minimum,VFSTR,Assessment,>= 40% (16/40),28% average summative marks,NON_COMPLIANT,Summative marks fall below 40% passing minimum
VIG-R26-012,Laboratory manual availability,VFSTR,Laboratory,Available with schedule,Missing / Not published,NON_COMPLIANT,Laboratory manual is absent or outdated
VIG-AICTE-001,Regular faculty provision,AICTE,Faculty,FSR 1:15 / Cadre 1:2:6,FSR 1:24.5 / Cadre deficient,NON_COMPLIANT,Faculty shortage of 8 professors
VIG-AICTE-002,PG course professor with PhD,AICTE,Faculty,>= 1 Professor with PhD per PG,0 Professors with PhD,NON_COMPLIANT,No Professor with PhD assigned to PG stream
VIG-UGC-001,Faculty appointment qualifications,UGC,Faculty Qualification,UGC minimum qualifications,18% faculty lack mandatory NET/PhD,NON_COMPLIANT,Qualification shortfall detected
VIG-UGC-002,Anti-ragging institutional compliance,UGC,Student Safety,Committee & 100% undertakings,No committee order found,NON_COMPLIANT,Expired committee composition
VIG-UGC-003,Student grievance redressal mechanism,UGC,Student Support,SGRC mechanism active,Portal non-functional,NON_COMPLIANT,Grievance mechanism offline
VIG-NBA-001,NBA program accreditation applicability,NBA,Accreditation,Accredited with valid dates,Accreditation Expired 2024,NON_COMPLIANT,NBA validity lapsed
VIG-NBA-002,NBA student-faculty ratio,NBA,Faculty / Accreditation,<= 1:20 ratio,1:26.4 student-faculty ratio,NON_COMPLIANT,Ratio exceeds NBA maximum threshold
VIG-NBA-003,NBA PhD faculty evidence,NBA,Faculty Qualification,>= 30% PhD faculty,18.5% PhD faculty,NON_COMPLIANT,PhD faculty proportion below 30%
VIG-NBA-004,NBA library and learning resources evidence,NBA,Library,Learning resources maintained,Subscription lapsed,NON_COMPLIANT,Critical e-journal database access expired
VIG-VFSTR-001,Central library current resource snapshot,VFSTR,Library,>= 120100 volumes,92000 volumes,NON_COMPLIANT,Volume shortfall of 28100 books
VIG-VFSTR-002,Anti-ragging committee existence,VFSTR,Committee,Active committee published,Listing missing,NON_COMPLIANT,No active order on institutional website
VIG-VFSTR-003,Institutional committee evidence coverage,VFSTR,Governance,30 statutory committees,14/30 committees constituted,NON_COMPLIANT,16 statutory committees missing
VIG-INT-001,FSR-CSE-001 program ratio check,VFSTR / Agent 54,Internal Compliance,FSR <= 1:15,1:24.0 FSR in CSE,NON_COMPLIANT,Severe staff deficit in CSE
VIG-INT-002,CRED-ECE-001 credit structure check,VFSTR / Agent 54,Internal Compliance,>= 160 credits,145 credits curriculum,NON_COMPLIANT,ECE curriculum short by 15 credits`;

export const SAMPLE_UNRELATED_CSV = `transaction_id,vendor_name,invoice_date,amount_inr,department_code,payment_status
TXN-9021,Dell Technologies,2026-03-01,1450000,IT-HARDWARE,PAID
TXN-9022,Office Depot,2026-03-02,24000,STATIONERY,PAID
TXN-9023,BlueDart Express,2026-03-05,8200,LOGISTICS,PENDING
TXN-9024,Godrej Furniture,2026-03-08,520000,CIVIL-MAINT,PAID`;

// Helper: Parse CSV or JSON regulation text into array of normalized record objects
export function parseCSV(fileContent: string): Record<string, string>[] {
  if (!fileContent || typeof fileContent !== 'string') return [];
  const trimmed = fileContent.trim();
  if (!trimmed) return [];

  // 1. Check if the content is JSON (e.g. from regulations.json, extracted PDF JSON, or API payloads)
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const parsed = JSON.parse(trimmed);
      let rawArray: any[] = [];
      if (Array.isArray(parsed)) {
        rawArray = parsed;
      } else if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.records)) rawArray = parsed.records;
        else if (Array.isArray(parsed.requirements)) rawArray = parsed.requirements;
        else if (Array.isArray(parsed.data)) rawArray = parsed.data;
        else if (Array.isArray(parsed.results)) rawArray = parsed.results;
        else rawArray = [parsed];
      }

      if (rawArray.length > 0) {
        return rawArray.map(item => {
          const norm: Record<string, string> = {};
          if (item && typeof item === 'object') {
            Object.entries(item).forEach(([k, v]) => {
              norm[k.toLowerCase().trim()] = v !== null && v !== undefined ? String(v).trim() : '';
            });
          }
          return norm;
        });
      }
    } catch {
      // If JSON parse fails, fall through to CSV parser
    }
  }

  // 2. Parse Delimited Text (CSV, TSV, or Pipe-delimited)
  const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Determine delimiter: comma, semicolon, tab, or pipe
  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : firstLine.includes('|') ? '|' : ',';

  const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    const values: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let charIdx = 0; charIdx < row.length; charIdx++) {
      const char = row[charIdx];
      if (char === '"' || char === "'") {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));

    const record: Record<string, string> = {};
    headers.forEach((h, idx) => {
      record[h] = values[idx] || '';
    });
    records.push(record);
  }
  return records;
}

// ── 26-RULE STATUTORY CONDITION EVALUATOR ──
export interface EvaluationResult {
  evaluated: boolean;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'EVIDENCE_PENDING';
  matchFound: boolean;
  matchedRecord: Record<string, string> | null;
  ruleId: string;
  ruleTitle: string;
  requiredNorm: string;
  actualValue: string;
  shortfall: string;
  reason: string;
  gatePassed: boolean;
  gateMissing: string[];
}

export function evaluateEvidenceAgainstRule(
  targetRuleId: string,
  targetRuleTitle: string,
  targetRequired: string,
  records: Record<string, string>[]
): EvaluationResult {
  if (!records || records.length === 0) {
    return {
      evaluated: true,
      status: 'EVIDENCE_PENDING',
      matchFound: false,
      matchedRecord: null,
      ruleId: targetRuleId,
      ruleTitle: targetRuleTitle,
      requiredNorm: targetRequired,
      actualValue: 'No Data Uploaded',
      shortfall: 'Missing CSV Evidence Package',
      reason: 'No evidence records uploaded. Upload a CSV containing statutory audit evidence for this regulation.',
      gatePassed: false,
      gateMissing: ['Gate 2: No valid CSV evidence file attached.']
    };
  }

  // Normalize search tokens
  const cleanId = targetRuleId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const titleWords = targetRuleTitle.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  // Search through all records in the CSV for a match
  const matchedRecord = records.find(rec => {
    const recId = (rec.requirement_id || rec.rule_id || rec.id || rec.code || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const recName = (rec.requirement_name || rec.name || rec.title || rec.rule_name || '').toLowerCase();

    // 1. Direct ID match or partial ID match
    if (recId && (recId === cleanId || cleanId.includes(recId) || recId.includes(cleanId))) {
      return true;
    }

    // 2. Specific cross-mappings (e.g. REQ-FSR-001 -> VIG-AICTE-001 / VIG-INT-001)
    if (cleanId.includes('fsr') && (recId.includes('aicte001') || recId.includes('int001') || recId.includes('fsr') || recName.includes('faculty'))) {
      return true;
    }
    if (cleanId.includes('credece') && (recId.includes('int002') || recId.includes('r26001') || recName.includes('credit'))) {
      return true;
    }

    // 3. Name or Title match
    if (recName && (recName.includes(targetRuleTitle.toLowerCase()) || targetRuleTitle.toLowerCase().includes(recName))) {
      return true;
    }

    // 4. Keyword overlap
    if (titleWords.length > 0 && titleWords.some(w => recName.includes(w))) {
      return true;
    }

    return false;
  });

  // CASE 2: No matching data found in the CSV (or wrong file uploaded)
  if (!matchedRecord) {
    return {
      evaluated: true,
      status: 'EVIDENCE_PENDING',
      matchFound: false,
      matchedRecord: null,
      ruleId: targetRuleId,
      ruleTitle: targetRuleTitle,
      requiredNorm: targetRequired,
      actualValue: 'No Matching Record in File',
      shortfall: `CSV contains ${records.length} records, but none matched '${targetRuleId}'`,
      reason: `Uploaded file does not contain matching evidence data for requirement '${targetRuleId}' (${targetRuleTitle}). Please upload a valid statutory compliance CSV package.`,
      gatePassed: false,
      gateMissing: [`Gate 2: Uploaded file missing evidence entry for rule ${targetRuleId}.`]
    };
  }

  // Extract fields from the matched row
  const rawActual = matchedRecord.actual_value || matchedRecord.value || matchedRecord.actual || matchedRecord.evidence_value || '';
  const rawStatus = (matchedRecord.status || matchedRecord.compliance_status || '').toUpperCase();
  const rawObservation = matchedRecord.observation || matchedRecord.notes || matchedRecord.comment || '';
  const rawRequired = matchedRecord.required_value || matchedRecord.required || targetRequired;

  // Let's test the condition:
  let isCompliant = false;
  let reason = '';
  let shortfall = 'None (Conditions Fulfilled)';

  // Helper numeric parsers
  const parseNumber = (str: string): number | null => {
    const m = str.match(/[-+]?[0-9]*\.?[0-9]+/);
    return m ? parseFloat(m[0]) : null;
  };

  const actualLower = rawActual.toLowerCase();
  const obsLower = rawObservation.toLowerCase();

  // Explicit status check from CSV
  if (rawStatus === 'COMPLIANT' || rawStatus === 'PASS' || rawStatus === 'VERIFIED') {
    isCompliant = true;
    reason = `Evidence in CSV explicitly verified as COMPLIANT. Actual value: "${rawActual}". Observation: ${rawObservation || 'All statutory thresholds met.'}`;
  } else if (rawStatus === 'NON_COMPLIANT' || rawStatus === 'FAIL' || rawStatus === 'DEFICIENT') {
    isCompliant = false;
    reason = `Evidence in CSV confirms NON-COMPLIANCE. Actual value: "${rawActual}". Observation: ${rawObservation || 'Shortfall detected against statutory criteria.'}`;
    shortfall = rawObservation || 'Statutory condition violated';
  } else {
    // Condition-specific algorithmic evaluation:
    const num = parseNumber(rawActual);

    // Rule A: Attendance (>= 75%)
    if (cleanId.includes('009') || cleanId.includes('attendance') || targetRuleTitle.toLowerCase().includes('attendance')) {
      if (num !== null && num >= 75) {
        isCompliant = true;
        reason = `Attendance verified at ${num}% (statutory requirement >= 75%). Condition fulfilled.`;
      } else {
        isCompliant = false;
        reason = `Attendance is ${num !== null ? num + '%' : rawActual}, which is below the mandatory 75% threshold.`;
        shortfall = `Shortfall of ${num !== null ? (75 - num).toFixed(1) + '%' : 'below 75%'}`;
      }
    }
    // Rule B: Total B.Tech Credits (>= 160)
    else if (cleanId.includes('001') || cleanId.includes('credit') || targetRuleTitle.toLowerCase().includes('credit requirement')) {
      if (num !== null && num >= 160) {
        isCompliant = true;
        reason = `B.Tech credit total verified at ${num} credits (statutory norm >= 160). Condition fulfilled.`;
      } else {
        isCompliant = false;
        reason = `B.Tech credit total is ${num !== null ? num : rawActual}, failing the minimum 160 credits requirement.`;
        shortfall = `Shortfall of ${num !== null ? 160 - num : 'deficit'} credits`;
      }
    }
    // Rule C: Max credits per sem (<= 25)
    else if (cleanId.includes('002') || targetRuleTitle.toLowerCase().includes('maximum credits')) {
      if (num !== null && num <= 25) {
        isCompliant = true;
        reason = `Semester credit registration is ${num} (statutory ceiling <= 25). Condition fulfilled.`;
      } else {
        isCompliant = false;
        reason = `Semester credits registered is ${num !== null ? num : rawActual}, which exceeds the 25 credit limit.`;
        shortfall = `Exceeds cap by ${num !== null ? num - 25 : 'excess'} credits`;
      }
    }
    // Rule D: Instructional Days (>= 90)
    else if (cleanId.includes('003') || targetRuleTitle.toLowerCase().includes('instructional days')) {
      if (num !== null && num >= 90) {
        isCompliant = true;
        reason = `Instructional days verified at ${num} days (statutory norm >= 90). Condition fulfilled.`;
      } else {
        isCompliant = false;
        reason = `Instructional days is ${num !== null ? num : rawActual} days, falling below the mandatory 90 working days.`;
        shortfall = `Deficit of ${num !== null ? 90 - num : 'days'} working days`;
      }
    }
    // Rule E: Faculty to Student Ratio (<= 1:20 / 1:15)
    else if (cleanId.includes('fsr') || cleanId.includes('aicte001') || cleanId.includes('nba002') || targetRuleTitle.toLowerCase().includes('faculty')) {
      // Check ratio like 1:14.2 or 1:24.5
      const ratioParts = rawActual.match(/1\s*:\s*([0-9.]+)/);
      const ratioValue = ratioParts ? parseFloat(ratioParts[1]) : num;
      if (ratioValue !== null && ratioValue <= 20) {
        isCompliant = true;
        reason = `Faculty to student ratio verified at 1:${ratioValue} (norm <= 1:20 / 1:15). Condition fulfilled.`;
      } else {
        isCompliant = false;
        reason = `Faculty to student ratio is ${rawActual}, which violates the prescribed ratio.`;
        shortfall = `Deficient ratio: ${rawActual}`;
      }
    }
    // Rule F: Formative Assessment (>= 50%)
    else if (cleanId.includes('010') || targetRuleTitle.toLowerCase().includes('formative')) {
      if (num !== null && num >= 50) {
        isCompliant = true;
        reason = `Formative assessment minimum verified at ${num}% (norm >= 50%). Condition fulfilled.`;
      } else {
        isCompliant = false;
        reason = `Formative marks average is ${num !== null ? num + '%' : rawActual}, below the 50% cutoff.`;
        shortfall = `Shortfall below 50%`;
      }
    }
    // Rule G: Summative Assessment (>= 40%)
    else if (cleanId.includes('011') || targetRuleTitle.toLowerCase().includes('summative')) {
      if (num !== null && num >= 40) {
        isCompliant = true;
        reason = `Summative assessment minimum verified at ${num}% (norm >= 40%). Condition fulfilled.`;
      } else {
        isCompliant = false;
        reason = `Summative marks average is ${num !== null ? num + '%' : rawActual}, below the 40% cutoff.`;
        shortfall = `Shortfall below 40%`;
      }
    }
    // Rule H: General Qualitative Checks (Committees, Policies, Library, Manuals)
    else {
      const positiveTerms = ['yes', 'true', 'active', 'published', 'available', 'compliant', 'verified', 'approved', 'constituted', 'conforms', '100%'];
      const negativeTerms = ['no', 'false', 'missing', 'expired', 'deficit', 'shortage', 'not', 'fail', 'non', 'lapsed', 'offline'];

      const hasNegative = negativeTerms.some(t => actualLower.includes(t) || obsLower.includes(t));
      const hasPositive = positiveTerms.some(t => actualLower.includes(t) || obsLower.includes(t));

      if (hasPositive && !hasNegative) {
        isCompliant = true;
        reason = `Evidence verified: "${rawActual}". Observation: ${rawObservation || 'Satisfies statutory requirements.'}`;
      } else {
        isCompliant = false;
        reason = `Evidence value "${rawActual}" does not fulfill statutory norm "${targetRequired}". ${rawObservation}`;
        shortfall = rawObservation || 'Statutory requirement not fulfilled';
      }
    }
  }

  // CASE 1 vs CASE 3
  const finalStatus: 'COMPLIANT' | 'NON_COMPLIANT' = isCompliant ? 'COMPLIANT' : 'NON_COMPLIANT';

  return {
    evaluated: true,
    status: finalStatus,
    matchFound: true,
    matchedRecord,
    ruleId: targetRuleId,
    ruleTitle: targetRuleTitle,
    requiredNorm: rawRequired,
    actualValue: rawActual || (isCompliant ? 'Verified' : 'Deficient'),
    shortfall: isCompliant ? '0 (Fully Compliant)' : shortfall,
    reason,
    gatePassed: isCompliant,
    gateMissing: isCompliant ? [] : [`Gate 2: Evidence value (${rawActual || 'None'}) does not meet condition.`]
  };
}

export default function RemediationCenter({ dashboardData, initialCaseId, onUpdateCompliance }: RemediationProps) {
  const auditList = dashboardData?.auditList || [];
  const totalOpenRisks = dashboardData?.totalRisks || 4;
  const criticalCount = dashboardData?.complianceData?.find((c: any) => c.name === 'Non-Compliant')?.value || 2;

  // Build complete list of recovery cases dynamically from the Live Scan!
  const dynamicRecoveryItems: any[] = (dashboardData?.fullScan?.results || dashboardData?.resultsList || [])
    ?.filter((r: any) => r.status !== 'COMPLIANT')
    .map((r: any) => {
      const isCritical = r.severity === 'CRITICAL' || r.status === 'NON_COMPLIANT';
      const isPending = r.status === 'EVIDENCE_PENDING';
      return {
        id: r.requirement_id,
        title: r.requirement_title || r.requirement_name || r.requirement_id,
        dept: r.owner || r.department_name || r.department || 'University Compliance',
        deptId: 'DEPT-001',
        severity: isCritical ? 'CRITICAL' : isPending ? 'EVIDENCE PENDING' : 'MEDIUM RISK',
        riskBadge: isCritical ? '🔴 Critical Lead Time' : isPending ? '🟡 Evidence Required' : '🟡 Review Required',
        category: r.category || 'Compliance',
        riskScore: isCritical ? 92 : 65,
        required: r.required_value || 'Mandatory Standard',
        actual: r.actual_value || 'Evidence Pending Submission',
        students: 0,
        currentValue: 0,
        requiredValue: 0,
        gapCount: 1,
        gapUnit: 'compliance checkpoint',
        status: isCritical ? '🔴 CRITICAL ACTION' : '🟡 EVIDENCE PENDING',
        formula: {
          totalStudents: 0,
          targetRatio: r.required_value || 'Compliance Target',
          requiredStaff: 0,
          currentStaff: 0,
          gap: 1
        },
        impact: r.observation || `Evidence submission pending for ${r.source_document || 'Regulation'} Clause ${r.clause || ''}.`,
        flow: {
          req: r.required_value || 'Statutory Norm',
          actual: r.actual_value || 'Pending Records',
          gap: r.gap || r.evidence_required || 'Audit Verification',
          correction: 'Submit & Verify'
        },
        recoveryPlan: [
          { step: '01', title: `Review Clause Requirements: ${r.requirement_title || r.requirement_name}`, owner: r.owner || 'Compliance Officer', support: 'AI Agent Swarm', lead: '1 day', priority: 'High', status: '🔴 In Progress' },
          { step: '02', title: `Collect & Ingest: ${r.evidence_required || 'Department Records'}`, owner: r.owner || 'Department Head', support: 'Registrar', lead: `${r.lead_time_days || 15} days`, priority: 'High', status: '🟡 Pending' },
          { step: '03', title: 'Verify evidence conformity against regulatory clauses', owner: 'Agent 54 Compliance Engine', support: 'IQAC', lead: '1 day', priority: 'Medium', status: '🔵 Automated Check' },
          { step: '04', title: 'Publish compliance verification & archive audit log', owner: 'Agent 54 Orchestrator', support: 'System', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: Compliant' }
        ],
        whyText: r.observation || r.notes || `Statutory clause ${r.clause || ''} requires formal verifiable institutional evidence.`,
        evidence: [
          r.evidence_required || 'Required statutory records & logs',
          r.source_document || 'Official Board / Council Approval Orders',
          'Automated Audit Trail Artifacts'
        ]
      };
    }) || [];

  // If there are no failed rules, provide a fallback "All Clear" item
  if (dynamicRecoveryItems.length === 0) {
    dynamicRecoveryItems.push({
      id: 'ALL-CLEAR',
      title: 'No Active Non-Compliances',
      dept: 'University Wide',
      deptId: 'UNI',
      severity: 'COMPLIANT',
      riskBadge: '🟢 Compliant / Safe',
      category: 'Compliant',
      riskScore: 0,
      required: 'N/A',
      actual: 'N/A',
      students: 0,
      currentValue: 0,
      requiredValue: 0,
      gapCount: 0,
      gapUnit: 'N/A',
      status: '🟢 COMPLIANT',
      formula: { totalStudents: 0, targetRatio: 'N/A', requiredStaff: 0, currentStaff: 0, gap: 0 },
      impact: 'All monitored systems are currently fully compliant. No active remediation plans required.',
      flow: { req: 'N/A', actual: 'N/A', gap: '0', correction: 'Maintain' },
      recoveryPlan: [
        { step: '01', title: 'Continuous Monitoring Active', owner: 'Agent54 Engine', support: 'IQAC', lead: 'Ongoing', priority: 'Low', status: '🟢 Active' }
      ],
      whyText: 'No regulatory violations detected in the latest live scan.',
      evidence: ['Live scan log']
    });
  }

  const allRecoveryItems = dynamicRecoveryItems;

  const [activeCategory, setActiveCategory] = useState<'All' | 'Critical' | 'At Risk' | 'Compliant'>('All');
  
  const filteredItems = allRecoveryItems.filter(item => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Critical') return item.category === 'Critical';
    if (activeCategory === 'At Risk') return item.category === 'At Risk';
    if (activeCategory === 'Compliant') return item.category === 'Compliant';
    return true;
  });

  // Helper: find item matching an id/title string (case-insensitive, partial match)
  const findItemByKey = (key: string) => {
    if (!key) return null;
    const lower = key.toLowerCase();
    return allRecoveryItems.find(
      item =>
        item.id === key ||
        item.id.toLowerCase().includes(lower) ||
        item.title.toLowerCase().includes(lower) ||
        lower.includes(item.title.toLowerCase())
    ) || null;
  };

  const resolvedInitialId = initialCaseId
    ? (findItemByKey(initialCaseId)?.id || allRecoveryItems[0]?.id || 'VIG-R26-001')
    : (allRecoveryItems[0]?.id || 'VIG-R26-001');

  const [selectedId, setSelectedId] = useState<string>(resolvedInitialId);

  useEffect(() => {
    if (initialCaseId) {
      const match = findItemByKey(initialCaseId);
      if (match) {
        setSelectedId(match.id);
        resetSimulation();
      }
    }
  }, [initialCaseId]);

  const selectedItem = allRecoveryItems.find(item => item.id === selectedId) || allRecoveryItems[0];

  // Interactive state for selected remediation item
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'modified' | 'rejected'>('pending');
  const [adminNote, setAdminNote] = useState<string>('');
  const [showInlineNoteEditor, setShowInlineNoteEditor] = useState<boolean>(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState<boolean>(false);
  const [tempNote, setTempNote] = useState<string>('');
  
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; type: string; path?: string }>>([]);
  const [parsedCSVRecords, setParsedCSVRecords] = useState<Record<string, string>[]>([]);
  const [csvSourceTitle, setCsvSourceTitle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const [checkedEvidence, setCheckedEvidence] = useState<{ [key: string]: boolean }>({
    item0: true,
    item1: true,
    item2: false,
    item3: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Evaluation Result State
  const [evidenceEvaluation, setEvidenceEvaluation] = useState<EvaluationResult | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    evaluated: boolean;
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'EVIDENCE_PENDING';
    isCompliant: boolean;
    missingPrerequisites: string[];
    details: string;
    evaluatedRuleId: string;
    actualValue: string;
  }>({
    evaluated: false,
    status: 'EVIDENCE_PENDING',
    isCompliant: false,
    missingPrerequisites: [],
    details: '',
    evaluatedRuleId: '',
    actualValue: ''
  });

  // Automatically evaluate evidence when selectedItem or parsed records change
  useEffect(() => {
    if (parsedCSVRecords.length > 0) {
      const result = evaluateEvidenceAgainstRule(
        selectedItem.id,
        selectedItem.title,
        selectedItem.required,
        parsedCSVRecords
      );
      setEvidenceEvaluation(result);
    } else {
      setEvidenceEvaluation(null);
    }
  }, [selectedId, parsedCSVRecords]);

  const toggleEvidence = (key: string) => {
    setCheckedEvidence(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenModify = () => {
    setTempNote(adminNote || '');
    setShowInlineNoteEditor(true);
  };

  const handleSaveModification = () => {
    setAdminNote(tempNote);
    setApprovalStatus('modified');
    setShowInlineNoteEditor(false);
    setIsModifyModalOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleTriggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTriggerFolderUpload = () => {
    folderInputRef.current?.click();
  };

  // Process and ingest CSV string
  const processCSVContent = (content: string, fileName: string, fileSizeStr: string) => {
    const records = parseCSV(content);
    setParsedCSVRecords(records);
    setCsvSourceTitle(fileName);
    setEvidenceUploaded(true);
    
    // Add to uploaded files list if not already present
    setUploadedFiles(prev => {
      if (prev.some(f => f.name === fileName)) return prev;
      return [
        {
          name: fileName,
          size: fileSizeStr,
          type: 'CSV_DATASET',
          path: `evidence/${fileName}`
        },
        ...prev
      ];
    });

    setCheckedEvidence({
      item0: true,
      item1: true,
      item2: true,
      item3: true
    });

    // Evaluate for selected rule
    const evalRes = evaluateEvidenceAgainstRule(
      selectedItem.id,
      selectedItem.title,
      selectedItem.required,
      records
    );
    setEvidenceEvaluation(evalRes);
  };

  // Load Preset CSV (Compliant / Mismatched / Unrelated)
  const handleLoadPresetCSV = (presetType: 'compliant' | 'mismatched' | 'unrelated') => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      if (presetType === 'compliant') {
        processCSVContent(SAMPLE_26_COMPLIANT_CSV, 'VFSTR_Compliance_Audit_All26_Valid.csv', '4.8 KB');
      } else if (presetType === 'mismatched') {
        processCSVContent(SAMPLE_26_MISMATCHED_CSV, 'VFSTR_Compliance_Audit_Mismatched_Violations.csv', '5.2 KB');
      } else {
        processCSVContent(SAMPLE_UNRELATED_CSV, 'Unrelated_Purchase_Ledger_Data.csv', '1.4 KB');
      }
    }, 400);
  };

  // Download Sample CSV template for user
  const handleDownloadCSVTemplate = (type: 'compliant' | 'mismatched') => {
    const csvContent = type === 'compliant' ? SAMPLE_26_COMPLIANT_CSV : SAMPLE_26_MISMATCHED_CSV;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VFSTR_26_Regulations_${type}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);
    setIsUploading(true);

    const firstFile = selectedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTimeout(() => {
        setIsUploading(false);
        const newFiles = selectedFiles.map(f => ({
          name: f.name,
          size: formatFileSize(f.size),
          type: f.type || f.name.split('.').pop()?.toUpperCase() || 'DOCUMENT',
          path: (f as any).webkitRelativePath || f.name
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);

        // If it's a CSV or text, parse records
        if (firstFile.name.endsWith('.csv') || firstFile.name.endsWith('.txt') || text.includes(',')) {
          processCSVContent(text, firstFile.name, formatFileSize(firstFile.size));
        } else {
          setEvidenceUploaded(true);
        }
      }, 500);
    };

    reader.onerror = () => {
      setIsUploading(false);
    };

    if (firstFile.name.endsWith('.csv') || firstFile.name.endsWith('.txt') || firstFile.type.includes('csv') || firstFile.type.includes('text')) {
      reader.readAsText(firstFile);
    } else {
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFiles(prev => [
          ...prev,
          ...selectedFiles.map(f => ({
            name: f.name,
            size: formatFileSize(f.size),
            type: f.name.split('.').pop()?.toUpperCase() || 'DOCUMENT',
            path: (f as any).webkitRelativePath || f.name
          }))
        ]);
        setEvidenceUploaded(true);
      }, 500);
    }
  };

  const handleAttachPresetFile = (fileName: string, size: string, folderName: string) => {
    if (uploadedFiles.some(f => f.name === fileName)) return;
    const newFile = {
      name: fileName,
      size: size,
      type: fileName.split('.').pop()?.toUpperCase() || 'DOCUMENT',
      path: `${folderName}/${fileName}`
    };
    setUploadedFiles(prev => [...prev, newFile]);
    setEvidenceUploaded(true);
    setCheckedEvidence({
      item0: true,
      item1: true,
      item2: true,
      item3: true
    });
  };

  const handleRemoveFile = (index: number) => {
    const nextFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(nextFiles);
    if (nextFiles.length === 0) {
      setEvidenceUploaded(false);
      setParsedCSVRecords([]);
      setEvidenceEvaluation(null);
    }
  };

  // ── CORE VERIFICATION ENGINE EXECUTION ──
  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);

      const missing: string[] = [];
      const isAdminApproved = approvalStatus === 'approved' || approvalStatus === 'modified';

      // 1. Gate 1: Admin Approval Check
      if (!isAdminApproved) {
        if (approvalStatus === 'rejected') {
          missing.push('Gate 1 Rejected: Administrator formally rejected remediation execution.');
        } else {
          missing.push('Gate 1 Incomplete: Administrator Approval required (currently PENDING sign-off).');
        }
      }

      // 2. Gate 2: Evidence CSV Evaluation
      let evalStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'EVIDENCE_PENDING' = 'EVIDENCE_PENDING';
      let evalDetail = '';
      let actualVal = '';

      if (parsedCSVRecords.length === 0 && !evidenceUploaded) {
        missing.push('Gate 2 Incomplete: No statutory evidence CSV attached (upload evidence package).');
        evalStatus = 'EVIDENCE_PENDING';
        evalDetail = 'Awaiting evidence submission.';
      } else {
        const evalRes = evaluateEvidenceAgainstRule(
          selectedItem.id,
          selectedItem.title,
          selectedItem.required,
          parsedCSVRecords
        );
        setEvidenceEvaluation(evalRes);

        actualVal = evalRes.actualValue;
        evalDetail = evalRes.reason;

        if (!evalRes.matchFound) {
          // CASE 2: Uploaded file is wrong / no matching data
          missing.push(`Gate 2 Missing Match: CSV contains ${parsedCSVRecords.length} rows, but no evidence row for ${selectedItem.id}.`);
          evalStatus = 'EVIDENCE_PENDING';
        } else if (evalRes.status === 'NON_COMPLIANT') {
          // CASE 3: Data is mismatched / violates statutory condition
          missing.push(`Gate 2 Condition Violated: Evidence value "${evalRes.actualValue}" fails required "${evalRes.requiredNorm}".`);
          evalStatus = 'NON_COMPLIANT';
        } else {
          // CASE 1: Data matched and condition fulfilled!
          evalStatus = 'COMPLIANT';
        }
      }

      // Overall Gate check:
      const finalVerdict: 'COMPLIANT' | 'NON_COMPLIANT' | 'EVIDENCE_PENDING' =
        !isAdminApproved
          ? (evalStatus === 'NON_COMPLIANT' ? 'NON_COMPLIANT' : 'EVIDENCE_PENDING')
          : evalStatus;

      const isPass = finalVerdict === 'COMPLIANT' && missing.length === 0;

      setVerificationResult({
        evaluated: true,
        status: finalVerdict,
        isCompliant: isPass,
        missingPrerequisites: missing,
        details: evalDetail || (isPass ? 'Statutory criteria fulfilled.' : 'Deficiency detected.'),
        evaluatedRuleId: selectedItem.id,
        actualValue: actualVal
      });

      // ── PROPAGATE COMPLIANCE OVER ALL PAGES ──
      if (onUpdateCompliance) {
        if (finalVerdict === 'COMPLIANT' && isPass) {
          onUpdateCompliance(selectedItem.id, 'COMPLIANT', actualVal, 'None (Evidence Verified & Compliant)');
        } else if (finalVerdict === 'NON_COMPLIANT') {
          onUpdateCompliance(selectedItem.id, 'NON_COMPLIANT', actualVal, `Deficiency: ${evalDetail}`);
        } else {
          onUpdateCompliance(selectedItem.id, 'EVIDENCE_PENDING', actualVal, 'Awaiting valid evidence');
        }
      }
    }, 800);
  };

  // Ingest all 26 rules from uploaded CSV across the entire application at once!
  const handleBatchIngestAll26Rules = () => {
    if (parsedCSVRecords.length === 0 || !onUpdateCompliance) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      let updatedCount = 0;
      parsedCSVRecords.forEach(rec => {
        const id = rec.requirement_id || rec.id;
        if (id) {
          const evalRes = evaluateEvidenceAgainstRule(id, rec.requirement_name || id, rec.required_value || '', parsedCSVRecords);
          onUpdateCompliance(id, evalRes.status, evalRes.actualValue, evalRes.shortfall);
          updatedCount++;
        }
      });
      alert(`Successfully audited & synchronized ${updatedCount} regulations across all application dashboards!`);
    }, 600);
  };

  const resetSimulation = () => {
    setApprovalStatus('pending');
    setAdminNote('');
    setTempNote('');
    setShowInlineNoteEditor(false);
    setIsEvidenceModalOpen(false);
    setUploadedFiles([]);
    setParsedCSVRecords([]);
    setCsvSourceTitle('');
    setEvidenceUploaded(false);
    setEvidenceEvaluation(null);
    setVerificationResult({
      evaluated: false,
      status: 'EVIDENCE_PENDING',
      isCompliant: false,
      missingPrerequisites: [],
      details: '',
      evaluatedRuleId: '',
      actualValue: ''
    });
    setCheckedEvidence({
      item0: true,
      item1: true,
      item2: false,
      item3: false
    });
  };

  const selectItemById = (id: string) => {
    setSelectedId(id);
    resetSimulation();
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCaseId, setModalCaseId] = useState<string | null>(null);

  const handleOpenModal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setModalCaseId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalCaseId(null);
  };

  const modalItem = allRecoveryItems.find(item => item.id === modalCaseId) || selectedItem;

  return (
    <div className="space-y-6 font-sans pb-10">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200 text-white">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-800 leading-none">Remediation Center</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1">
                🔴 Compliance Recovery Center
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Turn compliance gaps into trackable corrective actions · Live Database Integration
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-[11px] font-bold shadow-sm transition-all cursor-pointer"
            title="Reset Simulation State for Demo"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Demo State
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest">Recovery Engine Active</span>
          </div>
        </div>
      </div>

      {/* ── 1. TOP KPI STRIP (Dynamic from Database) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Open Issues */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md shadow-amber-200">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
              🟡 Action Required
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 leading-none mt-1">{totalOpenRisks || 5}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Open Issues</p>
        </div>

        {/* Critical Issues */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shadow-red-200">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 flex items-center gap-1">
              🔴 High Risk Exposure
            </span>
          </div>
          <p className="text-3xl font-black text-red-600 leading-none mt-1">{criticalCount}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Critical Issues</p>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
              🔵 Active Plans
            </span>
          </div>
          <p className="text-3xl font-black text-blue-600 leading-none mt-1">{allRecoveryItems.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Total Regulations Checked</p>
        </div>

        {/* Resolution Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
              🟢 +14% this week
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-600 leading-none mt-1">72%</p>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: '72%' }} />
          </div>
        </div>
      </div>

      {/* ── SELECTOR STRIP WITH CASE DROPDOWN & FILTER TABS (ALL 6 REGULATIONS) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        
        {/* Prominent Case Selector Header */}
        <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">
                ⚡ Select Case to View AI Recovery Plan
              </span>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>{selectedItem.title}</span>
                <span className="text-xs text-slate-300 font-semibold">({selectedItem.dept})</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="case-select" className="text-[11px] font-bold text-slate-300 whitespace-nowrap hidden sm:inline">
              Choose Case:
            </label>
            <select
              id="case-select"
              value={selectedItem.id}
              onChange={(e) => selectItemById(e.target.value)}
              className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full sm:w-auto"
            >
              {allRecoveryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.category === 'Critical' ? '🔴' : item.category === 'At Risk' ? '🟠' : '🟢'} {item.title} ({item.dept})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
              All Active Regulations & Remediation Cases ({allRecoveryItems.length})
            </h3>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(['All', 'Critical', 'At Risk', 'Compliant'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat} {cat === 'All' ? `(${allRecoveryItems.length})` : cat === 'Critical' ? `(2)` : cat === 'At Risk' ? `(3)` : `(1)`}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => selectItemById(item.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden ${
                selectedItem.id === item.id
                  ? 'bg-blue-50/90 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100/90 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border flex items-center gap-1 ${
                  item.category === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                  item.category === 'At Risk' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                  {item.riskBadge}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{item.dept}</span>
              </div>

              <div>
                <p className="text-xs font-black text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">{item.title}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">
                  Gap: <span className="text-slate-700 font-black">{item.gapCount} {item.gapUnit}</span>
                </p>
              </div>

              <div 
                onClick={(e) => handleOpenModal(e, item.id)}
                className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-black text-blue-600 group-hover:text-blue-700 cursor-pointer">
                <span>Select Case to View AI Recovery Plan</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. PRIMARY SELECTED REMEDIATION CARD ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-red-500 hover:shadow-md transition-all">
        
        {/* Card Header & Badges */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-50/70 via-white to-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {selectedItem.status}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Department: {selectedItem.dept}
            </span>
            <span className="text-xs font-bold text-slate-700">
              Requirement: <strong className="text-slate-900 font-black">{selectedItem.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Risk Score:</span>
            <div className="px-3 py-1 rounded-lg bg-red-600 text-white font-black text-xs tracking-tight flex items-center gap-1.5 shadow-sm">
              <span>{selectedItem.riskScore} / 100</span>
              <span className="text-[8px] uppercase font-black bg-red-800 px-1.5 py-0.5 rounded">{selectedItem.severity}</span>
            </div>
          </div>
        </div>

        {/* Data Grid & Calculation Formula */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Metrics Breakdown Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Required Target</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{selectedItem.required}</p>
              <p className="text-[10px] font-bold text-slate-500">Statutory Norm</p>
            </div>

            <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">Actual Status</p>
              <p className="text-2xl font-black text-red-600 mt-0.5">{selectedItem.actual}</p>
              <p className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">🔴 Gap Detected</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scope Unit</p>
              <p className="text-2xl font-black text-blue-700 mt-0.5">{selectedItem.students}</p>
              <p className="text-[10px] font-bold text-slate-500">{selectedItem.dept} Scope</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Count</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{selectedItem.currentValue}</p>
              <p className="text-[10px] font-bold text-slate-500">Active Value</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Threshold</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">{selectedItem.requiredValue}</p>
              <p className="text-[10px] font-bold text-slate-500">Target Value</p>
            </div>

            <div className="bg-red-100/50 border border-red-200 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-red-700 uppercase tracking-widest">Required Correction</p>
              <p className="text-2xl font-black text-red-700 mt-0.5">{selectedItem.gapCount}</p>
              <p className="text-[10px] font-bold text-red-600">{selectedItem.gapUnit}</p>
            </div>
          </div>

          {/* Formula Calculation Box */}
          <div className="lg:col-span-5 bg-slate-900 rounded-xl p-4 text-white text-xs space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-black uppercase tracking-wider">Automated Compliance Formula</span>
            </div>
            
            <div className="space-y-1.5 font-mono text-[11px] text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Department Scope:</span>
                <span className="font-bold text-cyan-300">{selectedItem.formula.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Standard:</span>
                <span className="font-bold text-slate-200">{selectedItem.formula.targetRatio}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1">
                <span className="text-slate-400">Target Required Count:</span>
                <span className="font-bold text-emerald-400">{selectedItem.formula.requiredStaff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Active Count:</span>
                <span className="font-bold text-rose-400">{selectedItem.formula.currentStaff}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1 text-xs">
                <span className="text-rose-300 font-bold">Calculated Shortfall:</span>
                <span className="font-black text-rose-400">{selectedItem.formula.gap} ({selectedItem.gapUnit})</span>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 text-red-200 text-[11px] leading-relaxed">
              <strong className="text-red-300 font-black">Compliance Impact:</strong> “{selectedItem.impact}”
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. REGULATION → GAP VISUALIZATION ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
            Regulation → Compliance Gap Analysis Engine
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {/* Node 1 */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-700 mb-1">
              01. REGULATORY REQUIREMENT
            </div>
            <div className="text-2xl font-black text-blue-900">{selectedItem.flow.req}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Statutory Target</div>
          </div>

          {/* Node 2 */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-red-700 mb-1">
              🔴 02. UNIVERSITY ACTUAL
            </div>
            <div className="text-2xl font-black text-red-600">{selectedItem.flow.actual}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">{selectedItem.dept} Current Load</div>
          </div>

          {/* Node 3 */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-amber-700 mb-1">
              🟡 03. COMPLIANCE GAP
            </div>
            <div className="text-2xl font-black text-amber-600">{selectedItem.flow.gap}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Regulatory Overload</div>
          </div>

          {/* Node 4 */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-1">
              🟢 04. REQUIRED CORRECTION
            </div>
            <div className="text-2xl font-black text-emerald-600">{selectedItem.flow.correction}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">To Restore Compliance</div>
          </div>
        </div>
      </div>

      {/* ── GRID LAYOUT FOR RECOVERY PLAN & BEFORE/AFTER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── 4. AI RECOVERY PLAN (Left Column - 7 cols) ── */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-black text-slate-800 text-sm">AI Recommended Recovery Plan — {selectedItem.title}</h3>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              4 Step Action Timeline
            </span>
          </div>

          {/* Step Timeline */}
          <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
            {selectedItem.recoveryPlan.map((stepItem: any, i: number) => (
              <div key={i} className="relative pl-10">
                <div className={`absolute left-2.5 top-0 -translate-x-1/2 w-6 h-6 rounded-full text-white font-black text-[10px] flex items-center justify-center ring-4 ring-white shadow-sm ${
                  i === 0 ? 'bg-red-600' : i === 1 ? 'bg-amber-500' : i === 2 ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {stepItem.step}
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-black text-slate-800">{stepItem.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border flex items-center gap-1 ${
                      i === 0 ? 'bg-red-100 text-red-700 border-red-200' : i === 1 ? 'bg-amber-100 text-amber-700 border-amber-200' : i === 2 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}>
                      Status: {stepItem.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-black uppercase">Owner</span>
                      <span className="text-slate-700 font-bold">{stepItem.owner}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-black uppercase">Supporting Unit</span>
                      <span className="text-slate-700 font-bold">{stepItem.support}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-black uppercase">Lead Time</span>
                      <span className="text-blue-600 font-bold">{stepItem.lead}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-black uppercase">Priority</span>
                      <span className="text-red-600 font-black">{stepItem.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN (5 cols) - BEFORE/AFTER & AI EXPLANATION & PROJECTED IMPACT ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* ── 5. BEFORE → AFTER VISUAL ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                Current vs Target Compliance State
              </h3>
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Projected after remediation
              </span>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-2 gap-3 relative">
              {/* Current State */}
              <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-red-600 block">CURRENT STATE</span>
                <p className="text-2xl font-black text-red-600">{selectedItem.actual}</p>
                <div className="inline-flex items-center gap-1 text-[9px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                  🔴 NON-COMPLIANT
                </div>
                <div className="text-[11px] text-slate-600 pt-1 space-y-0.5">
                  <p>Active: <strong className="text-slate-800 font-bold">{selectedItem.currentValue}</strong></p>
                  <p>Shortfall: <strong className="text-red-600 font-black">{selectedItem.gapCount}</strong></p>
                </div>
              </div>

              {/* Target State */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 block">TARGET STATE</span>
                <p className="text-2xl font-black text-emerald-600">{selectedItem.required}</p>
                <div className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  🟢 COMPLIANT
                </div>
                <div className="text-[11px] text-slate-600 pt-1 space-y-0.5">
                  <p>Target: <strong className="text-slate-800 font-bold">{selectedItem.requiredValue}</strong></p>
                  <p>Shortfall: <strong className="text-emerald-600 font-black">0</strong></p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-semibold italic">
              Note: Target values reflect projected status after full execution of corrective actions.
            </p>
          </div>

          {/* ── 6. PROJECTED IMPACT PANEL ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                Projected Impact After Successful Remediation
              </h3>
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-bold">Risk Score:</span>
                <span className="font-black text-red-600">🔴 {selectedItem.riskScore} → <strong className="text-emerald-600">🟢 12 (Low)</strong></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-bold">Gap Count:</span>
                <span className="font-black text-amber-600">🟡 {selectedItem.gapCount} → <strong className="text-emerald-600">🟢 0</strong></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-bold">Compliance Status:</span>
                <span className="font-black text-red-600">🔴 Fail → <strong className="text-emerald-600">🟢 Pass</strong></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-bold">Inspection Readiness:</span>
                <span className="font-black text-amber-600">🔴 Low → <strong className="text-blue-600">🟢 High</strong></span>
              </div>
            </div>
          </div>

          {/* ── 7. AI EXPLANATION ── */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black text-slate-800">Why this remediation?</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 border border-blue-200">
                AI Reasoning / Evidence Based
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              “{selectedItem.whyText}”
            </p>
          </div>

        </div>
      </div>

      {/* ── LOWER SECTION: HUMAN APPROVAL & EVIDENCE & RE-CHECK ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── 8. HUMAN APPROVAL ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-800">Administrator Approval</h3>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Required Gate</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Remediation involves institutional commitments. Administrator formal sign-off is required to activate execution.
            </p>

            {/* Approval Workflow Pipeline */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] space-y-2">
              <div className="flex items-center justify-between text-slate-500 font-bold">
                <span>AI Recommendation</span>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="flex items-center justify-between text-slate-700 font-bold">
                <span>Administrator Review</span>
                <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-1 ${
                  approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                  approvalStatus === 'modified' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  approvalStatus === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {approvalStatus === 'approved' ? '🟢 APPROVED' : approvalStatus === 'modified' ? '🟡 MODIFIED' : approvalStatus === 'rejected' ? '🔴 REJECTED' : '🔵 PENDING'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 font-bold">
                <span>Action Assignment</span>
                <span className="text-[10px] text-slate-400 font-semibold">Pending Approval</span>
              </div>
            </div>

            {/* INLINE MINI NOTE WRITER (Opens when clicking Modify) */}
            {showInlineNoteEditor && (
              <div className="bg-amber-50/90 border-2 border-amber-300 rounded-xl p-3 space-y-2.5 shadow-sm animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-900 text-xs flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    Administrator Modification Note
                  </span>
                  <button
                    onClick={() => setShowInlineNoteEditor(false)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  placeholder="Write administrator notes, directives, or conditions for this remediation..."
                  rows={3}
                  autoFocus
                  className="w-full text-xs p-2.5 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800 font-medium placeholder:text-slate-400"
                />

                {/* Quick Directive Chips */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-amber-800/70 tracking-wider">Quick Suggestions:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      'Grant 14-day extension',
                      'Require IQAC Signoff',
                      'Adjust Target Ratio',
                      'Physical Audit Required'
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTempNote(prev => prev ? `${prev}\n• ${preset}` : `• ${preset}`)}
                        className="text-[9px] font-bold bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded transition-all cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-amber-200/70">
                  <button
                    type="button"
                    onClick={() => setShowInlineNoteEditor(false)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModification}
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black rounded-lg shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Modification
                  </button>
                </div>
              </div>
            )}

            {/* Admin Modification Note Display (if saved and editor closed) */}
            {!showInlineNoteEditor && approvalStatus === 'modified' && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-800 flex items-center gap-1.5 text-[11px]">
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    Admin Modification Applied
                  </span>
                  <button
                    onClick={handleOpenModify}
                    className="text-[10px] font-black text-amber-700 hover:text-amber-900 underline cursor-pointer"
                  >
                    Edit Note
                  </button>
                </div>
                {adminNote ? (
                  <p className="text-[11px] text-slate-700 bg-white/90 p-2 rounded-lg border border-amber-200/60 font-medium leading-relaxed italic whitespace-pre-line">
                    "{adminNote}"
                  </p>
                ) : (
                  <p className="text-[10px] text-amber-700 italic">No specific directives written yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Approval Action Buttons */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setApprovalStatus('approved');
                  setShowInlineNoteEditor(false);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  approvalStatus === 'approved'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'bg-slate-100 hover:bg-emerald-50 text-emerald-700 border border-slate-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                Approve
              </button>

              <button
                onClick={handleOpenModify}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  approvalStatus === 'modified' || showInlineNoteEditor
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                    : 'bg-slate-100 hover:bg-amber-50 text-amber-700 border border-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Modify
              </button>

              <button
                onClick={() => {
                  setApprovalStatus('rejected');
                  setShowInlineNoteEditor(false);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  approvalStatus === 'rejected'
                    ? 'bg-red-600 text-white shadow-md shadow-red-200'
                    : 'bg-slate-100 hover:bg-red-50 text-red-700 border border-slate-200'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>

            {approvalStatus !== 'pending' && (
              <div className="text-[11px] text-center font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                Status updated to <strong className="text-blue-600 font-black">{approvalStatus.toUpperCase()}</strong> by Admin
              </div>
            )}
          </div>
        </div>

        {/* ── 9. EVIDENCE CHECKLIST & CSV EVALUATOR ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-800">Required Evidence (26-Rule CSV)</h3>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {parsedCSVRecords.length > 0 ? `${parsedCSVRecords.length} CSV Rows (${csvSourceTitle || 'Active'})` : `${uploadedFiles.length} Uploaded`}
              </span>
            </div>

            {/* Quick 1-Click CSV Test Presets */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Test CSV Evidence Dataset:
                </span>
                <span className="text-[9px] text-blue-600 font-bold">26 Rules</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleLoadPresetCSV('compliant')}
                  className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-black transition-all cursor-pointer text-center truncate"
                  title="Loads valid CSV where all 26 rules pass conditions"
                >
                  🟢 26 Compliant
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPresetCSV('mismatched')}
                  className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-[10px] font-black transition-all cursor-pointer text-center truncate"
                  title="Loads CSV with values violating statutory thresholds"
                >
                  🔴 Mismatched
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPresetCSV('unrelated')}
                  className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-black transition-all cursor-pointer text-center truncate"
                  title="Loads wrong/unrelated data without matching rule IDs"
                >
                  🟡 Wrong File
                </button>
              </div>
            </div>

            {/* Active Rule CSV Evidence Status Banner */}
            {evidenceEvaluation ? (
              <div className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                evidenceEvaluation.status === 'COMPLIANT'
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                  : evidenceEvaluation.status === 'NON_COMPLIANT'
                  ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                  : 'bg-amber-50/90 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                    {evidenceEvaluation.status === 'COMPLIANT' ? '🟢 Condition Fulfilled' :
                     evidenceEvaluation.status === 'NON_COMPLIANT' ? '🔴 Condition Mismatched' :
                     '🟡 No Matching Evidence'}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/80 border border-current">
                    {selectedItem.id}
                  </span>
                </div>
                <div className="text-[11px] font-medium leading-tight">
                  <p><strong>Audited Value:</strong> {evidenceEvaluation.actualValue}</p>
                  <p className="text-[10px] opacity-90 mt-0.5">{evidenceEvaluation.reason}</p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-[11px] text-slate-500 font-medium">
                Upload a statutory CSV file or select a preset above to evaluate evidence for <strong>{selectedItem.id}</strong>.
              </div>
            )}

            {/* Checklist items */}
<<<<<<< HEAD
            <div className="space-y-1.5 text-xs">
              {selectedItem.evidence.map((ev: any, i: number) => (
                <label key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-all">
=======
            <div className="space-y-2 text-xs">
              {selectedItem.evidence.map((ev: any, i: number) => (
                <label key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-all">
>>>>>>> db81771e10c5fd8361462266966be508cca4780e
                  <input
                    type="checkbox"
                    checked={checkedEvidence[`item${i}`]}
                    onChange={() => toggleEvidence(`item${i}`)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className={checkedEvidence[`item${i}`] ? 'line-through text-slate-400 font-bold text-[11px]' : 'text-slate-700 font-bold text-[11px]'}>
                    {ev}
                  </span>
                </label>
              ))}
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1 border-t border-slate-100 pt-2">
                <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  <span>Attached Files ({uploadedFiles.length})</span>
                  <span className="text-emerald-600 font-bold">✓ Parsed</span>
                </div>
                {uploadedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-blue-50/70 border border-blue-100 rounded-lg px-2 py-1 text-[10px] hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate pr-1">
                      <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-700 truncate" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(idx);
                      }}
                      title="Remove file"
                      className="text-slate-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .txt, .xlsx, .json"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Hidden Folder Input */}
            <input
              ref={folderInputRef}
              type="file"
              {...({ webkitdirectory: '', directory: '' } as any)}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleTriggerFileUpload}
                disabled={isUploading}
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-200 transition-all disabled:opacity-50 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                Upload CSV
              </button>

              <button
                type="button"
                onClick={() => setIsEvidenceModalOpen(true)}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                Folder Browser
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 py-1.5 px-2.5 rounded-lg border border-slate-100">
              <span>Evidence Package:</span>
              <span className={evidenceUploaded ? 'text-emerald-600 font-black' : 'text-amber-600 font-black'}>
                {evidenceUploaded ? `🟢 Ingested (${parsedCSVRecords.length || uploadedFiles.length} items)` : '🟡 Pending Upload'}
              </span>
            </div>
          </div>
        </div>

        {/* ── 10. VERIFICATION / RE-CHECK ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-800">Compliance Re-check</h3>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rule Engine v4.2</span>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
              Automated audit recalculation pipeline. Evaluates CSV data for <strong>{selectedItem.id}</strong> against regulatory clauses.
            </p>

            {/* Workflow steps */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] space-y-1.5 mb-3 font-mono">
              <div className="flex items-center justify-between text-slate-600">
                <span>Remediation Target</span>
                <span className="text-blue-600 font-bold">{selectedItem.id}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Admin Sign-off Gate</span>
                <span className={
                  approvalStatus === 'approved'
                    ? 'text-emerald-600 font-bold'
                    : approvalStatus === 'modified'
                    ? 'text-amber-600 font-bold'
                    : approvalStatus === 'rejected'
                    ? 'text-red-600 font-bold'
                    : 'text-slate-400 font-semibold'
                }>
                  {approvalStatus === 'approved'
                    ? '✓ Approved'
                    : approvalStatus === 'modified'
                    ? '✓ Modified'
                    : approvalStatus === 'rejected'
                    ? '✕ Rejected'
                    : '⏳ Pending Signoff'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Evidence Record Match</span>
                <span className={
                  evidenceEvaluation?.matchFound
                    ? 'text-emerald-600 font-bold'
                    : 'text-amber-600 font-semibold'
                }>
                  {evidenceEvaluation?.matchFound ? '✓ Record Found' : '⏳ No Record Match'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Statutory Condition Check</span>
                <span className={
                  evidenceEvaluation?.status === 'COMPLIANT'
                    ? 'text-emerald-600 font-bold'
                    : evidenceEvaluation?.status === 'NON_COMPLIANT'
                    ? 'text-rose-600 font-bold'
                    : 'text-slate-400'
                }>
                  {evidenceEvaluation?.status === 'COMPLIANT' ? '✓ Criteria Met' :
                   evidenceEvaluation?.status === 'NON_COMPLIANT' ? '✕ Mismatched' :
                   '⏳ Pending Evaluation'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-1 text-slate-800 font-bold">
                <span>Verification Verdict</span>
                <span className={
                  !verificationResult.evaluated
                    ? 'text-slate-400 font-bold'
                    : verificationResult.status === 'COMPLIANT' && verificationResult.isCompliant
                    ? 'text-emerald-600 font-black'
                    : verificationResult.status === 'NON_COMPLIANT'
                    ? 'text-rose-600 font-black'
                    : 'text-amber-600 font-black'
                }>
                  {!verificationResult.evaluated
                    ? '🔵 Awaiting Trigger'
                    : verificationResult.status === 'COMPLIANT' && verificationResult.isCompliant
                    ? '🟢 COMPLIANT'
                    : verificationResult.status === 'NON_COMPLIANT'
                    ? '🔴 NON-COMPLIANT'
                    : '🟡 EVIDENCE PENDING'}
                </span>
              </div>
            </div>

            {/* CASE 1: COMPLIANT RESULT */}
            {verificationResult.evaluated && verificationResult.status === 'COMPLIANT' && verificationResult.isCompliant && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-black text-emerald-700 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>🟢 COMPLIANT — Condition Fulfilled!</span>
                </div>
                <div className="text-[11px] space-y-0.5 pt-0.5 text-slate-700 font-medium">
                  <p>✓ Evidence matched in CSV: <strong className="text-emerald-800 font-bold">{verificationResult.actualValue}</strong></p>
                  <p>✓ Statutory norm satisfied: <strong className="text-slate-800">{selectedItem.required}</strong></p>
                  <p>✓ Administrator formal sign-off confirmed ({approvalStatus.toUpperCase()})</p>
                  <p className="text-emerald-700 font-bold">✓ Status updated to COMPLIANT across all pages!</p>
                </div>
                <div className="pt-1 text-[11px] font-black text-emerald-700 border-t border-emerald-200 flex justify-between">
                  <span>Audit Verdict:</span>
                  <span>PASSED (Zero Gap)</span>
                </div>
              </div>
            )}

            {/* CASE 2: EVIDENCE PENDING (Wrong file or no match found) */}
            {verificationResult.evaluated && verificationResult.status === 'EVIDENCE_PENDING' && (
              <div className="bg-amber-50/95 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-black text-amber-900 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>🟡 EVIDENCE PENDING (Missing Matching Record)</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-tight">
                  {verificationResult.details || `The uploaded file does not contain valid statutory evidence data for rule ${selectedItem.id}. Evidence is still pending.`}
                </p>
                {verificationResult.missingPrerequisites.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {verificationResult.missingPrerequisites.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 bg-white p-1.5 rounded-lg border border-amber-200 text-[10px] font-bold text-amber-900">
                        <X className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-amber-800 font-bold border-t border-amber-200 pt-1">
                  Status remains EVIDENCE PENDING across all pages.
                </p>
              </div>
            )}

            {/* CASE 3: NON-COMPLIANT (Data found but mismatched with statutory rule condition) */}
            {verificationResult.evaluated && verificationResult.status === 'NON_COMPLIANT' && (
              <div className="bg-rose-50/95 border border-rose-300 rounded-xl p-3 text-xs text-rose-950 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-black text-rose-700 text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>🔴 NON-COMPLIANT (Condition Violated)</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-tight">
                  Evidence for <strong>{selectedItem.id}</strong> was audited, but the recorded value <strong className="text-rose-700">"{verificationResult.actualValue}"</strong> violates the required statutory standard <strong className="text-slate-900">"{selectedItem.required}"</strong>.
                </p>
                <div className="bg-white p-2 rounded-lg border border-rose-200 text-[11px] text-rose-900 font-bold space-y-0.5">
                  <p>• Reason: {verificationResult.details}</p>
                  <p>• Shortfall: {evidenceEvaluation?.shortfall || 'Deficiency detected in audit data'}</p>
                </div>
                <p className="text-[10px] text-rose-800 font-black border-t border-rose-200 pt-1">
                  Status updated to NON-COMPLIANT across all pages.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all disabled:opacity-50 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              {isVerifying ? 'Evaluating Rule Conditions...' : 'Run Verification & Re-check'}
            </button>

            {parsedCSVRecords.length > 0 && (
              <button
                type="button"
                onClick={handleBatchIngestAll26Rules}
                disabled={isVerifying}
                className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                ⚡ Ingest & Audit All 26 Rules Across All Pages
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ── 11. REMEDIATION HISTORY TIMELINE (Real Audit Events) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
              Auditability & Remediation Event History (Agent54 System Log)
            </h3>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Complete Trace Log</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(auditList.length > 0 ? auditList.slice(0, 5) : [
            { timestamp: '2026-09-01T09:00:00Z', agent: 'Regulation Agent', action: 'Extracted 5 requirements', status: 'success' },
            { timestamp: '2026-09-01T09:01:10Z', agent: 'Compliance Agent', action: 'Ran checks for all depts', status: 'success' },
            { timestamp: '2026-09-01T09:01:15Z', agent: 'Change Monitoring', action: 'Detected REQ supersession', status: 'success' },
            { timestamp: '2026-09-01T09:02:00Z', agent: 'Risk & Priority Agent', action: 'Scored 4 open gaps', status: 'success' },
            { timestamp: '2026-09-01T09:02:40Z', agent: 'Remediation Agent', action: 'Proposed 3 remediation actions', status: 'success' },
          ]).map((evt: any, i: number) => (
            <div key={i} className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <div className="text-[9px] font-black text-slate-400 uppercase">
                {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `EVT-00${i+1}`}
              </div>
              <div className="text-xs font-black text-blue-700 mt-0.5">{evt.agent}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5 line-clamp-2">{evt.action}</div>
            </div>
          ))}
        </div>
      </div>



      {/* ── MODAL: AI RECOVERY PLAN ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">AI Recovery Plan</h3>
                  <p className="text-xs text-slate-500 font-semibold">{modalItem.title} • {modalItem.dept}</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              
              {/* AI Explanation */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black text-slate-800">Problem & Solution Overview</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {modalItem.whyText}
                </p>
                <div className="pt-2 text-xs font-bold text-red-600">
                  Impact: {modalItem.impact}
                </div>
              </div>

              {/* Step Timeline */}
              <div>
                <h4 className="text-xs font-black text-slate-800 mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">Execution Steps</h4>
                <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
                  {modalItem.recoveryPlan.map((stepItem: any, i: number) => (
                    <div key={i} className="relative pl-10">
                      <div className={`absolute left-2.5 top-0 -translate-x-1/2 w-6 h-6 rounded-full text-white font-black text-[10px] flex items-center justify-center ring-4 ring-white shadow-sm ${
                        i === 0 ? 'bg-red-600' : i === 1 ? 'bg-amber-500' : i === 2 ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}>
                        {stepItem.step}
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h5 className="text-xs font-black text-slate-800">{stepItem.title}</h5>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border flex items-center gap-1 ${
                            i === 0 ? 'bg-red-100 text-red-700 border-red-200' : i === 1 ? 'bg-amber-100 text-amber-700 border-amber-200' : i === 2 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}>
                            Status: {stepItem.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-1">
                          <div><span className="text-slate-400 block font-black uppercase">Owner</span><span className="text-slate-700 font-bold">{stepItem.owner}</span></div>
                          <div><span className="text-slate-400 block font-black uppercase">Support</span><span className="text-slate-700 font-bold">{stepItem.support}</span></div>
                          <div><span className="text-slate-400 block font-black uppercase">Lead Time</span><span className="text-blue-600 font-bold">{stepItem.lead}</span></div>
                          <div><span className="text-slate-400 block font-black uppercase">Priority</span><span className="text-red-600 font-black">{stepItem.priority}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADMINISTRATOR MODIFICATION ── */}
      {isModifyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsModifyModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Administrator Modification</h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedItem.title} • {selectedItem.dept}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModifyModalOpen(false)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  Change / Modification Instructions
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Enter administrative directives, custom conditions, or changes required prior to final execution.
                </p>
                <textarea
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  placeholder="e.g. Approved with condition: 1) Grant 15 days grace period, 2) Require dean signoff on updated faculty rosters..."
                  rows={4}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Quick Preset Directives */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Quick Preset Directives:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Grant 14-day extension',
                    'Require IQAC Dean verification',
                    'Adjust target compliance ratio',
                    'Request physical onsite inspection'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTempNote(prev => prev ? `${prev}\n• ${preset}` : `• ${preset}`)}
                      className="text-[10px] font-bold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModifyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModification}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Save & Apply Modification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EVIDENCE PACKAGE & FOLDER BROWSER ── */}
      {isEvidenceModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsEvidenceModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-600">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Upload Evidence Packages & Folder Browser</h3>
                  <p className="text-xs text-slate-500 font-semibold">{selectedItem.title} • {selectedItem.dept}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              
              {/* Dropzone & Quick Upload Options */}
              <div className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 rounded-2xl p-5 text-center space-y-3 transition-colors">
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-sm">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Upload 26-Rule CSV File or Folder</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Upload your audit dataset CSV containing evidence rows for the 26 statutory regulations.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={handleTriggerFileUpload}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Browse CSV File
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerFolderUpload}
                    className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FolderUp className="w-3.5 h-3.5" />
                    Select Folder
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadCSVTemplate('compliant')}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Download 26-Rule Compliant CSV Template"
                  >
                    📥 Download CSV Template
                  </button>
                </div>
              </div>

              {/* 1-Click Fast Presets in Modal */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Instant Simulation Test CSV Datasets (26 Regulations)
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">1-Click Load</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      handleLoadPresetCSV('compliant');
                      setIsEvidenceModalOpen(false);
                    }}
                    className="p-3 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left space-y-1 transition-all cursor-pointer group"
                  >
                    <div className="font-black text-emerald-800 text-[11px] flex items-center gap-1">
                      <span>🟢 26 Compliant Dataset</span>
                    </div>
                    <p className="text-[10px] text-emerald-700/80 leading-snug">
                      All 26 statutory rules fulfill conditions (&gt;= 160 credits, &gt;= 75% attendance, 1:15 FSR).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleLoadPresetCSV('mismatched');
                      setIsEvidenceModalOpen(false);
                    }}
                    className="p-3 bg-rose-50/70 hover:bg-rose-100 border border-rose-200 rounded-xl text-left space-y-1 transition-all cursor-pointer group"
                  >
                    <div className="font-black text-rose-800 text-[11px] flex items-center gap-1">
                      <span>🔴 Mismatched / Failing</span>
                    </div>
                    <p className="text-[10px] text-rose-700/80 leading-snug">
                      Records contain data but values fail statutory thresholds (attendance 64%, credits 148).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleLoadPresetCSV('unrelated');
                      setIsEvidenceModalOpen(false);
                    }}
                    className="p-3 bg-amber-50/70 hover:bg-amber-100 border border-amber-200 rounded-xl text-left space-y-1 transition-all cursor-pointer group"
                  >
                    <div className="font-black text-amber-800 text-[11px] flex items-center gap-1">
                      <span>🟡 Unrelated / Wrong CSV</span>
                    </div>
                    <p className="text-[10px] text-amber-700/80 leading-snug">
                      Purchasing transaction log with no statutory rule IDs (evaluates to EVIDENCE PENDING).
                    </p>
                  </button>
                </div>
              </div>

              {/* Institutional Evidence Repository / Pre-Audited Folders */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Institutional Evidence Folder Repository
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold">1-Click Attach</span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Folder 1 */}
                  <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-700 text-xs">
                      <Folder className="w-4 h-4 text-amber-500" />
                      <span>📁 /evidence/2026/faculty_records/</span>
                    </div>
                    <div className="space-y-1.5 pl-6">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-bold text-slate-700">Faculty_Service_Register_Signed_2026.pdf</span>
                          <span className="text-slate-400 font-semibold">(3.2 MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAttachPresetFile('Faculty_Service_Register_Signed_2026.pdf', '3.2 MB', 'faculty_records')}
                          className="px-2.5 py-1 text-[10px] font-black text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md cursor-pointer"
                        >
                          + Attach
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-bold text-slate-700">Cadre_Ratio_Worksheet_Approved.xlsx</span>
                          <span className="text-slate-400 font-semibold">(1.1 MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAttachPresetFile('Cadre_Ratio_Worksheet_Approved.xlsx', '1.1 MB', 'faculty_records')}
                          className="px-2.5 py-1 text-[10px] font-black text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md cursor-pointer"
                        >
                          + Attach
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Folder 2 */}
                  <div className="border border-slate-200/80 rounded-xl p-3 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-700 text-xs">
                      <Folder className="w-4 h-4 text-amber-500" />
                      <span>📁 /evidence/regulations_and_statutes/</span>
                    </div>
                    <div className="space-y-1.5 pl-6">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-bold text-slate-700">VFSTR_Academic_Regulations_R26_BTech.pdf</span>
                          <span className="text-slate-400 font-semibold">(4.5 MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAttachPresetFile('VFSTR_Academic_Regulations_R26_BTech.pdf', '4.5 MB', 'regulations')}
                          className="px-2.5 py-1 text-[10px] font-black text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md cursor-pointer"
                        >
                          + Attach
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-bold text-slate-700">Academic_Council_Minutes_Signed.pdf</span>
                          <span className="text-slate-400 font-semibold">(890 KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAttachPresetFile('Academic_Council_Minutes_Signed.pdf', '890 KB', 'regulations')}
                          className="px-2.5 py-1 text-[10px] font-black text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md cursor-pointer"
                        >
                          + Attach
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Currently Attached Packages */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                    <span>Currently Attached Files & Folders ({uploadedFiles.length})</span>
                    <span className="text-emerald-600 font-bold">✓ Ready for Gate Check</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 rounded-lg px-3 py-1.5 text-[11px]"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-700 truncate">{file.name}</span>
                          <span className="text-[9px] text-slate-400 font-semibold shrink-0">({file.size})</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 font-semibold">
                {uploadedFiles.length > 0
                  ? `${uploadedFiles.length} file(s) attached`
                  : 'No evidence packages attached yet'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (uploadedFiles.length === 0) {
                      handleAttachPresetFile('VFSTR_Academic_Regulations_R26_BTech.pdf', '4.5 MB', 'regulations');
                      handleAttachPresetFile('Faculty_Service_Register_Signed_2026.pdf', '3.2 MB', 'faculty_records');
                    }
                    setEvidenceUploaded(true);
                    setCheckedEvidence({ item0: true, item1: true, item2: true, item3: true });
                    setIsEvidenceModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-200 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Confirm & Attach Evidence Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
