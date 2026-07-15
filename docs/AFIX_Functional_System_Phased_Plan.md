# AFIX Functional System — Phased Workplan & Proposal

**Client / stakeholders:** CPF Githuku & team  
**Product:** AFIX — Private-Sector Trade Receivables / Securitisation Platform  
**IP owner:** **UzimaX**  
**Delivery approach:** Ship as we develop — deploy each phase, gather feedback, tweak, continue  
**Prepared by:** Alfred  
**Date:** 15 July 2026  
**Document:** AFIX-SYS-PLAN-001  
**Replaces:** MVP-only quotation AFIX-POC-Q-001 / AFIX-PROP-Q-002 (MVP-focused)

---

## 1. Why this document exists

You asked for a **functional system**, not a thin MVP:

> *“I want a workplan/proposal to create a functional system — you can propose phases — paying 100k for mvp isn’t worth it — we deploy and tweak as we learn/get client feedback.”*  
> *“Yes — we ship as we develop.”*

This plan covers:

1. Buyer posts invoices / IOUs → system notifies supplier to **opt in / sell** → acceptance generates **assignment of receivables to SPV**  
2. **APIs** for buyers to upload approved / confirmed invoices  
3. **IOU generation** (details finalised with **Sule**)  
4. Statement that **IP ownership belongs to UzimaX**  
5. Alignment with the shared analysis: complete the **securitisation layer** (IOU registry, SPV purchase engine, assignment & escrow, packaging / NSE path)

**Independence:** This is a **restructured, standalone codebase** for UzimaX — not a ProDG template and not a rebrand of another company’s product.

---

## 2. Where we are starting from (honest position)

| Source | What it means for this engagement |
|--------|-----------------------------------|
| Analysis PDF (“~40% delivered”) | Describes **platform rails**: onboarding/KYC, identity/security, invoicing, settlement concepts |
| Your PRD / Mitch materials | Concept and product direction (receivables → SPV → capital markets path) |
| This build | **New presentation + securitisation product layer** under UzimaX: portals, flows, APIs, IOUs, notifications — shipped in phases |

**Already demonstrated / in current React build (foundation):**  
Buyer / Supplier / SPV / Admin portals, light institutional UI (blue–green–white, mobile / glass), invoice lifecycle shell, offer / consent / packaging screens, in-app notifications, mock data for demos.

**Still to complete for a “real” system (this proposal):**  
Buyer-led IOU posting, real notify → opt-in → auto assignment to SPV, formal IOU generation rules (Sule), buyer **APIs**, stronger escrow / purchase pricing, packaging toward listing, deploy-per-phase operations.

---

## 3. Target system (what “done” looks like)

### 3.1 Business flow (must-have)

```
Buyer posts approved invoice / IOU
        ↓
IOU registered in central registry
        ↓
Supplier notified: Opt in / Sell
        ↓
Supplier accepts  →  Assignment of receivable to SPV generated
Supplier declines →  Closed / returned to buyer queue
        ↓
SPV purchase / discount terms applied
        ↓
Escrow-style settlement views: pay supplier · collect from buyer at maturity
        ↓
(Later) Package notes · investor / NSE listing path
```

### 3.2 Securitisation layer (from analysis)

| Capability | Plain language |
|------------|----------------|
| **IOU Registry / Depository** | System of record for every receivable before finance |
| **SPV purchase engine** | One vehicle buys receivables; terms replace bank-by-bank lending |
| **Buyer assignment & consent** | Digital sign-off supporting true sale |
| **Escrow settlement** | Neutral cash legs: fund supplier, collect at maturity |
| **Negotiated discount pricing** | Tenor-based discount (not loan interest UI) |
| **Buyer ERP / API ingestion** | Confirmed invoices flow in from buyer systems |
| **Note packaging & NSE listing** | Bundle receivables for investors (later phase) |

### 3.3 Frontend / UX

- **React** (current stack) — polished, 100% mobile, iPhone-level UX  
- Optional later: Next.js hardening for SEO / SSR if needed — **does not block** phases below  
- Microservice backend from the analysis (Onboarding, Invoices, Programs, Reverse-factoring, Documents, Notifications) can be integrated **service-by-service** as APIs become available; Phase UI can run on a solid API layer + mock bridges until live services land

---

## 4. Phased delivery (“ship as we develop”)

Each phase ends with a **deployable release**, a short demo, and a feedback window before the next phase is locked.

---

### Phase 1 — Buyer → Supplier → SPV core (foundation ship)

**Duration:** 2 weeks  
**Goal:** The live product does your primary process end-to-end.

| Deliverable | Detail |
|-------------|--------|
| Buyer post invoices / IOUs | Form + list; approved/confirmed invoice capture |
| IOU Registry v1 | Unique IOU IDs, status history, search (scheme draft; **Sule review** in week 2) |
| Notify supplier | In-app + email hook ready (email provider config); optional SMS stub |
| Supplier opt in / sell | Accept / decline with reason |
| Auto assignment to SPV | On accept → assignment record + timeline + SPV queue |
| Polished portals | Buyer / Supplier / SPV / Admin — mobile glass UI |
| Deploy Phase 1 | Hosted URL + demo accounts + short user notes |

**Exit criteria:** Stakeholder can walk: *Buyer posts → Supplier notified → Accept → Assignment visible to SPV.*

**Investment Phase 1:** **KES 180,000**  
- Upfront: **KES 90,000**  
- On Phase 1 go-live + acceptance: **KES 90,000**

---

### Phase 2 — APIs, notifications, purchase & escrow

**Duration:** 2–3 weeks (starts after Phase 1 feedback)  
**Goal:** Buyers integrate; system behaves like an **operations platform**.

| Deliverable | Detail |
|-------------|--------|
| Buyer upload APIs | Auth for buyer integration; submit approved invoice; get status; list IOUs |
| API docs + sample client | Postman / OpenAPI + example calls |
| Notifications pack | Email + in-app (SMS optional add-on if you provide gateway) |
| SPV purchase engine v1 | Tenor-based discount calculator; offer → accept linkage to assignment |
| Buyer assignment & consent | Full consent inbox + signed assignment trail |
| Escrow settlement views | Trust/disbursement/collection screens (ledger mock → live later) |
| Audit log | Who did what, when (exportable) |
| Deploy Phase 2 | Production API base URL + portal updates |

**Exit criteria:** A buyer system (or Postman) can **POST** a confirmed invoice; supplier is notified; assignment + escrow views work in portal.

**Investment Phase 2:** **KES 220,000**  
- Upfront: **KES 110,000**  
- On Phase 2 go-live + acceptance: **KES 110,000**

---

### Phase 3 — Packaging, programs, capital-market readiness

**Duration:** 2–3 weeks  
**Goal:** Product moves toward **securitisation / listing readiness**.

| Deliverable | Detail |
|-------------|--------|
| Programs & limits | Buyer/supplier program limits and pricing bands |
| Note packaging | Bundle assigned receivables into packages |
| Investor / listing views | NSE / USP-style listing workflow (process UI; exchange onboarding is external) |
| Reconciliation & settlement reports | Period match, variance flags |
| Hardening | Roles, multi-tenant isolation checks, performance, security pass |
| Deploy Phase 3 | Full stack handover package for UzimaX |

**Exit criteria:** Package created from assigned pool; report exported; Admin can show full trail to a non-technical board.

**Investment Phase 3:** **KES 200,000**  
- Upfront: **KES 100,000**  
- On Phase 3 go-live + acceptance: **KES 100,000**

---

## 5. Total investment summary

| Phase | Focus | Timeline | Fee (KES) |
|-------|--------|----------|-----------|
| **1** | Buyer IOU → notify → opt-in → assign SPV + registry v1 | ~2 weeks | **180,000** |
| **2** | Buyer APIs + notifications + purchase + escrow | ~2–3 weeks | **220,000** |
| **3** | Packaging / programs / capital-market readiness | ~2–3 weeks | **200,000** |
| | **Full functional system (Phases 1–3)** | **~6–8 weeks** | **600,000** |

**Payment rhythm (all phases):** 50% to start the phase · 50% on phase acceptance & deploy.

### Optional add-ons (quote separately)

| Item | Indicative (KES) |
|------|------------------|
| Live SMS gateway (Africa’s Talking / similar) | 25,000–40,000 + sms costs |
| Keycloak / OAuth production identity wiring | 60,000–90,000 |
| Next.js migration (if required later) | 80,000–120,000 |
| Dedicated support retainer (monthly after Phase 3) | 40,000–60,000 / month |

---

## 6. Ship-as-we-develop operating rules

1. **Start Phase 1** on agreement + Phase 1 upfront.  
2. **Deploy weekly** inside each phase where useful (staging URL).  
3. **Feedback meeting** at end of each phase (max 3 working days tweak buffer included in phase fee).  
4. Scope changes mid-phase are logged; small tweaks free; new features → change order or next phase.  
5. **Sule consultation** on IOU format scheduled in Phase 1 Week 2; blocking legal wording from counsel is out of build fee.  
6. You may **pause after any phase** — you keep that phase’s code & deploy under UzimaX IP (subject to payment for work done).

---

## 7. Intellectual property — UzimaX

**All intellectual property** in software, UI, documentation, and configurations produced under this engagement for AFIX **belongs to UzimaX** upon payment for the corresponding phase(s).

- Source code repositories will be delivered to accounts designated by UzimaX.  
- No ProDG or third-party ownership claims over this deliverable.  
- Portfolio use requires UzimaX written consent.

---

## 8. Dependencies (what we need from you)

| Need | Why |
|------|-----|
| Confirmation of **Phase 1** start | Unlock calendar |
| Access / intro to **Sule** for IOU rules | Correct IOU generation |
| Logo, legal entity names, SPV name | Branding & assignment docs |
| Preferred hosting (Render / Vercel / other) | Deploy target |
| Buyer sample invoice JSON (for Phase 2) | API shape |
| Email/SMS credentials (Phase 2) | Real notifications |

---

## 9. What is out of scope (unless added)

- Licensing / listing fees with NSE or investors  
- Formal legal opinions and executed trust deeds (platform supports process)  
- Core banking / live bank rails (we show escrow UX; bank integration is a project of its own)  
- Rebuilding StreadTech / third-party microservices that you do not control — we **consume APIs** where you provide them  

---

## 10. Recommended path (simple)

1. Approve **Phase 1** (KES 180,000 — 50/50) and we start **this week**.  
2. Review Phase 1 live → decide Phase 2 (APIs + ops) immediately — this answers “paying for a real system.”  
3. Phase 3 when packaging / NSE path is needed by the capital team.  

This matches: **functional system**, **phased**, **ship as we develop**, **not a 100k throwaway MVP**.

---

## 11. Acceptance

| | |
|--|--|
| **Client lead** | _______________________________ |
| **On behalf of** | **UzimaX** |
| **Approved start** | ☐ Phase 1 only · ☐ Phases 1–2 · ☐ Full 1–3 |
| **Signature** | _______________________________ |
| **Date** | _______________________________ |

| | |
|--|--|
| **Prepared by** | Alfred |
| **Date** | 15 July 2026 |

---

## Appendix A — Mapping your four requirements

| # | Your requirement | Phase |
|---|------------------|--------|
| 1 | Buyer post IOU → notify supplier → opt-in → assignment to SPV | **Phase 1** |
| 2 | APIs for buyers to upload approved invoices | **Phase 2** |
| 3 | IOU generation — consult Sule | **Phase 1** (rules) + refine |
| 4 | IP ownership → UzimaX | **All phases** (contractual) |

## Appendix B — Mapping analysis “to build” list

| Analysis item | Phase |
|---------------|--------|
| IOU Registry | 1 |
| SPV purchase engine | 2 |
| Assignment & consent | 1–2 |
| Escrow settlement | 2 |
| Negotiated discount pricing | 2 |
| Buyer ERP / API ingestion | 2 |
| Packaging & NSE listing | 3 |

---

*Convert this file to PDF (Pandoc or Print → Save as PDF) and share as **AFIX Functional System — Phased Workplan (AFIX-SYS-PLAN-001)**.*
