# ============================================================================
# FILE NAME      : Frontend_01_Authentication_UI_Foundation.md
# PROJECT        : DoSJE Welfare Monitoring & Compliance Platform
# PROBLEM STATEMENT : SIH 2026 - PS095
# MODULE         : Frontend Module 1 – Authentication, Landing Page & UI Foundation
# VERSION        : 1.0.0
# STATUS         : COMPLETED & PRODUCTION-READY
# ============================================================================

## 1. Overview
This module establishes the enterprise frontend foundation for the **DoSJE Welfare Monitoring & Compliance Platform** under the **Department of Social Justice & Empowerment (DoSJE), Government of India**.

---

## 2. Tech Stack & Enterprise Design System
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom Government Enterprise Color Tokens
- **Icons**: Lucide React (`lucide-react`)
- **Forms & Validation**: React Hook Form with Zod (`@hookform/resolvers/zod`, `zod`)
- **State Management**: React Context API (`AuthContext`, `ThemeContext`, `ToastContext`)
- **Persistence**: `localStorage` (theme preferences, session tokens)
- **Design Inspiration**: DigiLocker, UMANG, Microsoft Admin Center, Azure Portal

---

## 3. Official Demo Credentials & Roles

| Role | Official Email | Password | Assigned Route | Scope / Jurisdiction |
| :--- | :--- | :--- | :--- | :--- |
| **DoSJE Central Admin** | `dosje.admin@demo.gov` | `Demo@123` | [`/admin`](file:///c:/DLCO/dosje-platform/src/app/admin/page.tsx) | National Level (All States & UTs) |
| **State Authority** | `state.authority@demo.gov` | `Demo@123` | [`/authority`](file:///c:/DLCO/dosje-platform/src/app/authority/page.tsx) | State Level (Maharashtra & Regional) |
| **NGO Administrator** | `ngo.admin@demo.org` | `Demo@123` | [`/ngo`](file:///c:/DLCO/dosje-platform/src/app/ngo/page.tsx) | Operational Units (5 Districts) |
| **Field Centre Staff** | `staff@demo.org` | `Demo@123` | [`/staff`](file:///c:/DLCO/dosje-platform/src/app/staff/page.tsx) | Field Facility #104 |
| **Welfare Beneficiary**| `beneficiary@demo.org`| `Demo@123` | [`/beneficiary`](file:///c:/DLCO/dosje-platform/src/app/beneficiary/page.tsx) | District Resident, Pune |
| **PMU Field Inspector**| `pmu.inspector@demo.gov`| `Demo@123`| [`/pmu`](file:///c:/DLCO/dosje-platform/src/app/pmu/page.tsx) | Western Zonal Audit Zone |

*Note: The Login page includes an interactive **Demo Login Panel** with 1-click auto-fill and instant sign-in for all 6 accounts.*

---

## 4. Key Pages & Routes Implemented

1. **Landing Page ([`/`](file:///c:/DLCO/dosje-platform/src/app/page.tsx))**:
   - **National Header**: Tricolor bar, Government of India notice, language selector, helpline `1800-11-2001`.
   - **Hero Section**: AI monitoring highlights, active scheme badges (PM-AJAY, SMILE, NAPSrC, Divyangjan Aid, NMBA), interactive government digital dashboard telemetry preview.
   - **Features Section**: 10 enterprise feature cards with custom icons, badges, and hover animations.
   - **Benefits Section**: 6 quantifiable benefit cards with metrics and SOP compliance tags.
   - **Statistics Section**: 6 animated counter cards (Projects, Beneficiaries, NGOs, States, Inspections, Risk Alerts).
   - **About Section**: DoSJE statutory mandate and 4-tier inspection governance architecture.
   - **Contact Section**: Departmental nodal directory and grievance escalation form.
   - **Footer**: CERT-In security note, links, privacy/terms modals, NIC attribution.

2. **Authentication ([`/login`](file:///c:/DLCO/dosje-platform/src/app/login/page.tsx))**:
   - Enterprise split layout (branding & security benefits on the left, login card on the right).
   - Zod-validated official email & password inputs with visibility toggle.
   - Remember Me session persistence.
   - 1-Click Auto Fill Demo Accounts Panel.
   - Route redirection to the role-specific workspace upon successful authentication.

3. **Password Recovery ([`/forgot-password`](file:///c:/DLCO/dosje-platform/src/app/forgot-password/page.tsx))**:
   - Clean, accessible recovery flow with input validation, loading state, and dispatch confirmation.

4. **Security & Route Guards**:
   - [`/unauthorized`](file:///c:/DLCO/dosje-platform/src/app/unauthorized/page.tsx): 403 Forbidden page for role-access violations.
   - `404 Not Found`: [`src/app/not-found.tsx`](file:///c:/DLCO/dosje-platform/src/app/not-found.tsx) government error view.
   - [`ProtectedRoute`](file:///c:/DLCO/dosje-platform/src/components/auth/ProtectedRoute.tsx): Wraps future dashboard modules and enforces authorization.

5. **Role Workspace Landings**:
   - [`/admin`](file:///c:/DLCO/dosje-platform/src/app/admin/page.tsx) -> Module 2 Ready
   - [`/authority`](file:///c:/DLCO/dosje-platform/src/app/authority/page.tsx) -> Module 3 Ready
   - [`/ngo`](file:///c:/DLCO/dosje-platform/src/app/ngo/page.tsx) -> Module 4 Ready
   - [`/staff`](file:///c:/DLCO/dosje-platform/src/app/staff/page.tsx) -> Module 4 Ready
   - [`/beneficiary`](file:///c:/DLCO/dosje-platform/src/app/beneficiary/page.tsx) -> Module 4 Ready
   - [`/pmu`](file:///c:/DLCO/dosje-platform/src/app/pmu/page.tsx) -> Module 5 Ready

---

## 5. Reusable UI Components Directory (`src/components/ui/`)
- [`Button.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Button.tsx): Primary, secondary, outline, ghost, danger, success, and link variants with loading spinners.
- [`Input.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Input.tsx): Labeled input with icon slots, error states, and ARIA attributes.
- [`PasswordInput.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/PasswordInput.tsx): Password input with show/hide toggle and lock icon.
- [`Checkbox.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Checkbox.tsx): Custom accessible checkbox with check indicator.
- [`Badge.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Badge.tsx): Government status badge with dot indicator support.
- [`Alert.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Alert.tsx): Informational, success, warning, and error status alert boxes.
- [`Card.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Card.tsx): Header, Title, Description, Content, and Footer card primitives.
- [`Modal.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Modal.tsx): Accessible dialog with backdrop and escape key dismissal.
- [`Loader.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Loader.tsx): Inline, full-screen, page, and auth loader states.
- [`Skeleton.tsx`](file:///c:/DLCO/dosje-platform/src/components/ui/Skeleton.tsx): Animated pulse skeletons for content loading.

---

## 6. Development Instructions
```bash
cd dosje-platform
npm run dev
# Visit http://localhost:3000
```
