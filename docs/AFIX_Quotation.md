# Proposal — AFIX Trade Receivables Platform

**Prepared for:** CPF / Client stakeholders  
**IP owner:** **UzimaX**  
**Product:** AFIX (private-sector trade receivables)  
**Date:** 15 July 2026  
**Reference:** AFIX-PROP-Q-002  
**Status:** Updated after client feedback (buyer IOU flow, APIs, IP)

---

## 1. Purpose of this proposal

This proposal describes what will be built for **AFIX**, aligned to your MVP analysis and the additional requirements you shared:

1. Buyer process to **post invoices / IOUs** → system **notifies the supplier** to **opt in / sell** → on acceptance, generate **assignment of receivables to the SPV**  
2. **APIs** so buyers can upload **approved / confirmed** invoices  
3. **IOU generation** (detail to be confirmed with **Sule**)  
4. Clear statement that **intellectual property belongs to UzimaX**

The UI will be an independent AFIX design (blue / green / white, mobile-first). This is **not** a ProDG product or template — it is a restructured build for your use under **UzimaX** ownership.

---

## 2. What AFIX does (in plain language)

AFIX connects three parties around unpaid invoices (receivables):

| Party | Role |
|--------|------|
| **Buyer** | Posts approved invoices / IOUs that they confirm are owed |
| **Supplier** | Receives notification and chooses to **opt in / sell** the receivable |
| **SPV** | Receives **assignment** of the receivable after supplier acceptance |
| **Admin** | Oversees users, pipeline, and activity |

Goal: turn confirmed buyer payables into a clear, trackable path from **post → notify → opt-in → assign to SPV**.

---

## 3. Required flow (your point 1) — included in delivery

### Buyer-led posting

1. **Buyer posts** an approved/confirmed invoice or IOU (amount, supplier, due date, reference).  
2. Platform creates / links an **IOU registry** record.  
3. **Supplier is notified** (in-app; email/SMS can follow later) to **opt in / sell**.  
4. Supplier **accepts or declines**.  
5. On **accept**, the system generates an **assignment of the receivable to the SPV** (assignment record + status on the timeline).  
6. Buyer / SPV can see assignment status; Admin can audit the trail.

This is the **primary MVP workflow** (buyer-originated), in addition to the earlier supplier-list path where useful for demos.

---

## 4. IOU generation (your point 3)

- Platform will support **IOU creation and registry IDs** as part of buyer posting and lifecycle views.  
- Detailed IOU format / numbering rules will be **confirmed with Sule** before final refine (you noted: *consult Sule*).  
- Until then, a clear **demo IOU scheme** will be used, then adjusted to Sule’s guidance in the refine window.

---

## 5. APIs for buyer invoice upload (your point 2)

You asked for **APIs** so buyers can upload approved/confirmed invoices from their own systems.

| Item | Recommendation |
|------|----------------|
| **MVP (walkthrough demo)** | Portal upload / “post invoice” in the Buyer app — fully usable without external systems |
| **API pack (optional add-on)** | REST endpoints for: authenticate buyer integration, submit confirmed invoice, check status, webhook/event for “supplier notified / opted in / assigned” |

APIs, live external notifications (SMS/email), and production integrations move beyond a simple UI MVP toward a **connected system**. They are **doable** and priced separately below so we can discuss scope.

---

## 6. What you will see in the product (portals)

| Portal | Capabilities (MVP) |
|--------|---------------------|
| **Buyer** | Post invoice/IOU, see status, consent/assignment views, payment schedule |
| **Supplier** | Notification to opt in/sell, accept/decline, track assigned receivables |
| **SPV** | See assigned receivables, offers/packaging engine (as applicable) |
| **Admin** | Pipeline, users/orgs, activity |

**Look & feel:** blue, green, white; glass-style modern UI; **mobile / iPhone-ready**.

---

## 7. Scope options & investment (for discussion)

### Option A — Core MVP (recommended start)

Includes portals, buyer post → notify supplier → opt-in → assignment to SPV, IOU registry (Sule refine), polish, 5-day delivery.

| Item | Amount (KES) |
|------|----------------|
| **Total** | **95,000** |
| **Upfront** | **55,000** |
| **On completion** | **40,000** |

| Phase | Days |
|-------|------|
| Build | 3 |
| Refine with your comments (+ Sule IOU notes) | 2 |
| **Total** | **5 working days** |

### Option B — API pack (add-on)

Buyer APIs for upload of approved/confirmed invoices + status checks + documented example.

| Item | Amount (KES) |
|------|----------------|
| **API pack (indicative)** | **45,000** |
| Timeline | **+3–4 working days** after MVP (or parallel if agreed) |

### Option C — Full connected package (MVP + API)

| Item | Amount (KES) |
|------|----------------|
| **Combined (indicative)** | **140,000** |
| Payment split (example) | 80,000 upfront / 60,000 on completion |

*Final API pricing confirmed after a short technical call (auth method, buyer systems, hosting).*

---

## 8. Intellectual property (your point 4)

**All intellectual property in the AFIX software deliverable produced under this engagement shall belong to UzimaX**, including source code, designs, and related materials created for this client, upon full payment as agreed.

The supplier retains no ownership claim over the work product, except the right to show anonymised portfolio screenshots only if UzimaX agrees in writing.

---

## 9. Included / not included

**Included in Option A**

- Buyer post invoice/IOU → supplier notification (in-app) → opt-in/sell → assignment to SPV  
- Supplier, Buyer, SPV, Admin portals (polished UI)  
- IOU registry UI (Sule confirmation during refine)  
- Demo environment and basic usage notes  
- Handover of the working application to UzimaX  

**Not included in Option A** (available in Option B / later)

- Production buyer **APIs** (see Option B)  
- Live SMS / email gateways (can be added later)  
- Bank / payment rails  
- Formal legal deed drafting by counsel (platform supports process; lawyers finalise documents)  

---

## 10. How we proceed

1. Confirm which option: **A**, **A+B**, or **C**.  
2. Confirm IOU rules with **Sule** (or assign a placeholder scheme for week one).  
3. Upfront payment as agreed.  
4. Build + refine on the agreed timeline.  
5. Balance on completion; IP statement to UzimaX as above.

---

## Acceptance

| | |
|--|--|
| **Client / stakeholder** | _______________________________ |
| **On behalf of** | **UzimaX** |
| **Selected option** | ☐ A · ☐ A+B · ☐ C |
| **Signature** | _______________________________ |
| **Date** | _______________________________ |

| | |
|--|--|
| **Prepared by** | Alfred (delivery) |
| **Date** | 15 July 2026 |

---

*This proposal is written for non-technical stakeholders. A short technical appendix (API shapes, IOU fields) can be attached after discussion with Sule and your systems team.*
