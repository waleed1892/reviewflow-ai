# Vendor Onboarding SOP Review — V1 User Stories

**Status:** Draft — Phase 0 discovery artifact  
**Last updated:** 2026-07-21  
**Scope:** Review changes to Vendor Onboarding Standard Operating Procedures (SOPs)

> These stories are hypothesis-based. They describe the intended V1 workflow for a fictional mid-sized organization and must be refined after discovery interviews with procurement, finance, security, legal, or compliance professionals.

## Product boundary

ReviewFlow helps teams review **revisions to a Vendor Onboarding SOP**. It does not perform vendor onboarding itself.

```text
Submit revised SOP
→ compare it with the current approved version
→ identify candidate material changes with citations
→ assign a human reviewer
→ record the review decision
→ publish an approved version for organization members
```

### In scope

- Vendor Onboarding SOP version comparison
- Candidate material-change detection and classification
- Source citations to original and revised text
- Human review decisions and comments
- Audit history for document, task, and decision activity
- Organization-scoped access control

### Out of scope

- Creating or activating vendor records in an ERP
- Collecting vendor banking, tax, contract, or personally identifiable information
- Live sanctions, compliance, or security screening
- Legal or compliance advice
- Automatic approval of an SOP revision
- Automatic reviewer routing in V1

## Role model

Business responsibilities in the SOP are separate from ReviewFlow permissions.

| ReviewFlow permission | Example business responsibility |
| --- | --- |
| Owner | Organization owner or workspace administrator |
| Admin | Procurement Operations Manager or SOP owner |
| Reviewer | Finance Controls Manager, Security Manager, Legal Counsel, Compliance Manager, or Head of Procurement |
| Member | Procurement Analyst or employee who follows the approved procedure |

A person may be a `Reviewer` in ReviewFlow while holding a Finance, Legal, Security, or Compliance responsibility in the underlying business process.

---

## US-01 — Submit and manage an SOP revision

**Priority:** Must have  
**Role:** Organization Administrator / Procurement Operations Manager

> As a Procurement Operations Manager, I want to submit a revised Vendor Onboarding SOP against the current approved version, so that material process-control changes are identified and reviewed before the new procedure becomes effective.

### Acceptance criteria

1. **Given** an approved Vendor Onboarding SOP belongs to my organization, **when** I submit a revised version, **then** the system creates a draft version linked to the approved version.
2. **Given** I submitted a revised version, **when** processing begins, **then** I can see whether the revision is queued, processing, ready for review, or failed.
3. **Given** comparison is ready, **when** I open the revision, **then** I can see candidate material changes with a summary, severity, category, and cited excerpts from both the approved and revised SOP versions.
4. **Given** a change requires human review, **when** I choose an authorized reviewer, **then** the system creates an assigned review task for that reviewer.
5. **Given** the revised SOP is draft or in review, **when** an organization member views the procedure, **then** the draft is not presented as the current approved SOP.
6. **Given** I submit a revision, assign a reviewer, or change revision status, **then** the system records an audit event with the actor, action, time, and affected document version.

### Example material changes

- A required security review is removed for vendors handling customer data.
- A spend threshold requiring additional approval changes.
- Finance ownership of payment-detail verification changes.
- A required insurance or due-diligence document is removed.
- A vendor risk tier changes or a new exception path is added.

### Assumptions to validate

- The Procurement Operations Manager owns or can update the SOP.
- Reviewer assignment is manual in V1.
- AI output is advisory and cannot publish a document without human approval.

---

## US-02 — Review material SOP changes

**Priority:** Must have  
**Role:** Assigned Reviewer

> As a designated reviewer, I want to inspect assigned Vendor Onboarding SOP changes in their original and revised context, so that I can make an informed and accountable decision before the revised procedure is released.

### Acceptance criteria

1. **Given** I am assigned a review task, **when** I open it, **then** I can see the SOP title, version, change summary, severity, affected section, original excerpt, revised excerpt, and rationale for the material-change classification.
2. **Given** I review a task, **when** I make a decision, **then** I can approve the change, reject the proposed revision, request follow-up, or dismiss a finding as not material.
3. **Given** I request follow-up or reject a revision, **when** I submit my decision, **then** I can provide a comment explaining what needs clarification or revision.
4. **Given** I submit a decision, **then** the system records my identity, decision, timestamp, and comment in the audit history.
5. **Given** I am not assigned to a review task and do not have sufficient permission, **then** I cannot make a decision on that task.
6. **Given** an AI finding is incomplete or incorrect, **when** I review it, **then** my human decision takes precedence over the AI output.

### Assumptions to validate

- One reviewer can complete a decision in V1.
- Multi-stage or parallel approvals are a later capability.
- Rejecting a revision does not reject the vendor; it rejects the proposed SOP change.

---

## US-03 — Access the current approved SOP

**Priority:** Must have  
**Role:** Organization Member

> As an organization member who follows the vendor-onboarding process, I want to access the current approved Vendor Onboarding SOP and its effective status, so that I follow the correct procedure rather than an outdated or unapproved version.

### Acceptance criteria

1. **Given** I belong to an organization, **when** I view its Vendor Onboarding SOP, **then** I can access the current approved version.
2. **Given** I open the current approved SOP, **then** I can see its title, version number, effective date, and approval status.
3. **Given** a newer revision is in review, **when** I view the procedure, **then** I can distinguish the current approved version from the draft or in-review version.
4. **Given** I am a member without elevated permission, **then** I cannot approve a revision, assign a reviewer, or alter audit history.
5. **Given** I belong to Organization A, **then** I cannot view SOPs, drafts, review tasks, or audit history belonging to Organization B.

### Assumptions to validate

- Members need read access to the current approved SOP.
- Members do not see full draft content by default.
- A later version can notify affected members when a new SOP becomes effective.

---

## Cross-cutting requirements

These requirements apply to all user stories.

1. **Tenant isolation:** Organization data must be inaccessible to users in other organizations.
2. **Human accountability:** AI can suggest findings but cannot approve or publish an SOP.
3. **Traceability:** Important actions must retain the actor, action, time, and affected resource.
4. **Source grounding:** Material-change findings must show source citations from the compared versions.
5. **Current-version clarity:** Users must be able to distinguish approved, draft, in-review, and failed versions.
6. **Authorization:** Access and actions must be enforced according to the user's organization membership and application permission.

## Open validation questions

- Which SOP changes require Finance, Security, Legal, or Compliance review in practice?
- Should one reviewer be sufficient, or are parallel and sequential approvals required?
- Should members see in-review drafts, a summary only, or no preview at all?
- What evidence must be retained for an audit or incident review?
- Is manual document comparison and approval tracking painful enough to justify a dedicated workflow beyond Word, Google Docs, or SharePoint?
- Which change categories and severities are trustworthy enough for AI-assisted classification?
