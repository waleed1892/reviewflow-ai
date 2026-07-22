# Expected Material Changes — Vendor Onboarding SOP V1.0 → V1.1

**Status:** Ground truth for learning, testing, and future AI evaluation  
**Comparison:** `vendor-onboarding-sop-v1.md` → `vendor-onboarding-sop-v2.md`

> This manifest is the expected human assessment of the intentional document differences. It is not legal, financial, security, or compliance advice. It records a fictional organization's chosen review policy.

## Evaluation guidance

A useful comparison result should identify each material change, classify it plausibly, cite the relevant V1 and V2 text, and route it to a suitable human reviewer. The exact wording of an AI-generated summary does not need to match this file.

A false positive is acceptable only when it does not conceal an expected material change. A reviewer, not an AI model, is accountable for final decisions.

## Expected changes

| ID | Location | Material | Category | Severity | Expected reviewer |
| --- | --- | --- | --- | --- | --- |
| MC-01 | 3. Roles and responsibilities | Yes | Payment control and accountability | High | Finance Controls Manager |
| MC-02 | 4.2 Risk classification | Yes | Approval threshold and risk tiering | High | Head of Procurement / Compliance Manager |
| MC-03 | 4.2 Risk classification | Yes | Data-access risk classification | High | Security and Privacy Manager |
| MC-04 | 4.3 Required information and evidence | Yes | Required evidence | High | Compliance Manager / Procurement Operations Manager |
| MC-05 | 4.3 and 4.4 Payment review | Yes | Payment verification control | High | Finance Controls Manager |
| MC-06 | 4.4 Required reviews | Yes | Security and privacy control | High | Security and Privacy Manager |
| MC-07 | 4.6 Exceptions | Yes | Exception authority and duration | High | Head of Procurement / Compliance Manager |
| MC-08 | 4.8 Periodic review | Yes | Ongoing risk review | Medium | Procurement Operations Manager / Compliance Manager |
| MC-09 | 4.9 Records and retention | Yes | Audit evidence and retention | High | Compliance Manager / Legal Counsel |
| NM-01 | Document metadata | No | Editorial metadata | Low | No reviewer required |
| NM-02 | 4.3 Evidence wording | No | Wording and formatting | Low | No reviewer required |

---

## Material change details

### MC-01 — Finance responsibility for independent payment validation removed

**Location:** Section 3, `Finance / Accounts Payable` responsibility

**V1 text:**

> Independently validates payment-related information and creates the vendor record after approval.

**V2 text:**

> Creates the vendor record after approval.

**Why it matters:** The revised SOP removes Finance's stated independent payment-validation responsibility. This can weaken accountability and make it unclear who owns a payment-control step.

**Expected outcome:** Flag as a high-severity payment-control and responsibility change. Assign or recommend a Finance Controls reviewer.

---

### MC-02 — Standard and enhanced review thresholds increased

**Location:** Section 4.2, Standard and Enhanced risk-tier criteria

**V1 text:**

> Standard: Expected annual spend is below $10,000.

> Enhanced: Expected annual spend is $10,000 or more.

**V2 text:**

> Standard: Expected annual spend is below $25,000.

> Enhanced: Expected annual spend is $25,000 or more.

**Why it matters:** More vendors can follow the standard path rather than receiving the enhanced review path. This changes the organization's approval and review threshold.

**Expected outcome:** Flag as a high-severity approval-threshold and risk-tiering change. Assign or recommend Procurement and Compliance review.

---

### MC-03 — High-risk classification no longer includes customer-data processing

**Location:** Section 4.2, High risk criteria

**V1 text:**

> The vendor processes customer personal data; the vendor accesses production systems or customer environments; or the vendor provides a business-critical service.

**V2 text:**

> The vendor has direct access to production systems; or the vendor provides a business-critical service.

**Why it matters:** Vendors that process customer personal data, access customer environments, or have indirect production access may no longer be classified as high risk.

**Expected outcome:** Flag as a high-severity data-access and risk-classification change. Assign or recommend Security and Privacy review.

---

### MC-04 — Required evidence changed from mandatory to discretionary

**Location:** Section 4.3, Required information and evidence

**V1 text:**

> Enhanced and high-risk vendors must also provide applicable evidence, including relevant insurance certificates, required licenses or certifications.

**V2 text:**

> Insurance certificates, licenses, and certifications may be requested when Procurement Operations considers them relevant.

**Why it matters:** Evidence previously required for enhanced and high-risk vendors becomes discretionary. This can reduce the consistency of due diligence and audit evidence.

**Expected outcome:** Flag as a high-severity required-evidence change. Assign or recommend Procurement Operations and Compliance review.

---

### MC-05 — Independent payment-detail verification replaced with Procurement review

**Location:** Sections 4.3 and 4.4, payment information and review

**V1 text:**

> Payment information must be collected only through the approved Finance process.

> Finance / Accounts Payable must independently verify payment details using an approved method that is separate from the vendor-submitted request.

**V2 text:**

> Payment information may be collected by Procurement Operations using the vendor-submitted request form.

> Finance / Accounts Payable must confirm that Procurement Operations recorded payment-detail review.

**Why it matters:** The revision transfers collection and verification to Procurement and removes an explicit independent-verification requirement. It changes a payment-fraud control and separation-of-duties boundary.

**Expected outcome:** Flag as a high-severity payment-verification control change. Assign or recommend Finance Controls review.

---

### MC-06 — Security and Privacy review criteria narrowed

**Location:** Section 4.4, Security and Privacy review

**V1 text:**

> Security and Privacy must review a vendor before approval when the vendor will process customer personal data, access production systems, connect to Northstar Cloud through an integration, or receive credentials for a Northstar Cloud system.

**V2 text:**

> Security and Privacy must review a vendor before approval only when the vendor has direct access to production systems.

**Why it matters:** Vendors that process customer data, use integrations, or receive system credentials may no longer receive Security and Privacy review.

**Expected outcome:** Flag as a high-severity security and privacy-control change. Assign or recommend Security and Privacy review.

---

### MC-07 — Exception authority and duration expanded

**Location:** Section 4.6, Exceptions

**V1 text:**

> An exception requires an expiration date no more than 30 calendar days after approval.

> The Final Approver and the owner of each omitted review must approve the exception.

**V2 text:**

> An exception requires an expiration date no more than 90 calendar days after approval.

> The Procurement Operations Manager may approve an exception.

**Why it matters:** The revision extends the permitted exception period and reduces the number and seniority of required approvers. It can allow a control bypass to remain in place longer with less oversight.

**Expected outcome:** Flag as a high-severity exception-governance change. Assign or recommend Head of Procurement and Compliance review.

---

### MC-08 — High-risk vendor review frequency reduced

**Location:** Section 4.8, Periodic review

**V1 text:**

> Procurement Operations must review active high-risk vendors at least annually.

**V2 text:**

> Procurement Operations must review active high-risk vendors at least every 24 months.

**Why it matters:** The revision reduces the frequency with which high-risk vendor status, evidence, and open exceptions are reassessed.

**Expected outcome:** Flag as a medium-severity ongoing-risk-review change. Assign or recommend Procurement Operations and Compliance review.

---

### MC-09 — Record-retention period reduced

**Location:** Section 4.9, Records and retention

**V1 text:**

> Retain the request, risk assessment, review outcomes, approvals, exceptions, and supporting evidence for seven years after vendor deactivation.

**V2 text:**

> Retain the request, risk assessment, review outcomes, approvals, exceptions, and supporting evidence for three years after vendor deactivation.

**Why it matters:** The revision reduces the available history for audit, investigation, and compliance purposes.

**Expected outcome:** Flag as a high-severity audit-evidence and retention change. Assign or recommend Compliance and Legal review.

---

## Expected non-material changes

### NM-01 — Draft version metadata

**Location:** Document metadata and revision history

**Difference:** Version changes from `1.0` to `1.1`, and the status changes from approved to draft pending review.

**Why it is not material:** This metadata establishes the document lifecycle state. It does not itself change an operational vendor-onboarding control.

**Expected outcome:** Do not create a review task solely for this difference.

---

### NM-02 — Rewording of the evidence introduction

**Location:** Section 4.3

**Difference:** The introductory sentence changes from `must also provide applicable evidence` to `must provide information needed to complete the assigned review path`.

**Why it is not material on its own:** The wording change alone is stylistic. The separate shift from mandatory insurance, licenses, and certifications to discretionary evidence is captured as MC-04.

**Expected outcome:** Do not report the introductory wording as a separate material change; consolidate the substantive evidence-policy change under MC-04.

## Minimum evaluation criteria

A future comparison implementation should be evaluated on whether it:

1. detects MC-01 through MC-09;
2. does not classify NM-01 or NM-02 as standalone material changes;
3. includes citations that let a reviewer verify the source text;
4. assigns a plausible severity and reviewer recommendation;
5. preserves the distinction between AI suggestions and a human review decision.
