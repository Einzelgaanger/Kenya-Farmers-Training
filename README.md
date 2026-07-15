# Kenya Farmers Training — Trade Receivables Platform (AFIX)

**Single integrated repository** for the private-sector trade receivables platform.

Connects **Suppliers**, **Buyers**, **SPV**, and **Admin** — invoice listing, verification, purchase offers, buyer consent, packaging, and settlement.

Built as a polished AFIX-style product, incorporating selected workflow patterns from a prior government receivables system (adapted for private sector). Theme: **blue / green / white**.

---

## Repository

**https://github.com/Einzelgaanger/Kenya-Farmers-Training**

This is the only active project repo for this build. Do not push client work to other remotes.

---

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## Demo accounts

Password for all: **`AFIX2026!`**

| Role     | Email               |
|----------|---------------------|
| Supplier | supplier@afix.co.ke |
| Buyer    | buyer@afix.co.ke    |
| SPV      | spv@afix.co.ke      |
| Admin    | admin@afix.co.ke    |

## Features

- **Supplier** — list invoices, attach documents, review offers, track lifecycle
- **Buyer** — verify register, sign assignment consent, payment schedule
- **SPV** — IOU registry, offer calculator, packaging, assignments, backend engine
- **Admin** — pipeline, users & orgs, workflow monitor, analytics

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Recharts · mock data (no backend required)

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Development server       |
| `npm run build` | Production build         |
| `npm start`     | Serve production `dist/` |
| `npm run preview` | Preview production build |

---

© 2026 · Client delivery build
