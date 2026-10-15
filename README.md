# WizerWaste — Hyperlocal Surplus Food Rescue & Redistribution

> A functional web application connecting surplus food generators (restaurants, hotels, bakeries, corporate cafeterias, and supermarkets) with community recipient agencies (food banks, emergency shelters, soup kitchens, and youth pantries) and volunteer food-runner couriers.

---

## 1. Project Overview & Prototype Scope

**Challenge Context**: 90-Minute Prototyping Challenge.  
**Focus**: Robust, demonstrable application foundation with complete role-based segregation, transparent prioritization, and workflow execution.

### Frozen Product Modules & Current Status:

| Module | Scope / Functionality | Implementation Status |
| :--- | :--- | :--- |
| **01. Single Login Interface** | Single unified login screen with 1-click role selection for prototype evaluation | **Implemented (Foundation)** |
| **02. Five Role Dashboards** | Super Admin, Federation Admin, Donor, NGO/Recipient, Volunteer | **Implemented (Foundation)** |
| **03. Donor Profiles & Rating** | Verification status badge, community ratings, donation history & metrics | **Implemented** |
| **04. Surplus Creation & Tracking** | Broadcast food surplus, workflow tracking (Available → Claimed → Picked Up → Delivered) | **Implemented** |
| **05. Wizer RescueScore Engine** | Rule-based algorithm factoring in expiry urgency, distance, quantity & storage type | **Implemented** |
| **06. Interactive Rescue Map** | Simulated distance and multi-hub routing calculations | **Implemented** |
| **07. Donor-Recipient Chat** | Handover coordination messaging & logistics dispatch notes | **Preview / Handover Notes** |
| **08. Federation Announcements** | Chapter announcements, weather advisories & cold-chain notices | **Implemented (Fed Admin)** |
| **09. Scoped Admin Dashboards** | Super Admin (global governance) & Federation Admin (chapter review) | **Implemented** |
| **10. Structured Security Audit Logs** | Event recording, verification audits, role checks | **Implemented (Super Admin)** |
| **11. Expense Ledger (Non-Custodial)**| Food prep cost basis and packaging tracking without holding money | **Implemented (Donor)** |
| **12. Impact & Food Safety Dashboard**| UNEP/FAO emissions & water metrics, food safety holding guidelines | **Implemented** |
| **13. Customer Support Center**      | Multi-role ticketing, chat history, federation scoping, & audit logs | **Implemented** |

---

## 2. Five Role Dashboards & Perspectives

1. **Super Admin (`super_admin`)**:
   - Platform health metrics (Total federations, accredited donors, registered NGOs, active couriers).
   - Structured security audit log preview (e.g. `DONOR_ACCREDITATION_APPROVED`, `ROLE_PERMISSION_CHECK`, `SUPPORT_TICKET_STAFF_RESPONSE`).
   - Regional federation chapter directory.
   - Global Customer Support Center access with multi-chapter filtering.

2. **Federation Admin (`federation_admin`)**:
   - Regional chapter operations (e.g. Metro Bay Food Rescue Federation).
   - Scoped Customer Support Desk: view and respond to tickets strictly within authorized federation region.
   - Donor verification queue: inspect commercial kitchen permits and approve accreditations.
   - Chapter announcements and cold-chain safety bulletins.

3. **Food Donor (`donor`)**:
   - Establishment profile: Grand Harbor Hotel & Catering (`Verified Commercial Kitchen`).
   - Community trust rating: $4.9 / 5.0$ based on verified rescue drop-offs.
   - Surplus food broadcast shortcut (`+ Broadcast Food Surplus`).
   - Customer support ticket creation and operational assistance thread.
   - Donation-related non-custodial expense ledger tracking (wholesale cost basis & packaging deductions).

4. **NGO / Recipient (`ngo_recipient`)**:
   - Community dining room capacity tracker (e.g. $180 / 250$ dinner portions prepared).
   - Priority surplus food discovery with the **Wizer RescueScore**.
   - Incoming claimed dispatches & volunteer courier transit tracking.
   - Direct support inquiries for dock gate delays or recipient assistance.

5. **Volunteer Runner (`volunteer`)**:
   - Courier status toggle (`On Duty (Ready for Dispatch)` vs `Off Duty`).
   - Active dispatch task queue with origin/destination waypoints.
   - Food safety temperature standards checklist (Hot Holding $>60^\circ$C, Chilled $2\text{--}4^\circ$C).
   - Verified delivery hours and weight handled.
   - On-duty courier support ticket submission.

---

## 3. Customer Support Center & Incident Desk

The platform includes a dedicated, responsive Customer Support Center accessible across all user roles:

- **Universal Navigation**: Visible `Help & Support` tab in the global navbar and direct shortcuts on every role dashboard.
- **Incident & Inquiry Categories**:
  - `Food Safety` (temperature / holding compliance / labeling)
  - `Suspicious User` (unverified vehicle / bad-faith claims)
  - `Pickup Issue` (locked dock gate / no-show / delay)
  - `Account Verification` (permit renewals / certifications)
  - `Expense Issue` (packaging costs / donation deductions)
  - `Other` (general operational inquiries)
- **Priority Urgency**: `Normal`, `High`, and `Urgent` with visual indicators.
- **Ticket Workflow**: `Open` → `In Progress` → `Resolved` with resolution timestamps and assigned administrator tags.
- **Support Chat Interface**: Message history with timestamps, sender role tags, and distinctive staff dispatch badges.
- **Administrative Access Control & Scoping**:
  - **Super Admin**: Global access across all regional chapters with status, category, and federation filters.
  - **Federation Admin**: Strict regional scoping (access restricted to authorized chapter tickets).
  - **Donors, NGOs, and Volunteers**: View and manage their own inquiries and responses.
- **Structured Audit Trail**: All ticket creations, staff responses, and status changes are permanently recorded in the platform's security audit log.
- **Separation of Concerns**: Critical health hazards are segregated into an Emergency Safety notice directing to municipal emergency response (911).

---

## 4. Technology Stack & Design System

- **Framework**: React 19 (TypeScript)
- **Visual Identity**: Warm, clean operations aesthetic with off-white background (`#FBFBFA`), white card surfaces, deep forest green primary actions (`bg-emerald-800`), restrained orange for urgency, and subtle neutral borders (`border-stone-200`).
- **Typography**: Plus Jakarta Sans (clean, highly readable display and body sans-serif) + tabular figures (`tabular-nums`) strictly reserved for numbers and countdown timers.
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` with initial demonstration dataset and user data isolation
- **Build Tool**: Vite 8

---

## 5. Setup & Running Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd wizerwaste

# Install dependencies
npm install

# Start local development server on port 3000
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 6. Prototype Limitations & Boundaries

- **Simulated Role Authentication**: Authentication is simulated client-side for role evaluation. In a production environment, this would connect to an identity provider (e.g., Firebase Authentication or OAuth 2.0).
- **Simulated Customer Support Chat**: Chat and support tickets are persisted locally in browser `localStorage` for workflow demonstration and are not connected to live 24/7 human dispatchers or external call centers.
- **Simulated Geolocation & Distance**: Distance calculations use the Haversine formula based on metropolitan coordinate points relative to preset NGO hubs. Real deployments would integrate with the Google Maps Distance Matrix API.
- **Local Persistence**: State persists across browser refreshes via `localStorage`. Multi-user real-time synchronization requires a backend database.
- **Non-Custodial Coordination**: The donation expense ledger is informational and non-custodial; WizerWaste does not process payments or escrow funds.
